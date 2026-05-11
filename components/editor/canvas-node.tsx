'use client';

import { useMemo, useState } from 'react';

import { Handle, NodeResizer, Position, type NodeProps } from '@xyflow/react';

import { CanvasShapeVisual } from '@/components/editor/canvas-shape';
import { useCanvasNodeEdit } from '@/components/editor/canvas-node-edit-context';
import { DEFAULT_NODE_COLOR, DEFAULT_SHAPE_SIZES, type CanvasFlowNode, type NodeShape } from '@/types/canvas';

const MIN_NODE_SIZE = 80;
const NODE_SHAPES = new Set<NodeShape>(['rectangle', 'circle', 'diamond', 'pill', 'cylinder', 'hexagon']);

type CanvasNodeProps = NodeProps<CanvasFlowNode> & {
  width?: number;
  height?: number;
};

export function CanvasNode({ id, data, selected, width, height }: CanvasNodeProps) {
  const { updateNodeLabel, updateNodeSize } = useCanvasNodeEdit();
  const label = typeof data.label === 'string' ? data.label : '';
  const shape = typeof data.shape === 'string' && NODE_SHAPES.has(data.shape) ? data.shape : 'rectangle';
  const color = typeof data.color === 'string' ? data.color : DEFAULT_NODE_COLOR;
  const defaultSize = DEFAULT_SHAPE_SIZES[shape];
  const dataWidth = typeof data.width === 'number' ? data.width : defaultSize.width;
  const dataHeight = typeof data.height === 'number' ? data.height : defaultSize.height;
  const [isEditing, setIsEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState(label);
  const [committedLabel, setCommittedLabel] = useState(label);

  const nodeWidth = width ?? dataWidth;
  const nodeHeight = height ?? dataHeight;

  const displayLabel = useMemo(() => {
    return label.trim() ? label : 'Add label';
  }, [label]);

  const commitLabel = (nextLabel: string) => {
    const normalizedLabel = nextLabel.trim();
    updateNodeLabel(id, normalizedLabel);
    setDraftLabel(normalizedLabel);
    setCommittedLabel(normalizedLabel);
  };

  return (
    <div
      className="relative"
      onDoubleClick={(event) => {
        event.stopPropagation();
        setIsEditing(true);
        setDraftLabel(label);
        setCommittedLabel(label);
      }}
    >
      <NodeResizer
        isVisible={Boolean(selected)}
        minWidth={MIN_NODE_SIZE}
        minHeight={MIN_NODE_SIZE}
        color="var(--accent-primary)"
        handleStyle={{
          width: 8,
          height: 8,
          borderRadius: 9999,
          border: '1px solid var(--surface-border)',
          backgroundColor: 'var(--bg-base)',
        }}
        lineStyle={{
          borderColor: 'var(--accent-primary)',
          opacity: 0.7,
        }}
        onResizeEnd={(_, params) => {
          updateNodeSize(id, params.width, params.height);
        }}
      />
      <Handle type="target" position={Position.Top} />
      <CanvasShapeVisual
        shape={shape}
        color={color}
        width={nodeWidth}
        height={nodeHeight}
        selected={selected}
        label={displayLabel}
        labelClassName={label.trim() ? 'text-white' : 'text-white/45'}
      />
      {isEditing ? (
        <textarea
          autoFocus
          value={draftLabel}
          placeholder="Add label"
          className="nodrag nopan absolute inset-0 z-30 flex items-center justify-center resize-none border-0 bg-transparent px-3 py-0 text-center text-xs font-medium leading-tight text-white outline-none placeholder:text-white/45"
          style={{
            width: nodeWidth,
            height: nodeHeight,
          }}
          onMouseDown={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          onDragStart={(event) => event.preventDefault()}
          onChange={(event) => {
            const nextValue = event.target.value;
            setDraftLabel(nextValue);
            updateNodeLabel(id, nextValue);
          }}
          onBlur={() => {
            setIsEditing(false);
            commitLabel(draftLabel);
          }}
          onKeyDown={(event) => {
            event.stopPropagation();

            if (event.key === 'Escape') {
              event.preventDefault();
              updateNodeLabel(id, committedLabel);
              setDraftLabel(committedLabel);
              setIsEditing(false);
            }
          }}
        />
      ) : null}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
