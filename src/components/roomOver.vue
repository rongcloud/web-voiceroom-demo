<template>
  <div>
    <div
      class="house over"
      :style="{
        backgroundImage: 'url(' + this.$store.state.roomBackground + ')',
      }"
    >
      <div class="houseover">
        <div class="house-over">该房间直播已结束</div>
        <div @click="backRoomList" class="back-room-list">返回房间列表</div>
      </div>
    </div>
  </div>
</template> 

<script>
export default {
  name: "House",
  data: function () {
    return {};
  },
  props: {
    msg: String,
  },
  components: {},
  methods: {
    //房间已关闭，直接跳转回去
    backRoomList: async function () {
      this.$router.go(-1);
    },
  },

  created() {},
  mounted() {},
};
</script>
<style >
.over {
  justify-content: center;
  align-items: center;
  display: flex;
}

.houseover {
  color: white;
  width: 1.8rem;
  height: 1rem;
  text-align: center;
}

.house-over {
  font-size: 0.2rem;
}

.back-room-list {
  display: block;
  background-color: white;
  color: black;
  font-size: 0.12rem;
  border-radius: 0.05rem;
  width: 1.2rem;
  height: 0.3rem;
  line-height: 0.3rem;
  margin-top: 0.2rem;
  margin-left: 0.3rem;
}
</style>