'use client';

import { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: '你好！我是任务助手，可以帮你分解和完成任务。有什么需要帮助的吗？' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [msgId, setMsgId] = useState(2);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: String(msgId), role: 'user', content: input };
    setMsgId(prev => prev + 1);
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      const aiMsg: Message = { 
        id: String(msgId + 1), 
        role: 'assistant', 
        content: getAIResponse(currentInput),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      setMsgId(prev => prev + 2);
    }, 1000);
  };

  const getAIResponse = (query: string): string => {
    const responses: Record<string, string> = {
      '任务': '我来帮你分析这个任务。它可以拆解为以下几个子任务...\n\n1. 分析需求\n2. 制定计划\n3. 执行并验证',
      '分解': '任务分解可以帮助你更好地管理复杂项目。建议按以下维度拆解：\n\n- 按功能模块\n- 按开发阶段\n- 按优先级',
      '默认': '明白，让我帮你梳理一下思路...',
    };
    
    for (const key of Object.keys(responses)) {
      if (query.includes(key)) return responses[key];
    }
    return responses['默认'];
  };

  return (
    <div className="h-full flex flex-col">
      <header className="p-4 border-b border-[#2a2a2a]">
        <h1 className="text-xl font-semibold text-white">AI 对话</h1>
        <p className="text-xs text-[#71717a]">智能任务助手</p>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-[#1a1a1a] text-[#d4d4d8]'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#1a1a1a] p-3 rounded-lg text-[#71717a]">
              正在输入...
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-[#2a2a2a]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="输入消息..."
            className="flex-1 bg-[#1a1a1a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}