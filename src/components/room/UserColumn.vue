<template>
  <div id="usercilumn">
    <div
      class="usercilumnImg"
      :style="
        item['portrait']
          ? {
              backgroundImage:
                'url(' + this.$store.state.defaultAddress + item.portrait + ')',
            }
          : {
              backgroundImage:
                'url(' + this.$store.state.defaultAvatarUrl + ')',
            }
      "
    ></div>
    <div class="usercilumnName">
      <span class="usercilumnNameValue">{{ item.userName }}</span>
      <span class="usercilumnNamefoot"></span>
      <div class="usercilumnclick" @click="userclick(item)">{{ item.key }}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["item"],
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    setPopup: function (item) {
      console.log(item);
    },
    onClosed: function () {},
    userclick: async function (item) {
      switch (item.key) {
        case "接受":
          try {
            await this.$RCVoiceRoomLib.acceptRequestSeat(item.userId);
            this.$store.dispatch("showToast", {
              value: "融云 RTC: 用户连线成功",
              time: 1000,
            });
          } catch (err) {
            console.log("err:", err);
          }
          this.$emit("closeConnetWheat");
          break;
        case "邀请":
          try {
            await this.$RCVoiceRoomLib.pickUserToSeat(item.userId);
            this.$store.dispatch("showToast", {
              value: "融云 RTC: 已邀请上麦",
              time: 1000,
            });
          } catch (err) {
            console.log("err:", err);
          }
          this.$emit("closeConnetWheat");
          break;
        default:
      }
    },
  },
};
</script>
<style scoped>
#usercilumn {
  font-size: 0.17rem;
}

.usercilumnImg {
  width: 0.48rem;
  height: 0.48rem;
  border-radius: 50%;
  float: left;
  margin-top: 0.08rem;
  margin-left: 0.23rem;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.usercilumnName {
  float: left;
  width: calc(375px - 1rem);
  min-width: calc(320px - 1rem);
  text-align: left;
  height: 0.64rem;
  padding-left: 0.12rem;
  font-size: 00.17rem;
  font-weight: Medium;
  position: relative;
}

.usercilumnNameValue {
  display: inline-block;
  height: 0.24rem;
  line-height: 0.24rem;
  margin-top: 0.24rem;
}

.usercilumnNamefoot {
  display: inline-block;
  width: 100%;
  position: absolute;
  height: 0.01rem;
  background: white;
  opacity: 0.1;
  bottom: 0;
  left: 0;
}

.usercilumnclick {
  width: 0.64rem;
  height: 0.4rem;
  text-align: center;
  line-height: 0.4rem;
  position: absolute;
  right: 0.13rem;
  top: 0.12rem;
  border-radius: 0.2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.14rem;
}
</style>