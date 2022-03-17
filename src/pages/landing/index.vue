<template>
  <div class="landing">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      type="card"
      :stretch="true"
      class="landing-tabs"
    >
      <el-tab-pane label="语聊房" name="first">
        <!-- <Room /> -->
      </el-tab-pane>
      <el-tab-pane label="好友" name="second">
        <!-- <Friends /> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import store from "../../store/index";
// import Room from "../room/index.vue";

export default {
  name: "Landing",
  data: function () {
    return {
      tabStretch: true,
      activeName: "first",
    };
  },
  //   props: {
  //     msg: String,
  //   },
  components: {
    // Friends,
    // Room,
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    delRoom: function () {
      //${this.roomId}
      this.$axios
        .get(`mic/room/i5O6RqJLTbQg6DJwufN2Oo/delete`, {
          headers: {
            Authorization: this.authorization,
          },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log("请求失败", err);
        });
    },
  },
  created() {},
  mounted() {
    // this.$axios
    //   .post("/user/login", {
    //     mobile: "18848973580",
    //     verifyCode: "1234",
    //     userName: "测试123",
    //     portrait: "http://xxx:xxx/portrait.png",
    //     deviceId: "xxxxxxxx",
    //   })
    //   .then((response) => {
    //     if (response.data) {
    //       // this.authorization = response.data.data.authorization:
    //       this.authorization = response.data.data.authorization;
    //     } else {
    //       console.log("???");
    //     }
    //   })
    //   .catch((err) => {
    //     alert("请求失败", err);
    //   });
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url("./index.css");
</style>