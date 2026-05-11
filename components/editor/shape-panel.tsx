'use client';

import { DEFAULT_SHAPE_SIZES, type NodeShape } from '@/types/canvas';
import { Square, Circle, Diamond, Pill, Database, Grid3x3 } from 'lucide-react';

const SHAPES: { name: NodeShape; icon: React.ReactNode; label: string }[] = [
  { name: 'rectangle', icon: <Square size={20} />, label: 'Rectangle' },
  { name: 'diamond', icon: <Diamond size={20} />, label: 'Diamond' },
  { name: 'circle', icon: <Circle size={20} />, label: 'Circle' },
  { name: 'pill', icon: <Pill size={20} />, label: 'Pill' },
  { name: 'cylinder', icon: <Database size={20} />, label: 'Cylinder' },
  { name: 'hexagon', icon: <Grid3x3 size={20} />, label: 'Hexagon' },
];

export function ShapePanel() {
  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, shape: NodeShape) => {
    const sizeData = DEFAULT_SHAPE_SIZES[shape];
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        type: 'shape',
        shape,
        width: sizeData.width,
        height: sizeData.height,
      })
    );

    // Create a custom drag image
    const dragImage = document.createElement('div');
    dragImage.className = 'px-3 py-1 rounded-full bg-brand text-white text-sm font-medium';
    dragImage.textContent = shape;
    dragImage.style.position = 'absolute';
    dragImage.style.left = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-2 px-4 py-3 rounded-full border border-surface-border bg-base/90 shadow-lg backdrop-blur-sm">
        {SHAPES.map(({ name, icon, label }) => (
          <button
            key={name}
            draggable
            onDragStart={(e) => handleDragStart(e, name)}
            title={label}
            className="p-2 rounded-lg hover:bg-surface transition-colors text-copy-secondary hover:text-copy-primary cursor-grab active:cursor-grabbing"
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}
