<template>
  <div class="userClickOwner">
    <el-drawer
      :modal="false"
      :visible.sync="drawer"
      :direction="direction"
      class="drawerWrapperCantrol"
      :show-close="false"
      :close="userClickOwnerClose"
      :withHeader="false"
      size="2.15rem"
    >
      <div class="userClickOwner-top">
        <div class="userClickOwner-top-img">
          <div class="userClickOwner-top-img-bc">
            <el-image
              class="image-userClickOwner"
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
      <div class="userClickOwner-center">
        <div>
          <div
            @click="downSeat"
            class="userClickOwner-button userClickOwner-down"
          >
            下麦围观
          </div>
          <div
            @click="muteSeat"
            class="userClickOwner-button userClickOwner-mute"
          >
            {{
              "extra" in userInfo &&
              JSON.parse(userInfo["extra"])["disableRecording"]
                ? "打开麦克风"
                : "关闭麦克风"
            }}
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
    };
  },
  components: {},
  watch: {},
  methods: {
    userClickOwnerOpen: function (item) {
      this.userInfo = item;
      this.drawer = true;
    },

    userClickOwnerClose: function () {
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
    muteSeat: function () {
      let b;
      if ("extra" in this.userInfo) {
        b = !JSON.parse(this.userInfo["extra"])["disableRecording"];
      } else {
        b = true;
      }

      this.$RCVoiceRoomLib.disableAudioRecording(b);
      this.$RCVoiceRoomLib.updateSeatInfoExtra(
        0,
        JSON.stringify({ disableRecording: b })
      );
      this.$emit("UserInforMute", b);
      this.drawer = false;
    },
  },
};
</script>
<style scoped>
.userClickOwner {
  text-align: center;
}
.drawerWrapperCantrol {
  position: relative;
  max-width: 375px;
  left: calc(50vw - 187.5px) !important;
}
.userClickOwner /deep/ .el-drawer {
  background-color: rgba(92, 80, 149, 1) !important;
  overflow: visible !important;
  border-top-left-radius: 0.215rem;
  border-top-right-radius: 0.215rem;
}

.userClickOwner /deep/ .el-drawer__body {
  overflow: visible !important;
}

.userClickOwner-top {
  height: 0.875rem;
  text-align: center;
  position: relative;
}

.userClickOwner-top-img {
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

.userClickOwner-top-img-bc {
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
.image-userClickOwner {
  width: 0.54rem;
  height: 0.54rem;
  border-radius: 50%;
  padding-top: 0.01rem;
}

.userClickOwner-top-name {
  height: 0.24rem;
  font-size: 0.17rem;
  font-weight: 500;
  line-height: 0.24rem;
  padding-top: 0.375rem;
  color: white;
}

.userClickOwner-top-seat {
  color: white;
}

.userClickOwner-center {
  width: 100%;
  height: 1.28rem;
  justify-content: center;
  display: flex;
}

.userClickOwner-button {
  height: 0.44rem;
  width: 3.19rem;
  line-height: 0.44rem;
  text-align: center;
  border-radius: 0.02rem;
  background: rgba(205, 205, 205, 0.2);
}

.userClickOwner-down {
  color: #ef499a;
}

.userClickOwner-mute {
  margin-top: 0.15rem;
  color: white;
}
</style>
