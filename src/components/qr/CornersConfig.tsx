import { useState } from 'react';
import { CornerDownLeft, CornerDownRight, CornerUpLeft, CornerUpRight, Link2, Unlink2 } from 'lucide-react';
import { ColorPicker } from './ColorPicker';
import { CORNER_STYLES, type CornersConfig as CornersConfigType, type CornerConfig } from '@/types/qr';

interface CornersConfigProps {
  config: CornersConfigType;
  qrColor: string;
  onChange: (config: CornersConfigType) => void;
}

type CornerKey = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

const CORNER_INFO: { key: CornerKey; label: string; Icon: React.ComponentType<any> }[] = [
  { key: 'topLeft', label: 'Superior Izq.', Icon: CornerUpLeft },
  { key: 'topRight', label: 'Superior Der.', Icon: CornerUpRight },
  { key: 'bottomLeft', label: 'Inferior Izq.', Icon: CornerDownLeft },
  { key: 'bottomRight', label: 'Inferior Der.', Icon: CornerDownRight },
];

export function CornersConfig({ config, qrColor, onChange }: CornersConfigProps) {
  const [expandedCorner, setExpandedCorner] = useState<CornerKey | null>(null);

  const updateCorner = (cornerKey: CornerKey, updates: Partial<CornerConfig>) => {
    if (config.syncAll) {
      // Update all corners
      const newCornerConfig = { ...config[cornerKey], ...updates };
      onChange({
        ...config,
        topLeft: newCornerConfig,
        topRight: newCornerConfig,
        bottomLeft: newCornerConfig,
        bottomRight: newCornerConfig,
      });
    } else {
      onChange({
        ...config,
        [cornerKey]: { ...config[cornerKey], ...updates },
      });
    }
  };

  const toggleSync = () => {
    if (!config.syncAll) {
      // Sync all to topLeft
      const masterConfig = config.topLeft;
      onChange({
        ...config,
        syncAll: true,
        topLeft: masterConfig,
        topRight: masterConfig,
        bottomLeft: masterConfig,
        bottomRight: masterConfig,
      });
    } else {
      onChange({ ...config, syncAll: false });
    }
  };

  const getEffectiveColor = (corner: CornerConfig) => {
    return corner.useQRColor ? qrColor : corner.color;
  };

  return (
    <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 font-semibold text-foreground">
          <CornerUpLeft className="w-4 h-4" /> Esquinas
        </label>
        <button
          type="button"
          onClick={toggleSync}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs transition-all ${
            config.syncAll
              ? 'bg-primary/30 text-primary border border-primary/50'
              : 'bg-white/10 text-muted-foreground border border-white/10 hover:bg-white/20'
          }`}
        >
          {config.syncAll ? <Link2 className="w-3 h-3" /> : <Unlink2 className="w-3 h-3" />}
          {config.syncAll ? 'Sincronizado' : 'Individual'}
        </button>
      </div>

      {/* Style selector for all/first corner */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          {config.syncAll ? 'Estilo para todas las esquinas:' : 'Selecciona una esquina para editar:'}
        </p>

        {config.syncAll ? (
          <CornerEditor
            corner={config.topLeft}
            qrColor={qrColor}
            onChange={(updates) => updateCorner('topLeft', updates)}
          />
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {CORNER_INFO.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setExpandedCorner(expandedCorner === key ? null : key)}
                  className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-all ${
                    expandedCorner === key
                      ? 'bg-primary/30 border border-primary'
                      : 'bg-white/10 border border-white/10 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="truncate">{label}</span>
                  <div
                    className="w-4 h-4 rounded ml-auto border border-white/20"
                    style={{ backgroundColor: getEffectiveColor(config[key]) }}
                  />
                </button>
              ))}
            </div>

            {expandedCorner && (
              <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-muted-foreground mb-2">
                  Editando: {CORNER_INFO.find((c) => c.key === expandedCorner)?.label}
                </p>
                <CornerEditor
                  corner={config[expandedCorner]}
                  qrColor={qrColor}
                  onChange={(updates) => updateCorner(expandedCorner, updates)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface CornerEditorProps {
  corner: CornerConfig;
  qrColor: string;
  onChange: (updates: Partial<CornerConfig>) => void;
}

function CornerEditor({ corner, qrColor, onChange }: CornerEditorProps) {
  return (
    <div className="space-y-3">
      {/* Style grid */}
      <div className="grid grid-cols-5 gap-1">
        {CORNER_STYLES.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => onChange({ style: style.id })}
            className={`p-2 rounded text-center transition-all ${
              corner.style === style.id
                ? 'bg-primary/30 border-2 border-primary'
                : 'bg-white/10 border border-white/10 hover:bg-white/20'
            }`}
            title={style.name}
          >
            <span className="text-sm">{style.preview}</span>
          </button>
        ))}
      </div>

      {/* Color options */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={corner.useQRColor}
            onChange={(e) => onChange({ useQRColor: e.target.checked })}
            className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary/20"
          />
          <span className="text-xs text-muted-foreground">Usar color del QR</span>
        </label>

        {!corner.useQRColor && (
          <ColorPicker
            label="Color:"
            value={corner.color}
            onChange={(color) => onChange({ color })}
          />
        )}
      </div>
    </div>
  );
}
