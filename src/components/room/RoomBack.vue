<template>
  <div class="RoomBack">
    <el-drawer
      :show-close="false"
      id="RoomBack"
      :modal="false"
      :visible.sync="drawer"
      direction="ttb"
      @close="CloseRoomBack"
      :withHeader="false"
      size="1.42rem"
    >
      <div class="RoomBack-center">
        <div class="center-button" v-for="(item, i) in itemList" :key="i">
          <FunctionKey :item="item" />
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import FunctionKey from "./FunctionKey.vue";
export default {
  //   props: ["toolbarData"],
  data() {
    return {
      drawer: false,
      itemList: [],
    };
  },
  components: {
    FunctionKey,
  },
  watch: {
    // toolbarData: function (newVal) {
    //   console.log(newVal);
    // },
  },
  methods: {
    RoomBackOpen: function (item) {
      // console.log(item);
      this.itemList = item;
      this.drawer = true;
    },
    CloseRoomBack: function () {
      this.$emit("RoomBackClose");
    },
  },
};
</script>
<style scoped>
.RoomBack {
  text-align: center;
}
.RoomBack /deep/ .el-drawer {
  background-color: rgba(92, 80, 149, 1) !important;
  /* background-image: url(../../assets/wheat/backBackground.png); */
  overflow: visible !important;
  border-bottom-left-radius: 0.215rem;
  border-bottom-right-radius: 0.215rem;
  color: white;
}

.RoomBack-center {
  width: 100%;
  height: 1.42rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.center-button {
  flex: 1;
}
</style>
