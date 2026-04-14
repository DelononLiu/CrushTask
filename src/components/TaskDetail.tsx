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

  const priorityLabels = {
    low: '低',
    medium: '中',
    high: '高',
  };

  const priorityColors = {
    low: 'text-green-400 bg-green-400/10',
    medium: 'text-yellow-400 bg-yellow-400/10',
    high: 'text-red-400 bg-red-400/10',
  };

  const statusColors = {
    pending: 'bg-gray-500',
    in_progress: 'bg-yellow-500',
    completed: 'bg-green-500',
  };

  const renderDetail = () => {
    if (!selectedTask) return null;

    return (
      <div className="p-6 overflow-y-auto h-full space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[selectedTask.priority]}`}>
              {priorityLabels[selectedTask.priority]}优先级
            </span>
            <span className={`w-3 h-3 rounded-full ${statusColors[selectedTask.status]}`} />
            <span className="text-sm text-neutral-400">{statusLabels[selectedTask.status]}</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">{selectedTask.title}</h1>
          {selectedTask.dueDate && (
            <p className="text-sm text-neutral-500 mt-1">截止日期: {selectedTask.dueDate}</p>
          )}
        </div>

        <div>
          <h2 className="text-sm font-medium text-neutral-400 mb-2">描述</h2>
          <p className="text-neutral-200 leading-relaxed">{selectedTask.description}</p>
        </div>

        <div>
          <h2 className="text-sm font-medium text-neutral-400 mb-2">标签</h2>
          <div className="flex flex-wrap gap-2">
            {selectedTask.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-neutral-800 text-neutral-300 text-sm rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-neutral-400 mb-2">技术栈</h2>
          <div className="flex flex-wrap gap-2">
            {selectedTask.techStack.map(tech => (
              <span key={tech} className="px-3 py-1.5 bg-blue-600/20 text-blue-400 text-sm rounded-md border border-blue-600/30">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-neutral-400 mb-2">设计备注</h2>
          <div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-800">
            <p className="text-neutral-300 leading-relaxed">{selectedTask.designNotes}</p>
          </div>
        </div>

        <div>
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
                <div key={child.id} className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-md border border-neutral-800">
                  <span className={`w-2 h-2 rounded-full ${statusColors[child.status]}`} />
                  <span className="text-neutral-200 flex-1">{child.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[child.priority]}`}>
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