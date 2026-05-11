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
import { CanvasNodeEditProvider } from '@/components/editor/canvas-node-edit-context';
import { ShapePanel } from '@/components/editor/shape-panel';
import {
  DEFAULT_NODE_COLOR,
  DEFAULT_SHAPE_SIZES,
  type CanvasFlowNode,
  type CanvasNodeData,
  type NodeShape,
} from '@/types/canvas';

interface CanvasWrapperProps {
  roomId: string;
  children?: ReactNode;
}

const NODE_SHAPES = new Set<NodeShape>(['rectangle', 'circle', 'diamond', 'pill', 'cylinder', 'hexagon']);

function isNodeShape(value: unknown): value is NodeShape {
  return typeof value === 'string' && NODE_SHAPES.has(value as NodeShape);
}

type ShapeDropData = {
  type: 'shape';
  shape: NodeShape;
};

function isShapeDropData(value: unknown): value is ShapeDropData {
  return (
    typeof value === 'object'
    && value !== null
    && 'type' in value
    && 'shape' in value
    && value.type === 'shape'
    && isNodeShape(value.shape)
  );
}

function CanvasDropZone() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useLiveblocksFlow<CanvasFlowNode>({
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
        const data: unknown = JSON.parse(e.dataTransfer.getData('application/json'));

        if (!isShapeDropData(data)) {
          return;
        }

        const { shape } = data;
        const size = DEFAULT_SHAPE_SIZES[shape];
        const flowPosition = screenToFlowPosition({
          x: e.clientX,
          y: e.clientY,
        });

        const nodeData: CanvasNodeData = {
          label: '',
          color: DEFAULT_NODE_COLOR,
          shape,
          width: size.width,
          height: size.height,
        };

        const newNode = {
          id: generateNodeId(shape),
          data: nodeData,
          position: {
            x: flowPosition.x - size.width / 2,
            y: flowPosition.y - size.height / 2,
          },
          initialWidth: size.width,
          initialHeight: size.height,
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

  const updateNodeLabel = useCallback(
    (nodeId: string, nextLabel: string) => {
      const currentNode = nodes.find((node) => node.id === nodeId);

      if (!currentNode) {
        return;
      }

      const changes: NodeChange<CanvasFlowNode>[] = [{
        type: 'replace',
        id: nodeId,
        item: {
          ...currentNode,
          data: {
            ...currentNode.data,
            label: nextLabel,
          },
        } as CanvasFlowNode,
      } as NodeChange<CanvasFlowNode>];

      onNodesChange(changes);
    },
    [nodes, onNodesChange]
  );

  const updateNodeSize = useCallback(
    (nodeId: string, width: number, height: number) => {
      const currentNode = nodes.find((node) => node.id === nodeId);

      if (!currentNode) {
        return;
      }

      const changes: NodeChange<CanvasFlowNode>[] = [{
        type: 'replace',
        id: nodeId,
        item: {
          ...currentNode,
          width,
          height,
          data: {
            ...currentNode.data,
            width,
            height,
          },
        } as CanvasFlowNode,
      } as NodeChange<CanvasFlowNode>];

      onNodesChange(changes);
    },
    [nodes, onNodesChange]
  );

  return (
    <CanvasNodeEditProvider updateNodeLabel={updateNodeLabel} updateNodeSize={updateNodeSize}>
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
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionLineStyle={{ stroke: 'var(--accent-primary)', strokeWidth: 2 }}
          defaultEdgeOptions={{
            animated: false,
            style: {
              stroke: 'var(--accent-primary)',
              strokeWidth: 2,
            },
          }}
          fitView
        >
          <Background />
        </ReactFlow>
      </div>
    </CanvasNodeEditProvider>
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
