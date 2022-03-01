

// this._data.chatList = ["1", "2", "23", "23"];
// let status = dargStatus.free;
// let startY;
// let originY;

// document.onmousemove = dargIng;
// that.$refs.body.onmousedown = dargStart;
// document.onmouseup = dargEnd;
// that.$refs.body.onmouseout = dargEnd;

// that.$refs.body.ontouchstart = dargStart;
// document.ontouchend = dargEnd;
// document.ontouchmove = dargIng;
// let o = {
//   body: that.$refs.body,
//   container: that.$refs.container,
// };
// setTimeout(() => {
//   //放到异步队列防治获取到的高度不准确
//   setup(o);
// }, 0);

// function setup(option) {
//   that.$refs.body.style.top =
//     option.container.offsetHeight - option.body.offsetHeight + "px";
// }

// function dargStart(e) {
//   console.log("start", e);
//   if (e.changedTouches && e.changedTouches[0]) {
//     startY = e.changedTouches[0].clientY;
//   } else {
//     startY = e.clientY;
//   }

//   status = dargStatus.darging;
//   let v;
//   if (that.$refs.body.style.top) {
//     v = that.$refs.body.style.top.substr(
//       0,
//       that.$refs.body.style.top.length - 2
//     );
//   } else {
//     v = 0;
//   }
//   originY = Number(v);
// }
// function dargEnd() {
//   console.log("ended");
//   status = dargStatus.free;
// }
// function dargIng(e) {
//   let runningY;
//   if (e.changedTouches && e.changedTouches[0]) {
//     runningY = e.changedTouches[0].clientY;
//   } else {
//     runningY = e.clientY;
//   }
//   if (status == dargStatus.darging) {
//     let t;
//     t = Number(runningY - startY + originY);

//     if (
//       t < 0 &&
//       t > that.$refs.container.offsetHeight - that.$refs.body.offsetHeight
//     ) {
//       that.$refs.body.style.top = t + "px";
//     }
//   }
// }