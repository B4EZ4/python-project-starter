import { QrCode } from 'lucide-react';

export function Header() {
  return (
    <header className="text-center py-8">
      <h1 className="text-4xl md:text-5xl font-bold text-primary flex items-center justify-center gap-3">
        <QrCode className="w-10 h-10 md:w-12 md:h-12" />
        Generador QR
      </h1>
      <p className="text-muted-foreground mt-2 text-lg">
        Crea códigos QR personalizados de forma rápida y gratuita
      </p>
    </header>
  );
}
