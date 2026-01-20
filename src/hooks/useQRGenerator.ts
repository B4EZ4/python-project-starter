import { useState, useCallback } from 'react';
import type { QRResponse, QRError, QRConfig } from '@/types/qr';

interface UseQRGeneratorReturn {
  isLoading: boolean;
  error: string | null;
  qrResult: QRResponse | null;
  generateQR: (config: QRConfig) => Promise<void>;
  clearResult: () => void;
  generatedCount: number;
}

export function useQRGenerator(): UseQRGeneratorReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrResult, setQrResult] = useState<QRResponse | null>(null);
  const [generatedCount, setGeneratedCount] = useState(0);

  const generateQR = useCallback(async (config: QRConfig) => {
    setIsLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      // Transform config to API format
      const requestBody = {
        texto: config.texto,
        tipo: config.tipo,
        nombre: config.nombre || 'qr_default',
        qr_color: config.qrColor,
        background_color: config.backgroundColor,
        frame: config.frame.enabled
          ? {
              enabled: true,
              color: config.frame.color,
              text: config.frame.text,
              text_color: config.frame.textColor,
            }
          : { enabled: false },
        logo: config.logo.enabled
          ? {
              enabled: true,
              preset: config.logo.preset,
              custom_url: config.logo.customUrl,
            }
          : { enabled: false },
        corners: {
          top_left: {
            style: config.corners.topLeft.style,
            color: config.corners.topLeft.useQRColor ? config.qrColor : config.corners.topLeft.color,
          },
          top_right: {
            style: config.corners.topRight.style,
            color: config.corners.topRight.useQRColor ? config.qrColor : config.corners.topRight.color,
          },
          bottom_left: {
            style: config.corners.bottomLeft.style,
            color: config.corners.bottomLeft.useQRColor ? config.qrColor : config.corners.bottomLeft.color,
          },
          bottom_right: {
            style: config.corners.bottomRight.style,
            color: config.corners.bottomRight.useQRColor ? config.qrColor : config.corners.bottomRight.color,
          },
        },
      };

      const response = await fetch('/api/crear_qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as QRError).error || 'Error del servidor');
      }

      if (data.success) {
        setQrResult(data as QRResponse);
        setGeneratedCount((prev) => prev + 1);
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('La solicitud tardó demasiado tiempo. Intenta nuevamente.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Error de conexión');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setQrResult(null);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    qrResult,
    generateQR,
    clearResult,
    generatedCount,
  };
}
