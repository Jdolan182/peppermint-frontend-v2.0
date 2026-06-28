import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    collapsed: false,
    mobileOpen: false,
  }),
  actions: {
    toggle() { this.collapsed = !this.collapsed },
    toggleMobile() { this.mobileOpen = !this.mobileOpen },
    closeMobile() { this.mobileOpen = false },
  },
})
