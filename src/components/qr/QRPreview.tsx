import { QR_STYLES } from '@/types/qr';
import { Eye } from 'lucide-react';

interface QRPreviewProps {
  selectedStyle: number;
}

export function QRPreview({ selectedStyle }: QRPreviewProps) {
  const style = QR_STYLES.find((s) => s.id === selectedStyle) || QR_STYLES[5];

  return (
    <section className="bg-gradient-to-br from-secondary to-slate-600 p-6 rounded-xl w-full max-w-md shadow-lg transition-transform hover:-translate-y-1">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-muted flex items-center justify-center gap-2">
          <Eye className="w-6 h-6" /> Vista Previa del Estilo
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Visualiza cómo se verá tu código QR con el estilo seleccionado
        </p>
      </div>

      <div className="mt-4 p-4 bg-white/10 rounded-xl shadow-lg">
        <img
          src={style.image}
          alt={`Vista previa del estilo ${style.name}`}
          className="w-full max-w-[250px] mx-auto rounded-lg"
        />
        <p className="text-center mt-4 text-muted-foreground italic">
          Estilo seleccionado: {style.emoji} {style.name}
        </p>
      </div>
    </section>
  );
}
