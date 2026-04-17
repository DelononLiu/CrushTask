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
        
        {/* 进度条 */}
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

      {/* AI对话区域 */}
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

      {/* 输入区域 */}
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
    </div>
  );
}