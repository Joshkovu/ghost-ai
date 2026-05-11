'use client';

import type { CSSProperties, ReactNode } from 'react';

import { DEFAULT_NODE_COLOR, type NodeShape } from '@/types/canvas';

type ShapeSize = {
  width: number;
  height: number;
};

interface CanvasShapeVisualProps extends ShapeSize {
  shape: NodeShape;
  color?: string;
  selected?: boolean;
  label: ReactNode;
  labelClassName?: string;
  editable?: boolean;
  onLabelChange?: (value: string) => void;
}

function hexToRgba(hex: string, alpha: number) {
  const normalizedHex = hex.replace('#', '');
  const expandedHex = normalizedHex.length === 3
    ? normalizedHex.split('').map((character) => `${character}${character}`).join('')
    : normalizedHex;

  const red = Number.parseInt(expandedHex.slice(0, 2), 16);
  const green = Number.parseInt(expandedHex.slice(2, 4), 16);
  const blue = Number.parseInt(expandedHex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function getSharedSurfaceStyles(color: string, selected?: boolean): CSSProperties {
  return {
    borderColor: selected ? color : hexToRgba(color, 0.45),
    backgroundColor: hexToRgba(color, 0.14),
    boxShadow: selected ? `0 0 0 2px ${hexToRgba(color, 0.3)}` : 'none',
  };
}

function getSvgStroke(color: string, selected?: boolean) {
  return selected ? color : hexToRgba(color, 0.65);
}

function ShapeLabel({
  label,
  editable,
  onLabelChange,
  color,
  labelClassName,
}: {
  label: ReactNode;
  editable?: boolean;
  onLabelChange?: (value: string) => void;
  color: string;
  labelClassName?: string;
}) {
  const resolvedLabelClassName = typeof labelClassName === 'string' && labelClassName ? labelClassName : 'text-white';

  if (!editable) {
    return (
      <div
        className={`relative z-10 px-3 text-center text-xs font-medium leading-tight pointer-events-none select-none ${resolvedLabelClassName}`}
      >
        {label}
      </div>
    );
  }

  return (
    <div
      className={`relative z-10 px-3 text-center text-xs font-medium leading-tight outline-none ${resolvedLabelClassName}`}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onMouseDown={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
      onBlur={(event) => {
        const nextValue = event.currentTarget.textContent?.trim() || '';
        onLabelChange?.(nextValue);
      }}
      style={{ color }}
    >
      {label}
    </div>
  );
}

function SvgNodeFrame({
  shape,
  color,
  selected,
}: Pick<CanvasShapeVisualProps, 'shape' | 'color' | 'selected'>) {
  const resolvedColor = color ?? DEFAULT_NODE_COLOR;
  const stroke = getSvgStroke(resolvedColor, selected);
  const fill = hexToRgba(resolvedColor, 0.14);

  if (shape === 'diamond') {
    return (
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon
          points="50,0 100,50 50,100 0,50"
          fill={fill}
          stroke={stroke}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  }

  if (shape === 'hexagon') {
    return (
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon
          points="25,0 75,0 100,50 75,100 25,100 0,50"
          fill={fill}
          stroke={stroke}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <rect x="18" y="18" width="64" height="64" rx="16" ry="16" fill={fill} stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <ellipse cx="50" cy="18" rx="32" ry="10" fill={fill} stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <ellipse cx="50" cy="82" rx="32" ry="10" fill={fill} stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <path d="M18 18v64c0 5.5 14.3 10 32 10s32-4.5 32-10V18" fill="none" stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function CanvasShapeVisual({
  shape,
  color = DEFAULT_NODE_COLOR,
  width,
  height,
  selected,
  label,
  labelClassName,
  editable,
  onLabelChange,
}: CanvasShapeVisualProps) {
  const sharedStyle = getSharedSurfaceStyles(color, selected);
  const isCssShape = shape === 'rectangle' || shape === 'pill' || shape === 'circle';
  const radius = shape === 'circle' || shape === 'pill' ? '9999px' : '18px';

  if (!isCssShape) {
    return (
      <div
        className={`relative flex items-center justify-center transition-all duration-150 ${selected ? 'drop-shadow-[0_0_0_2px_var(--tw-ring-color)]' : ''}`}
        style={{
          width,
          height,
        }}
      >
        <SvgNodeFrame shape={shape} color={color} selected={selected} />
        <ShapeLabel label={label} editable={editable} onLabelChange={onLabelChange} color={selected ? '#ffffff' : hexToRgba(color, 0.92)} labelClassName={labelClassName} />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden border-2 transition-all duration-150 ${selected ? 'ring-2 ring-offset-2 ring-offset-base' : ''}`}
      style={{
        width,
        height,
        borderRadius: isCssShape ? radius : '18px',
        ...sharedStyle,
      }}
    >
      <ShapeLabel label={label} editable={editable} onLabelChange={onLabelChange} color={selected ? '#ffffff' : hexToRgba(color, 0.92)} labelClassName={labelClassName} />
    </div>
  );
}

function buildPreviewMarkup(shape: NodeShape, color: string) {
  const stroke = hexToRgba(color, 0.8);
  const fill = hexToRgba(color, 0.16);

  if (shape === 'rectangle' || shape === 'pill' || shape === 'circle') {
    const radius = shape === 'circle' || shape === 'pill' ? '9999px' : '18px';

    return `<div style="width:100%;height:100%;border:2px solid ${stroke};border-radius:${radius};background:${fill};box-sizing:border-box;"></div>`;
  }

  if (shape === 'diamond') {
    return `
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%;display:block;">
        <polygon points="50,0 100,50 50,100 0,50" fill="${fill}" stroke="${stroke}" stroke-width="2" vector-effect="non-scaling-stroke" />
      </svg>
    `;
  }

  if (shape === 'hexagon') {
    return `
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%;display:block;">
        <polygon points="25,0 75,0 100,50 75,100 25,100 0,50" fill="${fill}" stroke="${stroke}" stroke-width="2" vector-effect="non-scaling-stroke" />
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%;display:block;">
      <rect x="18" y="18" width="64" height="64" rx="16" ry="16" fill="${fill}" stroke="${stroke}" stroke-width="2" vector-effect="non-scaling-stroke" />
      <ellipse cx="50" cy="18" rx="32" ry="10" fill="${fill}" stroke="${stroke}" stroke-width="2" vector-effect="non-scaling-stroke" />
      <ellipse cx="50" cy="82" rx="32" ry="10" fill="${fill}" stroke="${stroke}" stroke-width="2" vector-effect="non-scaling-stroke" />
      <path d="M18 18v64c0 5.5 14.3 10 32 10s32-4.5 32-10V18" fill="none" stroke="${stroke}" stroke-width="2" vector-effect="non-scaling-stroke" />
    </svg>
  `;
}

export function createShapeDragPreview(
  shape: NodeShape,
  width: number,
  height: number,
  label: string,
  color: string = DEFAULT_NODE_COLOR,
) {
  const preview = document.createElement('div');
  const isCssShape = shape === 'rectangle' || shape === 'pill' || shape === 'circle';
  const radius = shape === 'circle' || shape === 'pill' ? '9999px' : '18px';

  preview.style.position = 'fixed';
  preview.style.left = '-1000px';
  preview.style.top = '-1000px';
  preview.style.width = `${width}px`;
  preview.style.height = `${height}px`;
  preview.style.display = 'flex';
  preview.style.alignItems = 'center';
  preview.style.justifyContent = 'center';
  preview.style.boxSizing = 'border-box';
  preview.style.filter = 'drop-shadow(0 12px 26px rgba(0, 0, 0, 0.22))';

  if (isCssShape) {
    preview.style.border = `2px solid ${hexToRgba(color, 0.82)}`;
    preview.style.borderRadius = radius;
    preview.style.background = hexToRgba(color, 0.16);
  } else {
    preview.style.background = 'transparent';
    preview.style.border = 'none';
    preview.innerHTML = buildPreviewMarkup(shape, color);
  }

  const text = document.createElement('div');
  text.textContent = label;
  text.style.position = 'absolute';
  text.style.inset = '0';
  text.style.display = 'flex';
  text.style.alignItems = 'center';
  text.style.justifyContent = 'center';
  text.style.padding = '0 12px';
  text.style.color = '#ffffff';
  text.style.fontSize = '12px';
  text.style.fontWeight = '600';
  text.style.textAlign = 'center';
  text.style.pointerEvents = 'none';

  preview.appendChild(text);

  return preview;
}
