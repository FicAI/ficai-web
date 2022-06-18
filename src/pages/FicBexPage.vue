<template>
  <q-page class="row justify-evenly q-pa-sm" style="height: 100%">
    <q-card class="q-pa-sm" style="width: 100%">
      <q-card-section class="q-gutter-sm">
        <FicTagsField v-model="ficTags" :disable="!validUrl" :url="validUrl" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import FicTagsField from 'components/FicTagsField.vue';

import { ref, Ref, onMounted } from 'vue';

const validUrl: Ref<string | null> = ref(null);
const ficTags = ref([]);

function getCurrentUrl(): Promise<string> {
  return new Promise(resolve => {
    chrome.tabs.query(
      { currentWindow: true, active: true },
      (result: Array<any>) => {
        resolve(result[0].url);
      },
    );
  });
}
onMounted(() => {
  getCurrentUrl().then(result => {
    validUrl.value = result;
  });
});
</script>

<style scoped></style>
