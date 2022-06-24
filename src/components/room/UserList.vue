<template>
  <div class="UserList">
    <el-drawer
      title="用户列表"
      class="UserListDrawer"
      :visible.sync="drawer"
      direction="btt"
      size="100%"
      :before-close="onClose"
      :modal="false"
    >
      <ul>
        <li
          v-for="(item, i) in this.$store.state.roomUserList"
          :key="i"
          class="UserListLi"
          @click="clickUser(item)"
        >
          <div
            class="UserListImg"
            :style="
              item['portrait']
                ? {
                    backgroundImage:
                      'url(' + defaultAddress + item.portrait + ')',
                  }
                : {
                    backgroundImage: 'url(' + defaultAvatarUrl + ')',
                  }
            "
          ></div>
          <div class="UserListName">
            <span class="UserListNameValue">{{ item.userName }}</span>
            <span class="UserListNamefoot"></span>
          </div>
        </li>
      </ul>
      <div v-if="listEmpty" class="listEmpty">
        <span class="listEmptyValue">暂无用户</span>
      </div>
    </el-drawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      drawer: false,
      UserList: [],
      portrait: "",
      listEmpty: false,
      defaultAddress: "",
      defaultAvatarUrl: "",
    };
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.defaultAddress = this.$store.state.defaultAddress;
      this.defaultAvatarUrl = this.$store.state.defaultAvatarUrl;
    });
  },
  methods: {
    openUserList: function () {
      this.drawer = true;
      this.UserList = this.$store.state.roomUserList;
    },

    onClose: function (done) {
      this.$emit("onCloseUserList");
      done();
    },

    clickBarLeft: function () {
      if (!this.toolbarData.leftImg) {
        this.$router.go(-1);
      } else {
        this.$emit("BarLeftCallback", this.toolbarData);
      }
    },

    clickBarRight: function () {
      this.$emit("BarRightCallback");
    },

    clickUser: function (item) {
      this.$emit("onClickUserList", item);
    },
  },
};
</script>
<style scoped>
.UserList {
  text-align: center;
}

.UserListDrawer {
  position: relative;
  max-width: 375px;
  left: calc(50vw - 187.5px) !important;
}

.UserList /deep/ .el-drawer {
  background-color: rgba(92, 80, 149, 1);
  color: white;
}

.UserList /deep/ .el-drawer__header {
  color: white;
  font-size: 0.17rem;
  font-weight: 500;
}
.listEmpty {
  display: inline-block;
  width: 1.9rem;
  height: 1.9rem;
  text-align: center;
  margin-top: 0.9rem;
  background-image: url("../../assets/wheat/userListEmpty.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.UserListLi {
  width: 100%;
  height: 0.64rem;
}

.listEmptyValue {
  display: inline-block;
  margin-top: 1.5rem;
  opacity: 0.6;
}
.UserListImg {
  width: 0.48rem;
  height: 0.48rem;
  border-radius: 50%;
  float: left;
  margin-top: 0.08rem;
  margin-left: 0.23rem;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.UserListName {
  float: left;
  width: calc(375px - 0.83rem);
  text-align: left;
  height: 0.64rem;
  padding-left: 0.12rem;
  font-size: 00.17rem;
  font-weight: Medium;
  position: relative;
}
.UserListNameValue {
  display: inline-block;
  height: 0.24rem;
  line-height: 0.24rem;
  margin-top: 0.24rem;
}
.UserListNamefoot {
  display: inline-block;
  width: 100%;
  position: absolute;
  height: 0.01rem;
  background: white;
  opacity: 0.1;
  bottom: 0;
  left: 0;
}
</style>
