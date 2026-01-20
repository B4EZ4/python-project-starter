export interface QRStyle {
  id: number;
  name: string;
  emoji: string;
  image: string;
}

export interface CornerStyle {
  id: number;
  name: string;
  preview: string;
}

export interface FrameConfig {
  enabled: boolean;
  color: string;
  text: string;
  textColor: string;
}

export interface LogoConfig {
  enabled: boolean;
  preset: string | null;
  customUrl: string | null;
}

export interface CornerConfig {
  style: number;
  color: string;
  useQRColor: boolean;
}

export interface CornersConfig {
  topLeft: CornerConfig;
  topRight: CornerConfig;
  bottomLeft: CornerConfig;
  bottomRight: CornerConfig;
  syncAll: boolean;
}

export interface QRConfig {
  texto: string;
  tipo: number;
  nombre: string;
  qrColor: string;
  backgroundColor: string;
  frame: FrameConfig;
  logo: LogoConfig;
  corners: CornersConfig;
}

export interface QRRequest {
  texto: string;
  tipo: number;
  nombre: string;
  qr_color?: string;
  background_color?: string;
  frame?: {
    enabled: boolean;
    color: string;
    text: string;
    text_color: string;
  };
  logo?: {
    enabled: boolean;
    preset: string | null;
    custom_url: string | null;
  };
  corners?: {
    top_left: { style: number; color: string };
    top_right: { style: number; color: string };
    bottom_left: { style: number; color: string };
    bottom_right: { style: number; color: string };
  };
}

export interface QRResponse {
  success: boolean;
  image_base64: string;
  filename: string;
  qr_size: string;
  message: string;
}

export interface QRError {
  error: string;
}

export const QR_STYLES: QRStyle[] = [
  { id: 1, name: 'Círculo', emoji: '🔵', image: '/static/image/Circulo.png' },
  { id: 2, name: 'Cuadrado', emoji: '◼️', image: '/static/image/Cuadrado.png' },
  { id: 3, name: 'Barra vertical', emoji: '▮', image: '/static/image/Barra Vertical.png' },
  { id: 4, name: 'Barra Horizontal', emoji: '▬', image: '/static/image/Barra Horizontal.png' },
  { id: 5, name: 'Redondeado', emoji: '🔘', image: '/static/image/Redondeado.png' },
  { id: 6, name: 'Cuadrado Clásico', emoji: '◼️', image: '/static/image/Cuadrado clasico.png' },
];

export const CORNER_STYLES: CornerStyle[] = [
  { id: 1, name: 'Cuadrado', preview: '▪️' },
  { id: 2, name: 'Redondeado', preview: '🔘' },
  { id: 3, name: 'Círculo', preview: '⭕' },
  { id: 4, name: 'Diamante', preview: '💠' },
  { id: 5, name: 'Estrella', preview: '⭐' },
  { id: 6, name: 'Hexágono', preview: '⬡' },
  { id: 7, name: 'Octágono', preview: '🛑' },
  { id: 8, name: 'Hoja', preview: '🍃' },
  { id: 9, name: 'Corazón', preview: '❤️' },
  { id: 10, name: 'Flecha', preview: '➤' },
  { id: 11, name: 'Cruz', preview: '✚' },
  { id: 12, name: 'Gota', preview: '💧' },
  { id: 13, name: 'Escudo', preview: '🛡️' },
  { id: 14, name: 'Rayo', preview: '⚡' },
  { id: 15, name: 'Luna', preview: '🌙' },
];

export const PRESET_LOGOS = [
  { id: 'facebook', name: 'Facebook', icon: '📘' },
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
  { id: 'youtube', name: 'YouTube', icon: '📺' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'spotify', name: 'Spotify', icon: '🎧' },
  { id: 'email', name: 'Email', icon: '📧' },
  { id: 'phone', name: 'Teléfono', icon: '📞' },
  { id: 'website', name: 'Sitio Web', icon: '🌐' },
  { id: 'location', name: 'Ubicación', icon: '📍' },
];

export const MAX_TEXT_LENGTH = 2325;

export const DEFAULT_QR_CONFIG: QRConfig = {
  texto: '',
  tipo: 6,
  nombre: '',
  qrColor: '#000000',
  backgroundColor: '#FFFFFF',
  frame: {
    enabled: false,
    color: '#000000',
    text: '',
    textColor: '#FFFFFF',
  },
  logo: {
    enabled: false,
    preset: null,
    customUrl: null,
  },
  corners: {
    topLeft: { style: 1, color: '#000000', useQRColor: true },
    topRight: { style: 1, color: '#000000', useQRColor: true },
    bottomLeft: { style: 1, color: '#000000', useQRColor: true },
    bottomRight: { style: 1, color: '#000000', useQRColor: true },
    syncAll: true,
  },
};
