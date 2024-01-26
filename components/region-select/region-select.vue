<!--地区选择-->
<template>
  <!-- 弹出层：国家或地区选择 -->
  <view>
    <!-- 背景遮罩，点击关闭弹出层 -->
    <view class="popup-bg" @tap="getCountrieCode"></view>
    <!-- 弹出内容盒子 -->
    <view class="popup-box">
      <!-- 搜索框部分 -->
      <view class="search-title-box">
        <!-- 搜索图标 -->
        <image class="search-img" src="/components/region-select/img/search.png" mode="widthFix"/>
        <!-- 搜索输入框，输入时执行onInput方法进行国家或地区筛选 -->
        <input type="text" v-model="value" class="search-input" @input="onInput" placeholder="Enter search keywords">
      </view>
      <!-- 国家或地区列表 -->
      <view class="search-content">
        <!-- 循环显示国家或地区列表 -->
        <view class="search-list" v-for="(item, key, index) in countriesArray" :key="index" @tap="getCountrieCode(item)">
          <!-- 国家或地区名和国旗 -->
          <view class="search-list-left">
            <!-- 国旗 -->
            <view class="iti-flag" :class="[key]"/>
            <!-- 国家或地区名 -->
            <text class="search-list-text">{{ item['name'] }}</text>
          </view>
          <!-- 国家或地区电话区号 -->
          <text class="search-list-text">+{{item['dialCode']}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import '/components/region-select/region-select.css' // 导入样式
import countryList from '/components/region-select/region-select.js' // 导入国家列表数据

export default {
  // components: {
  //   policies
  // },
  data() {
    return {
      countriesArray: [], // 国家列表数组
      value: '', // 搜索框的值
    }
  },
  created() {
    this.countriesArray = countryList; // 初始化国家列表
    // 为每个国家添加搜索值，包括国家名和电话区号
    for (let item in countryList) {
      let searchval = countryList[item].name.toLowerCase() + "@" + countryList[item].dialCode;
      countryList[item].searchval = searchval;
    }
  },
  methods: {
    // 选择国家后的操作
    getCountrieCode(item) {
      this.$emit('getSelectCode', item) // 触发父组件事件，传递所选国家的信息
    },
    // 搜索框输入时的操作
    onInput() {
      // 根据输入的值筛选国家列表
      if(this.value) {
        let countriesArray = JSON.parse(JSON.stringify(countryList));
        this.countriesArray = {};
        for (const item in countriesArray) {
          if (countriesArray[item]['searchval'].indexOf(this.value) > -1) {
            this.countriesArray[item] = countriesArray[item]
          }
        }
      } else {
        this.countriesArray = countryList; // 如果输入框为空，则显示完整的国家列表
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// 弹出层样式
.popup-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.5);
  z-index: 9998;
}
// 内容盒子样式
.popup-box {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 9999;
  width: 88%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 10rpx;
  padding-bottom: 14rpx;
}
// 搜索框样式
.search-title-box {
  background-color: #f7f8fa;
  margin: 16rpx auto;
  width: 95%;
  height: 64rpx;
  padding: 0 10rpx;
  line-height: 64rpx;
  text-align: left;
  border-radius: 4rpx;
  display: flex;
  align-items: center;
  .search-img {
    width: 48rpx;
    margin-right: 5rpx;
  }
  .search-input {
    flex: 1;
    font-size: 26rpx;
  }
}
// 国家或地区列表样式
.search-content {
  height: 600rpx;
  overflow-y: scroll;
  .search-list {
    width: 95%;
    margin: 16rpx auto 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .iti-flag {
    margin-right: 6rpx;
  }
  .search-list-text {
    text-align: left;
  }
  .search-list-left {
    display: flex;
    align-items: center;
    width: 88%;
    overflow: hidden;
    .search-list-text{
      width: 88%;
    }
  }
}
</style>
