'use client';

import { Task } from '@/types/task';

interface TaskTreeProps {
  modules: Task[];
  selectedTaskId: string | null;
  onSelectTask: (task: Task) => void;
}

const statusColors: Record<string, string> = {
  pending: 'bg-gray-500',
  in_progress: 'bg-blue-500',
  completed: 'bg-green-500',
  rejected: 'bg-red-500',
};

export default function TaskTree({ modules, selectedTaskId, onSelectTask }: TaskTreeProps) {
  const renderTask = (task: Task, level: number = 0) => {
    const hasChildren = task.children && task.children.length > 0;
    const isModule = level === 0;
    const isSubFeature = level === 1;
    const isSelected = task.id === selectedTaskId;

    return (
      <div key={task.id}>
        <div
          className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
            isSelected 
              ? 'bg-blue-600/30 border-l-2 border-blue-500' 
              : 'hover:bg-gray-800/50 border-l-2 border-transparent'
          }`}
          style={{ paddingLeft: `${12 + level * 16}px` }}
          onClick={() => onSelectTask(task)}
        >
          {hasChildren && (
            <span className={`text-xs transition-transform ${task.expanded ? 'rotate-90' : ''}`}>
              ▶
            </span>
          )}
          {!hasChildren && <span className="w-4" />}
          
          <span className={`w-2 h-2 rounded-full ${statusColors[task.status]}`} />
          
          <span className={`text-sm truncate ${
            isModule ? 'text-white font-medium' :
            isSubFeature ? 'text-gray-300' :
            isSelected ? 'text-blue-300' : 'text-gray-400'
          }`}>
            {task.title}
          </span>
          
          {isSelected && <span className="ml-auto text-blue-400">▶</span>}
        </div>

        {hasChildren && task.expanded && (
          <div>
            {task.children.map(child => renderTask(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 h-full bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">任务树</h2>
        <p className="text-xs text-gray-500">CrushTask 产品功能结构</p>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {modules.map(module => (
          <div key={module.id}>
            {renderTask(module, 0)}
          </div>
        ))}
      </div>
    </div>
  );
}