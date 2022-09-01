<template>
  <q-header elevated class="to-dark-mode">
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        class="q-mr-sm"
        @click="$emit('drawerToggle')"
        icon="menu"
        aria-label="Menu" />
      <q-separator vertical inset />
      <q-toolbar-title> Fic.ai </q-toolbar-title>
      <slot></slot>
      <q-toggle
        v-model="darkMode"
        toggle-indeterminate
        @update:model-value="preferences.setDarkMode(darkMode)"
        size="md"
        unchecked-icon="light_mode"
        checked-icon="dark_mode"
        indeterminate-icon="brightness_medium"
        color="orange">
        <q-tooltip
          self="center right"
          anchor="center left"
          transition-show="jump-left"
          transition-hide="jump-right"
          :offset="[-5, 0]"
          :delay="250">
          Dark mode:
          {{ darkMode === null ? 'auto' : darkMode ? 'enabled' : 'disabled' }}
        </q-tooltip>
      </q-toggle>
    </q-toolbar>
    <q-banner
      inline-actions
      class="text-white bg-orange"
      v-if="version.isOutdated">
      <template v-slot:avatar>
        <q-icon name="system_update_alt" color="white" />
      </template>
      New version of browser extension is available. <br />
      It is recommended to update.
      <template v-slot:action>
        <q-btn flat class="q-mr-sm" color="white" label="Update" />
        <q-btn
          flat
          color="white"
          icon="close"
          @click="version.outdated = false" />
      </template>
    </q-banner>

    <q-banner inline-actions class="text-white bg-red" v-if="version.isRetired">
      <template v-slot:avatar>
        <q-icon name="system_update_alt" color="white" />
      </template>
      This version of browser extension is retired. <br />
      You may experience errors unless you update.
      <template v-slot:action>
        <q-btn flat class="q-mr-sm" color="white" label="Update" />
        <q-btn
          flat
          color="white"
          icon="close"
          @click="version.retired = false" />
      </template>
    </q-banner>
  </q-header>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, toRef } from 'vue';
import { useQuasar } from 'quasar';
import { useUserPreferencesStore } from 'stores/preferences';
import { useVersionStore } from 'stores/version';

const $q = useQuasar();

const preferences = useUserPreferencesStore();
const darkMode = ref(preferences.darkMode);

const version = useVersionStore();

function updateAddressBar(darkActive: boolean) {
  if (darkActive) {
    $q.addressbarColor.set('#1d1d1d');
  } else {
    $q.addressbarColor.set('#1976d2');
  }
}

onMounted(() => {
  if ($q.bex) {
    version.fetchCached();
  }

  updateAddressBar($q.dark.isActive);
  // we need watch because native dark mode may be changed by user externally
  watch(toRef($q.dark, 'isActive'), darkActive => {
    updateAddressBar(darkActive);
  });
});
</script>

<style scoped></style>
