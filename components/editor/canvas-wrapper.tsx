'use client';

import { ReactNode, useRef, useCallback, useMemo } from 'react';
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from '@liveblocks/react';
import {
  ReactFlow,
  Background,
  ReactFlowProvider,
  NodeTypes,
  useReactFlow,
  type NodeChange,
} from '@xyflow/react';
import { useLiveblocksFlow } from '@liveblocks/react-flow';
import '@xyflow/react/dist/style.css';
import { CanvasNode } from '@/components/editor/canvas-node';
import { ShapePanel } from '@/components/editor/shape-panel';
import { DEFAULT_NODE_COLOR, type CanvasFlowNode, type CanvasNodeData } from '@/types/canvas';

interface CanvasWrapperProps {
  roomId: string;
  children?: ReactNode;
}

function CanvasDropZone() {
  const { nodes, edges, onNodesChange, onEdgesChange } = useLiveblocksFlow<CanvasFlowNode>({
    suspense: true,
  });
  const shapeCountersRef = useRef<Record<string, number>>({});
  const { screenToFlowPosition } = useReactFlow();

  const nodeTypes: NodeTypes = useMemo(() => {
    return {
      canvas: CanvasNode,
    };
  }, []);

  const generateNodeId = useCallback((shape: string) => {
    if (!shapeCountersRef.current[shape]) {
      shapeCountersRef.current[shape] = 0;
    }
    shapeCountersRef.current[shape]++;
    return `${shape}_${Date.now()}_${shapeCountersRef.current[shape]}`;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));

        if (data.type !== 'shape') {
          return;
        }

        const flowPosition = screenToFlowPosition({
          x: e.clientX,
          y: e.clientY,
        });

        const nodeData: CanvasNodeData = {
          label: '',
          color: DEFAULT_NODE_COLOR,
          shape: data.shape,
          width: data.width,
          height: data.height,
        };

        const newNode = {
          id: generateNodeId(data.shape),
          data: nodeData,
          position: {
            x: flowPosition.x - data.width / 2,
            y: flowPosition.y - data.height / 2,
          },
          type: 'canvas',
        };

        const changes: NodeChange<CanvasFlowNode>[] = [{ type: 'add', item: newNode as CanvasFlowNode }];
        onNodesChange(changes);
      } catch (err) {
        console.error('Failed to parse drag data:', err);
      }
    },
    [generateNodeId, onNodesChange, screenToFlowPosition]
  );

  return (
    <div
      className="absolute inset-0 bg-base"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
      </ReactFlow>
    </div>
  );
}

function CanvasContent() {
  return (
    <ReactFlowProvider>
      <CanvasDropZone />
      <ShapePanel />
    </ReactFlowProvider>
  );
}

function CanvasLoadingFallback() {
  return (
    <div className="flex items-center justify-center w-full h-full bg-slate-950">
      <div className="text-center">
        <div className="animate-pulse mb-4">
          <div className="h-8 w-8 bg-slate-700 rounded-full mx-auto"></div>
        </div>
        <p className="text-slate-400 text-sm">Loading canvas...</p>
      </div>
    </div>
  );
}

export function CanvasWrapper({ roomId }: CanvasWrapperProps) {
  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      throttle={16}
    >
      <RoomProvider id={roomId} initialPresence={{ cursor: null, isThinking: false }}>
        <ClientSideSuspense
          fallback={<CanvasLoadingFallback />}
        >
          <CanvasContent />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
