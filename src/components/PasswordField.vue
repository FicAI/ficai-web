<template>
  <q-input
    v-model="value"
    outlined
    label="Password"
    hint="Your password"
    hide-hint
    type="password"
    autocomplete="current-password"
    lazy-rules
    :rules="[isRequired, minLength(8), maxLength(64)]"
    maxlength="64"
  >
    <template v-slot:prepend>
      <q-icon name="lock" />
    </template>

  </q-input>
</template>

<script setup lang="ts">
import { isRequired, minLength, maxLength } from 'components/validators';
// todo: password-specific validator

import { ref } from 'vue';
let value = ref(null);

</script>

<style scoped>

</style>
