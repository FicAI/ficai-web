<template>
  <q-btn-group size="sm" :class="{ 'dimmed-tag': noVotes() }">
    <q-btn
      :outline="!votedAgainst()"
      :loading="loadingStates.against"
      :disable="anyLoading()"
      @click="toggleAgainst"
      color="red"
      size="sm"
      class="q-px-sm q-py-none btn-chip">
      -{{ tagSignalRef.against }}
      <q-tooltip :delay="400">Against: {{ tagSignalRef.against }}</q-tooltip>
    </q-btn>
    <q-btn
      :disable="anyLoading()"
      no-caps
      size="sm"
      class="q-px-sm q-py-none btn-chip btn-chip-center ellipsis">
      <span class="ellipsis"
        >{{ tagSignalRef.name }}
        <q-badge v-if="noVotes()" floating color="yellow">
          <q-icon name="warning" color="black"
        /></q-badge>
      </span>
      <q-tooltip v-if="!noVotes()" :delay="400" max-width="200px">
        <span class="text-bold text-center">{{ tagSignalRef.name }}</span>
        <br />
        Very long tag description Very long tag descriptionVery long tag
        descriptionVery long tag descriptionVery long tag descriptionVery long
        tag descriptionVery long tag descriptionVery long tag descriptionVery
        long tag description
      </q-tooltip>
      <q-tooltip v-else :delay="400" class="bg-red">
        <q-icon name="warning" />
        <span class="text-bold">Failed to add this tag!</span> <br />
        Please try voting on it again.
      </q-tooltip>
    </q-btn>
    <q-btn
      :outline="!votedFor()"
      :loading="loadingStates.for"
      :disable="anyLoading()"
      @click="toggleFor"
      color="green"
      size="sm"
      class="q-px-sm q-py-none btn-chip">
      +{{ tagSignalRef.for }}
      <q-tooltip :delay="400">For: {{ tagSignalRef.for }}</q-tooltip>
    </q-btn>
  </q-btn-group>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRef } from 'vue';
import { Notify, useQuasar } from 'quasar';

import { TagSignal } from 'components/models';
import { signals_api } from 'boot/axios';

const props = defineProps<{
  url: string;
  tagSignal: TagSignal;
  voteOnMount?: boolean;
  confirmLastVote?: boolean;
}>();

const emit = defineEmits(['updateTag', 'removeTag']);

const $q = useQuasar();
const tagSignalRef = toRef(props, 'tagSignal');

const loadingStates = reactive({
  for: false,
  against: false,
  any: false,
});

function anyLoading() {
  return loadingStates.for || loadingStates.against || loadingStates.any;
}

function votedFor() {
  return tagSignalRef.value.my_signal === true;
}

function votedAgainst() {
  return tagSignalRef.value.my_signal === false;
}

// function votedNone(){
//   return tagSignalRef.value.my_signal === null;
// }

function noVotes() {
  return tagSignalRef.value.for === 0 && tagSignalRef.value.against === 0;
}

// function totalRating() {
//   return tagSignalRef.value.for - tagSignalRef.value.against;
// }

const SIGNALS_ROUTE = '/signals';

function sendMySignal(
  signal: boolean | null,
  source: keyof typeof loadingStates = 'any',
) {
  const action: string =
    signal === true ? 'add' : signal === false ? 'rm' : 'erase';
  loadingStates[source] = true;
  return signals_api
    .patch(SIGNALS_ROUTE, {
      url: props.url,
      [action]: [tagSignalRef.value.name],
    })
    .then(() => {
      if (votedFor() && signal !== true) {
        // if previously voted for, but now vote is not for
        tagSignalRef.value.for -= 1;
        emit('updateTag', 'for', tagSignalRef.value.for);
      }
      if (votedAgainst() && signal !== false) {
        // if previously voted against, but now vote is not against
        tagSignalRef.value.against -= 1;
        emit('updateTag', 'against', tagSignalRef.value.against);
      }

      if (signal === true && !votedFor()) {
        // if previously voted not for, but now vote is for
        tagSignalRef.value.my_signal = true;
        tagSignalRef.value.for += 1;
        emit('updateTag', 'for', tagSignalRef.value.for);
      } else if (signal === false && !votedAgainst()) {
        // if previously voted not against, but now vote is against
        tagSignalRef.value.my_signal = false;
        tagSignalRef.value.against += 1;
        emit('updateTag', 'against', tagSignalRef.value.against);
      }
      if (signal === null) {
        tagSignalRef.value.my_signal = null;
      }
    })
    .catch(error => {
      let actionMessage: string;
      if (signal === null) {
        actionMessage = `erase vote ${
          tagSignalRef.value.my_signal === true ? 'for' : 'against'
        }`;
      } else {
        actionMessage = `add vote ${signal === true ? 'for' : 'against'}`;
      }
      Notify.create({
        color: 'negative',
        position: 'top',
        message: `Failed to ${actionMessage} tag '${tagSignalRef.value.name}' : ${error.message}`,
        icon: 'report_problem',
      });
    })
    .finally(() => {
      loadingStates[source] = false;
    });
}

function clearVote(source: keyof typeof loadingStates = 'any') {
  if (
    props.confirmLastVote &&
    ((votedFor() &&
      tagSignalRef.value.for === 1 &&
      tagSignalRef.value.against === 0) ||
      (votedAgainst() &&
        tagSignalRef.value.against === 1 &&
        tagSignalRef.value.for === 0))
  ) {
    // Ask user confirmation when it's the last vote left
    $q.dialog({
      title: 'Confirm tag deletion',
      message: `If you remove your vote${source != 'any' ? ' ' + source : ''},
        tag "${
          tagSignalRef.value.name
        }" will be deleted from this fic. Proceed?`,
      cancel: true,
      persistent: true,
      color: 'blue',
    }).onOk(() => {
      sendMySignal(null, source).then(() => {
        emit('removeTag');
      });
    });
  } else {
    sendMySignal(null, source);
  }
}

function toggleFor() {
  if (votedFor()) {
    clearVote('for');
  } else {
    sendMySignal(true, 'for');
  }
}

function toggleAgainst() {
  if (votedAgainst()) {
    clearVote('against');
  } else {
    sendMySignal(false, 'against');
  }
}

onMounted(() => {
  if (
    props.voteOnMount &&
    tagSignalRef.value.for === 0 &&
    tagSignalRef.value.against === 0
  ) {
    console.log('SENT +', tagSignalRef.value.name);
    sendMySignal(true, 'for');
  }
});
</script>

<style scoped>
.btn-chip-center {
  width: 100% !important;
}

.btn-chip.q-btn--outline,
.btn-chip-center {
  background: #e0e0e0 !important;
}
.body--dark .btn-chip.q-btn--outline,
.body--dark .btn-chip-center {
  background: var(--q-dark-page) !important;
}

.btn-chip .q-badge {
  top: 3px;
  right: 3px;
  padding: 2px;
}
.btn-chip .q-badge .q-icon {
  font-size: 0.6rem;
}
</style>

<style>
.btn-chip.disabled,
.btn-chip.disabled * {
  cursor: pointer !important;
}

.dimmed-tag {
  opacity: 0.7;
}

.dimmed-tag .disabled {
  opacity: 1 !important;
}
</style>
