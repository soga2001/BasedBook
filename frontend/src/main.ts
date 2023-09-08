import { createApp } from 'vue'
import {store, key} from './store/store'
import App from './App.vue'
import router from './router'
import { vue3Debounce } from 'vue-debounce'

import Notifications from '@kyvg/vue3-notification'
 




import { Quasar, Dialog, Notify, Cookies } from 'quasar'
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-icons-round/material-icons-round.css'
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css'
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css'
import '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css'
import '@quasar/extras/material-symbols-sharp/material-symbols-sharp.css'
import '@quasar/extras/mdi-v7/mdi-v7.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
import '@quasar/extras/ionicons-v4/ionicons-v4.css'
import '@quasar/extras/eva-icons/eva-icons.css'
import '@quasar/extras/themify/themify.css'
import '@quasar/extras/line-awesome/line-awesome.css'
import '@quasar/extras/bootstrap-icons/bootstrap-icons.css'
// Import Quasar css
import 'quasar/dist/quasar.css'
import 'quasar/src/css/index.sass'

// My Components
import Item from '@/components/Item.vue';
import ThemeToggle from './components/ThemeToggle.vue'
import ToolTips from '@/components/ToolTips.vue';
import CircularProgress from './components/circularProgress.vue'
import UploadedImage from '@/components/uploadedImg.vue';
import imageCropper from '@/components/imageCropper.vue';
import Loading from './components/Loading.vue'
import MentionLink from '@/components/MentionLink.vue';
import Timeago from './components/Timeago.vue';
import Spills from './components/Spills.vue';
import Input from './components/Input.vue'
import Textarea from './components/Textarea.vue';
import Select from './components/Select.vue'
import CommentMap from '@/components/CommentMap.vue';
import PostsMap from '@/components/PostsMap.vue'
import Mention from './components/Mention.vue'
import SearchBar from '@/components/SearchBar.vue';
import zoomImg from '@/components/zoomImg.vue';
import hoverUserData from '@/components/Cards/hoverUserData.vue';
import ForgotPassword from '@/components/forgotPassword.vue';

// Loaders
import logoLoader from './components/loaders/logoLoader.vue'




// my icons
import HomeIcon from '@/icons/i-home.vue';
import ExploreIcon from '@/icons/i-explore.vue';
import ProfileIcon from '@/icons/i-profile.vue';
import SettingsIcon from '@/icons/i-settings.vue';
import NotifIcon from '@/icons/i-notif.vue';
import SearchIcon from '@/icons/i-search.vue';
import HeartIcon from '@/icons/i-heart.vue';
import ShareIcon from '@/icons/i-share.vue';
import LoginIcon from '@/icons/i-login.vue'
import LogoutIcon from '@/icons/i-logout.vue';
import UploadImage from '@/icons/i-uploadImg.vue';
import UploadVideo from '@/icons/i-uploadVid.vue';
import CloseIcon from '@/icons/i-close.vue';
import SpillIcon from '@/icons/i-spill.vue';
import CommentIcon from '@/icons/i-comment.vue';
import EmptyFolder from '@/icons/i-folder.vue';
import RegisterIcon from '@/icons/i-register.vue';
import MentionIcon from '@/icons/i-mention.vue';
import UserCloseIcon from '@/icons/i-user-close.vue';
import GhostIcon from '@/icons/i-ghost.vue';
import MoreCircle from '@/icons/i-more-circle.vue';
import StaffIcon from '@/icons/i-staff.vue';
import BalloonIcon from '@/icons/i-balloon.vue';
import LinkIcon from '@/icons/i-link.vue';
import BannerIcon from '@/icons/i-banner.vue';


const app = createApp(App)



app.use(Notifications);
app.use(router);
app.use(store, key);
app.component('i-home', HomeIcon);
app.component('i-explore', ExploreIcon);
app.component('i-profile', ProfileIcon);
app.component('i-settings', SettingsIcon);
app.component('i-notif', NotifIcon);
app.component('i-search', SearchIcon);
app.component('i-heart', HeartIcon);
app.component('i-share', ShareIcon);
app.component('tool-tips', ToolTips);
app.component('i-login', LoginIcon);
app.component('i-register', RegisterIcon);
app.component('i-logout', LogoutIcon);
app.component('i-close', CloseIcon);
app.component('i-spill', SpillIcon);
app.component('i-upload-img', UploadImage);
app.component('i-upload-vid', UploadVideo);
app.component('i-comment', CommentIcon);
app.component('i-folder', EmptyFolder);
app.component('i-mention', MentionIcon);
app.component('i-user-close', UserCloseIcon);
app.component('i-ghost', GhostIcon);
app.component('i-more-circle', MoreCircle);
app.component('i-staff', StaffIcon);
app.component('i-balloon', BalloonIcon);
app.component('i-link', LinkIcon);
app.component('i-banner', BannerIcon);

// components
app.component('circular-progress', CircularProgress);
app.component('uploaded-img', UploadedImage);
app.component('theme-toggle', ThemeToggle);
app.component('image-cropper', imageCropper);
app.component('Loading', Loading);
app.component('Timeago', Timeago)
app.component('MentionLink', MentionLink)
app.component('Spills', Spills)
app.component('CommentMap', CommentMap)
app.component('Mention', Mention)
app.component('PostsMap', PostsMap)
app.component('SearchBar', SearchBar)
app.component('zoomImg', zoomImg)
app.component('user-card', hoverUserData)
app.component('Item', Item);
app.component('Input', Input);
app.component('Textarea', Textarea);
app.component('Select', Select);
app.component('forgot-password', ForgotPassword);

// loaders
app.component('logo-loading', logoLoader);



app.use(Quasar, {
    plugins: {Dialog, Notify, Cookies },
    config: {
    }
})
app.directive('debounce', vue3Debounce({ lock: true }))


app.mount('#app')