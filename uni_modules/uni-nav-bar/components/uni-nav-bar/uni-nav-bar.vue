<template>
	<view class="uni-navbar" :class="[{ 'uni-dark': dark, 'uni-nvue-fixed': fixed }, addClass]">
		<view class="uni-navbar__content"
			:class="{ 'uni-navbar--fixed': fixed, 'uni-navbar--shadow': shadow, 'uni-navbar--border': border }"
			:style="{ 'background-color': themeBgColor, 'border-bottom-color': themeColor }">
			<statusBars v-if="statusBar" />
			<view :style="{ color: themeColor, backgroundColor: themeBgColor, height: navbarHeight }"
				class="uni-navbar__header">
				<view @tap="onClickLeft" class="uni-navbar__header-btns uni-navbar__header-btns-left" v-if="showLeft">
					<!-- :style="{ width: leftIconWidth }" -->
					<slot name="left">
						<!-- <view class="uni-navbar__content_view" v-if="leftIcon.length > 0"> -->
						<view class="uni-navbar__content_view">
              <uni-icons type="back" size="26" color="#353946" ></uni-icons>
<!--							<image src="/static/images/jiantou_left_hei@2x.png" mode="widthFix" class="left-icon"></image>-->
						</view>
						<view :class="{ 'uni-navbar-btn-icon-left': !leftIcon.length > 0 }" class="uni-navbar-btn-text"
							v-if="leftText.length">
							<text :style="{ color: themeColor, fontSize: '12px' }">{{ leftText }}</text>
						</view>
					</slot>
				</view>

				<view class="uni-navbar__header-container">
					<slot>
						<view class="uni-navbar__header-container-inner" v-if="title.length>0">
							<text class="uni-nav-bar-text uni-ellipsis-1 uni-nav-title"
								:style="{color: themeColor }">{{ title }}</text>
						</view>

					</slot>
				</view>

				<view @click="onClickRight" class="uni-navbar__header-btns uni-navbar__header-btns-right" v-if="showRight">
					<slot name="right">

					</slot>
				</view>
				<!-- 				<view @click="onClickRight" class="uni-navbar__header-btns uni-navbar__header-btns-right"
					:style="{width:rightIconWidth}">
					<slot name="right">
						<view v-if="rightIcon.length">
							<uni-icons :color="themeColor" :type="rightIcon" size="22" />
						</view>
						<view class="uni-navbar-btn-text" v-if="rightText.length && !rightIcon.length">
							<text class="uni-nav-bar-right-text" :style="{ color: themeColor}">{{ rightText }}</text>
						</view>
					</slot>
				</view> -->
			</view>
		</view>
		<!-- #ifndef APP-NVUE -->
		<view class="uni-navbar__placeholder" v-if="fixed">
			<statusBars v-if="statusBar" />
			<view class="uni-navbar__placeholder-view" :style="{ height: navbarHeight }" />
		</view>
		<!-- #endif -->
	</view>

<!--	<view class="bar-height"></view>-->
<!--  <view :class="$platform === 'ios' ? 'bar-height-ios' : 'bar-height'"></view>-->
</template>
<script setup>
import { ref, useSlots  } from 'vue';
let slots = useSlots();
if (slots.right) {
} else {
}
</script>

<script>
import statusBars from "./uni-status-bar.vue";
import { goToLinks } from "/lib/utils";
const getVal = (val) => typeof val === 'number' ? val + 'px' : val;

/**
 *
 *
 * NavBar 自定义导航栏
 * @description 导航栏组件，主要用于头部导航
 * @tutorial https://ext.dcloud.net.cn/plugin?id=52
 * @property {Boolean} dark 开启黑暗模式
 * @property {String} title 标题文字
 * @property {String} leftText 左侧按钮文本
 * @property {String} rightText 右侧按钮文本
 * @property {String} leftIcon 左侧按钮图标（图标类型参考 [Icon 图标](http://ext.dcloud.net.cn/plugin?id=28) type 属性）
 * @property {String} rightIcon 右侧按钮图标（图标类型参考 [Icon 图标](http://ext.dcloud.net.cn/plugin?id=28) type 属性）
 * @property {String} color 图标和文字颜色
 * @property {String} backgroundColor 导航栏背景颜色
 * @property {Boolean} fixed = [true|false] 是否固定顶部
 * @property {Boolean} statusBar = [true|false] 是否包含状态栏
 * @property {Boolean} shadow = [true|false] 导航栏下是否有阴影
 * @property {Boolean} stat 是否开启统计标题上报
 * @event {Function} clickLeft 左侧按钮点击时触发
 * @event {Function} clickRight 右侧按钮点击时触发
 * @event {Function} clickTitle 中间标题点击时触发
 */
export default {
	name: "UniNavBar",
	components: {
    statusBars
	},
	emits: ['clickLeft', 'clickRight', 'clickTitle'],
	props: {
    clickLeftEvent: {
      type: Boolean,
      default: false
    },
		addClass: {
			type: String,
			default: ""
		},
		dark: {
			type: Boolean,
			default: false
		},
    showRight: {
      type: Boolean,
      default: true
    },
    showLeft: {
      type: Boolean,
      default: true
    },
		title: {
			type: String,
			default: ""
		},
		leftText: {
			type: String,
			default: ""
		},
		rightText: {
			type: String,
			default: ""
		},
		leftIcon: {
			type: String,
			default: ""
		},
		rightIcon: {
			type: String,
			default: ""
		},
		fixed: {
			type: [Boolean, String],
			default: false
		},
		color: {
			type: String,
			default: ""
		},
		backgroundColor: {
			type: String,
			default: ""
		},
		statusBar: {
			type: [Boolean, String],
			default: false
		},
		shadow: {
			type: [Boolean, String],
			default: false
		},
		border: {
			type: [Boolean, String],
			default: true
		},
		height: {
			type: [Number, String],
			default: 44
		},
		leftWidth: {
			type: [Number, String],
			default: 60
		},
		rightWidth: {
			type: [Number, String],
			default: 60
		},
		stat: {
			type: [Boolean, String],
			default: ''
		}
	},
	computed: {
		themeBgColor() {
			if (this.dark) {
				// 默认值
				if (this.backgroundColor) {
					return this.backgroundColor
				} else {
					return this.dark ? '#333' : '#FFF'
				}
			}
			return this.backgroundColor || '#FFF'
		},
		themeColor() {
			if (this.dark) {
				// 默认值
				if (this.color) {
					return this.color
				} else {
					return this.dark ? '#fff' : '#333'
				}
			}
			return this.color || '#333'
		},
		navbarHeight() {
			return getVal(this.height)
		},
		leftIconWidth() {
			return getVal(this.leftWidth)
		},
		rightIconWidth() {
			return getVal(this.rightWidth)
		}
	},
	mounted() {
    if (uni.report && this.stat && this.title !== '') {
			uni.report('title', this.title)
		}
	},
	methods: {
		onClickLeft() {
      if(this.clickLeftEvent) {
        this.$emit("clickLeft");
        return false
      }
      goToLinks({type: 'back'})
		},
		onClickRight() {
			this.$emit("clickRight");
		},
		onClickTitle() {
			this.$emit("clickTitle");
		}
	}
};
</script>

<style lang="scss" scoped>
$nav-height: 44px;

.uni-nvue-fixed {
	/* #ifdef APP-NVUE */
	position: sticky;
	/* #endif */
}

.uni-navbar {
	// box-sizing: border-box;
}

.uni-nav-bar-text {
	font-size: 30rpx;
}
.uni-nav-title{
	font-size: 32rpx;
	font-family: 'PingFang Medium';
  font-weight: bold;
	color: #303442;
}
.left-icon{
	  width: 30rpx;
	  height: 32rpx;
  }

.uni-nav-bar-right-text {
	font-size: 12px;
}

.uni-navbar__content {
	position: relative;
	// background-color: #fff;
	// box-sizing: border-box;
	background-color: transparent;
}

.uni-navbar__content_view {
	// box-sizing: border-box;
}

.uni-navbar-btn-text {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	line-height: 12px;
}

.uni-navbar__header {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	padding: 0 10px;
  flex: 1;
	flex-direction: row;
	justify-content: space-between;
	height: $nav-height;
	font-size: 12px;
}

.uni-navbar__header-btns {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-wrap: nowrap;
	flex-direction: row;
	// width: 120rpx;
	// padding: 0 6px;
	justify-content: center;
	align-items: center;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

.uni-navbar__header-btns-left {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	width: 10%;
	justify-content: flex-start;
	align-items: center;
}

.uni-navbar__header-btns-right {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	min-width: 5%;
	justify-content: flex-end;
	align-items: center;
}

.uni-navbar__header-container {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	 flex: 1;
	overflow: hidden;
	text-align: center;
  justify-content: center;
}

.uni-navbar__header-container-inner {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	overflow: hidden;
	// box-sizing: border-box;
}


.uni-navbar__placeholder-view {
	height: $nav-height;
}

.uni-navbar--fixed {
	position: fixed;
	z-index: 998;
  top: 0;
	/* #ifdef H5 */
	left: var(--window-left);
	right: var(--window-right);
	/* #endif */
	/* #ifndef H5 */
	left: 0;
	right: 0;
	/* #endif */
  transform: translateZ(0);
}

.uni-navbar--shadow {
	box-shadow: 0 1px 6px #ccc;
}

.uni-navbar--border {
	border-bottom-width: 1rpx;
	border-bottom-style: solid;
	border-bottom-color: #eee;
}

.uni-ellipsis-1 {
	overflow: hidden;
	/* #ifndef APP-NVUE */
	white-space: nowrap;
	text-overflow: ellipsis;
	/* #endif */
	/* #ifdef APP-NVUE */
	lines: 1;
	text-overflow: ellipsis;
	/* #endif */
}

// 暗主题配置
.uni-dark {}
</style>
