<template>
  <div class="container">
    <div
      class="centerIcon"
      :style="{
        width: size + 'px',
        height: size + 'px',
        lineHeight: size + 'px',
      }"
    >
      <div class="centerIconTitle">
        <div class="centerIconPic"></div>
        {{ title }}332
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "title",
  data: function () {
    return {};
  },
  computed: {
    title: function () {
      let str;
      if (this.status == 0) {
        str = "邀请连线";
      }
      return str;
    },
  },
  mounted() {
    console.log(this.status);
  },
  props: {
    status: Number,
    size: Number,
  },
};
</script>
<style scoped>
.container {
  position: absolute;
  top: 30px;
  right: 120px;
  text-align: center;
  color: #fff;
  background: rgba(92, 80, 149, 1);
  vertical-align: center;
}
.centerIconTitle {
  top: 12px;
  padding-top: 12px;
  color: #adadad;
  font-size: 12px;
}
.centerIconPic {
  width: 18px;
  height: 18px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -9px;
  margin-top: -18px;
  background-repeat: no-repeat;
  background-size: 18px 18px;
  background-position: center;
  background-image: url(../../assets/live/union.png);
}
</style>