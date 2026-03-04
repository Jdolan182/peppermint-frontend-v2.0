import { defineStore } from 'pinia'
import { useUserStore } from "./user";
import router from '@/router/index.js'

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
        isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) ?? false,
    }
  },
  getters: {
    getIsLoggedIn: (state) => state.isLoggedIn,
  }, 
  actions: {
    setLoggedIn(val) {
      localStorage.setItem("isLoggedIn", val);
      this.isLoggedIn = val;
    },
    logout() { 
      const userStore = useUserStore();
      userStore.removeUser()
      localStorage.removeItem("isLoggedIn");
      this.isLoggedIn = false;
      router.push({ name: "Peppermint" })
    }
  }
})