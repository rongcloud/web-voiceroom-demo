<template>
  <div v-show="showToast.show" class="promptBox">
    <span class="promptValue"> {{ showToast.value }} </span>
  </div>
</template>


<script>
export default {
  name: "PromptBox",
  data: function () {
    return {
      showToast: this.$store.state.showToast,
    };
  },
};
</script>
<style scoped>
.promptBox {
  position: absolute;
  z-index: 10000;
  width: 375px;
  height: 100vh;
  top: 0px;
  left: calc(50vw - 187.5px) !important;
  opacity: 1;
  font-size: 0.14rem;
  text-align: center;
}

.promptValue {
  display: inline-block;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0.1rem;
  text-align: center;
  font-size: 0.14rem;
  font-weight: 900;
  padding: 0.15rem;
  margin-top: 5.5rem;
}
/* .promptShow {
  display: none;
  position: absolute;
  z-index: 1000000000000000;
  width: 100%;
  height: 100vh;
  top: 0px;
  left: 0px;
  background-color: black;
  line-height: calc(100vh - 2rem);
  opacity: 0.2;
} */
</style>