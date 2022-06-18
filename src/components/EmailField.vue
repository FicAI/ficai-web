<template>
  <q-input
    v-model="value"
    outlined
    label="Email"
    hint="Your email address"
    hide-hint
    type="email"
    autocomplete="email"
    lazy-rules
    :rules="[isRequired, isValidEmail]">
    <template v-slot:prepend>
      <q-icon name="email" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { isRequired, isValidEmail } from 'components/validators';

import { ref } from 'vue';
const value = ref(null);
</script>

<style scoped></style>
