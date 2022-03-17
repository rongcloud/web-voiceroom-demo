<template>
  <div class="seatKey">
    <div
      class="seatKey-img"
      :style="
        true
          ? {}
          : {
              backgroundImage: 'linear-gradient(#FF0000 0%, #0000cc 100%)',
            }
      "
    >
      <div
        v-if="!item['mute'] && item['userId']"
        class="circle"
        :class="circlemove"
      ></div>
      <div
        v-if="!item['mute'] && item['userId']"
        class="circle2"
        :class="circle2move"
      ></div>
      <div v-if="item['mute']" class="seatKey-mute"></div>
      <el-image
        class="image-ower"
        fit="cover"
        @click="seatOtherWave(item)"
        :src="
          item.status == 0
            ? homeOwerImg
            : item.status == 2
            ? LockImg
            : item['portrait']
            ? this.$store.state.defaultAddress + item['portrait']
            : this.$store.state.defaultAvatarUrl
        "
      ></el-image>
    </div>
    <div class="emptySeat" v-if="item.status != 1">
      {{ item["index"] }} 号麦位
    </div>
    <div v-if="item['userId']" class="seatKey-name">
      <span
        class="seatKey-Admin"
        :style="
          item['isAdmin']
            ? {
                backgroundImage: Admin,
                paddingLeft: '0.16rem',
              }
            : {}
        "
        >{{ item.userName }}</span
      >
    </div>
    <span v-if="item['userId']" class="seatKey-gift">
      <span class="seatKey-gift-text">{{ item.gift ? item.gift : 0 }}</span>
    </span>
  </div>
</template>
<script>
export default {
  props: ["item"],
  data(props) {
    return {
      type: "",
      circlemove: "",
      circle2move: "",
      keepMove: true,
      // eslint-disable-next-line no-undef
      Admin: "url(" + require("../../assets/roomicon/Manage.png") + ")",
      // eslint-disable-next-line no-undef
      homeOwerImg: require("../../assets/roomicon/UpperWheat.png"),
      // eslint-disable-next-line no-undef
      LockImg: require("../../assets/roomicon/LockSeatIcon.png"),
      itemkeep: props.item,
    };
  },
  watch: {
    listenSpeakingChengeControl: function () {
      if (this.$store.state.SpeakingChenge.index == this.itemkeep.index) {
        if (this.$store.state.SpeakingChenge.speaking == 1) {
          this.setSpreadAnimatio(true);
        } else {
          this.setSpreadAnimatio(false);
        }
      }
    },
  },
  computed: {
    listenSpeakingChengeControl() {
      return this.$store.state.SpeakingChengeControl;
    },
  },
  created() {},
  mounted() {},

  methods: {
    seatOtherWave: function (item) {
      // console.log(item);
      this.$emit("clickSeat", item);
    },

    setSpreadAnimatio: function (item) {
      if (item) {
        if (this.keepMove) {
          this.circlemove = "move";
          this.keepMove = false;
          setTimeout(() => {
            this.circle2move = "move";
          }, 700);
        }
      } else {
        setTimeout(() => {
          this.circlemove = "";
          this.keepMove = true;
          setTimeout(() => {
            this.circle2move = "";
          }, 700);
        }, 800);
      }
    },
  },
};
</script>
<style scoped>
.seatKey {
  display: inline-block;
  width: 100%;
  height: 1.06rem;
  position: relative;
  background-repeat: no-repeat;
  background-size: 0.56rem 0.56rem;
  background-position: top;
  text-align: center;
}
.seatKey-img {
  width: 0.56rem;
  height: 0.56rem;
  border-radius: 50%;
  margin-left: 0.175rem;
  align-items: center;
  justify-content: center;
  display: flex;
  position: relative;
}

.image-ower {
  width: 0.56rem;
  height: 0.56rem;
  border-radius: 50%;
}

.seatKey-name {
  font-size: 0.12rem;
  transform: scale(0.833);
  text-align: center;
  color: #ffffff;
  margin-top: 0.02rem;
}

.seatKey-mute {
  z-index: 100;
  position: absolute;
  right: 0rem;
  bottom: 0.03rem;
  width: 0.18rem;
  height: 0.18rem;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 0.18rem 0.18rem;
  background-image: url(../../assets/wheat/MuteWheat.png);
}

.emptySeat {
  color: #ffffff;
  font-size: 0.12rem;
  transform: calc(0.83);
  margin-top: 0.08rem;
}

.seatKey-Admin {
  display: inline-block;
  line-height: 0.14rem;
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 0.14rem 0.14rem;
}

.seatKey-gift {
  background-color: rgba(255, 255, 255, 0.2);
  text-align: center;
  height: 0.14rem;
  margin-top: 0.01rem;
  line-height: 0.14rem;
  border-radius: 0.07rem;
  display: inline-block;
  padding-left: 0.15rem;
  padding-right: 0.05rem;
  background-repeat: no-repeat;
  background-position: left;
  background-image: url(../../assets/wheat/gift.png);
  background-size: 0.14rem 0.14rem;
}

.seatKey-gift-text {
  display: inline-block;
  font-size: 0.12rem;
  transform: scale(0.75);
  color: #ffffff;
}
/* 波动效果 */
.circle {
  width: 0.54rem;
  height: 0.54rem;
  position: absolute;
  border-radius: 50%;
  opacity: 0;
  background-image: linear-gradient(#ff0000 0%, #0000cc 100%);
}

.circle2 {
  width: 0.54rem;
  height: 0.54rem;
  position: absolute;
  border-radius: 50%;
  opacity: 0;
  background-image: linear-gradient(#ff0000 0%, #0000cc 100%);
}

.move {
  animation: circle-opacity 2s infinite;
}

@keyframes circle-opacity {
  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(1.6);
  }
}
</style>
