<template>
  <q-page class="q-pa-sm row items-stretch">
    <q-card class="q-pa-sm col">
      <q-card-section class="q-gutter-sm">
        <FicTagsField
          v-if="tagsReady !== false"
          :loading="tagsFetching"
          :disable="tagsFetching"
          @fetching="onFetching"
          @ready="onReady"
          :url="tabUrl" />
        <q-banner v-else rounded inline-actions class="text-white bg-red">
          <template v-slot:avatar>
            <q-icon name="highlight_off" color="primary" />
          </template>
          Unfortunately, this site is not supported yet. <br />
          Try another one ;)
          <template v-slot:action>
            <q-btn flat color="white" label="Close" />
          </template>
        </q-banner>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import FicTagsField from 'components/FicTagsField.vue';

import { ref, Ref, onMounted } from 'vue';

const tabUrl: Ref<string | null> = ref(null);

const tagsFetching: Ref<boolean> = ref(false);
const tagsReady: Ref<boolean | null> = ref(null);

function onFetching(state: boolean) {
  tagsFetching.value = state;
}

function onReady(state: boolean) {
  tagsReady.value = state;
}

function getCurrentUrl(): Promise<string> {
  return new Promise(resolve => {
    chrome.tabs.query(
      { currentWindow: true, active: true },
      (result: Array<never>) => {
        resolve(result[0]['url']);
      },
    );
  });
}

onMounted(() => {
  getCurrentUrl().then(result => {
    tabUrl.value = result;
  });
});
</script>

<style scoped></style>
