'use client';

import { useState } from 'react';
import { TaskProvider, useTask } from '@/context/TaskContext';
import { Task } from '@/types';
import TaskDetail from '@/components/TaskDetail';

type View = 'list' | 'detail';
type Level = 'product' | 'feature' | 'task';

function TaskContent() {
  const { tasks } = useTask();
  const products = tasks.filter(t => t.level === 'product');
  const [activeTab, setActiveTab] = useState<'today' | 'products' | 'profile'>('today');
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [expandedFeatureId, setExpandedFeatureId] = useState<string | null>(null);

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setCurrentView('detail');
  };

  const goBack = () => {
    setCurrentView('list');
    setSelectedTask(null);
  };

  const toggleProduct = (productId: string) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
    setExpandedFeatureId(null);
  };

  const toggleFeature = (featureId: string) => {
    setExpandedFeatureId(expandedFeatureId === featureId ? null : featureId);
  };

  const getAllTasks = (): Task[] => {
    const result: Task[] = [];
    const collect = (items: Task[]) => {
      items.forEach(item => {
        if (item.level === 'task' || item.level === 'feature') {
          result.push(item);
        }
        if (item.children?.length) {
          collect(item.children);
        }
      });
    };
    collect(products);
    return result;
  };

  const inProgressTasks = getAllTasks().filter(t => t.status === 'in_progress');
  const pendingTasks = getAllTasks().filter(t => t.status === 'pending');

  const renderToday = () => (
    <div className="flex-1 overflow-y-auto p-5">
      <h2 className="text-2xl font-bold text-white mb-4">今日任务</h2>
      
      {inProgressTasks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-yellow-400 mb-3">进行中 ({inProgressTasks.length})</h3>
          <div className="space-y-2">
            {inProgressTasks.map(task => (
              <div
                key={task.id}
                onClick={() => openTaskDetail(task)}
                className="flex items-center gap-3 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 cursor-pointer hover:bg-yellow-500/20"
              >
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="flex-1">
                  <div className="text-white">{task.title}</div>
                  <div className="text-xs text-gray-500">{task.tags[0]}</div>
                </div>
                <span className="text-xs text-yellow-400">进行中</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">待处理 ({pendingTasks.length})</h3>
          <div className="space-y-2">
            {pendingTasks.slice(0, 5).map(task => (
              <div
                key={task.id}
                onClick={() => openTaskDetail(task)}
                className="flex items-center gap-3 p-4 rounded-2xl bg-gray-800/30 cursor-pointer hover:bg-gray-700/50"
              >
                <span className="w-2 h-2 rounded-full bg-gray-500" />
                <div className="flex-1">
                  <div className="text-gray-300">{task.title}</div>
                  <div className="text-xs text-gray-500">{task.tags[0]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderProductCard = (product: Task) => {
    const features = product.children.filter(c => c.level === 'feature');
    const isExpanded = expandedProductId === product.id;

    return (
      <div key={product.id} className="mb-4">
        <div 
          onClick={() => toggleProduct(product.id)}
          className="p-4 rounded-2xl bg-gray-800/50 cursor-pointer hover:bg-gray-700 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`text-xl transition-transform ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
              <div>
                <div className="text-lg font-medium text-white">{product.title}</div>
                <div className="text-sm text-gray-500">{features.length} 个功能</div>
              </div>
            </div>
            <span className={`w-3 h-3 rounded-full ${
              product.status === 'completed' ? 'bg-green-500' :
              product.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-500'
            }`} />
          </div>
        </div>

        {isExpanded && features.map(feature => {
          const featureTasks = feature.children.filter(c => c.level === 'task');
          const isFeatureExpanded = expandedFeatureId === feature.id;

          return (
            <div key={feature.id} className="mt-2 ml-6">
              <div 
                onClick={() => toggleFeature(feature.id)}
                className="p-3 rounded-xl bg-gray-800/30 cursor-pointer hover:bg-gray-700/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg transition-transform ${isFeatureExpanded ? 'rotate-90' : ''}`}>▶</span>
                    <span className="text-gray-300">{feature.title}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    feature.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    feature.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {featureTasks.length} 任务
                  </span>
                </div>
              </div>

              {isFeatureExpanded && featureTasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => openTaskDetail(task)}
                  className="mt-1 ml-6 p-3 rounded-lg bg-gray-700/20 cursor-pointer hover:bg-gray-600/30 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      task.status === 'completed' ? 'bg-green-500' :
                      task.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} />
                    <span className="text-gray-400 text-sm">{task.title}</span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const renderProducts = () => (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="space-y-2">
        {products.map(renderProductCard)}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl text-white font-bold">U</div>
        <div>
          <h2 className="text-xl font-bold text-white">用户</h2>
          <p className="text-sm text-gray-500">user@example.com</p>
        </div>
      </div>
      <div className="space-y-2">
        {['设置', '通知', '主题', '关于', '帮助'].map(item => (
          <button key={item} className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-800/30 text-gray-300 hover:bg-gray-700/50">
            <span>{item}</span>
            <span className="text-gray-600">›</span>
          </button>
        ))}
      </div>
    </div>
  );

  if (currentView === 'detail' && selectedTask) {
    return (
      <div className="h-screen flex flex-col bg-[#0a0a0a]">
        <div className="flex items-center p-4 border-b border-gray-800">
          <button onClick={goBack} className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center mr-3">←</button>
          <h1 className="text-white font-medium flex-1 truncate">{selectedTask.title}</h1>
        </div>
        <div className="flex-1 overflow-hidden">
          <TaskDetail task={selectedTask} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a]">
      {activeTab === 'today' && renderToday()}
      {activeTab === 'products' && renderProducts()}
      {activeTab === 'profile' && renderProfile()}

      <nav className="flex border-t border-gray-800 bg-[#0a0a0a] pb-safe">
        {[
          { id: 'today', icon: '📋', label: '任务' },
          { id: 'products', icon: '📁', label: '产品' },
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