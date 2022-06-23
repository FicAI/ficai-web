<template>
  <div class="">
    <q-field
      outlined
      v-model="noTags"
      :label="
        noTags === null
          ? 'This fanfic has no tags yet'
          : 'Fanfic tags: vote or add new'
      "
      readonly
      class="tags-field q-pb-md">
      <template v-slot:control>
        <div class="row q-pt-sm" style="width: 100%">
          <transition-group
            name="tags"
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
            mode="out-in"
            :duration="350">
            <div
              v-for="(tag, index) in tags"
              :key="tag.name"
              class="col-md-3 col-sm-4 col-xs-6 col-xxs-12 q-pr-sm q-pb-sm">
              <FicTagChip
                :url="props.url"
                :tag-signal="tag"
                @click.stop.prevent
                @removeTag="onRemoveTag(index)"
                @updateTag="
                  (key, value) => {
                    tags[index][key] = value;
                  }
                "
                vote-on-mount
                confirmLastVote
                style="width: 100%" />
            </div>
          </transition-group>
        </div>
      </template>
    </q-field>

    <q-select
      v-model="tags"
      ref="selectRef"
      label="Add new tags"
      outlined
      use-input
      use-chips
      multiple
      hide-selected
      behavior="menu"
      menu-anchor="bottom middle"
      menu-self="top middle"
      :input-debounce="500"
      :options="available_tags"
      @filter="filterOptions"
      @filter-abort="onFilterAbort"
      new-value-mode="add-unique"
      @new-value="onNewTag"
      @add="onAddTag"
      @input-value="onTextInput"
      class="tag-selector"
      :disable="$attrs.disable">
      <template v-slot:option="scope">
        <q-item dense v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label class="row">
              <div class="col-sm-3 col-xs-5">
                <q-chip square dense :ripple="false" class="q-ml-none ellipsis">
                  <span class="ellipsis">{{ scope.opt.name }}</span>
                </q-chip>
              </div>
              <div class="col-sm-9 col-xs-7 q-pl-sm row items-center">
                <span>Tag description</span>
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>

      <template v-slot:no-option="scope">
        <q-item v-if="tagsNames().includes(scope.inputValue.toLowerCase())">
          <q-item-section>
            <q-item-label>
              Tag
              <q-chip square dense :ripple="false" class="ellipsis">
                <span class="ellipsis">{{ scope.inputValue }}</span>
              </q-chip>
              is already placed on this fic!
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          @click="onNewTagManual(scope.inputValue)"
          clickable
          v-ripple
          v-else-if="!!scope.inputValue">
          <q-item-section>
            <q-item-label>
              No tags found with such name! Create tag
              <q-chip square dense :ripple="false" class="ellipsis">
                <span class="ellipsis">{{ scope.inputValue }}</span>
              </q-chip>
              ?
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-else>
          <q-item-section>
            <q-item-label> No tags found! </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script setup lang="ts">
import FicTagChip from 'components/FicTagChip.vue';
import { ApiSignal, TagSignal } from 'components/models';
import { signals_api } from 'boot/axios';

import { ref, Ref, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';

const props = defineProps<{
  url: string | null;
}>();

const emit = defineEmits(['fetching', 'ready']);

const $q = useQuasar();

// fix for v-ripple directive errors
// as per https://github.com/quasarframework/quasar/issues/13154#issuecomment-1113273509
defineExpose({
  $q,
});

const SIGNALS_ROUTE = '/signals';
const TAGS_ROUTE = '/tags';

const noTags: Ref<false | null> = ref(false);
const tags = ref([]);
const available_tags = ref([]);

const selectRef: Ref = ref(null);

let requestAbort: AbortController | null = null;

function tagsNames() {
  return tags.value.map((v: TagSignal) => {
    return v.name.toLowerCase();
  });
}

// Converters

function tagToTagSignal(tagName: string) {
  return {
    name: tagName,
    my_signal: null,
    for: 0,
    against: 0,
  } as TagSignal;
}

function apiToTagSignal(apiData: ApiSignal) {
  return {
    name: apiData.tag,
    my_signal: apiData.signal,
    for: apiData.signalsFor,
    against: apiData.signalsAgainst,
  } as TagSignal;
}

// Fetching data

function fetchSignals() {
  console.log('FETCH', props.url);
  const wasEmpty = tags.value.length == 0;
  tags.value.length = 0;
  if (!props.url) {
    return;
  }

  emit('fetching', true);

  signals_api
    .get(SIGNALS_ROUTE, { params: { url: props.url } })
    .then(response => {
      emit('ready', true);
      console.log('resp', response.data.tags);
      const processedTags: Array<never> =
        response.data.tags.map(apiToTagSignal);
      // we add timeout when field already had tags previously, so they can finish fadeout animation
      setTimeout(
        () => {
          tags.value.push(...processedTags);
          // needs to be null to make field label full-size
          noTags.value = processedTags.length === 0 ? null : false;
        },
        wasEmpty ? 0 : 400,
      );
    })
    .catch(error => {
      emit('ready', false);
      // todo check error code
      $q.notify({
        color: 'negative',
        position: 'top',
        message: `Failed to load tags for this fic URL: ${error}`,
        icon: 'report_problem',
      });
    })
    .finally(() => {
      emit('fetching', false);
    });
}

onMounted(() => {
  fetchSignals();
  watch(
    () => props.url,
    () => {
      fetchSignals();
    },
  );
});

// Event handlers

function filterOptions(
  inputText: string,
  update: (callbackFn: () => void) => void,
  abort: () => void,
) {
  // todo fetch only N matching tags or optimize fetching in some way
  requestAbort = new AbortController();
  signals_api
    .get(TAGS_ROUTE, {
      signal: requestAbort.signal,
      params: { q: inputText, limit: 50 },
    })
    .then(response => {
      update(() => {
        let tagOptions = response.data.tags;
        console.log('filtering tags', tags.value, inputText, tagOptions);
        const currentTagNames = tagsNames();
        tagOptions = tagOptions.filter(
          (v: string) => !currentTagNames.includes(v.toLowerCase()),
        );
        tagOptions = tagOptions.map(tagToTagSignal);
        available_tags.value = tagOptions as never;
      });
    })
    .catch(() => {
      abort();
      // todo alerts?
    })
    .finally(() => {
      requestAbort = null;
    });
}

function onFilterAbort() {
  // todo check/test for race conditions
  requestAbort?.abort();
  console.log('Aborting filter request', requestAbort);
}

function onNewTagManual(inputValue: string) {
  onNewTag(inputValue, (item: TagSignal | null) => {
    if (item === null) {
      return;
    }
    selectRef.value.add(item, true);
    selectRef.value.updateInputValue('', true);
    selectRef.value.hidePopup();
    selectRef.value.blur();
  });
}

function onNewTag(
  inputValue: string,
  doneFn: (item: TagSignal | null, mode?: string) => void,
) {
  inputValue = inputValue.trim();
  // convert string input into signal tag, send request
  if (tagsNames().includes(inputValue.toLowerCase())) {
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

function onAddTag(details: Details) {
  // remove tag from options when it was added to the tags field
  available_tags.value.splice(
    available_tags.value.indexOf(details.value as never),
    1,
  );
  noTags.value = false;
}

function onRemoveTag(index: number) {
  selectRef.value.removeAtIndex(index);
  if (!tags.value.length) {
    noTags.value = null;
  }
}

function onTextInput(value: string) {
  // todo work out proper regex for tags
  const newValue = value
    .replace(/[^A-Za-z\d-_!/()*`\s]*/g, '')
    .replace(/\s+/g, ' ')
    .trimStart();
  selectRef.value.updateInputValue(newValue, true);
}
</script>

<style>
.tags-field .q-field__control {
  padding-right: 0;
  padding-left: 8px;
}

.tags-field .q-field__native {
  padding-top: 0;
  padding-bottom: 0;
}
</style>

<style scoped>
.q-chip--dark {
  background: var(--q-dark-page);
}
</style>
