'use client';

import { useState, useEffect } from 'react';
import { TaskProvider } from '@/context/TaskContext';
import MobileLayout from '@/components/MobileLayout';

export default function Home() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return (
    <TaskProvider>
      {isDesktop ? (
        <DesktopLayout />
      ) : (
        <MobileLayout />
      )}
    </TaskProvider>
  );
}

function DesktopLayout() {
  return (
    <div className="h-screen flex bg-[#0a0a0a]">
      <aside className="w-64 border-r border-[#2a2a2a] bg-[#0a0a0a] flex flex-col">
        <div className="p-4 border-b border-[#2a2a2a]">
          <h1 className="text-lg font-semibold text-white">CrushTask</h1>
          <p className="text-xs text-[#71717a]">任务管理器</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <DesktopTaskTree />
        </div>
        <DesktopFooter />
      </aside>
      <main className="flex-1 flex flex-col bg-[#0a0a0a]">
        <DesktopContent />
      </main>
    </div>
  );
}

function DesktopTaskTree() {
  return (
    <div className="text-sm text-[#a1a1aa]" />
  );
}

function DesktopFooter() {
  const menuItems = [
    { icon: '👤', label: '用户' },
    { icon: '⚙️', label: '设置' },
    { icon: 'ℹ️', label: '关于' },
  ];
  
  return (
    <div className="p-2 border-t border-[#2a2a2a]">
      {menuItems.map(item => (
        <button key={item.label} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[#a1a1aa] hover:bg-[#1a1a1a] hover:text-white text-sm">
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function DesktopContent() {
  return (
    <div className="flex-1 flex">
      <div className="w-64 border-r border-[#2a2a2a] p-4">
        <h2 className="text-sm font-medium text-[#a1a1aa] uppercase tracking-wider mb-4">项目列表</h2>
        <div className="text-[#71717a] text-sm">选择左侧项目查看详情</div>
      </div>
      <div className="flex-1 p-4">
        <DesktopTaskDetail />
      </div>
    </div>
  );
}

function DesktopTaskDetail() {
  return (
    <div className="h-full flex items-center justify-center text-[#71717a]">
      <div className="text-center">
        <div className="text-4xl mb-4">📋</div>
        <p>选择一个任务查看详情</p>
      </div>
    </div>
  );
}