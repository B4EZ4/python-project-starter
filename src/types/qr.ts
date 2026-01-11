export interface QRStyle {
  id: number;
  name: string;
  emoji: string;
  image: string;
}

export interface QRRequest {
  texto: string;
  tipo: number;
  nombre: string;
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

export const MAX_TEXT_LENGTH = 2325;
