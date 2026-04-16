'use client';

export default function ProfilePage() {
  const menuItems = [
    { icon: '👤', label: '个人资料', description: '管理您的账户信息' },
    { icon: '⚙️', label: '设置', description: '应用和系统设置' },
    { icon: '🔔', label: '通知', description: '消息通知偏好' },
    { icon: '🔒', label: '隐私', description: '数据安全和隐私' },
    { icon: 'ℹ️', label: '关于', description: '版本信息和Licenses' },
    { icon: '❓', label: '帮助', description: '使用指南和FAQ' },
  ];

  return (
    <div className="h-full flex flex-col">
      <header className="p-4 border-b border-[#2a2a2a]">
        <h1 className="text-xl font-semibold text-white">我的</h1>
      </header>
      
      <div className="p-4">
        <div className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-lg mb-6">
          <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <h2 className="text-white font-medium">用户</h2>
            <p className="text-xs text-[#71717a]">user@example.com</p>
          </div>
        </div>

        <div className="space-y-2">
          {menuItems.map(item => (
            <button
              key={item.label}
              className="w-full flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors text-left"
            >
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <span className="text-white">{item.label}</span>
              </div>
              <span className="text-[#71717a]">›</span>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-[#1a1a1a] rounded-lg text-center">
          <span className="text-[#71717a] text-sm">CrushTask v1.0.0</span>
        </div>
      </div>
    </div>
  );
}