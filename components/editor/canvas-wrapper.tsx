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
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  NodeTypes,
} from '@xyflow/react';
import { useLiveblocksFlow } from '@liveblocks/react-flow';
import '@xyflow/react/dist/style.css';
import { CanvasNode } from '@/components/editor/canvas-node';
import { ShapePanel } from '@/components/editor/shape-panel';
import { DEFAULT_NODE_COLOR, type CanvasNodeData } from '@/types/canvas';

interface CanvasWrapperProps {
  roomId: string;
  children?: ReactNode;
}

function CanvasDropZone() {
  const { nodes: liveblocksNodes, edges: liveblocksEdges } = useLiveblocksFlow();
  const canvasRef = useRef<HTMLDivElement>(null);
  const shapeCountersRef = useRef<Record<string, number>>({});
  
  const [nodes, setNodes, onNodesChange] = useNodesState(liveblocksNodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(liveblocksEdges || []);

  // Update local state when Liveblocks state changes
  if (liveblocksNodes && JSON.stringify(nodes) !== JSON.stringify(liveblocksNodes)) {
    setNodes(liveblocksNodes);
  }
  if (liveblocksEdges && JSON.stringify(edges) !== JSON.stringify(liveblocksEdges)) {
    setEdges(liveblocksEdges);
  }

  const nodeTypes: NodeTypes = useMemo(() => {
    return {
      canvas: CanvasNode,
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      className="w-full h-full"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <CanvasDropHandler setNodes={setNodes} />
        <Background />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

interface CanvasDropHandlerProps {
  setNodes: (updater: (prevNodes: any[]) => any[]) => void;
}

function CanvasDropHandler({ setNodes }: CanvasDropHandlerProps) {
  const { screenToFlowPosition } = useReactFlow();
  const shapeCountersRef = useRef<Record<string, number>>({});

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
      e.stopPropagation();

      try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        
        if (data.type === 'shape') {
          // Convert screen coordinates to flow coordinates
          const position = screenToFlowPosition({
            x: e.clientX,
            y: e.clientY,
          });

          // Offset to center the node on the drop point
          const offsetX = position.x - data.width / 2;
          const offsetY = position.y - data.height / 2;

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
              x: offsetX,
              y: offsetY,
            },
            type: 'canvas',
          };

          setNodes((prevNodes) => [...prevNodes, newNode]);
        }
      } catch (err) {
        console.error('Failed to parse drag data:', err);
      }
    },
    [screenToFlowPosition, generateNodeId, setNodes]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="absolute inset-0"
      style={{ pointerEvents: 'auto' }}
    />
  );
}

function CanvasContent() {
  return (
    <>
      <CanvasDropZone />
      <ShapePanel />
    </>
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
