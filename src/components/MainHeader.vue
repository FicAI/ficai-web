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
        toggle-indeterminate
        @update:model-value="preferences.setDarkMode(darkMode)"
        size="md"
        unchecked-icon="light_mode"
        checked-icon="dark_mode"
        indeterminate-icon="auto_mode"
        color="orange" />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, toRef } from 'vue';
import { useQuasar } from 'quasar';
import { useUserPreferencesStore } from 'stores/preferences';

const $q = useQuasar();

const preferences = useUserPreferencesStore();
const darkMode = ref(preferences.darkMode);

function updateAddressBar(darkActive: boolean) {
  if (darkActive) {
    $q.addressbarColor.set('#1d1d1d');
  } else {
    $q.addressbarColor.set('#1976d2');
  }
}

onMounted(() => {
  // we need watch because native dark mode may be changed by user externally
  watch(toRef($q.dark, 'isActive'), darkActive => {
    updateAddressBar(darkActive);
  });
  updateAddressBar($q.dark.isActive);
});
</script>

<style scoped></style>
