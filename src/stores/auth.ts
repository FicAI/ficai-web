import { defineStore } from 'pinia';
import { Notify } from 'quasar';

import { User } from 'components/models';
import { signals_api } from 'boot/axios';

const LOGIN_ROUTE = '/sessions';
const REGISTER_ROUTE = '/accounts';

export const useAuthStore = defineStore('auth', {
  state: () =>
    ({
      id: null,
      email: null,
      confirmed: false,
    } as User),
  persist: {
    storage: window.localStorage,
    paths: ['id', 'email'],
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
    setUser(id: number, email: string) {
      this.confirmed = true;
      this.id = id;
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
            this.setUser(response.data.id, response.data.email);
            Notify.create({
              color: 'positive',
              position: 'top',
              message: `Logged in! Welcome, ${response.data.email}`,
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
            this.setUser(response.data.id, response.data.email);
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
      return new Promise(resolve => {
        return signals_api
          .get(LOGIN_ROUTE)
          .then(response => {
            this.setUser(response.data.id, response.data.email);
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

    logout(): Promise<void> {
      return new Promise((resolve, reject) => {
        return signals_api
          .delete(LOGIN_ROUTE)
          .then(() => {
            this.$reset();
            // this.router.push('/');
            resolve();
          })
          .catch(error => {
            Notify.create({
              color: 'negative',
              position: 'top',
              message: `Logout failed: ${error.message}`,
              icon: 'report_problem',
            });
            reject(error);
          });
      });
    },
  },
});
