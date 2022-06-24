<template>
  <div class="hello">
    <button @click="getRoomMap">获取房间属性</button>
    <button @click="joinRoom">加入房间</button>
    <button @click="leaveRoom">离开房间</button>
    <button @click="enterSeat">自由上麦</button>
    <button @click="leaveSeat">下麦</button>
    <button @click="switchSeatTo">跳麦</button>
    <button @click="pickUserToSeat">抱用户上麦</button>
    <button @click="kickUserFromRoom">踢用户出房间</button>
    <button @click="muteSeat">单静麦</button>
    <button @click="lockSeat">单锁麦</button>
    <button @click="setRoomInfo">
      设置房间属性(切换座位/设置自由上麦与否)
    </button>
    <button @click="muteOtherSeats">全麦静音</button>
    <button @click="lockOtherSeats">全麦锁座</button>
    <button @click="sendMessage">发送消息</button>
    <button @click="getRequestSeatUserIds">标识集合</button>
    <button @click="getLatestSeatInfo">new麦位</button>
    <button @click="updateSeatInfo">获取麦位extra</button>
    <button @click="requestSeat">请求排麦</button>
    <button @click="cancelRequestSeat">取消排麦请求</button>
    <button @click="acceptRequestSeat">同意排麦请求</button>
    <button @click="rejectRequestSeat">拒绝排麦请求</button>
  </div>
</template>

<script>
import * as RongIMLib from "@rongcloud/imlib-v4";
import { installer } from "@rongcloud/plugin-rtc";
import store from "../store/index";

export default {
  name: "HelloWorld",
  data: function () {
    return {
      roomidcli: "xBJScrrUT1cqn1Ld5g3X5s",
      userId: "bfbfcb7e-ebbb-4d45-a8aa-452409b510be",
      userName: "融云用户3580",
      RCSeatInfoSeatPartPrefixKey: "RCSeatInfoSeatPartPrefixKey_",
      RCSeatInfoUserPartPrefixKey: "RCSeatInfoUserPartPrefixKey_",
      RCVoiceSeatInfo: class {
        constructor(status = "0", mute = false, speaking = false) {
          this.status = status;
          this.mute = mute;
          this.speaking = speaking;
        }
      },
      roomInfo: {
        isFreeEnterSeat: true,
        isLockAll: false,
        isMuteAll: false,
        roomName: "测试1234",
        seatCount: 9,
      },
      seatInfolist: {
        RCSeatInfoSeatPartPrefixKey_0: {
          status: "0",
          mute: false,
          speaking: false,
        },
        RCSeatInfoSeatPartPrefixKey_1: {
          status: "0",
          mute: false,
          speaking: false,
          userId: "",
        },
        RCSeatInfoSeatPartPrefixKey_2: {
          status: "0",
          mute: false,
          speaking: false,
        },
        RCSeatInfoSeatPartPrefixKey_3: {
          status: "0",
          mute: false,
          speaking: false,
        },
        RCSeatInfoSeatPartPrefixKey_4: {
          status: "0",
          mute: false,
          speaking: false,
        },
        RCSeatInfoSeatPartPrefixKey_5: {
          status: "0",
          mute: false,
          speaking: false,
        },
        RCSeatInfoSeatPartPrefixKey_6: {
          status: "0",
          mute: false,
          speaking: false,
        },
        RCSeatInfoSeatPartPrefixKey_7: {
          status: "0",
          mute: false,
          speaking: false,
        },
        RCSeatInfoSeatPartPrefixKey_8: {
          status: "0",
          mute: false,
          speaking: false,
        },
      },
    };
  },
  props: {
    msg: String,
  },
  methods: {
    getRoomMap: function () {
      const { im } = store.state;
      var chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });
      chatRoom.getAllEntries().then(function (entries) {
        console.log("获取所有聊天室属性信息成功", entries);
      });
    }, //测试方便使用方法
    /***************SDK方法*********************/
    /**
     * 加入语聊房
     *
     * @param roomId   房间唯一标识
     * @param callback 结果回调 {@link RCVoiceRoomCallback}
     */
    joinRoom: async function (roomId, callback) {
      roomId = this.roomidcli;
      callback = callback ? callback : function () {};
      const { im } = store.state;
      const chatRoom = im.ChatRoom.get({
        id: roomId,
      });
      // await RCChatRoomClient.shared.joinRoom(this.roomidcli)
      // await RCRTCEngine.engine.joinRoom(this.roomidcli)
      // console.log(chatRoom);
      chatRoom
        .join({
          count: 20, // 进入后, 自动拉取 20 条聊天室最新消息
        })
        .then(callback());
    },

    /**
     * 离开当前房间
     * 注意：和joinRoom成对调用
     *
     * @param callback 结果回调
     */
    leaveRoom: async function (callback) {
      callback = function () {};
      const { im } = store.state;
      var chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });
      const arr = Object.values(this.seatInfolist);
      let bor = false;
      for (let i = 0; i < arr.length; i += 1) {
        if ("userId" in arr[i] && arr[i].userId === this.userId) {
          bor = true;
        }
      }
      console.log(bor);
      if (bor) {
        this.leaveSeat();
      }
      this.notifyVoiceRoom("RCAudienceLeaveRoom", this.userId);
      chatRoom.quit().then(callback());
    },

    /**
     * 用户上麦
     *
     * @param seatIndex 麦位序号
     * @param callback  结果回调
     */
    enterSeat: function (seatIndex, callback) {
      seatIndex = 1;
      let arr = [];
      const { im } = store.state;
      var chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });
      const bar = Object.keys(this.seatInfolist).map((key) => {
        if (
          key == this.RCSeatInfoSeatPartPrefixKey + seatIndex &&
          "userId" in this.seatInfolist[key]
        ) {
          console.log(this.seatInfolist[key]);
          return true;
        } else {
          return false;
        }
      });
      console.log(callback);
      if (bar.indexOf(true) === -1) {
        arr.push(
          chatRoom
            .forceSetEntry({
              key: this.RCSeatInfoSeatPartPrefixKey + seatIndex,
              value: JSON.stringify({
                status: "1",
                mute: false,
                speaking: false,
                userId: this.userId,
              }),
              isAutoDelete: false,
              isSendNotification: false,
            })
            .then(function () {
              return "成功了";
            }),
          chatRoom
            .forceSetEntry({
              key: this.RCSeatInfoUserPartPrefixKey + seatIndex,
              value: JSON.stringify({
                status: "1",
                mute: false,
                speaking: false,
                userId: this.userId,
              }),
              isAutoDelete: false,
              isSendNotification: false,
            })
            .then(function () {
              return "成功了";
            })
        );
        const key = this.RCSeatInfoSeatPartPrefixKey + seatIndex;
        Promise.all(arr).then((result) => {
          console.log(result);
          this.seatInfolist[key] = {
            ...this.seatInfolist[key],
            status: "1",
            userId: this.userId,
          };
          console.log(this.seatInfolist[key]);
        });
      }
    },

    /**
     * 用户下麦
     * 注意：和 enterSeat()成对调用
     *
     * @param callback 结果回调
     */
    leaveSeat: function (callback) {
      const { im } = store.state;
      const chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });
      let index = "";
      let arr = [];
      const seatInfolistValues = Object.values(this.seatInfolist);
      const seatInfolistKeys = Object.keys(this.seatInfolist);
      for (let i = 0; i < seatInfolistValues.length; i += 1) {
        if (seatInfolistValues[i].userId === this.userId) {
          index = seatInfolistKeys[i].split("_")[1];
          break;
        }
      }
      const value = JSON.stringify({
        status: "0",
        mute: false,
        speaking: false,
      });
      arr.push(
        chatRoom
          .forceSetEntry({
            key: this.RCSeatInfoSeatPartPrefixKey + index,
            value: value,
            isAutoDelete: false,
            isSendNotification: false,
          })
          .then(function () {
            return "成功了";
          }),
        chatRoom
          .forceSetEntry({
            key: this.RCSeatInfoUserPartPrefixKey + index,
            value: value,
            isAutoDelete: false,
            isSendNotification: false,
          })
          .then(function () {
            return "成功了";
          })
      );
      const key = this.RCSeatInfoSeatPartPrefixKey + index;
      Promise.all(arr).then((result) => {
        console.log(result);
        this.seatInfolist[key] = {
          status: "0",
          mute: this.seatInfolist[key].mute,
          speaking: this.seatInfolist[key].speaking,
        };
        console.log(this.seatInfolist[key]);
        callback;
      });
    },

    /**
     * 将指定麦位下麦
     *
     * @param userId   用户 Id
     * @param callback 结果回调
     */
    kickUserFromSeat: function (userId, callback) {
      const { im } = store.state;
      const chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });
      let index = "";
      let arr = [];
      const seatInfolistValues = Object.values(this.seatInfolist);
      const seatInfolistKeys = Object.keys(this.seatInfolist);
      for (let i = 0; i < seatInfolistValues.length; i += 1) {
        if (seatInfolistValues[i].userId === userId) {
          index = seatInfolistKeys[i].split("_")[1];
          break;
        }
      }
      const value = JSON.stringify({
        status: "0",
        mute: false,
        speaking: false,
      });
      arr.push(
        chatRoom
          .forceSetEntry({
            key: this.RCSeatInfoSeatPartPrefixKey + index,
            value: value,
            isAutoDelete: false,
            isSendNotification: false,
          })
          .then(function () {
            return "成功了";
          }),
        chatRoom
          .forceSetEntry({
            key: this.RCSeatInfoUserPartPrefixKey + index,
            value: value,
            isAutoDelete: false,
            isSendNotification: false,
          })
          .then(function () {
            return "成功了";
          })
      );
      const key = this.RCSeatInfoSeatPartPrefixKey + index;
      Promise.all(arr).then((result) => {
        console.log(result);
        this.seatInfolist[key] = {
          status: "0",
          mute: this.seatInfolist[key].mute,
          speaking: this.seatInfolist[key].speaking,
        };
        console.log(this.seatInfolist[key]);
        callback;
      });
    },

    /**
     * 用户跳麦
     * 注意：在用户已经在麦位想切换麦位时调用
     *
     * @param seatIndex 需要跳转的麦位序号
     * @param callback  结果回调
     */
    switchSeatTo: function (seatIndex, callback) {
      console.log(seatIndex, callback);
      console.log(new this.RCVoiceSeatInfo());
      const { im } = store.state;
      var chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });
      let arr = [];
      let index = "";
      // const seatInfolistValues = Object.values(this.seatInfolist);
      // for (let i = 0; i < seatInfolistValues.length; i += 0) {
      //   if (seatInfolistValues[i].userId === this.userId) {
      //     index = key.split("_")[1];
      //     break;
      //   }
      // } //根据内置数据获取发起跳麦操作的麦位
      index = 1; //测试
      seatIndex = 2; //测试
      const value = {
        status: "1",
        mute: false,
        speaking: false,
        userId: this.userId,
      };
      arr.push(
        chatRoom
          .forceSetEntry({
            key: `${this.RCSeatInfoSeatPartPrefixKey}${index}`,
            value: JSON.stringify(new this.RCVoiceSeatInfo()),
            isAutoDelete: false,
            isSendNotification: false,
            notificationExtra: `${this.RCSeatInfoSeatPartPrefixKey}${index}`,
          })
          .then(() => {
            // eslint-disable-next-line no-undef
            return "成功了";
          }),
        chatRoom
          .forceSetEntry({
            key: `${this.RCSeatInfoUserPartPrefixKey}${index}`,
            value: JSON.stringify(new this.RCVoiceSeatInfo()),
            isAutoDelete: false,
            isSendNotification: false,
            notificationExtra: `${this.RCSeatInfoUserPartPrefixKey}${index}`,
          })
          .then(() => {
            // eslint-disable-next-line no-undef
            return "成功了";
          }),
        chatRoom
          .forceSetEntry({
            key: `${this.RCSeatInfoSeatPartPrefixKey}${seatIndex}`,
            value: JSON.stringify(value),
            isAutoDelete: false,
            isSendNotification: false,
            notificationExtra: `${this.RCSeatInfoSeatPartPrefixKey}${seatIndex}`,
          })
          .then(() => {
            // eslint-disable-next-line no-undef
            return "成功了";
          }),
        chatRoom
          .forceSetEntry({
            key: `${this.RCSeatInfoUserPartPrefixKey}${seatIndex}`,
            value: JSON.stringify(value),
            isAutoDelete: false,
            isSendNotification: false,
            notificationExtra: `${this.RCSeatInfoUserPartPrefixKey}${seatIndex}`,
          })
          .then(() => {
            // eslint-disable-next-line no-undef
            return "成功了";
          })
      );
      const key = this.RCSeatInfoSeatPartPrefixKey + seatIndex;
      Promise.all(arr).then((result) => {
        console.log(result);
        this.seatInfolist[key] = value;
        callback;
      });
    },

    /**
     * 抱用户上麦
     *
     * @param userId   用户 Id
     * @param callback 结果回调
     */
    pickUserToSeat: function (userId, callback) {
      // userId = this.userId;
      userId = "bfbfcb7e-ebbb-4d45-a8aa-452409b510be"; //测试数据
      console.log(userId, callback);

      const { im } = store.state;
      const chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });
      chatRoom
        .send({
          messageType: "RC:VRLInviteMsg", // 填写开发者定义的 messageType
          content: {
            // 填写开发者定义的消息内容
            content: "RCPickerUserSeatContent",
            invitationId: "f9e6765b-304d-451a-be91-2bb936175888",
            sendUserId: this.userId,
            targetId: userId,
            type: 0,
          },
          isPersited: false, // 是否存储在服务端,默认为 true
          isCounted: false, // 是否计数. 计数消息接收端接收后未读数加 1，默认为 true
        })
        .then(function (message) {
          console.log("RC:VRLInviteMsg:", message);
          callback;
        });
    },
    /**
     * 将用户踢出房间
     *
     * @param userId   用户 Id
     * @param callback 结果回调
     */
    kickUserFromRoom: function (userId, callback) {
      // userId = this.userId;
      userId = "bfbfcb7e-ebbb-4d45-a8aa-452409b510be"; //测试数据
      console.log(userId, callback);

      const { im } = store.state;
      const chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });
      chatRoom
        .send({
          messageType: "RC:VRLInviteMsg",
          content: {
            // 填写开发者定义的消息内容
            content: "RCKickUserOutRoomContent",
            invitationId: "a6e7b97c-fd67-4e52-9e6f-d164f7745091",
            sendUserId: this.userId,
            targetId: userId,
            type: 0,
          },
          isPersited: false, // 是否存储在服务端,默认为 true
          isCounted: false, // 是否计数. 计数消息接收端接收后未读数加 1，默认为 true
        })
        .then(function (message) {
          console.log("RC:VRLInviteMsg:", message);
          callback;
        });
    },
    /**
     * 将某个麦位静音
     *
     * @param seatIndex 麦位序号
     * @param isMute    是否静音
     * @param callback  结果回调
     */
    muteSeat: function (seatIndex, isLocked, callback) {
      seatIndex = 1; //测试数据
      isLocked = true; //测试数据
      let arr = [];
      const { im } = store.state;
      var chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });
      console.log(callback);
      const key = this.RCSeatInfoSeatPartPrefixKey + seatIndex;
      const value = {
        ...this.seatInfolist[key],
        mute: isLocked,
      };
      arr.push(
        chatRoom
          .forceSetEntry({
            key: key,
            value: JSON.stringify(value),
            isAutoDelete: false,
            isSendNotification: false,
          })
          .then(function () {
            return "成功了";
          }),
        chatRoom
          .forceSetEntry({
            key: this.RCSeatInfoUserPartPrefixKey + seatIndex,
            value: JSON.stringify(value),
            isAutoDelete: false,
            isSendNotification: false,
          })
          .then(function () {
            return "成功了";
          })
      );
      Promise.all(arr).then((result) => {
        console.log(result);
        this.seatInfolist[key] = value;
        console.log(this.seatInfolist[key]);
      });
    },
    /**
     * 锁定麦位
     *
     * @param seatIndex 麦位序号
     * @param isLocked  是否锁麦位
     * @param callback  结果回调
     */
    lockSeat: function ({ seatIndex, isLocked, callback }) {
      seatIndex = 1; //测试数据
      isLocked = false; //测试数据
      let arr = [];
      const { im } = store.state;
      var chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });
      const key = this.RCSeatInfoSeatPartPrefixKey + seatIndex;
      let value = null;
      if (isLocked) {
        if ("userId" in this.seatInfolist[key]) {
          value = {
            mute: this.seatInfolist[key].mute,
            speaking: this.seatInfolist[key].speaking,
            status: "2",
          };
        } else {
          value = {
            ...this.seatInfolist[key],
            status: "2",
          };
        }
      } else {
        value = {
          mute: this.seatInfolist[key].mute,
          speaking: this.seatInfolist[key].speaking,
          status: "0",
        };
      }

      arr.push(
        chatRoom
          .forceSetEntry({
            key: key,
            value: JSON.stringify(value),
            isAutoDelete: false,
            isSendNotification: false,
          })
          .then(function () {
            return "成功了";
          }),
        chatRoom
          .forceSetEntry({
            key: this.RCSeatInfoUserPartPrefixKey + seatIndex,
            value: JSON.stringify(value),
            isAutoDelete: false,
            isSendNotification: false,
          })
          .then(function () {
            return "成功了";
          })
      );
      Promise.all(arr).then((result) => {
        console.log(result);
        this.seatInfolist[key] = value;
        callback;
        console.log(this.seatInfolist[key]);
      });
    },

    /**
     * 设置房间信息，房间的id必须与当前房间id一致
     *
     * @param roomInfo 修改的房间信息 {@link RCVoiceRoomInfo}
     * @param callback 结果回调
     */
    setRoomInfo: function (roomInfo, callback) {
      console.log(roomInfo, callback);
      roomInfo = {
        isFreeEnterSeat: true,
        isLockAll: false,
        isMuteAll: false,
        roomName: "测试1234",
        seatCount: 5,
        ...roomInfo,
      }; //测试
      const { im } = store.state;
      var chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });
      if (Object.prototype.toString.call(roomInfo) == "[object Object]") {
        let arr = [];
        console.log(roomInfo.seatCount, this.roomInfo.seatCount);
        if (roomInfo.seatCount !== this.roomInfo.seatCount) {
          console.log(roomInfo.seatCount);
          for (let i = 1; i < roomInfo.seatCount; i += 1) {
            arr.push(
              chatRoom
                .forceSetEntry({
                  key: this.RCSeatInfoSeatPartPrefixKey + i,
                  value: JSON.stringify(new this.RCVoiceSeatInfo()),
                  isAutoDelete: false,
                  isSendNotification: false,
                })
                .then(function () {
                  return "成功了";
                }),
              chatRoom
                .forceSetEntry({
                  key: this.RCSeatInfoUserPartPrefixKey + i,
                  value: JSON.stringify(new this.RCVoiceSeatInfo()),
                  isAutoDelete: false,
                  isSendNotification: false,
                })
                .then(function () {
                  return "成功了";
                })
            );
          }
          arr.push(
            chatRoom
              .forceSetEntry({
                key: this.RCSeatInfoSeatPartPrefixKey + 0,
                value: JSON.stringify(
                  this.seatInfolist.RCSeatInfoSeatPartPrefixKey_0
                ),
                isAutoDelete: false,
                isSendNotification: false,
              })
              .then(function () {
                return "成功了";
              }),
            chatRoom
              .forceSetEntry({
                key: this.RCSeatInfoUserPartPrefixKey + 0,
                value: JSON.stringify(
                  this.seatInfolist.RCSeatInfoSeatPartPrefixKey_0
                ),
                isAutoDelete: false,
                isSendNotification: false,
              })
              .then(function () {
                return "成功了";
              })
          );
        }
        const key = "RCRoomInfoKey";
        const value = JSON.stringify(roomInfo);
        console.log(arr);
        arr.push(
          chatRoom
            .forceSetEntry({
              key: key,
              value: value,
              isAutoDelete: false,
              isSendNotification: false,
            })
            .then(function () {
              return "成功了";
            })
        );
        Promise.all(arr).then((result) => {
          console.log(result); //更新本地麦位
          if (roomInfo.seatCount !== this.roomInfo.seatCount) {
            for (let m = 1; m < roomInfo.seatCount; m += 1) {
              let key = this.RCSeatInfoSeatPartPrefixKey + m;
              this.seatInfolist[key] = new this.RCVoiceSeatInfo();
            }
          }
          console.log(this.seatInfolist);
          callback;
        });
      } else {
        alert("roomInfo参数错误");
      }
    },

    /**
     * 将所有麦位静音打开或者关闭
     *
     * @param isMute 是否静音
     */
    muteOtherSeats: function (isMute) {
      isMute = false; //测试数据
      let arr = [];
      const { im } = store.state;
      var chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });
      Object.keys(this.seatInfolist).forEach((key) => {
        if (key !== "RCSeatInfoSeatPartPrefixKey_0") {
          arr.push(
            chatRoom
              .forceSetEntry({
                key: key,
                value: JSON.stringify({
                  ...this.seatInfolist[key],
                  mute: isMute,
                }),
                isAutoDelete: false,
                isSendNotification: false,
              })
              .then(function () {
                return "成功了";
              }),
            chatRoom
              .forceSetEntry({
                key: this.RCSeatInfoUserPartPrefixKey + key.split("_")[1],
                value: JSON.stringify({
                  ...this.seatInfolist[key],
                  mute: isMute,
                }),
                isAutoDelete: false,
                isSendNotification: false,
              })
              .then(function () {
                return "成功了";
              })
          );
        } else {
          arr.push(
            chatRoom
              .forceSetEntry({
                key: key,
                value: JSON.stringify({
                  ...this.seatInfolist[key],
                }),
                isAutoDelete: false,
                isSendNotification: false,
              })
              .then(function () {
                return "成功了";
              }),
            chatRoom
              .forceSetEntry({
                key: this.RCSeatInfoUserPartPrefixKey + key.split("_")[1],
                value: JSON.stringify({
                  ...this.seatInfolist[key],
                }),
                isAutoDelete: false,
                isSendNotification: false,
              })
              .then(function () {
                return "成功了";
              })
          );
        }
      });
      arr.push(
        chatRoom
          .forceSetEntry({
            key: "RCRoomInfoKey",
            value: JSON.stringify({
              ...this.roomInfo,
              isMuteAll: isMute,
            }),
            isAutoDelete: false,
            isSendNotification: false,
          })
          .then(function () {
            return "成功了";
          })
      );

      Promise.all(arr).then((result) => {
        console.log(result);
        // Object.keys(this.seatInfolist).forEach((key) => {
        //   this.seatInfolist[key] = {
        //     ...this.seatInfolist[key],
        //     mute: isMute,
        //   };
        // });
      });
    },

    /**
     * 将所有麦位所卖或者解除锁麦
     *
     * @param isLock
     */
    lockOtherSeats: function (isLock) {
      isLock = false; //测试数据
      let arr = [];
      let keyIsLock = isLock ? "2" : "0";
      const { im } = store.state;
      var chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });

      Object.keys(this.seatInfolist).forEach((key) => {
        if (key !== "RCSeatInfoSeatPartPrefixKey_0") {
          if (!("userId" in this.seatInfolist[key])) {
            arr.push(
              chatRoom
                .forceSetEntry({
                  key: key,
                  value: JSON.stringify({
                    ...this.seatInfolist[key],
                    status: keyIsLock,
                  }),
                  isAutoDelete: false,
                  isSendNotification: false,
                })
                .then(function () {
                  return "成功了";
                }),
              chatRoom
                .forceSetEntry({
                  key: this.RCSeatInfoUserPartPrefixKey + key.split("_")[1],
                  value: JSON.stringify({
                    ...this.seatInfolist[key],
                    status: keyIsLock,
                  }),
                  isAutoDelete: false,
                  isSendNotification: false,
                })
                .then(function () {
                  return "成功了";
                })
            );
          }
        } else {
          arr.push(
            chatRoom
              .forceSetEntry({
                key: key,
                value: JSON.stringify({
                  ...this.seatInfolist[key],
                }),
                isAutoDelete: false,
                isSendNotification: false,
              })
              .then(function () {
                return "成功了";
              }),
            chatRoom
              .forceSetEntry({
                key: this.RCSeatInfoUserPartPrefixKey + key.split("_")[1],
                value: JSON.stringify({
                  ...this.seatInfolist[key],
                }),
                isAutoDelete: false,
                isSendNotification: false,
              })
              .then(function () {
                return "成功了";
              })
          );
        }
      });
      arr.push(
        chatRoom
          .forceSetEntry({
            key: "RCRoomInfoKey",
            value: JSON.stringify({
              ...this.roomInfo,
              isLockAll: isLock,
            }),
            isAutoDelete: false,
            isSendNotification: false,
          })
          .then(function () {
            return "成功了";
          })
      );

      Promise.all(arr).then((result) => {
        console.log(result);
        // Object.keys(this.seatInfolist).forEach((key) => {
        //   this.seatInfolist[key] = {
        //     ...this.seatInfolist[key],
        //     mute: isMute,
        //   };
        // });
      });
    },

    /**
     * 发送消息
     *
     * @param message  融云消息实体
     * @param callback 结果回调
     */
    sendMessage: function (message, callback) {
      // userId = this.userId;
      message = {
        messageType: "RC:TxtMsg", // 填写开发者定义的 messageType
        content: {
          content: message,
        },
        isPersited: false, // 是否存储在服务端,默认为 true
        isCounted: true, // 是否计数. 计数消息接收端接收后未读数加 1，默认为 true
      }; //测试数据

      const { im } = store.state;
      const chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });
      chatRoom.send(message).then(function (message) {
        console.log(message);
        callback;
      });
    },

    /**
     * 通知房间所有用户执行某个刷新操作
     *
     * @param name    刷新操作的名称
     * @param content 刷新操作的内容
     */
    notifyVoiceRoom: function (name, content) {
      // userId = this.userId;
      name = "RCAudienceLeaveRoom"; //测试数据
      content = "bfbfcb7e-ebbb-4d45-a8aa-452409b510be"; //测试数据

      const { im } = store.state;
      const chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });
      chatRoom
        .send({
          messageType: "RC:VRLRefreshMsg", // 填写开发者定义的 messageType
          content: {
            content: content,
            name: name,
          },
          isPersited: false, // 是否存储在服务端,默认为 true
          isCounted: true, // 是否计数. 计数消息接收端接收后未读数加 1，默认为 true
        })
        .then(function (message) {
          console.log("RC:VRLRefreshMsg:", message);
        });
    },

    /**
     * 断开连接，用户退出时调用
     */
    disConnect: function () {
      const { im } = store.state;
      im.disconnect().then(() => console.log("断开链接成功"));
    },

    /**
     * 获取最新在麦位上用户的标识集合
     *
     * @param callback 结果回调
     */

    getRequestSeatUserIds: function (callback) {
      callback = function () {};
      const { im } = store.state;
      var chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });
      chatRoom.getAllEntries().then(function (entries) {
        let arr = [];
        Object.keys(entries).forEach((key) => {
          if (
            key.split("_")[0] == "RCRequestSeatPrefixKey" &&
            entries[key] == "RCRequestSeatContentRequest"
          ) {
            arr.push(key.split("_")[1]);
          }
        });
        console.log(entries);
        callback(arr);
      });
    },

    /**
     * 获取最新麦位信息
     *
     * @param resultCallback
     */
    getLatestSeatInfo: function (callback) {
      callback = function () {};
      const { im } = store.state;
      var chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });
      const objSeatInfolist = this.seatInfolist;
      chatRoom.getAllEntries().then(function (entries) {
        console.log(entries);
        let obj = {};
        Object.keys(objSeatInfolist).forEach((key) => {
          obj[key] = JSON.parse(entries[key]);
        });
        console.log(obj);
        callback(obj);
      });
    },

    /**
     * 更新指定麦位信息中的extra字段
     *
     * @param index
     * @param extra
     */
    updateSeatInfo: function (index, extra, callback) {
      index = 1; //测试
      callback = function () {};
      const { im } = store.state;
      var chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });
      let key = this.RCSeatInfoSeatPartPrefixKey + index;
      chatRoom.getEntry(key).then(function (value) {
        // console.log(JSON.parse(value).speaking);
        if ("extra" in JSON.parse(value)) {
          callback(JSON.parse(value).extra);
        } else {
          alert("不存在extra信息");
        }
      });
    },

    /**
     * 请求排麦
     *
     * @param callback 结果回调
     */
    requestSeat: function (callback) {
      callback = function () {};
      const { im } = store.state;
      var chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });
      chatRoom
        .forceSetEntry({
          key: "RCRequestSeatPrefixKey_" + this.userId,
          value: "RCRequestSeatContentRequest",
          type: 1,
          isAutoDelete: false,
          isSendNotification: false,
        })
        .then(function () {
          callback();
          return "成功了";
        });
    },

    /**
     * 取消排麦请求
     *
     * @param callback 结果回调
     */
    cancelRequestSeat: function (callback) {
      callback = function () {};
      const { im } = store.state;
      var chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });
      console.log(123);
      chatRoom
        .forceRemoveEntry({
          key: "RCRequestSeatPrefixKey_" + this.userId,
          isSendNotification: false,
        })
        .then(function () {
          callback();
          console.log("删除聊天室属性成功");
        });
    },

    /**
     * 同意用户排麦请求
     *
     * @param userId   请求排麦的用户 Id
     * @param callback 结果回调
     */
    acceptRequestSeat: function (userId, callback) {
      callback = function () {};
      userId = "bfbfcb7e-ebbb-4d45-a8aa-452409b510be"; //测试
      const { im } = store.state;
      var chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });
      let arr = [];
      arr.push(
        chatRoom
          .forceSetEntry({
            key: "RCRequestSeatPrefixKey_" + userId,
            value: "RCRequestSeatContentAccept",
            type: 1,
            isAutoDelete: false,
            isSendNotification: false,
          })
          .then(function () {
            return "成功了";
          })
          .catch(function (err) {
            return "err" + err;
          })
      );
      Promise.all(arr).then((result) => {
        console.log(result);
        callback();
      });
    },

    /**
     * 拒绝用户排麦请求
     *
     * @param userId
     * @param callback
     */
    rejectRequestSeat: function (userId, callback) {
      callback = function () {};
      userId = "bfbfcb7e-ebbb-4d45-a8aa-452409b510be"; //测试
      const { im } = store.state;
      var chatRoom = im.ChatRoom.get({
        id: this.roomidcli,
      });
      let arr = [];
      arr.push(
        chatRoom
          .forceSetEntry({
            key: "RCRequestSeatPrefixKey_" + userId,
            value: "RCRequestSeatContentDeny",
            type: 1,
            isAutoDelete: false,
            isSendNotification: false,
          })
          .then(function () {
            return "成功了";
          })
          .catch(function (err) {
            return "err" + err;
          })
      );
      Promise.all(arr).then((result) => {
        console.log(result);
        callback();
      });
    },
  },

  created() {
    const { im } = store.state;
    // 加入普通音视频房间，从 5.0.7 开始增加返回 `tracks` 与 `userIds`
    // * userIds - 当前已加入房间的远端人员列表
    // * tracks  - 当前已发布至房间内的远端资源列表
    // 添加事件监听
    im.watch({
      // 监听会话列表变更事件
      conversation(event) {
        // 假定存在 getExistedConversationList 方法，以获取当前已存在的会话列表数据
        // eslint-disable-next-line no-undef
        const conversationList = getExistedConversationList();
        // 发生变更的会话列表
        const updatedConversationList = event.updatedConversationList;
        // 通过 im.Conversation.merge 计算最新的会话列表
        const latestConversationList = im.Conversation.merge({
          conversationList,
          updatedConversationList,
        });
        console.log(latestConversationList);
      },
      // 监听消息通知
      message(event) {
        // 新接收到的消息内容RC:VRLRefreshMsg
        const message = event.message;

        console.log(message);
        switch (message.messageType) {
          case "RC:VRLRefreshMsg":
            this.emit("onRoomNotificationReceived", {
              name: message.content.name,
              content: message.content.content,
            });
            if (message.content.name == "RCAudienceJoinRoom") {
              this.emit("onAudienceEnter", { userId: message.content.content });
              console.log("进来了");
            } else if (message.content.name == "RCAudienceLeaveRoom") {
              this.emit("onAudienceExit", { userId: message.content.content });
              console.log("出去了");
            }
            break;
          case "RC:VRLInviteMsg":
            if (message.content.content == "RCKickUserOutRoomContent") {
              this.emit("onUserReceiveKickOutRoom", {
                targetId: message.content.targetId,
                userId: message.content.sendUserId,
              });
              console.log("被踢了");
            } else if (message.content.content == "RCPickerUserSeatContent") {
              this.emit("onUserReceiveKickOutRoom", {
                targetId: message.content.targetId,
              });
              console.log("被抱上麦");
            }
            break;
          default:
            this.emit("onMessageReceived", { message: message });
        }
      },
      // 监听 IM 连接状态变化
      status(event) {
        console.log("connection status:", event.status);
      },
      // 监听聊天室 KV 数据变更
      chatroom(event) {
        /**
         * 聊天室 KV 存储数据更新  ^[0-9]*$
         */
        let reg = new RegExp("^[0-9]*$");
        const updatedEntries = event.updatedEntries;
        console.log(updatedEntries);
        let arrSeat = [];
        updatedEntries.forEach((obj) => {
          if (obj.key === "RCRoomInfoKey") {
            //房间操作
            this.emit("onRoomInfoUpdate", { roomInfo: JSON.parse(obj.value) });
          } else if (
            obj.key.split("_")[0] === "RCSeatInfoSeatPartPrefixKey" &&
            reg.test(obj.key.split("_")[1])
          ) {
            //麦位KV操作
            arrSeat.push(JSON.parse(obj.value));
            if ("userId" in obj && !("userId" in this.seatInfolist[obj])) {
              this.emit("onUserEnterSeat", {
                seatIndex: obj.key.split("_")[1],
                userId: obj.userId,
              });
            } else if (
              !("userId" in obj) &&
              "userId" in this.seatInfolist[obj]
            ) {
              if (obj.userId == this.userId) {
                this.emit("onKickSeatReceived", {
                  index: obj.key.split("_")[1],
                });
              } else {
                this.emit("onUserLeaveSeat", {
                  seatIndex: obj.key.split("_")[1],
                  userId: obj.userId,
                });
              }
            } else if (obj.mute !== this.seatInfolist[obj].mute) {
              this.emit("onSeatMute", {
                index: obj.key.split("_")[1],
                isMute: obj.mute,
              });
            } else if (obj.status != this.seatInfolist[obj].status) {
              if (obj.status == "0" && this.seatInfolist[obj].status == "2") {
                this.emit("onSeatMute", {
                  index: obj.key.split("_")[1],
                  isLock: true,
                });
              } else {
                this.emit("onSeatMute", {
                  index: obj.key.split("_")[1],
                  isLock: false,
                });
              }
            }
          } else if (
            obj.key.split("_")[0] === "RCRequestSeatPrefixKey" &&
            !reg.test(obj.key.split("_")[1])
          ) {
            if (obj.value == "RCRequestSeatContentAccept") {
              this.emit("onRequestSeatAccepted");
            } else if (obj.value == "RCRequestSeatContentDeny") {
              this.emit("onRequestSeatRejected");
            }
            this.emit("onRequestSeatListChanged");
          }
        });
        if (arrSeat.length > 0) {
          this.emit("onSeatInfoUpdate", { seatInfoList: arrSeat });
        }
      },
      expansion(event) {
        /**
         * 更新的消息拓展数据
         * @example {
         *    expansion: { key: 'value' },      // 设置或更新的扩展值
         *    messageUId: 'URIT-URIT-ODMF-DURR' // 设置或更新扩展的消息 uid
         * }
         */
        const updatedExpansion = event.updatedExpansion;
        console.log(updatedExpansion);
        /**
         * 删除的消息拓展数据
         * @example {
         *    deletedKeys: ['key1', 'key2'],    // 设置或更新的扩展值
         *    messageUId: 'URIT-URIT-ODMF-DURR' // 设置或更新扩展的消息 uid
         * }
         */
        const deletedExpansion = event.deletedExpansion;
        console.log(deletedExpansion);
      },
    });
    // const im = RongIMLib.init({ appkey: "<Your-App-Key>" });
    // console.log(im);
    //   sdk.say('hello')
    // let ooo = new sdk("tset");
    // console.log("oo:", ooo);
    // 初始化 RCRTCClient，初始化过程推荐放在建立连接之前
  },
  mounted() {
    // console.log(this.$axios);
    // 应用初始化以获取 RongIMLib 实例对象，请务必保证此过程只被执行一次
    this.rtcClient = store.state.im.install(installer, {
      /**
       * 自定义 MediaServer Url，公有云用户无需关注
       * @description
       * 1. 仅当 `location.hostname` 为 `localhost` 时，`http` 协议地址有效，否则必须使用 `https` 协议地址
       * 2. 当该值有效时，将不再从 IMLib 导航数据中获取 mediaServer 地址
       */
      // mediaServer?: string,
      /**
       * 输出日志等级，通过 import { LogLevel } from '@rongcloud/plugin-rtc' 获取枚举值
       * @description
       * * 0 - DEBUG
       * * 1 - INFO
       * * 2 - WARN（default）
       * * 3 - ERROR
       */
      // logLevel?: LogLevel
      /**
       * 覆盖默认的日志输出函数，便于业务层保存或上传日志
       */
      // logStdout?: (logLevel: LogLevel, content: string) => void
      /**
       * 与 MediaServer 的 http 请求超时时间，单位为毫秒，默认值为 `5000`，有效值 `5000-30000`。
       * 优先级：用户配置 > 导航配置 > 默认时间。
       */
      // timeout?: number,
      /**
       * 房间 Ping 间隔时长，默认 `10000` ms，有效值 `3000`-`10000`
       */
      // pingGap?: number,
    });

    this.$axios
      .post("/user/login", {
        mobile: "18848973580",
        verifyCode: "1234",
        userName: "libin3580",
        portrait: "http://xxx:xxx/portrait.png",
        deviceId: "xxxxxxxx",
      })
      .then((response) => {
        console.log(response);
        this.authorization = response.data.data.authorization;
      })
      .catch((err) => {
        alert("请求失败", err);
      });

    try {
      console.log("当前ua", navigator.userAgent);
      store.state.im
        .connect({
          // token:
          // "hbo6uxvH/4wxlZq0lhzv4FM5Zg3jAnlz67FfdKG+Dea+O/MkG9XrK4Qg99+CtSNpzJAg7h/nI61ATMJq49ERdg==@il58.cn.rongnav.com;il58.cn.rongcfg.com",
          token:
            "dJHlYAI0iZXYwg3eA2qr71PLrtzG3RtcdGqDfPiZBqSIa660hwvkMds5peb8z1U4NxwKhS40Bvft/3I7XtXazA==@4d1h.cn.rongnav.com;4d1h.cn.rongcfg.com",
        })
        .then((user) => {
          // console.log("token 为: ", imToken);
          console.log("链接成功, 链接用户 id 为: ", user.id, "准备加入房间");
          this.conversation = store.state.im.Conversation.get({
            // targetId
            // targetId: "bfbfcb7e-ebbb-4d45-a8aa-452409b510be",
            targetId: "a6298940-8c32-4df7-99c1-eb141546a790",

            // 会话类型：RongIMLib.CONVERSATION_TYPE.PRIVATE | RongIMLib.CONVERSATION_TYPE.GROUP
            type: RongIMLib.CONVERSATION_TYPE.PRIVATE,
          });
        })
        .catch((error) => {
          console.log("链接失败: ", error.code, error.msg);
        });
    } catch (error) {
      console.log("链接失败: ", error.code, error.msg);
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  font-size: 0.16rem;
  background-image: url(https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F5%2F5772490950ad2.jpg%3Fdown&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636787353&t=c63fa56ef660d2aba90cd77de3f31262);
  background-repeat: no-repeat;
  background-size: 100% 500px;
  width: 100%;
  height: 500px;
}
</style>
