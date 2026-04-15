'use client';

import { useTask } from '@/context/TaskContext';

const menuItems = [
  { icon: '👤', label: '用户', id: 'user' },
  { icon: '⚙️', label: '设置', id: 'settings' },
  { icon: 'ℹ️', label: '关于', id: 'about' },
];

export default function SidebarFooter({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="mt-auto border-t border-neutral-800">
      <div className="p-2 space-y-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors text-sm"
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}