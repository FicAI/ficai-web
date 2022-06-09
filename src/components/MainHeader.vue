<template>
  <q-header elevated class="to-dark-mode">
    <q-toolbar>
      <q-btn
        flat
        dense
        round

        @click="$emit('drawerToggle')"

        icon="menu"
        aria-label="Menu"
      />
      <q-toolbar-title> Fic.ai </q-toolbar-title>
      <slot></slot>
      <q-toggle
        v-model="darkMode"
        @update:model-value="updateDarkMode(darkMode)"
        size="md"
        unchecked-icon="light_mode"
        checked-icon="dark_mode"
        color="orange"
      />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const darkMode = ref($q.dark.isActive);

function updateDarkMode(state: boolean) {
  // todo set header mobile
  $q.dark.set(state);
}
</script>

<style scoped>

</style>
