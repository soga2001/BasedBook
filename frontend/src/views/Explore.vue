<script lang="ts">
import {defineComponent, ref} from 'vue';
import  type {Post} from '@/assets/interfaces';
import { http } from '@/assets/http';
import PostsMap from '../components/PostsMap.vue';
import Search from './Search.vue';
import Navbar from '../components/Navbar.vue';

export default defineComponent({
  data() {
      return {
        posts: new Array<Post>(),
        input: ref(''),
        user_timestap: new Date().toISOString(),
        page: ref(0),
        hasMore: false,
        message: '',
        searchModal: false,
        loading: true,
      };
  },
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
  name: 'explore',
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true
      await http.get(`posts/explore/${this.user_timestap}/${this.page}/`).then((res) => {
        if(res.data.posts) {
            this.posts = [...this.posts, ...res.data.posts]

            if(res.data.posts.length === 10) {
              this.hasMore = true
            }
            else {
              this.hasMore = false
            }
        }
      }).catch((err) => {
          console.log(err);
      });
      this.loading = false
    },
    async flushSession() {
        http.get(`users/flush_session/`).then((res) => {
            this.posts = new Array<Post>()
            this.getData()
        }).catch((err) => {
            console.log(err);
        });
    },
  },
  components: { PostsMap, Search, Navbar },
  activated() {
  },
  watch: {
    scrollPosition(scrollPosition) {
      if(scrollPosition >= this.height - 500 && this.hasMore && !this.loading) {
        this.page += 1
        this.loading = true
        this.getData()
      }
    }
  }
})
</script>

<template>
  <div class="explore" id="explore">
    <div>
      <div class="post_map" v-if="posts.length > 0" v-for="(post, index) in posts" :id="post.id" :key="post.id">
        <PostsMap :post="post" />
      </div>
      <div class="w-full flex justify-center p-5" v-if="loading">
        <Loading />
      </div>
      <div class="w-full flex flex-center flex-col p-2" v-if="!loading && !hasMore">
          <div>
            <i-folder/>
          </div>
          <div class="text-xl weight-900 text-center">
            You have seen all the spills.
          </div>
      </div>
    </div>
    <!-- <div v-if="!hasMore" class="text-center message">
      <p>{{message}}</p>
      <button class="btn btn-themed border-none text-heading px-3 py-3 rounded weight-900" @click="flushSession">Reset Session Data</button>
    </div> -->
  </div>
</template>

<style scoped>

.post_map {
  border-bottom: 1px solid var(--color-border);
}

.post_map:not(:first-child) {
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

/* .message {
    padding: 1rem;
} */

</style>
