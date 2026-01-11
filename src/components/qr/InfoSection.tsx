import { User, Heart, Shield } from 'lucide-react';

export function InfoSection() {
  return (
    <section className="p-6 my-8 rounded-xl bg-white/5 shadow-lg max-w-5xl mx-auto">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5" /> Sobre el Proyecto
        </h3>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <p>
              <strong>Creado por:</strong>{' '}
              <span className="text-primary font-semibold">Anton-Bazh & DeltaDev</span>
            </p>
            <p>
              <strong>Versión:</strong> <span className="text-primary font-semibold">2.1.0</span>
            </p>
            <p>
              <strong>Última actualización:</strong>{' '}
              <span className="text-primary font-semibold">2025</span>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <a
              href="https://github.com/Anton-Bazh"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-white/10 rounded-lg text-foreground hover:bg-primary hover:text-white transition-all"
            >
              <i className="fab fa-github mr-2"></i> GitHub
            </a>
            <a
              href="https://www.instagram.com/baeza.doc/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-white/10 rounded-lg text-foreground hover:bg-primary hover:text-white transition-all"
            >
              <i className="fab fa-instagram mr-2"></i> Instagram
            </a>
            <a
              href="https://www.linkedin.com/in/antoniobaezat"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-white/10 rounded-lg text-foreground hover:bg-primary hover:text-white transition-all"
            >
              <i className="fab fa-linkedin mr-2"></i> LinkedIn
            </a>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary text-center mb-6">
          <h4 className="font-semibold flex items-center justify-center gap-2 mb-2">
            <Heart className="w-4 h-4" /> Apoya el Proyecto
          </h4>
          <p className="text-muted-foreground mb-3">
            Si este generador QR te ha sido útil, considera apoyar su desarrollo continuo.
          </p>
          <a
            href="https://www.paypal.me/AntonioBaeza0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg transition-all hover:-translate-y-0.5"
          >
            <i className="fab fa-paypal mr-2"></i> Hacer una donación
          </a>
        </div>

        {/* Privacy Notice */}
        <div className="bg-yellow-500/10 p-4 rounded-lg border-l-4 border-yellow-500">
          <h4 className="font-semibold flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4" /> Privacidad y Seguridad
          </h4>
          <p className="text-muted-foreground">
            <strong>Importante:</strong> Este es un proyecto independiente. No almacenamos la
            información de los códigos QR generados, ni leemos ni guardamos los archivos subidos.
            Toda la información se procesa localmente en tu sesión.
          </p>
        </div>
      </div>
    </section>
  );
}
