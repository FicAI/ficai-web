import { defineStore } from 'pinia';
import { User } from 'components/models';
import { signals_api } from 'boot/axios';
import { Notify } from 'quasar';

const LOGIN_ROUTE = '/sessions';
const REGISTER_ROUTE = '/accounts';

export const useAuthStore = defineStore('auth', {
  state: () => ( {
      email: null
    } as User
  ),
  persist: {
    storage: window.localStorage,
  },
  // todo login check on init

  getters : {
    isLoggedIn(state) {
      return !!state.email
    }
  },

  actions: {
    setUser(email: string) {
      this.email = email;
    },

    clearUser() {
      this.email = null;
    },

    // APi actions:

    login(email: string, password: string): Promise<void> {
      return new Promise((resolve, reject) => {
        return signals_api
          .post(
            LOGIN_ROUTE,
            JSON.stringify({email: email, password: password}),
            {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://127.0.0.1:8000/', // todo only for local debug
              },
            })
          .then(response => {
            // todo do something with response body when implemented
            this.setUser(email);
            Notify.create({
              color: 'positive',
              position: 'top',
              message: `Logged in! Welcome, ${email}`,
              icon: 'done',
            });
            resolve()
          })
          .catch(error => {
            this.clearUser(); // just to be sure
            Notify.create({
              color: 'negative',
              position: 'top',
              message: `Login failed: ${error.message}`,
              icon: 'report_problem',
            });
            reject(error);
          })
      })
    },

    register(email: string, password: string, beta_key: string): Promise<void> {
      return new Promise((resolve, reject) => {
        return signals_api
          .post(
            REGISTER_ROUTE,
            JSON.stringify({email: email, password: password, betaKey: beta_key}),
            {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://127.0.0.1:8000/', // todo only for local debug
              },
            })
          .then(response => {
            // todo do something with response body when implemented
            this.setUser(email);
            Notify.create({
              color: 'positive',
              position: 'top',
              message: `Successfully registered! Welcome, ${email}`,
              icon: 'done',
            });
            resolve()
          })
          .catch(error => {
            this.clearUser(); // just to be sure
            Notify.create({
              color: 'negative',
              position: 'top',
              message: `Registration failed: ${error.message}`,
              icon: 'report_problem',
            });
            reject(error);
          })
      })
    },
  }

})
