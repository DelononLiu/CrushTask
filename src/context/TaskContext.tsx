'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Task, initialTasks } from '@/types';

interface TaskContextType {
  tasks: Task[];
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  toggleExpand: (taskId: string) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  updateTaskPriority: (taskId: string, priority: Task['priority']) => void;
  addTask: (parentId: string | null, task: Omit<Task, 'id' | 'children' | 'expanded'>) => void;
  deleteTask: (taskId: string) => void;
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

  const updateTaskPriority = (taskId: string, priority: Task['priority']) => {
    setTasks(prev => updateTaskPriorityInTree(prev, taskId, priority));
  };

  const addTask = (parentId: string | null, task: Omit<Task, 'id' | 'children' | 'expanded'>) => {
    const newId = parentId ? `${parentId}-${Date.now()}` : `${Date.now()}`;
    const newTask: Task = { ...task, id: newId, children: [], expanded: true };
    
    if (parentId === null) {
      setTasks(prev => [...prev, newTask]);
    } else {
      setTasks(prev => addTaskToParent(prev, parentId, newTask));
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => removeTaskFromTree(prev, taskId));
  };

  return (
    <TaskContext.Provider value={{ tasks, selectedTask, setSelectedTask, toggleExpand, updateTaskStatus, updateTaskPriority, addTask, deleteTask }}>
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

function updateTaskPriorityInTree(tasks: Task[], taskId: string, priority: Task['priority']): Task[] {
  return tasks.map(task => {
    if (task.id === taskId) {
      return { ...task, priority };
    }
    if (task.children.length > 0) {
      return { ...task, children: updateTaskPriorityInTree(task.children, taskId, priority) };
    }
    return task;
  });
}

function addTaskToParent(tasks: Task[], parentId: string, newTask: Task): Task[] {
  return tasks.map(task => {
    if (task.id === parentId) {
      return { ...task, children: [...task.children, newTask], expanded: true };
    }
    if (task.children.length > 0) {
      return { ...task, children: addTaskToParent(task.children, parentId, newTask) };
    }
    return task;
  });
}

function removeTaskFromTree(tasks: Task[], taskId: string): Task[] {
  return tasks
    .filter(task => task.id !== taskId)
    .map(task => ({
      ...task,
      children: removeTaskFromTree(task.children, taskId),
    }));
}