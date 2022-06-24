<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    :append-to-body="true"
    :show-close="false"
    title="房间公告"
    class="popup"
    top="25vh"
    @closed="onClosed"
    :center="true"
  >
    <div class="dialog-value">
      <el-input
        class="dialog-textarea"
        type="textarea"
        maxlength="100"
        show-word-limit
        v-model="textarea"
        :disabled="!isShow"
      >
      </el-input>
    </div>
    <div slot="footer" v-if="isShow" class="dialog-footer">
      <div>
        <button class="cancel" @click="dialogFormVisible = false">取 消</button>
        <button class="yes" type="primary" @click="updateValue">确 定</button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import request from "../../request/index";
export default {
  data() {
    return {
      dialogFormVisible: false,
      textarea: "123",
      isShow: true,
    };
  },
  methods: {
    setPopup: function (item) {
      this.dialogFormVisible = true;
      this.textarea = item.value;
      this.isShow = item.isShow;
    },
    onClosed: function () {
      this.value = "";
    },
    updateValue: function () {
      request.getTextCheck({ text: this.textarea }).then((res) => {
        if (res.data.code == 10000) {
          this.$emit("clickYes", this.textarea);
          if (this.$store.state.roomType == "live") {
            this.$emit("NoticeUpdate", this.textarea);
          }
        } else {
          this.$store.dispatch("showToast", {
            value: res.data.msg,
          });
        }
      });
      this.dialogFormVisible = false;
    },
  },
};
</script>
<style scoped>
.popup {
  font-size: 0.14rem;
  position: relative;
  max-width: 375px;
  left: calc(50vw - 187.5px) !important;
}
.popup /deep/ .el-dialog {
  border-radius: 0.12rem;
  overflow: hidden;
  background-repeat: no-repeat;
  background-size: center;
  background-position: center;
  background-color: rgba(92, 80, 149, 1);
  width: 2.71rem;
  height: 3.4rem;
  color: #ffffff;
}
.popup /deep/ .el-dialog__header {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-image: url("../../assets/roomicon/NoticeTitleBack.png");
}

.popup /deep/ .el-dialog__title {
  color: #ffffff !important;
  font-size: 0.17rem;
}

.popup /deep/ .el-dialog__body {
  color: #ffffff;
  padding: 0 !important;
}
.dialog-value {
  text-align: center;
  font-weight: 400;
}
.dialog-textarea /deep/ .el-textarea__inner {
  height: 2rem;
  background-color: rgba(92, 80, 149, 1) !important;
  color: #ffffff !important;
  border: none !important;
  font-size: 0.14rem;
}
.dialog-textarea /deep/ .el-input__count {
  background-color: rgba(92, 80, 149, 1);
  color: #ffffff;
}

.popup /deep/ .el-dialog__footer {
  padding: 0;
  width: 100%;
  position: absolute;
  bottom: 0.2rem;
}

.dialog-footer {
  width: 100%;
  height: 0.44rem;
}
.dialog-footer .cancel {
  width: 0.96rem;
  height: 0.4rem;
  border: none;
  background-image: url("../../assets/roomicon/noticeCancel.png");
  background-repeat: no-repeat;
  background-size: 0.96rem 0.4rem;
  background-position: center;
  background-color: rgba(92, 80, 149, 1);
  color: rgba(239, 73, 154, 1);
  font-size: 0.17rem;
}

.dialog-footer .yes {
  width: 0.96rem;
  height: 0.4rem;
  border: none;
  background-image: url("../../assets/roomicon/NoticeYes.png");
  background-repeat: no-repeat;
  background-size: 0.96rem 0.4rem;
  background-position: center;
  background-color: rgba(92, 80, 149, 1);
  color: rgba(255, 255, 255, 1);
  margin-left: 0.12rem;
  font-size: 0.17rem;
}
</style>