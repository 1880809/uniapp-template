// import {sendUpdataUrl} from "/http";

const Storage = {
    /**
     * 设置缓存
     * @param {string} key - 键
     * @param {any} value - 值
     * @param {string} expire - 过期时间 (秒)，不设置表示永久
     * Storage.set('storage_key', 'hello', 60)
     */
    set: function (key, value, expire = '') {
        let obj = {
            value: value,
            timestamp: new Date().getTime()
        };
        if (expire) {
            obj.expire = expire * 1000; // 转换成毫秒
        }
        uni.setStorageSync(key, JSON.stringify(obj));
    },

    /**
     * 获取缓存
     * @param {string} key - 键
     * @return {any} - 返回值
     */
    get: function (key) {
        let value = uni.getStorageSync(key);
        if (!value) {
            return null;
        }
        let obj = JSON.parse(value);
        if (obj.expire) {
            if (new Date().getTime() - obj.timestamp > obj.expire) {
                this.remove(key);
                return null;
            }
        }
        return obj.value;
    },

    /**
     * 删除缓存
     * @param {string} key - 键
     */
    remove: function (key) {
        uni.removeStorageSync(key);
    }
};



// 判断字符串是否包含数字
function containsNumber(str) {
    return /\d/.test(str);
}
// 检查字符串中是否含有字母
function containsLetter(str) {
    return /[a-zA-Z]/.test(str);
}

/**
 * 跳转到指定的链接或页面。
 * @param {string|Object} datas - 要跳转的URL或包含跳转信息的对象。
 * - 如果是字符串，则表示直接跳转URL。
 * - 如果是对象，可以包含以下属性：
 *   - url: 要跳转的URL。
 *   - type: 跳转类型（如"redirectTo"、"reLaunch"、"tab"、"back"）, 无值则跳转默认配置。
 *   - navigateBackDelta: 如果type为"back"，表示返回的页面数。
 */
// 测试 goToLinks('/pages/message/messageSystem')"

function goToLinks(datas) {
    let url;
    let type;
    let navigateBackDelta;

    if (typeof datas === 'string') {
        url = datas;
    } else {
        url = datas.url;
        type = datas.type;
        navigateBackDelta = datas.navigateBackDelta || 1;
    }

    switch (type) {
        case 'redirectTo':
            // 关闭当前页面，跳转到应用内的某个页面
            uni.redirectTo({ url });
            break;
        case 'reLaunch':
            // 关闭所有页面，打开到应用内的某个页面。
            uni.reLaunch({ url });
            break;
        case 'tab':
            // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
            uni.switchTab({ url });
            break;
        case 'back':
            let back = getCurrentPages();
            if (back && back.length > 1) {
                uni.navigateBack({
                    delta: navigateBackDelta || 1
                });
            } else {
                // #ifdef H5
                history.back()
                // #endif
            }
            break;
        default:
            // 保留当前页面，跳转到应用内的某个页面
            uni.navigateTo({ url });
    }
}

/**
 * 时间格式转换
 * @param {string|number} timeValue - 时间字符串或时间戳
 * 参数可以为 秒时间戳, 毫秒时间戳, 2023-02-23 11:23:20.123, 2023/02/23 11:23, 2023-02-23 11:23
 * @param {string} format - 返回的时间格式
 * @returns {string} 转换后的时间字符串
 * @throws {Error} 当传入的时间格式不符合预期时抛出错误
 */
function timeConverter(timeValue, format) {
    let date;
    if (typeof timeValue === 'string' && timeValue.includes('T')) {
        // 将 ISO 8601 格式的时间字符串转换成符合规范的时间字符串
        const ISODate = new Date(timeValue);
        const formattedISODate = ISODate.toISOString().split('.')[0].replace('T', ' ');
        date = new Date(formattedISODate);
    } else if (typeof timeValue === 'number') {
        if (String(timeValue).length === 10) timeValue *= 1000; // 秒时间戳转毫秒
        date = new Date(timeValue);
    } else if (typeof timeValue === 'string') {
        date = new Date(timeValue.replace(/-/g, '/')); // 兼容Safari
    } else {
        throw new Error('Invalid timeValue');
    }

    // 计算时区偏移并转换为北京时间（UTC+8）
    const time_zone = -date.getTimezoneOffset() / 60;
    let beijingTime;
    if (time_zone < 0) {
        beijingTime = new Date(date.getTime() + (Math.abs(time_zone) + 8) * 60 * 60 * 1000);
    } else {
        beijingTime = new Date(date.getTime() - (time_zone - 8) * 60 * 60 * 1000);
    }

    let year = beijingTime.getFullYear();
    let month = (beijingTime.getMonth() + 1).toString().padStart(2, '0');
    let day = beijingTime.getDate().toString().padStart(2, '0');
    let hour = beijingTime.getHours().toString().padStart(2, '0');
    let minute = beijingTime.getMinutes().toString().padStart(2, '0');

    switch (format) {
        case 'YYYY-MM-DD HH:mm':
            return `${year}-${month}-${day} ${hour}:${minute}`;
        case 'YYYY/MM/DD HH:mm':
            return `${year}/${month}/${day} ${hour}:${minute}`;
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
        case 'YYYY-MM':
            return `${year}-${month}`;
        case 'MM-DD':
            return `${month}-${day}`;
        case 'HH:mm':
            return `${hour}:${minute}`;
        case 'MM-DD HH:mm':
            return `${month}-${day} ${hour}:${minute}`;
        default:
            return `${year}-${month}-${day} ${hour}:${minute}`;
    }
}

/**
 * 获取当前设备平台
 */
function getPlatform() {
    const platform = uni.getSystemInfoSync().platform;
    switch (platform) {
        case 'android':
            return 'android'
        case 'ios':
            return 'ios'
        case 'devtools':
            return 'development Tool'
        case 'web':
            return 'h5'
        case 'windows':
            return 'h5'
        default:
            return 'Unknown Platform'
    }
}

/**
 *  复制
 */
function copyText(text) {
    let content = text //需要复制的内容
    uni.setClipboardData({
        data: content,
        success: function () {
            uni.showToast({
                title: '复制成功',
                icon: 'none'
            })
        },
        fail: function () {
            uni.showToast({
                title: '复制失败',
                icon: 'none'
            })
        }
    })
}

/**
* 打开外部链接
*/
function goOpenUrl(url) {
    if (!url) return false
    // #ifdef H5
    let wind = window.open('')
    wind.location.replace(url)
    // #endif
    // #ifdef APP
    plus.runtime.openURL(url);
    // #endif
}


// 长按方法
function useLongPress(callback, delay = 1000) {
    let timer = null;
    let isLongPress = false;

    const start = (param) => {
        timer = setTimeout(() => {
            isLongPress = true;
            callback(param); // 调用传入的回调函数
        }, delay);
    };
    const stop = () => {
        clearTimeout(timer);
        if (isLongPress) {
            isLongPress = false;
        }
    };
    return { start, stop };
}

// 模仿toFixed方法, 但不四舍五入
/**
 * 截断数字到指定的小数位数。
 * @param {number} num - 需要被处理的数字。
 * @param {number} [precision=2] - 要保留的小数位数，默认为 8。
 * @param round 是否四舍五入
 * @param {boolean} [alwaysFixed=false] - 是否总是固定显示小数点后 precision 位数。如果为 true，不足的部分会用零补齐。
 * @returns {string} - 处理后的数字字符串。
 * @throws {Error} - 如果输入的不是一个有效的数字。
 */
function truncateToFixed(num, precision = 8,  round = false, alwaysFixed = false) {
    if (isNaN(parseFloat(num)) || !isFinite(num)) {
        throw new Error("传入的不正确.");
    }

    let result;

    if (round) {
        // 使用四舍五入
        result = num.toFixed(precision);
    } else {
        // 不使用四舍五入，原始逻辑
        result = num.toString();
        let decimalPointIndex = result.indexOf('.');

        if (decimalPointIndex === -1) {
            // 如果没有小数点
            if (alwaysFixed) {
                result += '.' + '0'.repeat(precision);
            }
        } else {
            // 有小数点
            const endPosition = decimalPointIndex + 1 + precision;
            result = result.slice(0, Math.min(endPosition, result.length));
        }
    }

    if (alwaysFixed) {
        let decimalPointIndex = result.indexOf('.');
        while ((result.length - decimalPointIndex - 1) < precision) {
            result += '0';
        }
    }

    return result;
}



// 图片上传
async function afterReads(event, fileList, callback) {
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    let lists = [].concat(event.file);
    let fileListLen = fileList.length;
    lists.map((item) => {
        fileList.push({...item, status: 'uploading', message: '上传中',});
    });
    for (let i = 0; i < lists.length; i++) {
        const {code, data} = await sendUpdataUrl(lists[i].url);
        let item = fileList[fileListLen];
        if(code === 1000) {
            callback(data.path)
            // let item = fileList[fileListLen];
            fileList.splice(fileListLen, 1, {...item, status: 'success', message: '', url: data.path,});
            // fileListLen++;
        } else {
            fileList.splice(fileListLen, 1, {...item, status: 'failed', message: '上传失败',});
        }
        fileListLen++;
    }
}

// 精度
function numberAccuracy(num) {
    let result = String(num);
    if (result.indexOf('-') >= 0) {
        result =  '0' + String(Number(result) + 1).substr(1);
    }
    return result
}

export {
    containsNumber,
    containsLetter,
    goToLinks,
    timeConverter,
    Storage,
    getPlatform,
    copyText,
    goOpenUrl,
    useLongPress,
    truncateToFixed,
    afterReads,
    numberAccuracy,
};
