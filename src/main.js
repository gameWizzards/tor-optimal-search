import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'

const app = createApp(App).mount('#app');
app.prototype.$http = axios
