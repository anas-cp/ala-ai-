import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';
import ChatMessage from './ChatMessage';

interface ChatHistoryProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={scrollRef} className="flex-grow p-4 md:p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isLoading && messages[messages.length-1]?.role === 'user' && (
           <div className="flex items-start gap-3 animate-pulse">
                <div className="flex-shrink-0 w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L3 22h4l1.5-4h7l1.5 4h4L12 2z"/>
                      <path d="M9.5 12h5"/>
                  </svg>
                </div>
                <div className="bg-slate-700 rounded-lg p-3 w-20">
                    <div className="h-2.5 bg-slate-600 rounded-full w-full"></div>
                </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;