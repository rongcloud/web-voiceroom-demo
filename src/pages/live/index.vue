<template>
  <div class="liveroom">
    <video
      class="videocontainer"
      :class="{ fliped: isAnchor }"
      width="100%"
      height="100%"
      ref="video"
    ></video>
    <liveCreate v-if="status == 0" @startShow="startShow" />
    <liveTitle
      :title="userName"
      :userAvatar="userAvatar"
      :isAnchor="isAnchor"
      :delay="'32'"
      :giftNum="giftNum"
      v-if="status == 2"
    />
    <liveQuit v-if="status == 2" />
    <liveAudience v-if="status == 2" :num="userTotal" />
    <videoBox :status="0" :size="50" v-if="false" />
    <liveChat
      ref="chatroom"
      v-if="status == 2"
      @nameClick="nameClick"
      :top="50"
      :height="40"
    />
    liveroom
    <!-- <roomUi /> -->
    <bottomBar
      v-if="!showGift && status == 2"
      @msgOut="msgOut"
      @btnGift="btnGift"
      ref="bottomBar"
    ></bottomBar>
    <!-- <div class="input">
      <input class="inputer" @keydown="keydown" type="text" v-model="msg" />
    </div> -->
    <giftPanel
      @hideGift="hideGift"
      :isActive="showGift"
      :roomId="roomId"
    ></giftPanel>
    <!-- <button class="btn" style="top: 40px" @click="joinroom">joinroom</button>
    <button class="btn" @click="goc">connect</button> -->
  </div>
</template>

<script>
import liveTitle from "../../components/baseUi/liveTitle.vue";
import liveCreate from "../../components/baseUi/liveCreate.vue";
import liveQuit from "../../components/baseUi/liveQuit.vue";
import liveChat from "../../components/baseUi/liveChat.vue";
import bottomBar from "../../components/baseUi/bottomBar.vue";
import giftPanel from "../../components/baseUi/giftPanel.vue";
import videoBox from "../../components/baseUi/videoBox.vue";
import liveAudience from "../../components/baseUi/liveAudience.vue";

import { GetQueryString } from "../../utils/utils";
import Request from "../../request/index.js";
// import CallRoom from "./callRoom/index.vue";
// import PopupInput from "../../components/PopupInput.vue";

export default {
  name: "Roomlive",
  data: function () {
    return {
      // msg: "ccc",
      videoNode: this.$refs.video,
      showGift: false,

      isAnchor: true,
      status: 2, // 0 主播开播 1 主播模式 2 观众模式
      newroom: false, //是否新建房间
      roomId: "", //本房间id
      userAvatar: "", //主播头像
      userName: "", //主播名字
      roomName: "", //房间名字
      userId: "", //主播的id
      giftNum: "", //当前主播收到的礼物总量
      isPrivate: "", //是否私密
      userTotal: "", //用户总数
    };
  },
  components: {
    liveCreate,
    liveTitle,
    videoBox,
    liveQuit,
    liveChat,
    bottomBar,
    giftPanel,
    liveAudience,
  },
  methods: {
    //创建房间
    init: function () {},
    goc: function () {
      console.log(this.$RCVoiceRoomLib.preview);
      this.$RCVoiceRoomLib.preview({
        videoNode: this.$refs.video,
      });
    },
    joinroom: function () {
      console.log("joinroom", this.$data.newroom);
      // this.$refs.chatroom.push("9527");

      if (this.$data.newroom) {
        this.$RCVoiceRoomLib.createAndJoinRoom({
          roomId: this.$data.roomId,
          roomName: this.$data.roomName,
          roomType: "live",
          videoNode: this.$refs.video,
        });
      } else {
        if (GetQueryString("isAchor")) {
          this.$RCVoiceRoomLib.joinRoom(this.$data.roomId);
        } else {
          this.$RCVoiceRoomLib.joinRoom(GetQueryString("roomid"));
        }
      }

      this.$RCVoiceRoomLib.on("MessageReceived", (m) => {
        console.log("收到消息", m);
        switch (m.messageType) {
          case "RC:TxtMsg": //收到文本消息打到公屏
            console.log("收到文本消息打到公屏");
            console.log("收到的是:", m);
            // eslint-disable-next-line no-case-declarations
            let txtMsg =
              "<span style='color:#7f7f7f'>" +
              m.content.name +
              ": </span>" +
              m.content.content;
            this.$refs.chatroom.push(txtMsg);
            break;
          case "RC:Chatroom:Gift":
            console.log("收到礼物消息", m);
            if (m.isOffLineMessage) {
              //离线礼物消息不处理
              let giftMsg =
                "<span style='color:#7f7f7f'>" +
                m.content.userName +
                "</span> 送给 " +
                "<span style='color:#7f7f7f'>" +
                m.content.targetName +
                "</span> " +
                m.content.giftName +
                " X" +
                m.content.number;
              this.$refs.chatroom.push(giftMsg);
            } else {
              let giftMsg =
                "<span style='color:#7f7f7f'>" +
                m.content.userName +
                "</span> 送给 " +
                "<span style='color:#7f7f7f'>" +
                m.content.targetName +
                "</span> " +
                m.content.giftName +
                " X" +
                m.content.number;
              this.$refs.chatroom.push(giftMsg);
              // giftId: 1
              // giftName: "小心心"
              // number: 1
              // price: 1
              // targetId: "5a7ceaf4-d3db-4559-85cc-52694c95deb3"
              // targetName: "234234"
              // userId: "4e23e2d4-42e2-4426-8c4e-7f92715d41a0"
              // userName: "3232"
            }
            break;
          default:
            break;
        }
      });
    },
    msgOut: function (msg) {
      //本地消息
      console.log("vvv", this.$store.state.userInfo.userName);
      let txtMsg = {
        name: this.$store.state.userInfo.userName, // 文本内容
        content: msg,
      };
      this.$RCVoiceRoomLib.im.messageUpdate("RC:TxtMsg", txtMsg);
      // eslint-disable-next-line no-unused-vars
      let dd = "dd?d";
      let text =
        "<span id='9527' style='color:#7f7f7f'>" +
        txtMsg.name +
        ": </span>" +
        txtMsg.content;
      this.$refs.chatroom.push(text);
      console.log("vv2v");
    },
    nameClick: function (e) {
      console.log(e, "clicked");
    },
    btnGift: function () {
      this.$data.showGift = true;
    },
    hideGift: function () {
      console.log("hid");
      this.$data.showGift = false;
    },
    startShow: function (e) {
      console.log("上报", e);

      this.$data.roomId = e.data.roomId;
      this.$data.userId = e.data.createUser.userId;
      this.$data.userAvatar = e.data.createUser.portrait; //主播头像
      this.$data.userName = e.data.createUser.userName; //主播名
      this.$data.isPrivate = e.data.isPrivate; //是否私密
      this.$data.userTotal = e.data.userTotal; //用户数量
      this.$data.status = 2; // 房间初始化成功
      if (e.code == 30016) {
        this.$data.newroom = false;
      }
      if (e.code == 10000) {
        this.$data.newroom = true;
      }
      this.joinroom();
      Request.giftList(e.data.roomId).then(async (res) => {
        if (res.data.code == 10000) {
          for (var i = 0; i < res.data.data.length; i++) {
            for (var name in res.data.data[i]) {
              if (this.$data.userId == name) {
                this.$data.giftNum = String(res.data.data[i][name]);
              }
            }
          }
        } else {
          console.warn(res.data.msg);
        }
      });
    },
  },
  created() {
    this.$RCVoiceRoomLib;
    console.log(this, this.$RCVoiceRoomLib);
    console.log(GetQueryString("roomid"));
    console.log(GetQueryString("isAnchor"));
    if (GetQueryString("isAnchor")) {
      this.$data.isAnchor = true;
      this.$data.status = 0;
    } else {
      this.joinroom();
    }
    if (GetQueryString("newroom") && GetQueryString("newroom") == "true") {
      this.$data.newroom = true;
    }
    if (GetQueryString("roomid")) {
      // this.$data.roomId = GetQueryString("roomid");
      this.$data.roomId = "9765";
    }
  },
  mounted() {
    tryPreview(this);
    function tryPreview(target) {
      if (target.$RCVoiceRoomLib && target.$RCVoiceRoomLib.rtcready) {
        target.$RCVoiceRoomLib.preview({
          videoNode: target.$refs.video,
        });
      } else {
        setTimeout(() => {
          tryPreview(target);
        }, 20);
      }
    }
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url("./index.css");
</style>