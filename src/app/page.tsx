'use client';

import { useState } from 'react';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  project: string;
  tag: string;
  dueDate?: string;
}

const sampleTodos: Todo[] = [
  { id: '1', title: '完成用户登录功能', completed: true, project: 'CRM系统', tag: '功能' },
  { id: '2', title: '修复移动端导航问题', completed: false, project: 'AI助手', tag: 'Bug' },
  { id: '3', title: '实现深色模式切换', completed: false, project: 'AI助手', tag: '功能' },
  { id: '4', title: '添加数据导出功能', completed: false, project: 'CRM系统', tag: '功能' },
  { id: '5', title: '优化页面加载速度', completed: false, project: 'AI助手', tag: '性能' },
];

const projects = ['全部', 'CRM系统', 'AI助手', '学习', '生活'];
const tags = ['功能', 'Bug', '性能', '设计', '文档'];

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(sampleTodos);
  const [activeTab, setActiveTab] = useState<'today' | 'projects' | 'tags' | 'profile'>('today');
  const [selectedProject, setSelectedProject] = useState('全部');
  const [newTodo, setNewTodo] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const todo: Todo = {
      id: Date.now().toString(),
      title: newTodo,
      completed: false,
      project: selectedProject === '全部' ? '默认' : selectedProject,
      tag: '待办',
    };
    setTodos(prev => [todo, ...prev]);
    setNewTodo('');
    setShowAddModal(false);
  };

  const filteredTodos = selectedProject === '全部' 
    ? todos 
    : todos.filter(t => t.project === selectedProject);

  const completedCount = todos.filter(t => t.completed).length;

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
            style={{ width: `${(completedCount / todos.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredTodos.map(todo => (
          <div
            key={todo.id}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
              todo.completed ? 'bg-gray-900/50 opacity-60' : 'bg-gray-800/50'
            }`}
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                todo.completed 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-transparent' 
                  : 'border-gray-600 hover:border-blue-500'
              }`}
            >
              {todo.completed && <span className="text-white text-sm">✓</span>}
            </button>
            <span className={`flex-1 text-base ${todo.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
              {todo.title}
            </span>
            <span className="text-xs px-2 py-1 rounded-lg bg-gray-700 text-gray-400">{todo.project}</span>
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
              {todos.filter(t => t.project === project).length} 个任务
            </div>
          </button>
        ))}
        <button
          onClick={() => setShowAddModal(true)}
          className="p-4 rounded-2xl border-2 border-dashed border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-400 transition-all"
        >
          + 新建项目
        </button>
      </div>

      {selectedProject !== '全部' && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">{selectedProject} 的任务</h3>
          <div className="space-y-3">
            {todos.filter(t => t.project === selectedProject).map(todo => (
              <div
                key={todo.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-gray-800/30"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    todo.completed 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-600'
                  }`}
                >
                  {todo.completed && <span className="text-white text-xs">✓</span>}
                </button>
                <span className={todo.completed ? 'text-gray-500 line-through' : 'text-white'}>
                  {todo.title}
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
              {todos.filter(t => t.tag === tag).length}
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

      <button
        onClick={() => setShowAddModal(true)}
        className="absolute bottom-24 right-5 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl shadow-lg shadow-purple-500/30 flex items-center justify-center"
      >
        +
      </button>

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

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end z-50">
          <div className="w-full bg-gray-900 rounded-t-3xl p-5 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">添加任务</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500">✕</button>
            </div>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="输入任务名称..."
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={addTodo}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium"
            >
              添加
            </button>
          </div>
        </div>
      )}
    </div>
  );
}