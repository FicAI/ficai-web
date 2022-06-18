<template>
  <div>
    <q-card-section>
      <q-form
        @submit="onSubmit"
        :id="form_id"
        class="q-gutter-md"
        novalidate="novalidate">
        <slot name="fields"></slot>
      </q-form>
    </q-card-section>

    <q-card-actions vertical class="q-px-md q-pb-md">
      <q-btn
        :label="submit_label"
        type="submit"
        color="primary"
        size="lg"
        :form="form_id"
        :loading="submitting">
        <q-badge color="orange" floating>Beta only</q-badge>
      </q-btn>
    </q-card-actions>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const props = defineProps<{
  form_id: string;
  submit_label: string;
  submitAction: () => Promise<void>;
}>();

const emit = defineEmits(['denied']);

const route = useRoute();
const router = useRouter();

const submitting = ref(false);

function onSubmit() {
  submitting.value = true;
  props
    .submitAction()
    .then(() => {
      // redirect to specified in query (previous) page or to the index
      router.push(String(route.query.next || '/'));
    })
    .catch(() => {
      // shake form on error
      emit('denied');
    })
    .finally(() => {
      submitting.value = false;
    });
}
</script>

<style scoped></style>
