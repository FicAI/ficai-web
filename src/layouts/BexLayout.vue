<template>
  <q-layout view="lHh Lpr lFf" style="">
    <MainHeader @drawerToggle="drawer.toggle()">
      <q-btn @click="newTab" class="q-mr-md" flat>Open full-size</q-btn>
    </MainHeader>
    <MainDrawer ref="drawer">
      <q-item clickable :to="{ name: 'tag-me-bex' }">
        <q-item-section avatar>
          <q-icon name="sell" />
        </q-item-section>
        <q-item-section>Tag a fic!</q-item-section>
      </q-item>
    </MainDrawer>
    <q-page-container>
      <router-view> </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import MainHeader from 'components/MainHeader.vue';
import MainDrawer from 'components/MainDrawer.vue';

import { ref } from 'vue';

const drawer = ref(null);

function newTab() {
  chrome.tabs.create({ url: chrome.extension.getURL('www/index.html') });
}
</script>

<style>
body.bex {
  /*fixes problem with qdialog in BEX popup*/
  position: static !important;
  width: 600px;
  height: 600px;
}
</style>
