<template>
  <div class="UserClickSeizeSeat">
    <el-drawer
      :modal="false"
      :visible="false"
      :direction="direction"
      :show-close="false"
      class="drawerWrapperControl"
      :close="UserClickSeizeSeatClose"
      :withHeader="false"
      size="2.995rem"
    >
      <div class="UserClickSeizeSeat-top">
        <div class="UserClickSeizeSeat-top-img">
          <div
            class="UserClickSeizeSeat-top-img-bc"
            :style="
              userInfo['portrait']
                ? {
                    backgroundImage:
                      'url(' +
                      this.$store.state.defaultAddress +
                      userInfo.portrait +
                      ')',
                  }
                : {
                    backgroundImage:
                      'url(' + this.$store.state.defaultAvatarUrl + ')',
                  }
            "
          ></div>
        </div>
        <div class="UserClickSeizeSeat-top-name">{{ userInfo.userName }}</div>
        <div
          v-show="'index' in userInfo && userInfo.index != 'none'"
          class="UserClickSeizeSeat-top-count"
        >
          {{ userInfo.index }} 号麦位
        </div>
      </div>
      <div class="UserClickSeizeSeat-center">
        <div class="center-button">
          <span
            @click="giftClick(userInfo)"
            class="center-button-span center-button-gift"
            >送礼物</span
          >
        </div>
        <div class="center-button">
          <span
            @click="letterClick(userInfo)"
            class="center-button-span center-button-letter"
            >发私信</span
          >
        </div>
        <!-- <div class="center-button">3</div> -->
      </div>
      <div class="UserClickSeizeSeat-footer">
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
import request from "../../request/index";
export default {
  data() {
    return {
      type: "",
      UserClickSeizeSeat: false,
      direction: "btt",
      userInfo: {},
      // eslint-disable-next-line no-undef
      isAdmin: "url(" + require("../../assets/roomicon/Manage.png") + ")",
      // eslint-disable-next-line no-undef
      notAdmin: "url(" + require("../../assets/roomicon/SetAdmin.png") + ")",
      userInfoFunKeys: [],
    };
  },
  components: {
    FunctionKey,
  },
  watch: {
    listeuserInfoFunKeys: function () {
      // console.log(newvalue);
    },
  },
  computed: {
    listeuserInfoFunKeys() {
      return this.userInfoFunKeys;
    },
  },
  methods: {
    UserClickSeizeSeatOpen: function (item) {
      console.log(item);
      this.userInfo = item.item;
      this.userInfoFunKeys = item.value;
      console.log(this.userInfoFunKeys);
      this.UserClickSeizeSeat = true;
    },
    closeUserClickSeizeSeat: function () {
      this.UserClickSeizeSeat = false;
      this.userInfoFunKeys = [];
    },
    UserClickSeizeSeatClose: function () {
      this.userInfoFunKeys = [];
      //   this.$emit("UserInforClose");
    },
    SeatAdminChange: function (item) {
      console.log(item);
      this.UserClickSeizeSeat = false;
      request
        .setManage({
          isManage: !item.isAdmin,
          roomId: this.$RCVoiceRoomLib._roomidcli,
          userId: item.userId,
        })
        .then(async (res) => {
          if (res.data.code == 10000) {
            this.$emit("SeatAdminChange");
            let message = {
              userId: item.userId,
              userName: item.userName,
              isAdmin: !item.isAdmin,
            };
            this.$RCVoiceRoomLib.emit("onMessageReceived", {
              //发本地
              //模拟本地消息发送
              messageType: "RC:Chatroom:Admin",
              isOffLineMessage: false,
              content: message,
            });
            this.$RCVoiceRoomLib.im.messageUpdate("RC:Chatroom:Admin", message); //发message
            this.$RCVoiceRoomLib.im.messageUpdate("RC:VRLRefreshMsg", {
              name: "VoiceRoomNeedRefreshmanagers",
            });
          }
        });
    },
    giftClick: function (userInfo) {
      console.log("送礼物:", userInfo);
      this.UserClickSeizeSeat = false;
      this.$emit("giftClick", userInfo);
    },
    letterClick: function (userInfo) {
      console.log("发私信:", userInfo);
      this.UserClickSeizeSeat = false;
    },
  },
};
</script>
<style scoped>
.UserClickSeizeSeat {
  text-align: center;
  overflow: hidden;
}
.drawerWrapperControl {
  position: relative;
  max-width: 375px;
  left: calc(50vw - 187.5px) !important;
}

.UserClickSeizeSeat /deep/ .el-drawer {
  background-color: rgba(92, 80, 149, 1) !important;
  overflow: visible !important;
  border-top-left-radius: 0.215rem;
  border-top-right-radius: 0.215rem;
}

.UserClickSeizeSeat /deep/ .el-drawer__body {
  overflow: visible !important;
}

.UserClickSeizeSeat-admin {
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

.UserClickSeizeSeat-admin-span {
  padding-left: 0.2rem;
  font-size: 0.13rem;
  background-repeat: no-repeat;
  background-size: 0.16rem 0.16rem;
  background-position: left;
}

.UserClickSeizeSeat-top {
  height: 0.875rem;
  text-align: center;
  position: relative;
}

.UserClickSeizeSeat-top-img {
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

.UserClickSeizeSeat-top-img-bc {
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

.UserClickSeizeSeat-top-name {
  height: 0.24rem;
  font-size: 0.17rem;
  font-weight: 500;
  line-height: 0.24rem;
  padding-top: 0.375rem;
  color: white;
}

.UserClickSeizeSeat-top-count {
  height: 0.18rem;
  font-size: 0.13rem;
  font-weight: normal;
  line-height: 0.18rem;
  margin-top: 0.03rem;
  color: #dfdfdf;
}

.UserClickSeizeSeat-center {
  width: 100%;
  height: 0.98rem;
  display: flex;
}

.center-button {
  flex: 1;
  text-align: center;
  line-height: 0.98rem;
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

.UserClickSeizeSeat-footer {
  width: 100%;
  height: 1.15rem;
  background-color: rgba(255, 255, 255, 0.12);
  display: flex;
  justify-content: center;
  align-items: center;
}

.UserClickSeizeSeat-footer .footer-button {
  flex: 1;
  color: white;
}
</style>
