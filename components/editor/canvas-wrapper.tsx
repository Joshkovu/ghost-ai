'use client';

import { ReactNode } from 'react';
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from '@liveblocks/react';
import { ReactFlow, Background, MiniMap, useNodesState, useEdgesState } from '@xyflow/react';
import { useLiveblocksFlow } from '@liveblocks/react-flow';
import '@xyflow/react/dist/style.css';

interface CanvasWrapperProps {
  roomId: string;
  children?: ReactNode;
}

function CanvasContent() {
  const { nodes: liveblocksNodes, edges: liveblocksEdges } = useLiveblocksFlow();
  
  const [nodes, setNodes, onNodesChange] = useNodesState(liveblocksNodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(liveblocksEdges || []);

  // Update local state when Liveblocks state changes
  if (liveblocksNodes && JSON.stringify(nodes) !== JSON.stringify(liveblocksNodes)) {
    setNodes(liveblocksNodes);
  }
  if (liveblocksEdges && JSON.stringify(edges) !== JSON.stringify(liveblocksEdges)) {
    setEdges(liveblocksEdges);
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Background />
      <MiniMap />
    </ReactFlow>
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
