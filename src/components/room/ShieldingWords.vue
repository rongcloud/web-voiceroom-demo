<template>
  <div id="ShieldingWords">
    <el-drawer
      class="ShieldingWords-drawer"
      id="ShieldingWords-drawer"
      :visible.sync="ShieldingWords"
      :direction="direction"
      :withHeader="false"
      size="3.86rem"
      :show-close="true"
    >
      <div class="ShieldingWords-title">屏蔽词</div>
      <div class="ShieldingWords-title-border"></div>
      <div class="ShieldingWords-body">
        <div class="ShieldingWords-body-key1">设置屏蔽词（{{ num }}/10）</div>
        <div class="ShieldingWords-body-key2">
          包含屏蔽词的发言将不会被其他用户看到
        </div>
      </div>
      <div class="ShieldingWords-foot">
        <el-button
          v-if="num < 10"
          class="button-new-tag"
          size="small"
          @click="showInput"
          >+</el-button
        >
        <el-tag
          :key="tag.id"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag.name }}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          :maxlength="10"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import request from "../../request/index";
export default {
  data() {
    return {
      ShieldingWords: false,
      direction: "btt",
      num: 0,
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
    };
  },
  components: {},
  watch: {},
  created() {},
  mounted() {
    this.$nextTick(() => {});
  },
  methods: {
    openShieldingWords: function () {
      this.ShieldingWords = true;
      this.dynamicTags = [];
      request
        .getsensitiveList({
          roomId: this.$RCVoiceRoomLib._roomidcli,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.code == 10000 && "data" in res.data) {
            this.num = res.data.data.length;
            this.dynamicTags = [...res.data.data];
          }
        });
    },

    closeShieldingWords: function () {
      this.ShieldingWords = false;
    },

    handleClose(tag) {
      request
        .sensitiveDelet({
          id: tag.id,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.code == 10000) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            this.num = this.dynamicTags.length;
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      console.log();
      if (inputValue && this.num < 10) {
        request
          .sensitiveAdd({
            id: 0,
            name: inputValue,
            roomId: this.$RCVoiceRoomLib._roomidcli,
          })
          .then((res) => {
            console.log(res.data);
            if (res.data.code == 10000) {
              this.dynamicTags.push(res.data.data);
              this.num = this.dynamicTags.length;
            }
          })
          .catch((err) => {
            console.log("err", err);
          });
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
  },
};
</script>
<style>
#ShieldingWords {
  background-color: black;
}
.ShieldingWords-drawer {
  font-size: 0.16rem;
  text-align: center;
}

.ShieldingWords-drawer .el-drawer {
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
  background-color: rgba(92, 80, 149, 1);
}

.ShieldingWords-title {
  width: 100%;
  height: 0.56rem;
  line-height: 0.57rem;
  color: #ffffff;
  font-size: 0.17rem;
  font-weight: 500;
}
.ShieldingWords-title-border {
  width: 100%;
  height: 0.01rem;
  border-bottom: 0.01rem solid rgba(255, 255, 255, 0.2);
  transform: calc(0.5);
}

.ShieldingWords-body {
  width: 100vw;
  height: 0.58rem;
  text-align: left;
  border-bottom: 1px solid saddlebrown;
}

.ShieldingWords-body-key1 {
  font-size: 0.14rem;
  height: 0.2rem;
  line-height: 0.2rem;
  color: #ffffff;
  margin-top: 0.165rem;
}

.ShieldingWords-body-key2 {
  font-size: 0.12rem;
  height: 0.17rem;
  line-height: 0.17rem;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 0.04rem;
}

.ShieldingWords-foot {
  text-align: left;
}
/* 标签样式 */

.el-tag {
  margin-left: 0.1rem;
  margin-top: 0.1rem;
  font-size: 0.14rem !important;
  border: none !important;
  background: rgba(255, 255, 255, 0.2) !important;
  color: rgba(255, 255, 255, 1) !important;
  border-radius: 0.18rem !important;
}
.el-tag__close {
  color: rgba(255, 255, 255, 1) !important;
  margin-right: 0.05rem !important;
}
.button-new-tag {
  margin-left: 0.1rem !important;
  height: 0.3rem;
  line-height: 0.3rem;
  border-radius: 0.18rem !important;
  width: 0.6rem;
  margin-top: 0.1rem !important;
  font-size: 0.24rem !important;
  border: none !important;
  padding: 0 !important;
  background: rgba(255, 255, 255, 0.2) !important;
  color: rgba(255, 255, 255, 1) !important;
}
.input-new-tag {
  width: 0.9rem !important;
  margin-left: 0.1rem;
  vertical-align: bottom;
}

.input-new-tag .el-input__inner {
  background: rgba(255, 255, 255, 0.2) !important;
  color: #ffffff !important;
  border: none !important;
  margin-top: 0.1rem !important;
}
</style>
