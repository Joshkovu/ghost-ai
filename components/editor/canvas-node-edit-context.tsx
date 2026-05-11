'use client';

import { createContext, useContext, type ReactNode } from 'react';

interface CanvasNodeEditContextValue {
  updateNodeLabel: (nodeId: string, label: string) => void;
}

const CanvasNodeEditContext = createContext<CanvasNodeEditContextValue | null>(null);

interface CanvasNodeEditProviderProps {
  updateNodeLabel: (nodeId: string, label: string) => void;
  children: ReactNode;
}

export function CanvasNodeEditProvider({ updateNodeLabel, children }: CanvasNodeEditProviderProps) {
  return (
    <CanvasNodeEditContext.Provider value={{ updateNodeLabel }}>
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