<template>
  <div class="mainContainer">
    <div v-if="recing" class="sending">
      <div class="sendingIcon"></div>
      <div class="sendingText">录音中,滑动取消</div>
    </div>
    <div class="bg" @click="inputBgClick" v-if="onInput" />
    <div class="input">
      <div
        class="iconVoice"
        v-if="!this.$store.state.creatUser"
        @mousedown="startRec"
        @mouseleave="cancelRec"
        @mouseup="endRec"
      ></div>
      <input
        class="inputer"
        id="inputer"
        :class="{ inputing: onInput }"
        placeholder="聊聊吧…"
        @blur="blur"
        @focus="focus"
        @keydown="keydown"
        type="text"
        ref="inputer"
        v-model="msg"
      />
    </div>
    <div
      class="btnApply"
      v-if="!onInput && this.$store.state.creatUser"
      @click="ApplyWeatModel"
    >
      <img
        src="../../assets/live/icon-bottom-apply.png"
        width="36px"
        height="36px"
      />
      <span
        v-if="this.$store.state.RequestSeatUserIds.length > 0"
        class="applySpan"
      >
        <div class="applySpanValue">
          {{ this.$store.state.RequestSeatUserIds.length }}
        </div>
      </span>
    </div>
    <div class="btn btnSend" @click="send" v-if="onInput">发送</div>
    <div
      class="btn"
      v-if="!onInput && this.$store.state.creatUser"
      @click="SetupModel"
    >
      <img
        src="../../assets/live/icon-bottom-setup.png"
        width="36px"
        height="36px"
      />
    </div>
    <div class="btn" v-if="!onInput" @click="setMsg">
      <img
        src="../../assets/live/icon-bottom-msg.png"
        width="36px"
        height="36px"
      />
    </div>
    <div class="btn" v-if="!onInput" @click="btnGift" ref="GiftSpace">
      <img
        src="../../assets/live/icon-bottom-gift.png"
        width="36px"
        height="36px"
      />
    </div>
    <!-- <div class="btn" v-if="!onInput">
      <img
        src="../../assets/live/icon-bottom-setting.png"
        width="36px"
        height="36px"
      />
    </div> -->
    <div
      class="btn"
      v-if="!onInput && !this.$store.state.creatUser"
      @click="ApplyWeat"
    >
      <img
        :src="
          this.$store.state.userInseat
            ? settingSeat
            : this.$store.state.HasApply
            ? waitUpSeat
            : applyUpSeat
        "
        width="36px"
        height="36px"
      />
    </div>
    <!-- <div
      class="btn"
      v-if="!onInput && this.$store.state.onLink"
      @click="quitSeat"
    >
      <img :src="optionImg" width="36px" height="36px" />
    </div> -->
  </div>
</template>
<script>
import { Recorder } from "../../utils/utils";
export default {
  name: "bottomBar",
  data: function () {
    return {
      msg: "",
      // resGite:'',
      onInput: false,
      // eslint-disable-next-line no-undef
      applyUpSeat: require("../../assets/live/apply-up-seat.png"),
      // eslint-disable-next-line no-undef
      waitUpSeat: require("../../assets/live/icon-bottom-waitseat.png"),
      // eslint-disable-next-line no-undef
      settingSeat: require("../../assets/live/icon-bottom-setting.png"),
      // eslint-disable-next-line no-undef
      optionImg: require("../../assets/live/icon-bottom-option.png"),
      inChina: false, // 中文输入法工作状态
      recing: false, //录音中状态
    };
  },
  props: {
    msgContent: String,
  },
  created() {},

  mounted() {
    let that = this;
    document.getElementById("inputer").addEventListener(
      "compositionstart",
      function () {
        that.$data.inChina = true;
      },
      false
    );
    document.getElementById("inputer").addEventListener(
      "compositionend",
      function () {
        that.$data.inChina = false;
      },
      false
    );
  },
  methods: {
    keydown: function (e) {
      if (e.key == "Enter") {
        let value = this.$data.msg;
        const that = this;
        setTimeout(() => {
          if (value == this.$data.msg && this.$data.msg != "") {
            that.$emit("msgOut", this.$data.msg);
            that.$data.msg = "";
          }
        }, 50);
      }
      if (e.key == "Escape") {
        this.$data.onInput = false;
      }
    },
    inputBgClick: function () {
      this.$data.onInput = false;
    },
    startRec: function () {
      this.$data.recing = true;
      Recorder.start();
    },
    cancelRec: function () {
      this.$data.recing = false;
      Recorder.cancel();
    },
    endRec: function () {
      console.log("name", this.$store.state.userInfo.userName);
      this.$data.recing = false;
      Recorder.stop({
        userId: this.$RCVoiceRoomLib.im.userId,
        userName: this.$store.state.userInfo.userName,
        im: this.$RCVoiceRoomLib.im,
        chatroom: this.$store.state.Chatroom,
      });
    },
    send: function () {
      this.$emit("msgOut", this.$data.msg);
      this.$data.msg = "";
      this.$data.onInput = false;
    },
    focus: function () {
      this.$data.onInput = true;
    },
    blur: function () {
      // setTimeout(() => {
      //   this.$data.onInput = false;
      //   this.$data.msg = "";
      // }, 200);
    },
    btnGift: function () {
      this.$emit("btnGift");
    },
    // 添加事件
    //点击排麦model
    ApplyWeatModel: function () {
      this.$emit("ApplyWeatModel");
    },
    //点击设置model
    SetupModel: function () {
      this.$emit("SetupModel");
    },
    //请求排麦与否
    ApplyWeat: function () {
      if (!this.$store.state.userInseat) {
        this.$emit("ApplyWeat");
      }
    },
    //私信消息
    setMsg: function () {
      this.$store.dispatch("showToast", {
        value: "功能待开放",
      });
    },
    //展示退出座位界面
    quitSeat: function () {
      console.log("quitseat");
      this.$emit("quitSeat");
    },
    //弹射礼物
    giftShow: function () {
      // let num = Math.floor(Math.random() * 10 + 1);
      // console.log(num);
    },
  },
};
</script>
<style scoped>
.mainContainer {
  position: absolute;
  bottom: 0px;
  height: 52px;
  width: 100%;
  background: linear-gradient(90deg, #d5408a -186.8%, #1a1d3d 69.32%);
}
.bg {
  position: fixed;
  top: 0px;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0);
}
.input {
  position: absolute;
  float: left;
  bottom: 8px;
  left: 12px;
  width: 105px;
  height: 36px;
  border-radius: 70px;
  background: rgba(255, 255, 255, 0.26);
}

.inputer {
  position: absolute;
  left: 30px;
  line-height: 36px;
  width: 48px;
  color: #fff;
  background: none;
  border: none;
}
.inputing {
  background: #fff !important;
  width: 40vh;
  left: 0px;
  border-radius: 4px;
}
input::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}
input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: rgba(255, 255, 255, 0.8);
}
input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: rgba(255, 255, 255, 0.8);
}
input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: rgba(255, 255, 255, 0.8);
}
:focus {
  outline: none;
  color: #333;
}
.iconVoice {
  position: absolute;
  top: 7px;
  left: 13px;
  background: url("../../assets/live/mic.png") no-repeat;
  background-size: 17px 21px;
  width: 17px;
  height: 21px;
  float: left;
}
.btn {
  position: relative;
  float: right;
  text-align: center;
  vertical-align: center;
  font-size: 12px;
  margin: 8px 6px 8px 6px;
  width: 36px;
  height: 36px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
}
.btnSend {
  background: linear-gradient(180deg, #e92b88 10%, #505dff 100%);
  color: #fff;
  top: 2px;
  width: 55px;
  height: 31px;
  line-height: 31px;
  cursor: pointer;
  z-index: 1000000;
}
.sending {
  width: 160px;
  height: 160px;
  position: fixed;
  margin-left: -80px;
  margin-top: -80px;
  top: 50%;
  left: 50%;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}
.sendingIcon {
  width: 100px;
  height: 100px;
  margin: 30px;
  background: url("../../assets/live/micbig.png");
  background-size: 100px 100px;
  background-attachment: inherit;
  background-position: center;
}
.sendingText {
  width: 160px;
  margin-top: -27px;
  text-align: center;
  color: #fff;
}
/* 附加 */

.btnApply {
  position: absolute;
  bottom: 8px;
  left: 132px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.26);
}
.btnApply .applySpan {
  position: absolute;
  bottom: 24px;
  left: 28px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  z-index: 10;
  background: rgba(233, 43, 136, 1);
  text-align: center;
  line-height: 14px;
}
.btnApply .applySpan .applySpanValue {
  font-size: 12px;
  transform: scale(0.82);
  color: white;
}
</style>