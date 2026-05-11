/**
 * Shared canvas types for the collaborative editor
 */

import type { Edge, Node } from '@xyflow/react';

export type NodeShape = 'rectangle' | 'circle' | 'diamond' | 'pill' | 'cylinder' | 'hexagon';

export interface CanvasNodeData extends Record<string, unknown> {
  label: string;
  color: string;
  shape: NodeShape;
  width: number;
  height: number;
}

export type CanvasNode = {
  id: string;
  data: CanvasNodeData;
  position: {
    x: number;
    y: number;
  };
};

export type CanvasEdge = {
  id: string;
  source: string;
  target: string;
};

export type CanvasFlowNode = Node<CanvasNodeData, 'canvas'>;
export type CanvasFlowEdge = Edge;

export const DEFAULT_SHAPE_SIZES: Record<NodeShape, { width: number; height: number }> = {
  rectangle: { width: 320, height: 190 },
  diamond: { width: 220, height: 220 },
  circle: { width: 220, height: 220 },
  pill: { width: 300, height: 140 },
  cylinder: { width: 220, height: 260 },
  hexagon: { width: 240, height: 210 },
};

export const DEFAULT_NODE_COLOR = '#00c8d4';

