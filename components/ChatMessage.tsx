import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const BotIcon: React.FC = () => (
    <div className="flex-shrink-0 w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L3 22h4l1.5-4h7l1.5 4h4L12 2z"/>
            <path d="M9.5 12h5"/>
        </svg>
    </div>
);

const UserIcon: React.FC = () => (
    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    </div>
);


const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { role, content } = message;
  const isModel = role === 'model';

  const typingCursor = content === '' ? ' animate-pulse' : '';

  if (isModel) {
    return (
      <div className="flex items-start gap-3">
        <BotIcon />
        <div className="bg-slate-800 rounded-r-lg rounded-bl-lg p-3 max-w-full md:max-w-[75%] prose prose-invert prose-p:my-0 prose-pre:my-0 prose-pre:bg-slate-900/50">
           <p className={`whitespace-pre-wrap ${typingCursor}`}>{content || ' '}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-end gap-3">
      <div className="bg-blue-600 text-white rounded-l-lg rounded-br-lg p-3 max-w-full md:max-w-[75%] prose prose-invert prose-p:my-0">
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
      <UserIcon />
    </div>
  );
};

export default ChatMessage;