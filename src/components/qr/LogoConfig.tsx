import { Image, Link, X } from 'lucide-react';
import { PRESET_LOGOS, type LogoConfig as LogoConfigType } from '@/types/qr';

interface LogoConfigProps {
  config: LogoConfigType;
  onChange: (config: LogoConfigType) => void;
}

export function LogoConfig({ config, onChange }: LogoConfigProps) {
  const updateConfig = (updates: Partial<LogoConfigType>) => {
    onChange({ ...config, ...updates });
  };

  const selectPreset = (presetId: string) => {
    if (config.preset === presetId) {
      updateConfig({ preset: null });
    } else {
      updateConfig({ preset: presetId, customUrl: null });
    }
  };

  return (
    <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 font-semibold text-foreground">
          <Image className="w-4 h-4" /> Logo
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
          <div>
            <p className="text-xs text-muted-foreground mb-2">Logos preestablecidos:</p>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_LOGOS.map((logo) => (
                <button
                  key={logo.id}
                  type="button"
                  onClick={() => selectPreset(logo.id)}
                  className={`p-2 rounded-lg text-center transition-all ${
                    config.preset === logo.id
                      ? 'bg-primary/30 border-2 border-primary'
                      : 'bg-white/10 border border-white/10 hover:bg-white/20'
                  }`}
                  title={logo.name}
                >
                  <span className="text-lg">{logo.icon}</span>
                  <p className="text-[10px] text-muted-foreground mt-1 truncate">{logo.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link className="w-3 h-3" /> O URL personalizada:
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={config.customUrl || ''}
                onChange={(e) => updateConfig({ customUrl: e.target.value || null, preset: null })}
                placeholder="https://ejemplo.com/logo.png"
                className="flex-1 p-2 text-sm bg-white/10 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              {config.customUrl && (
                <button
                  type="button"
                  onClick={() => updateConfig({ customUrl: null })}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
