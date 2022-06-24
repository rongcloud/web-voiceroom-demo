<template>
  <div class="giftpage" v-if="isActive">
    <div class="shadow" @click="hideGift" />
    <div class="giftContainer">
      <div class="sendTo">
        送给
        <div
          class="micPosition"
          v-for="(item, k) in micData"
          :key="k"
          @click="select(k)"
        >
          <img
            :src="
              item['portrait']
                ? defaultAddress + item['portrait']
                : defaultAvatarUrl
            "
            width="25px"
            height="25px"
            style="position: absolute; left: 5px; top: 4px; border-radius: 20px"
          />
          <div
            v-if="k == 0 && item['creatuser']"
            class="micNum w2"
            :class="{ isSelected: giftReceiver[k] }"
          >
            房主
          </div>
          <div
            v-if="k == 0 && !item['creatuser'] && !item['index']"
            class="micNum w2"
            :class="{ isSelected: giftReceiver[k] }"
          >
            观众
          </div>
          <div
            v-if="item['index']"
            class="micNum w1"
            :class="{ isSelected: giftReceiver[k] }"
          >
            {{ item["index"] }}
          </div>
        </div>
        <div
          class="sendAll"
          v-if="micData.length > 1"
          @click="selectAll"
          :class="{ sendAll: isSendAll }"
        >
          {{ isSendAll ? "取消" : "全选" }}
        </div>
      </div>
      <div class="mainContainer">
        <div
          class="giftPages"
          :style="{ left: i - currentPage + '00vw' }"
          v-for="(item, i) in giftPages"
          :key="i"
        >
          <div
            class="giftItems"
            v-for="(item, j) in giftPages[i]"
            :key="j"
            @click="selectGift(j, i)"
          >
            <div
              class="giftborder"
              :class="{ current: currentGiftPage == i && currentGift == j }"
            >
              <img :src="item.url" width="80px" height="80px" />
              <div class="giftTitle">{{ item.name }}</div>
              <div class="giftPrice">
                <img
                  :src="require('../../assets/gift/priceIcon.png')"
                  width="11px"
                  height="11px"
                  style="display: inline-block"
                />{{ item.price }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pageContorl">
        <div
          class="pageButton"
          :class="{ active: currentPage == k }"
          :style="{ left: k + '8vw' }"
          v-for="(item, k) in giftPages"
          :key="k"
          @click="trunPage(k)"
        ></div>
      </div>
    </div>
    <div class="sendContorl">
      <div class="numBtn" @click="showSetPanel">{{ currentNumSet }}</div>
      <div class="sendBtn" @click="sendGift">赠送</div>
      <div class="numSet" v-if="showSet">
        <input
          class="numSetItem numInput"
          placeholder="自定义"
          type="number"
          max="9"
          @blur="setNum(customNum)"
          @change="setNum(customNum)"
          v-model="customNum"
        />
        <div
          class="numSetItem"
          :class="{ setActive: currentNum == item }"
          v-for="(item, n) in giftSet"
          :key="n"
          @click="setNum(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import giftData from "./giftData.json";
// import micData from "./micInfo.json"; //mock麦位信息
import Request from "../../request";
export default {
  name: "giftPanel",
  data: function () {
    return {
      giftReceiver: { 0: true },
      giftPages: [],
      giftList: giftData,
      currentGift: 0, //当前选中礼物的编号
      currentGiftPage: 0, //当前选中的礼物的页面编号
      currentNum: 1, //当前赠送礼物数量
      giftSet: [9999, 666, 99, 10, 1],
      customNum: "", //自定义数量
      showSet: false, //显示礼物设置
      pageSize: 8,
      numSet: [],
      currentPage: 0,
      micData: [],
      isSendAll: false,
      defaultAvatarUrl:
        "https://cdn.ronghub.com/demo/default/rce_default_avatar.png",
      defaultAddress: "",
    };
  },
  props: {
    isActive: Boolean,
    roomId: String,
  },
  computed: {
    currentNumSet: function () {
      let str;
      if (this.$data.showSet) {
        str = "x" + this.$data.currentNum + " " + "∨";
      } else {
        str = "x" + this.$data.currentNum + " " + "∧";
      }
      return str;
    },
  },
  created() {
    for (var j = 0; j < giftData.length; j++) {
      // eslint-disable-next-line no-undef
      giftData[j].url = require("../../assets/gift/ic_present_" + j + ".png");
    }
    for (var i = 0; i < giftData.length / this.$data.pageSize; i++) {
      this.$data.giftPages[i] = giftData.slice(i * 8, i * 8 + 8);
    }
  },
  mounted() {
    this.defaultAddress = this.$store.state.defaultAddress;
  },
  methods: {
    showGift: function (item) {
      this.micData = item;
      this.currentGift = 0;
      this.currentGiftPage = 0;
      this.currentNum = 1;
      this.giftReceiver = { 0: true };
      this.showSet = false;
      this.isSendAll = false;
    },
    sendGift: function () {
      let numIndex = this.$data.currentGift;
      if (this.$data.currentGiftPage == 1) {
        numIndex = numIndex + 8;
      }
      if (this.isSendAll) {
        this.$RCVoiceRoomLib.emit("MessageReceived", {
          //发本地
          //模拟本地消息发送
          messageType: "RC:Chatroom:GiftAll",
          isOffLineMessage: false,
          content: {
            userId: this.$store.state.userInfo.userId, // 本人
            userName: this.$store.state.userInfo.userName,
            giftName: giftData[numIndex].name,
            giftId: giftData[numIndex].id,
            number: this.$data.currentNum,
            price: giftData[numIndex].price,
          },
        });
        let c = {
          userId: this.$store.state.userInfo.userId, // 本人
          userName: this.$store.state.userInfo.userName,
          giftId: giftData[numIndex].id,
          giftName: giftData[numIndex].name,
          number: this.$data.currentNum,
          price: giftData[numIndex].price,
        };
        this.$RCVoiceRoomLib.im.messageUpdate("RC:Chatroom:GiftAll", c); //发im
      }
      for (var i in this.$data.giftReceiver) {
        if (!this.isSendAll) {
          this.$RCVoiceRoomLib.emit("MessageReceived", {
            //发本地
            //模拟本地消息发送
            messageType: "RC:Chatroom:Gift",
            isOffLineMessage: false,
            content: {
              userId: this.$store.state.userInfo.userId, // 本人
              userName: this.$store.state.userInfo.userName,
              targetName: this.micData[i].userName,
              targetId: this.micData[i].userId,
              giftName: giftData[numIndex].name,
              number: this.$data.currentNum,
            },
          });
          let c = {
            userId: this.$store.state.userInfo.userId, // 本人
            userName: this.$store.state.userInfo.userName,
            targetId: this.micData[i].userId,
            targetName: this.micData[i].userName,
            giftId: giftData[numIndex].id,
            giftName: giftData[numIndex].name,
            number: this.$data.currentNum,
            price: giftData[numIndex].price,
          };
          this.$RCVoiceRoomLib.im.messageUpdate("RC:Chatroom:Gift", c); //发im
        }
        let giftdata = {
          giftId: giftData[numIndex].id,
          num: this.$data.currentNum,
          roomId: this.roomId,
          toUid: this.micData[i].userId,
        };
        Request.sendGift(giftdata).then(async (res) => {
          //发服务端
          // console.log("发送礼物接口成功", res);
          if (res.data.code == 10000) {
            this.$emit("sendGiftSuccess");
          }
        });
      }
      this.$emit("hideGift");
    },
    hideGift: function () {
      // console.log("ckd");
      this.$emit("hideGift");
    },
    trunPage: function (p) {
      // console.log("传入当前页面:", p);
      this.$data.currentPage = p;
      this.$forceUpdate();
    },
    select: function (k) {
      // console.log(this.$data.giftReceiver);
      if (this.$data.giftReceiver[k]) {
        delete this.$data.giftReceiver[k];
      } else {
        this.$data.giftReceiver[k] = true;
      }
      if (Object.keys(this.giftReceiver).length == this.micData.length) {
        this.isSendAll = true;
      } else {
        this.isSendAll = false;
      }
      this.$forceUpdate();
    },
    selectAll: function () {
      if (this.$data.isSendAll) {
        this.$data.isSendAll = false;
      } else {
        this.$data.isSendAll = true;
      }
      for (var i = 0; i < this.micData.length; i++) {
        if (this.$data.isSendAll) {
          this.$data.giftReceiver[i] = true;
        } else {
          delete this.$data.giftReceiver[i];
        }
      }
      this.$forceUpdate();
    },
    selectGift: function (num, page) {
      // console.log(num, page);
      this.$data.currentGift = num;
      this.$data.currentGiftPage = page;
    },
    showSetPanel: function () {
      if (this.$data.showSet) {
        this.$data.showSet = false;
      } else {
        this.$data.showSet = true;
      }
    },
    setNum: function (k) {
      if (k == "") {
        k = 1;
      }
      this.$data.currentNum = k;
    },
  },
};
</script>