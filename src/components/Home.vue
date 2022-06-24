<template>
  <div id="home">
    <div class="ToolBar">
      <span
        class="ToolBarLeft"
        :style="{
          backgroundImage: this.$store.state.userInfo['userId']
            ? this.$store.state.userInfo.portrait
              ? 'url(' +
                this.$store.state.defaultAddress +
                this.$store.state.userInfo.portrait +
                ')'
              : 'url(' + this.$store.state.defaultAvatarUrl + ')'
            : 'url(' + leftSpaceImg + ')',
        }"
        @click="clickBarLeft"
      ></span>
      <span
        v-if="toolbarData.RightSpace"
        :style="{ backgroundImage: 'url(' + toolbarData.rightImg + ')' }"
        class="ToolBarRight"
        @click="clickBarRight"
      ></span>
    </div>
    <div class="homeSubject">
      <div class="chatRoom" @click="clickChatRoom">
        <div class="chatRoomText">
          <div class="chatRoomTitle">语聊房</div>
          <div class="chatRoomValue">
            超大聊天室，支持麦位、麦序 管理，涵盖 KTV 等多种玩法
          </div>
        </div>
        <div class="chatRoomRightImg"></div>
      </div>
      <div
        class="liveVideo"
        :style="{ backgroundImage: 'url(' + liveVideoImg + ')' }"
        @click="clickLiveVideo"
      ></div>
      <!-- <div
        class="voiceRadio"
        :style="{ backgroundImage: 'url(' + voiceRadioImg + ')' }"
        @click="clickVoiceRadio"
      ></div>
      <div
        class="voiceCall"
        :style="{ backgroundImage: 'url(' + voiceCallImg + ')' }"
        @click="clickVoiceCall"
      ></div>
      <div
        class="videoCall"
        :style="{ backgroundImage: 'url(' + videoCallImg + ')' }"
        @click="clickVideoCall"
      ></div> -->
    </div>
    <ModifyUser ref="modifyUser" />
  </div>
</template>
<script>
import router from "../router/index";
import ModifyUser from "./ModifyUser.vue";
// import request from "../request/index";

export default {
  //   props: ["toolbarData"],
  router: router,
  data() {
    return {
      toolbarData: {
        RightSpace: true,
        // eslint-disable-next-line no-undef
        rightImg: require("../assets/home/mail.png"),
        // rightImg: require("../assets/explain-icon.png"),
      },
      userInfo: {
        username: "123",
      },
      showType: true,
      // eslint-disable-next-line no-undef
      leftSpaceImg: require("../assets/home/landingAvatar.png"),
      // eslint-disable-next-line no-undef
      // chatRoomImg: require("../assets/home/SubtractBack.png"),
      // eslint-disable-next-line no-undef
      liveVideoImg: require("../assets/home/liveVideo.png"),
      // eslint-disable-next-line no-undef
      voiceRadioImg: require("../assets/home/voiceRadio.png"),
      // eslint-disable-next-line no-undef
      voiceCallImg: require("../assets/home/voiceCall.png"),
      // eslint-disable-next-line no-undef
      videoCallImg: require("../assets/home/videoCall.png"),
    };
  },
  watch: {
    toolbarData: function () {
      // console.log(newVal);
    },
  },
  created() {
    // console.log(this.$store.state.userInfo);
  },
  components: {
    ModifyUser,
  },
  mounted() {
    window.addEventListener("load", () => {
      if (this.$route.name != "login") {
        this.$router.replace("/login");
      }
    });
  },
  methods: {
    clickBarLeft: function () {
      if (this.$store.state.userInfo.authorization) {
        // console.log(this.$store.state.userInfo);
        this.$refs.modifyUser.setPopup();
      } else {
        this.$router.push("/login");
      }
    },
    clickBarRight: function () {
      this.$store.dispatch("showToast", {
        value: "功能待开放",
      });
    },
    clickChatRoom: function () {
      if (!this.$store.state.userInfo.authorization) {
        this.$router.push("/login");
        return;
      }
      if (this.$store.state.roomType != "voice") {
        this.$store.dispatch("getOwerDisconnet", true).then(() => {
          this.$RCLiveRoomLib.im.body.disconnect().then(() => {
            this.$store.dispatch("getRoomType", "voice");
            // this.$RCVoiceRoomLib.connect(this.$store.state.userInfo.imToken);
            this.$RongIMLib.connect(this.$store.state.userInfo.imToken);
          });
        });
      }
      this.$router.push("/room");
    },
    lll() {
      throw new Error("参数必须是数字或数字字符串!");
    },
    clickLiveVideo: function () {
      if (!this.$store.state.userInfo.authorization) {
        this.$router.push("/login");
        return;
      }
      if (this.$store.state.roomType != "live") {
        this.$store.dispatch("getOwerDisconnet", true).then(() => {
          this.$RCVoiceRoomLib.im.body.disconnect().then(() => {
            this.$RCLiveRoomLib.connect(this.$store.state.userInfo.imToken);
            this.$store.dispatch("getRoomType", "live");
          });
        });
      }
      this.$router.push("/room?roomType=liveRoom");
    },
    clickVoiceRadio: function () {
      // console.log(123);
    },
    clickVoiceCall: function () {
      this.$router.push("/live?roomid=9765");
    },
    clickVideoCall: function () {
      this.$router.push("/live?roomid=9765&isAnchor=true");
    },
  },
};
</script>
<style scoped>
#home {
  height: 100vh;
  width: 375px;
  text-align: center;
}
.ToolBar {
  position: relative;
  height: 0.44rem;
  width: 100%;
  min-width: none;
  margin-bottom: 0.06rem;
}
.ToolBar .ToolBarLeft {
  display: inline-block;
  width: 0.32rem;
  height: 0.32rem;
  position: absolute;
  top: 0.075rem;
  left: 0.2rem;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border: 1px solid;
}
.ToolBar .ToolBarRight {
  display: inline-block;
  position: absolute;
  width: 0.24rem;
  height: 0.18rem;
  top: 0.145rem;
  right: 0.2rem;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.homeSubject {
  width: 3.35rem;
  height: calc(100vh - 0.5rem);
  margin-left: 0.2rem;
  overflow: hidden;
}
.chatRoom {
  width: 100%;
  /* min-width: none; */
  height: 1.57rem;
  background-repeat: no-repeat;
  background-size: 3.33rem 1.3rem;
  background-position: bottom;
  background-image: url(../assets/home/SubtractBack.png);
  margin-bottom: 0.16rem;
  position: relative;
  z-index: 1;
  color: rgba(255, 255, 255, 1);
}

.chatRoomText {
  width: 1.56rem;
  margin-left: 0.16rem;
  padding-top: 0.44rem;
  text-align: left;
}

.chatRoomTitle {
  width: 0.57rem;
  height: 0.27rem;
  font-weight: 500;
  font-size: 0.19rem;
  line-height: 0.27rem;
}

.chatRoomValue {
  font-size: 0.12rem;
  line-height: 0.17rem;
}

.chatRoomRightImg {
  width: 1.56rem;
  height: 2.22rem;
  background-repeat: no-repeat;
  background-size: 1.56rem 2.22rem;
  background-position: bottom;
  background-image: url(../assets/home/Subtract.png);
  position: absolute;
  right: 0.08rem;
  top: 0rem;
  z-index: 2;
}

.liveVideo {
  float: left;
  width: 1.58rem;
  height: 1.95rem;
  margin-right: 0.19rem;
  background-repeat: no-repeat;
  background-size: 1.58rem 1.95rem;
  background-position: center;
  margin-bottom: 0.16rem;
}
.voiceRadio {
  float: left;
  width: 1.58rem;
  height: 1.95rem;
  background-repeat: no-repeat;
  background-size: 1.58rem 1.95rem;
  background-position: center;
  margin-bottom: 0.16rem;
}
.voiceCall {
  float: left;
  width: 1.58rem;
  height: 1.95rem;
  margin-right: 0.19rem;
  background-repeat: no-repeat;
  background-size: 1.58rem 1.95rem;
  background-position: center;
}
.videoCall {
  float: left;
  width: 1.58rem;
  height: 1.95rem;
  background-repeat: no-repeat;
  background-size: 1.58rem 1.95rem;
  background-position: center;
}
</style>
