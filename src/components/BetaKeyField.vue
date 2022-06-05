<template>
  <q-input
    v-model="value"
    outlined
    label="Beta key"
    hint="Key for beta testing"
    hide-hint
    type="text"
    lazy-rules
    :rules="[isRequired]"
  >
    <template v-slot:prepend>
      <q-icon name="key" />
    </template>

  </q-input>
</template>

<script setup lang="ts">
import {isRequired, } from 'components/validators';

import { ref } from 'vue';
let value = ref(null);

</script>

<style scoped>

</style>
