'use client';

import { useState } from 'react';
import { Task } from '@/types';
import { useTask } from '@/context/TaskContext';
import AddTaskModal from './AddTaskModal';

function TaskItem({ task, depth = 0, onAddChild, onSelect }: { task: Task; depth?: number; onAddChild: (parentId: string) => void; onSelect?: () => void }) {
  const { selectedTask, setSelectedTask, toggleExpand } = useTask();
  const isSelected = selectedTask?.id === task.id;
  const hasChildren = task.children.length > 0;

  const statusColors = {
    pending: 'bg-gray-500',
    in_progress: 'bg-yellow-500',
    completed: 'bg-green-500',
  };

  const handleClick = () => {
    setSelectedTask(task);
    onSelect?.();
  };

  return (
    <div>
      <div
        className={`group flex items-center gap-2 py-2 px-3 cursor-pointer transition-colors rounded-md ${
          isSelected ? 'bg-blue-600 text-white' : 'hover:bg-neutral-800 text-neutral-200'
        }`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        onClick={handleClick}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(task.id);
            }}
            className="w-5 h-5 flex items-center justify-center text-xs hover:bg-neutral-700 rounded flex-shrink-0"
          >
            {task.expanded ? '▼' : '▶'}
          </button>
        ) : (
          <span className="w-5 flex-shrink-0" />
        )}
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColors[task.status]}`} />
        <span className="text-sm truncate">{task.title}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddChild(task.id);
          }}
          className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-white text-lg leading-none ml-auto"
        >
          +
        </button>
      </div>
      {hasChildren && task.expanded && (
        <div>
          {task.children.map(child => (
            <TaskItem key={child.id} task={child} depth={depth + 1} onAddChild={onAddChild} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

interface TreeMenuProps {
  onTaskSelect?: () => void;
}

export default function TreeMenu({ onTaskSelect }: TreeMenuProps) {
  const { tasks } = useTask();
  const [modalOpen, setModalOpen] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);

  const handleAddChild = (pid: string) => {
    setParentId(pid);
    setModalOpen(true);
  };

  const handleAddRoot = () => {
    setParentId(null);
    setModalOpen(true);
  };

  return (
    <>
      <div className="h-full overflow-y-auto py-2 text-neutral-200">
        <div className="px-4 mb-2 flex items-center justify-between">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            任务
          </div>
          <button
            onClick={handleAddRoot}
            className="text-neutral-400 hover:text-white text-sm px-2 py-1 rounded hover:bg-neutral-800"
          >
            + 添加
          </button>
        </div>
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} onAddChild={handleAddChild} onSelect={onTaskSelect} />
        ))}
      </div>
      
      <AddTaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        parentId={parentId}
      />
    </>
  );
}