'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';

import { CanvasShapeVisual } from '@/components/editor/canvas-shape';
import { useCanvasNodeEdit } from '@/components/editor/canvas-node-edit-context';
import type { CanvasNodeData } from '@/types/canvas';

interface CanvasNodeProps {
  id: string;
  data: CanvasNodeData;
  selected?: boolean;
}

export function CanvasNode({ id, data, selected }: CanvasNodeProps & NodeProps) {
  const { label, color, shape, width, height } = data;
  const { updateNodeLabel } = useCanvasNodeEdit();

  const currentLabel = label || shape;

  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} />
      <CanvasShapeVisual
        shape={shape}
        color={color}
        width={width}
        height={height}
        selected={selected}
        label={currentLabel}
        editable={selected}
        onLabelChange={(nextLabel) => updateNodeLabel(id, nextLabel)}
      />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
