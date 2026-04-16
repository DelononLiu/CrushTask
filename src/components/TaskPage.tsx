'use client';

import { useState } from 'react';
import { useTask } from '@/context/TaskContext';
import { Task } from '@/types';
import TaskDetail from './TaskDetail';

export default function TaskPage() {
  const { tasks, selectedTask, setSelectedTask, toggleExpand } = useTask();
  const [showDetail, setShowDetail] = useState(false);

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setShowDetail(true);
  };

  const handleBack = () => {
    setShowDetail(false);
  };

  if (showDetail && selectedTask) {
    return (
      <div className="h-full flex flex-col">
        <header className="flex items-center p-4 border-b border-[#2a2a2a]">
          <button onClick={handleBack} className="text-white mr-3">←</button>
          <h1 className="text-white font-medium">任务详情</h1>
        </header>
        <div className="flex-1 overflow-y-auto">
          <TaskDetail />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <header className="p-4 border-b border-[#2a2a2a]">
        <h1 className="text-xl font-semibold text-white">CrushTask</h1>
        <p className="text-xs text-[#71717a]">任务管理器</p>
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        {tasks.map(project => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onSelectTask={handleSelectTask}
            toggleExpand={toggleExpand}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, onSelectTask, toggleExpand }: { 
  project: Task; 
  onSelectTask: (task: Task) => void;
  toggleExpand: (id: string) => void;
}) {
  const statusColors: Record<string, string> = {
    pending: 'bg-[#71717a]',
    in_progress: 'bg-yellow-500',
    completed: 'bg-green-500',
  };

  const priorityLabels: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
  };

  const priorityColors: Record<string, string> = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-red-400',
  };

  return (
    <div className="mb-4">
      <div 
        className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-lg"
        onClick={() => toggleExpand(project.id)}
      >
        <span className="text-lg">{project.expanded ? '▼' : '▶'}</span>
        <div className="flex-1">
          <h3 className="text-white font-medium">{project.title}</h3>
          <p className="text-xs text-[#71717a]">{project.children.length} 个任务</p>
        </div>
        <span className={`w-2 h-2 rounded-full ${statusColors[project.status]}`} />
      </div>
      {project.expanded && project.children.length > 0 && (
        <div className="mt-2 ml-4 space-y-2">
          {project.children.map(task => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 bg-[#1a1a1a]/50 rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                onSelectTask(task);
              }}
            >
              <span className={`w-2 h-2 rounded-full ${statusColors[task.status]}`} />
              <span className="flex-1 text-sm text-[#d4d4d8]">{task.title}</span>
              <span className={`text-xs ${priorityColors[task.priority]}`}>
                {priorityLabels[task.priority]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}