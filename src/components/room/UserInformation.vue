<template>
  <div class="UserInformation">
    <el-drawer
      :modal="false"
      :visible.sync="drawer"
      :direction="direction"
      :show-close="false"
      :close="UserInformationClose"
      :withHeader="false"
      size="2.955rem"
    >
      <div class="UserInformation-top">
        <div class="UserInformation-top-img">
          <div
            class="UserInformation-top-img-bc"
            :style="
              userInfo['portrait']
                ? {
                    backgroundImage:
                      'url(' +
                      this.$store.state.defaultAddress +
                      userInfo.portrait +
                      ')',
                  }
                : {
                    backgroundImage:
                      'url(' + this.$store.state.defaultAvatarUrl + ')',
                  }
            "
          ></div>
        </div>
        <div class="UserInformation-top-name">{{ userInfo.userName }}</div>
        <div
          v-show="userInfo.index != 'none'"
          class="UserInformation-top-count"
        >
          {{ userInfo.index }}号麦
        </div>
      </div>
      <div class="UserInformation-center">
        <div class="center-button">
          <span class="center-button-span center-button-gift">送礼物</span>
        </div>
        <div class="center-button">
          <span class="center-button-span center-button-letter">发私信</span>
        </div>
        <!-- <div class="center-button">3</div> -->
      </div>
      <div class="UserInformation-footer">
        <div
          class="footer-button"
          v-for="(item, i) in userInfoFunKeys"
          :key="i"
        >
          <FunctionKey :item="item" />
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import FunctionKey from "./FunctionKey.vue";

export default {
  data() {
    return {
      type: "",
      drawer: false,
      direction: "btt",
      userInfo: {},
      userInfoFunKeys: [{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }],
    };
  },
  components: {
    FunctionKey,
  },
  watch: {},
  methods: {
    UserInformationOpen: function (item) {
      this.userInfo = item;
      this.drawer = true;
    },
    UserInformationClose: function () {
      this.userInfoFunKeys = [];
      this.$emit("UserInforClose");
    },
  },
};
</script>
<style scoped>
.UserInformation {
  text-align: center;
}
.UserInformation /deep/ .el-drawer {
  background-color: rgba(92, 80, 149, 1) !important;
  overflow: visible !important;
  border-top-left-radius: 0.215rem;
  border-top-right-radius: 0.215rem;
}

.UserInformation /deep/ .el-drawer__body {
  overflow: visible !important;
}
.UserInformation-top {
  height: 0.875rem;
  text-align: center;
  position: relative;
}
.UserInformation-top-img {
  position: absolute;
  left: 50%;
  top: -0.375rem;
  /* margin-top: -0.375rem; */
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  margin-left: -0.375rem;
  z-index: 9000000000;
  background-color: rgba(92, 80, 149, 1);
  background-repeat: no-repeat;
  background-size: 3.75rem 3.33rem;
  background-position: -0.3rem -2.9rem;
}
.UserInformation-top-img-bc {
  width: 0.56rem;
  height: 0.56rem;
  border-radius: 50%;
  position: relative;
  top: 0.095rem;
  left: 0.095rem;
  background-repeat: no-repeat;
  background-size: 0.56rem 0.56rem;
  background-position: center;
}
.UserInformation-top-name {
  height: 0.24rem;
  font-size: 0.17rem;
  font-weight: 500;
  line-height: 0.24rem;
  padding-top: 0.375rem;
}
.UserInformation-top-count {
  height: 0.18rem;
  font-size: 0.13rem;
  font-weight: normal;
  line-height: 0.18rem;
  margin-top: 0.03rem;
}
.UserInformation-center {
  width: 100%;
  height: 0.98rem;
  display: flex;
}
.center-button {
  flex: 1;
  text-align: center;
  line-height: 0.98rem;
}
.center-button-span {
  display: inline-block;
  width: 1rem;
  border-radius: 0.215rem;
  height: 0.43rem;
  border-radius: 0.215rem;
  line-height: 0.43rem;
  background-repeat: no-repeat;
  background-size: 1rem 0.43rem;
  background-position: center;
}
.center-button-gift {
  background-image: url("../../assets/wheat/giftbutton.png");
}
.center-button-letter {
  color: rgba(239, 73, 154, 1);
  background-image: url("../../assets/wheat/letter.png");
}

.UserInformation-footer {
  width: 100%;
  height: 1.145rem;
  background-color: rgba(255, 255, 255, 0.12);
  display: flex;
  justify-content: center;
  align-items: center;
}
.footer-button {
  flex: 1;
}
</style>
