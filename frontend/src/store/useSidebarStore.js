import { create } from 'zustand';

const useSidebarStore = create((set) => ({
  isOpen: true,
  isMobileOpen: true,

  toggleSidebar: () =>
    set((state) => ({
      isOpen: !state.isOpen,
      isMobileOpen: !state.isOpen
    })),

  toggleMobileSidebar: () =>
    set((state) => ({
      isMobileOpen: !state.isMobileOpen,
      isOpen: !state.isMobileOpen
    })),

  closeMobileSidebar: () => set({ isMobileOpen: false, isOpen: false }),
}));


export default useSidebarStore;
