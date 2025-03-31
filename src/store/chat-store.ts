import { create } from 'zustand';

export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  input: string;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setInput: (input: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  input: '',
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...message, id: Date.now().toString(), timestamp: new Date() },
      ],
    })),
  setInput: (input) => set({ input }),
  setIsLoading: (isLoading) => set({ isLoading }),
  clearMessages: () => set({ messages: [] }),
}));
