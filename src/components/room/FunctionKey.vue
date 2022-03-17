<template>
  <span
    class="functionKey"
    @click="clickFunctionKey(item, userInfo)"
    :style="{
      backgroundImage: item.img,
    }"
  >
    <span class="functionKey-span">{{ item.value }}</span>
    <PopuInput
      ref="PopuInput"
      @clickYes="clickYes"
      @clickTitleYes="clickTitleYes"
    />
    <Notice ref="Notice" @clickYes="GetNotice" />
  </span>
</template>
<script>
import request from "../../request/index";
import PopuInput from "../PopupInput.vue";
import Notice from "./Notice.vue";

export default {
  props: ["item", "userInfo"],
  data() {
    return {
      type: "",
      // eslint-disable-next-line no-undef
      url: require("../../assets/roomicon/CloseRoom.png"),
    };
  },
  watch: {},
  components: {
    PopuInput,
    Notice,
  },
  created() {},
  mounted() {},
  methods: {
    clickFunctionKey: async function (item, userInfo) {
      let txtMsgKickOut = null;
      let seatcountChange = null;
      switch (item.value) {
        case "关闭房间":
          try {
            await this.$RCVoiceRoomLib
              .leaveRoom(this.$RCVoiceRoomLib._roomidcli)
              .then(async () => {
                request
                  .deleteRoom({
                    roomId: this.$RCVoiceRoomLib._roomidcli,
                  })
                  .then(() => {
                    this.$router.go(-1);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
          } catch (error) {
            this.$store.dispatch("showToast", {
              value: "关闭房间失败",
            });
            console.log(error);
          }
          break;
        case "离开房间":
          try {
            await this.$RCVoiceRoomLib
              .leaveRoom(this.$RCVoiceRoomLib._roomidcli)
              .then(() => {
                this.$router.go(-1);
              });
          } catch (error) {
            this.$store.dispatch("showToast", {
              value: "离开房间失败",
            });
            console.log(error);
          }

          break;
        case "房间上锁":
          this.$emit("closeRoomFit");
          this.$refs.PopuInput.setPopup({
            type: "number",
            title: "请输入 4 位数字密码",
            placeholder: "请输入 4 位数字密码",
          });
          break;
        case "房间解锁":
          this.$emit("closeRoomFit");
          request
            .setRoomPrivate({
              isPrivate: 0,
              password: "",
              roomId: this.$RCVoiceRoomLib._roomidcli,
            })
            .then((res) => {
              if (res.data.code == 10000) {
                this.$store.dispatch("showToast", {
                  value: "取消成功",
                });
                this.$store.dispatch("getroomPrivate", {
                  isPrivate: 0,
                  password: "",
                });
              }
            });

          break;
        case "房间标题":
          this.$emit("closeRoomFit");
          this.$refs.PopuInput.setPopup({
            type: "string",
            title: "修改房间标题",
            value: this.$store.state.roomTitle,
            // value: "",
            placeholder: "请输入房间标题",
          });
          break;
        case "房间公告":
          this.$emit("closeRoomFit");
          this.$refs.Notice.setPopup({
            isShow: true,
            value: this.$RCVoiceRoomLib.roomInfo["extra"]
              ? this.$RCVoiceRoomLib.roomInfo["extra"]
              : "欢迎来到 " + this.$RCVoiceRoomLib.roomInfo["roomName"],
          });
          break;
        case "房间背景":
          this.$emit("closeRoomFit");
          this.$emit("openChangeBack");
          break;
        case "自由上麦":
          this.$emit("closeRoomFit");
          await this.$RCVoiceRoomLib.setRoomInfo({
            ...this.$RCVoiceRoomLib.roomInfo,
            isFreeEnterSeat: true,
          });
          this.$store.dispatch("showToast", {
            value: "融云 RTC：当前观众可自由上麦",
          });

          break;
        case "申请上麦":
          this.$emit("closeRoomFit");
          await this.$RCVoiceRoomLib.setRoomInfo({
            ...this.$RCVoiceRoomLib.roomInfo,
            isFreeEnterSeat: false,
          });
          this.$store.dispatch("showToast", {
            value: "融云 RTC：当前观众上麦上麦要申请",
          });

          break;
        case "全麦锁麦":
          try {
            this.$emit("closeRoomFit");
            this.$RCVoiceRoomLib
              .setRoomInfo({
                ...this.$RCVoiceRoomLib.roomInfo,
                isMuteAll: true,
              })
              .then(() => {
                // console.log("setRoomInfo", this.$RCVoiceRoomLib);
              });
            setTimeout(() => {
              this.$store.dispatch("getSeatInfoList");
              this.$store.dispatch("showToast", {
                value: "融云 RTC:全部麦位已静音",
              });
            }, 50);
          } catch (error) {
            this.$store.dispatch("showToast", {
              value: "全麦锁麦失败",
            });

            console.log(error);
          }

          break;
        case "解锁全麦":
          this.$emit("closeRoomFit");
          try {
            await this.$RCVoiceRoomLib.setRoomInfo({
              ...this.$RCVoiceRoomLib.roomInfo,
              isMuteAll: false,
            });
            setTimeout(() => {
              this.$store.dispatch("getSeatInfoList");
              this.$store.dispatch("showToast", {
                value: "融云 RTC:已解锁全麦",
              });
            }, 50);
          } catch (error) {
            this.$store.dispatch("showToast", {
              value: "解锁全麦失败",
            });
            console.log(error);
          }

          break;
        case "全麦锁座":
          this.$emit("closeRoomFit");
          try {
            await this.$RCVoiceRoomLib.setRoomInfo({
              ...this.$RCVoiceRoomLib.roomInfo,
              isLockAll: true,
            });
            setTimeout(() => {
              this.$store.dispatch("getSeatInfoList");
              this.$store.dispatch("showToast", {
                value: "融云 RTC：全部座位已锁定",
              });
            }, 50);
          } catch (error) {
            this.$store.dispatch("showToast", {
              value: "全麦锁座失败",
            });
            console.log(error);
          }

          break;
        case "解锁全座":
          this.$emit("closeRoomFit");
          try {
            await this.$RCVoiceRoomLib.setRoomInfo({
              ...this.$RCVoiceRoomLib.roomInfo,
              isLockAll: false,
            });
            setTimeout(() => {
              this.$store.dispatch("getSeatInfoList");
              this.$store.dispatch("showToast", {
                value: "融云 RTC：已解锁全座",
              });
            }, 50);
          } catch (error) {
            this.$store.dispatch("showToast", {
              value: "解锁全座失败",
            });
            console.log(error);
          }

          break;
        case "静音":
          await this.$RCVoiceRoomLib.muteAllRemoteStreams(true);
          this.$store.dispatch("getMicrophone", true);
          this.$store.dispatch("showToast", {
            value: "融云 RTC:扬声器已静音",
          });
          this.$emit("closeRoomFit");
          break;
        case "取消静音":
          await this.$RCVoiceRoomLib.muteAllRemoteStreams(false);
          this.$store.dispatch("getMicrophone", false);
          this.$store.dispatch("showToast", {
            value: "融云 RTC：已取消静音",
          });
          this.$emit("closeRoomFit");
          break;
        case "设置4个座位":
          this.$emit("closeRoomFit");
          try {
            await this.$RCVoiceRoomLib.setRoomInfo({
              ...this.$RCVoiceRoomLib.roomInfo,
              seatCount: 5,
            });
            setTimeout(() => {
              this.$store.dispatch("getSeatInfoList");
              seatcountChange = {
                count: 4,
              };
              this.$RCVoiceRoomLib.im.messageUpdate(
                "RC:Chatroom:Seats",
                seatcountChange
              );

              this.$RCVoiceRoomLib.emit("MessageReceived", {
                //发本地
                //模拟本地消息发送
                messageType: "RC:Chatroom:Seats",
                content: seatcountChange,
              });
            }, 200);
          } catch (error) {
            this.$store.dispatch("showToast", {
              value: "设置4个座位失败",
            });
            console.log(error);
          }

          break;
        case "设置8个座位":
          this.$emit("closeRoomFit");
          try {
            await this.$RCVoiceRoomLib.setRoomInfo({
              ...this.$RCVoiceRoomLib.roomInfo,
              seatCount: 9,
            });

            setTimeout(() => {
              this.$store.dispatch("getSeatInfoList");
              seatcountChange = {
                count: 8,
              };
              this.$RCVoiceRoomLib.im.messageUpdate(
                "RC:Chatroom:Seats",
                seatcountChange
              );

              this.$RCVoiceRoomLib.emit("MessageReceived", {
                //发本地
                //模拟本地消息发送
                messageType: "RC:Chatroom:Seats",
                content: seatcountChange,
              });
            }, 200);
          } catch (error) {
            this.$store.dispatch("showToast", {
              value: "设置8个座位失败",
            });
            console.log(error);
          }

          break;
        case "屏蔽词":
          this.$emit("closeRoomFit");
          this.$emit("openShieldingWords");
          break;
        case "抱下麦":
          this.$emit("closeUserClickSeizeSeat");
          this.$emit("closeAdminClickOther");
          try {
            await this.$RCVoiceRoomLib.kickUserFromSeat(userInfo.userId);
            setTimeout(() => {
              this.$store.dispatch("getSeatInfoList");
            }, 200);
          } catch (error) {
            this.$store.dispatch("showToast", {
              value: "抱下麦失败",
            });
            console.log(error);
          }

          break;
        case "邀请上麦":
          await this.$RCVoiceRoomLib.pickUserToSeat(userInfo.userId);
          this.$emit("closeUserClickSeizeSeat");
          this.$emit("closeAdminClickOther");
          break;
        case "关闭座位":
          try {
            await this.$RCVoiceRoomLib.lockSeat(userInfo.index, true);
            setTimeout(() => {
              this.$store.dispatch("getSeatInfoList");
            }, 50);
          } catch (error) {
            this.$store.dispatch("showToast", {
              value: "关闭座位失败",
            });
            console.log(error);
          }

          this.$emit("closeUserClickSeizeSeat");
          break;
        case "开启座位":
          try {
            await this.$RCVoiceRoomLib.lockSeat(userInfo.index, false);
            setTimeout(() => {
              this.$store.dispatch("getSeatInfoList");
            }, 50);
          } catch (error) {
            this.$store.dispatch("showToast", {
              value: "开启座位失败",
            });
            console.log(error);
          }

          this.$emit("closeUserClickSeizeSeat");
          break;
        case "取消禁麦":
          try {
            await this.$RCVoiceRoomLib.muteSeat(userInfo.index, false);

            setTimeout(() => {
              this.$store.dispatch("getSeatInfoList");
            }, 200);
          } catch (error) {
            this.$store.dispatch("showToast", {
              value: "取消禁麦失败",
            });
            console.log(error);
          }

          this.$emit("closeUserClickSeizeSeat");
          break;
        case "座位禁麦":
          try {
            await this.$RCVoiceRoomLib
              .muteSeat(userInfo.index, true)
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });
            setTimeout(() => {
              this.$store.dispatch("getSeatInfoList");
            }, 200);
          } catch (error) {
            this.$store.dispatch("showToast", {
              value: "座位禁麦失败",
            });
            console.log(error);
          }

          this.$emit("closeUserClickSeizeSeat");
          break;
        case "踢出房间":
          await this.$RCVoiceRoomLib.kickUserFromRoom(userInfo.userId);
          // console.log(userInfo);
          txtMsgKickOut = {
            targetName: userInfo.userName,
            targetId: userInfo.userId,
            userId: this.$RCVoiceRoomLib.im.userId,
            userName: this.$store.state.userInfo.userName,
          };
          this.$RCVoiceRoomLib.im.messageUpdate(
            "RC:Chatroom:KickOut",
            txtMsgKickOut
          );

          this.$RCVoiceRoomLib.emit("MessageReceived", {
            //发本地
            //模拟本地消息发送
            messageType: "RC:Chatroom:KickOut",
            content: txtMsgKickOut,
          });
          this.$emit("closeUserClickSeizeSeat");
          this.$emit("closeAdminClickOther");
          break;
        default:
      }
    },
    clickYes: function (value) {
      // console.log("roomKey", value);
      request
        .setRoomPrivate({
          isPrivate: 1,
          password: value,
          roomId: this.$RCVoiceRoomLib._roomidcli,
        })
        .then((res) => {
          // console.log(res);
          if (res.data.code == 10000) {
            this.$store.dispatch("showToast", {
              value: "设置成功",
            });
            this.$store.dispatch("getroomPrivate", {
              isPrivate: 1,
              password: value,
            });
          }
        });
    },
    clickTitleYes: function (value) {
      // console.log("Title", value);
      request
        .setRoomTitle({
          name: value,
          roomId: this.$RCVoiceRoomLib._roomidcli,
        })
        .then((res) => {
          // console.log(res);
          if (res.data.code == 10000) {
            this.$RCVoiceRoomLib.setRoomInfo({
              ...this.$RCVoiceRoomLib.roomInfo,
              roomName: value,
            });
            this.$store.dispatch("getroomTitle", value);
          } else {
            this.$store.dispatch("showToast", {
              value: res.data.msg,
            });
          }
        });
    },
    GetNotice: function (value) {
      this.$RCVoiceRoomLib.setRoomInfo({
        ...this.$RCVoiceRoomLib.roomInfo,
        extra: value,
      });
      this.$RCVoiceRoomLib.roomInfo.extra = value;
      let txt = {
        content: "房间公告已更新!",
      };
      this.$RCVoiceRoomLib.im.messageUpdate("RC:TxtMsg", txt);

      this.$RCVoiceRoomLib.emit("MessageReceived", {
        //发本地
        //模拟本地消息发送
        messageType: "RC:TxtMsg",
        content: txt,
      });
    },
  },
};
</script>
<style scoped>
.functionKey {
  display: inline-block;
  width: 0.5rem;
  height: 0.75rem;
  position: relative;
  background-repeat: no-repeat;
  background-size: 0.5rem 0.5rem;
  background-position: top;
  text-align: center;
}
.functionKey-span {
  display: inline-block;
  height: 0.17rem;
  font-size: 0.12rem;
  line-height: 0.17rem;
  margin-top: 0.58rem;
}
</style>
