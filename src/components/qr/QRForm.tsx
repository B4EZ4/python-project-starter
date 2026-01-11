import { useState, useCallback } from 'react';
import { QR_STYLES, MAX_TEXT_LENGTH } from '@/types/qr';
import { Zap, Type, Palette, FileSignature } from 'lucide-react';

interface QRFormProps {
  onSubmit: (texto: string, tipo: number, nombre: string) => void;
  onStyleChange: (tipo: number) => void;
  isLoading: boolean;
}

export function QRForm({ onSubmit, onStyleChange, isLoading }: QRFormProps) {
  const [texto, setTexto] = useState('');
  const [tipo, setTipo] = useState(6);
  const [nombre, setNombre] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!texto.trim()) return;
      onSubmit(texto, tipo, nombre);
    },
    [texto, tipo, nombre, onSubmit]
  );

  const handleStyleChange = useCallback(
    (newTipo: number) => {
      setTipo(newTipo);
      onStyleChange(newTipo);
    },
    [onStyleChange]
  );

  const charCount = texto.length;
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
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={5}
            placeholder="Ingresa texto, enlace web, teléfono, email, etc..."
            required
            className="w-full p-3 border border-white/10 rounded-lg bg-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y transition-all"
          />
          <div className="flex justify-between items-center">
            <small className="text-muted-foreground text-xs">
              Ejemplos: https://tusitio.com, +1234567890, email@ejemplo.com
            </small>
            <span className={`text-xs ${isOverLimit ? 'text-red-400' : 'text-muted-foreground'}`}>
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
            value={tipo}
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

        {/* Nombre Input */}
        <div className="space-y-2">
          <label htmlFor="nombre" className="flex items-center gap-2 font-semibold text-foreground">
            <FileSignature className="w-4 h-4" /> Nombre del archivo (opcional):
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="mi_codigo_qr"
            className="w-full p-3 border border-white/10 rounded-lg bg-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <small className="text-muted-foreground text-xs block">
            Si no especificas un nombre, se usará "qr_default"
          </small>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || isOverLimit || !texto.trim()}
          className="w-full py-3 px-4 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          {isLoading ? 'Generando...' : 'Generar QR'}
        </button>
      </form>
    </section>
  );
}
