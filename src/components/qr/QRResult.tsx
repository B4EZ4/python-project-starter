import { useState } from 'react';
import type { QRResponse } from '@/types/qr';
import { Download, Copy, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface QRResultProps {
  result: QRResponse | null;
  isLoading: boolean;
  error: string | null;
}

export function QRResult({ result, isLoading, error }: QRResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result?.image_base64) return;

    try {
      const response = await fetch(result.image_base64);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      setCopied(true);
      toast.success('✅ Imagen copiada al portapapeles!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('❌ No se pudo copiar la imagen');
    }
  };

  if (isLoading) {
    return (
      <div className="mt-6 p-6 bg-white/10 rounded-lg text-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Generando QR...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 p-6 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
        <p className="text-red-400">❌ {error}</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="mt-6 p-6 bg-white/10 rounded-lg text-center">
      <div className="space-y-4">
        <img
          src={result.image_base64}
          alt="Código QR generado"
          className="max-w-full h-auto mx-auto border border-white/20 rounded-lg"
        />

        <div className="text-sm space-y-1">
          <p>
            <strong>Archivo:</strong> {result.filename}
          </p>
          <p>
            <strong>Tamaño QR:</strong> {result.qr_size}
          </p>
          <p className="text-green-400">✓ Generado exitosamente</p>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <a
            href={result.image_base64}
            download={result.filename}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-primary/80 text-white rounded-lg transition-all hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            Descargar QR
          </a>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-primary/80 text-white rounded-lg transition-all hover:-translate-y-0.5"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado!' : 'Copiar Imagen'}
          </button>
        </div>
      </div>
    </div>
  );
}
