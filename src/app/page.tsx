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

function collectChildTasks(tasks: Task[], parentId: string): Task[] {
  const parent = findTaskById(tasks, parentId);
  if (!parent || !parent.children) return [];
  
  const result: Task[] = [];
  const collect = (nodes: Task[]) => {
    for (const node of nodes) {
      if (node.nodeType === 'task') {
        result.push(node);
      }
      if (node.children) {
        collect(node.children);
      }
    }
  };
  collect(parent.children);
  return result;
}

function isAtomicTask(task: Task): boolean {
  return task.nodeType === 'task' && (!task.children || task.children.length === 0);
}

export default function Home() {
  const [modules] = useState(() => expandAllModules(initialTasks));
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const selectedTask = selectedTaskId 
    ? findTaskById(modules, selectedTaskId) 
    : findFirstTask(modules);

  const childTasks = selectedTask ? collectChildTasks(modules, selectedTask.id) : [];

  const handleSelectTask = (task: Task) => {
    setSelectedTaskId(task.id);
    if (isAtomicTask(task)) {
      setViewMode('detail');
    } else {
      setViewMode('list');
    }
    // Close sidebar on mobile after selection
    setSidebarOpen(false);
  };

  const handleBack = () => {
    setViewMode('list');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!selectedTask) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-gray-500">
        加载中...
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#0a0a0a] relative overflow-hidden">
      {/* Mobile menu toggle button */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - drawer on mobile, fixed on desktop */}
      <div className={`
        fixed lg:relative z-40 h-full transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:w-64 w-64
      `}>
        <TaskTree 
          modules={modules} 
          selectedTaskId={selectedTaskId || selectedTask.id}
          onSelectTask={handleSelectTask}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 h-full overflow-hidden lg:block flex flex-col">
        <TaskDetail 
          key={selectedTask.id}
          task={selectedTask}
          viewMode={viewMode}
          onBack={handleBack}
          parentTasks={childTasks}
        />
      </div>
    </div>
  );
}