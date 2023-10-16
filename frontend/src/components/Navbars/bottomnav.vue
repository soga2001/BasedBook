<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router';

export default defineComponent({
  data() {
      return {
          theme: false,
          dark_mode: false,
          include: ["home", "explore"],
          iconSize: "5rem",
          navSlideIn: false
      };
  },
  computed: {
    navStyle(): {justifyContent: string} {
      return {
        justifyContent: this.$store.state.authenticated ? "right" : "center"
      }
    },
    

  },
  methods: {
  },
  created() {
  },
  mounted() {
  },
  watch: {
  },
  components: {}
})
</script>

<template>
    <nav>
        <div class="bottomNav bg-theme-opacity bg-blur-1">
        <q-tabs
          no-caps
          class="bg-transparent w-full"
          active-class="bg-transparent"
          :breakpoint="0"
          switch-indicator
        >
          <q-route-tab  v-if="$store.state.authenticated" to="/home" exact replace>
            <i-home size="2rem" :fill="$route.fullPath == `/home` ? 'var(--color-heading)' : 'none'" :stroke="'var(--color-heading)'"/>
          </q-route-tab>
          <q-route-tab to="/explore" exact replace>
            <i-explore size="2rem" :fill="$route.fullPath == `/explore` ? 'var(--color-heading)' : 'none'" :stroke="$route.fullPath == `/explore` ? 'none' : 'var(--color-heading)'"/>
          </q-route-tab>
          <q-route-tab v-if="$store.state.authenticated" class="relative" active-class="text-heading" to="/notifications" replace>
            <i-notif size="2rem" :fill="$route.matched[0].name == `notifications` ? 'var(--color-heading)' : 'none'" stroke="var(--color-heading)" />
            <q-avatar class="relative p-0 m-0">
              <i-notif size="2rem" :fill="$route.matched[0]?.name == `notifications` ? 'var(--color-heading)' : 'none'" :stroke="'var(--color-heading)'" />
              <q-badge v-if="$store.state.allNotifications.length > 0" class="bg-web-theme" rounded floating />
            </q-avatar>
          </q-route-tab>
          <q-route-tab v-if="$store.state.authenticated" to="/settings" exact replace>
            <i-settings size="2rem" :fill="$route.fullPath == `/settings` ? 'var(--color-heading)' : 'none'" :stroke="$route.fullPath == `/settings` ? 'none' : 'var(--color-heading)'" />
          </q-route-tab> 
          <q-route-tab v-if="!$store.state.authenticated" to="/login" exact replace>
            <i-login size="2rem" :fill="$route.fullPath == `/login` ? 'var(--color-heading)' : 'none'" :stroke="$route.fullPath == `/login` ? 'none' : 'var(--color-heading)'" />
          </q-route-tab> 
        </q-tabs>
      </div>
    </nav>
</template>

<style scoped>

.nav {
  height: 100%;
  display: flex;
  width: 100%;  
  justify-content: center;
  padding: 0 16px;
  background-color: transparent;
  position: relative;
  
}


.bottomNav {
  width: 100%;
  /* background-color: var(--color-background); */
  z-index: 0;
  display: inline-flex;
}

.mobile-nav {
  padding: 0;
}

.item {
  height: fit-content;
}
.item img {
  width: 3rem;
}

.slide-in-nav {
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: var(--color-background);
  border-right: 3px solid var(--color-border);
  overflow-x: hidden;
  transition: 0.5s;
  /* padding-top: .1rem; */

  display: grid;
}

.slide-in-nav a {
  padding: 0 10px 0 10px;
  text-decoration: none;
  font-size: 25px;
  /* color: #818181; */
  color: var(--color-heading);
  display: block;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-hover); /* Set the opacity value for the background */
  z-index: 999; /* Set the z-index to a value higher than the slide-in menu */
}

.slide-in-nav a:hover {
  color: #f1f1f1;
}

.logout {
  padding: 0 28px;
  font-size: 25px;
  color: var(--color-heading);
}

.follow {
  display: flex;
}



/* .slide-in-nav .closebtn {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 36px;
  margin-left: 50px;
} */


.nav .brand {
  width: fit-content;
  font-size: 25px;
  font-weight: 300;
  width: 100%;
  color: var(--color-heading);
  margin-top: 0 !important;
}

.nav .brand:hover {
  background-color: transparent !important;
}

.nav .logo {
  font-weight: 900;
  color: var(--color-heading);
}

.list {
  display: grid;
  grid-template-rows: 1fr auto;
}

.rest__nav {
  margin-bottom: 1rem;
}

a {
  text-decoration: none;
  transition: 0.2s;
  width: 100%;
  font-size: calc(.8em + 1vw);;
}

.nav__link {
  color: var(--color-text);
  font-weight: 300;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
}


.active {
  color: var(--color-heading) !important;
  font-weight: 900;
  /* background-color: var(--color-background-mute); */
  border-radius: 30px;
}

.active .bold {
  font-weight: 900;
}

.exact-active {
  color: var(--color-heading) !important;
  /* background-color: var(--color-background-mute); */
  border-radius: 30px;
}


.nav__link.active .icon {
  /* color: var(--color-heading); */
  -webkit-text-stroke: 1px var(--color-text);
}
.nav__link.active .icon.search {
  -webkit-text-stroke: 2px var(--color-text);
}

.nav__link:hover {
  background-color: var(--color-background-mute);
  color: var(--color-heading);
  font-weight: 900;
  border-radius: 30px;
}


/* .nav__link:hover .bold {
  font-weight: 900;
} */

.dropdown-btn {
  width: 100%;
  /* border-radius: 30px; */
  display: flex;
  justify-content: center;
}

.top-nav .dropdown {
  position: relative;
  display: inline-block;
}

.dropdown__main {
  background-color: var(--color-background-mute);
  color: var(--text-heading);
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.username {
  color: var(--color-text);
}



/* nav icons */

.show {
  display: none;
}

@media (min-width: 993px) {

}

@media (max-width: 992px) {
  .show {
    display:flex;
  }

  .nav {
    justify-content: center;
    
  }

  .item {
    min-width: 0;
  }

  .hide {
    display: none;
  }

  .nav__link:hover {
    background-color: transparent !important;
  }

  .nav__link {
    width: 100%;
    display: flex;
    border-radius: 50%;
    /* padding: 10px; */
  }
}


 
</style>