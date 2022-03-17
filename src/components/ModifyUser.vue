<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    :append-to-body="true"
    class="popup"
    width="2.93rem"
    top="25vh"
    @closed="onClosed"
    @opened="onOpen"
    :center="true"
  >
    <el-upload
      class="popup-uploader"
      :show-file-list="false"
      :action="this.$store.state.uploadAddress"
      :headers="{
        authorization: this.$store.state.userInfo.authorization,
        BusinessToken: btoken,
      }"
      :on-success="handlePopupSuccess"
      :before-upload="beforePopupUpload"
    >
      <div
        :style="{ backgroundImage: 'url(' + portrait + ')' }"
        class="avatar"
      ></div>
      <div class="popup-change-portrait"></div>
    </el-upload>

    <el-input
      v-model="value"
      autocomplete="off"
      :clearable="true"
      ref="focusInput"
      :maxlength="10"
      class="dialog-input"
    ></el-input>
    <div slot="footer" class="dialog-footer">
      <el-button
        class="dialog-footer-primary"
        type="primary"
        @click="updateValue"
        >保存</el-button
      >
      <el-button class="dialog-footer-default" @click="logOut"
        >退出登录</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import Request from "../request/index.js";
import { btoken } from "../request/BusinessToken";

export default {
  data() {
    return {
      dialogFormVisible: false,
      value: "",
      portrait: "",
      portraitUrl: "",
      btoken: btoken,
    };
  },
  methods: {
    //打开个人信息编辑
    setPopup: function () {
      this.value = this.$store.state.userInfo.userName;
      this.portrait = this.$store.state.userInfo.portrait
        ? this.$store.state.defaultAddress + this.$store.state.userInfo.portrait
        : this.$store.state.defaultAvatarUrl;
      this.dialogFormVisible = true;
    },
    //关闭个人信息编辑
    onClosed: function () {
      this.value = "";
      this.portraitUrl = "";
    },
    //点击
    updateValue: function () {
      if (!this.value) {
        this.$message.error("融云 RTC:用户名不能为空");
        return;
      }
      Request.userUpdate({
        userName: this.value,
        portrait: this.portraitUrl || this.$store.state.userInfo.portrait,
      })
        .then((response) => {
          if (response.data.code == 10000) {
            const obj = {
              portrait: response.data.data.portrait,
              userName: response.data.data.name,
            };
            this.$store.dispatch("updateUserInfo", obj);
          } else {
            this.$store.dispatch("showToast", {
              value: response.data.msg,
            });
          }
        })
        .catch((err) => {
          console.log("err:", err);
        });
      this.dialogFormVisible = false;
    },
    //点击退出登录
    logOut: function () {
      const obj = {
        authorization: "",
        imToken: "",
        portrait: "",
        type: "",
        userId: "",
        userName: "",
      };
      this.$store.dispatch("updateUserInfo", obj);
      this.dialogFormVisible = false;
      // this.$forceUpdate();
      this.$router.push("/home");
      this.$router.go(0);
    },
    //focus动作
    onOpen: function () {
      this.$refs.focusInput.focus();
    },
    //上传头像图片成功之后
    handlePopupSuccess: function (res, file) {
      console.log(res, file);
      if (res["code"] && res["code"] == 10000) {
        this.portraitUrl = res.data;
        this.portrait = URL.createObjectURL(file.raw);
      }
    },
    //上传头像图片之前
    beforePopupUpload(file) {
      console.log(file);
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
  },
};
</script>
<style scoped>
.popup {
  font-size: 0.16rem;
}
.popup /deep/ .el-dialog__header {
  padding: 0.2rem 0.2rem 0.05rem;
}
.popup /deep/ .el-dialog__footer {
  padding: 0rem 0.2rem 0rem;
}
.popup /deep/ .el-dialog--center {
  height: 2.84rem;
  border-radius: 0.12rem;
}
.popup /deep/ .el-dialog__close {
  font-weight: 500;
  color: black;
  font-size: 0.2rem;
}
.popup /deep/ .el-dialog__body {
  padding: 0rem 0.2rem 0.3rem;
  text-align: center;
}
.dialog-input /deep/ input {
  background-color: #f3f4f5;
  width: 2.33rem;
  border: 0;
}
.popup-change-portrait {
  width: 0.2rem;
  height: 0.2rem;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: 0.2rem 0.2rem;
  background-position: center;
  background-image: url(../assets/home/changeportrait.png);
  position: absolute;
  top: 0.73rem;
  right: 1.1rem;
}
.popup-uploader {
  text-align: center;
  width: 100%;
  margin-bottom: 0.23rem;
}

.popup-uploader /deep/ .el-upload {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  border: 1px solid;
}

.dialog-footer {
  position: relative;
  text-align: center;
}
.dialog-footer-primary {
  width: 2.33rem;
  margin-left: 0;
  font-size: 0.17rem;
  font-weight: 400;
  background-color: #7983fe;
  border-color: #7983fe;
}

.dialog-footer-default {
  margin-top: 0.15rem;
  margin-left: 0 !important;
  border: 0;
  font-size: 0.15rem;
  font-weight: 400;
  color: #020037;
  padding: 0;
  width: 0.6rem;
  height: 0.21rem;
  line-height: 0.21rem;
}
.avatar {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  display: block;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>