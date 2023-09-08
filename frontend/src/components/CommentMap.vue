<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { Comment } from '@/assets/interfaces'
import { http } from '@/assets/http';
import convertTime from '@/assets/convertTime';


export default defineComponent({
    name: 'comment-map',
    props: {
        comment: {
            type: Object as () => Comment,
            required: true
        }
    },
    data() {
        return {
            user: this.comment.user,
            edit: false,
            // websocket: new WebSocket(`wss://api.suyogyapoudel.com/ws/comment/${this.comment.id}/`),
            dropdown: false,
            report: ref(false),
            reason: ref(""),
            deleteModal: false,
            deleted: false,
            deletedMsg: '',
            commentData: this.comment,

            date_posted: convertTime(this.comment.date_posted, 'short'),
            toolTipDate: convertTime(this.comment.date_posted, 'absolute'),
        }
    },
    methods: {
        deleteComment() {
            http.delete(`comments/comment/${this.commentData.id}/`).then((res) => {
                // console.log(res.data)
            }).catch((err) => {
                console.log(err);
            });
        },
        reportPost() {
            console.log(this.reason);
        },
        // async websocketOpen() {
        //     this.websocket.onopen = (e) => {
        //         // console.log('Websocket opened')
        //     }
        // },
        // async websocketMessage() {
        //     this.websocket.onmessage = (e) => {
        //         // console.log(e.data)
        //         const data = JSON.parse(e.data)
        //         if(data.type == "delete") {
        //             this.$emit("deleted")
        //         }
        //     }
        // },
        // async websocketClose() {
        //     this.websocket.close()

        //     this.websocket.onclose = (e) => {
        //         console.log('Websocket closed')
        //     }
        // },
    },
    created() {
        // this.websocketOpen()
        // this.websocketMessage()
    },
    // mounted() {
    //     this.websocketOpen()
    //     this.websocketMessage()
    // },
    unmounted() {
        // this.websocketClose()
    },
    watch: {
        // deleted(deleted) {
        //     if(deleted) {
        //         this.$emit('deleted', this.comment.id)
        //         this.websocket.close()
        //     }
        // }
    }
})
</script>

<template>
    <Transition name="fade">
        <div class="border">
            <Item class="bg-theme h-full w-full" alignItems="start" :captionLineClamp="4">
                <template #avatar>
                    <user-card :user-prop="user">
                        <template #text>
                            <q-avatar size="3rem" class="hover-darker relative pointer" @click.stop="$router.push({name: 'user-profile', params: { username: user.username }})">
                                <img v-if="user.avatar" :src="user.avatar" alt="John Doe" class="rounded-full" />
                                <img v-else src="https://avatarairlines.com/wp-content/uploads/2020/05/Male-placeholder.jpeg" alt="John Doe" class="rounded-full" />
                            </q-avatar>
                        </template>
                    </user-card>
                </template>
                <template #title>
                    <div class="w-full flex flex-cols gap-1 items-center">
                        <div class="h-full min-w-full flex gap-1 items-center title">
                            <div class="ellipsis" >
                                <user-card :user-prop="user">
                                    <template #text>
                                        <span class="ellipsis text-lg pointer hover-underline text-heading weight-900" > 
                                            {{user.full_name}}
                                        </span>
                                    </template>
                                </user-card>
                            </div>

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
                                <span class="text-lg pointer text-lighter weight-500 hover-dotted" v-html="date_posted"></span>
                                <q-tooltip class="bg-theme box-shadow">
                                    <span class="text-sm " v-html="toolTipDate"></span>
                                </q-tooltip>
                            </div>
                            
                        </div>
                    </div>
                </template>
                <template #caption>
                    <div class="text-base w-fit"  >
                        <MentionLink @click.stop="" :mention="commentData.comment"/>
                    </div>
                </template>
                <template #icon>
                    <div>
                            <q-btn @click.stop="dropdown = !dropdown" size="13px" class="more__vert" flat round>
                                <q-icon name="more_horiz" class="btn-hover-theme" />
                            </q-btn>
                            <q-menu class="dropdown bg-theme" v-model="dropdown" transition-show="jump-down" transition-hide="jump-up" cover anchor="top right">
                                <q-list class="more__option">
                                    <q-item clickable v-close-popup @click="report = true" v-if="!comment.is_owner">
                                        <q-item-section avatar>
                                            <q-icon class="danger__icon" name="flag"/>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label>Report Post</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                    <q-item clickable v-close-popup @click="deleteModal = true" tabindex="0" v-if="comment.is_owner">
                                        <q-item-section avatar>
                                            <q-icon color="red" name="delete_forever"/>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label class="text-red weight-700">Delete</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                    <q-item clickable v-close-popup v-if="comment.is_owner">
                                        <q-item-section avatar>
                                            <q-icon class="" name="edit_note"/>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label>Edit</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-menu>
                            <!-- Confirm Delete Model -->
                            <q-dialog v-model="deleteModal" persistent transition-show="scale" transition-hide="scale">
                                <q-card class="bg-red-1">
                                    <q-card-section>
                                        <q-item>
                                            <q-item-section class="text-xl text-black weight-900">Are you sure you want to delete this comment?</q-item-section>
                                        </q-item>
                                    </q-card-section>
                                    <q-card-section>
                                        <q-item>
                                            <q-item-section avatar>
                                                <q-avatar>
                                                    <q-icon color="red" name="warning"/>
                                                </q-avatar>
                                            </q-item-section>
                                            <q-item-section class="text-red alert">This action is permanent and irreversible.</q-item-section>
                                        </q-item>
                                    </q-card-section>

                                    <q-card-actions align="right">
                                        <q-btn flat label="Cancel"  v-close-popup />
                                        <q-btn flat  @click="deleteComment" v-close-popup>
                                            <div class="text-red">
                                                Confirm
                                            </div>
                                        </q-btn>
                                    </q-card-actions>
                                </q-card>
                            </q-dialog>
                            <!-- Report model -->
                            <q-dialog v-model="report" persistent>
                                <q-card class="card">
                                    <q-card-section>
                                        <!-- <h6 class="title">Report</h6> -->
                                        <q-item>
                                            <q-item-section class="title">Report</q-item-section>
                                            <q-item-section avatar>
                                            <q-avatar class="red" icon="flag"/>
                                            </q-item-section>
                                        </q-item>
                                    </q-card-section>
                                    <q-card-section class="q-pt-none">
                                        <!-- <q-input :dark="$store.state.dark" class="report__reason" placeholder="Reason" dense v-model="reason" /> -->
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
    </Transition>
</template>

<style scoped>
</style>