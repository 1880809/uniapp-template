import App from './App.vue'

const host = 'https://unidemo.dcloud.net.cn/';

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
Vue.prototype.$host = host;
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp, ref } from 'vue'
import uviewPlus from '@/uni_modules/uview-plus'
import * as Pinia from 'pinia';
import { truncateToFixed } from '/lib/utils'

export function createApp() {
	const app = createSSRApp(App)

	app.use(uviewPlus)
	app.use(Pinia.createPinia());

	let platform = uni.getSystemInfoSync().platform
	let statusBarHeight = uni.getSystemInfoSync().statusBarHeight
	uni.platform = platform
	uni.statusBarHeight = statusBarHeight

	uni.windowWidth = uni.getSystemInfoSync().windowWidth
	uni.windowHeight = uni.getSystemInfoSync().windowHeight
	// #ifdef APP-PLUS
	// #endif

	uni.jdToFixed = truncateToFixed
	app.config.globalProperties.jdToFixed = truncateToFixed
	app.config.globalProperties.$platform = platform
	app.config.globalProperties.$statusBarHeight = statusBarHeight

// 兼容写法, 否则真机可能会找不到pinia
	return {
		Pinia,
		app
	}
}

// #endif
