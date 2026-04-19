'use client';

import { useState, useEffect } from 'react';
import { Task, AIMessage } from '@/types/task';
import TaskHeader from './TaskHeader';
import ListView from './ListView';
import TaskInfo from './TaskInfo';
import Chat from './Chat';
import AcceptanceModal from './AcceptanceModal';

interface TaskDetailProps {
  task: Task;
  viewMode: 'list' | 'detail';
  onBack: () => void;
  onSelectTask?: (task: Task) => void;
  parentTasks?: Task[];
}

export default function TaskDetail({ task, viewMode, onBack, onSelectTask, parentTasks = [] }: TaskDetailProps) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [acceptanceTriggerId, setAcceptanceTriggerId] = useState<string | null>(null);
  const [showAcceptanceModal, setShowAcceptanceModal] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>(() => [
    { id: 'init', role: 'assistant', content: `你好！我是AI助手，现在是"${task.title}"任务。有什么可以帮你的？`, timestamp: '初始化' }
  ]);
  const [input, setInput] = useState('');
  const [msgId, setMsgId] = useState(1);

  const getTimestamp = () => new Date().toLocaleString('zh-CN', { hour12: false });

  const toggleCheck = (index: number) => {
    setCheckedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = task.acceptanceCriteria?.length || 0;

  const sendMessage = () => {
    if (!input.trim()) return;
    const isCommand = input.startsWith('/');
    const userMsg: AIMessage = { id: String(msgId), role: 'user', content: input, timestamp: getTimestamp() };
    setMsgId(prev => prev + 1);
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      const responses = ['好的，我来帮你分析这个任务。', '明白，让我思考一下最佳方案。', '收到，我开始执行。', isCommand ? '命令已接收，正在处理...' : '好的，我来帮你分析这个任务。'];
      const responseMsg: AIMessage = { id: String(msgId), role: 'assistant', content: responses[Math.floor(Math.random() * responses.length)], timestamp: getTimestamp() };
      setMessages(prev => [...prev, responseMsg]);
      setMsgId(prev => prev + 1);
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

  const handleRun = () => {
    const currentMsgId = msgId;
    setMsgId(prev => prev + 1);
    setMessages(prev => [...prev, { id: String(currentMsgId), role: 'user', content: '/run', timestamp: new Date().toLocaleString() }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: String(currentMsgId + 1), role: 'assistant', content: '▶ 执行中...\n\n[执行输出]\n> 开始编译...\n> 编译完成\n> 运行程序...\n\n✅ 执行完成', timestamp: new Date().toLocaleString() }]);
    }, 800);
  };

  const handleSendWithAction = (action: 'test' | 'run') => {
    if (action === 'test') {
      handleAcceptanceTest();
    } else {
      handleRun();
    }
    sendMessage();
  };

  const handleEdit = () => {
    // TODO: Open edit modal
    alert('编辑功能开发中...');
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-[#0a0a0a]">
      <TaskHeader 
        task={task} 
        viewMode={viewMode} 
        checkedItems={checkedItems}
        onToggleCheck={toggleCheck}
        onEdit={handleEdit}
      />
      
      {viewMode === 'list' ? (
        <ListView task={task} parentTasks={parentTasks} onSelectTask={onSelectTask} />
      ) : (
        <div className="flex-1 flex flex-col bg-[#0d0d0d] border-t border-gray-700 overflow-hidden">
          <Chat 
              messages={messages}
              input={input}
              onInputChange={setInput}
              onSend={() => handleSendWithAction('test')}
              acceptanceTriggerId={acceptanceTriggerId}
              onAcceptance={() => setShowAcceptanceModal(true)}
              onReject={() => setShowAcceptanceModal(true)}
            />
        </div>
      )}

      <AcceptanceModal 
        isOpen={showAcceptanceModal}
        completedCount={completedCount}
        totalCount={totalCount}
        onAccept={() => setShowAcceptanceModal(false)}
        onReject={() => setShowAcceptanceModal(false)}
        onClose={() => setShowAcceptanceModal(false)}
      />
    </div>
  );
}