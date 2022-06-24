<template>
  <div class="landing">
    <div class="miniWindow" @click="miniBack" v-if="isInRoom">
      <div class="miniClose" @click.stop="miniClose"></div>
      <video
        class="videocontainer"
        width=" 93px"
        height="166px"
        ref="video"
      ></video>
    </div>
    <ToolBar @BarRightCallback="BarRightCallback" :title="title" />
    <CallRoom />
    <div class="creat-room" @click="creatRoom"></div>
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :append-to-body="true"
      class="creat-drawer"
      :size="size"
      @closed="drawerClosed"
    >
      <div class="creat-room-table">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :action="this.$store.state.uploadAddress"
          :headers="{
            authorization: this.$store.state.userInfo.authorization,
            BusinessToken: btoken,
          }"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <div
            v-if="imgBackground"
            :style="{ backgroundImage: 'url(' + imgBackground + ')' }"
            class="avatar"
          ></div>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div class="room-set-img-title">选择封面</div>
        <el-input
          class="room-title-input"
          v-model="updateObj.name"
          :maxlength="10"
          placeholder="设置房间标题"
        ></el-input>
        <div class="creat-room-select-title">设置背景</div>
        <div class="room-title-img-select">
          <div
            class="selectRadio"
            v-for="(item, i) in imgData"
            @click="selectImage(item)"
            :key="i"
            :style="
              i !== 3
                ? {
                    backgroundImage: 'url(' + item.url + ')',
                    marginRight: '0.17rem',
                  }
                : {
                    backgroundImage: 'url(' + item.url + ')',
                  }
            "
          >
            <div
              class="selectRadioImg"
              :style="
                item.select
                  ? {
                      backgroundImage: 'url(' + imgSelect + ')',
                      backgroundColor: '#E92B88',
                    }
                  : ''
              "
            ></div>
            <div
              v-if="item.url.substring(item.url.length - 3) == 'gif'"
              class="selectRadioGIF"
            >
              GIF
            </div>
          </div>
        </div>
        <div class="creat-room-select-title">房间是否公开</div>
        <div class="creat-room-select-open">
          <div
            class="creat-room-select-openSelect"
            v-for="item in openSelect"
            :key="item.id"
            @click="selectOpen(item)"
          >
            <div class="creat-room-select-get-head">
              <span
                class="creat-room-select-get-head-spot"
                :style="
                  item.select
                    ? {
                        backgroundColor: '#E92B88',
                      }
                    : ''
                "
              ></span>
            </div>
            <div class="creat-room-select-get-foot">{{ item.value }}</div>
          </div>
        </div>
        <div class="creat-room-button" @click="updateRoomObj"></div>
      </div>
    </el-drawer>
    <PopupInput ref="PopupInput" @clickYes="submitValue" />
    <ChoiceBox ref="ChoiceBox" @clickYes="cliYes" />
  </div>
</template>

<script>
import CallRoom from "./callRoom/index.vue";
import PopupInput from "../../components/PopupInput.vue";
import ToolBar from "../../components/ToolBar.vue";
import ChoiceBox from "../../components/ChoiceBox.vue";
import request from "../../request/index";
import { coverPhoto } from "./coverPhoto.js";
import { GetQueryString } from "../../utils/utils";
import { btoken } from "../../request/BusinessToken";

export default {
  name: "RoomTab",
  data: function () {
    return {
      updateObj: {
        name: "",
        themePictureUrl: "",
        isPrivate: 1,
        password: "",
        backgroundUrl: "",
        kv: [],
      },
      tabStretch: true,
      activeName: "first",
      authorization: null,
      dataList: [],
      drawer: false,
      direction: "btt",
      size: "88%",
      imgStyle: "",
      imgData: [],
      selectRadio: "1",
      btoken: btoken,
      openSelect: [
        {
          select: true,
          value: "私密",
          id: "1",
        },
        {
          select: false,
          value: "公开",
          id: "2",
        },
      ],
      // eslint-disable-next-line no-undef
      imgSelect: require("../../assets/check-circle-true-icon.png"),
      // eslint-disable-next-line no-undef
      imgBackground: "",
      // updateImgUrl: "/api/file/upload",
      roomType: "", //房间类型
      isInRoom: false, //在房间内
      title: "语聊房",
      antiShake: true, //防抖 防止频繁创建房间
    };
  },
  components: {
    CallRoom,
    PopupInput,
    ToolBar,
    ChoiceBox,
  },
  watch: {
    imgStyle: function (newVal) {
      //   console.log(newVal);
      this.$nextTick(() => {
        document.getElementsByClassName("el-drawer")[0].style.backgroundImage =
          "url(" + newVal + ")";
        this.updateObj.backgroundUrl = newVal;
      });
    },
  },
  methods: {
    //创建房间
    creatRoom: function () {
      console.log("创建房间", 1);
      if (!this.$data.antiShake) return;
      this.$data.antiShake = false;
      setTimeout(() => {
        this.$data.antiShake = true;
      }, 500);

      console.log(this.$RCLiveRoomLib.im);
      //增加提前检查麦克风防止上麦失败
      navigator.getUserMedia(
        { audio: true },
        () => {
          if (this.$data.roomType == "liveRoom") {
            if (
              GetQueryString("roomType") &&
              GetQueryString("roomType") == "liveRoom"
            ) {
              //是否创建直播房间 先查询 userCheck
              request
                .checkUser(this.$store.state.userInfo.userId)
                .then(async (res) => {
                  console.log("checkresout", res);
                  this.$data.antiShake = true;
                  if (
                    res &&
                    res.data &&
                    res.data.data &&
                    res.data.data.roomId
                  ) {
                    console.log("用户有创建房间");

                    this.$confirm("存在已创建的房间是否加入?", "提示", {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      type: "warning",
                      center: true,
                    })
                      .then(() => {
                        this.$router.push(
                          "/live?isAnchor=true&&roomId=" + res.data.data.roomId
                        );
                      })
                      .catch(() => {
                        request.deleteRoom({
                          roomId: res.data.data.roomId,
                        });
                      });
                  } else {
                    console.log(
                      "用户没有创建房间  创建新房间",
                      this.$store.state.userInfo
                    );
                    this.$router.push("/live?isAnchor=true");
                  }
                });
            } else {
              this.drawer = true;
              this.imgData = this.$store.state.imgList;
              this.imgStyle = this.$store.state.imgList[0].url || "";
              this.updateObj.themePictureUrl =
                coverPhoto[Math.floor(Math.random() * 6)];
              this.imgBackground = coverPhoto[Math.floor(Math.random() * 6)];
              this.drawer = true;
            }
          } else {
            request.getUserCheck().then((res) => {
              if (res.data.code == 10000) {
                this.imgData = this.$store.state.imgList;
                this.imgStyle = this.$store.state.imgList[0].url || "";
                this.updateObj.themePictureUrl =
                  coverPhoto[Math.floor(Math.random() * 6)];
                this.imgBackground = coverPhoto[Math.floor(Math.random() * 6)];
                this.drawer = true;
              } else if (res.data.code == 30016) {
                this.$refs.ChoiceBox.setPopup({
                  value: "您已创建过房间,是否直接进入",
                  roomId: res.data.data.roomId,
                });
              }
            });
          }
        },
        () => {
          this.$data.antiShake = true;
          this.$store.dispatch("showToast", {
            value: "未检测到麦克风设备",
          });
        }
      );
    },

    //选择背景图片
    selectImage: function (item) {
      this.imgStyle = item.url;
      for (let i = 0; i < this.imgData.length; i += 1) {
        if (this.imgData[i].url === item.url) {
          this.imgData[i].select = true;
        } else {
          this.imgData[i].select = false;
        }
      }
    },

    //是否公开点选
    selectOpen: function (item) {
      if (item.id == "1") {
        this.updateObj.isPrivate = 1;
      } else {
        this.updateObj.isPrivate = 0;
      }
      for (let i = 0; i < this.openSelect.length; i += 1) {
        if (this.openSelect[i].id === item.id) {
          this.openSelect[i].select = true;
        } else {
          this.openSelect[i].select = false;
        }
      }
    },

    //上传头像图片成功之后
    handleAvatarSuccess(res, file) {
      // console.log(res, file);
      // this.updateObj.themePictureUrl = `https://rcrtc-api.rongcloud.net/file/show?path=${res.data}`;
      this.imgBackground = URL.createObjectURL(file.raw);
    },

    //上传头像图片之前
    beforeAvatarUpload(file) {
      //   console.log(file);
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG、png 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    //提交
    updateRoomObj: function () {
      if (this.updateObj.name == "") {
        this.$message.error("融云RTC:请填写房间名");
        return;
      }
      if (this.updateObj.isPrivate == 1 && !this.updateObj.password) {
        this.$refs.PopupInput.setPopup({
          title: "请输入四位数字密码",
          value: "",
          placeholder: "请输入四位数字密码",
          type: "number",
        });
      } else {
        // console.log(this.updateObj);
        this.createAndJoinRoom();
      }
    },

    //提示点击确定
    cliYes: async function (roomId) {
      try {
        await this.$RCVoiceRoomLib.joinRoom(roomId);
        setTimeout(() => {
          this.$router.push("/room/house");
        }, 50);
      } catch (err) {
        console.log("加入语聊房失败!");
      }
    },

    //关闭drawer
    drawerClosed: function () {
      // console.log("关闭drawer");
      for (let i = 0; i < this.imgData.length; i += 1) {
        if (i === 0) {
          this.imgData[i].select = true;
        } else {
          this.imgData[i].select = false;
        }
      }
      for (let i = 0; i < this.openSelect.length; i += 1) {
        if (i === 0) {
          this.openSelect[i].select = true;
        } else {
          this.openSelect[i].select = false;
        }
      }
    },

    //记录密码
    submitValue: function (item) {
      this.updateObj.password = item;
      this.createAndJoinRoom();
    },

    //点击右上角
    BarRightCallback: function () {
      this.$store.dispatch("showToast", {
        value: "功能待开放",
      });
    },

    //小窗关闭
    miniClose: function (e) {
      console.log("miniclose", e);
      console.log(this.$RCLiveRoomLib._roomidcli);
      if (
        this.$RCLiveRoomLib._roomidcli &&
        this.$RCLiveRoomLib._roomidcli.length
      ) {
        console.log(this.$RCLiveRoomLib._roomidcli);
        this.$RCLiveRoomLib.leaveRoom(this.$RCLiveRoomLib._roomidcli);
        this.$data.isInRoom = false;
      }
    },

    miniBack: function () {
      console.log("miniback");
      this.$router.push("/live?roomid=" + this.$RCLiveRoomLib._roomidcli);
      // console.log(this.$refs);
    },

    //创建并加入房间
    createAndJoinRoom: function () {
      request
        .creatRoom({
          ...this.updateObj,
        })
        .then(async (res) => {
          console.log(res);
          switch (res.data.code) {
            case 10000:
              await this.$RCVoiceRoomLib.createAndJoinRoom({
                roomId: res.data.data.roomId,
                roomName: res.data.data.roomName,
                seatCount: 9,
              });
              this.drawer = false;
              setTimeout(() => {
                this.$router.push("/room/house");
              }, 500);
              break;
            default:
              this.$store.dispatch("showToast", {
                value: res.data.msg,
              });
          }
        })
        .catch((err) => {
          console.log("err:", err);
        });
    },
  },
  created() {
    if (GetQueryString("roomType")) {
      if (GetQueryString("roomType") == "liveRoom") {
        this.$data.roomType = "liveRoom";
        this.$data.title = "直播间";
      }
    }
    //小窗逻辑
    if (
      this.$RCLiveRoomLib._roomidcli &&
      this.$RCLiveRoomLib._roomidcli.length
    ) {
      console.log("当前", this.$RCLiveRoomLib._roomidcli);
      this.$data.isInRoom = true;
      this.$RCLiveRoomLib.rtc.body.videoNode = this.$refs.video;
    }
  },
  mounted() {
    let reqObj = {
      page: 1,
      size: 10,
    };
    if (this.$data.roomType == "liveRoom") {
      reqObj.type = 3;
    }
    console.log(this.$store.state.roomType);
    if (this.$store.state.roomType) {
      // console.log(this.$store.state.roomType);
      request
        .roomList(reqObj)
        .then((response) => {
          this.$store.dispatch("changesImgList", response.data.data.images);
          for (var i = 0; i < response.data.data.rooms.length; i++) {
            if (
              response.data.data.rooms[i].createUser.userId ==
                this.$store.state.userInfo.userId &&
              reqObj.type == 3
            ) {
              //如果是直播间且有自己创建的房间 退出该房间
              console.log("已经有自己创建的房间需要删除一下");
              location.reload();
              request.deleteRoom({
                roomId: response.data.data.rooms[i].roomId,
              });
              response.data.data.rooms.splice(i, 1);
            }
          }
          this.$store.dispatch("changesRoomsList", response.data.data.rooms);
        })
        .catch((err) => {
          console.error("请求失败", err);
        });
    }

    //小窗逻辑
    console.log("当前sdk状态", this.$RCLiveRoomLib);
    console.log("vidioNode", this.$refs);
    if (
      this.$RCLiveRoomLib._roomidcli &&
      this.$RCLiveRoomLib._roomidcli.length
    ) {
      if (GetQueryString("roomType") == "liveRoom") {
        console.log("getExist");
        this.$RCLiveRoomLib.rtc.body.videoNode = this.$refs.video;
        this.$RCLiveRoomLib.getExist();
      } else {
        this.$RCLiveRoomLib.leaveRoom();
        this.$data.isInRoom = false;
      }
    }

    window.addEventListener("load", () => {
      if (this.$route.name != "login") {
        this.$router.replace("/login");
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "home") {
      // if (this.$data.roomType == "liveRoom") {
      //   this.$store.dispatch("getOwerDisconnet", true).then(() => {
      //     this.$RCLiveRoomLib.im.body.disconnect().then(() => {
      //       console.log("成功断开");
      //     });
      //   });
      // } else {
      //   this.$store.dispatch("getOwerDisconnet", true).then(() => {
      //     this.$RCVoiceRoomLib.im.body.disconnect().then(() => {
      //       console.log("成功断开");
      //     });
      //   });
      // }
      // this.$store.dispatch("getRoomType", "");
    }
    next();
  },
};
</script>
<style scoped>
@import url("./index.css");
</style>