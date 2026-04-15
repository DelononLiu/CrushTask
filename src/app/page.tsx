'use client';

import { useState, useEffect } from 'react';
import { TaskProvider } from '@/context/TaskContext';
import TreeMenu from '@/components/TreeMenu';
import TaskDetail from '@/components/TaskDetail';
import SidebarFooter from '@/components/SidebarFooter';

export default function Home() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarVisible(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(true);
    } else {
      setSidebarVisible(!sidebarVisible);
    }
  };

  return (
    <TaskProvider>
      <div className="h-screen flex">
        {isMobile ? (
          <>
            <aside className={`fixed top-0 left-0 h-full z-30 border-r border-neutral-800 bg-neutral-900 flex flex-col w-64 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <div className="p-4 flex justify-between items-center border-b border-neutral-800">
                <span className="font-medium text-white">CrushTask</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-neutral-400">✕</button>
              </div>
              <div className="flex-1 overflow-hidden">
                <TreeMenu />
              </div>
              <SidebarFooter visible={true} />
            </aside>
            {mobileMenuOpen && (
              <div className="fixed inset-0 bg-black/50 z-20" onClick={() => setMobileMenuOpen(false)} />
            )}
          </>
        ) : (
          <div className={`flex-shrink-0 h-full border-r border-neutral-800 bg-neutral-900 flex flex-col transition-all duration-300 ${sidebarVisible ? 'w-64' : 'w-16'}`}>
            <div className={`flex-1 overflow-hidden ${sidebarVisible ? '' : 'hidden'}`}>
              <TreeMenu />
            </div>
            <SidebarFooter visible={sidebarVisible} />
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0 bg-neutral-950">
          <div className="flex items-center gap-2 p-4">
            <button
              onClick={toggleSidebar}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-md text-neutral-400 hover:text-white transition-colors"
            >
              {isMobile ? (mobileMenuOpen ? '✕' : '☰') : (sidebarVisible ? '◀' : '▶')}
            </button>
            {!isMobile && !sidebarVisible && (
              <button onClick={() => setSidebarVisible(true)} className="text-neutral-400 hover:text-white text-sm">
                CrushTask
              </button>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <TaskDetail />
          </div>
        </div>
      </div>
    </TaskProvider>
  );
}