'use client';

import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Type, Minus, Plus, Trash2 } from 'lucide-react';

import { Handle, NodeResizer, Position, useReactFlow, type NodeProps } from '@xyflow/react';

import { CanvasShapeVisual } from '@/components/editor/canvas-shape';
import { useCanvasNodeEdit } from '@/components/editor/canvas-node-edit-context';
import {
  DEFAULT_NODE_COLOR,
  DEFAULT_NODE_TEXT_COLOR,
  DEFAULT_SHAPE_SIZES,
  NODE_COLORS,
  type CanvasFlowNode,
  type NodeColorPair,
  type NodeShape,
} from '@/types/canvas';

const MIN_NODE_SIZE = 80;
const NODE_SHAPES = new Set<NodeShape>(['rectangle', 'circle', 'diamond', 'pill', 'cylinder', 'hexagon']);
const NODE_HANDLE_POSITIONS = [
  { id: 'top', position: Position.Top },
  { id: 'right', position: Position.Right },
  { id: 'bottom', position: Position.Bottom },
  { id: 'left', position: Position.Left },
] as const;

type SwatchStyle = CSSProperties & {
  '--swatch-glow': string;
};

type CanvasNodeProps = NodeProps<CanvasFlowNode> & {
  width?: number;
  height?: number;
};

export function CanvasNode({ id, data, selected, width, height }: CanvasNodeProps) {
  const { updateNodeLabel, updateNodeSize, updateNodeColors, updateNodeFontSize, deleteNode } = useCanvasNodeEdit();
  const { deleteElements } = useReactFlow();
  const label = typeof data.label === 'string' ? data.label : '';
  const shape = typeof data.shape === 'string' && NODE_SHAPES.has(data.shape) ? data.shape : 'rectangle';
  const color = typeof data.color === 'string' ? data.color : DEFAULT_NODE_COLOR;
  const textColor = typeof data.textColor === 'string' ? data.textColor : DEFAULT_NODE_TEXT_COLOR;
  const defaultSize = DEFAULT_SHAPE_SIZES[shape];
  const dataWidth = typeof data.width === 'number' ? data.width : defaultSize.width;
  const dataHeight = typeof data.height === 'number' ? data.height : defaultSize.height;
  const [isEditing, setIsEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState(label);
  const [committedLabel, setCommittedLabel] = useState(label);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const nodeWidth = width ?? dataWidth;
  const nodeHeight = height ?? dataHeight;

  useLayoutEffect(() => {
    if (!isEditing || !textareaRef.current) {
      return;
    }

    const textarea = textareaRef.current;
    const maxHeight = Math.max(32, nodeHeight - 24);
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [draftLabel, isEditing, nodeHeight]);

  const displayLabel = useMemo(() => {
    return label.trim() ? label : 'Add label';
  }, [label]);

  const commitLabel = (nextLabel: string) => {
    const normalizedLabel = nextLabel.trim();
    updateNodeLabel(id, normalizedLabel);
    setDraftLabel(normalizedLabel);
    setCommittedLabel(normalizedLabel);
  };

  const handleColorSelect = (colorPair: NodeColorPair) => {
    updateNodeColors(id, colorPair.color, colorPair.textColor);
  };

  return (
    <div
      className="group relative"
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
      {selected ? (
        <div
          className="nodrag nopan absolute bottom-full left-1/2 z-40 mb-3 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-surface-border bg-elevated/95 px-2 py-1.5 shadow-lg backdrop-blur"
          onMouseDown={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          onDoubleClick={(event) => event.stopPropagation()}
        >
          {NODE_COLORS.map((colorPair) => {
            const isActive = colorPair.color === color && colorPair.textColor === textColor;
            const swatchStyle: SwatchStyle = {
              '--swatch-glow': `${colorPair.textColor}55`,
              backgroundColor: colorPair.color,
              borderColor: isActive ? colorPair.textColor : 'var(--border-subtle)',
              boxShadow: isActive ? `0 0 0 2px ${colorPair.textColor}` : undefined,
            };

            return (
              <button
                key={colorPair.name}
                type="button"
                aria-label={`Set node color to ${colorPair.name}`}
                title={colorPair.name}
                className="h-5 w-5 rounded-full border transition-shadow hover:shadow-[0_0_0_3px_var(--swatch-glow)] focus:outline-none focus:ring-2 focus:ring-brand"
                style={swatchStyle}
                onClick={(event) => {
                  event.stopPropagation();
                  handleColorSelect(colorPair);
                }}
              >
                <span
                  className="mx-auto block h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: colorPair.textColor,
                    opacity: isActive ? 1 : 0.65,
                  }}
                />
              </button>
            );
          })}
          <div className="mx-1 h-4 w-px bg-surface-border" />
          <button
            type="button"
            aria-label="Decrease text size"
            title="Decrease text size"
            className="flex h-6 w-6 items-center justify-center rounded text-copy-secondary hover:bg-surface hover:text-copy-primary focus:outline-none focus:ring-1 focus:ring-brand"
            onClick={(event) => {
              event.stopPropagation();
              updateNodeFontSize(id, -2);
            }}
          >
            <Minus size={14} />
          </button>
          <button
            type="button"
            aria-label="Increase text size"
            title="Increase text size"
            className="flex h-6 w-6 items-center justify-center rounded text-copy-secondary hover:bg-surface hover:text-copy-primary focus:outline-none focus:ring-1 focus:ring-brand"
            onClick={(event) => {
              event.stopPropagation();
              updateNodeFontSize(id, 2);
            }}
          >
            <Plus size={14} />
          </button>
          <div className="mx-1 h-4 w-px bg-surface-border" />
          <button
            type="button"
            aria-label="Delete shape"
            title="Delete shape"
            className="flex h-6 w-6 items-center justify-center rounded text-copy-secondary hover:bg-surface hover:text-danger focus:outline-none focus:ring-1 focus:ring-danger"
            onClick={(event) => {
              event.stopPropagation();
              deleteElements({ nodes: [{ id }] });
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ) : null}
      {NODE_HANDLE_POSITIONS.map(({ id: handleId, position }) => (
        <Handle
          key={`target-${handleId}`}
          id={`target-${handleId}`}
          type="target"
          position={position}
          className="!h-2 !w-2 !border !border-base !bg-white !opacity-0 !transition-opacity group-hover:!opacity-100"
        />
      ))}
      {NODE_HANDLE_POSITIONS.map(({ id: handleId, position }) => (
        <Handle
          key={`source-${handleId}`}
          id={`source-${handleId}`}
          type="source"
          position={position}
          className="!h-2 !w-2 !border !border-base !bg-white !opacity-0 !transition-opacity group-hover:!opacity-100"
        />
      ))}
      <CanvasShapeVisual
        shape={shape}
        color={color}
        textColor={textColor}
        width={nodeWidth}
        height={nodeHeight}
        selected={selected}
        label={displayLabel}
        labelOpacity={label.trim() ? 1 : 0.45}
        fontSize={data.fontSize as number | undefined}
      />
      {isEditing ? (
        <div
          className="nodrag nopan absolute inset-0 z-30 flex items-center justify-center px-3"
          style={{
            width: nodeWidth,
            height: nodeHeight,
          }}
          onMouseDown={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          onDragStart={(event) => event.preventDefault()}
        >
          <textarea
            ref={textareaRef}
            autoFocus
            rows={1}
            value={draftLabel}
            placeholder="Add label"
            className="w-full resize-none border-0 bg-transparent p-0 text-center text-xs font-medium leading-tight text-white outline-none placeholder:text-white/45"
            style={{
              color: textColor,
              fontSize: data.fontSize ? `${data.fontSize}px` : undefined,
              maxHeight: Math.max(32, nodeHeight - 24),
            }}
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
        </div>
      ) : null}
    </div>
  );
}
