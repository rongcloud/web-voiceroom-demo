<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    :append-to-body="true"
    :close-on-click-modal="false"
    :show-close="false"
    class="popup"
    width="80%"
    top="25vh"
    @closed="onClosed"
    :center="true"
  >
    <div class="dialog-value">
      <span>{{ value }}</span>
    </div>
    <div slot="footer" class="dialog-footer">
      <button class="cancel" @click="dialogFormVisible = false">取 消</button>
      <button class="yes" type="primary" @click="updateValue">确 定</button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      value: "",
      roomId: "",
    };
  },
  methods: {
    setPopup: function (item) {
      this.dialogFormVisible = true;
      this.value = item.value;
      this.roomId = item.roomId;
    },
    onClosed: function () {
      this.value = "";
    },
    updateValue: function () {
      this.$emit("clickYes", this.roomId);
      this.dialogFormVisible = false;
    },
  },
};
</script>
<style scoped>
.popup {
  font-size: 0.14rem;
}
.popup /deep/ .el-dialog {
  border-radius: 0.12rem;
  overflow: hidden;
}
.popup /deep/ .el-dialog__footer {
  padding: 0;
}
.dialog-value {
  text-align: center;
  font-weight: 400;
}
.dialog-footer {
  width: 100%;
  height: 0.44rem;
}
.dialog-footer .cancel {
  width: 50%;
  float: left;
  font-size: 0.17rem;
  border: 0;
  border-top: 0.005rem solid #dcdfe6;
  border-right: 0.005rem solid #dcdfe6;
  height: 0.44rem;
  background-color: white;
  border-color: #dcdfe6;
}

.dialog-footer .yes {
  width: 50%;
  float: left;
  height: 0.44rem;
  margin-left: 0;
  background-color: white;
  border: 0;
  border-top: 0.005rem solid #dcdfe6;
  font-size: 0.17rem;
  color: rgba(239, 73, 154, 1);
}
</style>