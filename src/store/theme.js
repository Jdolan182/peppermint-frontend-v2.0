import { defineStore } from 'pinia'

const STORAGE_KEY = 'peppermint-theme'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    // 'light' | 'dark' | 'system'
    preference: localStorage.getItem(STORAGE_KEY) ?? 'system',
  }),

  getters: {
    isDark(state) {
      if (state.preference === 'dark') return true
      if (state.preference === 'light') return false
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    },
  },

  actions: {
    set(value) {
      this.preference = value
      localStorage.setItem(STORAGE_KEY, value)
      this.apply()
    },

    toggle() {
      this.set(this.isDark ? 'light' : 'dark')
    },

    apply() {
      const html = document.documentElement
      html.classList.toggle('dark', this.isDark)
      html.classList.toggle('light', !this.isDark)
    },
  },
})
