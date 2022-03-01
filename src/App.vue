<template>
  <div id="app">
    <PromptBox />
    <router-view></router-view>
  </div>
</template>

<script>
import PromptBox from "./components/PromptBox.vue";
import request from "./request/index";

export default {
  name: "App",
  data() {
    return {
      changeUserCountKey: true,
      // eslint-disable-next-line no-undef
      admin_Img: require("./assets/roomicon/Manage.png"),
      // eslint-disable-next-line no-undef
      ower_Img: require("./assets/roomicon/administrators.png"),
    };
  },
  components: {
    PromptBox,
  },
  created() {
    this.$RCVoiceRoomLib.init("pvxdm17jpw7ar");
  },
  mounted() {
    this.$RCVoiceRoomLib.on("SeatMute", () => {
      // console.log(this.$RCVoiceRoomLib.seatInfoList);
    });

    this.$RCVoiceRoomLib.on("SeatUnMute", () => {
      // console.log(this.$RCVoiceRoomLib.seatInfoList);
    });

    //座位发生变化
    this.$RCVoiceRoomLib.on("seatInfoDidUpdate", () => {
      // console.log("seatInfoDidUpdate", info);
      this.$store.dispatch("getSeatInfoList");
    });

    //房间信息发声变化
    this.$RCVoiceRoomLib.on("roomInfoDidUpdate", () => {
      this.$store.dispatch(
        "getroomTitle",
        this.$RCVoiceRoomLib.roomInfo.roomName
      );
    });

    //被踢出房间
    this.$RCVoiceRoomLib.on("RCKickUserOutRoomContent", async (parm) => {
      this.KickUserOut(parm);
    });

    //各种公屏消息
    this.$RCVoiceRoomLib.on("onMessageReceived", async (m) => {
      // console.log("onMessageReceived+++++++", m);
      //适配阻止多端登陆消息监听
      if (
        m.messageType == "RCMic:loginDeviceMsg" &&
        m.content.platform != "web"
      ) {
        this.$store.dispatch("showToast", {
          value: "移动端登陆",
          time: 2000,
        });
        if (this.$route.name == "roomHouse") {
          await this.$RCVoiceRoomLib.leaveRoom(this.$RCVoiceRoomLib._roomidcli);
        }
        if (this.$route.name != "home") {
          this.$router.replace("/home");
        }
        setTimeout(() => {
          this.$router.go(0);
        }, 2000);
      }

      //适配数美审核消息监听变更
      if (m.messageType == "RCMic:shumeiAuditFreezeMsg") {
        if (m.content.status == 1) {
          this.$store.dispatch("showToast", {
            value: m.content.message,
            time: 3000,
          });
        }
        if (m.content.status == 2) {
          if (this.$route.name == "roomHouse") {
            await this.$RCVoiceRoomLib.leaveRoom(
              this.$RCVoiceRoomLib._roomidcli
            );
          }
          if (this.$route.name != "home") {
            this.$router.replace("/home");
          }
          this.$router.go(0);
        }
      }

      if (!this.$store.state.Chatroom) {
        return;
      }
      let user = {
        userId: m.content.userId,
        userName: m.content.userName,
        ower: false,
        admin: false,
      };
      let targetuser = {};
      if (
        m.content.userId == this.$store.state.roomInformation.createUser.userId
      ) {
        user["ower"] = true;
      }

      if (
        m.content.userId in this.$store.state.GiftAndManageList["ManageObj"]
      ) {
        user["admin"] = true;
      }

      if ("targetName" in m.content) {
        targetuser = {
          targetId: m.content.targetId,
          targetName: m.content.targetName,
          admin: false,
          ower: false,
        };
        if (
          targetuser.targetId ==
          this.$store.state.roomInformation.createUser.userId
        ) {
          targetuser["ower"] = true;
        }
        if (
          targetuser.targetId in
          this.$store.state.GiftAndManageList["ManageObj"]
        ) {
          targetuser["admin"] = true;
        }
      }
      let imgower =
        "<span  style='width:20px;height:20px;display:inline-block;margin-bottom:-5px;background-image: url(" +
        this.ower_Img +
        ");  background-position: center;background-repeat: no-repeat;background-size:14px 14px'></span>";
      let imgAdmin =
        "<span  style='width:20px;height:20px;display:inline-block;margin-bottom:-5px;background-image: url(" +
        this.admin_Img +
        ");  background-position: center;background-repeat: no-repeat;background-size:14px 14px'></span>";
      let userImg = user.ower ? imgower : user.admin ? imgAdmin : "";
      let targetImg = targetuser.ower
        ? imgower
        : targetuser.admin
        ? imgAdmin
        : "";

      if ("type" in m && m.type == 1) {
        return;
      }
      switch (m.messageType) {
        case "RC:Chatroom:Gift":
          // eslint-disable-next-line no-case-declarations
          let giftMsg =
            userImg +
            "<span id='" +
            user.userId +
            "' style='color:#7f7f7f';>" +
            m.content.userName +
            "</span> 送给 " +
            targetImg +
            "<span id='" +
            targetuser.targetId +
            "'ower='" +
            targetuser.ower +
            "'admin='" +
            targetuser.admin +
            "' style='color:#7f7f7f';float: left;>" +
            targetuser.targetName +
            "</span> " +
            m.content.giftName +
            " X" +
            m.content.number;
          this.$store.state.Chatroom.push(giftMsg);
          this.$store.dispatch("giftUpdate");
          break;
        case "RC:Chatroom:Barrage":
          // eslint-disable-next-line no-case-declarations
          let Barrage =
            userImg +
            "<span id='" +
            user.userId +
            "'style='color:#7f7f7f'>" +
            user.userName +
            ": </span>" +
            m.content.content;
          this.$store.state.Chatroom.push(Barrage);
          break;
        case "RC:Chatroom:Enter":
          // eslint-disable-next-line no-case-declarations
          let Enter =
            userImg +
            "<span id='" +
            user.userId +
            "' style='color:#7f7f7f'>" +
            m.content.userName +
            "</span> 进来了";
          this.$store.state.Chatroom.push(Enter);
          break;
        case "RC:Chatroom:KickOut":
          // eslint-disable-next-line no-case-declarations
          let KickOut =
            targetImg +
            "<span id='" +
            targetuser.targetId +
            "' style='color:#7f7f7f'>" +
            m.content.targetName +
            "</span> 被 " +
            userImg +
            "<span id='" +
            user.userId +
            "' style='color:#7f7f7f'>" +
            m.content.userName +
            "</span> 踢出房间了";
          this.$store.state.Chatroom.push(KickOut);
          // this.KickUserOut(targetuser);
          break;
        case "RC:Chatroom:Admin":
          // eslint-disable-next-line no-case-declarations
          let text = m.content.isAdmin ? "成为管理员" : "被撤回管理员";
          // eslint-disable-next-line no-case-declarations
          let img = m.content.isAdmin ? imgAdmin : "";
          // eslint-disable-next-line no-case-declarations
          let Admin =
            img +
            "<span id='" +
            user.userId +
            "' style='color:#7f7f7f'>" +
            m.content.userName +
            "</span> " +
            text;
          this.$store.state.Chatroom.push(Admin);
          this.$store.dispatch("AdminUpdate");
          break;
        case "RC:Chatroom:GiftAll":
          // eslint-disable-next-line no-case-declarations
          let giftAllMsg =
            userImg +
            "<span id='" +
            user.userId +
            "' style='color:#7f7f7f';>" +
            m.content.userName +
            "</span> 全麦打赏 " +
            m.content.giftName +
            " X" +
            m.content.number;
          this.$store.state.Chatroom.push(giftAllMsg);
          this.$store.dispatch("giftUpdate");
          break;
        case "RC:Chatroom:Seats":
          // eslint-disable-next-line no-case-declarations
          let seatCounts =
            "<span>房间更换为 " +
            m.content.count +
            " 座模式，请重新上麦</span>";
          this.$store.state.Chatroom.push(seatCounts);
          this.$store.dispatch("getsetCountsChange", m.content.count + 1);
          break;
        case "RC:TxtMsg":
          // eslint-disable-next-line no-case-declarations
          let TxtMsg =
            "<span style='color:rgba(106, 159, 255, 1);'>" +
            m.content.content +
            "</span>";
          this.$store.state.Chatroom.push(TxtMsg);
          break;
        case "RC:Chatroom:Like":
          // console.log(this.$RCVoiceRoomLib);
          break;
        default:
          break;
      }
    });

    //房间人数发生变化
    this.$RCVoiceRoomLib.on("changeUserCount", () => {
      // if (this.changeUserCountKey) {
      //   this.changeUserCountKey = false;
      request
        .roomuser({
          roomId: this.$RCVoiceRoomLib._roomidcli,
        })
        .then((res) => {
          this.$store.dispatch("getRoomUserList", res.data.data);
        });
      // setTimeout(() => {
      //   this.changeUserCountKey = true;
      // }, 1000);
      // }
    });

    //申请上麦人员发生变化
    this.$RCVoiceRoomLib.on("RequestSeatListChanged", async () => {
      const arr = await this.$RCVoiceRoomLib.getRequestSeatUserIds();
      this.$store.dispatch("getRequestSeatUserIds", arr);
      if (arr.indexOf(this.$RCVoiceRoomLib.im.userId) != -1) {
        this.$store.dispatch("userHasApply", true);
      } else {
        this.$store.dispatch("userHasApply", false);
      }
    });

    //申请上麦被同意
    this.$RCVoiceRoomLib.on("RequestSeatAccepted", async () => {
      const value = await this.$RCVoiceRoomLib.findSeat();
      console.log(value);
      try {
        setTimeout(async () => {
          await this.$RCVoiceRoomLib.enterSeat(value);
          this.$store.dispatch("getSeatInfoList");
          this.$store.dispatch("showToast", {
            value: "上麦成功",
          });
        }, 200);
      } catch (error) {
        this.$store.dispatch("showToast", {
          value: "上麦失败",
        });
        console.log(error);
      }
    });

    //申请上麦被拒绝
    this.$RCVoiceRoomLib.on("RequestSeatRejected", async () => {
      this.$store.dispatch("showToast", {
        value: "申请上麦被拒绝",
      });
    });

    //说话监听(web rtc 暂不支持合流的用户区分，该功能暂不支持)
    // this.$RCVoiceRoomLib.on("speakingStatusChenge", (info) => {
    //   // console.log("speakingStatusChenge", info);
    //   // if (Number(info.speaking)) {
    //   this.$store.dispatch("getSpeakingChenge", {
    //     index: Number(info.index),
    //     speaking: Number(info.speaking),
    //   });
    //   // }
    // });

    //关闭房间
    this.$RCVoiceRoomLib.on("onVoiceRoomClosed", async () => {
      await this.$RCVoiceRoomLib
        .leaveRoom(this.$RCVoiceRoomLib._roomidcli)
        .then(() => {
          this.$store.dispatch("getSeatInfoList");
          this.$alert("当前直播已结束", {
            confirmButtonText: "确定",
            center: true,
            showClose: false,
            customClass: "customClass-Control",
            callback: () => {
              this.$router.go(-1);
            },
          });
        });
    });

    //更换背景
    this.$RCVoiceRoomLib.on("onVoiceRoomBackgroundChanged", (img) => {
      this.$store.dispatch("getroomBackground", img);
    });

    //被邀请上麦
    this.$RCVoiceRoomLib.on("onRCPickerUserSeatContent", (info) => {
      if (info.targetId == this.$RCVoiceRoomLib.im.userId) {
        if (this.$store.state.userInseat) {
          this.$store.dispatch("showToast", {
            value: "用户已经在麦位上",
          });
        } else {
          this.$confirm(
            `您被${
              info.sendUserId ==
              this.$store.state.roomInformation.createUser.userId
                ? "房主"
                : "管理员"
            }邀请上麦，是否同意？`,
            "是否同意上麦",
            {
              confirmButtonText: "同意",
              cancelButtonText: "拒绝",
              customClass: "customClass-Control",
              // center: true,
              showClose: false,
              // type: "warning",
            }
          )
            .then(async () => {
              try {
                const fintSeat = await this.$RCVoiceRoomLib.findSeat();
                await this.$RCVoiceRoomLib.enterSeat(fintSeat);
                this.$RCVoiceRoomLib.notifyVoiceRoom(
                  "VoiceRoomAgreeManagePick",
                  {
                    content: info.targetId,
                    name: "VoiceRoomAgreeManagePick",
                    totalMemberCount: 0,
                  }
                );
                setTimeout(() => {
                  this.$store.dispatch("showToast", {
                    value: "上麦成功",
                  });
                  this.$store.dispatch("getSeatInfoList");
                }, 50);
              } catch (error) {
                this.$store.dispatch("showToast", {
                  value: "上麦失败",
                });
                console.log(error);
              }
            })
            .catch(() => {
              this.$RCVoiceRoomLib.notifyVoiceRoom(
                "VoiceRoomRejectManagePick",
                {
                  content: info.targetId,
                  name: "VoiceRoomRejectManagePick",
                  totalMemberCount: 0,
                }
              );
            });
        }
      }
    });

    //收到同意邀请上麦消息
    this.$RCVoiceRoomLib.on("onVoiceRoomAgreeManagePick", () => {
      this.$store.dispatch("showToast", {
        value: "用户连线成功",
      });
    });

    //收到拒绝邀请上麦消息
    this.$RCVoiceRoomLib.on("onVoiceRoomRejectManagePick", () => {
      this.$store.dispatch("showToast", {
        value: "用户拒绝邀请",
      });
    });

    //账号被顶掉
    this.$RCVoiceRoomLib.on("onConnectioBreakOff", async () => {
      if (this.$route.name == "roomHouse") {
        await this.$RCVoiceRoomLib.leaveRoom(this.$RCVoiceRoomLib._roomidcli);
      }
      if (this.$route.name != "home") {
        this.$router.replace("/home");
      }
      this.$router.go(0);
    });

    //房间被销毁
    this.$RCVoiceRoomLib.on("onChatroomDestroyed", async () => {
      await this.$RCVoiceRoomLib
        .leaveRoom(this.$RCVoiceRoomLib._roomidcli)
        .then(() => {
          this.$store.dispatch("getSeatInfoList");
          this.$alert("当前直播已结束", {
            confirmButtonText: "确定",
            center: true,
            showClose: false,
            customClass: "customClass-Control",
            callback: () => {
              this.$router.go(-1);
            },
          });
        });
    });

    //被抱下麦
    this.$RCVoiceRoomLib.on("KickSeatReceived", () => {
      console.log("您已被抱下麦");
      this.$store.dispatch("showToast", {
        value: "您已被抱下麦",
      });
    });

    //rtc 断开连接(待机断线问题)
    this.$RCVoiceRoomLib.on("RTCPeerConnectionCloseByException", async () => {
      console.log("rtc 断开连接");
      await this.$RCVoiceRoomLib.leaveRoom(this.$RCVoiceRoomLib._roomidcli);
      this.$router.replace("/home");
      this.$router.go(0);
    });
  },
  methods: {
    KickUserOut: async function (parm) {
      if (parm.targetId == this.$RCVoiceRoomLib.im.userId) {
        await this.$RCVoiceRoomLib
          .leaveRoom(this.$RCVoiceRoomLib._roomidcli)
          .then(() => {
            this.$store.dispatch("getSeatInfoList");
            this.$router.go(-1);
            this.$store.dispatch("showToast", {
              value: "您已被踢出房间",
            });
          });
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  width: 100%;
  overflow: hidden;
  font-size: 16px;
}

.customClass-Control {
  width: 3rem !important;
}
</style>
