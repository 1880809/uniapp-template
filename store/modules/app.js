import { defineStore } from "pinia";
import { ref } from "vue";
import {Storage} from "/lib/utils";

import cn from "/lib/lang/cn.js";
import en from "/lib/lang/en.js";

export const useAppStore = defineStore("app", () => {
  const appName = ref('');
  const appNameLogo = ref('');


  // 国际化
  const lang = ref({});
  SET_LANG()
  function SET_LANG() {
    const langData = {
      "cn": cn,
      "en": en,
    };
    let key = Storage.get('lang') || 'cn';
    if(!langData[key]) {
      key = 'cn'
    }
    Storage.set('lang', key)
    lang.value = langData[key]
  }

  return {
    appName,
    appNameLogo,
    lang,
    SET_LANG
  };
  
});
