<template>
  <div class="createPanel">
    <div class="backIcon" @click="back"></div>
    <div class="createContainer">
      <el-upload
        class="titleIcon"
        :show-file-list="false"
        :action="updateImgUrl"
        :headers="{
          authorization: this.$store.state.userInfo.authorization,
          BusinessToken: btoken,
        }"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="imgBackground" :src="imgBackground" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <img :src="imgIcon" class="avaterIcon" />
      </el-upload>

      <div class="title">
        <input class="inputer" v-model="roomName" type="text" />
      </div>
      <div class="check">
        <el-radio v-model="radio" label="0">公开 </el-radio>
        <el-radio v-model="radio" label="1">私密 </el-radio>
      </div>
    </div>
    <div class="startBtn" @click="startShow">开始视频直播</div>
  </div>
</template>
<script>
import { paramCheck } from "../../utils/paramCheck";
import Request from "../../request/index.js";
import { btoken } from "../../request/BusinessToken";

export default {
  name: "createRoom",
  data: function () {
    return {
      updateImgUrl: "/api/file/upload",
      // eslint-disable-next-line no-undef
      imgBackground: require("../../assets/live/title-icon.png"),
      // eslint-disable-next-line no-undef
      imgIcon: require("../../assets/live/title-icon-upload.png"),
      radio: "0",
      roomName: "",
      btoken: btoken,
    };
  },
  props: {
    videoNode: Object,
  },
  methods: {
    back: function () {
      this.$router.go(-1);
    },
    beforeAvatarUpload: function () {
      console.log("上传前");
    },
    handleAvatarSuccess: function (e) {
      console.log(
        "头像上传成功回调",
        e,
        this.$store.state.defaultAddress + e.data
      );
      this.$data.imgBackground = this.$store.state.defaultAddress + e.data;
    },
    startShow: function () {
      // parmCheck();
      let data = {
        name: this.$data.roomName,
        isPrivate: this.$data.radio,
        themePictureUrl: this.$data.imgBackground,
        backgroundUrl: "",
        roomType: 3, //直播
      };
      Request.creatLiveRoom(data).then(async (res) => {
        if (res.data.code != 10000) {
          // console.log(res.data.msg);
          this.$store.dispatch("showToast", {
            value: res.data.msg,
          });
          this.$emit("startShow", res.data);
        } else {
          console.log("创建成功", res.data);
          this.$emit("startShow", res.data);
        }
        //参数检查逻辑
        paramCheck(this.$data.roomName, "number");
      });
    },
  },
};
</script>
<style scoped>
.createPanel {
  position: relative;
  font-size: 0px;
  border-radius: 0px 0px 20px 20px;
  width: 375px;
  height: 172px;
  background: rgba(3, 6, 47, 0.2);
  color: #fff;
}
.backIcon {
  position: absolute;
  background: url("../../assets/live/back-icon.png") 100% 100%;
  left: 10px;
  top: 30px;
  background-size: 24px 24px;
  background-repeat: no-repeat;
  width: 24px;
  height: 24px;
}
.createContainer {
  position: absolute;
  top: 76px;
  left: 24px;
  width: 330px;
  height: 100px;
}
.title {
  position: absolute;
  top: 0px;
  height: 20px;
}
.inputer {
  height: 40px;
  width: 200px;
  padding: 0px 16px;
  background: none;
  top: 0px;
  left: 92px;
  font-size: 14px;
  color: #858585;
  position: absolute;
  border: #333 1px solid;
  border-radius: 20px;
  line-height: 40px;
}
.titleIcon {
  position: absolute;

  margin-top: 0px;
}
.avaterIcon {
  position: absolute;
  width: 24px;
  height: 24px;
  bottom: -72px;
  right: -72px;
}
.avatar {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  position: absolute;
}
.el-upload .el-upload--text {
  width: 111px !important;
}
.check {
  position: absolute;
  height: 0px;
  top: 52px;
  left: 95px;
}
.startBtn {
  width: 291px;
  height: 50px;
  line-height: 50px;
  background: linear-gradient(90deg, #505dff 8.65%, #e92b88 100%);
  position: fixed;
  bottom: 32px;
  font-size: 17px;
  text-align: center;
  color: #fff;
  border-radius: 100px;
  margin-left: calc(50vw - 145.5px);
}
</style>