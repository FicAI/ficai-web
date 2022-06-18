<template>
  <q-header elevated class="to-dark-mode">
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        @click="$emit('drawerToggle')"
        icon="menu"
        aria-label="Menu" />
      <q-toolbar-title> Fic.ai </q-toolbar-title>
      <slot></slot>
      <q-toggle
        v-model="darkMode"
        @update:model-value="preferences.setDarkMode(darkMode)"
        size="md"
        unchecked-icon="light_mode"
        checked-icon="dark_mode"
        color="orange" />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserPreferencesStore } from 'stores/preferences';

const preferences = useUserPreferencesStore();
const darkMode = ref(preferences.darkMode);
</script>

<style scoped></style>
