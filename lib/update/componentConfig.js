import { getVersion } from "/http";

const platform = uni.getSystemInfoSync().platform;
// 版本号比较
function compareVersions(versionServer, versionApp) {
    const partsA = versionServer.split('.').map(Number);
    const partsB = versionApp.split('.').map(Number);
    for (let i = 0; i < partsA.length; i++) {
        if (partsA[i] > partsB[i]) {
            return true;
        } else if (partsA[i] < partsB[i]) {
            return false;
        }
    }
    return false;
}

export default {
    // 发起ajax请求获取服务端版本号
    getServerNo: (version, isPrompt = false, callback) => {
        let httpData = {
            version: version.versionCode,
            // 版本名称
            versionName: version.versionName,
            // setupPage参数说明（判断用户是不是从设置页面点击的更新，如果是设置页面点击的更新，有不要用静默更新了，不然用户点击没反应很奇怪的）
            setupPage: isPrompt
        };
        if (platform === "android") {
            httpData.type = 1101;
        } else {
            httpData.type = 1102;
        }

        getVersion().then(res => {
            // 每个平台的更新版本信息返回的都可能不一样，根据每个接口返回的数据结构自己处理
            //force_update 1更新包 否则更新资源
            if (res && res.code == 1000) {
                let wgt = res.data.find(item => item.type == 3)
                let downloadInfos = {}
                let tempInfos = {}
                if (platform === "android") {
                    tempInfos = res.data.find(item => item.type == 1)
                } else {
                    tempInfos = res.data.find(item => item.type == 2)
                }
                // 如果包需要更新, 就弹窗跳转商店或者下载
                if(tempInfos && tempInfos.force_update == 2 && compareVersions(tempInfos.app_version, version.versionName)) {
                    downloadInfos.updateType = "solicit";
                    downloadInfos.versionInfo = tempInfos.content
                    downloadInfos.versionName = tempInfos.app_version
                    downloadInfos.versionCode = tempInfos.app_version
                    downloadInfos.downloadUrl = tempInfos.addr + '?tt=' + new Date().getTime()

                // } else if(wgt && wgt.force_update != 2 && +wgt.resources_version > +version.versionCode) {
                } else if(wgt && +wgt.resources_version > +version.versionCode) {
                    // 包不需要更新的话, 就只更新wgt, 强制更新
                    // downloadInfos.updateType = "forcibly";
                    downloadInfos.updateType = "forcibly";
                    downloadInfos.versionInfo = wgt.content
                    downloadInfos.versionName = wgt.app_version
                    downloadInfos.versionCode = wgt.app_version
                    downloadInfos.downloadUrl = wgt.addr + '?tt=' + new Date().getTime()
                } else if (isPrompt) {
                    uni.showToast({
                        title: "暂无新版本",
                        icon: "none"
                    });
                    return false
                } else {
                    return false
                }

                if(downloadInfos.updateType){
                    callback && callback(downloadInfos);
                } else {
                    if(downloadInfos.forceUpdate){
                        downloadInfos.updateType = "forcibly";
                    } else {
                        downloadInfos.updateType = "solicit";
                    }
                    callback && callback(downloadInfos);
                }
            }
            // else if (isPrompt) {
            //     uni.showToast({
            //         title: "暂无新版本",
            //         icon: "none"
            //     });
            // }
        })



        /* 接口入参说明
         * version: 应用当前版本号（已自动获取）
         * versionName: 应用当前版本名称（已自动获取）
         * type：平台（1101是安卓，1102是IOS）
         */
        /****************以下是示例*******************/
        // 可以用自己项目的请求方法（接口自己找后台要，插件不提供）
 /*       $http.get("api/common/v1/app_version", httpData,{
            isPrompt: isPrompt
        }).then(res => {
            /!* res的数据说明
             * | 参数名称        | 一定返回     | 类型        | 描述
             * | -------------|--------- | --------- | ------------- |
             * | versionCode     | y        | int       | 版本号        |
             * | versionName     | y        | String    | 版本名称      |
             * | versionInfo     | y        | String    | 版本信息      |
             * | updateType      | y        | String    | forcibly = 强制更新, solicit = 弹窗确认更新, silent = 静默更新 |
             * | downloadUrl     | y        | String    | 版本下载链接（IOS安装包更新请放跳转store应用商店链接,安卓apk和wgt文件放文件下载链接）  |
             *!/
            if (res && res.downloadUrl) {
                // 兼容之前的版本（updateType是新版才有的参数）
                if(res.updateType){
                    callback && callback(res);
                } else {
                    if(res.forceUpdate){
                        res.updateType = "forcibly";
                    } else {
                        res.updateType = "solicit";
                    }
                    callback && callback(res);
                }
            } else if (isPrompt) {
                uni.showToast({
                    title: "暂无新版本",
                    icon: "none"
                });
            }
        });*/
        /****************以上是示例*******************/
    },
    // 弹窗主颜色（不填默认粉色）
    appUpdateColor: "f00",
    // 弹窗图标（不填显示默认图标，链接配置示例如： '/static/demo/ic_attention.png'）
    appUpdateIcon: ''
}
