<template>
  <div id="ConnetWheat">
    <el-drawer
      class="ConnetWheat-drawer"
      :visible.sync="drawer"
      :direction="direction"
      :show-close="false"
      :withHeader="false"
      @close="OncloseConnetWheat"
      size="4.47rem"
    >
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
        class="ConnetWheat-tabs"
      >
        <el-tab-pane class="tabs-apply" label="申请列表" name="apply">
          <div v-if="userapply.length > 0">
            <div class="apply-list" v-for="(item, i) in userapply" :key="i">
              <UserColumn :item="item" @closeConnetWheat="closeConnetWheat" />
            </div>
          </div>
          <div v-else class="emptyImg">暂无用户</div>
        </el-tab-pane>
        <el-tab-pane class="tabs-invitation" label="邀请连麦" name="invitation">
          <div v-if="userinvitation.length > 0">
            <div
              class="invitation-list"
              v-for="(item, i) in userinvitation"
              :key="i"
            >
              <UserColumn :item="item" @closeConnetWheat="closeConnetWheat" />
            </div>
          </div>
          <div v-else class="emptyImg">暂无用户</div>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>
<script>
import request from "../../request/index";
import UserColumn from "./UserColumn.vue";
export default {
  data() {
    return {
      drawer: false,
      direction: "btt",
      activeName: "apply",
      userapply: [],
      userinvitation: [],
    };
  },
  components: {
    UserColumn,
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    openConnetWheat: async function (item) {
      if (item) {
        this.activeName = "invitation";
      }
      const arr = await this.$RCVoiceRoomLib.getRequestSeatUserIds();
      this.$store.dispatch("getRequestSeatUserIds", arr);
      request
        .roomuserinfor({
          roomId: this.$RCVoiceRoomLib._roomidcli,
        })
        .then((res) => {
          //   console.log(res);
          this.userapply = [];
          const userList = res.data.data;
          const seatList = this.$RCVoiceRoomLib.seatInfoList;
          const userObject = {};
          const userinvitationObject = {};
          for (let i = 0; i < userList.length; i += 1) {
            userObject[userList[i].userId] = { ...userList[i] };
            userinvitationObject[userList[i].userId] = { ...userList[i] };
          }
          if (arr.length > 0) {
            for (let l = 0; l < arr.length; l += 1) {
              userObject[arr[l]]["key"] = "接受";
              this.userapply.push(userObject[arr[l]]);
            }
          }

          for (let o = 0; o < seatList.length; o += 1) {
            if (seatList[o] && seatList[o]["userId"]) {
              delete userinvitationObject[seatList[o]["userId"]];
            }
          }
          delete userinvitationObject[this.$RCVoiceRoomLib.im["userId"]];
          this.userinvitation = Object.values(userinvitationObject);
          for (let u = 0; u < this.userinvitation.length; u += 1) {
            this.userinvitation[u]["key"] = "邀请";
          }
        })
        .catch((err) => {
          console.log("err:", err);
        });

      console.log(arr);
      this.drawer = true;
    },
    closeConnetWheat: function () {
      this.drawer = false;
    },
    OncloseConnetWheat: function () {
      this.activeName = "apply";
    },
    handleClick: function (tab, event) {
      console.log(tab, event);
    },
  },
};
</script>
<style>
.ConnetWheat {
  font-size: 0.16rem;
  text-align: center;
}

.ConnetWheat-drawer .el-drawer {
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
  background-color: rgba(92, 80, 149, 1);
  color: #fff;
  text-align: center;
}

.ConnetWheat-drawer .el-tabs__header {
  height: 0.63rem;
  margin: 0rem;
  position: relative;
}

.ConnetWheat-drawer .el-tabs__nav-wrap {
  height: 0.63rem;
}

.ConnetWheat-drawer .el-tabs__nav-wrap::after {
  background-color: rgba(92, 80, 149, 1);
}

.ConnetWheat-drawer .el-tabs__nav-scroll {
  justify-content: center;
  align-items: center;
  display: flex;
  height: 0.63rem;
}

.ConnetWheat-drawer .el-tabs__item {
  padding: 0 0.6rem;
  font-size: 0.17rem;
}

.ConnetWheat-drawer .el-tabs__item:hover {
  color: #ef499a;
}

.ConnetWheat-drawer .el-tabs__item.is-active {
  color: #ef499a;
}

.ConnetWheat-drawer .el-tabs__active-bar {
  background-color: #ef499a;
  width: 0.68rem !important;
}

.ConnetWheat-drawer .el-tabs__item {
  color: #fff;
}

.ConnetWheat-drawer .el-tabs__content {
  height: 3.84rem;
  overflow: hidden;
  overflow-y: scroll;
}

.apply-list {
  width: 100%;
  height: 0.64rem;
}

.invitation-list {
  width: 100%;
  height: 0.64rem;
}

.emptyImg {
  width: 100%;
  height: 3.84rem;
  background-image: url(../../assets/wheat/pleaseCreateRoom.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 1.56rem 1.65rem;
  color: rgba(225, 225, 225, 0.6);
  line-height: 5.4rem;
}
</style>
