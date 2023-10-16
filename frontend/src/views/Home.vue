<script lang="ts">
import {defineComponent, ref} from 'vue';
import  type {Post} from '@/assets/interfaces';
import { http } from '@/assets/http';
import PostsMap from '../components/PostsMap.vue';
import Spills from '../components/Spills.vue';
import Search from './Search.vue';

export default defineComponent({
  title: 'Home',
  data() {
      return {
        posts: new Array<Post>(),
        input: ref(''),
        user_timestap: new Date().toISOString(),
        page: ref(0),
        hasMore: false,
        loading: true,
      };
  },
  name: 'home',
  props: {
    scrollPosition: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    }
  },
  created() {
    this.getData();
  },
  mounted() {
    this.update()
  },
  methods: {
    async getData() {
      this.loading = true
      await http.get(`posts/posts_by_followed_users/${this.user_timestap}/${this.page}/`).then((res) => {
        if(res.data.posts){
          if(res.data.posts.length === 10) {
            this.hasMore = true
          }
          else {
            this.hasMore = false
          }
          this.posts = [...this.posts, ...res.data.posts]
        }
      }).catch((err) => {
          console.log(err);
      });
      this.loading = false
    },
    async search() {
      this.input = ""
    },
    onLoad(index: any, done: any) {
      if(this.hasMore) {
        this.page = this.page + 1
        this.getData()
      }
      done()
    },
    update() {
      this.$router.push(this.$router.currentRoute.value)
    }
  },
  watch: {
    '$store.state.authenticated': async function() {
      await this.$nextTick();
      
      if(this.$store.state.authenticated) {
        this.update()
      }
      
    },
    scrollPosition(scrollPosition) {
      const div = (document.getElementById("infinite-scroll") as HTMLDivElement)
      if(this.scrollPosition >= this.height - 1000 && this.hasMore) {
        this.page += 1
        this.getData()
      }
    }
  },
  components: { PostsMap, Spills, Search },
})
</script>

<template>
  <div class="home" id="home">
    <div class="home__center">
      <div class="">
        <div class="border-b" v-if="$store.state.authenticated && !$q.screen.lt.sm">
          <Spills :rows="1" />
        </div>
        <!-- <q-infinite-scroll class="grid" id="infinite-scroll" @load="onLoad" :debounce="2" :offset="10" :disable="!hasMore"> -->
          <!-- <div class="post_map" v-if="posts.length > 0" v-for="(post, index) in posts" :id="post.id.toString" :key="post.id">
            <PostsMap :post="post" />
          </div> -->
        <!-- </q-infinite-scroll> -->
        <div>
          <div class="post_map" v-if="posts.length > 0" v-for="(post, index) in posts" :id="post.id" :key="post.id">
            <PostsMap :post="post" />
          </div>
          <div class="w-full flex justify-center p-5" v-if="loading">
            <Loading />
          </div>
        </div>
        <div class="w-full flex flex-center flex-col" v-if="posts.length == 0 && !loading">
            <div>
                <i-folder :fill="'black'" stroke="black"/>
            </div>
            <div class="text-xl weight-900 text-center">
                Follow users to see their posts here.
            </div>
        </div>
        <div class="w-full flex flex-center flex-col p-2" v-if="!loading && !hasMore && posts.length !== 0">
            <div class="text-xl weight-900 text-center">
              Follow more users to view their spills here; you've already seen all updates from those you currently follow.
            </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<style scoped lang="scss">

header {
  display: relative;
  position: -webkit-sticky;
	position: sticky;
  
  width: 100%;
	top: 0px;
  z-index: 10;
  padding: 0 10px;

  font-size: 25px;
  font-weight: 900;
  color: var(--color-heading);

  text-shadow: -1px 1px 0 var(--color-background),
                          1px 1px 0 var(--color-background),
                         1px -1px 0 var(--color-background),
                        -1px -1px 0 var(--color-background);
}


.home {
  width: 100%;
}

.post_map {
  border-bottom: 1px solid var(--color-border);
}

.post_map:not(:first-child) {
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

/* .posts:not(:first-child) {
  margin: 20px 0;
} */
</style>

