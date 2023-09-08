<script lang="ts">
import { defineComponent } from 'vue';
import { http } from '@/assets/http';
import type { User } from '@/assets/interfaces';
import UserProfile from '../components/UserProfile/UserProfile.vue';
import Search from './Search.vue';

export default defineComponent({
    name: 'user-profile',
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
    data() {
        return {
            // user_id: this.$route.params.id,
            username: this.$route.params.username,
            user: {} as User,
            avatar: '',
            tab: this.$route.name as string,
            loading: true,
            docState: 'saved',
            websocket: new WebSocket(`wss://localhost:8000/ws/user_consumer/${this.$route.params.username}/`),
            headerHeight: '' || 0,
            bannerIntersecting: true,
            user_name: '',
        };
    },
    methods: {
        async userInfo() {
            this.loading = true
            await http.get(`users/username/${this.$route.params.username}/${false}/`).then(async (res) => {
                if (res.data.success) {
                    this.user = res.data.users;
                    this.avatar = this.user.avatar || '';
                }
            }).catch((err) => {
                // console.log(err);
            });
            await this.getHeightOfHeader()
            this.loading = false
        },
        async websocketOpen() {
            this.websocket = new WebSocket(`wss://localhost:8000/ws/user_consumer/${this.$route.params.username}/`)
        },
        async websocketClose() {
            this.websocket.close()

            this.websocket.onclose = (e) => {
                console.log('Websocket closed')
            }
        },
        getHeightOfHeader() {
            if (this.$refs.header) {
                const headerElement: HTMLDivElement = this.$refs.header as HTMLDivElement;
                const headerHeight = headerElement.offsetHeight;
                this.headerHeight = headerHeight
            }
        },
        reloadData() {
            this.username = this.$route.params.username
            this.user = {} as User;
            this.userInfo();
        }
    },
    created() {
        this.userInfo();
    },
    computed: {
        usernameChanged() {
            return this.$route.matched[0].name === 'user-profile' && this.$route.params.username != this.username
        }
    },
    activated() {
        this.tab = this.$route.name as string
        if(this.user.full_name) {
            document.title = `${this.user.full_name}`
        }
    },
    components: { UserProfile, Search},
    watch: {
        bannerIntersecting(bannerIntersecting) {
        },
        usernameChanged() {
            console.log('here')
            this.reloadData()
        },
        user(user) {
            if(user.full_name) {
                document.title = `${user.full_name}`
                this.user_name = user.full_name
            } else {
                this.user_name = ''
            }
        }
    },
})
</script>

<template>
    <div class="user__main min-h-viewport" v-if="Object.keys(user).length > 0">
        <header ref="header" :style="{background: (!bannerIntersecting ? `url(${user.banner}) center / cover no-repeat ` : 'none')}" class="user__name aspect-ratio- z-5 w-full">
            <Item :class="bannerIntersecting ? 'bg-blur-1': 'bg-blur-xs'" class="w-full bg-theme-opacity pl-2" dense :vert-icon-center="true">
                    <template #avatar>
                        <q-btn size="16px" @click="$router.back" flat dense round class="text-heading" icon="arrow_back" />
                    </template>
                    <template #title>
                        <h5 className="text-left">{{ user.full_name }}</h5>
                    </template>
                    <template #caption>
                        <div class="text-left">{{ user.total_posted }} Spills</div>
                    </template>
            </Item>
        </header>

        
        

        <div ref="profile" >
            <UserProfile @update:intersecting="bannerIntersecting = $event" :user="user"/>
        </div>

        <div>
            <div>
                <nav :style="{top: `${headerHeight - .4}px`}" class="w-full sticky z-5 m-0">
                    <q-tabs
                        class="bg-theme bg-blur-half w-full text-lg text-capitalize border-b"
                        active-class="text-heading"
                        v-model="tab"
                        indicator-color="purple-13"
                    
                    >
                        <q-route-tab name="user-posted" class="text-capitalize text-body bg-transparent" active-class="active" :to="{name: 'user-posted', params: {username: username}}" exact replace>
                            <span class="text-shadow ">Spills</span>
                        </q-route-tab>
                        <q-route-tab name="user-liked" class="text-capitalize text-body bg-transparent" active-class="active"  :to="{name: 'user-liked', params: {username: username}}" exact replace>
                            <span class="text-shadow ">Likes</span>
                        </q-route-tab>
                    </q-tabs>
                </nav>
                <div class="w-full overflow-hidden">
                    <RouterView v-slot="{ Component }">
                        <KeepAlive :max="2" :include="['user-posted', 'user-liked']">
                            <component :is="Component" :height="height" :scrollPosition="scrollPosition" :name="user_name"/>
                        </KeepAlive>
                    </RouterView>
                </div>
            </div>
        </div>
    </div>
    <div v-if="loading" class="pt-5">
        <Loading />
    </div>
</template>


<style scoped lang="scss">


.active {
    span {
        color: var(--color-heading);
        font-weight: 900;
    }
}

span {
    color: var(--color-text);
    font-weight: 900;
}


.user__main {
  height: 100%;

  .user__not__found,
  .loading {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

a {
  text-decoration: none;
  color: var(--color-text);
}

.user__name {
    font-size: 30px;
    font-weight: bolder;

    position: -webkit-sticky;
    top: 0px;
    position: sticky;
    width: 100%;
    z-index: 20;
    background-color: var(--color-background);

    background-color: #AD310B;
    -webkit-transition: background .15s ease-in-out;
    -ms-transition: background .15s ease-in-out;
    transition: background .15s ease-in-out;

    // .back {
    //     position: absolute;
    //     left: 10px;
    //     top: 0;
    //     bottom: 0;
    //     margin: auto;
    //     cursor: pointer;
    // }
}


</style>