<template>
  <div class="audienceClickOwer">
    <el-drawer
      :modal="false"
      :visible.sync="drawer"
      :direction="direction"
      :show-close="false"
      :close="audienceClickOwerClose"
      :withHeader="false"
      size="2.15rem"
    >
      <div class="audienceClickOwer-top">
        <div class="audienceClickOwer-top-img">
          <div class="audienceClickOwer-top-img-bc">
            <el-image
              class="image-audienceClickOwer"
              fit="cover"
              :src="
                userInfo['portrait']
                  ? this.$store.state.defaultAddress + userInfo.portrait
                  : this.$store.state.defaultAvatarUrl
              "
            >
            </el-image>
          </div>
        </div>
      </div>
      <div class="audienceClickOwer-center">
        <div>
          <div
            @click="muteSeat(mute)"
            class="audienceClickOwer-button audienceClickOwer-down"
          >
            {{ this.$store.state.muteMicrophone ? "打开麦克风" : "关闭麦克风" }}
          </div>
          <div
            @click="downSeat"
            class="audienceClickOwer-button audienceClickOwer-mute"
          >
            断开连接
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
      userInfo: {},
      mute: false,
    };
  },
  components: {},
  watch: {},
  methods: {
    audienceClickOwerOpen: function (item) {
      this.userInfo = item;
      this.drawer = true;
      this.mute = this.$store.state.muteMicrophone;
    },

    audienceClickOwerClose: function () {
      this.userInfo = {};
      this.$emit("UserInforClose");
    },

    downSeat: async function () {
      this.drawer = false;
      try {
        await this.$RCVoiceRoomLib.leaveSeat();
        setTimeout(() => {
          this.$store.dispatch("getSeatInfoList");
          this.$store.dispatch("showToast", {
            value: "下麦成功",
          });
        }, 50);
      } catch (error) {
        this.$store.dispatch("showToast", {
          value: "下麦失败",
        });
        console.log(error);
      }
    },
    muteSeat: async function (mute) {
      if (this.userInfo.mute && !this.$store.state.creatUser) {
        this.$store.dispatch("showToast", {
          value: "此座位已被房主禁麦",
        });
        return;
      }
      if (mute) {
        this.$store.dispatch("getMicrophone", false);
        await this.$RCVoiceRoomLib.disableAudioRecording(false);
        this.$store.dispatch("showToast", {
          value: "融云 RTC：已取消静音",
        });
      } else {
        await this.$RCVoiceRoomLib.disableAudioRecording(true);
        this.$store.dispatch("getMicrophone", true);
        this.$store.dispatch("showToast", {
          value: "融云 RTC：扬声器已静音",
        });
      }
      this.drawer = false;
    },
  },
};
</script>
<style scoped>
.audienceClickOwer {
  text-align: center;
}
.audienceClickOwer /deep/ .el-drawer {
  background-color: rgba(92, 80, 149, 1) !important;
  overflow: visible !important;
  border-top-left-radius: 0.215rem;
  border-top-right-radius: 0.215rem;
}

.audienceClickOwer /deep/ .el-drawer__body {
  overflow: visible !important;
}

.audienceClickOwer-top {
  height: 0.875rem;
  text-align: center;
  position: relative;
}

.audienceClickOwer-top-img {
  position: absolute;
  left: 50%;
  top: -0.375rem;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  margin-left: -0.375rem;
  z-index: 9000000000;
  background-color: rgba(92, 80, 149, 1);
  background-repeat: no-repeat;
  background-size: 3.75rem 3.33rem;
  background-position: -0.3rem -2.9rem;
}

.audienceClickOwer-top-img-bc {
  width: 0.56rem;
  height: 0.56rem;
  border-radius: 50%;
  position: relative;
  top: 0.095rem;
  left: 0.095rem;
  background-repeat: no-repeat;
  background-size: 0.56rem 0.56rem;
  background-position: center;
  background-image: linear-gradient(#ff0000 0%, #0000cc 100%);
}
.image-audienceClickOwer {
  width: 0.54rem;
  height: 0.54rem;
  border-radius: 50%;
  padding-top: 0.01rem;
}

.audienceClickOwer-top-name {
  height: 0.24rem;
  font-size: 0.17rem;
  font-weight: 500;
  line-height: 0.24rem;
  padding-top: 0.375rem;
  color: white;
}

.audienceClickOwer-top-seat {
  color: white;
}

.audienceClickOwer-center {
  width: 100%;
  height: 1.28rem;
  justify-content: center;
  display: flex;
}

.audienceClickOwer-button {
  height: 0.44rem;
  width: 3.19rem;
  line-height: 0.44rem;
  text-align: center;
  border-radius: 0.02rem;
  background: rgba(205, 205, 205, 0.2);
}

.audienceClickOwer-down {
  color: #ef499a;
}

.audienceClickOwer-mute {
  margin-top: 0.15rem;
  color: white;
}
</style>
