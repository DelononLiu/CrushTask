'use client';

import { useState, useEffect } from 'react';
import { TaskProvider } from '@/context/TaskContext';
import TreeMenu from '@/components/TreeMenu';
import TaskDetail from '@/components/TaskDetail';
import SidebarFooter from '@/components/SidebarFooter';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return (
    <TaskProvider>
      <div className="h-screen flex flex-col md:flex-row bg-neutral-900">
        {isDesktop ? (
          <aside className={`flex-shrink-0 h-full border-r border-neutral-800 bg-neutral-900 flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
            <div className={`flex-1 overflow-hidden ${sidebarOpen ? '' : 'hidden'}`}>
              <TreeMenu onTaskSelect={isDesktop ? undefined : () => setSidebarOpen(false)} />
            </div>
            <SidebarFooter visible={sidebarOpen} />
          </aside>
        ) : (
          <>
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <div className="p-4 flex justify-between items-center border-b border-neutral-800">
                <span className="font-medium text-white">CrushTask</span>
                <button onClick={() => setSidebarOpen(false)} className="text-neutral-400">✕</button>
              </div>
              <div className="flex-1 overflow-hidden">
                <TreeMenu onTaskSelect={() => setSidebarOpen(false)} />
              </div>
              <SidebarFooter visible={true} />
            </aside>
            {sidebarOpen && (
              <div className="fixed inset-0 bg-black/50 z-20" onClick={() => setSidebarOpen(false)} />
            )}
          </>
        )}

        <main className="flex-1 flex flex-col min-w-0 bg-neutral-950">
          <header className="flex items-center gap-2 p-4 border-b border-neutral-800">
            <button
              onClick={() => isDesktop ? setSidebarOpen(!sidebarOpen) : setSidebarOpen(true)}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-md text-neutral-400 hover:text-white transition-colors"
            >
              {isDesktop ? (sidebarOpen ? '◀' : '▶') : '☰'}
            </button>
            {!isDesktop && !sidebarOpen && (
              <span className="text-sm text-neutral-400">CrushTask</span>
            )}
          </header>
          <div className="flex-1 overflow-hidden">
            <TaskDetail />
          </div>
        </main>
      </div>
    </TaskProvider>
  );
}