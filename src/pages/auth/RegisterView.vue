<template>
  <AuthFormTemplate
    form_id="register"
    submit_label="Register!"
    :submit-action="submitAction">
    <template v-slot:fields>
      <EmailField v-model="form.email"></EmailField>
      <PasswordField v-model="form.password"></PasswordField>
      <BetaKeyField v-model="form.beta_key"></BetaKeyField>
    </template>
  </AuthFormTemplate>
</template>

<script setup lang="ts">
import AuthFormTemplate from 'pages/auth/AuthFormTemplate.vue';
import EmailField from 'components/EmailField.vue';
import PasswordField from 'components/PasswordField.vue';
import BetaKeyField from 'components/BetaKeyField.vue';

import { reactive } from 'vue';
import { useAuthStore } from 'stores/auth';

const store = useAuthStore();

interface Iform {
  email: string;
  password: string;
  beta_key: string;
}

let form = reactive({
  email: null,
  password: null,
  beta_key: null,
} as unknown as Iform);

function submitAction() {
  return store.register(form.email, form.password, form.beta_key);
}
</script>

<style scoped></style>
