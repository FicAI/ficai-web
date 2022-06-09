<template>
  <q-layout view="lHh LpR lFf">
    <MainHeader @drawerToggle="drawer.toggle()"></MainHeader>
    <MainDrawer ref="drawer">
      <!--        todo make a DrawerItem component-->
      <q-item clickable :to="{ name: 'tag-me' }">
        <q-item-section avatar><q-icon name="sell" /></q-item-section>
        <q-item-section>Tag a fic!</q-item-section>
      </q-item>
    </MainDrawer>

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
import MainHeader from 'components/MainHeader.vue';
import MainDrawer from 'components/MainDrawer.vue';

import { ref } from 'vue';

const drawer = ref(null);
</script>

<style scoped>

</style>

