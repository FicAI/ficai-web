<template>
  <q-select
    v-model="tags"
    ref="selectRef"

    label="Fanfic tags"
    filled
    use-input
    use-chips
    multiple
    behavior="menu"

    :input-debounce="500"
    :options="available_tags"
    @filter="filterOptions"
    @filter-abort="onFilterAbort"
    @remove="onInputRemove"

    new-value-mode="add-unique"
    @new-value="onNewTag"
    @add="onAddTag"
    @input-value="onTextInput"

    class="tag-selector"
    :disable="$attrs.disable"
  >

    <template v-slot:option="scope">
      <q-item dense v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label class="row">
            <div class="col-3">
              <q-chip square dense :ripple="false" class="q-ml-none">{{ scope.opt.name }}</q-chip>
            </div>
            <div class="col-9 row items-center"><span>Tag description</span></div>
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:no-option="scope">
      <q-item>
        <q-item-section>
          <q-item-label v-if="!!scope.inputValue">
            No tags found with such name! Create tag
            <q-chip square dense :ripple="false" class="ellipsis"><span class="ellipsis">{{ scope.inputValue }}</span></q-chip>
            ?
          </q-item-label>
          <q-item-label v-else>
            No tags found!
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:selected>
      <transition-group
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        mode="out-in"
        :duration="350"
      >
        <div
          v-for="(tag, index) in tags"
          :key="tag.name"
          class="col-md-3 col-sm-4 col-xs-6 col-xxs-12 q-pr-sm q-my-xs"
        >
          <FicTagChip
            :url="props.url"
            :tag-signal="tag"

            @click.stop.prevent
            @removeTag="selectRef.removeAtIndex(index)"
            @updateTag="(key, value) => {tags[index][key] = value}"

            vote-on-mount
            confirmLastVote

            style="width: 100%"
          />
        </div>
      </transition-group>
      <div class="col-12"></div>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import FicTagChip from 'components/FicTagChip.vue'
import {ApiSignal, TagSignal} from 'components/models';
import { signals_api } from 'boot/axios';

import {ref, Ref, onMounted, watch} from 'vue';
import { useQuasar } from 'quasar';

const props = defineProps<{
  url: string | null
}>()

const $q = useQuasar();

const SIGNALS_ROUTE = '/signals'
const TAGS_ROUTE = '/tags'

const tags = ref([]);
const available_tags = ref([]);
const selectRef: Ref = ref(null);

let requestAbort: AbortController | null = null;

// Converters

function tagToTagSignal(tagName: string) {
  return {
    name: tagName,
    my_signal: null,
    for: 0,
    against: 0,
  } as TagSignal
}

function apiToTagSignal(apiData: ApiSignal){
  return {
    name: apiData.tag,
    my_signal: apiData.signal,
    for: apiData.signalsFor,
    against: apiData.signalsAgainst,
  } as TagSignal
}

// Fetching data

function fetchSignals() {
  console.log('FETCH', props.url)
  tags.value.length = 0;
  // selectRef.value.reset();
  if (!props.url){
    return;
  }

  signals_api.get(SIGNALS_ROUTE, {params: {url: props.url}})
    .then(response => {
      console.log('resp', response.data.tags)
      for (const [i, v] of response.data.tags.entries()){
        setTimeout(()=>{
          selectRef.value.add(apiToTagSignal(v), true);
        }, (i*150)+1) // yes this is very dirty, but Quazar literally cannot add several elements at once
      }
    })
    .catch()
}

onMounted(() => {
  // todo debounce
  fetchSignals();
  watch(()=>props.url, ()=> {
    fetchSignals();
  })
})

// Event handlers

function filterOptions (val: string, update: (callbackFn: () => void) => void, abort: () => void) {
  // todo fetch only N matching tags or optimize fetching in some way
  requestAbort = new AbortController();
  signals_api.get(TAGS_ROUTE, {signal: requestAbort.signal})
    .then(response => {
      update(() => {
        let tagOptions = response.data.tags;
        console.log('filtering tags', tags.value, val, tagOptions)
        if (!!val) {
          const needle = val.toLowerCase();
          tagOptions = tagOptions.filter((v: string) => v.toLowerCase().indexOf(needle) > -1);
        }
        const currentTagNames = tags.value.map((v: TagSignal) => {return v.name.toLowerCase()});
        tagOptions = tagOptions.filter((v: string) => !currentTagNames.includes(v.toLowerCase()));
        tagOptions = tagOptions.map(tagToTagSignal);
        available_tags.value = tagOptions as never;
      })
    })
    .catch(() => {
      abort();
      // todo alerts?
    })
    .finally(() =>{
      requestAbort = null;
    })
}

function onFilterAbort(){
  // todo check/test for race conditions
  requestAbort?.abort()
  console.log('Aborting filter request', requestAbort)
}

function onNewTag(inputValue: string, doneFn: (item: TagSignal | null, mode: string) => void){
  // convert string input into signal tag, send request
  const tagNames = tags.value.map((v: TagSignal) => {return v.name.toLowerCase()});
  console.log(inputValue, tagNames)
  if (tagNames.includes(inputValue.toLowerCase())){
    doneFn(null, 'add-unique'); // must be called to add 'nothing'
    selectRef.value.updateInputValue(''); // reset text input
    $q.notify({
      color: 'negative',
      position: 'top',
      message: `Tag '${inputValue}' is already placed on the fic!`,
      icon: 'report_problem',
    });
  } else {
    const newTag = tagToTagSignal(inputValue);
    doneFn(newTag, 'add-unique');
  }
}

interface Details {
  index: number;
  value: TagSignal;
}

function onAddTag(details: Details){
  // remove tag from options when it was added to the tags field
  available_tags.value.splice(available_tags.value.indexOf(details.value as never), 1);
}


function onInputRemove(details: Details) {
  // prevent removal of tags that were voted on
  console.log(details.value.for, details.value.against)
  if (details.value.for !== 0 || details.value.against !== 0){
    // selectRef.value.blur();
    console.log('Prevented removal of', details)
    setTimeout(()=>{
      tags.value.splice(details.index, 0, details.value as never);
    }, 1) // yes this is very dirty, but it seems to me there is no better way with current Quasar API
  }
}

function onTextInput(value: string){
  // todo work out proper regex for tags
  const newValue = value.replace(/[^A-Za-z\d-_!/()*`]*/g, '');
  selectRef.value.updateInputValue(newValue, true);
}

</script>

<style>
.tag-selector .q-field__append {
  padding-left: 0;
}

</style>

<style scoped>
.q-chip--dark {
  background: var(--q-dark-page);
}

</style>
