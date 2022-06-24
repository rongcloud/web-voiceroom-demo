<template>
  <div class="ToolBarControl">
    <span
      class="ToolBarLeft"
      :style="{
        backgroundImage: toolbarData.leftImg
          ? 'url(' + toolbarData.leftImg + ')'
          : 'url(' + leftSpaceImg + ')',
      }"
      @click="clickBarLeft"
    ></span>
    <span class="titleSpace">{{ title ? title : "" }}</span>
    <span
      v-if="toolbarData.RightSpace"
      :style="{ backgroundImage: 'url(' + toolbarData.rightImg + ')' }"
      class="ToolBarRight"
      @click="clickBarRight"
    ></span>
  </div>
</template>
<script>
import router from "../router/index";
export default {
  props: ["title"],
  router: router,
  data() {
    return {
      toolbarData: {
        RightSpace: true,
        // eslint-disable-next-line no-undef
        rightImg: require("../assets/news-icon.png"),
        // rightImg: require("../assets/explain-icon.png"),
      },
      type: "",
      // eslint-disable-next-line no-undef
      leftSpaceImg: require("../assets/back-icon.png"),
    };
  },
  watch: {
    // toolbarData: function (newVal) {
    //   console.log(newVal);
    // },
  },
  methods: {
    clickBarLeft: function () {
      this.$router.push("/home");
      // if (!this.toolbarData.leftImg) {
      //   this.$router.push("/home");
      //   //this.$router.go(-1);
      // } else {
      //   this.$emit("BarLeftCallback", this.toolbarData);
      // }
    },
    clickBarRight: function () {
      this.$emit("BarRightCallback");
    },
  },
};
</script>
<style scoped>
.ToolBarControl {
  position: relative;
  height: 0.65rem;
  width: 100%;
}
.ToolBarControl .ToolBarLeft {
  display: inline-block;
  width: 0.24rem;
  height: 0.24rem;
  position: absolute;
  top: 0.3rem;
  left: 0.09rem;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.ToolBarControl .ToolBarRight {
  display: inline-block;
  position: absolute;
  width: 0.24rem;
  height: 0.24rem;
  top: 0.3rem;
  right: 0.165rem;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.titleSpace {
  display: inline-block;
  width: 375px;
  min-width: none;
  height: 0.65rem;
  line-height: 0.8rem;
  text-align: center;
  font-size: 0.18rem;
  font-weight: 900;
}
</style>
