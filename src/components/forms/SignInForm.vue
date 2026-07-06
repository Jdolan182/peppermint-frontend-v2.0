<template>
  <div class="w-full max-w-sm">
    <h2 class="text-2xl font-bold tracking-tight text-gray-900">{{ title }}</h2>
    <p class="mt-2 text-sm text-gray-500">Sign in to continue</p>

    <div v-if="form.login.error" class="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
      {{ form.login.errorMessage }}
    </div>

    <Form class="mt-8 flex flex-col gap-5" @submit="submit">
      <div>
        <Label for="email" label="Email address" />
        <div class="mt-1.5">
          <Input
            name="email"
            placeholder="you@example.com"
            autocomplete="email"
            v-model="form.email.value"
            :error="form.email.error"
            :error-message="form.email.errorMessage"
          />
        </div>
      </div>

      <div>
        <Label for="password" label="Password" />
        <div class="mt-1.5">
          <Input
            name="password"
            placeholder="••••••••"
            type="password"
            v-model="form.password.value"
            :error="form.password.error"
            :error-message="form.password.errorMessage"
          />
        </div>
      </div>

      <div class="mt-2">
        <Submit :disabled="submitting" label="Sign in" />
      </div>
    </Form>

    <!-- <p v-if="register" class="mt-6 text-center text-sm text-gray-500">
      Don't have an account?
      <router-link :to="registerRoute" class="font-medium text-indigo-600 hover:text-indigo-500">
        Sign up
      </router-link>
    </p> -->
  </div>
</template>

<script setup>
import Form from "./Form.vue";
import Input from "../inputs/Input.vue";
import Label from "../labels/Label.vue";
import Submit from "../buttons/Submit.vue";
import { createForm } from "@/composables/forms";
import { ref } from "vue";

const { title, register, registerRoute } = defineProps({
  title: { type: String, default: "Sign in" },
  register: { type: Boolean, default: false },
  registerRoute: { type: String, default: "register" },
});

const emit = defineEmits(["login"]);
const submitting = ref(false);

const form = createForm([
  { key: "email", default: "" },
  { key: "password", default: "" },
  { key: "login", default: "" },
]);

const submit = async () => {
  if (submitting.value) return;
  submitting.value = true;
  try {
    const params = {
      email: form.value.email.value,
      password: form.value.password.value,
    };
    await emit("login", { params, form });
  } finally {
    submitting.value = false;
  }
};
</script>
