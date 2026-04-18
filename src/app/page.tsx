'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import { initialTasks } from '@/types/task';
import TaskTree from '@/components/TaskTree';
import TaskDetail from '@/components/TaskDetail';

function findTaskById(tasks: Task[], id: string): Task | null {
  for (const task of tasks) {
    if (task.id === id) return task;
    if (task.children && task.children.length > 0) {
      const found = findTaskById(task.children, id);
      if (found) return found;
    }
  }
  return null;
}

function findFirstTask(tasks: Task[]): Task | null {
  for (const task of tasks) {
    if (task.children && task.children.length > 0) {
      for (const child of task.children) {
        if (child.children && child.children.length > 0) {
          for (const grandchild of child.children) {
            return grandchild;
          }
          return child;
        }
      }
      return task;
    }
  }
  return tasks[0] || null;
}

function expandAllModules(tasks: Task[]): Task[] {
  return tasks.map(task => ({
    ...task,
    expanded: true,
    children: task.children ? expandAllModules(task.children) : []
  }));
}

export default function Home() {
  const [modules] = useState(() => expandAllModules(initialTasks));
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  const selectedTask = selectedTaskId 
    ? findTaskById(modules, selectedTaskId) 
    : findFirstTask(modules);

  const handleSelectTask = (task: Task) => {
    setSelectedTaskId(task.id);
  };

  if (!selectedTask) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-gray-500">
        加载中...
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#0a0a0a]">
      <TaskTree 
        modules={modules} 
        selectedTaskId={selectedTaskId || selectedTask.id}
        onSelectTask={handleSelectTask}
      />
      <TaskDetail key={selectedTask.id} task={selectedTask} />
    </div>
  );
}