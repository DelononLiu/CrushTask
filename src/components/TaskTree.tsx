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

const NODE_LEVELS = {
  PROJECT: 0,
  MODULE: 1,
  SUBFEATURE: 2,
  TASK: 3,
};

const levelIcons: Record<number, string> = {
  [NODE_LEVELS.PROJECT]: '📦',
  [NODE_LEVELS.MODULE]: '🧩',
  [NODE_LEVELS.SUBFEATURE]: '🔧',
  [NODE_LEVELS.TASK]: '', // Will be set dynamically based on status
};

const getTaskIcon = (task: Task, level: number): string => {
  if (level !== NODE_LEVELS.TASK) {
    return levelIcons[level];
  }
  // 原子任务：根据状态显示图标
  return task.status === 'completed' ? '✅' : '📝';
};

export default function TaskTree({ modules, selectedTaskId, onSelectTask }: TaskTreeProps) {
  const renderTask = (task: Task, level: number = 0) => {
    const hasChildren = task.children && task.children.length > 0;
    const isTask = level === NODE_LEVELS.TASK;
    const isSelected = task.id === selectedTaskId;
    const canClick = isTask;

    const handleClick = () => {
      if (canClick) {
        onSelectTask(task);
      }
    };

    const handleToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    return (
      <div key={task.id}>
        <div
          className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
            isSelected && isTask
              ? 'bg-blue-600/30 border-l-2 border-blue-500' 
              : canClick
                ? 'hover:bg-gray-800/50 border-l-2 border-transparent'
                : 'border-l-2 border-transparent'
          }`}
          style={{ paddingLeft: `${12 + level * 16}px` }}
          onClick={canClick ? handleClick : handleToggle}
        >
          {hasChildren && (
            <span className={`text-xs transition-transform ${task.expanded ? 'rotate-90' : ''}`}>
              ▶
            </span>
          )}
          {!hasChildren && <span className="w-4" />}
          
          <span className={`w-2 h-2 rounded-full ${statusColors[task.status]}`} />
          
          <span className={`text-sm truncate ${
            isTask
              ? isSelected 
                ? 'text-[#165DFF] font-medium' 
                : 'text-[#165DFF]'
              : level === NODE_LEVELS.PROJECT || level === NODE_LEVELS.MODULE
                ? 'text-white font-medium'
                : 'text-gray-400'
          }`}>
            {getTaskIcon(task, level)} {task.title}
          </span>
          
          {isSelected && isTask && <span className="ml-auto text-[#165DFF]">▶</span>}
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
        <p className="text-xs text-gray-500">产品功能结构</p>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {modules.map(module => (
          <div key={module.id}>
            {renderTask(module, NODE_LEVELS.PROJECT)}
          </div>
        ))}
      </div>
    </div>
  );
}