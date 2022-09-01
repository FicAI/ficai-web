<template>
  <q-page class="row items-baseline justify-evenly q-pt-xl">
    <q-card class="q-pa-sm" style="width: 650px">
      <q-card-section>
        <FicUrlField
          v-model="inputUrl"
          ref="urlRef"
          :debounce="500"
          :loading="tagsFetching"
          @validValue="onValidatedValue"
          :hint="!validatedUrl ? 'Input fanfic URL to start tagging' : void 0"
          hide-bottom-space />
        <div class="q-mt-md" v-show="!!validatedUrl && !!tagsReady">
          <FicTagsField
            @fetching="onFetching"
            @ready="onReady"
            :url="validatedUrl" />
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
import { useMeta } from 'quasar';

const route = useRoute();
const router = useRouter();

const inputUrl: Ref<string> = ref(getUrl());
const validatedUrl: Ref<string | null> = ref(null);

const tagsFetching: Ref<boolean> = ref(false);
const tagsReady: Ref<boolean | null> = ref(null);

const urlRef = ref();

function onFetching(state: boolean) {
  tagsFetching.value = state;
}

function onReady(state: boolean) {
  tagsReady.value = state;
  if (!state) {
    urlRef.value.invalidateUrlState();
    urlRef.value.validate();
  }
}

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
  validatedUrl.value = value;
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

useMeta(() => {
  return {
    title: validatedUrl.value || 'a fic',
    titleTemplate: title => `Fic.ai - tagging ${title}`,
  };
});
</script>

<style scoped></style>
