import { Download, Upload, FileJson, FileCode } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';
import type { QRConfig } from '@/types/qr';

interface ConfigExportImportProps {
  config: QRConfig;
  onImport: (config: QRConfig) => void;
}

export function ConfigExportImport({ config, onImport }: ConfigExportImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportAsJSON = () => {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      config,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('✅ Configuración exportada como JSON');
  };

  const exportAsXML = () => {
    const xmlContent = configToXML(config);
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-config-${Date.now()}.xml`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('✅ Configuración exportada como XML');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        let importedConfig: QRConfig;

        if (file.name.endsWith('.json')) {
          const data = JSON.parse(content);
          importedConfig = data.config || data;
        } else if (file.name.endsWith('.xml')) {
          importedConfig = xmlToConfig(content);
        } else {
          throw new Error('Formato no soportado');
        }

        // Validate imported config
        if (!importedConfig.texto === undefined || !importedConfig.tipo === undefined) {
          throw new Error('Configuración inválida');
        }

        onImport(importedConfig);
        toast.success('✅ Configuración importada correctamente');
      } catch (error) {
        toast.error('❌ Error al importar: archivo inválido');
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
      <span className="text-xs text-muted-foreground w-full mb-1">Exportar/Importar configuración:</span>

      <button
        type="button"
        onClick={exportAsJSON}
        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
      >
        <FileJson className="w-3 h-3" />
        Exportar JSON
      </button>

      <button
        type="button"
        onClick={exportAsXML}
        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors"
      >
        <FileCode className="w-3 h-3" />
        Exportar XML
      </button>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
      >
        <Upload className="w-3 h-3" />
        Importar
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.xml"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

function configToXML(config: QRConfig): string {
  const escapeXML = (str: string) =>
    str.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        case "'":
          return '&apos;';
        case '"':
          return '&quot;';
        default:
          return c;
      }
    });

  return `<?xml version="1.0" encoding="UTF-8"?>
<qr-config version="1.0" exportedAt="${new Date().toISOString()}">
  <basic>
    <texto>${escapeXML(config.texto)}</texto>
    <tipo>${config.tipo}</tipo>
    <nombre>${escapeXML(config.nombre)}</nombre>
    <qrColor>${config.qrColor}</qrColor>
    <backgroundColor>${config.backgroundColor}</backgroundColor>
  </basic>
  <frame enabled="${config.frame.enabled}">
    <color>${config.frame.color}</color>
    <text>${escapeXML(config.frame.text)}</text>
    <textColor>${config.frame.textColor}</textColor>
  </frame>
  <logo enabled="${config.logo.enabled}">
    <preset>${config.logo.preset || ''}</preset>
    <customUrl>${config.logo.customUrl || ''}</customUrl>
  </logo>
  <corners syncAll="${config.corners.syncAll}">
    <topLeft style="${config.corners.topLeft.style}" color="${config.corners.topLeft.color}" useQRColor="${config.corners.topLeft.useQRColor}" />
    <topRight style="${config.corners.topRight.style}" color="${config.corners.topRight.color}" useQRColor="${config.corners.topRight.useQRColor}" />
    <bottomLeft style="${config.corners.bottomLeft.style}" color="${config.corners.bottomLeft.color}" useQRColor="${config.corners.bottomLeft.useQRColor}" />
    <bottomRight style="${config.corners.bottomRight.style}" color="${config.corners.bottomRight.color}" useQRColor="${config.corners.bottomRight.useQRColor}" />
  </corners>
</qr-config>`;
}

function xmlToConfig(xml: string): QRConfig {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');

  const getText = (selector: string): string => doc.querySelector(selector)?.textContent || '';
  const getAttr = (selector: string, attr: string): string =>
    doc.querySelector(selector)?.getAttribute(attr) || '';

  return {
    texto: getText('basic texto'),
    tipo: parseInt(getText('basic tipo')) || 6,
    nombre: getText('basic nombre'),
    qrColor: getText('basic qrColor') || '#000000',
    backgroundColor: getText('basic backgroundColor') || '#FFFFFF',
    frame: {
      enabled: getAttr('frame', 'enabled') === 'true',
      color: getText('frame color') || '#000000',
      text: getText('frame text'),
      textColor: getText('frame textColor') || '#FFFFFF',
    },
    logo: {
      enabled: getAttr('logo', 'enabled') === 'true',
      preset: getText('logo preset') || null,
      customUrl: getText('logo customUrl') || null,
    },
    corners: {
      syncAll: getAttr('corners', 'syncAll') === 'true',
      topLeft: {
        style: parseInt(getAttr('corners topLeft', 'style')) || 1,
        color: getAttr('corners topLeft', 'color') || '#000000',
        useQRColor: getAttr('corners topLeft', 'useQRColor') === 'true',
      },
      topRight: {
        style: parseInt(getAttr('corners topRight', 'style')) || 1,
        color: getAttr('corners topRight', 'color') || '#000000',
        useQRColor: getAttr('corners topRight', 'useQRColor') === 'true',
      },
      bottomLeft: {
        style: parseInt(getAttr('corners bottomLeft', 'style')) || 1,
        color: getAttr('corners bottomLeft', 'color') || '#000000',
        useQRColor: getAttr('corners bottomLeft', 'useQRColor') === 'true',
      },
      bottomRight: {
        style: parseInt(getAttr('corners bottomRight', 'style')) || 1,
        color: getAttr('corners bottomRight', 'color') || '#000000',
        useQRColor: getAttr('corners bottomRight', 'useQRColor') === 'true',
      },
    },
  };
}
