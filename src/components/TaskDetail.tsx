'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Task, AIMessage } from '@/types';

interface TaskDetailProps {
  task: Task;
}

function getInitialMessages(nodes: {id: string; title: string; aiMessages: AIMessage[]}[], activeNodeId: string): AIMessage[] {
  const node = nodes.find(n => n.id === activeNodeId);
  if (node?.aiMessages.length) return node.aiMessages;
  if (node) {
    return [{ id: 'init', role: 'assistant', content: `你好！我是AI助手，现在是"${node.title}"阶段。告诉我你需要完成什么？`, timestamp: new Date().toLocaleString() }];
  }
  return [];
}

export default function TaskDetail({ task }: TaskDetailProps) {
  const nodes = useMemo(() => task.nodes || [], [task.nodes]);
  const defaultNodeId = useMemo(() => task.currentNodeId || nodes[0]?.id || '', [nodes, task.currentNodeId]);
  
  const [activeNodeId, setActiveNodeId] = useState(defaultNodeId);
  const [input, setInput] = useState('');
  const [msgId, setMsgId] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<AIMessage[]>(() => getInitialMessages(nodes, defaultNodeId));
  const [activeTab, setActiveTab] = useState<'chat' | 'workspace'>('chat');

  const activeNode = useMemo(() => nodes.find(n => n.id === activeNodeId) || nodes[0], [nodes, activeNodeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const statusColors: Record<string, string> = {
    pending: 'bg-[#52525b]',
    in_progress: 'bg-blue-500',
    completed: 'bg-green-500',
    failed: 'bg-red-500',
  };

  const statusLabels: Record<string, string> = {
    pending: '待处理',
    in_progress: '进行中',
    completed: '已完成',
    failed: '失败',
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: AIMessage = { 
      id: String(msgId), 
      role: 'user', 
      content: input,
      timestamp: new Date().toLocaleString()
    };
    setMsgId(prev => prev + 1);
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    setTimeout(() => {
      const responses = [
        '好的，我来帮你分析这个任务的下一步工作。',
        '明白，让我思考一下最佳方案。',
        '收到，我开始执行这个任务。',
        '我来帮你完成这部分工作。',
      ];
      const responseMsg: AIMessage = { 
        id: String(msgId), 
        role: 'assistant', 
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleString()
      };
      setMessages(prev => [...prev, responseMsg]);
      setMsgId(prev => prev + 1);
    }, 800);
  };

  const handleNodeChange = (newNodeId: string) => {
    setActiveNodeId(newNodeId);
    setMessages(getInitialMessages(nodes, newNodeId));
  };

  const completedCount = nodes.filter(n => n.status === 'completed').length;
  const progressPercent = nodes.length > 0 ? (completedCount / nodes.length) * 100 : 0;

  const renderWorkspace = () => (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="bg-gray-800/50 rounded-2xl p-4 mb-4">
        <h3 className="text-lg font-medium text-white mb-3">📁 工作区</h3>
        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-gray-700/30 flex items-center gap-3 cursor-pointer hover:bg-gray-600/40">
            <span className="text-2xl">📄</span>
            <div className="flex-1">
              <div className="text-gray-200">任务说明.txt</div>
              <div className="text-xs text-gray-500">{task.description}</div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-gray-700/30 flex items-center gap-3 cursor-pointer hover:bg-gray-600/40">
            <span className="text-2xl">📝</span>
            <div className="flex-1">
              <div className="text-gray-200">设计笔记.md</div>
              <div className="text-xs text-gray-500">{task.designNotes || '暂无笔记'}</div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-gray-700/30 flex items-center gap-3 cursor-pointer hover:bg-gray-600/40">
            <span className="text-2xl">⚛️</span>
            <div className="flex-1">
              <div className="text-gray-200">技术栈</div>
              <div className="text-xs text-gray-500">{task.techStack?.join(', ') || '未指定'}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800/50 rounded-2xl p-4">
        <h3 className="text-lg font-medium text-white mb-3">🔧 可执行操作</h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="p-3 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-left">
            <span className="block text-lg mb-1">📝</span>
            <span className="text-sm">生成代码</span>
          </button>
          <button className="p-3 rounded-xl bg-green-600/20 text-green-400 hover:bg-green-600/30 text-left">
            <span className="block text-lg mb-1">🔍</span>
            <span className="text-sm">分析需求</span>
          </button>
          <button className="p-3 rounded-xl bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 text-left">
            <span className="block text-lg mb-1">📋</span>
            <span className="text-sm">生成文档</span>
          </button>
          <button className="p-3 rounded-xl bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30 text-left">
            <span className="block text-lg mb-1">🚀</span>
            <span className="text-sm">部署测试</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map(msg => (
        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
            msg.role === 'user' 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-sm' 
              : 'bg-gray-800 text-gray-200 rounded-bl-sm border border-gray-700'
          }`}>
            {msg.role === 'assistant' && (
              <div className="flex items-center gap-2 mb-2 text-blue-400 text-xs">
                <span className="text-lg">🤖</span>
                <span>AI助手</span>
              </div>
            )}
            <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
            <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
              {msg.timestamp}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      {/* 头部：任务信息 */}
      <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
            task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
          }`}>
            {statusLabels[task.status]}
          </span>
          <span className="text-xs text-gray-500">{task.tags[0]}</span>
        </div>
        <h2 className="text-lg font-semibold text-white">{task.title}</h2>
        
        {nodes.length > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>进度 {completedCount}/{nodes.length} 节点</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 节点Tab列表 */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-800 overflow-x-auto bg-gray-900">
        {nodes.map((node) => {
          const isActive = node.id === activeNodeId;
          const isCurrent = node.id === task.currentNodeId;
          
          return (
            <button
              key={node.id}
              onClick={() => handleNodeChange(node.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all shrink-0 ${
                isActive 
                  ? 'bg-blue-600/30 border-2 border-blue-500 shadow-lg shadow-blue-500/20' 
                  : 'bg-gray-800/50 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${statusColors[node.status]}`} />
              <span className={`text-sm whitespace-nowrap ${isActive ? 'text-white font-medium' : 'text-gray-400'}`}>
                {node.title}
              </span>
              {isCurrent && (
                <span className="text-xs text-blue-400 animate-pulse">●</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 对话/工作区切换 */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'chat'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          💬 AI对话
        </button>
        <button
          onClick={() => setActiveTab('workspace')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'workspace'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          📁 工作区
        </button>
      </div>

      {/* 主内容区 */}
      {activeTab === 'chat' ? renderChat() : renderWorkspace()}

      {/* 输入区域 */}
      {activeTab === 'chat' && (
        <div className="p-3 border-t border-gray-800 bg-gray-900">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={`与AI讨论"${activeNode?.title}"...`}
              className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
            />
            <button 
              onClick={sendMessage}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30"
            >
              <span className="text-lg">➤</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}