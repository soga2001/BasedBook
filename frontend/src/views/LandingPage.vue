<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {

        }
    },
    methods: {

    }
})
</script>

<template>
    <div class="w-full p-2 flex flex-col gap-2">
        <div class="w-full text-center ">
            <span class="text-2xl weight-900 text-heading">
                Welcome to Socialite Beta Testing!
            </span>
        </div>
        <div class="flex flex-col gap-2">
            <span class="text-heading text-lg weight-700">We are glad to have you here.</span>
            <span class="text-heading weight-300">Since Socialite is still in the beginning phase of its development and is only being developed by one developer, there will be bugs. Users that have registered are given the ability to report bugs. You will find this option in the navbar when you click the <span class="weight-900 text-heading">More</span> option. </span>
            <span class="text-heading weight-500 text-base">Like how Twitter has Tweets, Socialite has Spills.</span>
        </div>
        <div class="flex flex-col gap-2">
            <span class="text-heading text-lg weight-700">Now lets talk about features that are currently implemented.</span>
            <ul class="text-heading">
                <li>Registration/Login</li>
                <li>Email Verification</li>
                <li>Password reset</li>
                <li>Spilling Tea</li>
                <li>Commenting on Spills</li>
                <li>Liking Spills</li>
                <li>Following/Unfollowing users</li>
                <li>Light/Dark Theme</li>
                <li>Real-time Notifications using websocket</li>
                <li>Real-time new comment update on Spills that user is viewing</li>
                <li>Mention users on Spills and comments using <i class="weight-900 text-heading">@username</i></li>
                <li>Upload user avatar and banner</li>
                <li>Update name, username, email, bio, dob, etc...</li>
                <li>Search for users using their username</li>
                <li>Verify/Unverify User (can only be done by Staff/Admin)</li>
                <li>Turn a user to staff or Remove a user from staff (can only be done by Admin)</li>
                <li>Admin/Staff can delete other users Spill as long as the deleter is of higher hierarchy</li>
                <li>Turn on/off notifications from user you follow</li>
                <li>Allow user to logout of all browsers using Session Management</li>
            </ul>
        </div>
        <div class="flex flex-col gap-2">
            <span class="text-heading text-lg weight-700">Onto planned features of Socialite</span>
            <ul class="text-heading">
                <li>Real-time Trending Topics</li>
                <li>Real-time update on <span class="text-heading weight-900">Home</span> and <span class="text-heading weight-900">Explore</span> page</li>
                <li>Real-time update on <span class="text-heading weight-900">Profile</span> page</li>
                <li>Move over to Server Side rendering using Nuxtjs or Nextjs</li>
                <li>(Real-time) Chatting</li>
                <li>Optimizing backend calls</li>
                <li>Caching queries for better optimization</li>
                <li>Posting spills with <span class="text-heading weight-900">GIFS</span>, <span class="text-heading weight-900">Videos</span>, and <span class="text-heading weight-900">Polls</span></li>
                <li>Posting spills with <span class="text-heading weight-900">Hastags</span> using <i class="text-heading weight-900">#hashtag</i></li>
                <li>Replying to comments</li>
                <li>Build Machine Learning Algorithm to learn user's surfing habits on Socialite and create a <span class="text-heading weight-900">For you</span> page with spills that will be to a user's liking.</li>
                <li>Implement fuzzy search for better results when searching Socialite for users or spills. </li>
            </ul>
        </div>
        <div class="flex flex-col gap-2">
            <span class="text-heading text-lg weight-700">Known bugs</span>
            <ul class="text-heading">
                <li>Websocket isn't functioning in production version</li>
            </ul>
        </div>
        <div class="flex flex-col gap-2">
            <span class="text-heading text-lg weight-700">Update 1.0 (Mon Oct 16 2024)</span>
            <ul class="text-heading">
                <li>Fixed issue where user couldn't see dropdown menu when clicked on more_vert icon on posts.</li>
            </ul>
        </div>
        <div class="flex flex-row gap-10 justify-center">
            <RouterLink to="/login" class="px-10 py-2 text-heading no-decor hover-underline hover-text-theme weight-900 text-xl">
                Login
            </RouterLink>
            <RouterLink to="/register" class="px-10 py-2 text-heading no-decor hover-underline hover-text-theme weight-900 text-xl">
                Register
            </RouterLink>
        </div>
    </div>
</template>

<style scoped lang="scss">


ul {
    li {
        color: var(--color-heading);
        font-weight: 500;
        font-size: 1rem;
    }
}
</style>