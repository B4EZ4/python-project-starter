import { Heart } from 'lucide-react';

interface FooterProps {
  onShowDonation: () => void;
}

export function Footer({ onShowDonation }: FooterProps) {
  return (
    <footer className="bg-black/30 text-white mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto p-8">
        <div>
          <h4 className="font-semibold mb-3">Generador QR</h4>
          <p className="text-muted-foreground text-sm">
            Herramienta gratuita para crear códigos QR personalizados al instante.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Enlaces Rápidos</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#limitations" className="text-muted-foreground hover:text-primary transition-colors">
                Información Técnica
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Anton-Bazh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                GitHub
              </a>
            </li>
            <li>
              <button
                onClick={onShowDonation}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Apoyar el Proyecto
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacidad
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Términos de Uso
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-muted-foreground">
        <p>
          © 2024 Generador de Códigos QR. Todos los derechos reservados. | Creado con{' '}
          <Heart className="w-4 h-4 inline text-red-400" /> por Anton-Bazh
        </p>
      </div>
    </footer>
  );
}
