<template>
  <q-btn-group size="sm">
    <q-btn :outline="!votedAgainst()" :loading="loadingStates.against" @click="toggleAgainst" color="red" size="sm" class="q-px-sm q-py-none btn-chip">
      -{{ tagSignalRef.against }}
      <q-tooltip >Against: {{ tagSignalRef.against }}</q-tooltip>
    </q-btn>
    <q-btn no-caps size="sm" :disable="anyLoading()" class="q-px-sm q-py-none btn-chip btn-chip-center ellipsis">
      <span class="ellipsis">{{ tagSignalRef.name }}</span>
      <q-tooltip :delay="500" max-width="200px"> Very long tag description Very long tag descriptionVery long tag descriptionVery long tag descriptionVery long tag descriptionVery long tag descriptionVery long tag descriptionVery long tag descriptionVery long tag description </q-tooltip>
    </q-btn>
    <q-btn :outline="!votedFor()" :loading="loadingStates.for" @click="toggleFor" color="green" size="sm" class="q-px-sm q-py-none btn-chip">
      +{{ tagSignalRef.for }}
      <q-tooltip >For: {{ tagSignalRef.for }}</q-tooltip>
    </q-btn>
  </q-btn-group>
</template>

<script setup lang="ts">
import {onMounted, reactive, toRef} from 'vue';
import {TagSignal} from 'components/models';

import { signals_api } from 'boot/axios';

const props = defineProps<{
  url: string
  tagSignal: TagSignal
  voteOnMount?: boolean
}>();

const tagSignalRef = toRef(props, 'tagSignal');

const loadingStates = reactive({
  'for': false,
  'against': false,
  'any': false,
});

function anyLoading(){
  return loadingStates.for || loadingStates.against || loadingStates.any;
}

function votedFor(){
  return props.tagSignal.my_signal === true;
}

function votedAgainst(){
  return props.tagSignal.my_signal === false;
}

const SIGNALS_ROUTE = '/signals';

function sendMySignal(signal: boolean | null, source: keyof typeof loadingStates = 'any'){
  const action: string = (signal === true) ? 'add' : (signal === false) ? 'rm' : 'erase';
  loadingStates[source] = true;
  signals_api.patch(SIGNALS_ROUTE, {url: props.url, [action]: [tagSignalRef.value.name]})
    .then(response => {
      // loadingStates[source] = false;
      setTimeout(() => {loadingStates[source] = false;}, 150)

      if (votedFor() && signal !== true){
        // if previously voted for, but now vote is not for
        tagSignalRef.value.for -= 1;
      }
      if (votedAgainst() && signal !== false){
        // if previously voted against, but now vote is not against
        tagSignalRef.value.against -= 1;
      }

      if (signal === true && !votedFor()){
        // if previously voted not for, but now vote is for
        tagSignalRef.value.my_signal = true;
        tagSignalRef.value.for += 1;
      } else if (signal === false && !votedAgainst()) {
        // if previously voted not against, but now vote is against
        tagSignalRef.value.my_signal = false;
        tagSignalRef.value.against += 1;
      }
      if (signal == null) {
        tagSignalRef.value.my_signal = null;
      }
    })
  // todo error handling
}

function toggleFor() {
  if (votedFor()) {
    sendMySignal(null, 'for');
  } else {
    sendMySignal(true, 'for');
  }
}

function toggleAgainst() {
  if (votedAgainst()) {
    sendMySignal(null, 'against');
  } else {
    sendMySignal(false, 'against');
  }
}

onMounted(() => {
  if (props.voteOnMount && tagSignalRef.value.for === 0 && tagSignalRef.value.against === 0){
    console.log('SENT +', tagSignalRef.value.name)
    sendMySignal(true, 'for');
  }
})


</script>

<style scoped>
.btn-chip-center{
  width: 100% !important;
}

.btn-chip.q-btn--outline, .btn-chip-center{
  background: #e0e0e0 !important;
}
.body--dark .btn-chip.q-btn--outline, .body--dark .btn-chip-center {
  background: var(--q-dark) !important;
}
</style>
