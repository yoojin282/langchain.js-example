import ChatBot from '@/components/chatbot';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 text-center text-2xl font-bold text-gray-800">AI 챗봇</h1>
        <ChatBot />
      </div>
    </div>
  );
}
