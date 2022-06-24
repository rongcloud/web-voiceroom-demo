<template>
  <div class="wrap">
    <span class="loginImg"></span>
    <el-form
      class="loginForm"
      :model="loginForm"
      :rules="loginFormRules"
      ref="loginFormRef"
      label-position="top"
    >
      <el-form-item prop="phone" class="loginFormPhone">
        <el-input
          v-model="loginForm.phone"
          class="verificationCodeInput"
          placeholder="请输入手机号"
          :clearable="true"
        ></el-input>
      </el-form-item>
      <el-form-item prop="verificationCode">
        <el-input
          v-model="loginForm.verificationCode"
          class="verificationCodeInput"
          :clearable="true"
        >
          <template slot="append">
            <el-button
              v-if="loginForm.showloginCode"
              type="primary"
              @click="getloginPhoneCode"
              class="verificationCodeInputButton"
              >获取验证码</el-button
            >
            <div v-else>{{ loginForm.count }}</div>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="btns">
        <el-button type="primary" @click="login" class="verificationCodeInput"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
    <div class="verificationCheckbox">
      <el-checkbox v-model="checked" class="verificationValue"> </el-checkbox>
      同意<a @click="clickLink" class="verificationLink">《注册条款》</a>
      和
      <a class="verificationLink" @click="clickLinksec">《隐私政策》</a>
      并新登录即注册开通融云发者账号
      <div class="verificationEdition">融云 RTC 2.0.0</div>
    </div>
  </div>
</template>
<script>
import Request from "../request/index.js";
// import RCVoiceRoomLib from "@rongcloud/rcvoiceroomlib-v1";
export default {
  data() {
    // 验证手机号是否合法
    var checkMobile = (rules, value, callback) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|14[57]|15[0-9]|16[0-9]|17[678]|18[0-9]|19[0-9])[0-9]{8}$/;
      if (regMobile.test(value) == true) {
        if (this.loginForm.verificationCode.length == 6) {
          this.buttonSubmit = false;
        }
        return callback();
      } else {
        this.buttonSubmit = true;
        callback(new Error("请输入合法的手机号"));
      }
    };
    // 验证输入的手机号验证码是否和存储的验证码相同
    var checkPhoneCode = (rules, value, callback) => {
      if (value.length == 6) {
        if (this.loginForm.phone.length == 11) {
          this.buttonSubmit = false;
        }
        return callback();
      } else {
        this.buttonSubmit = true;
        callback(new Error("验证码错误"));
      }
      // if (value == this.loginForm.contenttext) {
      //   return callback();
      // } else {
      //   callback(new Error("验证码错误"));
      // }
    };
    return {
      // 表单
      loginForm: {
        phone: "",
        verificationCode: "", //表单中展示的验证码
        contenttext: "", //向手机号发送的随机验证码
        timer: null,
        showloginCode: true, //判断展示‘获取验证码’或‘倒计时’
        count: "", //倒计时时间
        platform: "web",
      },
      checked: true,
      buttonSubmit: true,
      // 验证规则
      loginFormRules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
        verificationCode: [
          { required: true, message: "请输入手机验证码", trigger: "blur" },
          { validator: checkPhoneCode, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 获取手机验证码
    getloginPhoneCode() {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/;
      // 如果未输入手机号，结束执行
      if (!regMobile.test(this.loginForm.phone)) {
        return;
      }
      Request.sendCode({ mobile: this.loginForm.phone })
        .then((response) => {
          if (response.data.code == 10000) {
            this.$message({
              showClose: true,
              message: "获取验证码成功！",
              type: "success",
            });
            this.loginForm.showloginCode = false;
            this.countDown(59);
          } else {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "error",
            });
          }
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: "获取验证码失败",
            type: "error",
          });
        });
    },

    // 开始登录
    login() {
      console.log(this.loginForm.phone);
      if (this.checked) {
        const regMobile =
          /^(0|86|17951)?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/;
        // 如果未输入手机号，结束执行
        if (
          !regMobile.test(this.loginForm.phone) ||
          this.loginForm.verificationCode.length != 6
        ) {
          return;
        }
        // console.log(this.getCookie("imToken"));
        Request.userLand({
          mobile: this.loginForm.phone,
          verifyCode: this.loginForm.verificationCode,
          userName: "",
          portrait: "",
          deviceId: "",
          platform: "web",
          platformType: "web",
          channel: this.getCookie("channel") || "",
          version: "2.0.0",
        })
          .then((response) => {
            if (response.data.code == 10000) {
              this.$store.dispatch("updateUserInfo", response.data.data);
              this.$store.dispatch("getRoomType", "voice");
              // this.$RCVoiceRoomLib.connect(response.data.data.imToken);
              this.$RongIMLib.connect(response.data.data.imToken);
              this.$router.replace("/home");
              console.log("登录账号", response.data.data);
              // this.$RCVoiceRoomLib.connect(this.$store.state.userInfo.imToken);
              // this.$RCLiveRoomLib.connect(response.data.data.imToken);
            } else {
              this.$message({
                showClose: true,
                message: response.data.msg,
                type: "error",
              });
            }
          })
          .catch((err) => {
            this.$message({
              showClose: true,
              message: err,
              type: "error",
            });
          });
      } else {
        this.$message({
          showClose: true,
          message: "融云 RTC:请勾选同意注册条款",
          type: "error",
        });
      }
    },

    //倒计时
    countDown: function (index) {
      this.loginForm.showloginCode = false;
      this.loginForm.count = index;
      setTimeout(() => {
        if (index > 1) {
          index--;
          this.countDown(index);
        } else {
          this.loginForm.showloginCode = true;
        }
      }, 1000);
    },

    //点击注册条款
    clickLink: function () {
      window.open("https://cdn.ronghub.com/term_of_service_zh.html");
    },

    //点击隐私政策
    clickLinksec: function () {
      window.open("https://cdn.ronghub.com/Privacy_agreement_zh.html");
    },

    //获取cookie的值
    getCookie(cookie_name) {
      var allcookies = document.cookie;
      //索引长度，开始索引的位置
      var cookie_pos = allcookies.indexOf(cookie_name);

      // 如果找到了索引，就代表cookie存在,否则不存在
      if (cookie_pos != -1) {
        // 把cookie_pos放在值的开始，只要给值加1即可
        //计算取cookie值得开始索引，加的1为“=”
        cookie_pos = cookie_pos + cookie_name.length + 1;
        //计算取cookie值得结束索引
        var cookie_end = allcookies.indexOf(";", cookie_pos);

        if (cookie_end == -1) {
          cookie_end = allcookies.length;
        }
        //得到想要的cookie的值
        var value = unescape(allcookies.substring(cookie_pos, cookie_end));
      }
      return value;
    },
  },
};
</script>
<style scoped>
.wrap {
  font-size: 0.14rem;
  position: relative;
  text-align: center;
  min-height: 625px;
  min-width: none;
}

.loginImg {
  width: 1.48rem;
  height: 0.46rem;
  margin-top: 1.21rem;
  display: inline-block;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-image: url(../assets/logo-icon.png);
}
.loginForm {
  width: 3rem;
  margin: 0 auto;
  font-size: 0.16rem;
  margin-top: 0.84rem;
}
.loginFormPhone {
  /* float: left; */
}
.btns {
  text-align: center;
}
.verificationCodeInput {
  width: 3rem;
}

.verificationCheckbox {
  margin-top: 1.35rem;
  width: 3rem;
  display: inline-block;
  font-size: 0.11rem;
  text-align: left;
  /* white-space: pre-line; */
}
.verificationCheckbox .verificationValue /deep/ .el-checkbox__inner {
  font-size: 0.11rem;
  border-radius: 50%;
}
.verificationCheckbox .verificationLink {
  color: #0099ff;
}
.verificationCheckbox .verificationEdition {
  text-align: center;
}

.verificationCodeInputButton /deep/ span {
  color: #0099ff;
}
.el-checkbox__label {
  white-space: pre-line;
}
</style>