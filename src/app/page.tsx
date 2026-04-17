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
      <div className="flex-1 overflow-y-auto p-5">
        <h2 className="text-2xl font-bold text-white mb-4">我的产品</h2>
        <div className="space-y-2">
          {products.map(renderProductCard)}
        </div>
      </div>

      <nav className="flex border-t border-gray-800 bg-[#0a0a0a] pb-safe">
        {[
          { id: 'products', icon: '📁', label: '产品' },
          { id: 'tags', icon: '🏷️', label: '标签' },
          { id: 'profile', icon: '👤', label: '我的' },
        ].map(tab => (
          <button
            key={tab.id}
            className="flex-1 py-3 flex flex-col items-center gap-1 text-xs text-gray-500"
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