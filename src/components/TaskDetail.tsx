'use client';

import { useState } from 'react';
import { useTask } from '@/context/TaskContext';
import { TaskNode } from '@/types';
import TaskFlowDiagram from './TaskFlowDiagram';

type Tab = 'detail' | 'flow' | 'chat';

export default function TaskDetail() {
  const { selectedTask, updateTaskStatus } = useTask();
  const [activeTab, setActiveTab] = useState<Tab>('flow');
  const [selectedNode, setSelectedNode] = useState<TaskNode | null>(null);

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
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-red-400',
  };

  const statusColors = {
    pending: 'bg-[#71717a]',
    in_progress: 'bg-yellow-500',
    completed: 'bg-green-500',
  };

  const handleNodeClick = (node: TaskNode) => {
    setSelectedNode(node);
    setActiveTab('chat');
  };

  const handleBackToFlow = () => {
    setSelectedNode(null);
    setActiveTab('flow');
  };

  const renderDetail = () => {
    if (!selectedTask) return null;

    return (
      <div className="p-4 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[selectedTask.priority]} bg-[#1a1a1a]`}>
              {priorityLabels[selectedTask.priority]}优先级
            </span>
            <span className={`w-3 h-3 rounded-full ${statusColors[selectedTask.status]}`} />
            <span className="text-sm text-[#71717a]">{statusLabels[selectedTask.status]}</span>
          </div>
          <h1 className="text-xl font-semibold text-white">{selectedTask.title}</h1>
        </div>

        <div>
          <h2 className="text-sm font-medium text-[#71717a] mb-2">描述</h2>
          <p className="text-[#d4d4d8] leading-relaxed">{selectedTask.description}</p>
        </div>

        {selectedTask.tags.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-[#71717a] mb-2">标签</h2>
            <div className="flex flex-wrap gap-2">
              {selectedTask.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-[#1a1a1a] text-[#d4d4d8] text-sm rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {selectedTask.techStack.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-[#71717a] mb-2">技术栈</h2>
            <div className="flex flex-wrap gap-2">
              {selectedTask.techStack.map(tech => (
                <span key={tech} className="px-3 py-1.5 bg-blue-600/20 text-blue-400 text-sm rounded-md border border-blue-600/30">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {selectedTask.designNotes && (
          <div>
            <h2 className="text-sm font-medium text-[#71717a] mb-2">设计备注</h2>
            <div className="p-3 bg-[#1a1a1a] rounded-lg">
              <p className="text-[#d4d4d8] text-sm leading-relaxed">{selectedTask.designNotes}</p>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-sm font-medium text-[#71717a] mb-2">状态</h2>
          <div className="flex gap-2">
            {(['pending', 'in_progress', 'completed'] as const).map(status => (
              <button
                key={status}
                onClick={() => updateTaskStatus(selectedTask.id, status)}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  selectedTask.status === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#1a1a1a] text-[#71717a] hover:bg-[#222]'
                }`}
              >
                {statusLabels[status]}
              </button>
            ))}
          </div>
        </div>

        {selectedTask.children.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-[#71717a] mb-2">子任务 ({selectedTask.children.length})</h2>
            <div className="space-y-2">
              {selectedTask.children.map(child => (
                <div key={child.id} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                  <span className={`w-2 h-2 rounded-full ${statusColors[child.status]}`} />
                  <span className="text-[#d4d4d8] flex-1 text-sm">{child.title}</span>
                  <span className={`text-xs ${priorityColors[child.priority]}`}>
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

  const renderFlow = () => {
    if (!selectedTask) return null;
    
    return (
      <div className="p-4">
        <h2 className="text-sm font-medium text-[#71717a] mb-4">进度流程</h2>
        <TaskFlowDiagram 
          nodes={selectedTask.nodes || []}
          currentNodeId={selectedTask.currentNodeId}
          onNodeClick={handleNodeClick}
        />
      </div>
    );
  };

  const renderChat = () => {
    if (!selectedTask) return null;
    
    const node = selectedNode || selectedTask.nodes?.find(n => n.id === selectedTask.currentNodeId);
    
    if (!node) {
      return (
        <div className="h-full flex items-center justify-center text-[#71717a]">
          <div className="text-center">
            <div className="text-4xl mb-4">🤖</div>
            <p>暂无AI对话记录</p>
            <p className="text-xs mt-2">点击上方进度节点查看对话</p>
          </div>
        </div>
      );
    }

    return (
      <NodeChatView node={node} onBack={handleBackToFlow} />
    );
  };

  if (!selectedTask) {
    return (
      <div className="h-full flex items-center justify-center text-[#71717a]">
        <div className="text-center">
          <div className="text-4xl mb-4">📋</div>
          <p>选择一个任务查看详情</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b border-[#2a2a2a]">
        <button
          onClick={() => setActiveTab('detail')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'detail'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-[#71717a] hover:text-white'
          }`}
        >
          详情
        </button>
        <button
          onClick={() => { setActiveTab('flow'); setSelectedNode(null); }}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'flow'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-[#71717a] hover:text-white'
          }`}
        >
          进度流
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'chat'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-[#71717a] hover:text-white'
          }`}
        >
          AI 对话
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'detail' && renderDetail()}
        {activeTab === 'flow' && renderFlow()}
        {activeTab === 'chat' && renderChat()}
      </div>
    </div>
  );
}

function NodeChatView({ node, onBack }: { node: TaskNode; onBack: () => void }) {
  const [messages, setMessages] = useState(node.aiMessages.length > 0 ? node.aiMessages : [
    { id: 'init', role: 'assistant' as const, content: `你好！我是AI助手，现在是"${node.title}"节点。有什么可以帮你的？`, timestamp: new Date().toLocaleString() }
  ]);
  const [input, setInput] = useState('');
  const [msgId, setMsgId] = useState(messages.length + 1);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { 
      id: String(msgId), 
      role: 'user' as const, 
      content: input,
      timestamp: new Date().toLocaleString()
    };
    setMsgId(prev => prev + 1);
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setTimeout(() => {
      const responses = [
        '好的，我来分析一下这个任务的下一步工作。',
        '明白，我来帮你梳理一下思路。',
        '收到，让我思考一下最佳方案。',
        '好的，我开始执行这个任务。',
      ];
      const responseMsg = { 
        id: String(msgId + 1), 
        role: 'assistant' as const, 
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleString()
      };
      setMessages(prev => [...prev, responseMsg]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center p-3 border-b border-[#2a2a2a] bg-[#1a1a1a]">
        <button onClick={onBack} className="text-[#71717a] hover:text-white mr-3">←</button>
        <div>
          <h3 className="text-white font-medium text-sm">{node.title}</h3>
          <span className="text-xs text-[#71717a]">AI 对话</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
              msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-[#1a1a1a] text-[#d4d4d8]'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-[#71717a]'}`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-[#2a2a2a]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="与AI对话..."
            className="flex-1 bg-[#1a1a1a] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={sendMessage} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
            发送
          </button>
        </div>
      </div>
    </div>
  );
}