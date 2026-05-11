'use client';

import { useId, type CSSProperties, type ReactNode } from 'react';

import { DEFAULT_NODE_COLOR, DEFAULT_NODE_TEXT_COLOR, type NodeShape } from '@/types/canvas';

type ShapeSize = {
  width: number;
  height: number;
};

interface CanvasShapeVisualProps extends ShapeSize {
  shape: NodeShape;
  color?: string;
  textColor?: string;
  selected?: boolean;
  label: ReactNode;
  labelClassName?: string;
  labelOpacity?: number;
  fontSize?: number;
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

function getSharedSurfaceStyles(color: string, textColor: string, selected?: boolean): CSSProperties {
  return {
    borderColor: selected ? textColor : hexToRgba(textColor, 0.52),
    backgroundColor: color,
    boxShadow: selected ? `0 0 0 2px ${hexToRgba(textColor, 0.28)}` : 'none',
  };
}

function getSvgStroke(textColor: string, selected?: boolean) {
  return selected ? textColor : hexToRgba(textColor, 0.62);
}

function ShapeLabel({
  label,
  editable,
  onLabelChange,
  color,
  labelClassName,
  labelOpacity,
  fontSize,
}: {
  label: ReactNode;
  editable?: boolean;
  onLabelChange?: (value: string) => void;
  color: string;
  labelClassName?: string;
  labelOpacity?: number;
  fontSize?: number;
}) {
  const resolvedLabelClassName = typeof labelClassName === 'string' && labelClassName ? labelClassName : 'text-white';
  const customFontSize = fontSize ? `${fontSize}px` : undefined;

  if (!editable) {
    return (
      <div
        className={`relative z-10 px-3 text-center text-xs font-medium leading-tight pointer-events-none select-none ${resolvedLabelClassName}`}
      >
        <span style={{ color, opacity: labelOpacity, fontSize: customFontSize }}>{label}</span>
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
      style={{ color, opacity: labelOpacity, fontSize: customFontSize }}
    >
      {label}
    </div>
  );
}

function SvgNodeFrame({
  shape,
  color,
  textColor,
  selected,
}: Pick<CanvasShapeVisualProps, 'shape' | 'color' | 'textColor' | 'selected'>) {
  const resolvedColor = color ?? DEFAULT_NODE_COLOR;
  const resolvedTextColor = textColor ?? DEFAULT_NODE_TEXT_COLOR;
  const stroke = getSvgStroke(resolvedTextColor, selected);
  const fill = resolvedColor;
  const gradientId = useId();

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
      <path
        d="M 0,15 L 0,85 A 50,15 0 0,0 100,85 L 100,15 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      <ellipse
        cx="50"
        cy="15"
        rx="50"
        ry="15"
        fill={fill}
        stroke={stroke}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function CanvasShapeVisual({
  shape,
  color = DEFAULT_NODE_COLOR,
  textColor = DEFAULT_NODE_TEXT_COLOR,
  width,
  height,
  selected,
  label,
  labelClassName,
  labelOpacity,
  fontSize,
  editable,
  onLabelChange,
}: CanvasShapeVisualProps) {
  const sharedStyle = getSharedSurfaceStyles(color, textColor, selected);
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
        <SvgNodeFrame shape={shape} color={color} textColor={textColor} selected={selected} />
        <ShapeLabel label={label} editable={editable} onLabelChange={onLabelChange} color={textColor} labelClassName={labelClassName} labelOpacity={labelOpacity} fontSize={fontSize} />
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
      <ShapeLabel label={label} editable={editable} onLabelChange={onLabelChange} color={textColor} labelClassName={labelClassName} labelOpacity={labelOpacity} fontSize={fontSize} />
    </div>
  );
}

function buildPreviewMarkup(shape: NodeShape, color: string) {
  const stroke = hexToRgba(color, 0.8);
  const fill = color;

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
      <defs>
        <linearGradient id="cylinder-preview-body" x1="10" x2="90" y1="50" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="${hexToRgba('#ffffff', 0.12)}" />
          <stop offset="0.18" stop-color="${color}" />
          <stop offset="0.58" stop-color="${hexToRgba(color, 0.86)}" />
          <stop offset="0.86" stop-color="${hexToRgba(color, 0.72)}" />
          <stop offset="1" stop-color="${hexToRgba('#ffffff', 0.12)}" />
        </linearGradient>
        <radialGradient id="cylinder-preview-top" cx="50%" cy="36%" r="70%">
          <stop offset="0" stop-color="${hexToRgba('#ffffff', 0.18)}" />
          <stop offset="0.62" stop-color="${color}" />
          <stop offset="1" stop-color="${hexToRgba(color, 0.72)}" />
        </radialGradient>
        <linearGradient id="cylinder-preview-rim" x1="12" x2="88" y1="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="${hexToRgba('#ffffff', 0.34)}" />
          <stop offset="0.5" stop-color="${hexToRgba('#ffffff', 0.2)}" />
          <stop offset="1" stop-color="${hexToRgba('#ffffff', 0.28)}" />
        </linearGradient>
      </defs>
      <path d="M16 24C16 13 84 13 84 24L91 76C91 88 9 88 9 76Z" fill="url(#cylinder-preview-body)" stroke="${stroke}" stroke-width="2" vector-effect="non-scaling-stroke" />
      <path d="M20 29L15 73" fill="none" stroke="${hexToRgba('#ffffff', 0.2)}" stroke-width="1.4" vector-effect="non-scaling-stroke" />
      <path d="M80 29L85 73" fill="none" stroke="${hexToRgba(color, 0.46)}" stroke-width="1.4" vector-effect="non-scaling-stroke" />
      <path d="M16 24L9 76" fill="none" stroke="${stroke}" stroke-width="2" vector-effect="non-scaling-stroke" />
      <path d="M84 24L91 76" fill="none" stroke="${stroke}" stroke-width="2" vector-effect="non-scaling-stroke" />
      <ellipse cx="50" cy="24" rx="34" ry="11" fill="url(#cylinder-preview-top)" stroke="${stroke}" stroke-width="2" vector-effect="non-scaling-stroke" />
      <ellipse cx="50" cy="26" rx="30" ry="8" fill="none" stroke="url(#cylinder-preview-rim)" stroke-width="1" vector-effect="non-scaling-stroke" />
      <path d="M16 24C16 31 84 31 84 24" fill="none" stroke="${hexToRgba('#ffffff', 0.48)}" stroke-width="1.5" vector-effect="non-scaling-stroke" />
      <path d="M9 76C9 88 91 88 91 76" fill="none" stroke="${stroke}" stroke-width="2" vector-effect="non-scaling-stroke" />
      <path d="M13 76C13 83 87 83 87 76" fill="none" stroke="${hexToRgba('#ffffff', 0.34)}" stroke-width="1.4" vector-effect="non-scaling-stroke" />
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
