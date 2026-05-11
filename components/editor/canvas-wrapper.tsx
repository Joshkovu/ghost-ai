'use client';

import { ReactNode, useRef, useCallback, useMemo, useState } from 'react';
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from '@liveblocks/react';
import {
  ReactFlow,
  Background,
  ReactFlowProvider,
  MarkerType,
  NodeTypes,
  useReactFlow,
  type EdgeChange,
  type EdgeTypes,
  type EdgeMouseHandler,
  type NodeChange,
} from '@xyflow/react';
import { useLiveblocksFlow } from '@liveblocks/react-flow';
import '@xyflow/react/dist/style.css';
import { CanvasEdge } from '@/components/editor/canvas-edge';
import { CanvasNode } from '@/components/editor/canvas-node';
import { CanvasNodeEditProvider } from '@/components/editor/canvas-node-edit-context';
import { ShapePanel } from '@/components/editor/shape-panel';
import {
  DEFAULT_NODE_COLOR,
  DEFAULT_NODE_TEXT_COLOR,
  DEFAULT_SHAPE_SIZES,
  type CanvasFlowNode,
  type CanvasFlowEdge,
  type CanvasNodeData,
  type NodeShape,
} from '@/types/canvas';

interface CanvasWrapperProps {
  roomId: string;
  children?: ReactNode;
}

const NODE_SHAPES = new Set<NodeShape>(['rectangle', 'circle', 'diamond', 'pill', 'cylinder', 'hexagon']);
const EDGE_DEFAULT_STYLE = {
  stroke: 'var(--accent-primary)',
  strokeOpacity: 0.72,
  strokeWidth: 2,
};
const EDGE_ACTIVE_STYLE = {
  stroke: 'var(--accent-primary)',
  strokeOpacity: 1,
  strokeWidth: 3,
  filter: 'drop-shadow(0 0 4px rgba(0, 200, 212, 0.65))',
};
const EDGE_MARKER = {
  type: MarkerType.ArrowClosed,
  color: 'var(--accent-primary)',
  width: 18,
  height: 18,
};

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
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } = useLiveblocksFlow<CanvasFlowNode, CanvasFlowEdge>({
    suspense: true,
  });
  const shapeCountersRef = useRef<Record<string, number>>({});
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const nodeTypes: NodeTypes = useMemo(() => {
    return {
      canvas: CanvasNode,
    };
  }, []);

  const edgeTypes: EdgeTypes = useMemo(() => {
    return {
      canvas: CanvasEdge,
    };
  }, []);

  const generateNodeId = useCallback((shape: string) => {
    if (!shapeCountersRef.current[shape]) {
      shapeCountersRef.current[shape] = 0;
    }
    shapeCountersRef.current[shape]++;
    return `${shape}_${Date.now()}_${shapeCountersRef.current[shape]}`;
  }, []);

  const styledEdges = useMemo(() => {
    return edges.map((edge) => {
      const isActive = edge.selected || edge.id === hoveredEdgeId;
      const edgeLabel = typeof edge.label === 'string' ? edge.label : '';

      return {
        ...edge,
        type: 'canvas',
        label: edgeLabel,
        markerEnd: edge.markerEnd ?? EDGE_MARKER,
        style: {
          ...(edge.style ?? {}),
          ...(isActive ? EDGE_ACTIVE_STYLE : EDGE_DEFAULT_STYLE),
        },
      } satisfies CanvasFlowEdge;
    });
  }, [edges, hoveredEdgeId]);

  const handleEdgeMouseEnter = useCallback<EdgeMouseHandler>((_, edge) => {
    setHoveredEdgeId(edge.id);
  }, []);

  const handleEdgeMouseLeave = useCallback<EdgeMouseHandler>(() => {
    setHoveredEdgeId(null);
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
          textColor: DEFAULT_NODE_TEXT_COLOR,
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

  const updateNodeColors = useCallback(
    (nodeId: string, color: string, textColor: string) => {
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
            color,
            textColor,
          },
        } as CanvasFlowNode,
      } as NodeChange<CanvasFlowNode>];

      onNodesChange(changes);
    },
    [nodes, onNodesChange]
  );

  const updateNodeFontSize = useCallback(
    (nodeId: string, delta: number) => {
      const currentNode = nodes.find((node) => node.id === nodeId);

      if (!currentNode) {
        return;
      }

      const currentSize = currentNode.data.fontSize || 12; // default is text-xs equivalent
      const newSize = Math.max(8, Math.min(64, currentSize + delta));

      const changes: NodeChange<CanvasFlowNode>[] = [{
        type: 'replace',
        id: nodeId,
        item: {
          ...currentNode,
          data: {
            ...currentNode.data,
            fontSize: newSize,
          },
        } as CanvasFlowNode,
      } as NodeChange<CanvasFlowNode>];

      onNodesChange(changes);
    },
    [nodes, onNodesChange]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      const changes: NodeChange<CanvasFlowNode>[] = [{
        type: 'remove',
        id: nodeId,
      }];

      onNodesChange(changes);
    },
    [onNodesChange]
  );

  const updateEdgeLabel = useCallback(
    (edgeId: string, nextLabel: string) => {
      const currentEdge = edges.find((edge) => edge.id === edgeId);

      if (!currentEdge) {
        return;
      }

      const changes: EdgeChange<CanvasFlowEdge>[] = [{
        type: 'replace',
        id: edgeId,
        item: {
          ...currentEdge,
          type: 'canvas',
          label: nextLabel,
        } as CanvasFlowEdge,
      } as EdgeChange<CanvasFlowEdge>];

      onEdgesChange(changes);
    },
    [edges, onEdgesChange]
  );

  return (
    <CanvasNodeEditProvider
      updateNodeLabel={updateNodeLabel}
      updateNodeSize={updateNodeSize}
      updateNodeColors={updateNodeColors}
      updateNodeFontSize={updateNodeFontSize}
      deleteNode={deleteNode}
      updateEdgeLabel={updateEdgeLabel}
    >
      <div
        className="absolute inset-0 bg-base"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <ReactFlow
          nodes={nodes}
          edges={styledEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgeMouseEnter={handleEdgeMouseEnter}
          onEdgeMouseLeave={handleEdgeMouseLeave}
          onConnect={onConnect}
          onDelete={onDelete}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineStyle={{ stroke: 'var(--accent-primary)', strokeWidth: 2 }}
          defaultEdgeOptions={{
            animated: false,
            type: 'canvas',
            markerEnd: EDGE_MARKER,
            style: EDGE_DEFAULT_STYLE,
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
