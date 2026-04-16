'use client';

import { useState } from 'react';
import { useTask } from '@/context/TaskContext';

type Tab = 'detail' | 'chat';

export default function TaskDetail() {
  const { selectedTask, updateTaskStatus } = useTask();
  const [activeTab, setActiveTab] = useState<Tab>('detail');

  const statusLabels = {
    pending: '待处理',
    in_progress: '进行中',
    completed: '已完成',
  };

  const priorityLabels = {
    low: '低',
    medium: '中',
    high: '高',
  };

  const priorityColors = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-red-400',
  };

  const statusColors = {
    pending: 'bg-[#71717a]',
    in_progress: 'bg-yellow-500',
    completed: 'bg-green-500',
  };

  const renderDetail = () => {
    if (!selectedTask) return null;

    return (
      <div className="p-4 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[selectedTask.priority]} bg-[#1a1a1a]`}>
              {priorityLabels[selectedTask.priority]}优先级
            </span>
            <span className={`w-3 h-3 rounded-full ${statusColors[selectedTask.status]}`} />
            <span className="text-sm text-[#71717a]">{statusLabels[selectedTask.status]}</span>
          </div>
          <h1 className="text-xl font-semibold text-white">{selectedTask.title}</h1>
        </div>

        <div>
          <h2 className="text-sm font-medium text-[#71717a] mb-2">描述</h2>
          <p className="text-[#d4d4d8] leading-relaxed">{selectedTask.description}</p>
        </div>

        {selectedTask.tags.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-[#71717a] mb-2">标签</h2>
            <div className="flex flex-wrap gap-2">
              {selectedTask.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-[#1a1a1a] text-[#d4d4d8] text-sm rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {selectedTask.techStack.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-[#71717a] mb-2">技术栈</h2>
            <div className="flex flex-wrap gap-2">
              {selectedTask.techStack.map(tech => (
                <span key={tech} className="px-3 py-1.5 bg-blue-600/20 text-blue-400 text-sm rounded-md border border-blue-600/30">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {selectedTask.designNotes && (
          <div>
            <h2 className="text-sm font-medium text-[#71717a] mb-2">设计备注</h2>
            <div className="p-3 bg-[#1a1a1a] rounded-lg">
              <p className="text-[#d4d4d8] text-sm leading-relaxed">{selectedTask.designNotes}</p>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-sm font-medium text-[#71717a] mb-2">状态</h2>
          <div className="flex gap-2">
            {(['pending', 'in_progress', 'completed'] as const).map(status => (
              <button
                key={status}
                onClick={() => updateTaskStatus(selectedTask.id, status)}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  selectedTask.status === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#1a1a1a] text-[#71717a] hover:bg-[#222]'
                }`}
              >
                {statusLabels[status]}
              </button>
            ))}
          </div>
        </div>

        {selectedTask.children.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-[#71717a] mb-2">子任务 ({selectedTask.children.length})</h2>
            <div className="space-y-2">
              {selectedTask.children.map(child => (
                <div key={child.id} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                  <span className={`w-2 h-2 rounded-full ${statusColors[child.status]}`} />
                  <span className="text-[#d4d4d8] flex-1 text-sm">{child.title}</span>
                  <span className={`text-xs ${priorityColors[child.priority]}`}>
                    {priorityLabels[child.priority]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!selectedTask) {
    return (
      <div className="h-full flex items-center justify-center text-[#71717a]">
        <div className="text-center">
          <div className="text-4xl mb-4">📋</div>
          <p>选择一个任务查看详情</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b border-[#2a2a2a]">
        <button
          onClick={() => setActiveTab('detail')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'detail'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-[#71717a] hover:text-white'
          }`}
        >
          详情
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'chat'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-[#71717a] hover:text-white'
          }`}
        >
          AI 对话
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'detail' ? renderDetail() : <TaskAIChat />}
      </div>
    </div>
  );
}

function TaskAIChat() {
  const [messages, setMessages] = useState<{id: string, role: string, content: string}[]>([
    { id: '1', role: 'assistant', content: '我来帮你分析这个任务...' }
  ]);
  const [input, setInput] = useState('');
  const [msgId, setMsgId] = useState(2);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { id: String(msgId), role: 'user', content: input };
    setMsgId(prev => prev + 1);
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { id: String(msgId + 1), role: 'assistant', content: '明白，让我帮你梳理一下思路...' }]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
              msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-[#1a1a1a] text-[#d4d4d8]'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-[#2a2a2a]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="问AI..."
            className="flex-1 bg-[#1a1a1a] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={sendMessage} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
            发送
          </button>
        </div>
      </div>
    </div>
  );
}