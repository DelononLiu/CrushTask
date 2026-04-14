'use client';

import { useState } from 'react';
import { useTask } from '@/context/TaskContext';
import AIChat from './AIChat';

type Tab = 'detail' | 'chat';

export default function TaskDetail() {
  const { selectedTask, updateTaskStatus } = useTask();
  const [activeTab, setActiveTab] = useState<Tab>('detail');

  const statusLabels = {
    pending: '待处理',
    in_progress: '进行中',
    completed: '已完成',
  };

  const statusColors = {
    pending: 'bg-gray-500',
    in_progress: 'bg-yellow-500',
    completed: 'bg-green-500',
  };

  const renderDetail = () => {
    if (!selectedTask) return null;

    return (
      <div className="p-6 overflow-y-auto h-full">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className={`w-3 h-3 rounded-full ${statusColors[selectedTask.status]}`} />
            <span className="text-sm text-neutral-400">{statusLabels[selectedTask.status]}</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">{selectedTask.title}</h1>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-medium text-neutral-400 mb-2">描述</h2>
          <p className="text-neutral-200 leading-relaxed">{selectedTask.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-medium text-neutral-400 mb-3">状态</h2>
          <div className="flex gap-2">
            {(['pending', 'in_progress', 'completed'] as const).map(status => (
              <button
                key={status}
                onClick={() => updateTaskStatus(selectedTask.id, status)}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  selectedTask.status === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                {statusLabels[status]}
              </button>
            ))}
          </div>
        </div>

        {selectedTask.children.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-neutral-400 mb-3">子任务 ({selectedTask.children.length})</h2>
            <div className="space-y-2">
              {selectedTask.children.map(child => (
                <div key={child.id} className="flex items-center gap-3 p-3 bg-neutral-800 rounded-md">
                  <span className={`w-2 h-2 rounded-full ${statusColors[child.status]}`} />
                  <span className="text-neutral-200">{child.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {selectedTask && (
        <div className="flex border-b border-neutral-800">
          <button
            onClick={() => setActiveTab('detail')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'detail'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            详情
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'chat'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            AI 对话
          </button>
        </div>
      )}

      {selectedTask ? (
        activeTab === 'detail' ? renderDetail() : <AIChat />
      ) : (
        <div className="h-full flex items-center justify-center text-neutral-500">
          <div className="text-center">
            <div className="text-4xl mb-4">📋</div>
            <p>请选择一个任务查看详情</p>
          </div>
        </div>
      )}
    </div>
  );
}