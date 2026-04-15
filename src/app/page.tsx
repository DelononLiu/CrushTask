'use client';

import { useState, useEffect } from 'react';
import { TaskProvider } from '@/context/TaskContext';
import TreeMenu from '@/components/TreeMenu';
import TaskDetail from '@/components/TaskDetail';

export default function Home() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <TaskProvider>
      <main className="h-screen flex bg-neutral-900 relative">
        <aside className={`fixed md:fixed top-0 left-0 h-full z-30 border-r border-neutral-800 bg-neutral-900 flex flex-col transition-all duration-300 ${sidebarVisible ? 'w-64 translate-x-0' : 'w-16 -translate-x-full md:translate-x-0'}`}>
          <div className="md:hidden p-4 flex justify-between items-center border-b border-neutral-800">
            <span className="font-medium text-white">CrushTask</span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-neutral-400">✕</button>
          </div>
          <div className={`flex-1 overflow-hidden ${sidebarVisible ? '' : 'md:hidden'}`}>
            <TreeMenu />
          </div>
          <div className={`mt-auto p-4 border-t border-neutral-800 ${sidebarVisible ? '' : 'md:hidden'}`}>
            <div className="text-sm font-medium text-neutral-400">CrushTask</div>
            <div className="text-xs text-neutral-600">任务管理器</div>
          </div>
        </aside>
        
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <section className={`flex-1 bg-neutral-950 relative flex flex-col min-w-0 transition-all duration-300 ${sidebarVisible ? 'md:ml-64' : 'md:ml-16'}`}>
          <div className="flex items-center gap-2 p-4 pb-0 md:pt-4">
            <button
              onClick={() => {
                if (!isMobile) {
                  setSidebarVisible(!sidebarVisible);
                } else {
                  setMobileMenuOpen(true);
                }
              }}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-md text-neutral-400 hover:text-white transition-colors"
            >
              {sidebarVisible ? '◀' : '▶'}
            </button>
            {!sidebarVisible && !isMobile && (
              <button
                onClick={() => setSidebarVisible(true)}
                className="text-neutral-400 hover:text-white text-sm"
              >
                CrushTask
              </button>
            )}
            <span className="md:hidden text-sm text-neutral-400">CrushTask</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <TaskDetail />
          </div>
        </section>
      </main>
    </TaskProvider>
  );
}