import { useRef, useEffect } from 'react';
import { AIMessage } from '@/types/task';

interface ChatProps {
  messages: AIMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  acceptanceTriggerId: string | null;
  onAcceptance: () => void;
  onReject: () => void;
}

export default function Chat({ 
  messages, 
  input, 
  onInputChange, 
  onSend,
  acceptanceTriggerId,
  onAcceptance,
  onReject
}: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
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
                  <button onClick={onAcceptance} className="flex-1 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700">✅ 通过</button>
                  <button onClick={onReject} className="flex-1 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700">❌ 驳回</button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 border-t border-gray-800">
        <div className="flex gap-2 items-center">
          <div className="text-xs text-gray-500 whitespace-nowrap">支持: /run</div>
          <input 
            type="text" 
            value={input} 
            onChange={(e) => onInputChange(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && onSend()} 
            placeholder="输入指令或消息..." 
            className="flex-1 bg-gray-800 text-white px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
          />
          <button onClick={onSend} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm">发送</button>
        </div>
      </div>
    </div>
  );
}