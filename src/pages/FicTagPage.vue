<template>
  <q-page class="row items-center justify-evenly">
    <q-card class="q-pa-sm" style="width: 650px">
      <q-card-section>
        <FicUrlField
          v-model="inputUrl"
          ref="urlRef"
          :debounce="500"
          @validValue="onValidatedValue"
          :hint="!validUrl ? 'Input fanfic URL to start tagging' : void 0"
          hide-bottom-space />
        <div class="q-mt-md" v-show="!!validUrl">
          <FicTagsField
            v-model="ficTags"
            :disable="!validUrl"
            :url="validUrl" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import FicUrlField from 'components/FicUrlField.vue';
import FicTagsField from 'components/FicTagsField.vue';

import { Ref, ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const inputUrl: Ref<string> = ref(getUrl());
const validUrl: Ref<string | null> = ref(null);
const ficTags = ref([]);

const urlRef = ref();

function getUrl() {
  return route.query.url?.toString() || '';
}

function makeQuery(url: string | null) {
  const query = { ...route.query };
  if (!!url) {
    query.url = url;
  } else {
    delete query.url;
  }
  return query;
}

function onValidatedValue(value: string | null) {
  // called every time user 'submitted' url, valid or not
  validUrl.value = value;
  if (inputUrl.value != getUrl()) {
    router.push({ query: makeQuery(inputUrl.value) });
  }
}

onMounted(() => {
  urlRef.value.setUrl(inputUrl.value); // to provide initial url validation

  watch(route, () => {
    const url = getUrl();
    if (url == inputUrl.value) {
      return;
    }
    inputUrl.value = url;
    urlRef.value.setUrl(url);
  });
});
</script>

<style scoped></style>
