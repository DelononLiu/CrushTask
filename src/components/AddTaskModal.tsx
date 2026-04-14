'use client';

import { useState } from 'react';
import { useTask } from '@/context/TaskContext';
import { Task } from '@/types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId: string | null;
}

export default function AddTaskModal({ isOpen, onClose, parentId }: AddTaskModalProps) {
  const { addTask } = useTask();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [tags, setTags] = useState('');
  const [techStack, setTechStack] = useState('');
  const [designNotes, setDesignNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask(parentId, {
      title: title.trim(),
      description: description.trim(),
      status: 'pending',
      priority,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      techStack: techStack.split(',').map(t => t.trim()).filter(Boolean),
      designNotes: designNotes.trim(),
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setTags('');
    setTechStack('');
    setDesignNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto border border-neutral-800">
        <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">
            {parentId ? '添加子任务' : '添加任务'}
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-1">标题 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="任务标题"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-1">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="任务描述"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-1">优先级</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Task['priority'])}
              className="w-full bg-neutral-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-1">标签 (逗号分隔)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-neutral-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="前端, UI, 重要"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-1">技术栈 (逗号分隔)</label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full bg-neutral-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="React, TypeScript"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-1">设计备注</label>
            <textarea
              value={designNotes}
              onChange={(e) => setDesignNotes(e.target.value)}
              className="w-full bg-neutral-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="设计相关说明"
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-neutral-800 text-neutral-400 rounded-md hover:bg-neutral-700"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              添加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}