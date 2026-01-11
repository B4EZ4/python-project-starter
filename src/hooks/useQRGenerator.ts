import { useState, useCallback } from 'react';
import type { QRResponse, QRError } from '@/types/qr';

interface UseQRGeneratorReturn {
  isLoading: boolean;
  error: string | null;
  qrResult: QRResponse | null;
  generateQR: (texto: string, tipo: number, nombre: string) => Promise<void>;
  clearResult: () => void;
  generatedCount: number;
}

export function useQRGenerator(): UseQRGeneratorReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrResult, setQrResult] = useState<QRResponse | null>(null);
  const [generatedCount, setGeneratedCount] = useState(0);

  const generateQR = useCallback(async (texto: string, tipo: number, nombre: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('/crear_qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texto,
          tipo,
          nombre: nombre || 'qr_default',
        }),
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
