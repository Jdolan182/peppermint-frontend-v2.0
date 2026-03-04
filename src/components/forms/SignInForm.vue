<template>
  <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <HeaderTwo :header="title" />
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10">
        <Form class="space-y-6" @submit="submit">
          <div class="text-center">
            <ErrorLabel :label="form.login.errorMessage" :error="form.login.error" />
          </div>

          <!-- Email -->
          <div>
            <Label for="email" label="Email Address" />
            <div class="mt-1">
              <Input
                name="email"
                placeholder="Email"
                autocomplete="email"
                v-model="form.email.value"
                :error="form.email.error"
                :error-message="form.email.errorMessage"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <Label for="password" label="Password" />
            <div class="mt-1">
              <Input
                name="password"
                placeholder="Password"
                type="password"
                v-model="form.password.value"
                :error="form.password.error"
                :error-message="form.password.errorMessage"
              />
            </div>
          </div>

          <div>
            <Submit :disabled="submitting" label="Sign In" />
          </div>
        </Form>

        <p v-if="register" class="mt-8 text-sm font-medium text-gray-400">
          Or
          <router-link
            :to="registerRoute"
            class="focus:border-indigo-600 focus:ring-indigo-600"
          >
            Sign up
          </router-link>
          here
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import Form from "./Form.vue";
import Input from "../inputs/Input.vue";
import Label from "../labels/Label.vue";
import ErrorLabel from "../labels/ErrorLabel.vue";
import HeaderTwo from "../labels/HeaderTwo.vue";
import Submit from "../buttons/Submit.vue";
import { createForm } from "@/composables/forms";
import { ref } from "vue";

const { title, register, registerRoute } = defineProps({
  title: {
    type: [String, Number],
    default: "Sign In",
  },
  register: {
    type: Boolean,
    default: false,
  },
  registerRoute: {
    type: String,
    default: "register",
  },
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
    }

    await emit("login", { params, form })
  } finally {
    submitting.value = false
  }
};
</script>
