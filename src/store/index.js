import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist';
import Crypto from 'crypto-js';
import Cookie from 'js-cookie';

const cookieName = 'state';

const storageKey = 'state';

const encryptionToken = Cookie.get(cookieName) || "dcefb8d7-17dd-45cd-8123-91e92b7fc52c";

const vuexLocal = new VuexPersistence({
    storage: {
        getItem: () => {
            const store = window.localStorage.getItem(storageKey);
            if (store) {
                try {
                    const bytes = Crypto.AES.decrypt(store, encryptionToken);
                    return JSON.parse(bytes.toString(Crypto.enc.Utf8));
                } catch (e) {
                    window.localStorage.removeItem(storageKey);
                }
            }
            return null;
        },
        setItem: (key, value) => {
            const store = Crypto.AES.encrypt(value, encryptionToken).toString();
            return window.localStorage.setItem(storageKey, store);
        },
        removeItem: () => window.localStorage.removeItem(storageKey),
    }
});

export default createStore({
  state: {
      isAuth: false,
      userData: {},
      metadata: {},
      lastRoute: null,
      filters: {
          range: null
      }
  },
  getters: {
     isAuth(state) {
        return state.isAuth
     },
     userData(state) {
          return state.userData
     },
     metadata(state) {
         return state.metadata
     },
     getFirstDate(state) {
         return state.filters.firstDate
     },
     getLastDate(state) {
          return state.filters.lastDate
     },
     getDateFilterRange(state) {
         return state.filters.range
     },
     getLastRoute(state) {
         return state.lastRoute
     }
  },
  mutations: {
      enableAuth(state) {
          state.isAuth = true
      },
      disabledAuth(state) {
          state.isAuth = false
      },
      setUserData(state, payload) {
          state.userData = payload
      },
      clearState(state) {
        state.isAuth = false
        state.userData = {}
        state.filters = {
            range: null
        }
     },
     setMetadata(state, payload) {
          state.metadata = payload
     },
     setFirstDate(state, firstDate) {
          state.filters.firstDate = firstDate
     },
     setLastDate(state, lastDate) {
          state.filters.lastDate = lastDate
     },
     setDateFilterRange(state, range) {
          state.filters.range = range
     },
     setLastRoute(state, route) {
          state.lastRoute = route
     }
  },
  plugins: [vuexLocal.plugin]
})
