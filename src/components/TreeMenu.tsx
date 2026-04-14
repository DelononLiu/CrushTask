'use client';

import { Task } from '@/types';
import { useTask } from '@/context/TaskContext';

function TaskItem({ task, depth = 0 }: { task: Task; depth?: number }) {
  const { selectedTask, setSelectedTask, toggleExpand } = useTask();
  const isSelected = selectedTask?.id === task.id;
  const hasChildren = task.children.length > 0;

  const statusColors = {
    pending: 'bg-gray-500',
    in_progress: 'bg-yellow-500',
    completed: 'bg-green-500',
  };

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2 px-3 cursor-pointer transition-colors rounded-md ${
          isSelected ? 'bg-blue-600 text-white' : 'hover:bg-neutral-800'
        }`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        onClick={() => setSelectedTask(task)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(task.id);
            }}
            className="w-4 h-4 flex items-center justify-center text-xs hover:bg-neutral-700 rounded"
          >
            {task.expanded ? '▼' : '▶'}
          </button>
        ) : (
          <span className="w-4" />
        )}
        <span className={`w-2 h-2 rounded-full ${statusColors[task.status]}`} />
        <span className="text-sm truncate">{task.title}</span>
      </div>
      {hasChildren && task.expanded && (
        <div>
          {task.children.map(child => (
            <TaskItem key={child.id} task={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreeMenu() {
  const { tasks } = useTask();

  return (
    <div className="h-full overflow-y-auto py-4">
      <div className="px-4 mb-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
        任务分解
      </div>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}