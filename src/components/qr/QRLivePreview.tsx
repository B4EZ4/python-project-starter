import { useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Eye, Frame } from 'lucide-react';
import type { QRConfig } from '@/types/qr';
import { PRESET_LOGOS } from '@/types/qr';

interface QRLivePreviewProps {
  config: QRConfig;
}

export function QRLivePreview({ config }: QRLivePreviewProps) {
  const previewContent = config.texto.trim() || 'https://ejemplo.com';
  
  const selectedLogo = useMemo(() => {
    if (!config.logo.enabled) return null;
    if (config.logo.preset) {
      return PRESET_LOGOS.find(l => l.id === config.logo.preset);
    }
    return null;
  }, [config.logo]);

  // Get corner color
  const getCornerColor = (useQRColor: boolean, color: string) => {
    return useQRColor ? config.qrColor : color;
  };

  return (
    <section className="bg-gradient-to-br from-secondary to-slate-600 p-6 rounded-xl w-full max-w-md shadow-lg transition-transform hover:-translate-y-1">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-muted flex items-center justify-center gap-2">
          <Eye className="w-5 h-5" /> Vista Previa en Tiempo Real
        </h2>
        <p className="text-muted-foreground text-xs mt-1">
          Los cambios se reflejan automáticamente
        </p>
      </div>

      <div className="relative">
        {/* Frame wrapper */}
        <div
          className="rounded-xl overflow-hidden transition-all duration-300"
          style={{
            backgroundColor: config.frame.enabled ? config.frame.color : 'transparent',
            padding: config.frame.enabled ? '16px' : '0',
          }}
        >
          {/* QR Container */}
          <div
            className="p-4 rounded-lg mx-auto transition-all duration-300"
            style={{ backgroundColor: config.backgroundColor }}
          >
            <div className="relative">
              <QRCodeSVG
                value={previewContent}
                size={200}
                bgColor={config.backgroundColor}
                fgColor={config.qrColor}
                level="H"
                includeMargin={false}
                className="mx-auto"
              />
              
              {/* Logo overlay */}
              {config.logo.enabled && (selectedLogo || config.logo.customUrl) && (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div
                    className="bg-white rounded-lg p-2 shadow-md flex items-center justify-center"
                    style={{ width: 50, height: 50 }}
                  >
                    {selectedLogo ? (
                      <span className="text-2xl">{selectedLogo.icon}</span>
                    ) : config.logo.customUrl ? (
                      <img
                        src={config.logo.customUrl}
                        alt="Logo"
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Frame text */}
          {config.frame.enabled && config.frame.text && (
            <p
              className="text-center mt-3 font-semibold text-sm tracking-wide"
              style={{ color: config.frame.textColor }}
            >
              {config.frame.text}
            </p>
          )}
        </div>
      </div>

      {/* Config summary */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <h3 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
          <Frame className="w-3 h-3" /> Configuración actual:
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded border border-white/20"
              style={{ backgroundColor: config.qrColor }}
            />
            <span className="text-muted-foreground">QR</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded border border-white/20"
              style={{ backgroundColor: config.backgroundColor }}
            />
            <span className="text-muted-foreground">Fondo</span>
          </div>
          {config.frame.enabled && (
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded border border-white/20"
                style={{ backgroundColor: config.frame.color }}
              />
              <span className="text-muted-foreground">Marco</span>
            </div>
          )}
          {config.logo.enabled && (
            <div className="flex items-center gap-2">
              <span className="text-sm">{selectedLogo?.icon || '🔗'}</span>
              <span className="text-muted-foreground">Logo</span>
            </div>
          )}
        </div>
        
        {/* Corner colors */}
        {!config.corners.syncAll && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <p className="text-[10px] text-muted-foreground mb-1">Esquinas:</p>
            <div className="flex gap-1">
              <div
                className="w-3 h-3 rounded-tl border border-white/20"
                style={{ backgroundColor: getCornerColor(config.corners.topLeft.useQRColor, config.corners.topLeft.color) }}
                title="Superior izquierda"
              />
              <div
                className="w-3 h-3 rounded-tr border border-white/20"
                style={{ backgroundColor: getCornerColor(config.corners.topRight.useQRColor, config.corners.topRight.color) }}
                title="Superior derecha"
              />
              <div
                className="w-3 h-3 rounded-bl border border-white/20"
                style={{ backgroundColor: getCornerColor(config.corners.bottomLeft.useQRColor, config.corners.bottomLeft.color) }}
                title="Inferior izquierda"
              />
              <div
                className="w-3 h-3 rounded-br border border-white/20"
                style={{ backgroundColor: getCornerColor(config.corners.bottomRight.useQRColor, config.corners.bottomRight.color) }}
                title="Inferior derecha"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
