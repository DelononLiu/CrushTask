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

type FlowNode = 'spec' | 'code' | 'run' | 'review';

const flowNodes: { id: FlowNode; label: string }[] = [
  { id: 'spec', label: 'Spec' },
  { id: 'code', label: 'Code' },
  { id: 'run', label: 'Run' },
  { id: 'review', label: 'Review' },
];

export default function TaskDetail({ task }: TaskDetailProps) {
  const [input, setInput] = useState('');
  const [msgId, setMsgId] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 上半部分流程节点状态
  const [activeFlowNode, setActiveFlowNode] = useState<FlowNode>('spec');
  
  // 抽屉控制台状态
  const [consoleState, setConsoleState] = useState<'closed' | 'expanded' | 'maximized'>('closed');
  const isConsoleOpen = consoleState !== 'closed';
  
  const toggleConsole = () => {
    if (consoleState === 'closed') {
      setConsoleState('expanded');
    } else if (consoleState === 'expanded') {
      setConsoleState('closed');
    } else {
      setConsoleState('closed');
    }
  };

  const toggleMaximize = () => {
    setConsoleState(prev => prev === 'maximized' ? 'expanded' : 'maximized');
  };

  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [isExecuted, setIsExecuted] = useState(false);
  const [acceptanceTriggerId, setAcceptanceTriggerId] = useState<string | null>(null);
  const [showAcceptanceModal, setShowAcceptanceModal] = useState(false);

  const [messages, setMessages] = useState<AIMessage[]>([
    { id: 'init', role: 'assistant', content: `你好！我是AI助手，现在是"${task.title}"任务。有什么可以帮你的？`, timestamp: new Date().toLocaleString() }
  ]);

  const [executionLogs, setExecutionLogs] = useState<string[]>([
    '[系统] 任务初始化完成',
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        toggleConsole();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleCheck = (index: number) => {
    setCheckedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = task.acceptanceCriteria?.length || 0;
  const constraintsList = task.constraints ? task.constraints.split('\n').filter(c => c.trim()) : [];

  // 执行 (/run)
  const handleRun = () => {
    const currentMsgId = msgId;
    setMsgId(prev => prev + 1);
    setMessages(prev => [...prev, { id: String(currentMsgId), role: 'user', content: '/run', timestamp: new Date().toLocaleString() }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: String(currentMsgId + 1), role: 'assistant', content: '▶ 执行中...\n\n[执行输出]\n> 开始编译...\n> 编译完成\n> 运行程序...\n\n✅ 执行完成', timestamp: new Date().toLocaleString() }]);
    }, 800);
  };

  // 验收测试
  const handleAcceptanceTest = () => {
    const currentMsgId = msgId;
    const userMsgId = String(currentMsgId);
    const aiMsgId = String(currentMsgId + 1);
    setAcceptanceTriggerId(aiMsgId);
    setMsgId(prev => prev + 1);
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', content: '请进行验收测试', timestamp: new Date().toLocaleString() }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: '🧪 验收测试执行中...\n\n测试用例：\n- 功能测试：通过\n- 边界测试：通过\n- 集成测试：通过\n\n请确认验收结果：', timestamp: new Date().toLocaleString() }]);
    }, 1000);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const isCommand = input.startsWith('/');
    const userMsg: AIMessage = { id: String(msgId), role: 'user', content: input, timestamp: new Date().toLocaleString() };
    setMsgId(prev => prev + 1);
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      const responses = ['好的，我来帮你分析这个任务。', '明白，让我思考一下最佳方案。', '收到，我开始执行。', isCommand ? '命令已接收，正在处理...' : '好的，我来帮你分析这个任务。'];
      const responseMsg: AIMessage = { id: String(msgId), role: 'assistant', content: responses[Math.floor(Math.random() * responses.length)], timestamp: new Date().toLocaleString() };
      setMessages(prev => [...prev, responseMsg]);
      setMsgId(prev => prev + 1);
    }, 800);
  };

  // Spec - 任务规格
  const renderSpec = () => (
    <div className="space-y-0">
      <div className="border-b border-gray-800 p-3">
        <div className="text-xs font-medium text-gray-500 mb-1">任务目标</div>
        <div className="text-gray-200 text-sm whitespace-pre-wrap">{task.goal || '暂无'}</div>
      </div>
      <div className="border-b border-gray-800 p-3">
        <div className="text-xs font-medium text-gray-500 mb-1">输入</div>
        <div className="text-gray-200 text-sm whitespace-pre-wrap">{task.input || '暂无'}</div>
      </div>
      <div className="border-b border-gray-800 p-3">
        <div className="text-xs font-medium text-gray-500 mb-1">输出</div>
        <div className="text-gray-200 text-sm whitespace-pre-wrap">{task.output || '暂无'}</div>
      </div>
      <div className="border-b border-gray-800 p-3">
        <div className="text-xs font-medium text-gray-500 mb-2">约束条件</div>
        <div className="space-y-1">
          {constraintsList.map((item, index) => (
            <div key={index} className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span className="text-gray-300 text-sm">{item.replace(/^[•\-\s]+/, '')}</span></div>
          ))}
          {constraintsList.length === 0 && <span className="text-gray-500 text-sm">暂无约束条件</span>}
        </div>
      </div>
      <div className="border-b border-gray-800 p-3">
        <div className="text-xs font-medium text-gray-500 mb-2">验收标准</div>
        <div className="space-y-2">
          {(task.acceptanceCriteria || []).map((criteria, index) => (
            <div key={index} className="flex items-center gap-2 cursor-pointer" onClick={() => toggleCheck(index)}>
              <span className={`w-4 h-4 rounded border flex items-center justify-center ${checkedItems[index] ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}>
                {checkedItems[index] && <span className="text-white text-xs">✓</span>}
              </span>
              <span className={`text-sm ${checkedItems[index] ? 'text-gray-500 line-through' : 'text-gray-300'}`}>{criteria}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="border-b border-gray-800 p-3">
        <div className="text-xs font-medium text-gray-500 mb-1">关联工程</div>
        <div className="text-gray-200 text-sm">{task.context?.project || '无'}</div>
      </div>
      <div className="border-b border-gray-800 p-3">
        <div className="text-xs font-medium text-gray-500 mb-2">技术栈</div>
        <div className="flex flex-wrap gap-1">
          {task.context?.techStack?.map((tech, i) => (<span key={i} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded">{tech}</span>)) || <span className="text-gray-500 text-sm">无</span>}
        </div>
      </div>
      <div className="border-b border-gray-800 p-3">
        <div className="text-xs font-medium text-gray-500 mb-2">相关文件</div>
        <div className="space-y-1">
          {task.context?.relatedFiles?.map((file, i) => (<div key={i} className="text-gray-300 text-sm flex items-center gap-2"><span>📄</span> {file}</div>)) || <span className="text-gray-500 text-sm">无</span>}
        </div>
      </div>
      <div className="p-3">
        <div className="text-xs font-medium text-gray-500 mb-1">依赖任务</div>
        <div className="text-gray-300 text-sm">{task.context?.dependentTasks?.join(', ') || '无'}</div>
      </div>
    </div>
  );

  // Code - AI对话框
  const renderCode = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
              {msg.role === 'assistant' && <div className="flex items-center gap-1 mb-1 text-blue-400 text-xs"><span>🤖</span> <span>AI助手</span></div>}
              {msg.role === 'user' && <div className="flex items-center gap-1 mb-1 text-blue-200 text-xs"><span>👤</span> <span>用户</span></div>}
              <div>{msg.content}</div>
              <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-500'} text-right`}>{msg.timestamp}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 border-t border-gray-800">
        <div className="flex gap-2 items-center">
          <div className="text-xs text-gray-500 whitespace-nowrap">支持: /run</div>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="输入指令或消息..." className="flex-1 bg-gray-800 text-white px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
          <button onClick={sendMessage} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm">发送</button>
        </div>
      </div>
    </div>
  );

  // Run - 执行日志
  const renderRun = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-gray-900 rounded-lg p-3">
          <div className="text-xs font-medium text-gray-400 mb-2">执行日志</div>
          <div className="font-mono text-xs text-green-400 space-y-1">
            {executionLogs.map((log, i) => (<div key={i}>{log}</div>))}
          </div>
        </div>
        <div className="space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
                {msg.role === 'assistant' && <div className="flex items-center gap-1 mb-1 text-blue-400 text-xs"><span>🤖</span> <span>AI助手</span></div>}
                <div>{msg.content}</div>
                <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-500'} text-right`}>{msg.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Review - 复盘沉淀
  const renderReview = () => (
    <div className="space-y-0">
      <div className="border-b border-gray-800 p-3">
        <div className="text-xs font-medium text-gray-500 mb-1">任务输出</div>
        <div className="text-gray-300 text-sm">暂无输出</div>
      </div>
      <div className="border-b border-gray-800 p-3">
        <div className="text-xs font-medium text-gray-500 mb-1">经验总结</div>
        <div className="text-gray-300 text-sm">暂无经验总结</div>
      </div>
      <div className="border-b border-gray-800 p-3">
        <div className="text-xs font-medium text-gray-500 mb-1">结果归档</div>
        <div className="text-gray-300 text-sm">暂无归档</div>
      </div>
      <div className="p-3">
        <div className="text-xs font-medium text-gray-500 mb-1">知识库</div>
        <div className="text-gray-300 text-sm">暂无知识库</div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 h-full flex flex-col bg-[#0a0a0a]">
      {/* 顶部：任务头部 */}
      <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${statusColors[task.status]}`}>{statusLabels[task.status]}</span>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/50">{priorityLabels[task.priority]}优先级</span>
        </div>
        <h1 className="text-xl font-semibold text-white">{task.title}</h1>
        <div className="text-sm text-gray-500 mt-1">{task.module}{task.subFeature ? ` → ${task.subFeature}` : ''}</div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 上半部分：流程节点图（20%） */}
        <div className="h-[20%] min-h-[60px] flex-shrink-0 border-b border-gray-800">
          <div className="h-full flex items-center justify-center gap-2 px-4 bg-gray-900/50">
            {flowNodes.map((node, index) => (
              <div key={node.id} className="flex items-center">
                <button
                  onClick={() => setActiveFlowNode(node.id)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    activeFlowNode === node.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {node.label}
                </button>
                {index < flowNodes.length - 1 && (
                  <span className="mx-2 text-gray-500">→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 上半部分：内容区（80%） */}
        <div className="flex-1 overflow-hidden flex flex-col border-b border-gray-800">
          <div className="flex-1 overflow-y-auto">
            {activeFlowNode === 'spec' && renderSpec()}
            {activeFlowNode === 'code' && renderCode()}
            {activeFlowNode === 'run' && renderRun()}
            {activeFlowNode === 'review' && renderReview()}
          </div>
          
          {/* 打开控制台触发条 */}
          {consoleState === 'closed' && (
            <div className="p-2 border-t border-gray-800 bg-gray-900/80 cursor-pointer hover:bg-gray-800 transition-colors flex-shrink-0" onClick={toggleConsole}>
              <div className="text-center text-sm text-gray-400 flex items-center justify-center gap-2">
                <span>💻</span><span>打开任务控制台</span><span className="text-xs text-gray-500">(Ctrl+`)</span>
              </div>
            </div>
          )}
        </div>
        
        {/* 下半部分：抽屉式任务控制台 */}
        {isConsoleOpen && (
          <div className={`${consoleState === 'maximized' ? 'flex-1' : 'h-[40%]'} overflow-hidden flex flex-col border-t border-gray-800`}>
            <div className="flex flex-col h-full border-t border-gray-800 bg-[#0a0a0a]">
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 p-4">
                  <div className="bg-gray-900 rounded-lg p-3">
                    <div className="text-xs font-medium text-gray-400 mb-2">执行日志</div>
                    <div className="font-mono text-xs text-green-400 space-y-1">
                      {executionLogs.map((log, i) => (<div key={i}>{log}</div>))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
                          {msg.role === 'assistant' && <div className="flex items-center gap-1 mb-1 text-blue-400 text-xs"><span>🤖</span> <span>AI助手</span></div>}
                          <div>{msg.content}</div>
                          <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-500'} text-right`}>{msg.timestamp}</div>
                          {msg.role === 'assistant' && acceptanceTriggerId && msg.id === acceptanceTriggerId && (
                            <div className="flex gap-2 mt-2 pt-2 border-t border-gray-700">
                              <button onClick={() => setShowAcceptanceModal(true)} className="flex-1 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700">✅ 通过</button>
                              <button onClick={() => setShowAcceptanceModal(true)} className="flex-1 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700">❌ 驳回</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center gap-2 p-2 border-t border-gray-800 bg-gray-900/50">
                  <div className="flex gap-2 flex-1">
                    <button onClick={handleAcceptanceTest} className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700">🧪 验收测试</button>
                    <button onClick={handleRun} className="px-2 py-1 bg-gray-700 text-white rounded text-xs font-medium hover:bg-gray-600">▶ 执行 (/run)</button>
                  </div>
                  <button onClick={toggleMaximize} className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded text-xs" title={consoleState === 'maximized' ? '还原' : '最大化'}>
                    {consoleState === 'maximized' ? '⬜' : '🗗'}
                  </button>
                </div>
                <div className="p-2 border-t border-gray-800">
                  <div className="flex gap-2 items-center">
                    <div className="text-xs text-gray-500 whitespace-nowrap">支持: /run</div>
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="输入指令或消息..." className="flex-1 bg-gray-800 text-white px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <button onClick={sendMessage} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm">发送</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 验收弹窗 */}
      {showAcceptanceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg w-[400px] border border-gray-700 shadow-xl">
            <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-medium text-white">任务验收</h3></div>
            <div className="p-4">
              <div className="mb-4">
                <label className="text-sm text-gray-400 mb-2 block">验收意见</label>
                <textarea className="w-full bg-gray-800 text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" rows={4} placeholder="请输入验收意见..." />
              </div>
              <div className="text-sm text-gray-500 mb-4">验收进度: {completedCount}/{totalCount} 已完成</div>
            </div>
            <div className="p-4 border-t border-gray-700 flex gap-3">
              <button onClick={() => setShowAcceptanceModal(false)} className="flex-1 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700">✅ 通过</button>
              <button onClick={() => setShowAcceptanceModal(false)} className="flex-1 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700">❌ 驳回</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}