<template>
  <div class="audienceContainer" @click="audienceList">
    <img :src="audienceIcon" class="audienceIcon" /> {{ num }}
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      // eslint-disable-next-line no-undef
      audienceIcon: require("../../assets/live/icon-head.png"),
    };
  },
  props: {
    num: Number,
  },
  methods: {
    audienceList: function () {
      this.$emit("audienceList");
    },
  },
};
</script>

<style scoped>
.audienceContainer {
  position: absolute;
  top: 30px;
  font-size: 12px;
  right: 58px;
  padding: 0px 16px;
  height: 38px;
  color: #fff;
  line-height: 38px;
  border-radius: 20px;

  background: rgba(255, 255, 255, 0.25);
}
.audienceIcon {
  display: inline-block;
  vertical-align: middle;
  width: 18px;
  height: 18.5px;
}
</style>