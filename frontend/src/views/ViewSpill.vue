<script lang="ts">
import { http } from '@/assets/http';
import type { Post, Comment, User } from '@/assets/interfaces';
import { defineComponent, ref } from 'vue';
import { AbbreviateNumber } from '@/assets/abbreviate';
import convertTime from '@/assets/convertTime';

export default defineComponent({
    name: "view-spill",
    data() {
        return {
            spill: {} as Post,
            user: {} as User,
            comments: new Array<Comment>(),
            loading_post: true,
            liked: false,
            total_likes: 0,
            total_comments: 0,

            loading_comments: false,
            date: new Date(),
            date_posted: '',
            page: 0,
            // websocket: new WebSocket(`wss://localhost:8000/ws/spill/${this.$route.params.post_id}/`),
            websocket: ref<WebSocket | null>(new WebSocket(`wss://api.suyogyapoudel.com/ws/spill/${this.$route.params.post_id}/`)),
            dropdown: false,
            persistent: false,
            report: false,
            reason: '',

            imgZoom: false,

            hovering: false,

            delayEnter: ref<number | null>(),
            delayExit: ref<number | null>(),
            toolTip_date: '',

            error: false,
            errMsg: '',
        };
    },
    created() {
        this.getSpill();
    },
    methods: {
        async getSpill() {
            this.loading_post = true;
            await http.get(`posts/post_by_id/${this.$route.params.post_id}/`).then((res) => {
                if(res.data.success) {
                    this.spill = res.data.spill;
                    this.user = this.spill.user;
                    this.date_posted = convertTime(this.spill.date_posted, 'short')
                    this.toolTip_date = convertTime(this.spill.date_posted, 'absolute')
                    this.total_likes = this.spill.total_likes;
                    this.liked = this.spill.user_has_liked;
                    if(this.spill.total_comments > 0) this.getComments();
                }
                else {
                    this.error = true;
                    this.errMsg = res.data.message;
                }
            }).catch((err) => {
                console.log(err);
                this.error = true;
                this.errMsg = err.response.data.message;
            });
            this.loading_post = false;
        },
        async getComments() {
            this.loading_comments = true;
            await http.get(`comments/comments_by_post/${this.date.toISOString()}/${this.page}/${this.$route.params.post_id}/`).then((res) => {
                if(res.data.comments) {
                    this.comments = [...res.data.comments, ...this.comments]
                }
                    
            }).catch((err) => {
                console.log(err);
            });
            this.loading_comments = false;
        },
        checkLiked() {
            if(!this.$store.state.authenticated) {
                return false;
            }
            http.get(`like/check_liked/${this.spill.id}/`).then((res) => {
                if(res.data.liked) {
                    this.liked = res.data.liked;
                }
                else {
                    this.liked = false;
                }
            }).catch((err) => {
                console.log(err)
            })
            // this.liked = true
        },
        like() {
            if (!this.$store.state.authenticated) {
                this.$q.notify({
                    message: "You must be logged in to like a post!",
                    color: "negative",
                    position: "top-right",
                    timeout: 1000
                })
                return;
            }
            this.liked = !this.liked;
            http.post('like/like_post/', {
                post_id: this.spill.id
            }, {
            }).then((res) => {
                if(res.data.liked) {
                    this.total_likes += 1;
                }
                else if(!res.data.liked) {
                    this.total_likes -= 1;
                }
                else {
                    // console.log(res.data)
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        async websocketOpen() {
            this.websocket = new WebSocket(`wss://localhost:8000/ws/spill/${this.$route.params.post_id}/`)
            if (this.websocket) {
                this.websocket.onopen = (e) => {
                    console.log('Websocket opened')
                }
            }
            
        },
        async websocketMessage() {
            if(this.websocket) {
                this.websocket.onmessage = async (e) => {
                    const data = JSON.parse(e.data)
                    if(data.type == "comment") {
                        const newComment = JSON.parse(data.message) as Comment
                        console.log(newComment)

                        if(this.comments.length !== 0) {
                            this.comments = [newComment, ...this.comments];
                            this.total_comments = this.comments.length
                        }
                        else {
                            this.comments.push(newComment)
                        }
                    }
                }
            }
        },
        async websocketClose() {
            this.websocket && this.websocket.close()

            if(this.websocket) {
                this.websocket.onclose = (e) => {
                    this.websocket = null
                }
            }
        },
        deleteComment(index: number) {
            this.comments.splice(index, 1)
        },
        reportPost() {

        },
        deletePost() {

        },
        divEnter() {
            if(this.$q.screen.lt.sm) {
                return;
            }
            if (this.delayExit) {
                clearTimeout(this.delayExit);
            }
            if (!this.hovering) { // Check if the menu is not already open
                this.delayEnter = window.setTimeout(() => {
                    this.hovering = true;
                    this.delayEnter = null;
                }, 700); // Add a delay before opening the menu (adjust this value as needed)
            }
        },

        divExit() {
            if(this.$q.screen.lt.sm) {
                return;
            }
            if (this.delayEnter) {
                clearTimeout(this.delayEnter);
            }
            if (this.hovering) { // Check if the menu is currently open
                this.delayExit = window.setTimeout(() => {
                    this.hovering = false;
                    this.delayExit = null;
                }, 500); // Add a delay before closing the menu (adjust this value as needed)
            }
        },
        async copyLink() {
            const text = `${window.location.origin}/${this.spill.user.username}/spill/${this.$route.params.post_id}`
            try {
                await navigator.clipboard.writeText(text);
                this.$q.notify({
                    message: `<span class="text-white weight-900">Link copied to clipboard!</span>`,
                    color: "positive",
                    position: "bottom",
                    timeout: 1000,
                    html: true,
                })
            } catch($e) {
                this.$q.notify({
                    message: `<span class="text-white weight-900">Link couldn't be copied to clipboard!</span>`,
                    color: "negative",
                    position: "bottom",
                    timeout: 1000,
                    html: true,
                })
            }
            
        }
    },
    mounted() {
        this.websocketMessage()
    },
    unmounted() {
        this.websocketClose()
    },
    activated() {
        if(this.websocket === null) {
            this.websocketOpen()
        }
        this.websocketMessage()
    },
    deactivated() {
        this.websocketClose();
    },
    components: { },
    watch: {
        '$route'() {
            this.divExit()
        },
        // comments(comments) {
        //     this.total_comments = comments.length;
        // },
        spill(spill) {
            if(spill.user.username) {
                document.title = `Spill by ${spill.user.full_name}`
            }
        }
    }
})
</script>

<template>
    <div class="grid">
        <div>
            <header class="sticky top-0 bg-theme-opacity bg-blur-1 z-1">
                <Item>
                    <template #avatar>
                        <q-btn size="16px" @click="$router.back" flat dense round class="text-heading" icon="arrow_back" />
                    </template>
                    <template #title>
                        <span class="text-2xl text-heading weight-900">Spill</span>
                    </template>
                </Item>
            </header>
            <div v-if="!loading_post && Object.keys(spill).length !== 0" class="">
                <div>
                    <Item align-items="start" avatar-size="3.5rem">
                        <template #avatar>
                            <user-card :user-prop="user">
                                <template #text>
                                    <q-avatar :size="$q.screen.lt.sm ? '2.8rem' : '3.5rem'" class="hover-darker relative pointer" @click.stop="$router.push({name: 'user-profile', params: { username: user.username }})">
                                        <img v-if="user.avatar" :src="user.avatar" alt="John Doe" class="rounded-full" />
                                        <img v-else src="https://avatarairlines.com/wp-content/uploads/2020/05/Male-placeholder.jpeg" alt="John Doe" class="rounded-full" />
                                    </q-avatar>
                                </template>
                            </user-card>
                            
                        </template>
                        <template #title>
                        <div class="h-full min-w-full flex gap-1 items-center title">
                            <div class="ellipsis" >
                                <user-card :user-prop="user">
                                    <template #text>
                                        <span @mouseover="divEnter"  @mouseleave="divExit"  class="text-lg pointer hover-underline text-heading weight-900" @click.stop="$router.push({name: 'user-profile', params: { username: spill.user.username }})">
                                            {{spill.user.full_name}}
                                        </span>
                                    </template>
                                </user-card>
                            </div>
                        </div>

                        </template>

                        <template #caption>
                            <div>
                                <div class="ellipsis">
                                    <span class="text-lg pointer hover-underline text-lighter weight-500" @click.stop="$router.push({name: 'user-profile', params: { username: spill.user.username }})">@{{ spill.user.username }} </span>
                                </div>
                            </div>
                        </template>
                        <template #icon>
                            <div>
                                <q-btn @click.stop="dropdown = !dropdown" size="13px" class="more__vert" flat round icon="more_horiz" />
                                <q-menu class="dropdown bg-theme border" v-model="dropdown" transition-show="jump-down" transition-hide="jump-up" cover anchor="top right">
                                    <q-list class="more__option">
                                        <q-item clickable v-close-popup @click="report = true" v-if="!spill.is_owner">
                                            <q-item-section avatar>
                                                <q-icon class="danger__icon" name="flag"/>
                                            </q-item-section>
                                            <q-item-section>
                                                <q-item-label>Report Post</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                        <q-item class="danger-btn" clickable v-close-popup @click="persistent = true" tabindex="0" v-if="spill.is_owner || $store.state.user.is_admin || $store.state.user.user.is_staff">
                                            <q-item-section avatar>
                                                <q-icon color="red" class="danger__icon" name="delete_forever"/>
                                            </q-item-section>
                                            <q-item-section>
                                                <q-item-label class="text-red weight-900">Delete</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                        <q-item clickable v-close-popup v-if="spill.is_owner">
                                            <q-item-section avatar>
                                                <q-icon class="" name="edit_note"/>
                                            </q-item-section>
                                            <q-item-section>
                                                <q-item-label>Edit</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-menu>


                                <q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
                                    <q-card class="card bg-theme">
                                        <q-card-section class="row">
                                            <q-item>
                                                <q-item-section class="title">Are you sure you want to delete this post?</q-item-section>
                                            </q-item>
                                        </q-card-section>
                                        <q-card-section>
                                            <q-item>
                                                <q-item-section avatar>
                                                    <q-icon color="red" name="warning" />
                                                </q-item-section>

                                                <q-item-section class="text-red weight-900">
                                                    This action is permanent and irreversible.
                                                </q-item-section>
                                            </q-item>
                                        </q-card-section>

                                        <q-card-actions align="right" class="buttons">
                                            <q-btn flat label="Cancel"  v-close-popup />
                                            <q-btn flat label="Confirm" @click="deletePost" v-close-popup />
                                        </q-card-actions>
                                    </q-card>
                                </q-dialog>


                                <q-dialog v-model="report" persistent>
                                    <q-card class="card">
                                        <q-card-section>
                                            <q-item>
                                                <q-item-section class="title">Report</q-item-section>
                                                <q-item-section avatar>
                                                <q-avatar class="red" icon="flag"/>
                                                </q-item-section>
                                            </q-item>
                                        </q-card-section>
                                        <q-card-section class="q-pt-none">
                                            <q-input
                                                v-model="reason"
                                                filled
                                                clearable
                                                type="textarea"
                                                label="Reason"
                                                :dark="$store.state.dark"                                
                                            />
                                        </q-card-section>

                                        <q-card-actions align="right" class="buttons">
                                            <q-btn flat label="Cancel" v-close-popup />
                                            <q-btn flat label="Report" v-close-popup @click="reportPost" />
                                        </q-card-actions>
                                    </q-card>
                                </q-dialog>
                            </div>
                            
                        </template>
                    </Item>
                </div>
                <div class="text-base no-decor w-fit px-2 my-2">
                    <Item dense captionLineClamp="none">
                        <template #caption>
                            <span class="text-xl pre-line">
                                <MentionLink class="text-xl"  :mention="spill.caption"/>
                            </span>
                        </template>
                    </Item>
                </div>
                <div class="w-full p-2 flex flex-col gap-3">
                    <q-img v-if="spill.img_url" @click="imgZoom = true" class="w-full rounded border hover-darker  cursor-zoom" :src="spill.img_url" />
                    <zoomImg v-if="imgZoom" :img="spill.img_url" :open="imgZoom" @update:open="imgZoom = $event"/>
                    <Timeago class="text-base text-lighter" :date="spill.date_posted" date_type="absolute" html/>
                </div>
                <hr class="m-2"/>
                <div class="flex flex-row p-3 gap-5 text-base">
                    <div>
                        <span >
                            <span>
                            <transition name="fade" mode="out-in">
                                <span class="text-heading weight-900" v-if="total_likes % 2 == 0">{{ total_likes }}</span>
                                <span class="text-heading weight-900" v-else>{{ total_likes }}</span>
                            </transition>
                            </span>
                            Likes
                        </span>
                        
                    </div>
                    <div>
                        <!-- <span><span class="text-heading weight-900"> {{ spill.total_likes }}</span> Comments</span> -->
                        <span><span class="text-heading weight-900">{{ total_comments }}</span> Comments</span>
                    </div>
                </div>
                <hr class="m-2"/>
                <div class="flex flex-row gap-10 py-2 px-5">
                    <div>
                        <q-btn flat round :class="(liked ? 'liked' : '')"  @click.stop="like">
                            <q-tooltip :offset="[0,0]">
                                Like
                            </q-tooltip>
                            <i-heart size="1.5rem" :fill="liked ? 'red' : 'var(--color-text)'"  stroke="red" />
                        </q-btn>
                    </div>
                    <div>
                        <q-btn flat round :class="(liked ? 'liked' : '')"  @click.stop="">
                            <q-tooltip :offset="[0,0]">
                                Comment
                            </q-tooltip>
                            <i-comment size="1.5rem" fill="var(--color-text)" stroke="var(--color-heading)" />
                        </q-btn>
                    </div>
                    <div>
                        <q-btn flat round :class="(liked ? 'liked' : '')"  @click.stop="copyLink">
                            <q-tooltip :offset="[0,0]">
                                Copy Link
                            </q-tooltip>
                            <i-share size="1.5rem" fill="var(--color-text)" stroke="var(--color-heading)" />
                        </q-btn>
                    </div>
                </div>
                <hr class="m-2"/>
                <div class="px-2 border-b" v-if="$store.state.authenticated">
                    <Spills placeholder="Reply to the spill" btnString="Reply" isComment :spillId="spill.id"/>
                </div>
                <div class="grid overflow-hidden w-100">
                    <TransitionGroup name="slide" mode="out-in" tag="div">
                        <div v-if="comments" v-for="(comment, index) in comments" :key="comment.id">
                            <CommentMap :comment="comment" @deleted="deleteComment(index)"/>
                        </div>
                    </TransitionGroup>
                    <div v-if="loading_comments">
                        <Loading/>
                    </div>
                </div>
            </div>
            <div v-if="loading_post" class="">
                <Loading/>
            </div>
            <div v-if="error" class="text-center h-full w-full flex justify-center items-center">
                <span class="text-2xl text-heading weight-900">{{ errMsg }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

* {
    transition: all .3s;
}

.followed {
  &:hover {
    span {
      display: none;
    }

    border: 1px solid red !important;
    background-color: rgba(255, 0, 0, 0.1) !important;

    &::before {
      content: 'Unfollow';
      // font-size: 20px;
      color: red;
      font-weight: 900;
      transition: opacity 0.3s ease-in-out;
    }
  }
}

/* #app {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.app span {
    position: relative;
} */





</style>