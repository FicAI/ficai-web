<template>
  <q-input
    v-model="value"
    ref="inputRef"
    @blur="onBlur"
    @keydown.enter="onEnter"
    lazy-rules="ondemand"
    :rules="[isValidURL]"
    outlined
    label="Fanfic URL"
    type="text">
    <template v-slot:prepend>
      <q-icon name="auto_stories" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { isValidURL } from 'components/validators';

import { ref, onMounted } from 'vue';

const props = defineProps<{
  initialUrl?: string | null;
}>();

const emit = defineEmits(['validValue']);

let value = ref(props.initialUrl);
let inputRef = ref();

function onBlur() {
  const isValid = inputRef.value.validate();
  console.log('Validating', isValid, value.value);
  emit('validValue', isValid ? value.value : null);
  if (!value.value) {
    inputRef.value.resetValidation();
  }
}

function onEnter() {
  inputRef.value.blur();
}

// validate and pass initial value
onMounted(() => {
  onBlur();
});
</script>

<style scoped></style>
