'use client';

import { useMemo, useState } from 'react';

import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';

import { useCanvasNodeEdit } from '@/components/editor/canvas-node-edit-context';
import type { CanvasFlowEdge } from '@/types/canvas';

export function CanvasEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  selected,
  style,
  label,
}: EdgeProps<CanvasFlowEdge>) {
  const { updateEdgeLabel } = useCanvasNodeEdit();
  const [isEditing, setIsEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState(typeof label === 'string' ? label : '');

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 12,
  });

  const visibleLabel = typeof label === 'string' ? label : '';
  const inputWidth = useMemo(() => {
    return `${Math.max(draftLabel.length, visibleLabel.length, 4) + 1}ch`;
  }, [draftLabel.length, visibleLabel.length]);

  const commitLabel = () => {
    const nextLabel = draftLabel.trim();
    updateEdgeLabel(id, nextLabel);
    setDraftLabel(nextLabel);
    setIsEditing(false);
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        interactionWidth={28}
        style={{
          ...style,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }}
        onDoubleClick={(event) => {
          event.stopPropagation();
          setDraftLabel(visibleLabel);
          setIsEditing(true);
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          onDoubleClick={(event) => {
            event.stopPropagation();
            setDraftLabel(visibleLabel);
            setIsEditing(true);
          }}
        >
          {isEditing ? (
            <input
              autoFocus
              value={draftLabel}
              className="rounded-md border border-surface-border bg-elevated px-2 py-1 text-center text-xs font-medium text-copy-primary outline-none focus:border-brand"
              style={{ width: inputWidth }}
              onChange={(event) => setDraftLabel(event.target.value)}
              onBlur={commitLabel}
              onKeyDown={(event) => {
                event.stopPropagation();

                if (event.key === 'Enter') {
                  event.preventDefault();
                  commitLabel();
                }

                if (event.key === 'Escape') {
                  event.preventDefault();
                  setDraftLabel(visibleLabel);
                  setIsEditing(false);
                }
              }}
            />
          ) : visibleLabel ? (
            <button
              type="button"
              className={`rounded-md border px-2 py-0.5 text-xs font-medium transition-colors ${
                selected
                  ? 'border-brand bg-accent-dim text-copy-primary'
                  : 'border-surface-border bg-elevated/85 text-copy-secondary'
              }`}
            >
              {visibleLabel}
            </button>
          ) : null}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
