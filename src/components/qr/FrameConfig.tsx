import { Frame, Type } from 'lucide-react';
import { ColorPicker } from './ColorPicker';
import type { FrameConfig as FrameConfigType } from '@/types/qr';

interface FrameConfigProps {
  config: FrameConfigType;
  onChange: (config: FrameConfigType) => void;
}

export function FrameConfig({ config, onChange }: FrameConfigProps) {
  const updateConfig = (updates: Partial<FrameConfigType>) => {
    onChange({ ...config, ...updates });
  };

  return (
    <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 font-semibold text-foreground">
          <Frame className="w-4 h-4" /> Marco
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => updateConfig({ enabled: e.target.checked })}
            className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary/20"
          />
          <span className="text-sm text-muted-foreground">Activar</span>
        </label>
      </div>

      {config.enabled && (
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div className="flex flex-wrap gap-4">
            <ColorPicker
              label="Color del marco:"
              value={config.color}
              onChange={(color) => updateConfig({ color })}
            />
            <ColorPicker
              label="Color del texto:"
              value={config.textColor}
              onChange={(textColor) => updateConfig({ textColor })}
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Type className="w-3 h-3" /> Texto del marco:
            </label>
            <input
              type="text"
              value={config.text}
              onChange={(e) => updateConfig({ text: e.target.value })}
              placeholder="Escanéame"
              maxLength={30}
              className="w-full p-2 text-sm bg-white/10 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      )}
    </div>
  );
}
