<script lang="ts">
import {defineComponent} from 'vue';
import { useQuasar } from 'quasar';
import Sidebar from '@/components/Navbars/sidebar.vue';
import TopNav from '@/components/Navbars/topnav.vue';
import BottomNav from '@/components/Navbars/bottomnav.vue';
import Unauthenticated from '@/components/unauthenticated.vue';


import type { Notifications } from '@/assets/interfaces';
import notification from '@/components/Cards/notification.vue';

import Search from '@/views/Search.vue';

export default defineComponent({
  title: 'Main',
  data() {
      return {
        $q: useQuasar(),
        scrollY: 0,
        topNavHeight: (this.$refs.topNav as HTMLDivElement)?.offsetHeight,
        bottomNavHeight: (this.$refs.bottomBar as HTMLDivElement)?.offsetHeight,
        scrollPos: new Map(),
        scrollHeight: new Map(),
        scrollPosition: 0,
        height: 0,
        mobile: false,
        spill: false,
        hideNav: false,
        pages: ['user-profile', 'view-spill'],
        lastScrollPos: 0,
        hideTopNav: false,

        websocket: null as WebSocket | null,

        newNotification: false,
        notification: {} as Notifications,
        settingsPage: false,
        arr: ['settings'],
        settingsNested: ['account'],
        settingLink: '',
        



      };
  },
  name: 'Main',ted() {
    if(this.arr.includes((this.$route.name ?? '') as string) || this.arr.includes((this.$route.matched[0]?.name ?? '') as string)) {
      this.settingsPage = true
    }
    else {
      this.settingsPage = false
    }
    this.$store.commit('setDesktop', !this.$q.screen.lt.sm)

  },
  mounted() {
    if(this.$refs.bottomBar) {
      this.bottomNavHeight = ((this.$refs.bottomBar as HTMLDivElement)?.offsetHeight + 10) || 0

    }
    // if(this.$store.state.authenticated) this.websocketOpen()
    this.websocketOpen()
  },
  activated() {
  },
  computed: {
    hideNavBar() {
      const component = (this.$route.matched[0]?.name ?? this.$route.name) as string || '';
      if(this.pages.includes(component as string)) {
        return true
      }
      return false
    },
  },
  methods: {
    scrolling() {
      const element = this.$refs.mainDiv as HTMLDivElement;
      if(this.lastScrollPos < element.scrollTop ) {
        this.hideTopNav = true
      } else {
        this.hideTopNav = false
      }

      this.lastScrollPos = element.scrollTop
      this.scrollPos.set(this.$route.name, element.scrollTop);
      this.scrollPosition = element.scrollTop
      this.scrollHeight.set(this.$route.name, element.scrollHeight - element.clientHeight)
      this.height = element.scrollHeight - element.clientHeight
      
    },
    isMobile() {
      this.mobile = this.$q.screen.lt.sm
      return this.$q.screen.lt.sm
    },
    async websocketOpen() {
      this.websocket = new WebSocket(`wss://api.suyogyapoudel.com/ws/user_notif/`)
      this.websocket.onopen = () => {
        console.log('connected')
      }
      this.websocketMessage()

    },
    async websocketClose() {
      if(!this.websocket) {
        return
      }
      this.websocket.close()
    },
    async websocketMessage() {
      if(!this.websocket) {
        return
      }
      this.websocket.onmessage = (e) => {
        const data = JSON.parse(e.data)
        console.log(data)
        if(data.type === 'posted') {
          const message = JSON.parse(data.message) as Notifications

          this.$store.commit('setAllNotifications', message)

          this.$notify({
            group: 'notify',
            duration: 5000,
            data: {
              notification: message,
            },
            closeOnClick: true,
          });
          
        }
        else if(data.type === 'message') {
          this.$store.commit('setMessages', data.message)
        }
      }
    },
    alert() {
      console.log('here')
    }
  },
  components: { Sidebar, TopNav, BottomNav, Unauthenticated, notification, Search },
  watch: {
    '$store.state.authenticated': function () {
      if(this.$store.state.authenticated) {
        this.websocketOpen()
      } else {
        this.websocketClose();
      }
    },
    $route: {
      immediate: true,
      handler(newRoute) {
        if(this.arr.includes((this.$route.name ?? '') as string) || this.arr.includes((this.$route.matched[0]?.name ?? '') as string)) {
          this.settingsPage = true
        }
        else {
          this.settingsPage = false
        }
        this.$nextTick(() => {
          this.hideTopNav = false;
          if(this.settingsPage) {
            this.hideTopNav = true;
          }
          const element = this.$refs.mainDiv as HTMLDivElement;
          element.scrollTop = this.scrollPos.get(this.$route.name);
          this.scrollPosition = this.scrollPos.get(this.$route.name);
          this.height = this.scrollHeight.get(this.$route.name)
          this.bottomNavHeight = ((this.$refs.bottomBar as HTMLDivElement)?.offsetHeight + 10) || 10

        });
      }
    },
    '$q.screen.lt.sm'() {
      if(this.$route.matched[0].name === 'settings' && this.settingsNested.includes(this.$route.name as string ?? '') && this.$q.screen.lt.sm) {
        this.$router.replace({name: this.$route.name as string})
        this.hideTopNav = true
      }
      else if(this.$route.matched[0].name === 'settings' && !this.settingsNested.includes(this.$route.name as string ?? '') && !this.$q.screen.lt.sm) {
        if(this.$route.name !== 'settings' && this.$route.matched[0].name === 'settings') {
          this.$router.replace({name: this.$route.name as string})
        }
        else {
          this.$router.replace({name: 'account'})
        }
        this.hideTopNav = true
      }
      this.$nextTick(() => {
        this.bottomNavHeight = ((this.$refs.bottomBar as HTMLDivElement)?.offsetHeight + 10) || 10
        this.$store.commit('setDesktop', !this.$q.screen.lt.sm)
        
      })
    },
    lastScrollPos() {
      const topNav = (this.$refs.topNav as HTMLDivElement)
      const bottomNav = (this.$refs.bottomBar as HTMLDivElement)
      const spillBtn = (this.$refs.spillButton as HTMLDivElement)
      const topNavPos = ((this.topNavHeight < this.lastScrollPos) && `${-this.topNavHeight}`)
      const bottomNavPos = ((this.bottomNavHeight < this.lastScrollPos) && `${-this.bottomNavHeight + 10}`)


      if(topNav) {
        if(this.hideTopNav) {
          topNav.style.transform = `translate3d(0px, 0px, 0px) translateY(${topNavPos}px)`; 
        } 
        else {
          topNav.removeAttribute('style')
        }
      }

      if(bottomNav) {
        if(this.hideTopNav) {
          bottomNav.style.transform = `translate3d(0px, 0px, 0px) translateY(${-bottomNavPos}px)`;
          spillBtn.style.transform = `translate3d(0px, 0px, 0px) translateY(${-bottomNavPos}px)`;
        } 
        else {
          bottomNav.removeAttribute('style')
          spillBtn.style.removeProperty('transform')
        }
      }
    },
  },
  component: {Search}
})
</script>

<template>
  <!-- :class="!isMobile() ? 'main' : 'fixed w-full h-viewport overflow-y-scroll'" -->
  <div @scroll="scrolling" ref="mainDiv" :class="{'main': !isMobile(), 'fixed w-full h-viewport overflow-y-scroll': isMobile(), 'settings_page': settingsPage}">
    <div v-if="!$q.screen.lt.sm" class="min-h-viewport sticky top-0 h-full w-full">
      <Sidebar/>
    </div>

    <div id="main-div" class="w-full min-h-viewport h-full">
      <div>
        <div ref="topNav" v-if="!hideNavBar" id="top-nav" :class="{'border-b': ($route.matched[0]?.name as string || '') != 'notification'}" class="sticky top-0 w-full h-fit bg-transparent bg-blur-1 z-20 border-r border-l topnav">
          <TopNav  @update:navHeight="topNavHeight = $event"/>
        </div>
        <div :style="{paddingBottom: `${bottomNavHeight - 10}px`, minHeight: `calc(100vh - ${(($refs.topNav as HTMLElement)?.offsetHeight) ?? 0}px)`}"  class="w-full h-full border-l border-r">
          <RouterView v-slot="{Component}" >
            <KeepAlive :max="4" :include="['home', 'search', 'explore', 'user-profile', 'view-spill', 'notifications', 'settings', 'account']" >
              <component :is="Component" :key="!['user-profile', 'notifications'].includes(($route.matched[0]?.name) as string) ? $route.fullPath : null"  :height="height" :scrollPosition="scrollPosition" />
            </KeepAlive>
          </RouterView>
        </div>
      </div>
    </div>

    <aside class="sticky top-0" v-if="!$q.screen.lt.sm"> 
      <div class="mx-5 py-2 sticky top-0" v-if="!settingsPage && !$q.screen.lt.md">
          <SearchBar dense />
      </div>
    </aside>

    <nav v-if="$q.screen.lt.sm && !hideNavBar" ref="bottomBar" class="fixed bottom-0 w-full border-t z-5">
      <BottomNav/>
    </nav>

    <div ref="spillButton" class="fixed z-20 box-shadow right-1 bg-theme rounded-lg" :style="{bottom: `${bottomNavHeight}px`}" v-if="isMobile() && $store.state.authenticated && $route.name !== 'view-spill'">
      <q-btn size="16px" class="show btn-themed text-heading" round flat @click="spill = true">
        <q-icon name="add" :color="$store.state.dark ? 'white' : 'black'"/>
      </q-btn>
    </div>
    <q-dialog class="min-h-sm bg-blur-half w-full h-full" v-model="spill" position="top" persistent :maximized="true">
      <div class="mt-12 bg-theme box-shadow w-full h-full min-h-fit max-w-sm overflow-visible rounded-sm" >
        <div class="p-2">
          <Item dense :vert-icon-center="true">
            <template #title>
              <div class="text-2xl weight-900">Spill</div>
            </template>
            <template #icon>
              <i-close size="2rem" class="pointer" @click="spill = false"/>
            </template>
          </Item>
        </div>
        <hr class="border"/>
        <div class="">
          <Spills :rows="4"/>
        </div>
      </div>
    </q-dialog>
      
      
  </div>

  
</template>

<style scoped lang="scss">

* {
  padding: 0;
  margin: 0;
  transition: transform .1s ease-in-out;
}


.main {
  display: grid;
  width: 100%;
  position: fixed;
  height: 100%;
  grid-template-columns: auto 600px minmax(auto, 400px);
  overflow: scroll;
  overflow-y: scroll;

  &.settings_page {
    grid-template-columns: minmax(auto, 375px) auto 100px;
  }
}


.mobile-main {
  overflow: hidden;
  overflow-y: scroll;
  height: 100%;
}

#main-div {
  height: 100%;
  width: 100%;
}

.transform {
  transform: translateY(0);
}


/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {

  .right-bar {
    display: none;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .main {
    grid-template-columns: auto 1fr 0px;

    &.settings_page {
      grid-template-columns: auto 1fr 0px;
    }
  }

  .right-bar {
    display: none;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 650px) {
  .main {
    grid-template-columns: auto 600px minmax(auto, 200px);

    &.settings_page {
      grid-template-columns: auto 1fr 0px;
    }
  }

} 

@media only screen and (min-width: 800px) {
  .main {
    grid-template-columns: auto 600px minmax(auto, 375px);

    &.settings_page {
      grid-template-columns: auto 1fr 50px;
    }
  }

  


  .right-bar {
    display: block;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1000px) {
  .main {
    grid-template-columns: auto 600px minmax(auto, 375px);

    &.settings_page {
      grid-template-columns: auto 1fr 50px;
    }
  }

  .right-bar {
    display: block;
  }
}


@media only screen and (min-width: 1100px) {
  .main {
    grid-template-columns: minmax(auto, 375px) 600px minmax(auto, 375px);

    &.settings_page {
      grid-template-columns: minmax(auto, 375px) minmax(600px, 1000px) minmax(auto, 100px);
    }
  }

  .right-bar {
    display: block;
  }
}

</style>