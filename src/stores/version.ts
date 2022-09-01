import { defineStore } from 'pinia';
import { signals_api } from 'boot/axios';
import { Notify } from 'quasar';
import { Version } from 'components/models';

const BEX_VERSION_ROUTE = '/bex/versions/';

export const useVersionStore = defineStore('version', {
  state: () =>
    ({
      outdated: null,
      retired: null,
      lastChecked: null,
    } as Version),

  persist: {
    storage: window.localStorage,
    // afterRestore: context => {
    //   context.store._applyDarkMode();
    // },
  },

  getters: {
    isOutdated(state) {
      return state.outdated !== null && state.outdated;
    },
    isRetired(state) {
      return state.retired !== null && state.retired;
    },
  },

  actions: {
    fetch(): Promise<void> {
      return new Promise(resolve => {
        return signals_api
          .get(BEX_VERSION_ROUTE + process.env.VERSION)
          .then(response => {
            console.log(response);
            this.retired = response.data.retired;
            this.outdated = this.retired
              ? false
              : response.data.current_version != process.env.VERSION;
            this.lastChecked = Date.now();
            resolve();
          })
          .catch(error => {
            console.log(error);
            console.log(error.headers);
            Notify.create({
              color: 'negative',
              position: 'top',
              message: `Failed to fetch version info, beware: ${error.message}`,
              icon: 'report_problem',
            });
            resolve();
          });
      });
    },
    fetchCached(): Promise<void> {
      return new Promise(resolve => {
        if (
          this.lastChecked === null ||
          Date.now() - this.lastChecked > 24 * 60 * 60 * 1000
        ) {
          return this.fetch();
        }
        resolve();
      });
    },
  },
});
