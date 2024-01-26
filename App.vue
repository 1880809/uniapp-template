<script setup>
</script>
<script>

// #ifdef APP-PLUS
import APPUpdate, { getCurrentNo } from "/lib/update/appUpdate";
// #endif
import { Storage } from "@/lib/utils";
export default {
  setup() {
  },
  onLaunch: function () {
    console.log("App Launch");
  },
  onShow: function () {
    // #ifdef APP
    APPUpdate();
    // #endif
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
  methods: {
  },
};
</script>

<style lang="scss">
@import "@/uni_modules/uview-plus/index.scss";
@import "@/static/css/theme.scss";
@import "@/static/css/init.scss";
@import "@/static/css/comm.scss";
</style>
