<template>
  <div class="bg">
    <div
      id="app"
      class="app"
      v-bind:style="{
        height: dh + 'px',
        width: dw + 'px',
        maxWidth: dw + 'px',
      }"
    >
      <PromptBox />
      <router-view></router-view>
    </div>
  </div>
</template><script>
import PromptBox from "./components/PromptBox.vue";
import request from "./request/index";
import config from "./config";
export default {
  name: "App",
  data() {
    return {
      changeUserCountKey: true,
      // eslint-disable-next-line no-undef
      admin_Img: require("./assets/roomicon/Manage.png"),
      // eslint-disable-next-line no-undef
      ower_Img: require("./assets/roomicon/administrators.png"),

      // eslint-disable-next-line no-undef
      voice_Img: require("./assets/live/icon-voice.png"),
      cooldown: 0,
      url: window.location.href,
      dw: 600,
      dh: 600,
    };
  },

  components: {
    PromptBox,
  },

  created() {
    // window.rc = this.$RCVoiceRoomLib;online
    // this.$RCVoiceRoomLib.init({ AppKey: config.appKey.online });
    this.$RongIMLib.init({
      appkey: config.appKey.online,
    });
    const rtcClient = this.$RongIMLib.installPlugin(
      this.$RongRTCLib.installer,
      {}
    );
    this.$RCVoiceRoomLib.init({
      RongIMLib: this.$RongIMLib,
      RongRTCLib: rtcClient,
    });
    this.$RCLiveRoomLib.init(config.appKey.online);
    window.rc = this.$RCLiveRoomLib;
    // window.cc = this.$RCVoiceRoomLib;
    // console.log("getua", navigator.userAgent);
    // var customUserAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36`;
    // //修改后的userAgent
    // Object.defineProperty(navigator, "userAgent", {
    //   value: customUserAgent,
    //   writable: false,
    // });
    //Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36
    // if (
    //   navigator.userAgent ==
    //   "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
    // ) {
    //   var customUserAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36`;
    //   //修改后的userAgent
    //   Object.defineProperty(navigator, "userAgent", {
    //     value: customUserAgent,
    //     writable: false,
    //   });
    //   //打印
    //   console.log("getuamodifiy", navigator.userAgent);
    // } else {
    //   console.log("使用默认ua", navigator.userAgent);
    // }
  },
  // mounted() {
  //   this.$data.dw = window.innerHeight * 0.5625;
  //   this.$data.dh = window.innerHeight;
  //   window.onresize = () => {
  //     console.log("resiz");
  //     var browser = {
  //       versions: (function () {
  //         var u = navigator.userAgent;
  //         return {
  //           //移动终端浏览器版本信息
  //           trident: u.indexOf("Trident") > -1, //IE内核
  //           presto: u.indexOf("Presto") > -1, //opera内核
  //           webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
  //           gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
  //           mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
  //           ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
  //           android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或uc浏览器
  //           iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
  //           iPad: u.indexOf("iPad") > -1, //是否iPad
  //           webApp: u.indexOf("Safari") == -1, //是否web应该程序，没有头部与底部
  //         };
  //       })(),
  //       language: (
  //         navigator.browserLanguage || navigator.language
  //       ).toLowerCase(),
  //     };
  //     if (browser.versions.mobile) {
  //       //手机端不给重置页面 防止输入法 弹出某些页面会乱
  //     } else {
  //       console.log("pcreseize");
  //       this.$data.dw = window.innerHeight * 0.5625;
  //       this.$data.dh = window.innerHeight;
  //     }
  //     console.log(browser);
  //   };
  // },

  mounted() {
    var browser = {
      versions: (function () {
        var u = navigator.userAgent;
        return {
          //移动终端浏览器版本信息
          trident: u.indexOf("Trident") > -1, //IE内核
          presto: u.indexOf("Presto") > -1, //opera内核
          webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
          gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
          mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
          ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
          android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或uc浏览器
          iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
          iPad: u.indexOf("iPad") > -1, //是否iPad
          webApp: u.indexOf("Safari") == -1, //是否web应该程序，没有头部与底部
        };
      })(),
      language: (navigator.browserLanguage || navigator.language).toLowerCase(),
    };

    if (browser.versions.mobile) {
      //手机初始化
      if (screen.height * 0.5625 > screen.width) {
        this.$data.dw = screen.width;
      } else {
        this.$data.dw = screen.height * 0.5625;
      }
      this.$data.dh = screen.height;
    } else {
      //pc初始化
      this.$data.dw = 375;
      this.$data.dh = window.innerHeight;
    }
    window.onresize = () => {
      // console.log("resiz");
      var deviceWidth =
        document.documentElement.clientWidth || window.innerWidth;
      if (deviceWidth >= 375) {
        deviceWidth = 375;
      }
      if (deviceWidth <= 320) {
        deviceWidth = 320;
      }
      document.documentElement.style.fontSize = deviceWidth / 3.75 + "px";

      if (browser.versions.mobile) {
        //手机端不给重置页面 防止输入法 弹出某些页面会乱
      } else {
        // console.log("pcreseize");
        this.$data.dw = 375;
        this.$data.dh = window.innerHeight;
        // this.$data.dw = window.innerHeight * 0.5625;
        // this.$data.dh = window.innerHeight;
      }
      // console.log(this.$data.dh, this.$data.dw);
    };
    //*****************语聊房监听回调*******************
    //语聊房被静音/取消静音回调
    // this.$RCVoiceRoomLib.on("SeatMute", (Mute) => {
    //   console.log("Mute", Mute);
    // });

    //语聊房座位发生变化
    this.$RCVoiceRoomLib.on("seatInfoDidUpdate", () => {
      // console.log(this.$RCVoiceRoomLib.seatInfoList);
      this.$store.dispatch("getSeatInfoList");
    });

    //语聊房房间信息发声变化
    this.$RCVoiceRoomLib.on("roomInfoDidUpdate", (roomInfo) => {
      // console.log(roomInfo);
      // console.log(this.$RCVoiceRoomLib.roomInfo);
      this.$store.dispatch("getroomTitle", roomInfo.roomName);
    });

    //语聊房被踢出房间
    this.$RCVoiceRoomLib.on("RCKickUserOutRoomContent", async (parm) => {
      // this.KickUserOut(parm);
      this.$store.dispatch("getSeatInfoList");
      this.$router.go(-1);
      this.$store.dispatch("showToast", {
        value: "您已被踢出房间",
      });
    });

    //语聊房各种公屏消息
    this.$RCVoiceRoomLib.on("MessageReceived", async (m) => {
      // let m = message.messages[0];
      console.log("MessageReceived", m);
      //适配阻止多端登陆消息监听
      if (m.messageType == "RCMic:loginDeviceMsg" && !m.isOffLineMessage) {
        if (m.content.platform != "web") {
          this.$store.dispatch("showToast", {
            value: "移动端登陆",
            time: 2000,
          });

          if (this.$route.name != "login") {
            this.$router.replace("/login");
          }

          if (this.$route.name == "roomHouse") {
            await this.$RCVoiceRoomLib.leaveRoom(
              this.$RCVoiceRoomLib._roomidcli
            );
          }
          if (this.$route.name == "liveRoom") {
            await this.$RCLiveRoomLib.leaveRoom(this.$RCLiveRoomLib._roomidcli);
          }
          // setTimeout(
          //   () => {
          //     location.reload()
          //   },
          //   2000
          // );
        }
        //  else {
        //   this.$store.dispatch("showToast", {
        //     value: "账号在其他地方登陆",
        //     time: 2000,
        //   });

        //   if (this.$route.name != "login") {
        //     this.$router.replace("/login");
        //   }

        //   if (this.$route.name == "roomHouse") {
        //     await this.$RCVoiceRoomLib.leaveRoom(
        //       this.$RCVoiceRoomLib._roomidcli
        //     );
        //   }
        // }
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

          location.reload();
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
      console.log(m);
      if ("conversationType" in m && m.conversationType == 1) {
        return;
      }

      switch (m.messageType) {
        case "RC:Chatroom:Gift": // eslint-disable-next-line no-case-declarations
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
        case "RC:Chatroom:Barrage": // eslint-disable-next-line no-case-declarations
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
        case "RC:Chatroom:Enter": // eslint-disable-next-line no-case-declarations
          let Enter =
            userImg +
            "<span id='" +
            user.userId +
            "' style='color:#7f7f7f'>" +
            m.content.userName +
            "</span> 进来了";
          this.$store.state.Chatroom.push(Enter);
          break;
        case "RC:Chatroom:KickOut": // eslint-disable-next-line no-case-declarations
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
        case "RC:Chatroom:Admin": // eslint-disable-next-line no-case-declarations
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
        case "RC:Chatroom:GiftAll": // eslint-disable-next-line no-case-declarations
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
        case "RC:Chatroom:Seats": // eslint-disable-next-line no-case-declarations
          let seatCounts =
            "<span>房间更换为 " +
            m.content.count +
            " 座模式，请重新上麦</span>";
          this.$store.state.Chatroom.push(seatCounts);
          this.$store.dispatch("getsetCountsChange", m.content.count + 1);
          break;
        case "RC:TxtMsg": // eslint-disable-next-line no-case-declarations
          let TxtMsg =
            "<span style='color:rgba(106, 159, 255, 1);'>" +
            m.content.content +
            "</span>";
          this.$store.state.Chatroom.push(TxtMsg);
          break;
        case "RC:Chatroom:Like": // console.log(this.$RCVoiceRoomLib);
          break;
        default:
          break;
      }
    });

    //语聊房房间刷新消息
    this.$RCVoiceRoomLib.on("RoomNotificationReceived", (item) => {
      const { name, content } = item;
      console.log(name, content);
      switch (name) {
        case "VoiceRoomBackgroundChanged":
          this.$store.dispatch("getroomBackground", content);
          break;
        case "VoiceRoomAgreeManagePick":
          if (content == this.$RCVoiceRoomLib.im.userId) {
            this.$store.dispatch("showToast", {
              value: "用户连线成功",
            });
          }
          break;
        case "VoiceRoomRejectManagePick":
          if (content == this.$RCVoiceRoomLib.im.userId) {
            this.$store.dispatch("showToast", {
              value: "用户拒绝邀请",
            });
          }
          break;
        case "EVENT_ADD_SHIELD":
          // console.log(this.$store.state.sensitiveList);
          // console.log(content);
          this.$store.dispatch("getsensitiveList", [
            ...this.$store.state.sensitiveList,
            { name: content, id: Math.random() },
          ]);
          break;
        case "EVENT_DELETE_SHIELD":
          // console.log(this.$store.state.sensitiveList);
          // console.log(content);
          // eslint-disable-next-line no-case-declarations
          let array = JSON.parse(
            JSON.stringify(this.$store.state.sensitiveList)
          );
          // eslint-disable-next-line no-case-declarations
          let index = -1;
          for (let i = 0; i < array.length; i++) {
            if (array[i]["name"] == content) {
              index = i;
            }
          }
          if (index > -1) {
            this.$store.state.sensitiveList.splice(index, 1);
          }
          // console.log(array);
          this.$store.dispatch("getsensitiveList", [
            ...this.$store.state.sensitiveList,
          ]);
          break;
        default:
          break;
      }
    });

    //语聊房房间人数发生变化(有人进来)
    this.$RCVoiceRoomLib.on("AudienceEnter", (item) => {
      console.log("房间人数发生变化(有人进来)", item);

      request
        .roomuser({
          roomId: this.$RCVoiceRoomLib._roomidcli,
        })
        .then((res) => {
          this.$store.dispatch("getRoomUserList", res.data.data);
        });
    });

    //语聊房房间人数发生变化(有人离开)
    this.$RCVoiceRoomLib.on("AudienceExit", (item) => {
      console.log("房间人数发生变化(有人离开)", item);
      request
        .roomuser({
          roomId: this.$RCVoiceRoomLib._roomidcli,
        })
        .then((res) => {
          this.$store.dispatch("getRoomUserList", res.data.data);
        });
    });

    //语聊房申请上麦人员发生变化
    this.$RCVoiceRoomLib.on("RequestSeatListChanged", async () => {
      const arr = await this.$RCVoiceRoomLib.getRequestSeatUserIds();
      // console.log("getRequestSeatUserIds", arr);
      this.$store.dispatch("getRequestSeatUserIds", arr);
      if (arr.indexOf(this.$RCVoiceRoomLib.im.userId) != -1) {
        this.$store.dispatch("userHasApply", true);
      } else {
        this.$store.dispatch("userHasApply", false);
      }
    });

    //语聊房申请上麦被同意
    this.$RCVoiceRoomLib.on("RequestSeatAccepted", async () => {
      const value = await this.$RCVoiceRoomLib.findSeat();

      try {
        await this.$RCVoiceRoomLib.enterSeat(value);
        this.$store.dispatch("getSeatInfoList");
        this.$store.dispatch("showToast", {
          value: "上麦成功",
        });
      } catch (error) {
        this.$store.dispatch("showToast", {
          value: "上麦失败",
        });
        console.log(error);
      }
    });

    //语聊房申请上麦被拒绝
    this.$RCVoiceRoomLib.on("RequestSeatRejected", async () => {
      this.$store.dispatch("showToast", {
        value: "申请上麦被拒绝",
      });
    });

    //语聊房 rtc 断开连接(待机断线问题)
    this.$RCVoiceRoomLib.on("RTCPeerConnectionCloseByException", async () => {
      await this.$RCVoiceRoomLib.leaveRoom(this.$RCVoiceRoomLib._roomidcli);
      this.$router.replace("/home");
      location.reload();
    });

    //语聊房被邀请上麦
    this.$RCVoiceRoomLib.on("RCPickerUserSeatContent", (info) => {
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
            }

              邀请上麦，是否同意？`,
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
                  info.sendUserId
                );

                setTimeout(
                  () => {
                    this.$store.dispatch("showToast", {
                      value: "上麦成功",
                    });
                    this.$store.dispatch("getSeatInfoList");
                  },

                  50
                );
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
                info.sendUserId
              );
            });
        }
      }
    });

    //语聊房账号被顶掉
    this.$RCVoiceRoomLib.on("ConnectioBreakOff", async () => {
      console.log(this.$store.state.owerDisconnet);
      if (!this.$store.state.owerDisconnet) {
        if (this.$route.name == "roomHouse") {
          await this.$RCVoiceRoomLib.leaveRoom(this.$RCVoiceRoomLib._roomidcli);
        }
        if (this.$route.name != "home") {
          this.$router.replace("/home");
        }
        location.reload();
      } else {
        this.$store.dispatch("getOwerDisconnet", false);
      }
    });

    //语聊房房间被销毁
    this.$RCVoiceRoomLib.on("ChatroomDestroyed", async () => {
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

    //语聊房被抱下麦
    this.$RCVoiceRoomLib.on("KickSeatReceived", () => {
      this.$store.dispatch("showToast", {
        value: "您已被抱下麦",
      });
    });

    // ****************直播部分监听****************
    // this.$RCVoiceRoomLib.on("SeatMute", (Mute) => {
    //   console.log("Mute", Mute);
    // });

    //座位发生变化
    this.$RCLiveRoomLib.on("seatInfoDidUpdate", () => {
      this.$store.dispatch("getSeatInfoList");
    });

    //房间信息发声变化
    this.$RCLiveRoomLib.on("roomInfoDidUpdate", (roomInfo) => {
      this.$store.dispatch("getroomTitle", roomInfo.roomName);
    });

    //被踢出房间
    this.$RCLiveRoomLib.on("RCKickUserOutRoomContent", async (parm) => {
      if (parm.targetId == this.$RCLiveRoomLib.im.userId) {
        await this.$RCLiveRoomLib
          .leaveRoom(this.$RCLiveRoomLib._roomidcli)
          .then(() => {
            this.$store.dispatch("getSeatInfoList");
            this.$router.go(-1);
            this.$store.dispatch("showToast", {
              value: "您已被踢出房间",
            });
          });
      }
    });

    //直播间邀请上麦
    this.$RCLiveRoomLib.on("onInvitation", (o) => {
      //o.id 受邀请人id   o.seatIndex 受邀请麦位
      console.log("oninvatiaion", o);
      //暂时不判断管理员还是房主
      if (o.id) {
        if (this.$store.state.onMic) {
          this.$store.dispatch("showToast", {
            value: "用户已经在麦位上",
          });
        } else {
          this.$data.cooldown = 10;
          this.cool();
          const h = this.$createElement;
          this.$confirm(`您被房主邀请上麦，是否同意？`, "是否同意上麦", {
            message: h(
              "div",
              {
                attrs: {
                  id: "cooltext",
                },
              },
              "您被房主邀请上麦，是否同意？ 9秒"
            ),
            confirmButtonText: "同意",
            cancelButtonText: "拒绝",
            customClass: "customClass-Control",
            // center: true,
            closeOnPressEscape: true,
            showClose: false,
            dangerouslyUseHTMLString: true,
            // type: "warning",
          })
            .then(async () => {
              console.log("被邀请上麦", this.$RCLiveRoomLib);
              this.$RCLiveRoomLib.acceptInvitation();
              this.$store.state.onMic = true;
              this.$store.state.onLink = true;

              await this.$RCLiveRoomLib.enterSeat(o.seatIndex);
              this.$RCLiveRoomLib.im.messageUpdate("RC:VRLRefreshMsg", {
                name: "VoiceRoomRejectManagePick",
                content: {
                  content: o.id,
                  name: "VoiceRoomAgreeManagePick",
                  totalMemberCount: 0,
                },
              });
              setTimeout(() => {
                this.$store.dispatch("showToast", {
                  value: "上麦成功",
                });
                this.$store.dispatch("getSeatInfoList");
              }, 50);
            })
            .catch(() => {
              if (this.$RCLiveRoomLib.rtc.roomType == "live") {
                this.$RCLiveRoomLib.rejectInvitation(o.id);
                this.$data.cooldown = 0;
              } else {
                this.$RCLiveRoomLib.im.messageUpdate("", {
                  name: "",
                  content: {
                    content: o.id,
                    name: "",
                    totalMemberCount: 0,
                  },
                });
              }
            });
          setTimeout(() => {
            document
              .getElementsByClassName("el-message-box__wrapper")[0]
              .click();
          }, 10000);
        }
      }
    });
    this.$RCLiveRoomLib.on("onInvitationCancel", () => {
      this.$store.dispatch("showToast", {
        value: "上麦邀请被取消",
      });
      document.getElementsByClassName("el-message-box__wrapper")[0].click();
    });
    this.$RCLiveRoomLib.on("userEnter", (userId) => {
      setTimeout(() => {
        console.log("jinru", userId, this.getUser(userId));
        // eslint-disable-next-line no-case-declarations
        let Enter =
          "<span id='" +
          this.getUser(userId).userId +
          "' style='color:#7f7f7f'>" +
          this.getUser(userId).userName +
          "</span> 进来了";
        this.$store.state.Chatroom.push(Enter);
      }, 1000);
    });

    this.$RCLiveRoomLib.on("invitationRejected", (userId) => {
      for (var i = 0; i < this.$store.state.roomUserList.length; i++) {
        if (this.$store.state.roomUserList[i].userId == userId) {
          if (this.$store.state.picking == "") {
            //状态已经空了 主动取消
            this.$store.dispatch("showToast", {
              value: "取消邀请" + this.$store.state.roomUserList[i].userName,
            });
          } else {
            this.$store.dispatch("showToast", {
              value: this.$store.state.roomUserList[i].userName + "拒绝上麦",
            });
            this.$store.state.picking = "";
          }
        }
      }
    });
    this.$RCLiveRoomLib.on("onInvitationCancel", () => {
      this.$store.dispatch("showToast", {
        value: "视频邀请取消",
      });
    });

    //默认的kv更新
    this.$RCLiveRoomLib.on("keyValueDidUpdate", (o) => {
      console.log("kv更新", o);
      if (o.key == "ROOM_INFO_PRE_FreeEnterSeat") {
        console.log("当前值", o.value, "1", String(o.value) == "1");
        if (String(o.value) == "1") {
          this.$store.state.isFreeEnterSeat = true;
        } else {
          this.$store.state.isFreeEnterSeat = false;
        }
      }
      if (o.key == "LIVE_VIDEO_SEAT_INFO_PRE_1") {
        //直播专用 有人上1号麦位
        console.log("上1号麦", o.value);
        if (!JSON.parse(o.value).userId || JSON.parse(o.value).userId == "") {
          this.$store.state.onLink = false;
        } else {
          this.$store.state.onLink = true;
        }
      }
    });
    this.$RCLiveRoomLib.on("ondevicechange", () => {
      console.log("设备更新了");
      this.$store.dispatch("showToast", {
        value: "检测到视频设备更新请刷新页面",
        time: 5000,
      });
    });

    //各种公屏消息
    this.$RCLiveRoomLib.on("onMessageReceived", async (m) => {
      // let m = message.messages[0];
      console.log("MessageReceived", m);
      //适配阻止多端登陆消息监听
      console.log("收到消息", m);
      if (m.messageType == "RCMic:loginDeviceMsg" && !m.isOffLineMessage) {
        this.$store.dispatch("showToast", {
          value: "账号在其他地方登录",
          time: 2000,
        });
        if (this.$route.name != "login") {
          this.$router.replace("/login");
        }
        if (this.$route.name == "liveRoom") {
          await this.$RCLiveRoomLib.leaveRoom(this.$RCLiveRoomLib._roomidcli);
        }
      }
      this.$RCLiveRoomLib.im.body.addEventListener("DISCONNECT", () => {
        this.$store.dispatch("showToast", {
          value: "账号在其他地方登录",
          time: 2000,
        });
        if (this.$route.name != "login") {
          this.$router.replace("/login");
        }
      });

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
            await this.$RCLiveRoomLib.leaveRoom(this.$RCLiveRoomLib._roomidcli);
          }

          if (this.$route.name != "home") {
            this.$router.replace("/home");
          }

          location.reload();
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
      console.log("收到消息");
      console.log(m);
      if ("conversationType" in m && m.conversationType == 1) {
        return;
      }

      switch (m.messageType) {
        case "RC:TxtMsg": //收到文本消息打到公屏
          console.log("收到TxtMsg打到公屏", m);
          // eslint-disable-next-line no-case-declarations
          let txtMsg;
          if (!m.content.name) {
            txtMsg =
              "<span style='color:rgba(106, 159, 255, 1);'>" +
              m.content.content +
              "</span>";
            console.log("noname");
          } else {
            txtMsg =
              "<span style='color:#7f7f7f'>" +
              m.content.name +
              " </span>" +
              m.content.content;
          }

          this.$store.state.Chatroom.push(txtMsg);
          break;
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
          this.$store.state.Chatroom.gift();
          this.$store.dispatch("giftUpdate");
          break;
        case "RC:Chatroom:Barrage": // eslint-disable-next-line no-case-declarations
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
        case "RC:Chatroom:Enter": // eslint-disable-next-line no-case-declarations
          let Enter =
            userImg +
            "<span id='" +
            user.userId +
            "' style='color:#7f7f7f'>" +
            m.content.userName +
            "</span> 进来了";
          this.$store.state.Chatroom.push(Enter);
          break;
        case "RC:Chatroom:KickOut": // eslint-disable-next-line no-case-declarations
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
          break;
        case "RC:Chatroom:Admin": // eslint-disable-next-line no-case-declarations
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
        case "RC:Chatroom:GiftAll": // eslint-disable-next-line no-case-declarations
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
          this.$store.state.Chatroom.gift();
          this.$store.dispatch("giftUpdate");
          break;
        case "RC:Chatroom:Seats": // eslint-disable-next-line no-case-declarations
          let seatCounts =
            "<span>房间更换为 " +
            m.content.count +
            " 座模式，请重新上麦</span>";
          this.$store.state.Chatroom.push(seatCounts);
          this.$store.dispatch("getsetCountsChange", m.content.count + 1);
          break;
        // case "RC:TxtMsg": // eslint-disable-next-line no-case-declarations
        //   let TxtMsg =
        //     "<span style='color:rgba(106, 159, 255, 1);'>" +
        //     m.content.content +
        //     "</span>";
        //   this.$store.state.Chatroom.push(TxtMsg);
        //   break;
        case "RC:Chatroom:Like": // console.log(this.$RCLiveRoomLib);
          break;
        case "RC:CmdMsg":
          console.log("收到命令消息", m);
          break;
        case "RC:VRVoiceMsg":
          console.log(m);

          // eslint-disable-next-line no-case-declarations
          let voiceMsg;
          voiceMsg =
            "<span style='color:#7f7f7f' >" +
            m.content._userName +
            " </span>" +
            `<span height: 22px;background: none;border-radius: 4px; border: 1px solid; color: #666; onclick="new Audio('` +
            m.content._path +
            `').play();">` +
            m.content._duration +
            "' " +
            "<span  style='width:20px;height:20px;display:inline-block;margin-bottom:-5px;background-image: url(" +
            this.voice_Img +
            ");  background-position: center;background-repeat: no-repeat;background-size:14px 14px'></span>" +
            "</span>";

          this.$store.state.Chatroom.push(voiceMsg);
          break;
        default:
          break;
      }
    });

    //房间人数发生变化
    this.$RCLiveRoomLib.on("changeUserCount", () => {
      console.log("userchenge");
      request
        .roomuser({
          roomId: this.$RCLiveRoomLib._roomidcli,
        })
        .then((res) => {
          console.log("拿到的列表：", res);
          if (res.data.code == 10000) {
            this.$store.dispatch("getRoomUserList", res.data.data);
          }
        });
    });

    //房间人数发生变化(有人进来)
    this.$RCLiveRoomLib.on("AudienceEnter", (item) => {
      console.log("房间人数发生变化(有人进来)", item);

      request
        .roomuser({
          roomId: this.$RCLiveRoomLib._roomidcli,
        })
        .then((res) => {
          this.$store.dispatch("getRoomUserList", res.data.data);
        });
    });

    //房间人数发生变化(有人离开)
    this.$RCLiveRoomLib.on("AudienceExit", (item) => {
      console.log("房间人数发生变化(有人离开)", item);

      request
        .roomuser({
          roomId: this.$RCLiveRoomLib._roomidcli,
        })
        .then((res) => {
          this.$store.dispatch("getRoomUserList", res.data.data);
        });
    });

    //申请上麦人员发生变化
    this.$RCLiveRoomLib.on("RequestSeatListChanged", async () => {
      console.log("申请上麦人员发生变化 ");
      const arr = await this.$RCLiveRoomLib.getRequestSeatUserIds();
      // console.log("getRequestSeatUserIds", arr);
      this.$store.dispatch("getRequestSeatUserIds", arr);
      if (arr.indexOf(this.$RCLiveRoomLib.im.userId) != -1) {
        this.$store.dispatch("userHasApply", true);
      } else {
        this.$store.dispatch("userHasApply", false);
      }
      this.$store.state.onMic = false;
      for (var i = 0; i < this.$RCLiveRoomLib.seatInfoList.length; i++) {
        if (
          this.$RCLiveRoomLib.im.userId ==
            this.$RCLiveRoomLib.seatInfoList[i].userId &&
          !this.$store.state.creatUser
        ) {
          //非主播且在麦位上时
          this.$store.state.onMic = true;
          this.$store.state.onLink = true;
        }
      }
    });

    //申请上麦被同意
    this.$RCLiveRoomLib.on("RequestSeatAccepted", async () => {
      console.log("RequestSeatAccepted");
      // if(){

      // }
      await this.$RCLiveRoomLib.enterSeat(this.$RCLiveRoomLib.findSeat());
      console.log("onMic");
      this.$store.state.onMic = true;
      this.$store.state.onLink = true;
    });

    //申请上麦被拒绝
    this.$RCLiveRoomLib.on("RequestSeatRejected", async () => {
      this.$store.dispatch("showToast", {
        value: "申请上麦被拒绝",
      });
    });

    //说话监听
    this.$RCLiveRoomLib.on("speakingStatusChenge", (info) => {
      // if (Number(info.speaking)) {
      this.$store.dispatch("getSpeakingChenge", {
        index: Number(info.index),
        speaking: Number(info.speaking),
      });
      // }
    });

    //关闭房间
    this.$RCLiveRoomLib.on("onVoiceRoomClosed", async () => {
      if (this.$RCLiveRoomLib._roomidcli == "") return;
      await this.$RCLiveRoomLib
        .leaveRoom(this.$RCLiveRoomLib._roomidcli)
        .then(() => {
          this.$store.dispatch("getSeatInfoList");
          this.$alert("直播已结束，房间关闭", {
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
    this.$RCLiveRoomLib.on("onVoiceRoomBackgroundChanged", (img) => {
      this.$store.dispatch("getroomBackground", img);
    });

    //被邀请上麦
    this.$RCLiveRoomLib.on("onRCPickerUserSeatContent", (info) => {
      console.log("userList", this.$store.state.userInseat);
      if (info.targetId == this.$RCLiveRoomLib.im.userId) {
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
            }

              邀请上麦，是否同意？`,
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
                const fintSeat = await this.$RCLiveRoomLib.findSeat();
                await this.$RCLiveRoomLib.enterSeat(fintSeat);
                this.$RCLiveRoomLib.notifyVoiceRoom(
                  "VoiceRoomAgreeManagePick",
                  info.sendUserId
                );

                setTimeout(
                  () => {
                    this.$store.dispatch("showToast", {
                      value: "上麦成功",
                    });
                    this.$store.dispatch("getSeatInfoList");
                  },

                  50
                );
              } catch (error) {
                this.$store.dispatch("showToast", {
                  value: "上麦失败",
                });
                console.log(error);
              }
            })
            .catch(() => {
              this.$RCLiveRoomLib.notifyVoiceRoom(
                "VoiceRoomRejectManagePick",
                info.sendUserId
              );
            });
        }
      }
    });

    //账号被顶掉
    this.$RCLiveRoomLib.on("ConnectioBreakOff", async () => {
      if (!this.$store.state.owerDisconnet) {
        if (this.$route.name == "roomHouse") {
          await this.$RCLiveRoomLib.leaveRoom(this.$RCLiveRoomLib._roomidcli);
        }

        if (this.$route.name != "home") {
          this.$router.replace("/home");
        }

        location.reload();
      } else {
        this.$store.dispatch("getOwerDisconnet", false);
      }
    });

    //下麦
    this.$RCLiveRoomLib.on("leaveSeat", () => {
      this.$store.state.onMic = false;
      this.$store.state.onLink = false;
      this.$store.dispatch("updateuserInseat", false);
    });

    //房间被关闭
    this.$RCLiveRoomLib.on("chatroomDestroyed", () => {
      console.log("chatroomDestroyed mark");
      if (this.$RCLiveRoomLib._roomidcli == "") return;
      this.$RCLiveRoomLib.leaveRoom(this.$RCLiveRoomLib._roomidcli).then(() => {
        if (
          !this.$store.state.roomInformation.createUser ||
          this.$store.state.roomInformation.createUser.userId ==
            this.$store.state.userInfo.userId
        ) {
          console.log("房主主动关闭直播不弹窗");
        } else {
          this.$alert("直播已结束，房间关闭", {
            confirmButtonText: "确定",
            center: true,
            showClose: false,
            customClass: "customClass-Control",
            callback: () => {
              this.$router.push("/room?roomType=liveRoom");
            },
          });
        }
      });
    });
  },

  methods: {
    drawer: function () {
      this.$router.push("/login");
    },
    getUser: function (userId) {
      if (this.$store.state.roomUserList) {
        for (var i = 0; i < this.$store.state.roomUserList.length; i++) {
          if (this.$store.state.roomUserList[i].userId == userId) {
            return this.$store.state.roomUserList[i];
          }
        }
      }
    },
    cool: function () {
      console.log("cooling,", this.$data.cooldown);
      if (this.$data.cooldown > 0) {
        this.$data.cooldown--;
        setTimeout(() => {
          this.cool();
          document.getElementById("cooltext").innerHTML =
            "您被房主邀请上麦，是否同意？" + this.$data.cooldown + "秒";
        }, 1000);
      }
    },
  },
};
</script><style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  width: 56.25vh;

  overflow: hidden;
  margin: auto;
  background: #fff;
  font-size: 16px;
  min-width: none;
  min-height: 625px;
}

.customClass-Control {
  width: 3rem !important;
}
.bg {
  background: url("./assets/webBg.png");
  height: 100vh;
}

.el-tabs__content::-webkit-scrollbar {
  width: 0 !important;
}

.el-drawer__wrapper {
  position: absolute !important;
  /* max-width: 375px !important;
  left: calc(50vw - 187.5px) !important; */
}

.el-dialog__wrapper {
  position: absolute !important;
  /* max-width: 375px !important;
  left: calc(50vw - 187.5px) !important; */
}

.v-modal {
  position: absolute;
  /* width: 375px !important;
  left: calc(50vw - 187.5px) !important; */
}
</style>
