import { useState, useRef, useEffect } from 'react';
import { Pipette } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      <div className="relative">
        <button
          type="button"
          onClick={handleClick}
          className="w-8 h-8 rounded-lg border-2 border-white/20 shadow-md hover:scale-105 transition-transform overflow-hidden"
          style={{ backgroundColor: value }}
          title={value}
        >
          <span className="sr-only">Seleccionar color</span>
        </button>
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-20 px-2 py-1 text-xs bg-white/10 border border-white/10 rounded text-foreground font-mono"
        placeholder="#000000"
      />
    </div>
  );
}
