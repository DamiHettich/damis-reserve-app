import { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

export default function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={pickerRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <div
          role="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-6 h-6 rounded border cursor-pointer hover:border-gray-400"
          style={{ backgroundColor: color }}
        />
        <span className="text-gray-700">{color}</span>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50">
          <div className="p-2 bg-white rounded-lg shadow-lg">
            <HexColorPicker
              color={color}
              onChange={onChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
