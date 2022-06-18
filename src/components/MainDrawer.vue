<template>
  <q-drawer bordered v-model="open" side="left" :width="200" :breakpoint="500">
    <q-list padding>
      <div>logged in as {{ auth.email }}</div>
      <slot></slot>
    </q-list>
  </q-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from 'stores/auth';

export default defineComponent({
  data() {
    return {
      open: false,
      auth: useAuthStore(),
    };
  },
  methods: {
    toggle() {
      this.open = !this.open;
    },
    set(state: boolean) {
      this.open = state;
    },
  },
});
</script>

<style scoped></style>
