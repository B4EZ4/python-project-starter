import { Info, AlertCircle, Lock, Image, Cog, CheckCircle, Paintbrush } from 'lucide-react';

const limitations = [
  {
    icon: AlertCircle,
    title: 'Tamaño de los Códigos QR',
    description:
      'El generador es capaz de manejar hasta 2,953 caracteres. El tamaño del código QR aumenta con la cantidad de datos, lo que puede afectar su capacidad de escaneo si los datos son demasiado extensos.',
  },
  {
    icon: Lock,
    title: 'No Almacenamiento de Información',
    description:
      'Este generador de códigos QR no almacena ni lee los datos ingresados por los usuarios. Toda la información se procesa localmente en el servidor, garantizando la privacidad de los datos proporcionados.',
  },
  {
    icon: Image,
    title: 'Calidad de la Imagen',
    description:
      'Generamos imágenes PNG de alta calidad. Para usos profesionales que requieran máxima resolución, considera ajustar los parámetros de tamaño en la generación.',
  },
  {
    icon: Cog,
    title: 'Tipos de Contenido Compatibles',
    description:
      'El generador funciona con texto plano, enlaces web, números de teléfono, direcciones de email, y más. Los formatos estándar garantizan que el código sea escaneable y funcional.',
  },
  {
    icon: CheckCircle,
    title: 'Compatibilidad',
    description:
      'Los códigos QR generados son compatibles con la mayoría de los escáneres QR disponibles en teléfonos inteligentes y aplicaciones de lectura. Algunos estilos personalizados pueden tener limitaciones en dispositivos muy antiguos.',
  },
  {
    icon: Paintbrush,
    title: 'Estilos Personalizados',
    description:
      'Ofrecemos 6 estilos visuales diferentes para los códigos QR. Mientras que los estilos mejoran la apariencia, recomendamos el "Cuadrado Clásico" para máxima compatibilidad.',
  },
];

export function LimitationsSection() {
  return (
    <section className="p-6 my-8 rounded-xl bg-white/5 shadow-lg max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-muted flex items-center justify-center gap-2">
          <Info className="w-6 h-6" /> Información Técnica y Limitaciones
        </h2>
        <p className="text-muted-foreground mt-2">
          Conoce las capacidades y consideraciones técnicas de nuestro generador QR
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {limitations.map((item, index) => (
          <div
            key={index}
            className="bg-white/5 p-4 rounded-lg transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3 mb-3">
              <item.icon className="w-6 h-6 text-primary flex-shrink-0" />
              <h3 className="font-semibold">{item.title}</h3>
            </div>
            <p className="text-muted-foreground text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
