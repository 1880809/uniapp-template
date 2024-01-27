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
	let windowWidth = uni.getSystemInfoSync().windowWidth
	let windowHeight = uni.getSystemInfoSync().windowHeight

	// 在js中使用
	uni.jdPlatform = platform
	uni.jdStatusBarHeight = statusBarHeight
	uni.jdWindowWidth = windowWidth
	uni.jdWindowHeight = windowHeight
	uni.jdToFixed = truncateToFixed

	// 在html直接使用 也可以在js中使用 NVUE不支持
	app.config.globalProperties.jdPlatform = platform
	app.config.globalProperties.jdStatusBarHeight = statusBarHeight
	app.config.globalProperties.$jdWindowWidth = windowWidth
	app.config.globalProperties.$jdWindowHeight = windowHeight
	app.config.globalProperties.jdToFixed = truncateToFixed

	// #ifdef APP-PLUS
	// #endif
// 兼容写法, 否则真机可能会找不到pinia
	return {
		Pinia,
		app
	}
}

// #endif
