<template>
    <div v-if="props.error"></div>
    <p v-if="props.error" class="mt-2 mb-1 text-sm text-red-600">
      {{ props.errorMessage }}
    </p>
  </template>
  
  <script>
  export default {
    name: "InputErrorMessage",
    props: {
      error: {
        type: Boolean,
        required: false,
      },
      errorMessage: {
        type: String,
        required: false,
        default: () => "",
      },
    },
    setup(props) {
      return { props };
    },
  };
  </script>
  
  <style></style>