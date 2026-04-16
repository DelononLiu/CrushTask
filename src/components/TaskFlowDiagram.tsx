'use client';

import { TaskNode } from '@/types';

interface TaskFlowDiagramProps {
  nodes: TaskNode[];
  currentNodeId?: string;
  onNodeClick: (node: TaskNode) => void;
}

export default function TaskFlowDiagram({ nodes, currentNodeId, onNodeClick }: TaskFlowDiagramProps) {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-[#71717a] text-sm">
        暂无进度节点
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-[#3a3a3a] border-[#52525b]',
    in_progress: 'bg-blue-600/30 border-blue-500',
    completed: 'bg-green-600/30 border-green-500',
    failed: 'bg-red-600/30 border-red-500',
  };

  const nodeStatusColors: Record<string, string> = {
    pending: 'bg-[#52525b]',
    in_progress: 'bg-blue-500',
    completed: 'bg-green-500',
    failed: 'bg-red-500',
  };

  const nodeSize = 80;
  const gapX = 20;
  const gapY = 60;

  const getPosition = (index: number) => {
    const cols = Math.ceil(Math.sqrt(nodes.length));
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = col * (nodeSize + gapX);
    const y = row * (nodeSize + gapY);
    return { x, y };
  };

  const isCurrentNode = (nodeId: string) => nodeId === currentNodeId;

  return (
    <div className="relative w-full min-h-[200px] py-4 overflow-x-auto">
      <svg 
        width={Math.ceil(Math.sqrt(nodes.length)) * (nodeSize + gapX)} 
        height={Math.ceil(nodes.length / Math.ceil(Math.sqrt(nodes.length))) * (nodeSize + gapY)}
        className="mx-auto"
      >
        {nodes.map((node, index) => {
          const pos = getPosition(index);
          const nextNode = nodes[index + 1];
          const nextPos = nextNode ? getPosition(index + 1) : null;
          const isComplete = node.status === 'completed';
          const isCurrent = isCurrentNode(node.id);

          return (
            <g key={node.id}>
              {nextPos && (
                <path
                  d={`M ${pos.x + nodeSize / 2} ${pos.y + nodeSize} 
                      Q ${pos.x + nodeSize / 2} ${pos.y + nodeSize + gapY / 2},
                        ${nextPos.x + nodeSize / 2} ${nextPos.y}`}
                  fill="none"
                  stroke={isComplete ? '#22c55e' : '#52525b'}
                  strokeWidth={2}
                  strokeDasharray={nextNode.status === 'pending' ? '4 4' : 'none'}
                />
              )}
            </g>
          );
        })}

        {nodes.map((node, index) => {
          const pos = getPosition(index);
          const isCurrent = isCurrentNode(node.id);
          const isComplete = node.status === 'completed';

          return (
            <g 
              key={node.id} 
              onClick={() => onNodeClick(node)}
              className="cursor-pointer"
            >
              <rect
                x={pos.x}
                y={pos.y}
                width={nodeSize}
                height={nodeSize}
                rx={12}
                className={`border-2 transition-all duration-200 ${
                  isCurrent 
                    ? `${statusColors[node.status]} shadow-lg shadow-blue-500/30 scale-105` 
                    : statusColors[node.status]
                }`}
              />
              <circle
                cx={pos.x + nodeSize / 2}
                cy={pos.y + nodeSize / 2}
                r={8}
                className={nodeStatusColors[node.status]}
              />
              {isComplete && (
                <path
                  d={`M ${pos.x + nodeSize / 2 - 5} ${pos.y + nodeSize / 2} 
                      L ${pos.x + nodeSize / 2 - 1} ${pos.y + nodeSize / 2 + 4}
                      L ${pos.x + nodeSize / 2 + 5} ${pos.y + nodeSize / 2 - 4}`}
                  fill="none"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              <text
                x={pos.x + nodeSize / 2}
                y={pos.y + nodeSize + 16}
                textAnchor="middle"
                className={`text-xs fill-current ${
                  isCurrent ? 'text-blue-400 font-medium' : 'text-[#a1a1aa]'
                }`}
              >
                {node.title.length > 8 ? node.title.slice(0, 8) + '...' : node.title}
              </text>
              {isCurrent && (
                <text
                  x={pos.x + nodeSize / 2}
                  y={pos.y + nodeSize / 2 + 30}
                  textAnchor="middle"
                  className="text-xs fill-blue-400"
                >
                  进行中
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}