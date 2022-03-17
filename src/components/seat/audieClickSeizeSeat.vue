<template>
  <div class="audienceClickSeizeSeat">
    <el-drawer
      :modal="false"
      :visible.sync="audienceClickSeizeSeat"
      :direction="direction"
      :show-close="false"
      :withHeader="false"
      size="1.845rem"
    >
      <div class="audienceClickSeizeSeat-top">
        <div class="audienceClickSeizeSeat-top-img">
          <div
            class="audienceClickSeizeSeat-top-img-bc"
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
        <div class="audienceClickSeizeSeat-top-name">
          {{ userInfo.userName }}
        </div>
        <div
          v-show="'index' in userInfo && userInfo.index != 'none'"
          class="audienceClickSeizeSeat-top-count"
        >
          {{ userInfo.index }} 号麦位
        </div>
      </div>
      <div class="audienceClickSeizeSeat-center">
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
    </el-drawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      type: "",
      audienceClickSeizeSeat: false,
      direction: "btt",
      userInfo: {},
      // eslint-disable-next-line no-undef
      isAdmin: "url(" + require("../../assets/roomicon/Manage.png") + ")",
      // eslint-disable-next-line no-undef
      notAdmin: "url(" + require("../../assets/roomicon/SetAdmin.png") + ")",
    };
  },
  components: {},
  watch: {},
  computed: {},
  methods: {
    audienceClickSeizeSeatOpen: function (item) {
      this.userInfo = item;
      this.audienceClickSeizeSeat = true;
    },

    closeaudienceClickSeizeSeat: function () {
      this.audienceClickSeizeSeat = false;
    },

    giftClick: function (userInfo) {
      this.audienceClickSeizeSeat = false;
      this.$emit("giftClick", userInfo);
    },

    letterClick: function (userInfo) {
      console.log("发私信功能待开放:", userInfo);
      this.$store.dispatch("showToast", {
        value: "功能待开放",
      });
      this.audienceClickSeizeSeat = false;
    },
  },
};
</script>
<style scoped>
.audienceClickSeizeSeat {
  text-align: center;
  overflow: hidden;
}

.audienceClickSeizeSeat /deep/ .el-drawer {
  background-color: rgba(92, 80, 149, 1) !important;
  overflow: visible !important;
  border-top-left-radius: 0.215rem;
  border-top-right-radius: 0.215rem;
}

.audienceClickSeizeSeat /deep/ .el-drawer__body {
  overflow: visible !important;
}

.audienceClickSeizeSeat-top {
  height: 0.875rem;
  text-align: center;
  position: relative;
}

.audienceClickSeizeSeat-top-img {
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

.audienceClickSeizeSeat-top-img-bc {
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

.audienceClickSeizeSeat-top-name {
  height: 0.24rem;
  font-size: 0.17rem;
  font-weight: 500;
  line-height: 0.24rem;
  padding-top: 0.375rem;
  color: white;
}

.audienceClickSeizeSeat-top-count {
  height: 0.18rem;
  font-size: 0.13rem;
  font-weight: normal;
  line-height: 0.18rem;
  margin-top: 0.03rem;
  color: #dfdfdf;
}

.audienceClickSeizeSeat-center {
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
</style>
