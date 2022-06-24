<template>
  <div id="RoomFitList">
    <el-drawer
      class="RoomFit"
      :visible.sync="drawer"
      :direction="direction"
      :show-close="false"
      :withHeader="false"
      size="3.45rem"
    >
      <span @click="closeRoomFit" class="CloseButton"></span>
      <div class="roomFit-foot">
        <div class="roomFit-Body">
          <div
            v-for="(item, i) in RoomFitItemList"
            :key="i"
            class="roomFit-item"
          >
            <FunctionKey
              :item="item"
              @closeRoomFit="closeRoomFit"
              @openChangeBack="openChangeBack"
              @openShieldingWords="openShieldingWords"
            />
          </div>
        </div>
      </div>
    </el-drawer>
    <ChangeBackGround ref="ChangeBackGround" />
    <ShieldingWords key="123" ref="ShieldingWords" />
  </div>
</template>
<script>
import FunctionKey from "../components/room/FunctionKey.vue";
import ChangeBackGround from "../components/room/ChangeBackGround.vue";
import ShieldingWords from "./room/ShieldingWords.vue";
export default {
  props: ["RoomFitItemList"],
  data() {
    return {
      drawer: false,
      direction: "btt",
    };
  },
  components: {
    FunctionKey,
    ChangeBackGround,
    ShieldingWords,
  },
  watch: {},
  methods: {
    openRoomFit: function () {
      this.drawer = true;
    },
    closeRoomFit: function () {
      this.drawer = false;
    },
    openChangeBack: function () {
      this.$refs.ChangeBackGround.openChangeBack();
    },
    openShieldingWords: function () {
      this.$refs.ShieldingWords.openShieldingWords();
    },
  },
};
</script>
<style>
#RoomFitList {
  background-color: black;
}
.RoomFit {
  font-size: 0.16rem;
  text-align: center;
  position: relative;
  max-width: 375px;
  left: calc(50vw - 187.5px) !important;
}

.RoomFit .el-drawer {
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
  background-color: rgba(92, 80, 149, 1);
}

.CloseButton {
  display: inline-block;
  width: 0.27rem;
  height: 0.27rem;
  margin-top: 0.08rem;
  background-repeat: no-repeat;
  background-size: 0.27rem 0.27rem;
  background-position: center;
  background-image: url(../assets/roomicon/up-icon.png);
}

.roomFit-foot {
  width: 100%;
  height: 3rem;
  justify-content: center;
  align-items: center;
  display: flex;
}
.roomFit-Body {
  width: 3.6rem;
  height: 3rem;
}
.roomFit-item {
  width: 0.9rem;
  height: 1rem;
  float: left;
  color: white;
}
/* #RoomFitList .RoomFit .el-drawer header {
  margin-bottom: 0rem;
} */
</style>
