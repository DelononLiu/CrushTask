'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Task, initialTasks } from '@/types';

interface TaskContextType {
  tasks: Task[];
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  toggleExpand: (taskId: string) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const toggleExpand = (taskId: string) => {
    setTasks(prev => updateTaskExpanded(prev, taskId));
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(prev => updateTaskStatusInTree(prev, taskId, status));
  };

  return (
    <TaskContext.Provider value={{ tasks, selectedTask, setSelectedTask, toggleExpand, updateTaskStatus }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTask must be used within TaskProvider');
  return context;
}

function updateTaskExpanded(tasks: Task[], taskId: string): Task[] {
  return tasks.map(task => {
    if (task.id === taskId) {
      return { ...task, expanded: !task.expanded };
    }
    if (task.children.length > 0) {
      return { ...task, children: updateTaskExpanded(task.children, taskId) };
    }
    return task;
  });
}

function updateTaskStatusInTree(tasks: Task[], taskId: string, status: Task['status']): Task[] {
  return tasks.map(task => {
    if (task.id === taskId) {
      return { ...task, status };
    }
    if (task.children.length > 0) {
      return { ...task, children: updateTaskStatusInTree(task.children, taskId, status) };
    }
    return task;
  });
}