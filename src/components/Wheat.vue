<template>
  <!-- <div class="house">语聊房</div> -->
  <div class="container">
    <div class="wave">
      <div class="circle" :class="circlemove"></div>
      <div class="circle2" :class="circle2move"></div>
      <div @click="click" class="card">
        <span style="font-size: 0.16rem"></span>
      </div>
    </div>
  </div>
</template> 

<script>
export default {
  name: "Friends",
  data: function () {
    return {
      tabStretch: true,
      activeName: "first",
      circlemove: "",
      circle2move: "",
      keepMove: true,
    };
  },
  props: {
    msg: String,
  },

  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    click: function () {
      // console.log(this.keepMove);
      if (this.keepMove) {
        this.circlemove = "move";
        this.keepMove = false;
        setTimeout(() => {
          this.circle2move = "move";
          setTimeout(() => {
            this.circlemove = "";
            this.keepMove = true;
            setTimeout(() => {
              this.circle2move = "";
            }, 700);
          }, 800);
        }, 700);
      }
    },
  },
  created() {
    // console.log(this.$RCVoiceRoomLib);
  },
  mounted() {
    // console.log(this.$RCVoiceRoomLib);
  },
};
</script>
<style scoped>
@import url("./index.css");
</style>
<style>
.container {
  position: absolute;
  top: 75%;
  left: 40%;
  width: 40%;
  height: 40%;
}

/* 波动效果 */
.wave {
  position: relative;
  width: 50px;
  height: 50px;
  text-align: center;
}

.wave .circle {
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 50%;
  opacity: 0;
  background: #77acf8;
}

.wave .circle2 {
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 50%;
  opacity: 0;
  background: #77acf8;
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
    transform: scale(2);
  }
}

.card {
  width: 50px;
  height: 0px;
  border-radius: 50%;
  background-color: #77acf8;
  padding: 25px 0;
  color: #fff;
  position: absolute;
  z-index: 999;
}
</style>