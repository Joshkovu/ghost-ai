/**
 * Shared canvas types for the collaborative editor
 */

export type NodeShape = 'rectangle' | 'circle' | 'diamond';

export interface CanvasNodeData {
  label: string;
  color: string;
  shape: NodeShape;
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
