/**
 * Shared canvas types for the collaborative editor
 */

import type { Edge, Node } from '@xyflow/react';

export type NodeShape = 'rectangle' | 'circle' | 'diamond' | 'pill' | 'cylinder' | 'hexagon';

export interface CanvasNodeData extends Record<string, unknown> {
  label: string;
  color: string;
  textColor: string;
  shape: NodeShape;
  width: number;
  height: number;
  fontSize?: number;
}

export type CanvasNode = {
  id: string;
  data: CanvasNodeData;
  position: {
    x: number;
    y: number;
  };
};

export type CanvasEdgeData = Record<string, unknown> & {
  label?: string;
};

export type CanvasEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
};

export type CanvasFlowNode = Node<CanvasNodeData, 'canvas'>;
export type CanvasFlowEdge = Edge<CanvasEdgeData, 'canvas'>;

export const DEFAULT_SHAPE_SIZES: Record<NodeShape, { width: number; height: number }> = {
  rectangle: { width: 320, height: 190 },
  diamond: { width: 220, height: 220 },
  circle: { width: 220, height: 220 },
  pill: { width: 300, height: 140 },
  cylinder: { width: 220, height: 260 },
  hexagon: { width: 240, height: 210 },
};

export type NodeColorPair = {
  name: string;
  color: string;
  textColor: string;
};

export const NODE_COLORS: NodeColorPair[] = [
  { name: 'Neutral dark', color: '#1F1F1F', textColor: '#EDEDED' },
  { name: 'Blue', color: '#10233D', textColor: '#52A8FF' },
  { name: 'Purple', color: '#2E1938', textColor: '#BF7AF0' },
  { name: 'Orange', color: '#331B00', textColor: '#FF990A' },
  { name: 'Red', color: '#3C1618', textColor: '#FF6166' },
  { name: 'Pink', color: '#3A1726', textColor: '#F75F8F' },
  { name: 'Green', color: '#0F2E18', textColor: '#62C073' },
  { name: 'Teal', color: '#00C8D4', textColor: '#003A40' },
];

export const DEFAULT_NODE_COLOR_PAIR = NODE_COLORS[7];
export const DEFAULT_NODE_COLOR = DEFAULT_NODE_COLOR_PAIR.color;
export const DEFAULT_NODE_TEXT_COLOR = DEFAULT_NODE_COLOR_PAIR.textColor;

