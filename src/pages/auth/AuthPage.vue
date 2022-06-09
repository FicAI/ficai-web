<template>
  <q-page class="row items-center justify-evenly">
    <q-card
      class="q-pa-sm"
      style="width: 350px; animation-duration: 500ms"
      :class="{ animated: denied, headShake: denied }"
    >
      <q-card-section class="">
        <div class="text-h3 text-bold text-center">
          fic.ai
        </div>
      </q-card-section>
      <q-separator/>
      <q-card-section>
        <q-btn-group spread unelevated>
          <q-btn :to="{ path: 'login', query: { next: $route.query.next }}" :outline="routePathLast() !== 'login'" color="primary" label="Log in"/>
          <q-btn :to="{ path: 'register', query: { next: $route.query.next } }" :outline="routePathLast() !== 'register'" color="primary" label="Register"/>
        </q-btn-group>
        <q-btn fab outline color="primary" label="OR" class="absolute-center dark-button">
          <q-tooltip>Forgot password?</q-tooltip>
        </q-btn>
      </q-card-section>

<!--      <router-view @denied="onDenied"></router-view>-->
      <router-view @denied="onDenied" v-slot="{ Component }">
        <transition
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
          :duration="200"
        >
          <component :is="Component" />
        </transition>
      </router-view>

    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const denied = ref(false);
const route = useRoute();

function onDenied() {
  denied.value = true;
  setTimeout(() => {
    denied.value = false;
  }, 500)
}

function routePathLast() {
  const routeElements = route.matched[route.matched.length-1].path.split('/');
  return routeElements[routeElements.length-1]
}

</script>

<style scoped>
.dark-button {
  background: #fff !important;
}

.body--dark .dark-button{
  background: var(--q-dark) !important;
}

</style>
