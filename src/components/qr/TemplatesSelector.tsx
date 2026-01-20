import { Sparkles, Check } from 'lucide-react';
import { QR_TEMPLATES, type QRTemplate } from '@/data/qrTemplates';
import type { QRConfig } from '@/types/qr';

interface TemplatesSelectorProps {
  onSelectTemplate: (template: QRTemplate) => void;
  selectedTemplateId: string | null;
}

export function TemplatesSelector({ onSelectTemplate, selectedTemplateId }: TemplatesSelectorProps) {
  return (
    <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
      <label className="flex items-center gap-2 font-semibold text-foreground">
        <Sparkles className="w-4 h-4 text-primary" /> Plantillas rápidas
      </label>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
        {QR_TEMPLATES.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelectTemplate(template)}
            className={`relative p-3 rounded-lg text-center transition-all ${
              selectedTemplateId === template.id
                ? 'bg-primary/30 border-2 border-primary ring-2 ring-primary/20'
                : 'bg-white/10 border border-white/10 hover:bg-white/20 hover:border-white/20'
            }`}
            title={template.description}
          >
            {selectedTemplateId === template.id && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
            <span className="text-2xl block mb-1">{template.preview}</span>
            <p className="text-[10px] text-muted-foreground truncate">{template.name}</p>
          </button>
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        Selecciona una plantilla para aplicar su estilo
      </p>
    </div>
  );
}
