'use client';

import { useState } from 'react';
import { TaskProvider, useTask } from '@/context/TaskContext';
import { Task } from '@/types';
import TaskDetail from '@/components/TaskDetail';

type View = 'list' | 'detail';

function TaskContent() {
  const { tasks } = useTask();
  const [todos, setTodos] = useState<Task[]>(tasks);
  const [activeTab, setActiveTab] = useState<'today' | 'projects' | 'tags' | 'profile'>('today');
  const [selectedProject, setSelectedProject] = useState('全部');
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const projects = ['全部', 'CRM系统', 'AI助手', '学习', '生活'];
  const tags = ['功能', 'Bug', '性能', '设计', '文档'];

  const toggleTask = (taskId: string) => {
    setTodos(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } as Task;
      }
      return t;
    }));
  };

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setCurrentView('detail');
  };

  const goBack = () => {
    setCurrentView('list');
    setSelectedTask(null);
  };

  const filteredTasks = selectedProject === '全部' 
    ? todos 
    : todos.filter(t => t.tags.includes(selectedProject) || t.title.includes(selectedProject));

  const completedCount = todos.filter(t => t.status === 'completed').length;

  if (currentView === 'detail' && selectedTask) {
    return (
      <div className="h-screen flex flex-col bg-[#0a0a0a]">
        <div className="flex items-center p-4 border-b border-gray-800">
          <button 
            onClick={goBack} 
            className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center mr-3"
          >
            ←
          </button>
          <h1 className="text-white font-medium flex-1 truncate">{selectedTask.title}</h1>
        </div>
        <div className="flex-1 overflow-hidden">
          <TaskDetail task={selectedTask} />
        </div>
      </div>
    );
  }

  const renderToday = () => (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">今日任务</h2>
          <p className="text-sm text-gray-500 mt-1">{completedCount}/{todos.length} 完成</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
          U
        </div>
      </div>

      <div className="mb-6">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${todos.length > 0 ? (completedCount / todos.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            onClick={() => openTaskDetail(task)}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer ${
              task.status === 'completed' ? 'bg-gray-900/50 opacity-60' : 'bg-gray-800/50 hover:bg-gray-700'
            }`}
          >
            <button
              onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                task.status === 'completed'
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-transparent' 
                  : 'border-gray-600 hover:border-blue-500'
              }`}
            >
              {task.status === 'completed' && <span className="text-white text-sm">✓</span>}
            </button>
            <div className="flex-1 min-w-0">
              <span className={`block text-base truncate ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'}`}>
                {task.title}
              </span>
              {task.nodes && task.nodes.length > 0 && task.status !== 'completed' && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-blue-400">🧠 {task.nodes.length}个进度节点</span>
                  <span className="text-xs text-gray-500">• 点击查看详情</span>
                </div>
              )}
            </div>
            <span className="text-xs px-2 py-1 rounded-lg bg-gray-700 text-gray-400 shrink-0">
              {task.tags[0] || '任务'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="flex-1 overflow-y-auto p-5">
      <h2 className="text-xl font-bold text-white mb-4">项目</h2>
      <div className="grid grid-cols-2 gap-3">
        {projects.filter(p => p !== '全部').map(project => (
          <button
            key={project}
            onClick={() => setSelectedProject(project)}
            className={`p-4 rounded-2xl text-left transition-all ${
              selectedProject === project
                ? 'bg-gradient-to-br from-blue-600 to-purple-700'
                : 'bg-gray-800/50 hover:bg-gray-700'
            }`}
          >
            <div className="text-lg font-medium text-white">{project}</div>
            <div className="text-sm text-gray-400 mt-1">
              {todos.filter(t => t.title.includes(project)).length} 个任务
            </div>
          </button>
        ))}
      </div>

      {selectedProject !== '全部' && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">{selectedProject} 的任务</h3>
          <div className="space-y-3">
            {todos.filter(t => t.title.includes(selectedProject)).map(task => (
              <div
                key={task.id}
                onClick={() => openTaskDetail(task)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-gray-800/30 cursor-pointer hover:bg-gray-700/50"
              >
                <button
                  onClick={(e) => e.stopPropagation()}
                  onClickCapture={(e) => toggleTask(task.id)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    task.status === 'completed'
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-600'
                  }`}
                >
                  {task.status === 'completed' && <span className="text-white text-xs">✓</span>}
                </button>
                <span className={task.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'}>
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTags = () => (
    <div className="flex-1 overflow-y-auto p-5">
      <h2 className="text-xl font-bold text-white mb-4">标签</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <button
            key={tag}
            className="px-4 py-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            {tag}
            <span className="ml-2 text-xs text-gray-500">
              {todos.filter(t => t.tags.includes(tag)).length}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl text-white font-bold">
          U
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">用户</h2>
          <p className="text-sm text-gray-500">user@example.com</p>
        </div>
      </div>

      <div className="space-y-2">
        {['设置', '通知', '主题', '关于', '帮助'].map(item => (
          <button
            key={item}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-800/30 text-gray-300 hover:bg-gray-700/50"
          >
            <span>{item}</span>
            <span className="text-gray-600">›</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a]">
      {activeTab === 'today' && renderToday()}
      {activeTab === 'projects' && renderProjects()}
      {activeTab === 'tags' && renderTags()}
      {activeTab === 'profile' && renderProfile()}

      <nav className="flex border-t border-gray-800 bg-[#0a0a0a] pb-safe">
        {[
          { id: 'today', icon: '📋', label: '今日' },
          { id: 'projects', icon: '📁', label: '项目' },
          { id: 'tags', icon: '🏷️', label: '标签' },
          { id: 'profile', icon: '👤', label: '我的' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs transition-colors ${
              activeTab === tab.id ? 'text-white' : 'text-gray-500'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default function Home() {
  return (
    <TaskProvider>
      <TaskContent />
    </TaskProvider>
  );
}