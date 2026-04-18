'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import { initialTasks } from '@/types/task';
import TaskTree from '@/components/TaskTree';
import TaskDetail from '@/components/TaskDetail';

function findTaskById(tasks: Task[], id: string): Task | null {
  for (const task of tasks) {
    if (task.id === id) return task;
    if (task.children) {
      const found = findTaskById(task.children, id);
      if (found) return found;
    }
  }
  return null;
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
  const [selectedTaskId, setSelectedTaskId] = useState('t1');
  
  const selectedTask = findTaskById(modules, selectedTaskId) || modules[0]?.children?.[0]?.children?.[0];

  const handleSelectTask = (task: Task) => {
    setSelectedTaskId(task.id);
  };

  return (
    <div className="h-screen flex bg-[#0a0a0a]">
      <TaskTree 
        modules={modules} 
        selectedTaskId={selectedTaskId}
        onSelectTask={handleSelectTask}
      />
      {selectedTask && <TaskDetail task={selectedTask} />}
    </div>
  );
}