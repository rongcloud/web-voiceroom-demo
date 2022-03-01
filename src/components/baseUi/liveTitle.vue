<template>
  <div class="mainContainer" :class="{ audience: !isAnchor }">
    <img class="avatar" :src="userAvatar" />
    <div class="title">{{ title }}</div>
    <div class="followBtn" v-if="!isAnchor">关注</div>
    <div class="subtitle">
      <img
        class="icon"
        width="8.5px"
        height="6.5px"
        :src="require('../../assets/live/delay-icon-1.png')"
      />
      {{ delay }}
    </div>
    <div class="subContainer">
      <div class="subBox">
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
export default {
  data: function () {
    return {};
  },
  props: {
    title: String,
    isAnchor: Boolean,
    onlineNum: String,
    giftNum: String,
    userAvatar: String,
    delay: String,
  },
};
</script>
<style scoped>
.mainContainer {
  position: absolute;
  top: 30px;
  border-radius: 20px;
  left: 12px;
  width: 124px;
  height: 40px;
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  text-align: left;
  padding-left: 12px;
}
.audience {
  width: 168px;
}
.title {
  position: absolute;
  font-size: 16px;
  left: 48px;
  top: 3px;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;

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
  background: linear-gradient(90deg, #505dff 0%, #e92b88 100%);
  position: absolute;
  right: 6px;
  top: 6px;
  line-height: 28px;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  border-radius: 14px;
}
</style>