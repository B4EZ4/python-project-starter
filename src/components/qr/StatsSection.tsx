import { QrCode, Palette, Shield } from 'lucide-react';

interface StatsSectionProps {
  generatedCount: number;
}

export function StatsSection({ generatedCount }: StatsSectionProps) {
  const stats = [
    {
      icon: QrCode,
      value: generatedCount.toString(),
      label: 'QRs Generados',
    },
    {
      icon: Palette,
      value: '6',
      label: 'Estilos Disponibles',
    },
    {
      icon: Shield,
      value: '100%',
      label: 'Privado y Seguro',
    },
  ];

  return (
    <section className="p-6 my-8 rounded-xl bg-black/30 shadow-lg max-w-5xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="text-center p-4 bg-white/10 rounded-lg transition-transform hover:-translate-y-1"
          >
            <stat.icon className="w-10 h-10 text-primary mx-auto mb-3" />
            <span className="block text-3xl font-bold text-foreground">{stat.value}</span>
            <span className="text-muted-foreground text-sm">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
