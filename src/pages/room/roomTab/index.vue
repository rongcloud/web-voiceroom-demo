<template>
  <div class="roomTab" @click="jumpToRoom(data)">
    <div class="roomTabLi">
      <el-image
        class="room-image"
        :src="data.themePictureUrl || roomIcon"
        fit="cover"
      ></el-image>
      <div class="room-text">
        <div class="room-title">
          {{ data.roomName }}
        </div>
        <el-image
          class="room-portrait"
          :src="
            data.createUser.portrait
              ? this.$store.state.defaultAddress + data.createUser.portrait
              : this.$store.state.defaultAvatarUrl
          "
          fit="cover"
        ></el-image>
        <div class="room-name">{{ data.createUser.userName }}</div>
      </div>
      <div class="roomRight">
        <div v-if="data.isPrivate == 1" class="roomRight-lock"></div>
        <el-image
          class="roomRightIcon"
          :src="peopleIcon"
          fit="cover"
        ></el-image>
        <div class="roomRightNumber">
          {{ data.userTotal }}
        </div>
      </div>
    </div>
    <PopuInput ref="PopuInput" @clickYes="clickYes" />
  </div>
</template>

<script>
import { GetQueryString } from "../../../utils/utils";
import PopuInput from "../../../components/PopupInput.vue";
export default {
  name: "RoomTab",
  props: ["data"],
  components: { PopuInput },
  data() {
    return {
      key: "",
      roomId: "",
      // eslint-disable-next-line no-undef
      peopleIcon: require("../../../assets/character-icon.png"),
      // eslint-disable-next-line no-undef
      roomIcon: require("../../../assets/DefaultImg.png"),
    };
  },
  // eslint-disable-next-line vue/no-dupe-keys
  methods: {
    setRoomList: function () {
      return this.roomsList;
    },
    clickYes: async function (value) {
      // console.log(value);
      if (value == this.key) {
        try {
          this.$refs.PopuInput.onClose();
          this.$emit("joinchatRoom", this.roomId);
        } catch (err) {
          console.log("加入语聊房失败！");
        }
      } else {
        this.$store.dispatch("showToast", {
          value: "密码错误",
        });
      }
    },
    jumpToRoom: async function (data) {
      this.$store.dispatch("userHasApply", false);
      // console.log(data);
      if (GetQueryString("roomType")) {
        switch (GetQueryString("roomType")) {
          case "liveRoom":
            if (data.isPrivate == 1) {
              this.key = data.password;
              this.roomId = data.roomId;
              this.$refs.PopuInput.setPopup({
                type: "number",
                title: "请输入 4 位数字密码",
                placeholder: "请输入 4 位数字密码",
              });
            } else {
              this.$router.push("/live?roomid=" + data.roomId);
            }
            console.log("直播密码房间加入");
            break;

          default:
            break;
        }
        return;
      }
      if (
        data.createUser.userId != this.$RCVoiceRoomLib.im.userId &&
        data.isPrivate == 1
      ) {
        this.key = data.password;
        this.roomId = data.roomId;
        this.$refs.PopuInput.setPopup({
          type: "number",
          title: "请输入 4 位数字密码",
          placeholder: "请输入 4 位数字密码",
        });
        return;
      }
      try {
        this.$emit("joinchatRoom", data.roomId);
      } catch (err) {
        console.log("加入语聊房失败！");
      }
    },
  },
  created() {},
  mounted() {},
};
</script>
<style scoped>
@import url("./index.css");
</style>