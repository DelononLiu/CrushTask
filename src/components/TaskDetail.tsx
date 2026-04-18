'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Task, AIMessage } from '@/types/task';

interface TaskDetailProps {
  task: Task;
  viewMode: 'list' | 'detail';
  onBack: () => void;
  parentTasks?: Task[];
}

type FlowNode = 'spec' | 'code' | 'run' | 'review';

const flowNodes: { id: FlowNode; label: string }[] = [
  { id: 'spec', label: 'Spec' },
  { id: 'code', label: 'Code' },
  { id: 'run', label: 'Run' },
  { id: 'review', label: 'Review' },
];

const statusLabels: Record<string, string> = {
  pending: '计划',
  in_progress: '正在进行',
  completed: '完成',
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

export default function TaskDetail({ task, viewMode, onBack, parentTasks = [] }: TaskDetailProps) {
  const [activeFlowNode, setActiveFlowNode] = useState<FlowNode>('spec');
  const [isOperationMode, setIsOperationMode] = useState(false);
  const [input, setInput] = useState('');
  const [msgId, setMsgId] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
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
    setMessages([
      { id: 'init', role: 'assistant', content: `你好！我是AI助手，现在是"${task.title}"任务。有什么可以帮你的？`, timestamp: new Date().toLocaleString() }
    ]);
    setActiveFlowNode('spec');
    setIsOperationMode(false);
    setCheckedItems({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id]);

  const handleFlowNodeClick = (node: FlowNode) => {
    setActiveFlowNode(node);
    setIsOperationMode(true);
  };

  const handleBackToOverview = () => {
    setIsOperationMode(false);
  };

  const toggleCheck = (index: number) => {
    setCheckedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = task.acceptanceCriteria?.length || 0;
  const constraintsList = task.constraints ? task.constraints.split('\n').filter(c => c.trim()) : [];

  const handleRun = () => {
    const currentMsgId = msgId;
    setMsgId(prev => prev + 1);
    setMessages(prev => [...prev, { id: String(currentMsgId), role: 'user', content: '/run', timestamp: new Date().toLocaleString() }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: String(currentMsgId + 1), role: 'assistant', content: '▶ 执行中...\n\n[执行输出]\n> 开始编译...\n> 编译完成\n> 运行程序...\n\n✅ 执行完成', timestamp: new Date().toLocaleString() }]);
    }, 800);
  };

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

  const getStatusDotColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-gray-500',
      in_progress: 'bg-blue-500',
      completed: 'bg-green-500',
      rejected: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  // 列表视图分组
  const groupedTasks = useMemo(() => {
    const groups: Record<string, Task[]> = {
      in_progress: [],
      pending: [],
      completed: [],
    };
    parentTasks.forEach(t => {
      if (groups[t.status]) {
        groups[t.status].push(t);
      } else if (t.status === 'rejected') {
        groups.pending.push(t);
      }
    });
    return groups;
  }, [parentTasks]);

  // 列表视图
  const renderListView = () => {
    const groupOrder = ['in_progress', 'pending', 'completed'];

    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">{task.title}</h2>
        </div>
        {groupOrder.map(status => (
          groupedTasks[status].length > 0 && (
            <div key={status} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2 h-2 rounded-full ${getStatusDotColor(status)}`}></span>
                <span className="text-sm font-medium text-gray-300">{statusLabels[status]}</span>
                <span className="text-xs text-gray-500">({groupedTasks[status].length})</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {groupedTasks[status].map(t => (
                  <div key={t.id} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 hover:border-blue-500 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2 h-2 rounded-full ${getStatusDotColor(t.status)}`}></span>
                      <span className="text-sm font-medium text-[#165DFF]">{t.title}</span>
                    </div>
                    <div className="text-xs text-gray-500">{t.module}{t.subFeature && ` → ${t.subFeature}`}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] border ${statusColors[t.status]}`}>{statusLabels[t.status]}</span>
                      <span className="text-[10px] text-gray-500">{priorityLabels[t.priority]}优先级</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
        {parentTasks.length === 0 && (
          <div className="text-center text-gray-500 py-8">暂无子任务</div>
        )}
      </div>
    );
  };

  // 详情视图 - 任务信息（简洁版）
  const renderTaskInfo = () => (
    <div className="h-full p-4 overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">任务目标</div>
          <div className="text-sm text-gray-200 line-clamp-2">{task.goal || '暂无'}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">输入</div>
          <div className="text-sm text-gray-200 line-clamp-2">{task.input || '暂无'}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">输出</div>
          <div className="text-sm text-gray-200 line-clamp-2">{task.output || '暂无'}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">约束条件</div>
          <div className="text-sm text-gray-200 line-clamp-2">{task.constraints || '暂无'}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">技术栈</div>
          <div className="text-sm text-gray-200">
            {task.context?.techStack?.join(', ') || '暂无'}
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">相关文件</div>
          <div className="text-sm text-gray-200 line-clamp-2">
            {task.context?.relatedFiles?.join(', ') || '暂无'}
          </div>
        </div>
      </div>
      {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 && (
        <div className="mt-4 bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-2">验收标准 ({completedCount}/{totalCount})</div>
          <div className="flex flex-wrap gap-2">
            {(task.acceptanceCriteria || []).map((criteria, index) => (
              <span 
                key={index} 
                onClick={() => toggleCheck(index)}
                className={`px-2 py-1 rounded text-xs cursor-pointer ${
                  checkedItems[index] 
                    ? 'bg-green-600/20 text-green-400 line-through' 
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {checkedItems[index] ? '✓' : '○'} {criteria}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // 详情视图 - Code (AI对话框)
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

  // 详情视图 - Run (执行日志)
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

  // 详情视图 - Review (复盘沉淀)
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

  // 详情视图 - 主布局（上下布局：30%任务信息 + 70%对话框）
  const renderDetailView = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 上面30%：任务信息 */}
      <div className="h-[30%] min-h-[150px] flex-shrink-0 border-b border-gray-800 overflow-y-auto">
        {renderTaskInfo()}
      </div>

      {/* 下面70%：AI对话框 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
                {msg.role === 'assistant' && <div className="flex items-center gap-1 mb-1 text-blue-400 text-xs"><span>🤖</span> <span>AI助手</span></div>}
                {msg.role === 'user' && <div className="flex items-center gap-1 mb-1 text-blue-200 text-xs"><span>👤</span> <span>用户</span></div>}
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
        {/* 底部输入框 */}
        <div className="p-2 border-t border-gray-800">
          <div className="flex gap-2 items-center">
            <div className="text-xs text-gray-500 whitespace-nowrap">支持: /run</div>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="输入指令或消息..." className="flex-1 bg-gray-800 text-white px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
            <button onClick={sendMessage} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm">发送</button>
          </div>
        </div>
      </div>
    </div>
  );

  // 渲染头部
  const renderHeader = () => {
    if (viewMode === 'list') {
      return (
        <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-lg">📂</span>
            <h1 className="text-xl font-semibold text-white">{task.title}</h1>
          </div>
          <div className="text-sm text-gray-500 mt-1">{task.module}{task.subFeature ? ` → ${task.subFeature}` : ''}</div>
        </div>
      );
    }
    return (
      <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <button onClick={onBack} className="text-gray-400 hover:text-white text-sm">← 返回</button>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${statusColors[task.status]}`}>{statusLabels[task.status]}</span>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/50">{priorityLabels[task.priority]}优先级</span>
        </div>
        <h1 className="text-xl font-semibold text-white">{task.title}</h1>
        <div className="text-sm text-gray-500 mt-1">{task.module}{task.subFeature ? ` → ${task.subFeature}` : ''}</div>
      </div>
    );
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-[#0a0a0a]">
      {renderHeader()}
      {viewMode === 'list' ? renderListView() : renderDetailView()}

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