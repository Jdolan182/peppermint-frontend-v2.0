<script setup>
  import SignInForm from '@/components/forms/SignInForm.vue'
  import { useAxios } from "@/composables/request.js";
  //import { useUserStore } from "@/store/admin/user";
  import { useRouter } from "vue-router";
  //import { showErrorBanner } from "@/composables/banners";

  //const userStore = useUserStore();
  const router = useRouter();

  const login = async ({params, form}) => {

    console.log('we trying to login')
    // try {
    //   useAxios.get('sanctum/csrf-cookie').then(async response => {

    //     const res = await useAxios.post('/api/auth/login', params, form)

    //     if(res.status != 200 && res.status == 400)
    //     {
    //       form.value.login.error = true
    //       form.value.login.errorMessage = res.data.message
    //     }
    //     else if(res.status == 401) {
    //       showErrorBanner("Unauthorized", "You don't have access to this");
    //     }
    //     if (res) {
    //       userStore.setUser(res.data)
    //       router.push({ name: "Dashboard" })
    //     }
    //   })
    // } catch (e) {
    // }
  };
</script>

<template>
  <div class="h-full w-full">
    <div class="h-full overflow-hidden shadow-sm sm:rounded-lg">
      <SignInForm 
        title="Sign in to your admin panel"
        @login="login"
      />
    </div>
  </div>
</template>