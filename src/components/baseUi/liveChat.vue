<template>
  <div
    ref="container"
    class="mainContainer"
    :style="{ top: top + '%', height: height + '%' }"
    @mousedown="down()"
    @mouseup="up()"
    @mousemove="move()"
  >
    <div class="bodyContainer" ref="body">
      <div
        class="chatItems"
        v-for="(item, i) in chatList"
        :key="i"
        v-html="item"
      ></div>
    </div>
  </div>
</template>
<script>
let dargStatus = {
  free: 0,
  darging: 1,
};

let that;
export default {
  name: "chatroom",
  data: function () {
    return {
      chatList: [],
      timeCantrol: true,
    };
  },
  props: {
    top: Number,
    height: Number,
  },
  created() {
    that = this;
  },
  updated() {
    that.$refs.body.style.top =
      that.$refs.container.offsetHeight - that.$refs.body.offsetHeight + "px";
  },
  mounted() {
    let status = dargStatus.free;
    let startY;
    let originY;
    this.$nextTick(() => {
      setTimeout(() => {
        this.chatList = [
          "<span style='color:rgba(106, 159, 255, 1);'> 欢迎来到  " +
            this.setRoomTitle() +
            " </span>",
          "<span style='color:rgba(106, 159, 255, 1)'> 感谢使用融云 RTC 语聊房，请遵守相关法规，不要传播低俗、暴力等不良信息。欢迎您把使用过程中的感受反馈给我们。</span>",
        ];
      }, 100);
    });
    document.onmousemove = dargIng;
    that.$refs.body.onmousedown = dargStart;
    document.onmouseup = dargEnd;
    that.$refs.body.onmouseout = dargEnd;

    that.$refs.body.ontouchstart = dargStart;
    document.ontouchend = dargEnd;
    document.ontouchmove = dargIng;
    let o = {
      body: that.$refs.body,
      container: that.$refs.container,
    };
    setTimeout(() => {
      //放到异步队列防治获取到的高度不准确
      setup(o);
    }, 0);

    function setup(option) {
      that.$refs.body.style.top =
        option.container.offsetHeight - option.body.offsetHeight + "px";
    }

    function dargStart(e) {
      // console.log(e.target.getAttribute("ower"));
      if (e.target.id) {
        if (that.timeCantrol) {
          that.timeCantrol = false;
          that.$emit("nameClick", {
            userId: e.target.id,
          });
          setTimeout(() => {
            that.timeCantrol = true;
          }, 500);
        }
      }
      if (e.changedTouches && e.changedTouches[0]) {
        startY = e.changedTouches[0].clientY;
      } else {
        startY = e.clientY;
      }

      status = dargStatus.darging;
      let v;
      if (that.$refs.body.style.top) {
        v = that.$refs.body.style.top.substr(
          0,
          that.$refs.body.style.top.length - 2
        );
      } else {
        v = 0;
      }
      originY = Number(v);
    }
    function dargEnd() {
      // console.log("ended");
      status = dargStatus.free;
    }
    function dargIng(e) {
      let runningY;
      if (e.changedTouches && e.changedTouches[0]) {
        runningY = e.changedTouches[0].clientY;
      } else {
        runningY = e.clientY;
      }
      if (status == dargStatus.darging) {
        let t;
        t = Number(runningY - startY + originY);

        if (
          t < 0 &&
          t > that.$refs.container.offsetHeight - that.$refs.body.offsetHeight
        ) {
          that.$refs.body.style.top = t + "px";
        }
      }
    }
  },
  methods: {
    ckd: function () {
      //   console.log("ckd", this);
    },
    push: function (message) {
      // console.log(message);
      this._data.chatList.push(message);
    },
    down: function () {
      //  console.log("down");
    },
    up: function () {
      //  console.log("up");
    },
    move: function () {
      // console.log("move");
    },
    //设置房间title
    setRoomTitle: function () {
      let title;
      if (this.$store.state.roomTitle == "undefined") {
        title = this.$store.state.roomInformation.roomName;
      } else {
        title = this.$store.state.roomTitle;
      }

      if (title.length > 10) {
        return title.substring(0, 10) + "...";
      } else {
        return title;
      }
    },
  },
};
</script>
<style scoped>
.mainContainer {
  position: absolute;
  top: 50%;
  left: 0px;
  width: 80%;
  height: 40%;
  color: #fff;
  text-align: left;
  overflow: hidden;
}
.bodyContainer {
  position: absolute;
}
.chatItems {
  width: fit-content;
  font-size: 14px;
  padding: 12px;
  margin: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 1px 6px 6px 6px;
  word-break: break-all;
}
</style>