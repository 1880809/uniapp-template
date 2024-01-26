<template>
	<view>
	<scroll-view class="scrollList" scroll-y :scroll-into-view="scrollViewId">

    <view class="flex-row justify-around items-center search">
      <uni-easyinput prefixIcon="search" trim="all" maxlength="18" placeholder="请输入银行名字" v-model="searchVal" @input="inputChange" placeholderStyle="font-size:28rpx;" :inputBorder="false" :trim="true" primaryColor="#333333" :styles="{backgroundColor: 'transparent', fontSize: '30px'}"></uni-easyinput>
    </view>
    <!--    搜索列表-->
    <view class="con" v-if="searchVal">
      <view class="list" v-for="item in searchList" :key="item.value" @tap="selectBank(item)">
        <image :src="'/static/img/bank-img/'+item.value+'.jpg'" mode="aspectFill" :lazy-load="true"></image>
        <text>{{item.text}}</text>
      </view>

      <view class="no-data" v-if="searchList.length === 0 && searchNodata">没有相关银行的信息</view>
    </view>

    <block v-else>
      <view class="letter">热门银行</view>
      <view class="con">
        <view class="list" v-for="item in bankHot" :key="item.value" @tap="selectBank(item)">
          <image :src="'/static/img/bank-img/'+item.value+'.jpg'" mode="aspectFill" :lazy-load="true"></image>
          <text>{{item.text}}</text>
        </view>
      </view>
      <block v-for="item in BankList" :key="item.letter">
        <view class="letter" :id="item.letter">{{item.letter}}</view>
        <view class="con">
          <view class="list" v-for="(item, index) in item.data" :key="item.value" @tap="selectBank(item)">
            <image :src="'/static/img/bank-img/'+item.value+'.jpg'" mode="aspectFill" :lazy-load="true"></image>
            <text>{{item.text}}</text>
          </view>
        </view>
      </block>

      <view class="uni-indexed-list-bar" :class="touchmove ? 'active' : ''" @tap.stop.prevent="letterSelect">
        <text v-for="(list, key) in BankList" :key="key" class="uni-indexed-list-text"
              :class="touchmoveIndex == key ? 'active' : ''">{{ list.letter }}</text>
      </view>
      <view class="uni-indexed-list-alert" v-if="touchmove">
        {{ BankList[touchmoveIndex].letter }}
      </view>
    </block>
  </scroll-view>
	</view>
</template>
<script>
	import {goToLinks} from "/lib/utils";

  export default {
		data() {
			return {
				touchmove: false,
				touchmoveIndex: -1,
				itemHeight: 0,
				scrollViewId: '',
				bankHot: [ //热门银行
					{
						value: 'ICBC',
						text: '中国工商银行'
					},
					{
						value: 'CMB',
						text: '招商银行'
					},
					{
						value: 'ABC',
						text: '中国农业银行'
					},
					{
						value: 'CEB',
						text: '中国光大银行'
					},
					{
						value: 'CITIC',
						text: '中信银行'
					},
					{
						value: 'SPDB',
						text: '浦发银行'
					},
					{
						value: 'GDB',
						text: '广发银行'
					},
					{
						value: 'HXBANK',
						text: '华夏银行'
					},
					{
						value: 'CCB',
						text: '中国建设银行'
					},
					{
						value: 'COMM',
						text: '交通银行'
					},
					{
						value: 'BOC',
						text: '中国银行'
					},
					{
						value: 'CMBC',
						text: '中国民生银行'
					},
					{
						value: 'CIB',
						text: '兴业银行'
					},
					{
						value: 'SPABANK',
						text: '平安银行'
					},
				],
				BankList: [],

        // 搜索
        searchVal: '',
        searchNodata: false,
        searchTimer: false,
        searchList: [],
			}
		},
		onLoad() {
			this.getBank();
		},
		onReady() {
			uni.getSystemInfo({
				success: res => {
					let info = uni.createSelectorQuery().select('.uni-indexed-list-bar')
					info.boundingClientRect(data => {
							let winHeight = data.height //元素在屏幕上的高度
							this.itemHeight = winHeight / this.BankList.length
						})
						.exec()
				},
			})
		},
		methods: {
      inputChange(e){
        clearTimeout(this.searchTimer)
        this.searchVal = e
        this.searchNodata = false
        this.searchList = []
        this.searchTimer = setTimeout(() => {
          this.searchNodata = true
          for (const item of this.BankList) {
            for (const itemc of item.data) {
              if (itemc.text.indexOf(e) > -1) {
                this.searchList.push(itemc)
              }
            }
          }
        }, 50)
      },
			selectBank(data) {
        goToLinks({type: 'back'})
        uni.$emit('bankList', data.text);
        // 使用的地方
        // onShow(() => {
        //   uni.$once('bankList', (data) => {
        //     params.value.bank_name = data
        //   })
        // })
				// console.log(`选择的银行:${JSON.stringify(data)}`);
			},
			letterSelect(e) {
				if (this.touchmove) return
				this.touchmove = true
				let pageY = e.target.offsetTop
				let index = Math.round(pageY / this.itemHeight)
				let item = this.BankList[index]
				if (item) {
					this.scrollViewId = item.letter
					this.touchmoveIndex = index
				}
				setTimeout(() => {
					this.touchmove = false
					this.touchmoveIndex = -1
				}, 500)
			},
			getBank() { //银行列表
				let list = [
            {
						letter: 'A',
						data: [{
								value: 'AYCB',
								text: '安阳银行'
							},
							{
								value: 'ARCU',
								text: '安徽省农村信用社'
							},
							{
								value: 'ASCB',
								text: '鞍山银行'
							},
						],
					},
					{
						letter: 'B',
						data: [{
								value: 'BSB',
								text: '包商银行'
							},
							{
								value: 'BJBANK',
								text: '北京银行'
							},
							{
								value: 'BJRCB',
								text: '北京农商银行'
							},
							{
								value: 'BOHAIB',
								text: '渤海银行'
							},
						],
					},
					{
						letter: 'C',
						data: [{
								value: 'CBBQS',
								text: '城市商业银行资金清算中心'
							},
							{
								value: 'CSCB',
								text: '长沙银行'
							},
							{
								value: 'BOCY',
								text: '朝阳银行'
							},
							{
								value: 'CDRCB',
								text: '成都农商银行'
							},
							{
								value: 'BOCD',
								text: '承德银行'
							},
							{
								value: 'CDCB',
								text: '成都银行'
							},
							{
								value: 'CZCCB',
								text: '沧州银行'
							},
							{
								value: 'CQBANK',
								text: '重庆银行'
							},
							{
								value: 'CRCBANK',
								text: '重庆农村商业银行'
							},
							{
								value: 'CCQTGB',
								text: '重庆三峡银行'
							},
							{
								value: 'CSRCB',
								text: '常熟农村商业银行'
							},
							{
								// value: 'CZRCB',
								value: 'GDRCC',
								text: '常州农村信用联社'
							},
						],
					},
					{
						letter: 'D',
						data: [{
								value: 'DLB',
								text: '大连银行'
							},
							{
								value: 'DZBANK',
								text: '德州银行'
							},
							{
								value: 'DRCBCL',
								text: '东莞农村商业银行'
							},
							{
								value: 'HKBEA',
								text: '东亚银行'
							},
							{
								value: 'BOD',
								text: '东莞银行'
							},
							{
								value: 'DYCCB',
								text: '东营市商业银行'
							},
							{
								value: 'DYCB',
								text: '德阳商业银行'
							},
							{
								value: 'BODD',
								text: '丹东银行'
							},
						]
					},
					{
						letter: 'E',
						data: [{
							value: 'ORBANK',
							text: '鄂尔多斯银行'
						}]
					},
          {
            letter: 'F',
            data: [{
              value: 'FJHXBC',
              text: '福建海峡银行'
            },
              {
                value: 'FSCB',
                text: '抚顺银行'
              },
              {
                value: 'FXCB',
                text: '阜新银行'
              },
              {
                value: 'FDB',
                text: '富滇银行'
              },
            ]
          },
          {
            letter: 'G',
            data: [{
              value: 'CDB',
              text: '国家开发银行'
            },
              {
                value: 'GDB',
                text: '广发银行'
              },
              {
                value: 'GYCB',
                text: '贵阳市商业银行'
              },
              {
                value: 'GDRCC',
                text: '广东省农村信用社联合社'
              },
              {
                value: 'GCB',
                text: '广州银行'
              },
              {
                value: 'GLBANK',
                text: '桂林银行'
              },
              {
                value: 'GZRCU',
                text: '贵州省农村信用社'
              },
              {
                value: 'GZB',
                text: '赣州银行'
              },
              {
                value: 'BGB',
                text: '广西北部湾银行'
              },
              {
                value: 'GRCB',
                text: '广州农商银行'
              },
              {
                value: 'GSRCU',
                text: '甘肃省农村信用'
              },
              {
                value: 'GXRCU',
                text: '广西省农村信用'
              },
              {
                value: 'NYNB',
                text: '广东南粤银行'
              },
            ]
          },
          {
            letter: 'H',
            data: [{
              value: 'HXBANK',
              text: '华夏银行'
            },
              {
                value: 'EGBANK',
                text: '恒丰银行'
              },
              {
                value: 'HSBC',
                text: '汇丰银行'
              },
              {
                value: 'HSBL',
                text: '恒生银行'
              },
              {
                value: 'HZCB',
                text: '杭州银行'
              },
              {
                value: 'HRBCB',
                text: '哈尔滨银行'
              },
              {
                value: 'CITIBANK',
                text: '花旗银行'
              },
              {
                value: 'HLDBK',
                text: '葫芦岛银行'
              },
              {
                value: 'HNRCU',
                text: '河南省农村信用'
              },
              {
                value: 'HKB',
                text: '汉口银行'
              },
              {
                value: 'HZCCB',
                text: '湖州市商业银行'
              },
              {
                value: 'BHB',
                text: '河北银行'
              },
              {
                value: 'HRXJB',
                text: '华融湘江银行'
              },
              {
                value: 'HBRCU',
                text: '河北省农村信用社'
              },
              {
                // value: 'HBHSBANK',
                value: 'HBC',
                text: '湖北银行黄石分行'
              },
              {
                // value: 'HBYCBANK',
                value: 'HBC',
                text: '湖北银行宜昌分行'
              },
              {
                value: 'HDBANK',
                text: '邯郸银行'
              },
              {
                value: 'HSBK',
                text: '衡水银行'
              },
              {
                value: 'HBC',
                text: '湖北银行'
              },
              {
                value: 'HURCB',
                text: '湖北省农村信用社'
              },
              {
                value: 'HNRCC',
                text: '湖南省农村信用社'
              },
            ]
          },
          {
            letter: 'J',
            data: [{
              value: 'COMM',
              text: '交通银行'
            },
              {
                value: 'JSBANK',
                text: '江苏银行'
              },
              {
                value: 'JXBANK',
                text: '嘉兴银行'
              },
              {
                value: 'JINCHB',
                text: '晋城银行'
              },
              {
                value: 'JSRCU',
                text: '江苏省农村信用联合社'
              },
              {
                value: 'JZBANK',
                text: '晋中市商业银行'
              },
              {
                value: 'JLBANK',
                text: '吉林银行'
              },
              {
                value: 'JSB',
                text: '晋商银行'
              },
              {
                value: 'JLRCU',
                text: '吉林农信'
              },
              {
                value: 'TCRCB',
                text: '江苏太仓农村商业银行'
              },
              {
                value: 'JRCB',
                text: '江苏江阴农村商业银行'
              },
              {
                value: 'BOJZ',
                text: '锦州银行'
              },
              {
                value: 'JJBANK',
                text: '九江银行'
              },
              {
                value: 'JXRCU',
                text: '江西省农村信用'
              },
              {
                value: 'JNBANK',
                text: '济宁银行'
              },
              {
                value: 'JHBANK',
                text: '金华银行'
              },
            ]
          },
          {
            letter: 'K',
            data: [{
              value: 'KLB',
              text: '昆仑银行'
            },
              {
                value: 'KORLABANK',
                text: '库尔勒市商业银行'
              },
              {
                value: 'KSRB',
                text: '昆山农村商业银行'
              },
              {
                value: 'CBKF',
                text: '开封市商业银行'
              },
            ]
          },
          {
            letter: 'L',
            data: [{
              value: 'DAQINGB',
              text: '龙江银行'
            },
              {
                value: 'LYCB',
                text: '辽阳市商业银行'
              },
              {
                value: 'LANGFB',
                text: '廊坊银行'
              },
              {
                value: 'LSBANK',
                text: '莱商银行'
              },
              {
                value: 'LSCCB',
                text: '乐山市商业银行'
              },
              {
                value: 'LSBC',
                text: '临商银行'
              },
              {
                value: 'LZYH',
                text: '兰州银行'
              },
              {
                value: 'LYBANK',
                text: '洛阳银行'
              },
            ]
          },
          {
            letter: 'N',
            data: [{
              value: 'NBBANK',
              text: '宁波银行'
            },
              {
                value: 'NJCB',
                text: '南京银行'
              },
              {
                value: 'NCB',
                text: '南昌银行'
              },
              {
                value: 'NHB',
                text: '南海农村信用联社'
              },
              {
                value: 'NXBANK',
                text: '宁夏银行'
              },
              {
                value: 'NXRCU',
                text: '宁夏黄河农村商业银行'
              },
              {
                value: 'H3CB',
                text: '内蒙古银行'
              },
              {
                value: 'CGNB',
                text: '南充市商业银行'
              },
              {
                value: 'NHQS',
                text: '农信银清算中心'
              },
            ]
          },
          {
            letter: 'P',
            data: [{
              value: 'SPDB',
              text: '浦发银行'
            },
              {
                value: 'SPABANK',
                text: '平安银行'
              },
              {
                value: 'BOP',
                text: '平顶山银行'
              },
            ]
          },
          {
            letter: 'Q',
            data: [{
              value: 'QDCCB',
              text: '青岛银行'
            },
              {
                value: 'ZBCB',
                text: '齐商银行'
              },
              {
                value: 'QLBANK',
                text: '齐鲁银行'
              },
              {
                value: 'BOQH',
                text: '青海银行'
              },
            ]
          },
          {
            letter: 'S',
            data: [{
              value: 'SHRCB',
              text: '上海农村商业银行'
            },
              {
                value: 'SHBANK',
                text: '上海银行'
              },
              {
                value: 'SXCB',
                text: '绍兴银行'
              },
              {
                value: 'SDEB',
                text: '顺德农商银行'
              },
              {
                value: 'BOSZ',
                text: '苏州银行'
              },
              {
                value: 'SJBANK',
                text: '盛京银行'
              },
              {
                value: 'SRCB',
                text: '深圳农村商业银行'
              },
              {
                value: 'SCCB',
                text: '三门峡银行'
              },
              {
                value: 'SDRCU',
                text: '山东农信'
              },
              {
                value: 'SRBANK',
                text: '上饶银行'
              },
              {
                value: 'SCRCU',
                text: '四川省农村信用'
              },
              {
                value: 'SXRCCU',
                text: '陕西信合'
              },
              {
                value: 'SZSBK',
                text: '石嘴山银行'
              },
            ]
          },
          {
            letter: 'T',
            data: [{
              value: 'TZCB',
              text: '台州银行'
            },
              {
                value: 'TCCB',
                text: '天津银行'
              },
              {
                value: 'TACCB',
                text: '泰安市商业银行'
              },
              {
                value: 'TRCB',
                text: '天津农商银行'
              },
            ]
          },
          {
            letter: 'W',
            data: [{
              value: 'HSBANK',
              text: '徽商银行'
            },
              {
                value: 'WZCB',
                text: '温州银行'
              },
              {
                value: 'WJRCB',
                text: '吴江农商银行'
              },
              {
                value: 'BANKWF',
                text: '潍坊银行'
              },
              {
                value: 'URMQCCB',
                text: '乌鲁木齐市商业银行'
              },
              {
                value: 'WRCB',
                text: '无锡农村商业银行'
              },
              {
                value: 'WHRCB',
                text: '武汉农村商业银行'
              },
              {
                value: 'WHCCB',
                text: '威海市商业银行'
              },
            ]
          },
          {
            letter: 'X',
            data: [{
              value: 'CIB',
              text: '兴业银行'
            },
              {
                value: 'XABANK',
                text: '西安银行'
              },
              {
                value: 'XXBANK',
                text: '新乡银行'
              },
              {
                value: 'XYBANK',
                text: '信阳银行'
              },
              {
                value: 'XCYH',
                text: '许昌银行'
              },
              {
                value: 'XTB',
                text: '邢台银行'
              },
            ]
          },
          {
            letter: 'Y',
            data: [{
              value: 'YXCCB',
              text: '玉溪市商业银行'
            },
              {
                value: 'NBYZ',
                text: '鄞州银行'
              },
              {
                value: 'YNRCC',
                text: '云南省农村信用社'
              },
              {
                value: 'YQCCB',
                text: '阳泉银行'
              },
              {
                value: 'BOYK',
                text: '营口银行'
              },
              {
                value: 'YBCCB',
                text: '宜宾市商业银行'
              },
              {
                value: 'YDRCB',
                text: '尧都农商行'
              },
            ]
          },
          {
            letter: 'Z',
            data: [{
              value: 'ICBC',
              text: '中国工商银行'
            },
              {
                value: 'ABC',
                text: '中国农业银行'
              },
              {
                value: 'BOC',
                text: '中国银行'
              },
              {
                value: 'CCB',
                text: '中国建设银行'
              },
              {
                value: 'PSBC',
                text: '中国邮政储蓄银行'
              },
              {
                value: 'CMB',
                text: '招商银行'
              },
              {
                value: 'CMBC',
                text: '中国民生银行'
              },
              {
                value: 'ZYCBANK',
                text: '遵义市商业银行'
              },
              {
                value: 'ZJTLCB',
                text: '浙江泰隆商业银行'
              },
              {
                value: 'SCNAMK',
                text: '渣打银行'
              },
              {
                value: 'MTBANK',
                text: '浙江民泰商业银行'
              },
              {
                value: 'CZCB',
                text: '浙江稠州商业银行'
              },
              {
                value: 'ZRCBANK',
                text: '张家港农村商业银行'
              },
              {
                value: 'ZGCCB',
                text: '自贡市商业银行'
              },
              {
                value: 'ZJNX',
                text: '浙江省农村信用社联合社'
              },
              {
                value: 'BZMD',
                text: '驻马店银行'
              },
              {
                value: 'XLBANK',
                text: '中山小榄村镇银行'
              },
              {
                value: 'ZZBANK',
                text: '郑州银行'
              },
              {
                value: 'ZJKCCB',
                text: '张家口市商业银行'
              },
              {
                value: 'BOZK',
                text: '周口银行'
              },
              {
                value: 'CITIC',
                text: '中信银行'
              },
              {
                value: 'CEB',
                text: '中国光大银行'
              },
              {
                value: 'CZBANK',
                text: '浙商银行'
              },
            ]
          },
				];
				this.BankList = list;

			},
		}
	}
</script>


<style lang="scss" scoped>
	.scrollList {
		//background: #F6F9FC;
		background: #ffffff;
    height:100vh;
    /* #ifdef H5 */
    height: calc(100vh - 44px + env(safe-area-inset-top)) ;
    /* #endif */
    overflow: hidden;
	
		.letter {
			height: 64rpx;
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			font-size: 24rpx;
			color: #222222;
		}
	
		.con {
			.list {
				background-color: #fff;
				display: flex;
				align-items: center;
				height: 122rpx;
				padding: 0 30rpx;
				border-bottom: 1px solid #F3F3F3;
	
				image {
					width: 48rpx;
					height: 48rpx;
				}
	
				text {
					color: #222222;
					font-size: 30rpx;
					margin-left: 30rpx;
				}
			}
		}
	}
	
	.uni-indexed-list-bar {
		display: flex;
		flex-direction: column;
		position: fixed;
		width: 40rpx;
		right: 14rpx;
		z-index: 10;
		//bottom: 76rpx;
    top: 50%;
    transform: translateY(-50%);
	}
	
	.uni-indexed-list-text {
		color: #A3A2B1;
		font-size: 22rpx;
		text-align: center;
		height: 36rpx;
	}
	
	.uni-indexed-list-text.active,
	.uni-indexed-list-bar.active .uni-indexed-list-text.active {
		color: #222222;
		font-size: 26rpx;
	}
	
	.uni-indexed-list-alert {
		position: absolute;
		z-index: 20;
		width: 160rpx;
		height: 160rpx;
		left: 50%;
		top: 50%;
		margin-left: -80rpx;
		margin-top: -80rpx;
		border-radius: 80rpx;
		text-align: center;
		line-height: 160rpx;
		font-size: 70rpx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
	}

  .search{
    width: 630rpx;
    padding:0 10rpx;
    margin: 20rpx auto;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 40rpx;
    background: #F4F5F7;
    .input{

    }
    .icon{
      width: 40rpx;
    }
    :deep .uni-input-input{
      font-size: 30rpx;
    }
  }

  .no-data{
    padding-top: 200rpx;
    font-size: 30rpx;
    display: block;
    text-align: center;
  }
</style>
