<template>
  <div class="background">
    <div class="board">
      <div class="title">正在邀请视频连线</div>
      <button class="main-btn" @click="quitInv">取消邀请</button>
      <button class="sub-btn" @click="cancelInv">取消</button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    quitInv: function () {
      this.$emit("invQuit");
    },
    cancelInv: function () {
      this.$emit("invCancel");
    },
  },
};
</script>

<style scoped>
.background {
  z-index: 1000;
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
}
.board {
  position: absolute;
  text-align: center;
  border-radius: 24px 24px 0px 0px;
  width: 100%;
  height: 200px;
  bottom: 0px;
  background-color: rgba(3, 6, 47, 0.8);
}
.title {
  padding: 12px;
  color: #fff;
  font-size: 16px;
}
.main-btn {
  width: 319px;
  height: 44px;
  margin: 6px;
  background: linear-gradient(90deg, #505dff 8.65%, #e92b88 100%);
  color: #fff;
  border-radius: 6px;
  border: none;
  font-size: 17px;
}
.sub-btn {
  margin: 6px;
  width: 319px;
  height: 44px;
  background: none;
  color: #fff;
  border-radius: 6px;
  border: #dd5898 1px solid;
  font-size: 17px;
}
</style>