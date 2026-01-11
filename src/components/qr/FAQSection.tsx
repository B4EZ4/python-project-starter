import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: '¿Qué tipos de contenido puedo convertir en QR?',
    answer:
      'Puedes generar códigos QR para: enlaces web, texto libre, números de teléfono (para marcar directamente), direcciones de email (para enviar correos), mensajes SMS, y cualquier otro texto plano.',
  },
  {
    question: '¿Los códigos QR generados expiran?',
    answer:
      'No, los códigos QR generados no tienen fecha de expiración. Una vez descargados, permanecerán funcionales indefinidamente mientras el contenido que representan siga siendo válido.',
  },
  {
    question: '¿Puedo personalizar los colores de mi QR?',
    answer:
      'Actualmente ofrecemos 6 estilos de módulos diferentes. En futuras versiones planeamos añadir más opciones de personalización, incluyendo colores.',
  },
  {
    question: '¿Hay algún costo por usar este generador?',
    answer:
      'No, este generador de códigos QR es completamente gratuito. Es un proyecto de código abierto creado para la comunidad.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="p-6 my-8 rounded-xl bg-black/30 shadow-lg max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-muted flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6" /> Preguntas Frecuentes
        </h2>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white/5 rounded-lg overflow-hidden transition-all hover:bg-white/8"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full p-4 flex justify-between items-center text-left"
            >
              <h3 className="font-semibold pr-4">{faq.question}</h3>
              <ChevronDown
                className={`w-5 h-5 flex-shrink-0 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96 pb-4 px-4' : 'max-h-0'
              }`}
            >
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
