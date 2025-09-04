import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { Message } from './types';
import { MODEL_NAME, SYSTEM_INSTRUCTION } from './constants';
import Header from './components/Header';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';
import ErrorDisplay from './components/ErrorDisplay';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);

  const initializeChat = useCallback(() => {
    try {
      if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const newChat = ai.chats.create({
        model: MODEL_NAME,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });
      setChat(newChat);
      setMessages([
        { role: 'model', content: "Hello! I'm Ala, your AI companion. How can I help you today?" }
      ]);
      setError(null);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during initialization.';
      console.error("Initialization Error:", errorMessage);
      setError(`Failed to initialize AI. ${errorMessage}`);
    }
  }, []);
  
  useEffect(() => {
    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!chat || !text.trim()) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    // Add a placeholder for the model's response for a better streaming UX
    setMessages(prev => [...prev, { role: 'model', content: '' }]);

    try {
      const stream = await chat.sendMessageStream({ message: text });
      let accumulatedText = '';
      
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        accumulatedText += chunkText;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'model', content: accumulatedText };
          return newMessages;
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      console.error("API Error:", errorMessage);
      setError(`Sorry, I couldn't get a response. ${errorMessage}`);
      // Remove the empty model message placeholder on error
      setMessages(prev => prev.slice(0, prev.length - 1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      initializeChat();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-gray-200 font-sans">
      <Header onClearChat={handleClearChat} />
      <ChatHistory messages={messages} isLoading={isLoading} />
      <div className="px-4 pb-4">
        <ErrorDisplay error={error} />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;