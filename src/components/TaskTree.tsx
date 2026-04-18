'use client';

import { Task } from '@/types/task';
import { TreeNode } from '@/components-core/task-tree';

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

export default function TaskTree({ modules, selectedTaskId, onSelectTask }: TaskTreeProps) {
  const productRoot = modules.find(m => m.title === 'CrushTask');

  return (
    <div className="w-64 h-full bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-3 lg:p-4 border-b border-gray-800">
        <h2 className="text-base lg:text-lg font-semibold text-white">📦 产品</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        {productRoot && (
          <TreeNode 
            task={productRoot} 
            level={NODE_LEVELS.PROJECT} 
            selectedTaskId={selectedTaskId}
            onSelectTask={onSelectTask}
            statusColors={statusColors}
            levels={NODE_LEVELS}
          />
        )}
      </div>
    </div>
  );
}