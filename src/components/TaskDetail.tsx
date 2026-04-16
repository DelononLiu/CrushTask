'use client';

import { useState, useRef, useEffect } from 'react';
import { Task, TaskNode, AIMessage } from '@/types';

interface TaskDetailProps {
  task: Task;
}

export default function TaskDetail({ task }: TaskDetailProps) {
  const [activeNodeId, setActiveNodeId] = useState<string>(task.currentNodeId || task.nodes?.[0]?.id || '');
  const [input, setInput] = useState('');
  const [msgId, setMsgId] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const nodes = task.nodes || [];
  const activeNode = nodes.find(n => n.id === activeNodeId) || nodes[0];
  const [messages, setMessages] = useState<AIMessage[]>(() => {
    const nodes = task.nodes || [];
    const currentNode = nodes.find(n => n.id === (task.currentNodeId || nodes[0]?.id));
    if (currentNode?.aiMessages.length) return currentNode.aiMessages;
    if (currentNode) {
      return [{ id: 'init', role: 'assistant', content: `你好！我是AI助手，现在是"${currentNode.title}"阶段。告诉我你需要完成什么？`, timestamp: new Date().toLocaleString() }];
    }
    return [];
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const statusColors: Record<string, string> = {
    pending: 'bg-[#52525b]',
    in_progress: 'bg-blue-500',
    completed: 'bg-green-500',
    failed: 'bg-red-500',
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

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      {/* 顶部：横向节点列表 */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-800 overflow-x-auto">
        {nodes.map((node) => {
          const isActive = node.id === activeNodeId;
          const isCurrent = node.id === task.currentNodeId;
          
          return (
            <button
              key={node.id}
              onClick={() => setActiveNodeId(node.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all shrink-0 ${
                isActive 
                  ? 'bg-blue-600/30 border border-blue-500' 
                  : 'bg-gray-800/50 border border-transparent hover:bg-gray-800'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${statusColors[node.status]}`} />
              <span className={`text-sm whitespace-nowrap ${isActive ? 'text-white' : 'text-gray-400'}`}>
                {node.title}
              </span>
              {isCurrent && (
                <span className="text-xs text-blue-400">进行中</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 中间：AI对话 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                : 'bg-gray-800 text-gray-200'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 底部：输入框 */}
      <div className="p-3 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={`与AI讨论"${activeNode?.title}"...`}
            className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={sendMessage}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}