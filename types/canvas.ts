/**
 * Shared canvas types for the collaborative editor
 */

export type NodeShape = 'rectangle' | 'circle' | 'diamond' | 'pill' | 'cylinder' | 'hexagon';

export interface CanvasNodeData {
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

export const DEFAULT_SHAPE_SIZES: Record<NodeShape, { width: number; height: number }> = {
  rectangle: { width: 160, height: 100 },
  diamond: { width: 120, height: 120 },
  circle: { width: 100, height: 100 },
  pill: { width: 140, height: 80 },
  cylinder: { width: 120, height: 140 },
  hexagon: { width: 120, height: 120 },
};

export const DEFAULT_NODE_COLOR = '#00c8d4';

