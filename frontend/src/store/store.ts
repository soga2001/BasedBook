
// Store reference: https://vuex.vuejs.org/
import type { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import type { Post, User, Notifications } from '@/assets/interfaces'

// define your typings for the store state
export interface State {
  authenticated: boolean,
  user: User,
  dark: boolean,
  desktop: boolean,
  csrf: string,
  isLoading: boolean,
  allNotifications: Array<Notifications>,
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    authenticated: true,
    dark: true,
    user: {} as User,
    desktop: true,
    csrf: "",
    isLoading: true,
    allNotifications: Array<Notifications>(),

  },
  mutations: {
    authenticate(state, payload) {
      state.authenticated = payload
    },
    setUser(state, payload) {
      state.user = payload
    },
    setDefaultUser(state) {
      state.user = {} as User
    },
    setTheme(state, payload) {
      state.dark = payload
    },
    setDesktop(state, payload) {
      state.desktop = payload
    },
    setCSRF(state, payload) {
      state.csrf = payload
    },
    changeAvatar(state, payload) {
      state.user.avatar = payload
    },
    changeBanner(state, payload) {
      state.user.banner = payload
    },
    setLoading(state, payload) {
      setTimeout(() => {
        state.isLoading = payload
      }, 100)
    },
    setAllNotifications(state, payload) {
      state.allNotifications = [...state.allNotifications, payload]
    },
    resetNotifications(state) {
      state.allNotifications = new Array<Notifications>()
    }
  }
})

export function useStore() {
    return baseUseStore(key)
}