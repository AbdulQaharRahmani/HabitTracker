import { create } from 'zustand';

const useSidebarStore = create((set) => ({
  isOpen: true,
  isMobileOpen: false,

  toggleSidebar: () =>
    set((state) => ({ isOpen: !state.isOpen })),

  toggleMobileSidebar: () =>
    set((state) => ({ isMobileOpen: !state.isMobileOpen })),

  closeMobileSidebar: () =>
    set({ isMobileOpen: false }),
}));

export default useSidebarStore;
