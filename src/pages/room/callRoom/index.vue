<template>
  <div class="CallRoom">
    <div class="CallRoom-noRoom" @click="getRoomList(1)" v-if="keepShow">
      <span class="CallRoom-noRoom-value">请创建房间</span>
    </div>
    <scroller
      v-else
      class="infinite-list-wrapper"
      :on-refresh="reffor"
      :on-infinite="inffor"
      ref="scrfor"
    >
      <ul class="infinite-list">
        <li
          v-for="key in this.$store.state.roomList"
          class="list-item"
          :key="key.id"
        >
          <RoomTab :data="key" @joinchatRoom="joinchatRoom" />
        </li>
      </ul>
    </scroller>
  </div>
</template>

<script>
import RoomTab from "../roomTab/index.vue";
import BScroll from "better-scroll";
import request from "../../../request/index";
import { GetQueryString } from "../../../utils/utils";
export default {
  name: "CallRoom",
  data: function () {
    return {
      roomsList: [],
      loading: false,
      myscroll: null,
      dataList: [],
      roomListLength: false,
      page: 1,
      size: 10,
      keepShow: false,
    };
  },
  watch: {
    listenstage: function (newVal) {
      console.log("newVal", newVal);
      this.$nextTick(() => {
        if (this.$store.state.roomList.length > 0) {
          this.keepShow = false;
        } else {
          this.keepShow = true;
        }
      });
    },
  },
  components: {
    RoomTab,
  },
  computed: {
    noMore() {
      if (this.roomListLength) {
        return true;
      }
      return false;
    },
    listenstage() {
      return this.$store.state.roomList;
    },
  },
  // eslint-disable-next-line vue/no-dupe-keys
  methods: {
    getRoomList: function (page) {
      // console.log(this.authorizationVal);
      let reqObj = {
        page: page,
        size: this.size,
      };
      if (
        //直播房间
        GetQueryString("roomType") &&
        GetQueryString("roomType") == "liveRoom"
      ) {
        reqObj.type = 3;
      }
      request
        .roomList(reqObj)
        .then((response) => {
          this.dataList = response.data.data;
          if (page == 1) {
            this.$store.dispatch("changesRoomsList", response.data.data.rooms);
          } else {
            this.$store.dispatch(
              "changesRoomsList",
              this.$store.state.roomList.concat(response.data.data.rooms)
            );
          }
          response.data.data.rooms.length < 10
            ? (this.roomListLength = true)
            : (this.roomListLength = false);
          // store.actions.changesVal([]);
        })
        .catch((err) => {
          console.error("请求失败", err);
          // alert("请求失败", err);
        });
    },
    joinchatRoom: function (roomId) {
      request
        .roominformation({ roomId: roomId })
        .then(async (res) => {
          if (res.data.code == 10000) {
            if (
              //直播房间
              GetQueryString("roomType") &&
              GetQueryString("roomType") == "liveRoom"
            ) {
              this.$router.push("/live?roomid=" + roomId);
              return;
            } else {
              await this.$RCVoiceRoomLib.joinRoom(roomId);
              this.$router.push("/room/house");
            }
          //  await this.$RCVoiceRoomLib.joinRoom(roomId);重复调用了。
            let txtEnter = {
              userId: this.$RCVoiceRoomLib.im.userId,
              userName: this.$store.state.userInfo.userName,
            };
            this.$RCVoiceRoomLib.im.messageUpdate(
              "RC:Chatroom:Enter",
              txtEnter
            );

            this.$router.push("/room/house");
          } else {
            this.$router.push("/room/roomover");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setBScroll: function () {
      this.myscroll = null;
      this.myscroll = new BScroll(".infinite-list-wrapper", {
        pullDownRefresh: {
          threshold: 50,
          stop: 20,
        },
        scrollbar: {
          fade: true,
          interactive: false, // 1.8.0 新增
        },
        bounce: true,
        probeType: 3, //0,1，2，3
        pullUpLoad: true, //上拉加载更多,默认为false，不允许
        click: true,
      });
      this.myscroll.on("pullingDown", () => {
        // console.log("下拉了");
        this.getRoomList(1);
        this.page = 1;
        setTimeout(() => {
          this.myscroll.finishPullDown(); // 自动调用 .refresh()
        }, 500);
      });
      this.myscroll.on("pullingUp", () => {
        this.loading = true;
        this.page += 1;
        setTimeout(() => {
          this.loading = false;
          this.myscroll.finishPullUp(); // 自动调用 .refresh()
        }, 500);
      });
    },
    reffor: async function () {
      this.page = 1; //重置页数刷新每次页数都是第一页
      try {
        await this.getRoomList(1);
        setTimeout(() => {
          this.$refs.scrfor.finishPullToRefresh();
          // done(); //进行下一次加载操作
        }, 500);
      } catch (err) {
        console.log(err);
      }
    },
    // 上拉加载
    inffor: async function (done) {
      // console.log("上拉了");
      if (this.$store.state.roomList.length < 10) {
        done(2);
      } else {
        if (this.$store.state.roomList.length > 10 && this.roomListLength) {
          done(2);
        } else {
          this.page += 1;
          try {
            await this.getRoomList(this.page);
            setTimeout(() => {
              done(true); //进行下一次加载操作
            }, 500);
          } catch (err) {
            console.log(err);
          }
        }
      }
    },
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      if (this.$store.state.roomList.length > 0) {
        this.keepShow = false;
      } else {
        this.keepShow = true;
      }
    });
  },
};
</script>
<style scoped>
@import url("./index.css");
</style>