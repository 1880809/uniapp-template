import { defineStore } from "pinia";
import { Storage, goToLinks } from "/lib/utils.js";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  // 用户信息
  let userInfos = ref({});


  // 退出
  function LOGOUT() {
    Storage.remove('token')
    Storage.remove('userInfo')
    Storage.remove('username')
    userInfos.value = {}

    goToLinks({
      type: 'reLaunch',
      url: '/pages/login/login'
    })
  }

  return {
    userInfos,
    LOGOUT,
  };
});
