// request.js
import { getPlatform, Storage, goToLinks } from "/lib/utils";
import {useApp, useUserStore} from "/store";

// 使用的地方
// async function getData() {
//     let { data, code } = await getData()
//     if(data && code === 1000) {
//
//     }
// }

// 基础URL，所有请求的前缀
// let BASE_URL = '/api'
export const BASE_URL = 'https://sc.sosovp.com'
export const IMG_URL = 'https://www.jdukk.com'



// if(process.env.NODE_ENV === 'development') {
//     BASE_URL = ''
// } else {
//
// }
// 请求超时时间，单位毫秒
const REQUEST_TIMEOUT = 600000;

// 用于存储待处理的请求（处理重复请求和取消请求）
let pendingRequests = {};
// 接口提示错误时候  不需要弹出的toast的code
let jumpOverToast = []
/**
 * 获取token的方法
 * 例如，从本地存储或vuex中获取
 */

/**
 * 移除待处理的请求
 * 主要用于处理重复的请求和取消请求
 * @param {Object} config - 请求配置
 */
// 如发起了一个GET请求
// request.get("/api/data");
// 随后决定取消这个请求
// removePendingRequest({ method: "GET", url: "/api/data" });

function removePendingRequest(config) {
    const requestIdentifier = `${config.method}${config.url}`;
    if (pendingRequests[requestIdentifier]) {
        const { task } = pendingRequests[requestIdentifier];
        task.abort();  // 使用 requestTask 的 abort 方法来取消请求
        delete pendingRequests[requestIdentifier];
    }
}
/**
 * 全局请求拦截器
 * 可以用于修改请求配置，如添加请求头等
 * @param {Object} config - 请求配置
 * @return {Object} - 返回修改后的请求配置
 */
function requestInterceptor(config) {
    // config.header.Authorization = "Bearer " + getToken();

    config.header["Authorization"] = "Bearer " + Storage.get('token')

    if(!config.header['Content-Type']) {
        config.header['Content-Type'] = 'application/json'
        // config.header['Content-Type'] = 'application/x-www-form-urlencoded'
    }


    return config;
}

/**
 * 全局响应拦截器
 * 可以用于处理特定的响应，如根据状态码进行重定向等
 * @param {Object} response - 响应对象
 * @return {Object} - 返回处理后的响应对象
 */
function responseInterceptor(response) {
    if (response.data.code === 401) {
        useUserStore().LOGOUT()
    }
    return response;
}

export default {
    /**
     * 封装的网络请求方法
     * @param {Object} options - 请求选项
     * @return {Promise} - 返回一个Promise对象
     */
    request(options) {
        // 显示加载提示
        //    console.log(loading);
        // loading.show();
        if (options['data']['loading']) {
            uni.showLoading();
        }
        return new Promise((resolve, reject) => {
            const finalOptions = {
                ...options,
                url: BASE_URL + options.url,
                timeout: REQUEST_TIMEOUT,
                header: {
                    ...options.header
                }
            };

            // 使用请求拦截器
            const interceptedOptions = requestInterceptor(finalOptions);

            // 取消重复的请求
            removePendingRequest(interceptedOptions);
            const requestTask = uni.request({
                ...interceptedOptions,
                success: (response) => {
                    const interceptedResponse = responseInterceptor(response);

                    if (interceptedResponse.data && !Array.isArray(interceptedResponse.data) && interceptedResponse.data.code && interceptedResponse.data.code === 1000) {

                        resolve(interceptedResponse.data);
                    } else if(!jumpOverToast.includes(interceptedResponse.data.code)) {
                        // 排除验证码的ArrayBuffer格式
                        if (!(interceptedResponse.data instanceof ArrayBuffer)) {
                            uni.showToast({
                                title: useAppStore().lang[interceptedResponse.data.msg] ? useAppStore().lang[interceptedResponse.data.msg] : interceptedResponse.data.msg,
                                icon: 'none'
                            })
                        }

                        resolve(interceptedResponse.data);
                        // reject(interceptedResponse);
                    }  else {

                        resolve(interceptedResponse.data);
                    }
                },
                fail: (error) => {
                    if (error.errMsg !== 'request:fail abort') {
                        reject(error);
                    }

                },
                complete: () => {
                    uni.hideLoading();
                    removePendingRequest(interceptedOptions);
                }
            });

            // 存储此次请求任务，以供后续处理
            const requestIdentifier = `${interceptedOptions.method}${interceptedOptions.url}`;
            pendingRequests[requestIdentifier] = {
                cancel: reject,
                task: requestTask
            };
        });
    },

    /**
     * 封装的GET请求方法
     * @param {string} url - 请求的URL
     * @param {Object} params - 请求参数
     * @param {Object} options - 其他选项
     * @return {Promise} - 返回一个Promise对象
     */
    get(url, params = {}, options = {}) {
        return this.request({
            method: "GET",
            url,
            data: params,
            ...options
        }).catch(error => {
            console.error(`请求${url}错误：`, error);
            // throw error;
        });
    },

    /**
     * 封装的POST请求方法
     * @param {string} url - 请求的URL
     * @param {Object} data - 请求数据
     * @param {Object} options - 其他选项
     * @return {Promise} - 返回一个Promise对象
     */
    post(url, data = {}, options = {}) {
        let {header, ...otherOptions} = options
        return this.request({
            method: "POST",
            url,
            data,
            header: {
               ...header,
            },
            ...otherOptions
        }).catch(error => {
            console.error(`请求${url}错误：`, error);
            // throw error;
        });
    },

    /**
     * 封装的delete请求方法
     * @param {string} url - 请求的URL
     * @param {Object} data - 请求数据
     * @param {Object} options - 其他选项
     * @return {Promise} - 返回一个Promise对象
     */
    delete(url, data = {}, options = {}) {
        return this.request({
            method: "DELETE",
            url,
            data,
            ...options
        }).catch(error => {
            console.error(`请求${url}错误：`, error);
            // throw error;
        });
    },


    uploadFile(path) {
        return new Promise((resolve, reject) => {
            let systemInfo = uni.getSystemInfoSync();
            uni.uploadFile({
                url:  BASE_URL + '/app/v1/photo/upload',
                filePath: path,
                name: 'file',
                header: {
                    'content-type': 'multipart/form-data',
                    'Authorization': "Bearer " + Storage.get('token')
                },
                formData: {
                    device_id: systemInfo.deviceId,
                    app_id: systemInfo.appId,
                    app_name: 'jindun'
                },
                success: (uploadFileRes) => {
                    if(!uploadFileRes.data) {
                        uploadFileRes.data = "{\"error\":false,\"code\":413,\"msg\":\"error\",\"data\":{\"path\":\"\"}}\n"
                    }
                    resolve(JSON.parse(uploadFileRes.data));
                },
                fail: (uploadFileErr) => {
                    reject(uploadFileErr);
                }
            });
        });
    }
    // 调用方法
    /*   login () {
           try {
               return  request.get ("posts", { param1: "value1" });
           } catch (error) {
               console.error ("请求错误：", error);
           }
       }*/
}

