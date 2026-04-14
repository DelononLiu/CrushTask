'use client';

import { useState } from 'react';
import { TaskProvider } from '@/context/TaskContext';
import TreeMenu from '@/components/TreeMenu';
import TaskDetail from '@/components/TaskDetail';

export default function Home() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <TaskProvider>
      <main className="h-screen flex bg-neutral-900">
        {sidebarVisible && (
          <aside className="w-64 border-r border-neutral-800 bg-neutral-900 flex flex-col">
            <TreeMenu />
            <div className="mt-auto p-4 border-t border-neutral-800">
              <div className="text-sm font-medium text-neutral-400">gTask</div>
              <div className="text-xs text-neutral-600">任务分解管理器</div>
            </div>
          </aside>
        )}
        <section className="flex-1 bg-neutral-950 relative">
          <button
            onClick={() => setSidebarVisible(!sidebarVisible)}
            className="absolute top-4 left-4 z-10 p-2 bg-neutral-800 hover:bg-neutral-700 rounded-md text-neutral-400 hover:text-white transition-colors"
          >
            {sidebarVisible ? '◀' : '▶'}
          </button>
          <TaskDetail />
        </section>
      </main>
    </TaskProvider>
  );
}