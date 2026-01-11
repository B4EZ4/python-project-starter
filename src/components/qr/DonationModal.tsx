import { Heart, Check, X, Rocket } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-secondary rounded-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <Heart className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold">¡Tu apoyo hace magia!</h2>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-muted-foreground">
            ¿Sabías que con tu donación puedes ayudar a mantener este proyecto en funcionamiento?
            Cada contribución nos permite:
          </p>
          <ul className="space-y-2">
            {[
              'Mantener el servicio gratuito para todos',
              'Desarrollar nuevas funcionalidades',
              'Mejorar el rendimiento y seguridad',
              'Ofrecer soporte y actualizaciones',
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-center font-semibold">¡Tu apoyo marca la diferencia!</p>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="https://www.paypal.me/AntonioBaeza0"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg text-center transition-all hover:-translate-y-0.5"
          >
            <i className="fab fa-paypal mr-2"></i> Donar con PayPal
          </a>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-foreground rounded-lg transition-all"
          >
            Quizás más tarde
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <Rocket className="w-4 h-4" />
            Cada código QR generado es una pequeña parte del futuro! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
