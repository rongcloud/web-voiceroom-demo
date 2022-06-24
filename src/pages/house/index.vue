<template>
  <div>
    <div
      class="house"
      id="house"
      :style="{
        filter: 'blur(' + houseFilter + 'px)',
        backgroundImage: 'url(' + this.$store.state.roomBackground + ')',
      }"
    >
      <div class="top">
        <div
          @click="openUserList"
          class="top-left"
          :style="{ filter: 'blur(' + topFilter + 'px)' }"
        >
          <span class="top-left-name">{{ setRoomTitle() }}</span>
          <div class="top-left-foot">
            <span class="top-left-id">ID </span>
            <span class="top-left-id-num">{{
              this.$store.state.roomInformation.id
            }}</span>
            <span class="top-left-online">在线</span>
            <span class="top-left-online-num">{{
              this.$store.state.roomUserList
                ? this.$store.state.roomUserList.length
                : 0
            }}</span>
          </div>
        </div>
        <div
          @click="clickTopRight"
          :class="BackClass"
          :style="{ filter: 'blur(' + topFilter + 'px)' }"
        ></div>
      </div>
      <div class="center">
        <div
          class="center-top"
          :style="{ filter: 'blur(' + topFilter + 'px)' }"
        >
          <div @click="clickNotice" class="center-top-notice"></div>
        </div>
        <div class="homeowner">
          <div class="homeowner-Templat">
            <div
              class="homeowner-Templat-img"
              :style="
                houserMap['userId']
                  ? {
                      backgroundImage:
                        'linear-gradient(#FF0000 0%, #0000cc 100%)',
                    }
                  : {}
              "
            >
              <!-- <div
                v-if="OwerMute && houserMap['userId']"
                class="circle"
                :class="circlemove"
              ></div>
              <div
                v-if="OwerMute && houserMap['userId']"
                class="circle2"
                :class="circle2move"
              ></div> -->
              <div v-if="OwerMute" class="image-mute"></div>
              <el-image
                class="image-ower"
                fit="cover"
                @click="seatWave"
                :src="
                  houserMap['userId']
                    ? houserMap['portrait']
                      ? this.$store.state.defaultAddress + houserMap['portrait']
                      : this.$store.state.defaultAvatarUrl
                    : homeOwerImg
                "
              >
              </el-image>
            </div>
            <div class="homeowner-Templat-name">
              <span
                class="homeowner-Templat-Administrators"
                :style="{
                  backgroundImage: Administrators,
                  paddingLeft: '0.14rem',
                }"
                >{{ houserMap["userName"] }}</span
              >
            </div>
            <span class="homeowner-Templat-gift">
              <span class="homeowner-Templat-gift-text">{{
                houserMap["gift"] ? houserMap["gift"] : 0
              }}</span>
            </span>
          </div>
        </div>
        <div class="audience">
          <div class="audience-fa">
            <div v-for="(item, i) in itemList" :key="i" class="audience-item">
              <Seat :item="item" @clickSeat="clickSeat" />
            </div>
          </div>
        </div>
      </div>
      <!-- <el-button
        @click="getSeatInfolist"
        type="primary"
        style="margin-left: 16px; z-index: 10000000; position: absolute"
      >
        获取远程数据
      </el-button> -->
      <div class="room-talk">
        <liveChat
          ref="chatroom"
          @nameClick="nameClick"
          :top="talkTop"
          :height="talkHeight"
        />
      </div>
      <bottomBar
        @msgOut="msgOut"
        @btnGift="btnGift"
        @ApplyWeatModel="ConnectMic"
        @ApplyWeat="ApplyWeat"
        @SetupModel="ConnectOperation"
        ref="bottomBar"
      ></bottomBar>
    </div>
    <UserList
      ref="UserList"
      @onCloseUserList="onCloseUserList"
      @onClickUserList="onClickUserList"
    />
    <RoomBack ref="RoomBack" @RoomBackClose="onRoomBackClose" />
    <RoomFit ref="RoomFit" :RoomFitItemList="RoomFitItemList" />
    <Notice ref="Notice" />
    <ConnetWeat ref="ConnetWeat" />
    <UserClickOwner ref="UserClickOwner" @UserInforMute="UserInforMute" />
    <UserClickSeizeSeat
      ref="UserClickSeizeSeat"
      @giftClick="giftClick"
      @SeatAdminChange="SeatAdminChange"
    />
    <AdminClickOther ref="AdminClickOther" @giftClick="giftClick" />
    <UserClickEmptySeat
      ref="UserClickEmptySeat"
      @clickInvitation="clickInvitation"
    />
    <AudienceClickOwer ref="AudienceClickOwer" />
    <AudienceClickSeizeSeat
      ref="AudienceClickSeizeSeat"
      @giftClick="giftClick"
    />
    <CancelEvenSeat ref="CancelEvenSeat" />

    <!-- <RoomBack ref="RoomBack" @RoomBackClose="onRoomBackClose" /> -->
    <!-- 接入gift -->
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
import UserList from "../../components/room/UserList.vue";
import RoomBack from "../../components/room/RoomBack.vue";
import Seat from "../../components/room/seat.vue";
import RoomFit from "../../components/RoomFit.vue";
import Notice from "../../components/room/Notice.vue";
import ConnetWeat from "../../components/room/ConnetWeat.vue";
import UserClickOwner from "../../components/seat/userClickOwner.vue";
import UserClickSeizeSeat from "../../components/seat/userClickSeizeSeat.vue";
import AdminClickOther from "../../components/seat/AdminClickOther.vue";
import UserClickEmptySeat from "../../components/seat/userClickEmptySeat.vue";
import AudienceClickOwer from "../../components/seat/audienceClickOwer.vue";
import AudienceClickSeizeSeat from "../../components/seat/audieClickSeizeSeat.vue";
import CancelEvenSeat from "../../components/room/CancelEvenSeat.vue";
//接入
import liveChat from "../../components/baseUi/liveChat.vue";
import bottomBar from "../../components/baseUi/bottomBar.vue";
import giftPanel from "../../components/baseUi/giftPanel.vue";

import {
  RoomFitItemList,
  BackList,
  muteAndInset,
  unmuteAndInset,
  emptyMuteAndLock,
  emptyMuteAndUnlock,
  emptyUnmuteAndLock,
  emptyUnmuteAndUnlock,
  isAdminAndInset,
  outset,
} from "./static.js";
import request from "../../request/index";
import LoginVue from "../../components/Login.vue";
export default {
  name: "House",
  data: function () {
    return {
      tabStretch: true,
      activeName: "first",
      circlemove: "",
      circle2move: "",
      keepMove: true,
      houseFilter: 0,
      BackClass: "top-right",
      creatuser: false,
      topFilter: 0,
      OwerMute: false,
      houserMap: {},
      roomId: "",
      seatInfo: {
        mute: false,
        speaking: false,
        status: "0",
        userId: "",
      },
      GiftAndManageList: {
        GiftObj: {},
        ManageObj: {},
      },
      Administrators:
        // eslint-disable-next-line no-undef
        "url(" + require("../../assets/roomicon/administrators.png") + ")",
      // eslint-disable-next-line no-undef
      homeOwerImg: require("../../assets/roomicon/OwerIcon.png"),
      // eslint-disable-next-line no-undef
      OwerImg: require("../../assets/DefaultImg.png"),
      RoomFitItemList: [],
      itemList: [],
      dblclickPage: false,
      talkTop: 64.5,
      talkHeight: 28,
      //接入
      showGift: false,
    };
  },
  props: {
    msg: String,
  },
  components: {
    UserList,
    RoomBack,
    Seat,
    RoomFit,
    Notice,
    ConnetWeat,
    UserClickOwner,
    UserClickSeizeSeat,
    AdminClickOther,
    UserClickEmptySeat,
    AudienceClickOwer,
    AudienceClickSeizeSeat,
    CancelEvenSeat,
    //接入
    liveChat,
    bottomBar,
    giftPanel,
  },
  methods: {
    getSeatInfolist: async function () {
      const list = await this.$RCVoiceRoomLib.getLatestSeatInfo();
      console.log(list);
      console.log(this.$RCVoiceRoomLib);
    },

    //设置房间title
    setRoomTitle: function () {
      let title;
      if (this.$store.state.roomTitle == "undefined") {
        title = this.$store.state.roomInformation.roomName;
      } else {
        title = this.$store.state.roomTitle;
      }
      // console.log(title);
      if (title) {
        if (title.length > 10) {
          return title.substring(0, 10) + "...";
        } else {
          return title;
        }
      } else {
        return "";
      }
    },

    //打开用户列表
    openUserList: function () {
      request
        .roomuser({
          roomId: this.$RCVoiceRoomLib._roomidcli,
        })
        .then((res) => {
          this.$store.dispatch("getRoomUserList", res.data.data);
        });
      this.houseFilter = 5;
      this.$refs.UserList.openUserList();
    },

    //关闭用户列表
    onCloseUserList: function () {
      this.houseFilter = 0;
    },

    //点击用户列表
    onClickUserList: function (item) {
      if (!item["portrait"] && "length" in this.$store.state.roomUserList) {
        for (
          let index = 0;
          index < this.$store.state.roomUserList.length;
          index++
        ) {
          if (
            item["userId"] == this.$store.state.roomUserList[index]["userId"]
          ) {
            item = {
              ...item,
              ...this.$store.state.roomUserList[index],
            };

            break;
          }
        }
      }

      const ManageObj = this.$store.state.GiftAndManageList["ManageObj"] || {};
      if (item.userId == this.$RCVoiceRoomLib.im.userId) {
        return;
      }
      const array = [...this.$store.state.itemList];

      if (this.$store.state.creatUser) {
        //房主操作
        for (let i = 0; i < array.length; i++) {
          if (array[i]["userId"] == item.userId) {
            if (array[i]["mute"]) {
              this.$refs.UserClickSeizeSeat.UserClickSeizeSeatOpen({
                item: array[i],
                value: muteAndInset,
              });
            } else {
              this.$refs.UserClickSeizeSeat.UserClickSeizeSeatOpen({
                item: array[i],
                value: unmuteAndInset,
              });
            }
            break;
          }
          if (i == array.length - 1) {
            this.$refs.UserClickSeizeSeat.UserClickSeizeSeatOpen({
              item: item,
              value: outset,
            });
          }
        }
      } else {
        //房间其余用户操作
        if (
          item.userId in ManageObj ||
          item.userId == this.$store.state.roomInformation.createUser.userId
        ) {
          this.$refs.AudienceClickSeizeSeat.audienceClickSeizeSeatOpen(item);
          return;
        }
        if (this.$store.state.TheRoomAdmin) {
          for (let i = 0; i < array.length; i++) {
            if (array[i]["userId"] == item.userId) {
              this.$refs.AdminClickOther.AdminClickOtherOpen({
                item: item,
                value: isAdminAndInset,
              });
              return;
            }
            if (i == array.length - 1) {
              this.$refs.AdminClickOther.AdminClickOtherOpen({
                item: item,
                value: outset,
              });
            }
          }
        } else {
          this.$refs.AudienceClickSeizeSeat.audienceClickSeizeSeatOpen(item);
        }
      }
    },

    onRoomBackClose: function () {
      this.topFilter = 0;
    },

    //点击右上角
    clickTopRight: async function () {
      // console.log(this.creatuser);
      if (this.creatuser) {
        this.$refs.RoomBack.RoomBackOpen(BackList);
        this.topFilter = 5;
      } else {
        try {
          await this.$RCVoiceRoomLib.leaveRoom(this.$RCVoiceRoomLib._roomidcli);
          this.$router.go(-1);
        } catch (error) {
          this.$store.dispatch("showToast", {
            value: "离开房间失败",
          });
          console.log(error);
        }
      }
    },

    //打开公告
    clickNotice: function () {
      this.$refs.Notice.setPopup({
        isShow: false,
        value: this.$RCVoiceRoomLib.roomInfo["extra"]
          ? this.$RCVoiceRoomLib.roomInfo["extra"]
          : "欢迎来到 " + this.$RCVoiceRoomLib.roomInfo["roomName"],
      });
    },

    ConnectMic: function () {
      this.$refs.ConnetWeat.openConnetWheat(false);
    },

    //房主设置状态控制
    ConnectOperation: function () {
      // console.log(this.$RCVoiceRoomLib.roomInfo);
      const RoomFitList = [...RoomFitItemList];
      if (this.$store.state.roomPrivate.isPrivate == 1) {
        RoomFitList[0] = {
          value: "房间解锁",
          img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/UnLockRoom.png") + ")",
        };
      }
      if (this.$RCVoiceRoomLib.roomInfo.isFreeEnterSeat) {
        RoomFitList[4] = {
          value: "申请上麦",
          // eslint-disable-next-line no-undef
          img: "url(" + require("../../assets/roomicon/BApplyWheat.png") + ")",
        };
      }
      if (this.$RCVoiceRoomLib.roomInfo.isMuteAll) {
        RoomFitList[5] = {
          value: "解锁全麦",
          img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/UnMuteAllSeat.png") + ")",
        };
      }
      if (this.$RCVoiceRoomLib.roomInfo.isLockAll) {
        RoomFitList[6] = {
          value: "解锁全座",
          img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/UnlockAllSeat.png") + ")",
        };
      }

      if (this.$store.state.muteMicrophone) {
        RoomFitList[7] = {
          value: "取消静音",
          // eslint-disable-next-line no-undef
          img: "url(" + require("../../assets/roomicon/UnMuteOne.png") + ")",
        };
      }
      if (this.$RCVoiceRoomLib.roomInfo.seatCount == 5) {
        RoomFitList[8] = {
          value: "设置8个座位",
          img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/BSetEightSeats.png") + ")",
        };
      }
      this.RoomFitItemList = RoomFitList;
      this.$refs.RoomFit.openRoomFit();
    },

    //同步房主静音状态
    UserInforMute: function (b) {
      this.OwerMute = b;
    },

    //空座位跳转邀请用户
    clickInvitation: function () {
      this.$refs.ConnetWeat.openConnetWheat(true);
    },

    //设置座位List
    SetSeatList: async function (resValue) {
      this.houserMap = {};
      let roomUserListMap = {};
      this.itemList = [];
      if (
        !this.$store.state.roomUserList ||
        this.$store.state.roomUserList.length == 0
      ) {
        return;
      }

      if (!this.$RCVoiceRoomLib.seatInfoList[0]) {
        this.$RCVoiceRoomLib.seatInfoList[0] = {
          ...this.seatInfo,
        };
        this.$RCVoiceRoomLib.seatInfoList[0]["status"] = 1;
        this.$RCVoiceRoomLib.seatInfoList[0]["userId"] =
          this.$store.state.roomInformation.createUser.userId;
      }
      for (let m = 0; m < this.$store.state.roomUserList.length; m += 1) {
        roomUserListMap[this.$store.state.roomUserList[m]["userId"]] =
          this.$store.state.roomUserList[m];
      }

      // if (this.$RCVoiceRoomLib.seatInfoList[0]["mute"] != !this.OwerMute) {
      //   this.OwerMute = !this.$RCVoiceRoomLib.seatInfoList[0]["mute"];
      // }

      if (
        this.$RCVoiceRoomLib.seatInfoList[0]["extra"] &&
        JSON.parse(this.$RCVoiceRoomLib.seatInfoList[0]["extra"])[
          "disableRecording"
        ]
      ) {
        this.OwerMute = true;
      } else {
        this.OwerMute = false;
      }

      if (
        this.$RCVoiceRoomLib.seatInfoList[0]["userId"] &&
        this.$RCVoiceRoomLib.seatInfoList[0]["userId"] in roomUserListMap
      ) {
        this.houserMap = {
          ...roomUserListMap[this.$RCVoiceRoomLib.seatInfoList[0]["userId"]],
        };
      }

      if (
        this.$RCVoiceRoomLib.seatInfoList[0]["userId"] &&
        this.$RCVoiceRoomLib.seatInfoList[0]["userId"] in resValue.GiftObj
      ) {
        this.houserMap = {
          ...this.houserMap,
          gift: resValue.GiftObj[
            this.$RCVoiceRoomLib.seatInfoList[0]["userId"]
          ],
        };
      }

      this.houserMap = {
        ...this.houserMap,
        ...this.$RCVoiceRoomLib.seatInfoList[0],
      };

      let arr = [];

      let seatCountNumber = 9;
      if (
        this.$RCVoiceRoomLib.roomInfo &&
        this.$RCVoiceRoomLib.roomInfo.seatCount != 9
      ) {
        seatCountNumber = this.$RCVoiceRoomLib.roomInfo.seatCount;
      }
      for (let p = 1; p < seatCountNumber; p += 1) {
        let OtherMap = {};
        if (
          this.$RCVoiceRoomLib.seatInfoList[p] &&
          this.$RCVoiceRoomLib.seatInfoList[p]["userId"]
        ) {
          if (
            this.$RCVoiceRoomLib.seatInfoList[p]["userId"] in roomUserListMap
          ) {
            OtherMap = {
              ...roomUserListMap[
                this.$RCVoiceRoomLib.seatInfoList[p]["userId"]
              ],
            };
          }

          if (
            this.$RCVoiceRoomLib.seatInfoList[p]["userId"] in resValue.ManageObj
          ) {
            OtherMap = {
              ...OtherMap,
              isAdmin: true,
            };
          }

          if (
            this.$RCVoiceRoomLib.seatInfoList[p]["userId"] in resValue.GiftObj
          ) {
            OtherMap = {
              ...OtherMap,
              gift: resValue.GiftObj[
                this.$RCVoiceRoomLib.seatInfoList[p]["userId"]
              ],
            };
          }
        }

        if (this.$RCVoiceRoomLib.seatInfoList[p]) {
          arr.push({
            ...OtherMap,
            ...this.$RCVoiceRoomLib.seatInfoList[p],
            index: p,
          });
        } else {
          this.$RCVoiceRoomLib.seatInfoList[p] = {
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
        if (this.$RCVoiceRoomLib.im.userId == arr[index].userId) {
          this.$store.dispatch("updateuserInseat", true);
          break;
        }
        if (index == arr.length - 1) {
          this.$store.dispatch("updateuserInseat", false);
        }
      }
      this.itemList = arr;
      this.$store.dispatch("updateItemList", arr);
    },

    //礼物请求获取数据
    getGiftList: function () {
      console.log(this.$RCVoiceRoomLib._roomidcli);
      return request
        .getGiftList({
          roomId: this.$RCVoiceRoomLib._roomidcli,
        })
        .then(async (res) => {
          let GiftObj = {};
          if (res.data.code == 10000 && res.data.data.length > 0) {
            for (let i = 0; i < res.data.data.length; i += 1) {
              GiftObj = {
                ...GiftObj,
                ...res.data.data[i],
              };
            }
          }
          return { GiftObj: GiftObj };
        });
    },

    //获取管理员数据
    getManageList: function () {
      return request
        .manageList({
          roomId: this.$RCVoiceRoomLib._roomidcli,
        })
        .then(async (res) => {
          let ManageObj = {};
          if (res.data.code == 10000 && res.data.data.length > 0) {
            for (let i = 0; i < res.data.data.length; i += 1) {
              ManageObj[res.data.data[i]["userId"]] = res.data.data[i];
            }
          }
          return { ManageObj: ManageObj };
        });
    },

    //房主点击自己座位
    seatWave: async function () {
      const UserList = JSON.parse(
        JSON.stringify(this.$store.state.roomUserList)
      );

      if (!this.creatuser) {
        return;
      }
      if (
        this.$RCVoiceRoomLib.seatInfoList[0]["status"] == 1 &&
        this.$RCVoiceRoomLib.seatInfoList[0]["userId"]
      ) {
        let item = this.$RCVoiceRoomLib.seatInfoList[0];
        for (let i = 0; i < UserList.length; i += 1) {
          if (
            UserList[i]["userId"] ==
            this.$RCVoiceRoomLib.seatInfoList[0]["userId"]
          ) {
            item = {
              ...item,
              ...UserList[i],
              index: 0,
            };
            this.$refs.UserClickOwner.userClickOwnerOpen(item);
            break;
          }
        }
      } else {
        await this.$RCVoiceRoomLib.enterSeat(0);
        this.SetSeatList(this.$store.state.GiftAndManageList);
      }
    },

    //礼物更新
    sendGiftSuccess: async function () {
      const gift = await this.getGiftList();
      this.updateAdminAndGift(gift);
    },

    //管理员控制(房主)
    SeatAdminChange: async function () {
      const Manage = await this.getManageList();
      // console.log(Manage);
      this.updateAdminAndGift(Manage);
    },

    //更新礼物和管理员
    updateAdminAndGift: function (item) {
      this.$store
        .dispatch("getGiftAndManageList", {
          ...this.$store.state.GiftAndManageList,
          ...item,
        })
        .then(() => {
          this.SetSeatList(this.$store.state.GiftAndManageList);
        });
    },

    //点击座位
    clickSeat: async function (item) {
      if (this.creatuser) {
        if (item["userId"]) {
          if (item["mute"]) {
            this.$refs.UserClickSeizeSeat.UserClickSeizeSeatOpen({
              item: item,
              value: muteAndInset,
            });
          } else {
            this.$refs.UserClickSeizeSeat.UserClickSeizeSeatOpen({
              item: item,
              value: unmuteAndInset,
            });
          }
        } else {
          if (item["mute"]) {
            if (item["status"] == 2) {
              this.$refs.UserClickEmptySeat.UserClickEmptySeatOpen({
                item: item,
                value: emptyMuteAndLock,
              });
            } else if (item["status"] == 0) {
              this.$refs.UserClickEmptySeat.UserClickEmptySeatOpen({
                item: item,
                value: emptyMuteAndUnlock,
              });
            }
          } else {
            if (item["status"] == 2) {
              this.$refs.UserClickEmptySeat.UserClickEmptySeatOpen({
                item: item,
                value: emptyUnmuteAndLock,
              });
            } else if (item["status"] == 0) {
              this.$refs.UserClickEmptySeat.UserClickEmptySeatOpen({
                item: item,
                value: emptyUnmuteAndUnlock,
              });
            }
          }
        }
      } else {
        if (item["status"] && item["status"] == 2) {
          this.$store.dispatch("showToast", { value: "该座位已锁定" });
          return;
        } else if (item["status"] && item["status"] == 1) {
          //座位有人
          if (this.$RCVoiceRoomLib.im.userId == item["userId"]) {
            this.$refs.AudienceClickOwer.audienceClickOwerOpen(item);
            return;
          } else {
            if (item.isAdmin) {
              this.$refs.AudienceClickSeizeSeat.audienceClickSeizeSeatOpen(
                item
              );
              return;
            }
            if (
              this.$RCVoiceRoomLib.im.userId in
              this.GiftAndManageList["ManageObj"]
            ) {
              this.$refs.AdminClickOther.AdminClickOtherOpen({
                item: item,
                value: isAdminAndInset,
              });
            } else {
              this.$refs.AudienceClickSeizeSeat.audienceClickSeizeSeatOpen(
                item
              );
            }
            return;
          }
        } else {
          //观众空座位
          const array = [...this.$store.state.itemList];
          for (let i = 0; i < array.length; i++) {
            if (
              array[i]["userId"] == this.$RCVoiceRoomLib.im.userId &&
              i + 1 != item["index"]
            ) {
              try {
                await this.$RCVoiceRoomLib.switchSeatTo(item["index"]);
                setTimeout(() => {
                  this.$store.dispatch("getSeatInfoList");
                }, 50);
              } catch (error) {
                this.$store.dispatch("showToast", {
                  value: "跳麦失败",
                });
                console.log(error);
              }

              break;
            }
            if (i == array.length - 1) {
              if (this.$RCVoiceRoomLib.roomInfo.isFreeEnterSeat) {
                try {
                  await this.$RCVoiceRoomLib.enterSeat(item["index"]);
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
              } else {
                const len = await this.$RCVoiceRoomLib.getRequestSeatUserIds();
                this.$store.dispatch("getRequestSeatUserIds", len);
                // console.log(len);
                if (len.length > 20) {
                  this.$store.dispatch("showToast", {
                    value: "排麦人数太多,排麦失败",
                  });
                  return;
                }
                for (let i = 0; i < len.length; i += 1) {
                  if (len[i] == this.$RCVoiceRoomLib.im.userId) {
                    this.$store.dispatch("showToast", {
                      value: "已经在排麦列表中了",
                    });
                    return;
                  }
                }
                // console.log(bor);
                await this.$RCVoiceRoomLib.requestSeat();
                this.$store.dispatch("showToast", {
                  value: "已申请连线，等待房主接受",
                });
                setTimeout(() => {
                  this.$store.dispatch("userHasApply", true);
                }, 50);
              }
            }
          }
        }
      }
    },

    //点击送单人礼物
    giftClick: function (item) {
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

    //接入事件
    msgOut: function (msg) {
      // console.log(msg);
      if (msg.replace(/\s*/g, "").length == 0) {
        this.$store.dispatch("showToast", {
          value: "消息不能为空",
        });
        return;
      }
      let send = true;
      for (
        let index = 0;
        index < this.$store.state.sensitiveList.length;
        index++
      ) {
        if (msg.indexOf(this.$store.state.sensitiveList[index]["name"]) != -1) {
          send = false;
          break;
        }
      }
      let txtMsg = {
        userName: this.$store.state.userInfo.userName, // 文本内容
        userId: this.$store.state.userInfo.userId,
        content: msg,
      };
      this.$RCVoiceRoomLib.emit("MessageReceived", {
        //发本地
        //模拟本地消息发送
        messageType: "RC:Chatroom:Barrage",
        content: txtMsg,
      });
      if (send) {
        // console.log(txtMsg);
        this.$RCVoiceRoomLib.im
          .messageUpdate("RC:Chatroom:Barrage", txtMsg)
          .then((res) => {
            console.log(res);
          });
      }
    },

    //打开gift
    btnGift: function () {
      this.$data.showGift = true;
      let userInseatList = [];
      userInseatList.push({
        ...this.$store.state.roomInformation.createUser,
        creatuser: true,
      });
      const arr = this.$store.state.itemList;
      for (let index = 0; index < arr.length; index++) {
        if (this.$store.state.itemList[index]["userId"]) {
          userInseatList.push(arr[index]);
        }
      }
      this.$store.dispatch("getMicData", userInseatList);
      this.$refs.giftPanel.showGift(userInseatList);
    },

    //关闭gift
    hideGift: function () {
      this.$data.showGift = false;
    },

    //点击聊天用户
    nameClick: function (e) {
      this.onClickUserList(e);
    },

    //请求排麦与否
    ApplyWeat: async function () {
      // console.log("this.$RCVoiceRoomLib.roomInfo", this.$RCVoiceRoomLib);
      if (this.$RCVoiceRoomLib.roomInfo.isFreeEnterSeat) {
        try {
          const findSeat = await this.$RCVoiceRoomLib.findSeat();
          await this.$RCVoiceRoomLib.enterSeat(findSeat);
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

        return;
      }
      if (this.$store.state.HasApply) {
        this.$refs.CancelEvenSeat.CancelEvenSeatOpen();
      } else {
        await this.$RCVoiceRoomLib.requestSeat();
        this.$store.dispatch("showToast", {
          value: "已申请连线，等待房主接受",
        });
        setTimeout(() => {
          this.$store.dispatch("userHasApply", true);
        }, 50);
      }
    },

    //获取roominformation
    getRoominformation: function () {
      request
        .roominformation({ roomId: this.$RCVoiceRoomLib._roomidcli })
        .then((res) => {
          if (res.data.code == 10000) {
            this.$store.dispatch("getRoomInformation", res.data.data);
            this.$store.dispatch(
              "getroomBackground",
              res.data.data.backgroundUrl
            );
            this.$store.dispatch("getroomTitle", res.data.data.roomName);

            this.$store.dispatch("getroomPrivate", {
              isPrivate: res.data.data.isPrivate,
              password: res.data.data.password,
            });
            this.$store.dispatch("getMicrophone", false);
            const createUser = res.data.data.createUser;
            this.getroomuser(createUser);
            this.$nextTick(() => {
              this.$store.dispatch("getChatroom", this.$refs.chatroom);
              this.$refs.chatroom.welcome();
              this.roomId = this.$RCVoiceRoomLib._roomidcli;
              // console.log(this.$RCVoiceRoomLib);
              if (
                this.$RCVoiceRoomLib.roomInfo &&
                this.$RCVoiceRoomLib.roomInfo.seatCount
              ) {
                this.$store.dispatch(
                  "getsetCountsChange",
                  this.$RCVoiceRoomLib.roomInfo.seatCount
                );
                if (this.$RCVoiceRoomLib.roomInfo.seatCount == 9) {
                  this.talkTop = 64.5;
                  this.talkHeight = 28;
                } else {
                  this.talkTop = 50;
                  this.talkHeight = 42;
                }
              } else {
                this.talkTop = 64.5;
                this.talkHeight = 28;
              }
              if (
                res.data.data.createUser.userId !=
                this.$RCVoiceRoomLib.im.userId
              ) {
                this.BackClass = "top-right-close";
                this.creatuser = false;
                this.$store.dispatch("setcreatuser", false);
              } else {
                this.BackClass = "top-right";
                this.creatuser = true;
                this.$store.dispatch("setcreatuser", true);
              }
            });
          } else {
            console.log("err", res.data);
          }
        })
        .catch(() => {
          // console.log(err);
        });
    },

    //获取roomuser
    getroomuser: function (createUser) {
      request
        .roomuser({
          roomId: this.$RCVoiceRoomLib._roomidcli,
        })
        .then(async (res) => {
          // console.log(res);
          this.$store.dispatch("getRoomUserList", res.data.data);
          console.log(createUser);
          this.getGiftAndMan(true);
        });
    },

    //获取gift和管理员
    getGiftAndMan: function (item) {
      Promise.all([this.getGiftList(), this.getManageList()])
        .then((res) => {
          // console.log(res);
          if (this.$RCVoiceRoomLib.im.userId in res[1]["ManageObj"]) {
            this.$store.dispatch("setRoomAdmin", true);
          } else {
            this.$store.dispatch("setRoomAdmin", false);
          }
          // // console.log(this.$store.state.roomUserList);
          this.$nextTick(async () => {
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
            if (
              this.$RCVoiceRoomLib.seatInfoList[0] &&
              !this.$RCVoiceRoomLib.seatInfoList[0]["userId"] &&
              this.$store.state.creatUser &&
              item
            ) {
              await this.$RCVoiceRoomLib.enterSeat(0);
              // console.log(
              //   "isDisableAudioRecording",
              //   this.$RCVoiceRoomLib.isDisableAudioRecording()
              // );
              if (
                "extra" in this.$RCVoiceRoomLib.seatInfoList[0] &&
                JSON.parse(this.$RCVoiceRoomLib.seatInfoList[0]["extra"])[
                  "disableRecording"
                ]
              ) {
                this.$RCVoiceRoomLib.disableAudioRecording(true);
              }

              setTimeout(() => {
                this.SetSeatList(Obj);
              }, 500);
            }
          });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },

    //扩散动画
    owerSetSpreadAnimatio: function (res) {
      if (res) {
        if (this.keepMove) {
          this.circlemove = "move";
          this.keepMove = false;
          setTimeout(() => {
            this.circle2move = "move";
          }, 700);
        }
      } else {
        setTimeout(() => {
          this.circlemove = "";
          this.keepMove = true;
          setTimeout(() => {
            this.circle2move = "";
          }, 700);
        }, 800);
      }
    },
  },
  watch: {
    listenseatInfoList: function () {
      console.log("麦位发生变化:", this.$RCVoiceRoomLib.seatInfoList);
      if (
        this.$store.state.roomUserList &&
        this.$store.state.roomUserList.length
      ) {
        this.SetSeatList(this.$store.state.GiftAndManageList);
      }

      if (
        this.$RCVoiceRoomLib.seatInfoList[0] &&
        this.$RCVoiceRoomLib.seatInfoList[0]["extra"] &&
        JSON.parse(this.$RCVoiceRoomLib.seatInfoList[0]["extra"])[
          "disableRecording"
        ]
      ) {
        this.OwerMute = true;
      } else {
        this.OwerMute = false;
      }
    },

    listenroomUserList: function () {
      this.getGiftAndMan(false);
    },

    listengiftValue: function () {
      this.sendGiftSuccess();
    },

    listenAdminValue: async function () {
      this.SeatAdminChange();
    },

    listenSpeakingChengeControl: function () {
      if (this.$store.state.SpeakingChenge.index == 0) {
        if (this.$store.state.SpeakingChenge.speaking == 0) {
          this.owerSetSpreadAnimatio(false);
        } else {
          this.owerSetSpreadAnimatio(true);
        }
      }
    },
    listenseatCount: function (newValue) {
      // console.log(newValue);
      if (newValue == 9) {
        this.talkTop = 64.5;
        this.talkHeight = 28;
      } else {
        this.talkTop = 50;
        this.talkHeight = 42;
      }
    },
  },
  computed: {
    listenseatInfoList() {
      return this.$store.state.seatInfoList;
    },
    listenroomUserList() {
      return this.$store.state.roomUserList;
    },
    listengiftValue() {
      return this.$store.state.giftValue;
    },
    listenAdminValue() {
      return this.$store.state.AdminValue;
    },
    listenSpeakingChengeControl() {
      return this.$store.state.SpeakingChengeControl;
    },
    listenseatCount() {
      return this.$store.state.setCounts;
    },
  },
  created() {
    this.$nextTick(async () => {
      if (this.$RCVoiceRoomLib._roomidcli) {
        const arr = await this.$RCVoiceRoomLib.getRequestSeatUserIds();
        this.$store.dispatch("getRequestSeatUserIds", arr);
      }
    });
  },
  mounted() {
    console.log("mounted::::");
    if (this.$RCVoiceRoomLib._roomidcli) {
      this.getRoominformation();
    }
    console.log(navigator.userAgent);
    // console.log("当前seat：", this.$store.state.GiftAndManageList);
    if (
      navigator.userAgent.indexOf("Macintosh") > -1 &&
      navigator.userAgent.indexOf("Safari") > -1 &&
      navigator.userAgent.indexOf("Mac") > -1 &&
      navigator.userAgent.indexOf("Chrome") == -1
    ) {
      this.$confirm("是否打开播放器 ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.$RCVoiceRoomLib.enableSpeaker().then(() => {
            this.SetSeatList(this.$store.state.GiftAndManageList);
          });
        })
        .catch(() => {
          // console.log("取消");
        });
    }
    window.addEventListener("load", () => {
      if (this.$route.name != "login") {
        this.$router.replace("/login");
      }
    });
  },
};
</script>
<style scoped>
@import url("./index.css");
</style>>