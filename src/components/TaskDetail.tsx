'use client';

import { useState, useRef, useEffect } from 'react';
import { Task, AIMessage } from '@/types/task';

interface TaskDetailProps {
  task: Task;
}

const statusLabels: Record<string, string> = {
  pending: '待定义',
  in_progress: '执行中',
  completed: '已完成',
  rejected: '已驳回',
};

const statusColors: Record<string, string> = {
  pending: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
  in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  completed: 'bg-green-500/20 text-green-400 border-green-500/50',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/50',
};

const priorityLabels: Record<string, string> = {
  low: '低',
  medium: '中',
  high: '高',
};

export default function TaskDetail({ task }: TaskDetailProps) {
  const [input, setInput] = useState('');
  const [msgId, setMsgId] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'body' | 'context' | 'ai' | 'acceptance'>('body');
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [messages, setMessages] = useState<AIMessage[]>([
    { id: 'init', role: 'assistant', content: `你好！我是AI助手，现在是"${task.title}"任务。有什么可以帮你的？`, timestamp: new Date().toLocaleString() }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        '好的，我来帮你分析这个任务。',
        '明白，让我思考一下最佳方案。',
        '收到，我开始执行。',
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

  const toggleCheck = (index: number) => {
    setCheckedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = task.acceptanceCriteria?.length || 0;

  const renderTaskBody = () => (
    <div className="space-y-4">
      {task.goal && (
        <div>
          <h3 className="text-xs font-medium text-gray-500 mb-1">【任务目标】</h3>
          <div className="text-gray-200 text-sm whitespace-pre-wrap">{task.goal}</div>
        </div>
      )}
      
      {task.input && (
        <div>
          <h3 className="text-xs font-medium text-gray-500 mb-1">【输入】</h3>
          <div className="text-gray-200 text-sm whitespace-pre-wrap">{task.input}</div>
        </div>
      )}
      
      {task.output && (
        <div>
          <h3 className="text-xs font-medium text-gray-500 mb-1">【输出】</h3>
          <div className="text-gray-200 text-sm whitespace-pre-wrap">{task.output}</div>
        </div>
      )}
      
      {task.constraints && (
        <div>
          <h3 className="text-xs font-medium text-gray-500 mb-1">【约束】</h3>
          <div className="text-gray-200 text-sm whitespace-pre-wrap">{task.constraints}</div>
        </div>
      )}
      
      {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-gray-500 mb-1">【验收标准】</h3>
          <div className="space-y-1">
            {task.acceptanceCriteria.map((criteria, index) => (
              <div 
                key={index} 
                className="flex items-start gap-2 cursor-pointer"
                onClick={() => toggleCheck(index)}
              >
                <span className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center ${
                  checkedItems[index] ? 'bg-blue-500 border-blue-500' : 'border-gray-600'
                }`}>
                  {checkedItems[index] && <span className="text-white text-xs">✓</span>}
                </span>
                <span className={`text-sm ${checkedItems[index] ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                  {criteria}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderContext = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-medium text-gray-500 mb-1">关联工程</h3>
        <div className="text-gray-200 text-sm">{task.context?.project || '无'}</div>
      </div>
      <div>
        <h3 className="text-xs font-medium text-gray-500 mb-1">技术栈</h3>
        <div className="flex flex-wrap gap-1">
          {task.context?.techStack?.map((tech, i) => (
            <span key={i} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded">
              {tech}
            </span>
          )) || <span className="text-gray-500 text-sm">无</span>}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-medium text-gray-500 mb-1">相关文件</h3>
        <div className="space-y-1">
          {task.context?.relatedFiles?.map((file, i) => (
            <div key={i} className="text-gray-300 text-sm flex items-center gap-2">
              <span>📄</span> {file}
            </div>
          )) || <span className="text-gray-500 text-sm">无</span>}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-medium text-gray-500 mb-1">依赖任务</h3>
        <div className="text-gray-300 text-sm">
          {task.context?.dependentTasks?.join(', ') || '无'}
        </div>
      </div>
    </div>
  );

  const renderAI = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 p-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-200'
            }`}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1 mb-1 text-blue-400 text-xs">
                  <span>🤖</span> <span>AI助手</span>
                </div>
              )}
              <div>{msg.content}</div>
              <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="与AI对话..."
            className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button 
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );

  const renderAcceptance = () => (
    <div className="space-y-4">
      <h3 className="text-xs font-medium text-gray-500">验收清单（自动同步）</h3>
      <div className="space-y-2">
        {(task.acceptanceCriteria || []).map((criteria, index) => (
          <div 
            key={index} 
            className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer"
            onClick={() => toggleCheck(index)}
          >
            <span className={`w-5 h-5 rounded border flex items-center justify-center ${
              checkedItems[index] 
                ? 'bg-green-500 border-green-500' 
                : 'border-gray-600'
            }`}>
              {checkedItems[index] && <span className="text-white text-xs">✓</span>}
            </span>
            <span className={`text-sm ${checkedItems[index] ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
              {criteria}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-3 pt-4">
        <button className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium">
          通过
        </button>
        <button className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium">
          驳回
        </button>
      </div>
      <div className="text-center text-sm text-gray-500">
        进度: {completedCount}/{totalCount} 已完成
      </div>
    </div>
  );

  return (
    <div className="flex-1 h-full flex flex-col bg-[#0a0a0a]">
      {/* 顶部：任务头部 */}
      <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${statusColors[task.status]}`}>
            {statusLabels[task.status]}
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/50">
            {priorityLabels[task.priority]}优先级
          </span>
        </div>
        <h1 className="text-xl font-semibold text-white">{task.title}</h1>
        <div className="text-sm text-gray-500 mt-1">
          {task.module}{task.subFeature ? ` → ${task.subFeature}` : ''}
        </div>
      </div>

      {/* 四大核心区Tab */}
      <div className="flex border-b border-gray-800">
        {[
          { id: 'body', label: '任务本体' },
          { id: 'context', label: '上下文' },
          { id: 'ai', label: 'AI执行' },
          { id: 'acceptance', label: '验收' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'body' && renderTaskBody()}
        {activeTab === 'context' && renderContext()}
        {activeTab === 'ai' && renderAI()}
        {activeTab === 'acceptance' && renderAcceptance()}
      </div>
    </div>
  );
}