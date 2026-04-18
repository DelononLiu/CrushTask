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

interface ModuleProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleModule({ title, expanded, onToggle, children }: ModuleProps) {
  return (
    <div className="border-b border-gray-800">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-800/50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-300">{title}</span>
        <span className={`text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {expanded && (
        <div className="px-3 pb-3">
          {children}
        </div>
      )}
    </div>
  );
}

export default function TaskDetail({ task }: TaskDetailProps) {
  const [input, setInput] = useState('');
  const [msgId, setMsgId] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 标签状态：任务说明书 / 任务控制台
  const [activeMainTab, setActiveMainTab] = useState<'manual' | 'console'>('manual');
  
  // 任务说明书子Tab
  const [manualSubTab, setManualSubTab] = useState<'body' | 'context'>('body');
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    goal: true,
    io: true,
    constraints: true,
    acceptance: true,
  });
  
  // AI消息和执行日志
  const [messages, setMessages] = useState<AIMessage[]>([
    { id: 'init', role: 'assistant', content: `你好！我是AI助手，现在是"${task.title}"任务。有什么可以帮你的？`, timestamp: new Date().toLocaleString() }
  ]);
  
  // 执行日志
  const [executionLogs, setExecutionLogs] = useState<string[]>([
    '[系统] 任务初始化完成',
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const isCommand = input.startsWith('/');
    const userMsg: AIMessage = { 
      id: String(msgId), 
      role: 'user', 
      content: input,
      timestamp: new Date().toLocaleString()
    };
    setMsgId(prev => prev + 1);
    setMessages(prev => [...prev, userMsg]);
    
    // 处理命令
    if (isCommand) {
      if (input === '/run') {
        setExecutionLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 开始执行任务...`, `[${new Date().toLocaleTimeString()}] 正在解析任务结构...`]);
        setTimeout(() => {
          setExecutionLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 代码生成完成`, `[${new Date().toLocaleTimeString()}] 构建成功`, `[${new Date().toLocaleTimeString()}] 执行完成`]);
        }, 1500);
      } else if (input === '/result') {
        setExecutionLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 正在生成执行结果...`]);
        setTimeout(() => {
          setExecutionLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 结果已生成`]);
        }, 1000);
      }
    }
    
    setInput('');
    
    setTimeout(() => {
      const responses = [
        '好的，我来帮你分析这个任务。',
        '明白，让我思考一下最佳方案。',
        '收到，我开始执行。',
        isCommand ? '命令已接收，正在处理...' : '好的，我来帮你分析这个任务。',
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
  const constraintsList = task.constraints ? task.constraints.split('\n').filter(c => c.trim()) : [];

  // 任务说明书 - 任务本体
  const renderTaskBody = () => (
    <div className="divide-y divide-gray-800">
      <CollapsibleModule
        title="任务目标"
        expanded={expandedModules.goal}
        onToggle={() => toggleModule('goal')}
      >
        <div className="text-gray-200 text-sm whitespace-pre-wrap">{task.goal || '暂无'}</div>
      </CollapsibleModule>

      <CollapsibleModule
        title="输入 / 输出"
        expanded={expandedModules.io}
        onToggle={() => toggleModule('io')}
      >
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">输入</div>
            <div className="text-gray-200 text-sm whitespace-pre-wrap">{task.input || '暂无'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">输出</div>
            <div className="text-gray-200 text-sm whitespace-pre-wrap">{task.output || '暂无'}</div>
          </div>
        </div>
      </CollapsibleModule>

      <CollapsibleModule
        title="约束条件"
        expanded={expandedModules.constraints}
        onToggle={() => toggleModule('constraints')}
      >
        <div className="space-y-1">
          {constraintsList.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-gray-500 mt-1">•</span>
              <span className="text-gray-300 text-sm">{item.replace(/^[•\-\s]+/, '')}</span>
            </div>
          ))}
          {constraintsList.length === 0 && (
            <span className="text-gray-500 text-sm">暂无约束条件</span>
          )}
        </div>
      </CollapsibleModule>

      <CollapsibleModule
        title="验收标准"
        expanded={expandedModules.acceptance}
        onToggle={() => toggleModule('acceptance')}
      >
        <div className="space-y-2">
          {(task.acceptanceCriteria || []).map((criteria, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => toggleCheck(index)}
            >
              <span className={`w-4 h-4 rounded border flex items-center justify-center ${
                checkedItems[index] 
                  ? 'bg-blue-500 border-blue-500' 
                  : 'border-gray-600'
              }`}>
                {checkedItems[index] && <span className="text-white text-xs">✓</span>}
              </span>
              <span className={`text-sm ${checkedItems[index] ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                {criteria}
              </span>
            </div>
          ))}
        </div>
      </CollapsibleModule>
    </div>
  );

  // 任务说明书 - 上下文
  const renderContext = () => (
    <div className="space-y-4 p-4">
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

  // 任务说明书 - 验收
  const renderAcceptance = () => (
    <div className="space-y-4 p-4">
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

  // 任务说明书
  const renderManual = () => (
    <div className="flex flex-col h-full">
      {/* 任务说明书子Tab */}
      <div className="flex border-b border-gray-800">
        {[
          { id: 'body', label: '任务本体' },
          { id: 'context', label: '上下文' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setManualSubTab(tab.id as typeof manualSubTab)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              manualSubTab === tab.id
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* 任务本体内容 */}
      <div className="flex-1 overflow-y-auto">
        {manualSubTab === 'body' && (
          <>
            {renderTaskBody()}
            <div className="border-t border-gray-800">
              <div className="p-4">
                <h3 className="text-xs font-medium text-gray-500 mb-2">验收</h3>
                {renderAcceptance()}
              </div>
            </div>
          </>
        )}
        {manualSubTab === 'context' && renderContext()}
      </div>
    </div>
  );

  // 任务控制台 - 内容区
  const renderConsoleContent = () => (
    <div className="flex-1 overflow-y-auto space-y-4 p-4">
      {/* 执行日志 */}
      <div className="bg-gray-900 rounded-lg p-3">
        <div className="text-xs font-medium text-gray-400 mb-2">执行日志</div>
        <div className="font-mono text-xs text-green-400 space-y-1">
          {executionLogs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>
      
      {/* 对话历史 */}
      <div className="space-y-3">
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
    </div>
  );

  // 任务控制台
  const renderConsole = () => (
    <div className="flex flex-col h-full">
      {/* 上部分70%：内容展示区 */}
      <div className="h-[70%] overflow-hidden flex flex-col">
        {renderConsoleContent()}
      </div>
      
      {/* 下部分30%：固定输入框 */}
      <div className="h-[30%] border-t border-gray-800 p-3">
        <div className="flex flex-col h-full gap-2">
          <div className="text-xs text-gray-500">支持命令: /run 执行任务, /result 查看结果</div>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="输入指令或消息..."
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

      {/* 主标签切换 */}
      <div className="flex border-b border-gray-800">
        {[
          { id: 'manual', label: '任务说明书' },
          { id: 'console', label: '任务控制台' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveMainTab(tab.id as typeof activeMainTab)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeMainTab === tab.id
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-hidden">
        {activeMainTab === 'manual' && renderManual()}
        {activeMainTab === 'console' && renderConsole()}
      </div>
    </div>
  );
}