<template>
  <div class="topContaniner" :class="{ audience: !isAnchor }">
    <img class="avatar" :src="userAvatar" />
    <div class="title">{{ title }}</div>
    <div
      class="followBtn"
      :class="{ followed: !this.$store.state.isFollowed }"
      @click="follow"
      v-if="!isAnchor"
    >
      <span v-if="!this.$store.state.isFollowed">关注</span>
      <span v-if="this.$store.state.isFollowed">已关注</span>
    </div>
    <div class="subtitle">
      <img
        v-if="delay < 100"
        class="icon"
        width="8.5px"
        height="6.5px"
        :src="require('../../assets/live/delay-icon-1.png')"
      />
      <img
        v-if="delay >= 100 && delay < 290"
        class="icon"
        width="8.5px"
        height="6.5px"
        :src="require('../../assets/live/delay-icon-2.png')"
      />
      <img
        v-if="delay >= 290"
        class="icon"
        width="8.5px"
        height="6.5px"
        :src="require('../../assets/live/delay-icon-3.png')"
      />
      {{ delay }}
    </div>
    <div class="subContainer">
      <div class="subBox" @click="clickNotice">
        <img
          class="icon"
          width="14px"
          height="16px"
          :src="require('../../assets/live/icon-notice.png')"
        />公告
      </div>
      <div class="subBox">
        <img
          class="icon"
          width="14px"
          height="14px"
          :src="require('../../assets/live/icon-gift.png')"
        />{{ giftNum }}
      </div>
    </div>
  </div>
</template>
<script>
import Request from "../../request/index.js";
export default {
  data: function () {
    return {};
  },
  props: {
    title: String,
    isAnchor: Boolean,
    onlineNum: String,
    giftNum: Number,
    userAvatar: String,
    delay: Number,
  },
  methods: {
    clickNotice: function () {
      this.$emit("clickNotice");
    },
    follow: function () {
      // this.$RCVoiceRoomLib.getLatestSeatInfo();
      Request.follow({ userId: this.$store.state.roomInformation.userId }).then(
        (res) => {
          if (res.data.code == 10000) {
            console.log("关注");
            this.$store.state.isFollowed = !this.$store.state.isFollowed;
          }
        }
      );
      //console.log(this.$RCVoiceRoomLib);
    },
  },
  mounted() {
    Request.getFollowList().then((res) => {
      if (res.data.code == 10000) {
        for (var i = 0; i < res.data.data.list.length; i++) {
          if (
            res.data.data.list[i].userId ==
            this.$store.state.roomInformation.userId
          ) {
            this.$store.state.isFollowed = true;
          }
        }
      }
    });
  },
};
</script>
<style scoped>
.topContaniner {
  position: absolute;
  z-index: 100;
  top: 30px;
  border-radius: 20px;
  left: 12px;
  min-width: 136px;
  height: 40px;
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  text-align: left;
  padding-left: 12px;
}
.audience {
  width: 200px;
}
.title {
  position: absolute;
  font-size: 16px;
  left: 48px;
  top: 3px;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  display: inline-block;
  width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0px;
  text-align: left;
}
.subtitle {
  position: absolute;
  font-size: 9px;
  font-style: normal;
  font-weight: 400;
  text-align: left;
  left: 48px;
  top: 24px;
}
.avatar {
  width: 40px;
  height: 40px;
  left: 0px;
  position: absolute;
  border-radius: 20px;
  border: none;
}
.subContainer {
  position: absolute;
  top: 40px;
  padding: 8px;
  margin-left: -18px;
  width: 100%;
  font-size: 12px;
}
.subBox {
  height: 22px;
  float: left;
  line-height: 22px;
  font-size: 12px;
  padding: 0px 8px 0px 8px;
  text-align: center;
  margin-right: 6px;
  width: auto;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.25);
}
.icon {
  display: inline-block;
  vertical-align: middle;
}
.followBtn {
  width: 48px;
  height: 28px;
  position: absolute;
  right: 6px;
  top: 6px;
  line-height: 28px;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  border-radius: 14px;
  background: none;
  border: #d5d5d5 1px solid;
}
.followed {
  background: linear-gradient(90deg, #505dff 0%, #e92b88 100%);
  border: none;
}
</style>