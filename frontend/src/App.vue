<script lang="ts">
import { defineComponent } from 'vue'
import { Cookies } from 'quasar';
import { http } from './assets/http';
import { store } from './store/store';
import Main from './views/Main.vue';
import Loading from './components/Loading.vue';
import TimeagoVue from './components/Timeago.vue';
import MentionLink from './components/MentionLink.vue';


export default defineComponent({
  data() {
    return {
      dark_mode: this.$store.state.dark,
      include: ['home', 'explore'],
      class: 'app',
      loading: true,
    }
  },
  async beforeCreate() {
    try {
      const response = await http.get("users/user_from_cookie/")

      if(response.data.success) {
        await store.commit("setUser", response.data.user);
        await store.commit("authenticate", true);
      }
    } catch (error) {

    } finally {
      store.commit('setLoading', false)
    }
  },
  setup() {
  },
  methods: {
    switchTheme(e: any) {
      if(this.dark_mode) {
        Cookies.set('theme', 'dark')
        document.documentElement.setAttribute('data-theme', 'dark')
      }
      else {
        Cookies.set('theme', 'light')
        document.documentElement.setAttribute('data-theme', 'light')
      }
      this.$store.commit('setTheme', !this.$store.state.dark)
    },
    checkOS() {
      const regex = /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i
      const width = window.innerWidth <= 597
      if(regex.test(navigator.userAgent) && width) {
        this.$store.commit('setDesktop', false)
      }
      else {
        this.$store.commit('setDesktop', true)
      }
    },
   
  },
  created() {
    if(Cookies.get('theme')) { 
      this.dark_mode = Cookies.get('theme') === 'dark'
      this.$store.commit('setTheme', this.dark_mode)
    }
    else {
      this.dark_mode = this.$store.state.dark
    }
    document.documentElement.setAttribute('data-theme', this.dark_mode ? 'dark': 'light')
  },
  mounted() {
    window.onresize = this.checkOS
  },
  components: { Main, Loading, TimeagoVue, MentionLink },
  watch: {
    '$store.state.authenticated': function() {
      if(this.$store.state.authenticated && (this.$route.meta.hideForAuth && this.$route.meta.hideForAuth != undefined) ) {
        this.$router.push(this.$route.redirectedFrom?.fullPath || '/home')
      }
      // else if(!this.$store.state.authenticated){
      //   this.$router.go(0)
      // }
    },
    '$route': {
        immediate: true,
        handler(to, from) {
          document.title = to.meta.title || 'Socialite';
        }
    },
  }
})

</script>

<template>
  <div class="text-left w-full min-h-viewport" v-if="!$store.state.isLoading && $store.state.authenticated">
    <Main />
  </div>
  <div :class="{'flex': !$q.screen.lt.sm || !$q.screen.lt.md, 'flex-col': !$q.screen.lt.sm}" class="h-viewport min-w-viewport fixed justify-center items-center overflow-scroll" v-if="!$store.state.isLoading && !$store.state.authenticated">
    <div class="w-half h-full min-h-viewport flex items-center justify-end" v-if="!$q.screen.lt.sm || !$q.screen.lt.md">
      <i-spill size="35rem" :fill="$store.state.dark ? 'var(--color-theme-soft)' : 'var(--color-theme-opacity)'" stroke="none"/>
    </div>
    <div :class="{'w-half': !$q.screen.lt.sm}"  class="flex items-center justify-center overflow-scroll">
      <logo-loading />
      <div :class="{'box-shadow': !$q.screen.lt.sm, 'm-2 px-10': !$q.screen.lt.sm}" class="rounded-sm max-w-md w-full text-left ">
        <router-view />
      </div>
    </div>
  </div>
  <div class="flex items-center justify-center w-full h-viewport text-heading" v-if="$store.state.isLoading">
    <!-- <Loading size="5rem">
      <template v-slot:text>
        <p class="text-5xl">Loading</p>
      </template>
    </Loading> -->
    <logo-loading />
  </div>
  <notifications :max="2" group="auth" classes="bg-theme box-shadow rounded-sm m-2 border p-2"/>
  <notifications :max="2" group="error" class="w-full max-w-xs">
    <template #body="props">
      <div @click="props.close" class="my-notification bg-red-3 text-green box-shadow rounded-sm m-2 mr-2 border text-left">
        <Item :titleLineClamp="2" :captionLineClamp="10">
          <template #avatar>
            <q-icon color="red-9" size="30px" name="error" />
          </template>
          <template #title>
            <span class="text-base text-red-9 weight-900">
              {{ props.item.title }}
            </span>
          </template>
          <template #caption>
            <span class="text-sm text-red-8 weight-700">
              {{ props.item.text }}
            </span>
          </template>
        </Item>
      </div>
    </template>
  </notifications>
  <notifications :max="2" group="success" class=" w-full max-w-xs z-1000"> 
    <template #body="props">
      <div @click="props.close" class="my-notification bg-green-3 text-green box-shadow rounded-sm m-2 border text-left w-fit">
        <Item :captionLineClamp="10">
          <template #avatar>
            <q-icon color="green-9" size="30px" name="info" />
          </template>
          <template #title>
            <span class="text-base text-green-9 weight-900">
              {{ props.item.title }}
            </span>
          </template>
          <template #caption>
            <span class="text-sm text-green-8 weight-700">
              {{ props.item.text }}
            </span>
          </template>
        </Item>
      </div>
    </template>
  </notifications>
  <notifications :max="1" group="notify" class=" w-full  z-100" :class="{'max-w-xs': !$q.screen.lt.sm}" :position="$q.screen.lt.sm ? 'bottom' : 'bottom center'">
    <template #body="props">
      <div @click="props.close" class="my-notification bg-theme box-shadow rounded-sm m-2 text-left">
        <Item clickable :to="`/${props.item.data.notification.data.url}`" >
          <template #avatar>
              <img v-if="props.item.data.notification.actor.avatar" :src="props.item.data.notification.actor.avatar" alt="profile pic" />
              <img v-else src="https://avatarairlines.com/wp-content/uploads/2020/05/Male-placeholder.jpeg" alt="profile pic plage holder" class="rounded-full" />
          </template>
          <template #title>
                <Item dense align-items="start">
                    <template #title>
                        <div class="h-full min-w-full flex gap-1 items-center title">
                            <div class="ellipsis" >
                                  <span class="ellipsis text-lg text-heading weight-900" > 
                                      {{ props.item.data.notification.actor.full_name}}
                                  </span>
                            </div>

                            <span class="text-lighter weight-900">&#183;</span>

                            <div>
                                <div class="ellipsis">
                                  <span class="text-lg text-lighter weight-500">@{{ props.item.data.notification.actor.username }}</span>
                                </div>
                            </div>

                            <span class="text-lighter weight-900">&#183;</span>

                            <div class="ellipsis ">
                                <TimeagoVue class="text-lg text-lighter weight-500" :date="props.item.data.notification.timestamp" date_type="short" />
                            </div>
                            
                        </div>

                    </template>
                </Item>

            </template>
          <template #subtitle>
              <span class="text-sm text-heading weight-700">
                  {{ props.item.data.notification.description}}
              </span>
          </template>
          <template #caption>
            <MentionLink :mention="props.item.data.notification.data.text" />
          </template>
        </Item>
      </div>
      <!-- <div class="bg-theme text-heading">
        {{ props.item.data.notification.actor.first_name }}
      </div> -->
    
    </template>
  </notifications>
</template>

<style lang="scss">
@import '@/assets/css/base.css';
@import '@/assets/css/global.css';
@import '@/assets/css/global.scss';

// .no-auth {
//   display: grid;
//   grid-template-columns: 1fr 1fr;
// }


</style>
