import { defineStore } from 'pinia';
import { Dark } from 'quasar';
import { Preferences } from 'components/models';

export const useUserPreferencesStore = defineStore('preferences', {
  state: () =>
    ({
      darkMode: null,
    } as Preferences),

  persist: {
    storage: window.localStorage,
    afterRestore: context => {
      context.store._applyDarkMode();
    },
  },

  getters: {},

  actions: {
    toggleDarkMode() {
      this.setDarkMode(!this.darkMode);
    },
    setDarkMode(value: boolean) {
      this.darkMode = value;
      this._applyDarkMode();
    },
    _applyDarkMode() {
      Dark.set(this.darkMode !== null ? this.darkMode : 'auto');
    },
  },
});
