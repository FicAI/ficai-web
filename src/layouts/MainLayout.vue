<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="to-dark-mode">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Fic.ai </q-toolbar-title>
        <q-toggle
          v-model="darkMode"
          @update:model-value="updateDarkMode(darkMode)"
          size="md"
          unchecked-icon="light_mode"
          checked-icon="dark_mode"
          color="orange"
        />
<!--        <div>Quasar v{{ $q.version }}</div>-->
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header> Sidebar </q-item-label>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition
          appear
          enter-active-class="animated fadeInUp"
          leave-active-class="animated fadeOutUp"
          mode="out-in"
          :duration="300"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const darkMode = ref($q.dark.isActive);
const leftDrawerOpen = ref(false);

function updateDarkMode(state: boolean) {
  $q.dark.set(state);
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

</script>

<style scoped>

</style>
