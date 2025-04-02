'use client';

import { useChatStore } from '@/store/chat-store';
import { useInitStore } from '@/store/init-store';
import { useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import clsx from 'clsx';

export default function ChatBot() {
  const { messages, input, isLoading, addMessage, setInput, setIsLoading, clearMessages } =
    useChatStore();
  const dataInitialized = useInitStore((state) => state.initialized);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || !dataInitialized) return;

    // 사용자 메시지 추가
    addMessage({ content: input, role: 'user' });
    setInput('');
    setIsLoading(true);

    try {
      // 여기에 실제 API 호출 로직 추가
      // 예시: const response = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ message: input }) });
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: input }),
      });

      addMessage({
        content: (await res.json()).answer,
        role: 'assistant',
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  // 메시지가 추가될 때 스크롤 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="mx-auto flex h-[600px] w-full max-w-md flex-col overflow-hidden rounded-lg border bg-white shadow-lg">
      {/* 헤더 */}
      <div className="flex items-center justify-between bg-blue-600 p-4 text-white">
        <h2 className="text-xl font-bold">챗봇</h2>
        <button
          onClick={clearMessages}
          className="rounded bg-blue-700 px-2 py-1 text-sm hover:bg-blue-800">
          대화 초기화
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {messages.length === 0 ? (
          <div className="mt-10 text-center text-gray-500">
            <p>안녕하세요! 무엇을 도와드릴까요?</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={clsx(
                'mb-4',
                message.role === 'user' ? 'flex justify-end' : 'flex justify-start',
              )}>
              <div
                className={clsx(
                  'max-w-[80%] rounded-lg px-4 py-2',
                  message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800',
                )}>
                <div>
                  <Markdown>{message.content}</Markdown>
                </div>
                <div className="mt-1 text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="mb-4 flex justify-start">
            <div className="rounded-lg bg-gray-200 px-4 py-2 text-gray-800">
              <div className="flex space-x-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
                  style={{ animationDelay: '0.2s' }}></div>
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
                  style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <form onSubmit={handleSendMessage} className="border-t bg-white p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 rounded-full border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={!dataInitialized || isLoading}
          />
          <button
            type="submit"
            disabled={!dataInitialized || isLoading || !input.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 p-2 text-white disabled:opacity-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
