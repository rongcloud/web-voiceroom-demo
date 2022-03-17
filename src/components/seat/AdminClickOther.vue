<template>
  <div class="AdminClickOther">
    <el-drawer
      :modal="false"
      :visible.sync="AdminClickOther"
      :direction="direction"
      :show-close="false"
      :close="AdminClickOtherClose"
      :withHeader="false"
      size="2.995rem"
    >
      <div class="AdminClickOther-top">
        <div class="AdminClickOther-top-img">
          <div
            class="AdminClickOther-top-img-bc"
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
        <div class="AdminClickOther-top-name">{{ userInfo.userName }}</div>
        <div
          v-show="'index' in userInfo && userInfo.index != 'none'"
          class="AdminClickOther-top-count"
        >
          {{ userInfo.index }} 号麦位
        </div>
      </div>
      <div class="AdminClickOther-center">
        <div class="center-button">
          <span
            @click="giftClick(userInfo)"
            class="center-button-span center-button-gift"
            >送礼物</span
          >
        </div>
        <div class="center-button">
          <span
            @click="letterClick(userInfo)"
            class="center-button-span center-button-letter"
            >发私信</span
          >
        </div>
      </div>
      <div class="AdminClickOther-footer">
        <div
          class="footer-button"
          v-for="(item, i) in userInfoFunKeys"
          :key="i"
        >
          <FunctionKey
            :item="item"
            :userInfo="userInfo"
            @closeAdminClickOther="closeAdminClickOther"
          />
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import FunctionKey from "../room/FunctionKey.vue";
export default {
  data() {
    return {
      type: "",
      AdminClickOther: false,
      direction: "btt",
      userInfo: {},
      // eslint-disable-next-line no-undef
      isAdmin: "url(" + require("../../assets/roomicon/Manage.png") + ")",
      // eslint-disable-next-line no-undef
      notAdmin: "url(" + require("../../assets/roomicon/SetAdmin.png") + ")",
      userInfoFunKeys: [],
    };
  },
  components: {
    FunctionKey,
  },
  watch: {},
  computed: {},
  methods: {
    AdminClickOtherOpen: function (item) {
      this.userInfo = item.item;
      this.userInfoFunKeys = item.value;
      this.AdminClickOther = true;
    },
    closeAdminClickOther: function () {
      this.AdminClickOther = false;
      this.userInfoFunKeys = [];
    },
    AdminClickOtherClose: function () {
      this.userInfoFunKeys = [];
    },

    giftClick: function (userInfo) {
      // console.log("送礼物:", userInfo);
      this.AdminClickOther = false;
      this.$emit("giftClick", userInfo);
    },
    letterClick: function (userInfo) {
      console.log("发私信功能待开放:", userInfo);
      this.$store.dispatch("showToast", {
        value: "功能待开放",
      });
      this.AdminClickOther = false;
    },
  },
};
</script>
<style scoped>
.AdminClickOther {
  text-align: center;
  overflow: hidden;
}

.AdminClickOther /deep/ .el-drawer {
  background-color: rgba(92, 80, 149, 1) !important;
  overflow: visible !important;
  border-top-left-radius: 0.215rem;
  border-top-right-radius: 0.215rem;
}

.AdminClickOther /deep/ .el-drawer__body {
  overflow: visible !important;
}

.AdminClickOther-top {
  height: 0.875rem;
  text-align: center;
  position: relative;
}

.AdminClickOther-top-img {
  position: absolute;
  left: 50%;
  top: -0.375rem;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  margin-left: -0.375rem;
  z-index: 9;
  background-color: rgba(92, 80, 149, 1);
  background-repeat: no-repeat;
  background-size: 3.75rem 3.33rem;
  background-position: -0.3rem -2.9rem;
}

.AdminClickOther-top-img-bc {
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

.AdminClickOther-top-name {
  height: 0.24rem;
  font-size: 0.17rem;
  font-weight: 500;
  line-height: 0.24rem;
  padding-top: 0.375rem;
  color: white;
}

.AdminClickOther-top-count {
  height: 0.18rem;
  font-size: 0.13rem;
  font-weight: normal;
  line-height: 0.18rem;
  margin-top: 0.03rem;
  color: #dfdfdf;
}

.AdminClickOther-center {
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
  color: white;
}

.center-button-letter {
  color: rgba(239, 73, 154, 1);
  background-image: url("../../assets/wheat/letter.png");
}

.AdminClickOther-footer {
  width: 100%;
  height: 1.15rem;
  background-color: rgba(255, 255, 255, 0.12);
  display: flex;
  justify-content: center;
  align-items: center;
}

.AdminClickOther-footer .footer-button {
  flex: 1;
  color: white;
}
</style>
