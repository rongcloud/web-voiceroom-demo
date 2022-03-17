<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :append-to-body="true"
    class="popup"
    width="90%"
    top="25vh"
    @closed="onClosed"
    @opened="onOpen"
    :center="true"
  >
    <el-input
      v-model="value"
      autocomplete="off"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :clearable="true"
      ref="focusInput"
    ></el-input>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="updateValue">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      title: "",
      value: "",
      formLabelWidth: "100px",
      placeholder: "",
      type: "",
      maxlength: 10,
    };
  },
  methods: {
    setPopup: function (item) {
      this.dialogFormVisible = true;
      this.title = item.title || "";
      this.value = item.value || "";
      this.placeholder = item.placeholder || "这是一个placeholder";
      this.type = item.type || "string";
      if (this.type == "number") {
        this.maxlength = 4;
      } else {
        this.maxlength = 10;
      }
    },
    onClosed: function () {
      this.value = "";
      this.title = "";
      this.placeholder = "";
      this.type = "";
    },
    updateValue: function () {
      //   console.log("value:", this.value);
      const patrn = /^[0-9]*$/;
      if (this.type === "number") {
        if (patrn.test(this.value) && this.value.length === 4) {
          this.$emit("clickYes", this.value);
        } else {
          this.$message.error("密码中有非数字或不足四位数字");
        }
      } else {
        this.$emit("clickTitleYes", this.value);
      }
      this.dialogFormVisible = false;
    },
    onClose: function () {
      this.dialogFormVisible = false;
    },
    onOpen: function () {
      this.$refs.focusInput.focus();
    },
  },
};
</script>
<style scoped>
.popup {
  font-size: 0.14rem;
}
.popup /deep/ .el-dialog {
  /* background-color: rgba(92, 80, 149, 1); */
}
.popup /deep/ .el-input__inner {
  /* background-color: rgba(92, 80, 149, 0); */
  /* color: white; */
  /* border: none; */
}
</style>