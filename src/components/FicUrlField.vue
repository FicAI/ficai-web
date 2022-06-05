<template>
  <q-input
    v-model="value"
    ref="inputRef"
    @blur="onBlur"
    outlined
    label="Fanfic URL"
    type="text"
    lazy-rules="ondemand"
    :rules="[isValidURL]"
  >
    <template v-slot:prepend>
      <q-icon name="auto_stories" />
    </template>
    </q-input>
</template>

<script setup lang="ts">
import {isValidURL, } from 'components/validators';

import { ref, onMounted } from 'vue';

const props = defineProps<{
  initialUrl?: string | null
}>()

const emit = defineEmits(['validValue',])

let value = ref(props.initialUrl);
let inputRef = ref();

function onBlur(){
  const isValid = inputRef.value.validate();
  console.log('Validating', isValid, value.value);
  // if (isValid){
  //   emit('validValue', value.value)
  // }
  emit('validValue', isValid ? value.value : null)
  if (!value.value){
    inputRef.value.resetValidation();
  }
}

// validate and pass initial value
onMounted(() => {
  onBlur();
})

</script>

<style scoped>

</style>
