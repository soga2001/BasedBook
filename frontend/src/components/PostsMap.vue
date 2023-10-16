<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { Post } from '@/assets/interfaces';
import { http } from '@/assets/http';
import Timeago from './Timeago.vue';
import Heart from './Heart.vue';
import MentionLink from './MentionLink.vue';
import { AbbreviateNumber } from '@/assets/abbreviate';
import createIntersectObserver from '@/assets/intersectionObserver'

import SpillCard from './Cards/SpillCard.vue';
import Favorite from './Buttons/Favorite.vue';

import convertTime from '@/assets/convertTime';



export default defineComponent({
    props: {
        post: { type: Object as () => Post, required: true }
    },
    data() {
        return {
            id: this.post.id,
            user: this.post.user,
            // user_id: this.post.user,
            img_url: this.post.img_url,
            caption: this.post.caption,
            date_posted: convertTime(this.post.date_posted, 'short'),
            toolTip_date: convertTime(this.post.date_posted, 'absolute'),
            date_updated: this.post.date_posted,
            dropdown: false,
            liked: this.post.user_has_liked,
            total_comments: this.post.total_comments,
            total_likes: this.post.total_likes,
            total_views: 0,
            comments: [],
            img_loading: true,
            avatar_loading: true,
            deleted: false,
            deleteModal: ref(false),
            deleting: false,
            report: ref(false),
            reason: ref(""),
            showComments: false,

            is_following: this.post.user.is_following,

            abbreviateLikes: AbbreviateNumber(this.post.total_likes) as Number,
            abbreviateComments: AbbreviateNumber(this.post.total_comments) as Number,
            abbreviateViews: AbbreviateNumber(0) as Number,

            imgZoom: false,

            hovering: false,

            delayEnter: ref<number | null>(),
            delayExit: ref<number | null>(),


        };
    },
    methods: {
        reportPost() {
            // console.log(this.reason);
        },
        checkLiked() {
            if(!this.$store.state.authenticated) {
                return false;
            }
            http.get(`like/check_liked/${this.post.id}/`).then((res) => {
                if(res.data.liked) {
                    this.liked = res.data.liked;
                }
                else {
                    this.liked = false;
                }
            }).catch((err) => {
                if(err.response.status == 401 && this.$store.state.authenticated ) {
                    this.$router.go(0)
                }
            })
        },
        async like() {
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
            if(this.liked) {
                this.total_likes += 1;
            }
            else {
                this.total_likes -= 1;
            }
            await http.post('like/like_post/', {
                post_id: this.id
            }, {
            }).then((res) => {
                // if(res.data.liked) {
                //     this.total_likes += 1;
                // }
                // else if(!res.data.liked) {
                //     this.total_likes -= 1;
                // }
                // else {
                // }
            }).catch((err) => {
                if(!this.liked) {
                    this.total_likes += 1;
                }
                else {
                    this.total_likes -= 1;
                }
                this.liked = !this.liked
            })
        },
        setDelete() {
            this.deleted = true;
        },
        async deletePost() {
            this.deleting = true;
            await http.delete("posts/delete_post/", {
                data: {
                    id: this.id
                },
            }).then((res) => {
                // this.deleted = true
                if(res.data.success) {
                    this.deleted = true
                    this.$q.notify({
                        message: res.data.message,
                        color: "positive",
                        position: "top-right",
                        timeout: 1000
                    })
                }
                else {
                    this.$notify({
                        title: 'Error!',
                        text: res.data.message,
                        type: 'error',
                        group: 'error',
                    })
                }
            }).catch((err) => {
                console.log(err);
            });
            this.deleting = false
        },
        onImgLoad() {
            this.img_loading = false;
        },
        onAvatarLoaded() {
            this.avatar_loading = false;
        },
        commentToggle() {
            this.showComments = !this.showComments;
        },
        captionChange() {

        },
        viewed() {
            // console.log(this.id)
            setTimeout(() => {
                this.total_views += 1;
            }, 1000);
        },
        focused() {
            this.date_posted = convertTime(this.post.date_posted, 'short')
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

        closeMenu() {
            // clearTimeout(this.delayTimeoutId as number)
        },
        async copyLink() {
            const text = `${window.location.origin}/${this.user.username}/spill/${this.post.id}`
            try {
                await navigator.clipboard.writeText(text);
                this.$q.notify({
                    message: `<span class="text-white weight-900">Link copied to clipboard!</span>`,
                    color: "positive",
                    position: "top-right",
                    timeout: 1000,
                    html: true,
                })
            } catch($e) {
                this.$q.notify({
                    message: `<span class="text-white weight-900">Link couldn't be copied to clipboard!</span>`,
                    color: "negative",
                    position: "top-right",
                    timeout: 1000,
                    html: true,
                })
            }
            
        }
        
    },
    created() {
        // console.log(this.is_following)
    },
    async mounted() {
        await this.$nextTick()
        // const observer = createIntersectObserver(this.$el, this.viewed, {threshold: .75})
    },
    
    watch: {
        '$store.state.authenticated': function () {
            if(this.$store.state.authenticated) {
                this.checkLiked()
            } else {
                this.liked = false;
            }
        },
        total_likes(total_likes) {
            this.abbreviateLikes = AbbreviateNumber(total_likes) as Number;
        },
        total_comments(total_comments) {
            this.abbreviateComments = AbbreviateNumber(total_comments) as Number;
        },
        total_views(total_views) {
            this.abbreviateViews = AbbreviateNumber(total_views) as Number;
        },
        '$route'() {
            this.divExit()
        },
        dropdown(dropdown) {
            // console.log(this.$store.state.user);
        }
    },
    components: { Timeago, Heart, MentionLink, SpillCard, Favorite }
})
</script>

<template>
    <div @mousedown="focused" class="grid p-2 rounded-none bg-theme bg-hover-mute pointer" @click="$router.push({name: 'view-spill', params: { user: user.username, post_id: id}})" v-if="!deleted">
        <SpillCard class="w-full h-full relative">
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
                <Item dense align-items="start">
                    <template #title>
                        <div class="h-full min-w-full flex gap-1 items-center title">
                            <div class="ellipsis" >
                                <user-card :user-prop="user">
                                    <template #text>
                                        <span class="ellipsis text-lg pointer hover-underline text-heading weight-900" > 
                                            {{ user.full_name }}
                                        </span>
                                    </template>
                                </user-card>
                            </div>

                            <span class="h-full" v-if="user.verified">
                                <q-icon class="vert-align-middle "  color="blue" size="1.5rem" name="verified">
                                    <q-tooltip :delay="1000" class="bg-theme text-heading box-shadow text-sm">
                                        Verified
                                    </q-tooltip>
                                </q-icon>
                            </span>
                            <!-- <span class="h-full " v-if="user.is_admin || user.is_staff">
                                <q-icon class="vert-align-middle " color="green" size="1.5rem" name="admin_panel_settings">
                                    <q-tooltip :delay="1000" class="bg-theme text-heading box-shadow text-sm">
                                        {{ user.is_admin ? 'Admin' : null}}
                                        {{ (!user.is_admin && user.is_staff) ? 'Staff' : null}}
                                    </q-tooltip>
                                </q-icon>
                            </span> -->
                            <!-- <span class="h-full" v-if="user.private">
                                <q-icon class="vert-align-middle "  :color="$store.state.dark ? 'white' : 'black'" size="1.5rem" name="lock">
                                    <q-tooltip :delay="1000" class="bg-theme text-heading box-shadow text-sm">
                                        Private
                                    </q-tooltip>
                                </q-icon>
                            </span> -->

                            <span class="text-lighter weight-900">&#183;</span>

                            <div>
                                <div class="ellipsis">
                                    <user-card :user-prop="user">
                                        <template #text>
                                            <span class="text-lg pointer hover-underline text-lighter weight-500">@{{ user.username }}</span>
                                        </template>
                                    </user-card>
                                </div>
                            </div>

                            <span class="text-lighter weight-900">&#183;</span>

                            <div class="ellipsis ">
                                <span class="text-lg text-lighter weight-500 hover-dotted">{{ date_posted }}</span>
                                <q-tooltip class="bg-theme box-shadow">
                                    <span class="text-sm " v-html="toolTip_date"></span>
                                </q-tooltip>
                            </div>
                            
                        </div>

                    </template>
                    <template #icon>
                        <div>
                            <q-btn @click.stop="dropdown = !dropdown" size="10px" class="more__vert" flat round icon="more_horiz" />
                            <q-menu class="bg-theme box-shadow rounded-xs border" v-model="dropdown" transition-show="jump-down" transition-hide="jump-up" cover anchor="top right">
                                <q-list class="more__option box-shadow" >
                                    <q-item clickable v-close-popup @click="report = true" v-if="!post.is_owner">
                                        <q-item-section avatar>
                                            <q-icon class="danger__icon" name="flag"/>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label>Report Post</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                    <q-item class="danger-btn" clickable v-close-popup @click="deleteModal = true" tabindex="0" v-if="post.is_owner || $store.state.user && ( $store.state.user.is_staff || $store.state.user.is_admin)">
                                        <q-item-section avatar>
                                            <q-icon color="red" class="danger__icon" name="delete_forever"/>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label class="text-red weight-900">Delete</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                    <q-item clickable v-close-popup v-if="post.is_owner">
                                        <q-item-section avatar>
                                            <q-icon class="" name="edit_note"/>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label>Edit</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-menu>

                            
                            <q-dialog v-model="deleteModal" persistent transition-show="scale" transition-hide="scale">
                                <q-card class="card bg-theme border-brighter">
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
                                        <q-btn flat label="Confirm" @click="deletePost" />
                                    </q-card-actions>
                                </q-card>
                            </q-dialog>


                            <q-dialog v-model="report" persistent>
                                <q-card class="bg-theme min-w-68 w-full box-shadow">
                                    <q-card-section>
                                        <q-item>
                                            <q-item-section class="text-2xl text-heading weight-900">Report</q-item-section>
                                            <q-item-section avatar class="pointer" @click="report=false">
                                                <i-close stroke="none" fill="var(--color-heading)" size="2.3rem"/>
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

                                    <q-card-section>
                                        <q-item>
                                            <q-item-section avatar>
                                                <q-icon class="text-red-6" name="warning"/>
                                            </q-item-section>
                                            <q-item-section class="text-red-6 alert weight-700">If you submit a false report, you can be subjected to a ban!</q-item-section>
                                        </q-item>
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

            </template>
            <template #subtitle v-if="caption">
                <div class="text-base w-full pre-line"  >
                    <MentionLink :mention="caption"/>
                </div>
            </template>
            <template #body v-if="img_url">
                <div class="w-full relative h-full">
                    <q-img @click.stop="imgZoom = true" class="rounded-sm cursor-zoom hover-darker img" :src="img_url"/>
                    <zoomImg v-if="imgZoom" :img="img_url" :open="imgZoom" @update:open="imgZoom = $event" />
                </div>
            </template>
            <template #actions>
                    <div class="flex justify-center items-center gap-3">
                        <div>
                            <q-btn flat round :class="'action like__btn ' + (liked ? 'liked' : '')"  @click.stop="like">
                                <q-tooltip v-if="!$q.screen.lt.sm" :offset="[0,0]">
                                    Like
                                </q-tooltip>
                                <i-heart size="1.4rem" :fill="liked ? 'red' : 'var(--color-text)'"  stroke="red" />
                            </q-btn>
                        </div>
                        <div>
                            <!-- <span :style="{color: liked ? 'red' : 'inherit'}">{{ abbreviateLikes}}</span> -->
                            <transition name="fade" mode="out-in">
                                <span :style="{color: liked ? 'red' : 'inherit'}" class="weight-900" v-if="total_likes % 2 == 0">{{ abbreviateLikes}}</span>
                                <span :style="{color: liked ? 'red' : 'inherit'}" class="weight-900" v-else>{{ abbreviateLikes}}</span>
                            </transition>
                        </div>
                    </div>
                    <div class="flex justify-center items-center gap-2">
                        <div>
                            <q-btn flat round class="action comment" @click.stop="commentToggle">
                                <q-tooltip v-if="!$q.screen.lt.sm" :offset="[0,0]">
                                    Comment
                                </q-tooltip>
                                <i-comment fill="var(--color-text)" />
                            </q-btn>
                        </div>
                        <transition name="fade" mode="out-in">
                            <span class="text-heading weight-900" v-if="total_comments % 2 == 0">{{ abbreviateComments }}</span>
                            <span class="text-heading weight-900" v-else>{{ abbreviateComments }}</span>
                        </transition>
                        <q-dialog class="min-h-sm" v-model="showComments" persistent position="top">
                            <div class="bg-theme rounded-sm mt-12 box-shadow box-theme-soft w-full min-h-fit max-w-sm h-fit relative" >
                                <div class="p-2">
                                    <Item dense :vert-icon-center="true">
                                        <template #title>
                                            <div class="text-2xl weight-900">Comment</div>
                                        </template>
                                        <template #icon>
                                            <i-close size="2rem" class="pointer" @click="showComments = false"/>
                                        </template>
                                    </Item>
                                </div>
                                <hr class="border"/>
                                <div class="">
                                    <Spills  placeholder="Reply to the spill" btnString="Reply" isComment :spillId="id" :rows="4"/>
                                </div>
                            </div>
                        </q-dialog>
                    </div>
                    <!-- <div class="flex justify-center items-center gap-1">
                        <div>
                            <q-btn round flat @click.stop="">
                                <q-tooltip :offset="[0,0]" v-if="!$q.screen.lt.sm">
                                    Views
                                </q-tooltip>
                                <q-icon class="text-body" name="visibility"/>
                            </q-btn>
                        </div>
                        <transition name="fade" mode="out-in">
                            <span class="text-heading weight-900" v-if="total_views % 2 == 0">{{ abbreviateViews }}</span>
                            <span class="text-heading weight-900" v-else>{{ abbreviateViews }}</span>
                        </transition>
                    </div> -->

                    <q-btn round flat @click.stop="copyLink">
                        <q-tooltip v-if="!$q.screen.lt.sm" :delay="500" :offset="[0,0]">
                            Copy Link
                        </q-tooltip>
                        <i-share fill="var(--color-text)" />
                    </q-btn>
            </template>
        </SpillCard>
    </div>
</template>

<style scoped lang="scss">



.title  {

    max-width: 100%;

    > :first-child {
        max-width: 40%;
    }


    > :nth-child(3) {
        max-width: 30%;
    }

    > :last-child {
        max-width: 15%;
    }
}

.img {
    max-height: 600px;
    height: 100%;
    object-fit:contain;

}


.symbol {
    font-size: 1.5rem;
    font-weight: 900;
    color: var(--color-text);
}



</style>