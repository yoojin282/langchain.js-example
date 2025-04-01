import InitButton from '@/components/init-button';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">LangChain Chatbot 예제</h1>
        <InitButton />
      </div>
    </header>
  );
}
