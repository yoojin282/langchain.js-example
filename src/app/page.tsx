import ChatBot from '@/components/chatbot';

export default function Home() {
  return (
    <div className="mx-auto max-w-md py-16">
      <h1 className="mb-8 text-center text-2xl font-bold text-gray-800">AI 챗봇</h1>
      <ChatBot />
    </div>
  );
}
