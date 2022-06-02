<template>
  <q-input
    v-model="value"
    @input="$emit('update:modelValue', $event.target.value)"
    outlined
    label="Password"
    hint="Your password"
    type="password"
    autocomplete="current-password"
    lazy-rules
    :rules="[isRequired]"
  >
    <template v-slot:prepend>
      <q-icon name="lock" />
    </template>

  </q-input>
</template>

<script setup lang="ts">
import {isRequired, } from 'components/validators';
// todo: password-specific validator

import { ref } from 'vue';
let value = ref(null);

</script>

<style scoped>

</style>
