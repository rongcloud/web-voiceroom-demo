<template>
  <div class="mainContainer">
    <div class="input">
      <input
        class="inputer"
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
        v-if="this.$store.state.RequestSeatUserIds.length"
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
  </div>
</template>
<script>
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
    };
  },
  props: {
    msgContent: String,
  },
  created() {},
  mounted() {},
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
    send: function () {
      this.$emit("msgOut", this.$data.msg);
      this.$data.msg = "";
      this.$data.onInput = false;
    },
    focus: function () {
      this.$data.onInput = true;
    },
    blur: function () {
      setTimeout(() => {
        this.$data.onInput = false;
        this.$data.msg = "";
      }, 200);
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
  width: 375px;
  min-width: none;
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
  left: 10px;
  line-height: 36px;
  width: 48px;
  color: #fff;
  background: none;
  border: none;
}
.inputing {
  background: #fff !important;
  width: 33.75vh;
  max-width: 280px;
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