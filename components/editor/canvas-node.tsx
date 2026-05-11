'use client';

import { Handle, Position } from '@xyflow/react';
import type { CanvasNodeData } from '@/types/canvas';

interface CanvasNodeProps {
  data: CanvasNodeData;
  selected?: boolean;
}

export function CanvasNode({ data, selected }: CanvasNodeProps) {
  const { label, color, shape, width, height } = data;

  const commonClasses = `
    flex items-center justify-center
    border-2 rounded
    transition-all duration-150
    ${selected ? 'ring-2 ring-offset-2' : ''}
  `.trim();

  const styleVars = {
    '--border-color': color,
    '--bg-color': `${color}15`,
    '--ring-color': color,
  } as React.CSSProperties & { '--border-color': string; '--bg-color': string; '--ring-color': string };

  return (
    <div
      className={commonClasses}
      style={{
        width,
        height,
        borderColor: color,
        backgroundColor: `${color}15`,
        boxShadow: selected ? `0 0 0 2px ${color}40` : 'none',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="text-center text-xs font-medium text-white pointer-events-none truncate px-2">
        {label || shape}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
