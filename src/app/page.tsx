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
    if (task.nodeType === 'task' && (!task.children || task.children.length === 0)) {
      return task;
    }
    if (task.children && task.children.length > 0) {
      const found = findFirstTask(task.children);
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

function findParentName(tasks: Task[], taskId: string, parentName?: string): string | null {
  for (const task of tasks) {
    if (task.children) {
      for (const child of task.children) {
        if (child.id === taskId) {
          return task.title;
        }
      }
      const found = findParentName(task.children, taskId, task.title);
      if (found) return found;
    }
  }
  return null;
}

function findGrandparentName(tasks: Task[], parentId: string): string | null {
  for (const task of tasks) {
    if (task.children) {
      for (const child of task.children) {
        if (child.id === parentId) {
          return task.title;
        }
      }
      const found = findGrandparentName(task.children, parentId);
      if (found) return found;
    }
  }
  return null;
}

export default function Home() {
  const [modules] = useState(() => expandAllModules(initialTasks));
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [parentTaskId, setParentTaskId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const selectedTask = selectedTaskId 
    ? findTaskById(modules, selectedTaskId) 
    : (findFirstTask(modules) || modules[0]);

  const currentViewMode = selectedTaskId 
    ? viewMode 
    : (selectedTask && isAtomicTask(selectedTask) ? 'detail' : 'list');

  const childTasks = parentTaskId ? collectChildTasks(modules, parentTaskId) : (selectedTask ? collectChildTasks(modules, selectedTask.id) : []);
  
  const currentParentName = selectedTaskId ? findParentName(modules, selectedTaskId) : null;

  const handleSelectTask = (task: Task) => {
    if (selectedTaskId) {
      setParentTaskId(selectedTaskId);
    }
    setSelectedTaskId(task.id);
    if (isAtomicTask(task)) {
      setViewMode('detail');
    } else {
      setViewMode('list');
    }
    setSidebarOpen(false);
  };

  const handleBack = () => {
    const currentParentId = parentTaskId;
    if (currentParentId) {
      const parentTask = findTaskById(modules, currentParentId);
      const grandParentId = findGrandparentName(modules, currentParentId);
      
      setSelectedTaskId(currentParentId);
      setViewMode(parentTask && isAtomicTask(parentTask) ? 'detail' : 'list');
      setParentTaskId(grandParentId);
    } else {
      setSelectedTaskId(null);
      setViewMode('list');
    }
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
    <div className="h-screen flex flex-col bg-[#0a0a0a] overflow-hidden">
      {/* Global Header */}
      <header className="h-12 flex-shrink-0 bg-gray-900 border-b border-gray-800 flex items-center px-2 z-50">
        {/* Left: Menu button + App title + Parent name */}
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleSidebar}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 text-lg"
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
          <span className="text-base font-semibold text-white">CrushTask</span>
          <span className="text-gray-500">|</span>
          {currentParentName ? (
            <span className="text-sm text-gray-400">{currentParentName}</span>
          ) : (
            <span className="text-sm text-gray-500">产品</span>
          )}
        </div>
        
        {/* Right: Placeholder for future actions */}
        <div className="w-8" />
      </header>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - hidden on mobile, visible on desktop */}
        <div className={`
          hidden lg:block h-full
        `}>
          <TaskTree 
            modules={modules} 
            selectedTaskId={selectedTaskId || selectedTask.id}
            onSelectTask={handleSelectTask}
          />
        </div>

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="fixed lg:hidden inset-0 top-12 z-40">
            <TaskTree 
              modules={modules} 
              selectedTaskId={selectedTaskId || selectedTask.id}
              onSelectTask={handleSelectTask}
            />
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 overflow-hidden">
          <TaskDetail 
            key={selectedTask.id}
            task={selectedTask}
            viewMode={currentViewMode}
            onSelectTask={handleSelectTask}
            parentTasks={childTasks}
          />
        </div>
      </div>
    </div>
  );
}