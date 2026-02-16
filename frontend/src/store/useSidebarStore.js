import { create } from "zustand";

const useSidebarStore = create((set) => ({
  screenMode: "desktop",
  isOpen: true,

  setScreenMode: (mode) =>
    set((state) => ({
      screenMode: mode,
      isOpen: mode === "desktop" ? state.isOpen : false,
    })),

  toggleSidebar: () =>
    set((state) => ({
      isOpen: !state.isOpen,
    })),

  closeSidebar: () =>
    set({
      isOpen: false,
    }),
}));

export default useSidebarStore;
