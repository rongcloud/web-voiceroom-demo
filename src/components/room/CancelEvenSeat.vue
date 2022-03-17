<template>
  <div class="CancelEvenSeat">
    <el-drawer
      :modal="false"
      :visible.sync="drawer"
      :direction="direction"
      :show-close="false"
      :withHeader="false"
      size="2.04rem"
    >
      <div class="CancelEvenSeat-top">已申请连麦</div>
      <div class="CancelEvenSeat-center">
        <div>
          <div
            @click="cancelSeat"
            class="CancelEvenSeat-button CancelEvenSeat-down"
          >
            撤销连麦申请
          </div>
          <div
            @click="cancel"
            class="CancelEvenSeat-button CancelEvenSeat-cancel"
          >
            取消
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      drawer: false,
      direction: "btt",
    };
  },
  components: {},
  watch: {},
  methods: {
    CancelEvenSeatOpen: function () {
      this.drawer = true;
    },

    cancelSeat: async function () {
      try {
        await this.$RCVoiceRoomLib.cancelRequestSeat();
        this.$store.dispatch("showToast", {
          value: "已撤回连线申请",
        });
        this.$store.dispatch("userHasApply", false);
      } catch (error) {
        this.$store.dispatch("showToast", {
          value: "撤回连线申请失败",
        });
      }

      this.drawer = false;
    },
    cancel: function () {
      this.drawer = false;
    },
  },
};
</script>
<style scoped>
.CancelEvenSeat {
  text-align: center;
}
.CancelEvenSeat /deep/ .el-drawer {
  background-color: rgba(92, 80, 149, 1) !important;
  overflow: visible !important;
  border-top-left-radius: 0.215rem;
  border-top-right-radius: 0.215rem;
}

.CancelEvenSeat /deep/ .el-drawer__body {
  overflow: visible !important;
}

.CancelEvenSeat-top {
  height: 0.76rem;
  text-align: center;
  position: relative;
  line-height: 0.76rem;
  color: #ffffff;
  font-size: 0.16rem;
  font-weight: 500;
}

.CancelEvenSeat-center {
  width: 100%;
  height: 1.28rem;
  justify-content: center;
  display: flex;
}

.CancelEvenSeat-button {
  height: 0.44rem;
  width: 3.19rem;
  line-height: 0.44rem;
  text-align: center;
  border-radius: 0.02rem;
  background: rgba(205, 205, 205, 0.2);
}

.CancelEvenSeat-down {
  color: #ef499a;
}

.CancelEvenSeat-cancel {
  margin-top: 0.15rem;
  color: white;
}
</style>
