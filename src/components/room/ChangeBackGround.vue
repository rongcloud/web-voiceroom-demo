<template>
  <div id="ChangeBack">
    <el-drawer
      class="ChangeBack-drawer"
      id="ChangeBack-drawer"
      key="drawer"
      :visible.sync="ChangeBack"
      :direction="direction"
      :withHeader="false"
      :wrapperClosable="false"
      size="3.26rem"
      :show-close="true"
    >
      <span class="ChangeBack-title">切换房间背景</span>
      <div @click="SetselectImage" class="ChangeBack-yes">确定</div>
      <div class="ChangeBack-title-img-select">
        <div>
          <div
            class="ChangeBack-selet"
            v-for="(item, i) in imgData"
            @click="selectImage(item)"
            :key="i"
            :style="{
              backgroundImage: 'url(' + item.url + ')',
            }"
          >
            <div
              class="ChangeBack-seletImg"
              :style="
                item.select
                  ? {
                      backgroundImage: 'url(' + imgSelect + ')',
                      backgroundColor: '#E92B88',
                    }
                  : ''
              "
            ></div>
            <div
              v-if="item.url.substring(item.url.length - 3) == 'gif'"
              class="ChangeBack-seletGIF"
            >
              GIF
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import request from "../../request/index";
export default {
  data() {
    return {
      ChangeBack: false,
      direction: "btt",
      imgData: [],
      // eslint-disable-next-line no-undef
      imgSelect: require("../../assets/check-circle-true-icon.png"),
      getSelectImg: "",
    };
  },
  components: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    openChangeBack: function () {
      this.ChangeBack = true;
      this.imgData = this.$store.state.imgList;
      for (let i = 0; i < this.imgData.length; i += 1) {
        if (this.imgData[i].url === this.$store.state.roomBackground) {
          this.imgData[i].select = true;
        } else {
          this.imgData[i].select = false;
        }
      }
      // console.log(this.imgData);
    },
    closeChangeBack: function () {
      this.ChangeBack = false;
    },
    selectImage: function (item) {
      this.getSelectImg = item.url;
      for (let i = 0; i < this.imgData.length; i += 1) {
        if (this.imgData[i].url === item.url) {
          this.imgData[i].select = true;
        } else {
          this.imgData[i].select = false;
        }
      }
    },
    SetselectImage: function () {
      if (
        this.getSelectImg != "" &&
        this.getSelectImg != this.$store.state.roomInformation.backgroundUrl
      ) {
        // console.log(this.getSelectImg);
        request
          .setRoomBackground({
            backgroundUrl: this.getSelectImg,
            roomId: this.$RCVoiceRoomLib._roomidcli,
          })
          .then((res) => {
            // console.log(res);
            if (res.data.code == 10000) {
              this.$store.dispatch("getroomBackground", this.getSelectImg);
              this.$store.dispatch("getRoomInformation", {
                ...this.$store.state.roomInformation,
                backgroundUrl: this.getSelectImg,
              });
              this.$RCVoiceRoomLib.notifyVoiceRoom(
                "VoiceRoomBackgroundChanged",
                this.getSelectImg
              );
            }
          })
          .catch((err) => {
            console.log("err", err);
          });
      }
      this.ChangeBack = false;
    },
  },
};
</script>
<style>
#ChangeBack {
  background-color: black;
}
.ChangeBack-drawer {
  font-size: 0.16rem;
  text-align: center;
}

.ChangeBack-drawer .el-drawer {
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
  background-color: rgba(92, 80, 149, 1);
}

.ChangeBack-title-img-select {
  width: 100%;
  height: 2.25rem;
  margin-top: 0.13rem;
  justify-content: center;
  align-items: center;
  display: flex;
}

.ChangeBack-title {
  display: inline-block;
  margin-top: 0.26rem;
  color: #ffffff;
  font-size: 0.16rem;
}

.ChangeBack-yes {
  position: absolute;
  right: 0.25rem;
  top: 0.28rem;
  color: #ffffff;
  font-size: 0.14rem;
}

.ChangeBack-selet {
  width: 1.05rem;
  height: 1.05rem;
  border-radius: 0.12rem;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  float: left;
  margin-left: 0.075rem;
  margin-right: 0.075rem;
  margin-top: 0.15rem;
  position: relative;
}

.ChangeBack-selet .ChangeBack-seletImg {
  width: 0.15rem;
  height: 0.15rem;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: right bottom;
  background-color: #ffffff;
  position: absolute;
  top: 0.1rem;
  right: 0.1rem;
}

.ChangeBack-selet .ChangeBack-seletGIF {
  width: 0.2rem;
  height: 0.17rem;
  font-weight: 600;
  font-size: 0.12rem;
  text-align: center;
  line-height: 0.17rem;
  position: absolute;
  bottom: 0.08rem;
  left: 0.13rem;
  color: #ffffff;
}
</style>
