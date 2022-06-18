import { defineStore } from 'pinia';
import { Notify } from 'quasar';

import { User } from 'components/models';
import { signals_api } from 'boot/axios';

const LOGIN_ROUTE = '/sessions';
const REGISTER_ROUTE = '/accounts';
// const LOGOUT_ROUTE = '/'

export const useAuthStore = defineStore('auth', {
  state: () =>
    ({
      email: null,
      confirmed: false,
    } as User),
  persist: {
    storage: window.localStorage,
    paths: ['email'],
  },

  getters: {
    isLoggedInUnconfirmed(state) {
      return !state.confirmed && !!state.email;
    },
    isLoggedIn(state) {
      return state.confirmed && !!state.email;
    },
  },

  actions: {
    setUser(email: string) {
      this.confirmed = true;
      this.email = email;
    },

    async checkAuth(): Promise<boolean> {
      if (this.isLoggedInUnconfirmed) {
        if (await this.check()) {
          this.confirmed = true;
        } else {
          this.$reset();
        }
      }
      return this.isLoggedIn;
    },

    // clearUser() {
    //   this.email = null;
    // },

    // APi actions:

    login(email: string, password: string): Promise<void> {
      return new Promise((resolve, reject) => {
        return signals_api
          .post(
            LOGIN_ROUTE,
            JSON.stringify({ email: email, password: password }),
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          .then(response => {
            // todo do something with response body when implemented
            this.setUser(email);
            Notify.create({
              color: 'positive',
              position: 'top',
              message: `Logged in! Welcome, ${email}`,
              icon: 'done',
            });
            resolve();
          })
          .catch(error => {
            this.$reset(); // just to be sure
            Notify.create({
              color: 'negative',
              position: 'top',
              message: `Login failed: ${error.message}`,
              icon: 'report_problem',
            });
            reject(error);
          });
      });
    },

    register(email: string, password: string, beta_key: string): Promise<void> {
      return new Promise((resolve, reject) => {
        return signals_api
          .post(
            REGISTER_ROUTE,
            JSON.stringify({
              email: email,
              password: password,
              betaKey: beta_key,
            }),
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          .then(response => {
            // todo do something with response body when implemented
            this.setUser(email);
            Notify.create({
              color: 'positive',
              position: 'top',
              message: `Successfully registered! Welcome, ${email}`,
              icon: 'done',
            });
            resolve();
          })
          .catch(error => {
            this.$reset(); // just to be sure
            Notify.create({
              color: 'negative',
              position: 'top',
              message: `Registration failed: ${error.message}`,
              icon: 'report_problem',
            });
            reject(error);
          });
      });
    },

    check(): Promise<boolean> {
      return new Promise((resolve, reject) => {
        // todo make and use designated route for login check
        return signals_api
          .get('/signals', { params: { url: '' } })
          .then(() => {
            resolve(true);
          })
          .catch(error => {
            Notify.create({
              color: 'negative',
              position: 'top',
              message: `Login confirmation failed: ${error.message}`,
              icon: 'report_problem',
            });
            resolve(false);
          });
      });
    },

    // logout(): Promise<void> {
    //   return new Promise((resolve, reject) => {
    //     // todo logout request to the server
    //     // Cookies.remove(COOKIE_NAME, COOKIE_OPTIONS);
    //     this.$reset()
    //     resolve();
    //   })
    // }
  },
});
