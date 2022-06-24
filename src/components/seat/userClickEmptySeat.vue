<template>
  <div class="UserClickEmptySeat">
    <el-drawer
      :modal="false"
      class="drawerWrapperControl"
      :visible.sync="UserClickEmptySeat"
      :direction="direction"
      :show-close="false"
      :close="UserClickEmptySeatClose"
      :withHeader="false"
      size="2.62rem"
    >
      <div class="UserClickEmptySeat-top">
        <div class="UserClickEmptySeat-top-img">
          <div
            class="UserClickEmptySeat-top-img-bc"
            :style="
              userInfo.status == 2
                ? {
                    backgroundImage: LockSeat,
                  }
                : {
                    backgroundImage: UpperWheat,
                  }
            "
          >
            <div v-if="userInfo['mute']" class="UserClickEmptySeat-mute"></div>
          </div>
        </div>
        <div
          v-show="'index' in userInfo && userInfo.index != 'none'"
          class="UserClickEmptySeat-top-count"
        >
          {{ userInfo.index }} 号麦位
        </div>
      </div>
      <div class="UserClickEmptySeat-center">
        <div class="center-button" @click="clickInvitation">邀请用户上麦</div>
      </div>
      <div class="UserClickEmptySeat-footer">
        <div
          class="footer-button"
          v-for="(item, i) in userInfoFunKeys"
          :key="i"
        >
          <FunctionKey
            :item="item"
            :userInfo="userInfo"
            @closeUserClickSeizeSeat="closeUserClickSeizeSeat"
          />
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import FunctionKey from "../room/FunctionKey.vue";
export default {
  data() {
    return {
      type: "",
      UserClickEmptySeat: false,
      direction: "btt",
      userInfo: {},
      // eslint-disable-next-line no-undef
      muteSeat: "url(" + require("../../assets/roomicon/Manage.png") + ")",
      LockSeat:
        // eslint-disable-next-line no-undef
        "url(" + require("../../assets/roomicon/LockSeatIcon.png") + ")",
      UpperWheat:
        // eslint-disable-next-line no-undef
        "url(" + require("../../assets/roomicon/UpperWheat.png") + ")",
      userInfoFunKeys: [],
    };
  },
  components: {
    FunctionKey,
  },
  watch: {
    listeuserInfoFunKeys: function (newvalue) {
      console.log(newvalue);
    },
  },
  computed: {
    listeuserInfoFunKeys() {
      return this.userInfoFunKeys;
    },
  },
  methods: {
    UserClickEmptySeatOpen: function (item) {
      this.userInfo = item.item;
      this.userInfoFunKeys = item.value;
      this.UserClickEmptySeat = true;
    },
    closeUserClickSeizeSeat: function () {
      this.UserClickEmptySeat = false;
      this.userInfoFunKeys = [];
    },
    UserClickEmptySeatClose: function () {
      this.userInfoFunKeys = [];
    },
    clickInvitation: function () {
      this.$emit("clickInvitation");
      this.UserClickEmptySeat = false;
    },
  },
};
</script>
<style scoped>
.UserClickEmptySeat {
  text-align: center;
  overflow: hidden;
}
.drawerWrapperControl {
  position: relative;
  max-width: 375px;
  left: calc(50vw - 187.5px) !important;
}

.UserClickEmptySeat /deep/ .el-drawer {
  background-color: rgba(92, 80, 149, 1) !important;
  overflow: visible !important;
  border-top-left-radius: 0.215rem;
  border-top-right-radius: 0.215rem;
}

.UserClickEmptySeat /deep/ .el-drawer__body {
  overflow: visible !important;
}

.UserClickEmptySeat-admin {
  position: absolute;
  top: 0;
  right: 0;
  height: 0.45rem;
  width: 1.14rem;
  color: #dfdfdf;
  background: rgba(255, 255, 255, 0.16);
  border-top-right-radius: 0.215rem;
  border-bottom-left-radius: 0.215rem;
  justify-content: center;
  align-items: center;
  display: flex;
  z-index: 10;
}

.UserClickEmptySeat-admin-span {
  padding-left: 0.2rem;
  font-size: 0.13rem;
  background-repeat: no-repeat;
  background-size: 0.16rem 0.16rem;
  background-position: left;
}

.UserClickEmptySeat-top {
  height: 0.5rem;
  text-align: center;
  position: relative;
}

.UserClickEmptySeat-top-img {
  position: absolute;
  left: 50%;
  top: -0.375rem;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  margin-left: -0.375rem;
  z-index: 9;
  background-color: rgba(92, 80, 149, 1);
  background-repeat: no-repeat;
  background-size: 3.75rem 3.33rem;
  background-position: -0.3rem -2.9rem;
}

.UserClickEmptySeat-top-img-bc {
  width: 0.56rem;
  height: 0.56rem;
  border-radius: 50%;
  position: relative;
  top: 0.095rem;
  left: 0.095rem;
  background-repeat: no-repeat;
  background-size: 0.56rem 0.56rem;
  background-position: center;
}

.UserClickEmptySeat-mute {
  z-index: 100;
  position: absolute;
  right: 0rem;
  bottom: 0.03rem;
  width: 0.18rem;
  height: 0.18rem;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 0.18rem 0.18rem;
  background-image: url(../../assets/wheat/MuteWheat.png);
}

.UserClickEmptySeat-top-name {
  height: 0.24rem;
  font-size: 0.17rem;
  font-weight: 500;
  line-height: 0.24rem;
  padding-top: 0.375rem;
  color: white;
}

.UserClickEmptySeat-top-count {
  height: 0.18rem;
  font-size: 0.13rem;
  font-weight: normal;
  line-height: 0.18rem;
  margin-top: 0.03rem;
  color: #dfdfdf;
  padding-top: 0.375rem;
}

.UserClickEmptySeat-center {
  width: 100%;
  height: 0.98rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.UserClickEmptySeat-center .center-button {
  text-align: center;
  height: 0.44rem;
  width: 3.19rem;
  border-radius: 0.12rem;
  background: rgba(205, 205, 205, 0.2);
  line-height: 0.44rem;
  color: #ffffff;
  font-size: 0.14rem;
}

.center-button-span {
  display: inline-block;
  width: 1rem;
  border-radius: 0.215rem;
  height: 0.43rem;
  border-radius: 0.215rem;
  line-height: 0.43rem;
  background-repeat: no-repeat;
  background-size: 1rem 0.43rem;
  background-position: center;
}

.center-button-gift {
  background-image: url("../../assets/wheat/giftbutton.png");
  color: white;
}

.center-button-letter {
  color: rgba(239, 73, 154, 1);
  background-image: url("../../assets/wheat/letter.png");
}

.UserClickEmptySeat-footer {
  width: 100%;
  height: 1.15rem;
  background-color: rgba(255, 255, 255, 0.12);
  display: flex;
  justify-content: center;
  align-items: center;
}

.UserClickEmptySeat-footer .footer-button {
  flex: 1;
  color: white;
}
</style>
