<template>
  <div class="liveroom">
    <el-dialog title="提示" :visible.sync="qiutConfirm" width="80%" center>
      <span>确定结束本次直播吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="qiutConfirm = false">取 消</el-button>
        <el-button type="primary" @click="stopCast">确 定</el-button>
      </span>
    </el-dialog>
    <roomBack ref="RoomBack" @RoomBackClose="onRoomBackClose" />
    <RoomFit ref="RoomFit" :RoomFitItemList="RoomFitItemList" />
    <Notice ref="Notice" />
    <UserList
      ref="UserList"
      @onCloseUserList="onCloseUserList"
      @onClickUserList="onClickUserList"
    />
    <ConnetWeat ref="ConnetWeat" />
    <div
      class="quit"
      :class="{ menu: !isAnchor }"
      v-show="status == 2"
      @click="quitRoom()"
    ></div>
    <video
      class="videocontainer"
      :class="{ fliped: isAnchor }"
      width="100%"
      height="100%"
      ref="video"
    ></video>
    <video
      class="videoInVideo"
      :class="{
        noshow:
          this.$RCLiveRoomLib.seatInfoList[1] &&
          this.$RCLiveRoomLib.seatInfoList[1].userId != '',
      }"
      width="93px"
      height="166px"
      ref="videoInVideo"
      @click="minvideoClicked"
    ></video>
    <liveCreate v-if="status == 0" @startShow="startShow" />
    <liveTitle
      :title="userName"
      :userAvatar="userAvatar"
      :isAnchor="isAnchor"
      :delay="delay"
      :giftNum="this.$store.state.giftNum"
      @clickNotice="clickNotice"
      v-if="status == 2"
    />

    <liveAudience
      v-if="status == 2"
      @audienceList="audienceList"
      :num="this.$store.state.roomUserList.length"
    />
    <videoBox :status="0" :size="50" v-if="false" />
    <liveChat
      ref="chatroom"
      v-show="status == 2"
      @nameClick="nameClick"
      @onGiftMsg="onGiftMsg"
      :top="50"
      :height="40"
    />
    <!-- <roomUi /> -->
    <liveQuitSeat
      v-if="quitMic"
      @quit="qiutMicAction"
      @cancel="quitMic = false"
    >
    </liveQuitSeat>
    <liveCancelInv
      v-if="cancelInvUi"
      @invQuit="cancelInvAction"
      @invCancel="cancelInvUi = false"
    >
    </liveCancelInv>
    <CancelEvenSeat ref="CancelEvenSeat" :roomType="'live'" />
    <UserCard />
    <bottomBar
      v-if="!showGift && status == 2"
      @msgOut="msgOut"
      @btnGift="btnGift"
      @ApplyWeatModel="ConnectMic"
      @ApplyWeat="ApplyWeat"
      @SetupModel="ConnectOperation"
      @quitSeat="quitSeat"
      @cancelInv = "cancelInv"
      ref="bottomBar"
    ></bottomBar>
    <!-- <div class="input">
      <input class="inputer" @keydown="keydown" type="text" v-model="msg" />
    </div> -->

    <giftPanel
      @hideGift="hideGift"
      @sendGiftSuccess="sendGiftSuccess"
      :isActive="showGift"
      :roomId="roomId"
      ref="giftPanel"
    ></giftPanel>
  </div>
</template>

<script>
import liveTitle from "../../components/baseUi/liveTitle.vue";
import liveCreate from "../../components/baseUi/liveCreate.vue";
import liveChat from "../../components/baseUi/liveChat.vue";
import bottomBar from "../../components/baseUi/bottomBar.vue";
import giftPanel from "../../components/baseUi/giftPanel.vue";
import videoBox from "../../components/baseUi/videoBox.vue";
import liveAudience from "../../components/baseUi/liveAudience.vue";
import liveQuitSeat from "../../components/baseUi/liveQuitSeat.vue";
import liveCancelInv from "../../components/baseUi/liveCancelInv.vue";
import CancelEvenSeat from "../../components/room/CancelEvenSeat.vue";

import roomBack from "../../components/room/RoomBack.vue";
import ConnetWeat from "../../components/room/ConnetWeat.vue";
import RoomFit from "../../components/RoomFit.vue";
import Notice from "../../components/room/Notice.vue";
import UserList from "../../components/room/UserList.vue";
import UserCard from "../../components/baseUi/userCard.vue";

import { GetQueryString } from "../../utils/utils";
import Request from "../../request/index.js";
import config from "../../config";

// import CallRoom from "./callRoom/index.vue";
// import PopupInput from "../../components/PopupInput.vue";

export default {
  name: "Roomlive",
  data: function () {
    return {
      // msg: "ccc",
      videoNode: this.$refs.video,
      miniNode: this.$refs.videoInVideo,
      showGift: false,

      isAnchor: false,
      status: 2, // 0 主播开播 1 主播模式 2 观众模式
      newroom: false, //是否新建房间
      roomId: "", //本房间id
      userAvatar: "", //主播头像
      userName: "", //主播名字
      roomName: "", //房间名字
      delay: 0, //房间延迟
      userId: "", //主播的id
      giftNum: 0, //当前主播收到的礼物总量
      isPrivate: "", //是否私密

      seatInfoList: [], //麦位信息
      userlist: {}, //进入过房间的用户列表
      RoomFitItemList: [],
      qiutConfirm: false, //主播退出确认
      quitMic: false, //展示下麦界面
      cancelInvUi: false,//取消连麦邀请界面
      defaultAvatarUrl:
        "https://cdn.ronghub.com/demo/default/rce_default_avatar.png",
      defaultAddress: config.picPath,
    };
  },
  components: {
    liveCreate,
    liveTitle,
    videoBox,
    liveChat,
    bottomBar,
    giftPanel,
    liveAudience,
    roomBack,
    ConnetWeat,
    RoomFit,
    Notice,
    liveQuitSeat,
    liveCancelInv,
    CancelEvenSeat,
    UserList,
    UserCard,
  },
  methods: {
    //创建房间
    init: function () {
      console.log("初始化房间 ");
      this.$data.seatInfoList = this.$RCLiveRoomLib.seatInfoList; //更新麦位信息
      this.getRoominformation();
      this.getUserList();
      this.$RCLiveRoomLib.on("RtcRtt", (RtcRtt) => {
        this.$data.delay = RtcRtt;
      });
    },
    ConnectMic: function () {
      this.$refs.ConnetWeat.openConnetWheat(false);
    },
    //打开公告
    clickNotice: function () {
      console.log(this.$RCLiveRoomLib);
      this.$refs.Notice.setPopup({
        isShow: false,
        value: this.$RCLiveRoomLib.im._roomNotice
          ? this.$RCLiveRoomLib.im._roomNotice
          : "欢迎来到 " + this.$store.state.roomTitle,
      });
    },
    onCloseUserList: function () {
      console.log("onCloseUserList");
    },
    onClickUserList: function () {
      console.log("onClickUserList");
    },
    minvideoClicked: function () {
      if (
        this.$RCLiveRoomLib.im.seatInfoList &&
        this.$RCLiveRoomLib.im.seatInfoList[1] &&
        this.$RCLiveRoomLib.im.seatInfoList[1].userId != ""
      ) {
        //1号麦位上有人
        this.$data.quitMic = true;
      }
    },
    audienceList: function () {
      Request.roomuser({
        roomId: this.$RCLiveRoomLib._roomidcli,
      }).then((res) => {
        console.log(res);
        this.$store.dispatch("getRoomUserList", res.data.data);
      });
      this.houseFilter = 5;
      this.$refs.UserList.openUserList();
    },
    getRoominformation: function () {
      Request.roominformation({ roomId: this.$RCLiveRoomLib._roomidcli })
        .then((res) => {
          if (res.data.code == 10000) {
            this.$store.dispatch("getRoomInformation", res.data.data);
            this.$store.dispatch(
              "getroomBackground",
              res.data.data.backgroundUrl
            );

            this.$data.roomName = res.data.data.roomName;
            this.$store.dispatch("getroomTitle", res.data.data.roomName);
            this.$store.dispatch("getroomPrivate", {
              isPrivate: res.data.data.isPrivate,
              password: res.data.data.password,
            });
            this.$refs.chatroom.welcome();
            this.$data.userlist[res.data.data.createUser.userId] =
              res.data.data.createUser;

            if (res.data.data.createUser.portrait) {
              console.log("应用了头像", this.$data.defaultAvatarUrl);
              this.$data.userAvatar =
                this.$data.defaultAddress + res.data.data.createUser.portrait;
            } else {
              console.log("应用了默认头像", this.$data.defaultAvatarUrl);
              this.$data.userAvatar = this.$data.defaultAvatarUrl;
            }
            this.$data.userName = res.data.data.createUser.userName;
            this.$data.userId = res.data.data.createUser.userId;
            if (
              this.$store.state.userInfo.userId ==
              res.data.data.createUser.userId
            ) {
              this.$store.state.creatUser = true;
            }
            console.log("state", this.$store.state.userInfo.userId);
          } else {
            console.log("err", res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getUserList: function () {
      Request.roomuser({
        roomId: this.$RCLiveRoomLib._roomidcli,
      }).then((res) => {
        console.log("当前房间用户", res);
        this.$store.dispatch("getRoomUserList", res.data.data);
        for (var i = 0; i < res.data.data.length; i++) {
          this.$data.userlist[res.data.data[i].userId] = res.data.data[i];
        }
        this.getGiftAndMan();
      });
    },
    //获取gift和管理员
    getGiftAndMan: function () {
      console.log("getGiftAndMan called");
      Promise.all([this.getGiftList(), this.getManageList()])
        .then((res) => {
          console.log(res);
          if (this.$RCLiveRoomLib.im.userId in res[1]["ManageObj"]) {
            this.$store.dispatch("setRoomAdmin", true);
          } else {
            this.$store.dispatch("setRoomAdmin", false);
          }
          // // console.log(this.$store.state.roomUserList);
          this.$nextTick(() => {
            let Obj = {};
            for (let i = 0; i < res.length; i += 1) {
              Obj = {
                ...Obj,
                ...res[i],
              };
            }
            this.GiftAndManageList = {
              ...Obj,
            };
            this.$store.dispatch("getGiftAndManageList", Obj);
            // console.log(Obj);
            this.SetSeatList(Obj);
          });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    //设置座位List
    SetSeatList: async function (resValue) {
      console.log("GiftAndManageList:", resValue);
      this.houserMap = {};
      let roomUserListMap = {};
      this.itemList = [];

      if (this.$store.state.roomUserList.length == 0) {
        return;
      }

      console.log(this.$RCLiveRoomLib.seatInfoList);
      if (!this.$RCLiveRoomLib.seatInfoList[0]) {
        this.$RCLiveRoomLib.seatInfoList[0] = {
          ...this.seatInfo,
        };

        // this.$RCLiveRoomLib.seatInfoList[0] = JSON.parse(
        //   JSON.stringify(this.seatInfo)
        // );
        this.$RCLiveRoomLib.seatInfoList[0]["status"] = 1;
        this.$RCLiveRoomLib.seatInfoList[0]["userId"] =
          this.$store.state.roomInformation.createUser.userId;
        // this.$RCLiveRoomLib.seatInfoList[0]['portrait']=this.$store.state.roomInformation.createUser.portrait
      }
      console.log(this.$RCLiveRoomLib.seatInfoList[0]);
      for (let m = 0; m < this.$store.state.roomUserList.length; m += 1) {
        roomUserListMap[this.$store.state.roomUserList[m]["userId"]] =
          this.$store.state.roomUserList[m];
      }

      if (this.$RCLiveRoomLib.seatInfoList[0]["mute"] != !this.OwerMute) {
        this.OwerMute = !this.$RCLiveRoomLib.seatInfoList[0]["mute"];
      }

      if (
        this.$RCLiveRoomLib.seatInfoList[0]["userId"] &&
        this.$RCLiveRoomLib.seatInfoList[0]["userId"] in roomUserListMap
      ) {
        this.houserMap = {
          ...roomUserListMap[this.$RCLiveRoomLib.seatInfoList[0]["userId"]],
        };
      }

      if (
        this.$RCLiveRoomLib.seatInfoList[0]["userId"] &&
        this.$RCLiveRoomLib.seatInfoList[0]["userId"] in resValue.GiftObj
      ) {
        this.houserMap = {
          ...this.houserMap,
          gift: resValue.GiftObj[this.$RCLiveRoomLib.seatInfoList[0]["userId"]],
        };
      }

      this.houserMap = {
        ...this.houserMap,
        ...this.$RCLiveRoomLib.seatInfoList[0],
      };

      let arr = [];
      // console.log(
      //   "this.$RCLiveRoomLib.roomInfo",
      //   this.$RCLiveRoomLib.roomInfo
      // );
      let seatCountNumber = 9;

      for (let p = 1; p < seatCountNumber; p += 1) {
        let OtherMap = {};
        if (
          this.$RCLiveRoomLib.seatInfoList[p] &&
          this.$RCLiveRoomLib.seatInfoList[p]["userId"]
        ) {
          if (
            this.$RCLiveRoomLib.seatInfoList[p]["userId"] in roomUserListMap
          ) {
            OtherMap = {
              ...roomUserListMap[this.$RCLiveRoomLib.seatInfoList[p]["userId"]],
            };
          }

          if (
            this.$RCLiveRoomLib.seatInfoList[p]["userId"] in resValue.ManageObj
          ) {
            OtherMap = {
              ...OtherMap,
              isAdmin: true,
            };
          }

          if (
            this.$RCLiveRoomLib.seatInfoList[p]["userId"] in resValue.GiftObj
          ) {
            OtherMap = {
              ...OtherMap,
              gift: resValue.GiftObj[
                this.$RCLiveRoomLib.seatInfoList[p]["userId"]
              ],
            };
          }
        }

        if (this.$RCLiveRoomLib.seatInfoList[p]) {
          arr.push({
            ...OtherMap,
            ...this.$RCLiveRoomLib.seatInfoList[p],
            index: p,
          });
        } else {
          this.$RCLiveRoomLib.seatInfoList[p] = {
            ...this.seatInfo,
          };
          arr.push({
            ...OtherMap,
            ...this.seatInfo,
            index: p,
          });
        }
      }
      for (let index = 0; index < arr.length; index += 1) {
        if (this.$RCLiveRoomLib.im.userId == arr[index].userId) {
          this.$store.dispatch("updateuserInseat", true);
          break;
        }
        if (index == arr.length - 1) {
          this.$store.dispatch("updateuserInseat", false);
        }
      }
      this.itemList = arr;
      this.$store.dispatch("updateItemList", arr);

      //  console.log(this.$RCLiveRoomLib.seatInfoList);
      // console.log("OtherList", arr);
      // console.log("this.houserMap", this.houserMap);
    },
    //房主设置状态控制
    ConnectOperation: function () {
      // console.log(this.$RCLiveRoomLib.roomInfo);
      // const RoomFitList = JSON.parse(JSON.stringify(RoomFitItemList));
      const RoomFitList = [
        {
          value: "房间上锁",
          // eslint-disable-next-line no-undef
          img: "url(" + require("../../assets/roomicon/LockRoon.png") + ")",
        },
        {
          value: "房间标题",
          // eslint-disable-next-line no-undef
          img: "url(" + require("../../assets/roomicon/RoomTitle.png") + ")",
        },
        {
          value: "房间公告",
          // eslint-disable-next-line no-undef
          img: "url(" + require("../../assets/roomicon/RoomNotice.png") + ")",
        },
        {
          value: "屏蔽词",
          img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/ShieldingWords.png") + ")",
        },
      ];

      // console.log(this.$store.state.roomPrivate);
      if (this.$store.state.roomPrivate.isPrivate == 1) {
        RoomFitList[0] = {
          value: "房间解锁",
          img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/UnLockRoom.png") + ")",
        };
      }
      console.log("构建：", this.$store.state.isFreeEnterSeat);
      if (this.$store.state.isFreeEnterSeat) {
        RoomFitList.push({
          value: "申请上麦",
          img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/BApplyWheat.png") + ")",
        });
      } else {
        RoomFitList.push({
          value: "自由上麦",
          img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/BFreeWheat.png") + ")",
        });
      }
      this.RoomFitItemList = RoomFitList;
      // console.log(this.RoomFitItemList);
      this.$refs.RoomFit.openRoomFit();
    },
    //请求排麦与否
    ApplyWeat: async function () {
      if (this.$store.state.HasApply) {
        this.$refs.CancelEvenSeat.CancelEvenSeatOpen();
      } else {
        if (this.$RCLiveRoomLib.im._FreeEnterSeat) {
          //自由上麦的情况
          if (
            this.$RCLiveRoomLib.im.seatInfoList[1] &&
            this.$RCLiveRoomLib.im.seatInfoList[1].userId &&
            this.$RCLiveRoomLib.im.seatInfoList[1].userId.length
          ) {
            console.log(this.$RCLiveRoomLib.im.seatInfoList[1]);
            this.$store.dispatch("showToast", {
              value: "麦位已满",
            });
          } else {
            this.$RCLiveRoomLib.requestSeat();
            //  this.$RCLiveRoomLib.enterSeat(1);
            this.$store.state.onLink = true;
            this.$store.state.onMic = true;
            return;
          }
        } else {
          await this.$RCLiveRoomLib.requestSeat();
          this.$store.dispatch("showToast", {
            value: "已申请连线，等待房主接受",
          });
          setTimeout(() => {
            this.$store.dispatch("userHasApply", true);
          }, 50);
        }
      }
      // console.log(this.$store.state.HasApply);
    },
    getSeatInfolist: async function () {
      const list = await this.$RCLiveRoomLib.getLatestSeatInfo();
      console.log(list);
    },
    createRoom: function () {
      console.log("crtRoom===", this.$refs.video, this.$refs.videoInVideo);

      console.log("当前用户：", this.$store.state);
      this.$RCLiveRoomLib
        .createAndJoinRoom({
          roomId: this.$data.roomId,
          roomName: this.$data.roomName,
          roomType: "live",
          videoNode: this.$refs.video,
          miniNode: this.$refs.videoInVideo,
        })
        .then(() => {
          this.init();
        });
    },
    joinroom: function () {
      console.log("sdk加入房间动作");
      this.$RCLiveRoomLib
        .joinRoom({
          roomId: GetQueryString("roomid"),
          roomType: "live",
          videoNode: this.$refs.video,
          miniNode: this.$refs.videoInVideo,
        })
        .then(() => {
          this.init();
        });
    },
    quitRoom: function () {
      if (this.$data.isAnchor) {
        this.$data.qiutConfirm = true;
      } else {
        let BackList  =[];
        if(this.$store.state.onMic){//在麦位上时不允许收起房间
          BackList = [
            {
              value: "离开房间",
              // eslint-disable-next-line no-undef
              img: "url(" + require("../../assets/roomicon/CloseRoom.png") + ")",
            }]
        }else{
          BackList = [
            {
              value: "收起房间",
              // eslint-disable-next-line no-undef
              img: "url(" + require("../../assets/roomicon/LeaveRoom.png") + ")",
            },
            {
              value: "离开房间",
              // eslint-disable-next-line no-undef
              img: "url(" + require("../../assets/roomicon/CloseRoom.png") + ")",
            },
          ];
        }
        console.log(this.$refs.RoomBack.RoomBackOpen);
        this.$refs.RoomBack.RoomBackOpen(BackList);
      }
    },
    stopCast: function () {
      //关播
      this.$RCLiveRoomLib.leaveRoom(this.$data.roomId).then(() => {
        this.$RCLiveRoomLib._roomidcli = "";
        this.$router.push("room?roomType=liveRoom");
      });
    },
    msgOut: function (msg) {
      //本地消息
      console.log(msg);
      if (msg.replace(/\s*/g, "").length == 0) {
        this.$store.dispatch("showToast", {
          value: "消息不能为空",
        });
        return;
      }

      //取屏蔽词列表
      Request.getsensitiveList({
        roomId: this.$RCLiveRoomLib._roomidcli,
      }).then((res) => {
        let send = true;
        console.log("屏蔽词列表", res);
        if (res.data.code == 10000 && res.data.data) {
          for (let index = 0; index < res.data.data.length; index++) {
            if (msg.indexOf(res.data.data[index]["name"]) != -1) {
              send = false;
              break;
            }
          }
        }
        if (this.$RCLiveRoomLib.im._roomShields) {
          for (let j = 0; j < this.$RCLiveRoomLib.im._roomShields.length; j++) {
            if (this.$RCLiveRoomLib.im._roomShields[j] == msg) {
              send = false;
              break;
            }
          }
        }
        let txtMsg = {
          userName: this.$store.state.userInfo.userName, // 文本内容
          userId: this.$store.state.userInfo.userId,
          content: msg,
        };
        this.$RCLiveRoomLib.emit("onMessageReceived", {
          //发本地
          //模拟本地消息发送
          messageType: "RC:Chatroom:Barrage",
          content: txtMsg,
        });
        if (send) {
          // console.log(txtMsg);
          this.$RCLiveRoomLib.im.messageUpdate("RC:Chatroom:Barrage", txtMsg);
        }
      });
    },
    nameClick: function (e) {
      console.log(e, "clicked");
    },
    onGiftMsg: function () {
      setTimeout(() => {
        this.getGiftList();
      }, 1000);
    },
    //礼物更新
    sendGiftSuccess: async function () {
      // const gift = await this.getGiftList();
      // console.log(gift);
      // this.updateAdminAndGift(gift);
    },
    //礼物请求获取数据
    getGiftList: function () {
      return Request.giftList(this.$RCLiveRoomLib._roomidcli).then(
        async (res) => {
          let GiftObj = {};
          if (res.data.code == 10000 && res.data.data.length > 0) {
            for (let i = 0; i < res.data.data.length; i += 1) {
              if (res.data.data[i][this.$data.userId]) {
                this.$store.state.giftNum = Number(
                  res.data.data[i][this.$data.userId]
                );
              }
              GiftObj = {
                ...GiftObj,
                ...res.data.data[i],
              };
            }
          }
          return { GiftObj: GiftObj };
        }
      );
    },
    //获取管理员数据
    getManageList: function () {
      return Request.manageList({
        roomId: this.$RCLiveRoomLib._roomidcli,
      }).then(async (res) => {
        let ManageObj = {};
        if (res.data.code == 10000 && res.data.data.length > 0) {
          for (let i = 0; i < res.data.data.length; i += 1) {
            ManageObj[res.data.data[i]["userId"]] = res.data.data[i];
          }
        }
        return { ManageObj: ManageObj };
        // this.$nextTick(() => {
        //   this.ManageObj = ManageObj;
        // });
      });
    },
    //点击送单人礼物
    giftClick: function (item) {
      console.log("item", item);
      if (
        this.$store.state.roomInformation.createUser["userId"] == item["userId"]
      ) {
        item["creatuser"] = true;
      } else {
        item["creatuser"] = false;
      }
      this.$data.showGift = true;
      this.$refs.giftPanel.showGift([item]);
    },
    //已经上麦的观众下麦
    quitSeat: function () {
      this.$data.quitMic = true;
      //this.$store.state.onMic = false;
    },
    //下麦动作
    qiutMicAction: function () {
      this.$data.quitMic = false;
      this.$store.state.onMic = false;
      this.$store.state.onLink = false;
      if (GetQueryString("isAnchor")) {
        //是房主踢1号麦位
        this.$RCLiveRoomLib.updateKeyValue({
          key: "LIVE_VIDEO_SEAT_INFO_PRE_1",
          value: JSON.stringify({
            userId: "",
            mute: false,
            userEnableVideo: true,
            frame:
              "{{0.68330000000000002, 0.69059999999999999}, {0.29999999999999999, 0.16880000000000001}}",
            lock: false,
            userEnableAudio: true,
            index: 1,
          }),
        });

      } else {
        this.$RCLiveRoomLib.leaveSeat(false, false);
      }
    },
    //取消邀请界面展示
    cancelInv:function (){
      this.$data.cancelInvUi = true;
    },
    //取消邀请动作
    cancelInvAction:function (){
      this.$RCLiveRoomLib.cancelInvitation(this.$store.state.picking);
      this.$data.cancelInvUi = false;
      this.$store.state.picking = '';
    },
    btnGift: function () {
      this.$data.showGift = true;
      let userInseatList = [];
      for (var i = 0; i < this.$RCLiveRoomLib.seatInfoList.length; i++) {
        console.log("当前麦位信息：",this.$RCLiveRoomLib.seatInfoList[i]);
        if (
          this.$RCLiveRoomLib.seatInfoList[i].userId &&
          this.$data.userlist[this.$RCLiveRoomLib.seatInfoList[i].userId]
        ) {
          console.log("存在：",this.$data.userlist[this.$RCLiveRoomLib.seatInfoList[i].userId]);
          if (
            this.$store.state.roomInformation.createUser["userId"] ==
            this.$data.userlist[this.$RCLiveRoomLib.seatInfoList[i].userId][
              "userId"
            ]
          ) {
            this.$data.userlist[this.$RCLiveRoomLib.seatInfoList[i].userId][
              "creatuser"
            ] = true;
          } else {
            this.$data.userlist[this.$RCLiveRoomLib.seatInfoList[i].userId][
              "creatuser"
            ] = false;
          }
          console.log("在位上的：",this.$data.userlist[this.$RCLiveRoomLib.seatInfoList[i].userId]);
          userInseatList.push(
            this.$data.userlist[this.$RCLiveRoomLib.seatInfoList[i].userId]
          );
        }
      }
      console.log("userInseatList", userInseatList);
      this.$refs.giftPanel.showGift(userInseatList);
    },
    hideGift: function () {
      console.log("hid");
      this.$data.showGift = false;
    },
    startShow: function (e) {
      console.log("上报", e);

      this.$data.roomId = e.data.roomId;
      this.$data.roomName = this.$store.state.roomTitle = e.data.roomName;
      this.$data.userId = e.data.createUser.userId;
      this.$data.userAvatar = e.data.createUser.portrait; //主播头像
      this.$data.userName = e.data.createUser.userName; //主播名
      this.$data.isPrivate = e.data.isPrivate; //是否私密

      this.$data.status = 2; // 房间初始化成功
      this.createRoom();
    
      
    },
    onRoomBackClose: function () {},
  },
  created() {
    if (GetQueryString("isAnchor")) {
      this.$data.isAnchor = true;
      this.$data.status = 0;
    } else {
      this.$data.isAnchor = false;
    }

    if (GetQueryString("roomid")) {
      // this.$data.roomId = GetQueryString("roomid");
      console.log("isin room");
      this.$data.roomId = GetQueryString("roomid");
    }
    // this.$RCLiveRoomLib.on("remoteVideoTrack", (track) => {
    //   console.log("rct", track._userId);
    //   if (this.$data.userId == track._userId) {
    //     console.log("自己的远端流", track);
    //     this.$refs.video && track.play(this.$refs.video);
    //   } else {
    //     console.log("非自己远端流");
    //     this.$refs.videoInVideo && track.play(this.$refs.videoInVideo);
    //   }
    // });
    this.$store.state.giftNum = 0; //清零礼物
  },
  mounted() {
    console.log("moted");
    if (this.$store.state.userInfo.imToken == "") {
      console.log("未登录状态转到登录页面", this.$store.state.userInfo.imToken);
      this.$router.push("/login");
      return;
    }

    //视频节点传到sdk
    this.$RCLiveRoomLib.rtc.body.videoNode = this.$refs.video;
    this.$RCLiveRoomLib.rtc.body.miniNode = this.$refs.videoInVideo;
    //聊天室组建传到store
    this.$store.state.Chatroom = this.$refs.chatroom;

    if (this.$data.isAnchor) {
      console.log("主播身份");
    } else {
      console.log("观众 身份");
      if (
        this.$RCLiveRoomLib._roomidcli &&
        this.$RCLiveRoomLib._roomidcli != ""
      ) {
        //在房间内。
        if (this.$RCLiveRoomLib._roomidcli == GetQueryString("roomid")) {
          console.log("在原房间");
          this.$RCLiveRoomLib.rtc.body.videoNode = this.$refs.video;
          this.$RCLiveRoomLib.rtc.body.miniNode = this.$refs.videoInVideo;
          this.$RCLiveRoomLib.getExist();
          this.init(); //初始化房间信息
        } else {
          console.log("新房间");
          this.$store.state.currentRoomId = GetQueryString("roomid");
          this.$RCLiveRoomLib
            .leaveRoom(this.$RCLiveRoomLib._roomidcli)
            .then(() => {
              setTimeout(() => {
                this.joinroom();
              }, 1000);
            });
        }
      } else {
        console.log("没有加入房间观众加入房间");
        this.joinroom();
      }
    }

    console.log("this.$store.state.Chatroom", this.$store.state.Chatroom);
    if (this.$data.isAnchor) {
      tryPreview(this);
    }
    function tryPreview(target) {
      if (target.$RCLiveRoomLib && target.$RCLiveRoomLib.rtcready) {
        target.$RCLiveRoomLib.preview({
          videoNode: target.$refs.video,
        });
      } else {
        setTimeout(() => {
          tryPreview(target);
        }, 20);
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    console.log("路由", this.$data.isAnchor);
    if (this.$data.isAnchor) {
      //如果是主播直接退出房间
      this.$RCLiveRoomLib.leaveRoom(this.$data.roomId);
      Request.deleteRoom({ roomId: this.$data.roomId });
      this.$data.isAnchor = false;
    }
    this.$store.state.giftNum = 0;
    this.$store.state.onMic = false;
    this.$store.state.onLink = false;
    this.$store.state.creatUser = false;
    this.$store.state.isFreeEnterSeat = false;
    this.$data.isAnchor = false;
    this.$store.state.RequestSeatUserIds = [];
    next();
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url("./index.css");
</style>