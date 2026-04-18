'use client';

import { useMemo } from 'react';
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

function collectAllTasks(tasks: Task[]): Task[] {
  const result: Task[] = [];
  for (const task of tasks) {
    if (task.nodeType === 'task') {
      result.push(task);
    }
    if (task.children && task.children.length > 0) {
      result.push(...collectAllTasks(task.children));
    }
  }
  return result;
}

function filterTasks(tasks: Task[]): Task[] {
  const allTasks = collectAllTasks(tasks);
  return allTasks.filter(t => t.status === 'in_progress');
}

const getNodeIcon = (task: Task, level: number): string => {
  if (task.nodeType === 'root') {
    if (task.title === 'CrushTask') return '📦';
    if (task.title === '🚀 进行中') return '🚀';
    return '📋';
  }
  if (task.nodeType === 'category' || level === NODE_LEVELS.MODULE) {
    return '📂';
  }
  if (level === NODE_LEVELS.SUBFEATURE) {
    return '🔧';
  }
  if (level === NODE_LEVELS.TASK || task.nodeType === 'task') {
    return task.status === 'completed' ? '✅' : '📝';
  }
  return '📦';
};

export default function TaskTree({ modules, selectedTaskId, onSelectTask }: TaskTreeProps) {
  const productRoot = modules.find(m => m.title === 'CrushTask');
  const filteredTasks = useMemo(() => filterTasks(modules), [modules]);

  const renderTask = (task: Task, level: number = 0) => {
    const hasChildren = task.children && task.children.length > 0;
    const isTask = level === NODE_LEVELS.TASK || task.nodeType === 'task';
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
              : level === NODE_LEVELS.PROJECT
                ? 'text-white font-medium'
                : 'text-gray-400'
          }`}>
            {getNodeIcon(task, level)} {task.title}
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

  const renderFilteredTask = (task: Task, level: number = 0) => {
    const isSelected = task.id === selectedTaskId;
    
    return (
      <div
        key={task.id}
        className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
          isSelected
            ? 'bg-blue-600/30 border-l-2 border-blue-500' 
            : 'hover:bg-gray-800/50 border-l-2 border-transparent'
        }`}
        style={{ paddingLeft: `${12 + level * 16}px` }}
        onClick={() => onSelectTask(task)}
      >
        <span className="w-4" />
        <span className={`w-2 h-2 rounded-full ${statusColors[task.status]}`} />
        <span className={`text-sm truncate ${isSelected ? 'text-[#165DFF] font-medium' : 'text-[#165DFF]'}`}>
          📝 {task.title}
        </span>
        {isSelected && <span className="ml-auto text-[#165DFF]">▶</span>}
      </div>
    );
  };

  const renderInProgressRoot = () => {
    if (filteredTasks.length === 0) return null;

    return (
      <div>
        <div
          className="flex items-center gap-2 px-3 py-2 border-l-2 border-transparent hover:bg-gray-800/50 cursor-pointer"
          style={{ paddingLeft: '12px' }}
        >
          <span className="text-xs">▶</span>
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-sm text-white font-medium">🚀 进行中</span>
        </div>
        <div>
          {filteredTasks.map((task: Task) => renderFilteredTask(task, 1))}
        </div>
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
        {renderInProgressRoot()}
        {productRoot && renderTask(productRoot, NODE_LEVELS.PROJECT)}
      </div>
    </div>
  );
}