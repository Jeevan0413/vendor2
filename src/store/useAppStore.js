import { create } from 'zustand';

export const useAppStore = create((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  theme: 'dark',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}));
