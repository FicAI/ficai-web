import { defineStore } from 'pinia';
import { Dark } from 'quasar'
import { AddressbarColor } from 'quasar'


export const useUserPreferencesStore = defineStore('preferences', {
  state: () => ({
    darkMode: Dark.isActive,
  }),

  persist: {
    storage: window.localStorage,
    afterRestore: context => {
      context.store._applyDarkMode();
    },
  },

  getters: {
  },

  actions: {
    toggleDarkMode(){
      this.setDarkMode(!this.darkMode);
    },
    setDarkMode(value: boolean){
      this.darkMode = value;
      this._applyDarkMode();
    },
    _applyDarkMode(){
      Dark.set(this.darkMode);
      if (this.darkMode){
        AddressbarColor.set('#1d1d1d');
      } else {
        AddressbarColor.set('#1976d2');
      }
    }
  }
});
