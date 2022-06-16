<template>
  <q-page class="row items-center justify-evenly">
    <q-card class="q-pa-sm" style="width: 650px">
      <q-card-section>
        <FicUrlField
          v-model="inputUrl"
          :initial-url="$route.query.url"
          :debounce="500"
          @validValue="(value) => validUrl = value"
          :hint="!validUrl ? 'Input fanfic URL to start tagging' : void 0"
          hide-bottom-space
        />
        <div class="q-mt-md" v-show="!!validUrl">
          <FicTagsField
            v-model="ficTags"
            :disable="!validUrl"
            :url="validUrl"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import FicUrlField from 'components/FicUrlField.vue';
import FicTagsField from 'components/FicTagsField.vue';

import {onMounted, Ref, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';

const route = useRoute();
const router = useRouter();

const inputUrl = ref(route.query.url);
const validUrl: Ref<string | null> = ref(null);
const ficTags = ref([]);


onMounted(()=>{
  watch(inputUrl, (url) => {
    const query = {...route.query}
    if (!!url){
      query.url = url;
    } else {
      delete query.url;
    }
    router.replace({query: query});
  })

})

</script>

<style scoped>

</style>
