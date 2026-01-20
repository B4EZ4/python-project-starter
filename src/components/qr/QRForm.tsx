import { useState, useCallback } from 'react';
import { QR_STYLES, MAX_TEXT_LENGTH, DEFAULT_QR_CONFIG, type QRConfig } from '@/types/qr';
import { Zap, Type, Palette, FileSignature, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { ColorPicker } from './ColorPicker';
import { FrameConfig } from './FrameConfig';
import { LogoConfig } from './LogoConfig';
import { CornersConfig } from './CornersConfig';
import { ConfigExportImport } from './ConfigExportImport';

interface QRFormProps {
  onSubmit: (config: QRConfig) => void;
  onStyleChange: (tipo: number) => void;
  isLoading: boolean;
}

export function QRForm({ onSubmit, onStyleChange, isLoading }: QRFormProps) {
  const [config, setConfig] = useState<QRConfig>(DEFAULT_QR_CONFIG);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateConfig = (updates: Partial<QRConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!config.texto.trim()) return;
      onSubmit(config);
    },
    [config, onSubmit]
  );

  const handleStyleChange = useCallback(
    (newTipo: number) => {
      updateConfig({ tipo: newTipo });
      onStyleChange(newTipo);
    },
    [onStyleChange]
  );

  const handleImport = (importedConfig: QRConfig) => {
    setConfig(importedConfig);
    onStyleChange(importedConfig.tipo);
  };

  const charCount = config.texto.length;
  const isOverLimit = charCount > MAX_TEXT_LENGTH;

  return (
    <section className="bg-gradient-to-br from-secondary to-slate-600 p-6 rounded-xl w-full max-w-md shadow-lg transition-transform hover:-translate-y-1">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-muted flex items-center justify-center gap-2">
          <span className="text-primary">+</span> Crear Código QR
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Ingresa tu texto o enlace y personaliza el estilo de tu código QR
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Texto Input */}
        <div className="space-y-2">
          <label htmlFor="texto" className="flex items-center gap-2 font-semibold text-foreground">
            <Type className="w-4 h-4" /> Contenido del QR:
          </label>
          <textarea
            id="texto"
            value={config.texto}
            onChange={(e) => updateConfig({ texto: e.target.value })}
            rows={4}
            placeholder="Ingresa texto, enlace web, teléfono, email, etc..."
            required
            className="w-full p-3 border border-white/10 rounded-lg bg-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y transition-all"
          />
          <div className="flex justify-between items-center">
            <small className="text-muted-foreground text-xs">
              Ejemplos: https://tusitio.com, +1234567890
            </small>
            <span className={`text-xs ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
              {charCount} / {MAX_TEXT_LENGTH}
            </span>
          </div>
        </div>

        {/* Estilo Select */}
        <div className="space-y-2">
          <label htmlFor="tipo" className="flex items-center gap-2 font-semibold text-foreground">
            <Palette className="w-4 h-4" /> Estilo del código QR:
          </label>
          <select
            id="tipo"
            value={config.tipo}
            onChange={(e) => handleStyleChange(Number(e.target.value))}
            className="w-full p-3 border border-white/10 rounded-lg bg-white/10 text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          >
            {QR_STYLES.map((style) => (
              <option key={style.id} value={style.id} className="bg-secondary text-foreground">
                {style.emoji} {style.name}
              </option>
            ))}
          </select>
        </div>

        {/* Color del QR y fondo */}
        <div className="flex flex-wrap gap-4">
          <ColorPicker
            label="Color del QR:"
            value={config.qrColor}
            onChange={(qrColor) => updateConfig({ qrColor })}
          />
          <ColorPicker
            label="Fondo:"
            value={config.backgroundColor}
            onChange={(backgroundColor) => updateConfig({ backgroundColor })}
          />
        </div>

        {/* Nombre Input */}
        <div className="space-y-2">
          <label htmlFor="nombre" className="flex items-center gap-2 font-semibold text-foreground">
            <FileSignature className="w-4 h-4" /> Nombre del archivo (opcional):
          </label>
          <input
            type="text"
            id="nombre"
            value={config.nombre}
            onChange={(e) => updateConfig({ nombre: e.target.value })}
            placeholder="mi_codigo_qr"
            className="w-full p-3 border border-white/10 rounded-lg bg-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 w-full p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-sm"
        >
          <Settings className="w-4 h-4 text-primary" />
          <span className="flex-1 text-left font-medium">Opciones avanzadas</span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
            <FrameConfig
              config={config.frame}
              onChange={(frame) => updateConfig({ frame })}
            />

            <LogoConfig
              config={config.logo}
              onChange={(logo) => updateConfig({ logo })}
            />

            <CornersConfig
              config={config.corners}
              qrColor={config.qrColor}
              onChange={(corners) => updateConfig({ corners })}
            />

            <ConfigExportImport config={config} onImport={handleImport} />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || isOverLimit || !config.texto.trim()}
          className="w-full py-3 px-4 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          {isLoading ? 'Generando...' : 'Generar QR'}
        </button>
      </form>
    </section>
  );
}
