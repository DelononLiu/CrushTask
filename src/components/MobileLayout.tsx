'use client';

import { useState } from 'react';
import TaskPage from './TaskPage';
import ChatPage from './ChatPage';
import ProfilePage from './ProfilePage';

type Tab = 'tasks' | 'chat' | 'profile';

const tabs: { id: Tab; icon: string; label: string }[] = [
  { id: 'tasks', icon: '📋', label: '任务' },
  { id: 'chat', icon: '💬', label: '对话' },
  { id: 'profile', icon: '👤', label: '我的' },
];

export default function MobileLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('tasks');

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a]">
      <main className="flex-1 overflow-hidden">
        {activeTab === 'tasks' && <TaskPage />}
        {activeTab === 'chat' && <ChatPage />}
        {activeTab === 'profile' && <ProfilePage />}
      </main>
      <nav className="flex border-t border-[#2a2a2a] bg-[#0a0a0a]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs transition-colors ${
              activeTab === tab.id
                ? 'text-white'
                : 'text-[#71717a]'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}