import { createApp } from 'vue'
// import router from './router'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'

import { commonConfig, requestContextConfig } from '@gwin/networking'

requestContextConfig.entityId = 'gwin'
requestContextConfig.channel = 'string'

commonConfig.loginCallback = () => {
  console.log('got to login')
}

commonConfig.noPermissionCallback = () => {
  console.log('got to 403 page')
}

createApp(App).use(ElementPlus, { locale }).mount('#app')
