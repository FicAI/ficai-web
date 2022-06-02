<template>
  <AuthFormTemplate form_id="login" submit_label="Register!" :submit-action="submitAction">
    <template v-slot:fields>
      <EmailField v-model="form.email"></EmailField>
      <PasswordField v-model="form.password"></PasswordField>
    </template>
  </AuthFormTemplate>
</template>

<script setup lang="ts">
import AuthFormTemplate from 'pages/auth/AuthFormTemplate.vue'
import EmailField from 'components/EmailField.vue';
import PasswordField from 'components/PasswordField.vue';

import { reactive } from 'vue';
import { useAuthStore } from 'stores/auth';

const store = useAuthStore()

interface Iform {
  email: string
  password: string;
}

let form = reactive({
  email: null,
  password: null,
  } as unknown as Iform
);

function submitAction() {
  return store.login(form.email, form.password)
}
</script>

<style scoped>

</style>
