'use client';

import { createContext, useContext, type ReactNode } from 'react';

interface CanvasNodeEditContextValue {
  updateNodeLabel: (nodeId: string, label: string) => void;
  updateNodeSize: (nodeId: string, width: number, height: number) => void;
  updateNodeColors: (nodeId: string, color: string, textColor: string) => void;
  updateNodeFontSize: (nodeId: string, delta: number) => void;
  deleteNode: (nodeId: string) => void;
  updateEdgeLabel: (edgeId: string, label: string) => void;
}

const CanvasNodeEditContext = createContext<CanvasNodeEditContextValue | null>(null);

interface CanvasNodeEditProviderProps {
  updateNodeLabel: (nodeId: string, label: string) => void;
  updateNodeSize: (nodeId: string, width: number, height: number) => void;
  updateNodeColors: (nodeId: string, color: string, textColor: string) => void;
  updateNodeFontSize: (nodeId: string, delta: number) => void;
  deleteNode: (nodeId: string) => void;
  updateEdgeLabel: (edgeId: string, label: string) => void;
  children: ReactNode;
}

export function CanvasNodeEditProvider({
  updateNodeLabel,
  updateNodeSize,
  updateNodeColors,
  updateNodeFontSize,
  deleteNode,
  updateEdgeLabel,
  children,
}: CanvasNodeEditProviderProps) {
  return (
    <CanvasNodeEditContext.Provider value={{ updateNodeLabel, updateNodeSize, updateNodeColors, updateNodeFontSize, deleteNode, updateEdgeLabel }}>
      {children}
    </CanvasNodeEditContext.Provider>
  );
}

export function useCanvasNodeEdit() {
  const context = useContext(CanvasNodeEditContext);

  if (!context) {
    throw new Error('useCanvasNodeEdit must be used within CanvasNodeEditProvider');
  }

  return context;
}
