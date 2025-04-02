import { create } from 'zustand';

interface InitState {
  initialized: boolean;
  isSubmitting: boolean;
  check: () => void;
  init: () => void;
}

export const useInitStore = create<InitState>((set) => ({
  initialized: true,
  isSubmitting: true,
  check: async () => {
    set({ isSubmitting: true });
    const res = await fetch('/api/init', {
      method: 'GET',
    });
    if (res.ok) {
      const json = await res.json();
      if (json.exists) {
        set({ initialized: true, isSubmitting: false });
        return;
      }
    }
    set({ initialized: false, isSubmitting: false });
  },
  init: async () => {
    set({ isSubmitting: true });
    const res = await fetch('/api/init', {
      method: 'POST',
    });
    set({ isSubmitting: false });
    if (res.ok) {
      set({ initialized: true });
    } else {
      set({ initialized: false });
    }
  },
}));
