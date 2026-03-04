import { defineStore } from 'pinia'
import { useAuthStore } from "./auth";
import { useAxios } from "@/composables/request.js";

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userId: localStorage.getItem("userId") ?? null,
        name: localStorage.getItem("userName") ?? null,
        email: localStorage.getItem("userEmail") ?? null,
    }
  },
  getters: {
    getId: (state) => state.userId,
    getName: (state) => state.name,
    getEmail: (state) => state.email,
  }, 
  actions: {
    setUser(data) {
        this.name = data.name;
        this.userId = data.userId;

        const authStore = useAuthStore();
        authStore.setLoggedIn(true)
        this.getUser();
        //TODO - in the future they would go here?
        // set user role
        // set user permissions
    },
    async getUser() {
        const res = await useAxios.get('api/user/getUser')
        let data = res.data.data

        localStorage.setItem("userId", data.id)
        this.userId = data.id
        localStorage.setItem("userName", data.name)
        this.name = data.name
        localStorage.setItem("userEmail", data.email)
        this.email = data.email
    },
    removeUser() {
      localStorage.removeItem("userId")
      this.id = null
      localStorage.removeItem("userName")
      this.name = null
      localStorage.removeItem("userEmail")
      this.email = null
    }
   
  }
})