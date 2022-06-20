<template>
  <q-input
    v-model="value"
    ref="inputRef"
    @blur="validate"
    @update:model-value="onInput"
    @keydown.enter="
      () => {
        $refs.inputRef.blur();
      }
    "
    lazy-rules="ondemand"
    :rules="[isValidUrl, isValidUrlState]"
    outlined
    label="Fanfic URL"
    type="text">
    <template v-slot:prepend>
      <q-icon name="auto_stories" />
    </template>
  </q-input>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { isValidURL } from 'components/validators';
import { QInput } from 'quasar';

export default defineComponent({
  data() {
    return {
      value: '',
      urlInvalidated: false,
    };
  },

  methods: {
    onInput() {
      this.urlInvalidated = false;
    },

    isValidUrl(value: string) {
      return isValidURL(value);
    },

    isValidUrlState() {
      return !this.urlInvalidated || 'This URL is not supported!';
    },

    invalidateUrlState() {
      this.urlInvalidated = true;
    },

    validate() {
      const isValid = (this.$refs.inputRef as QInput).validate(this.value);
      this.$emit('validValue', isValid ? this.value : null);
      if (!this.value) {
        (this.$refs.inputRef as QInput).resetValidation();
      }
    },

    setUrl(url: string) {
      this.value = url;
      this.urlInvalidated = false;
      this.validate();
    },
  },
});
</script>

<style scoped></style>
