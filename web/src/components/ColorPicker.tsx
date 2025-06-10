import React, { useState } from 'react'

interface ColorPickerProps {
  label: string
  color: string
  onChange: (color: string) => void
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const presetColors = [
    '#3B82F6', '#1E40AF', '#1E3A8A', // Blues
    '#EF4444', '#DC2626', '#B91C1C', // Reds
    '#10B981', '#059669', '#047857', // Greens
    '#F59E0B', '#D97706', '#B45309', // Oranges
    '#8B5CF6', '#7C3AED', '#6D28D9', // Purples
    '#EC4899', '#DB2777', '#BE185D', // Pinks
  ]

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-8 rounded border border-gray-600 shadow-sm relative overflow-hidden"
          style={{ backgroundColor: color }}
        >
          <div className="absolute inset-0 hover:bg-black/10 transition-colors" />
        </button>
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="#3B82F6"
        />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
          <div className="grid grid-cols-6 gap-2 mb-3">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                onClick={() => {
                  onChange(presetColor)
                  setIsOpen(false)
                }}
                className="w-8 h-8 rounded border border-gray-600 hover:scale-110 transition-transform"
                style={{ backgroundColor: presetColor }}
              />
            ))}
          </div>
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-8 bg-gray-700 border border-gray-600 rounded cursor-pointer"
          />
        </div>
      )}
    </div>
  )
}
