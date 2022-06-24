
import liveRoom from "../pages/live";
import Room from "../pages/room";
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import House from "../pages/house";
import RoomOver from "../components/roomOver";
import VueRouter from 'vue-router'
const router = new VueRouter({
  // mode: 'hash',
  // eslint-disable-next-line no-undef
  base: __dirname,
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/live', name: 'liveRoom', component: liveRoom },
    { path: '/home', name: 'home', component: Home },
    { path: '/room', name: 'room', component: Room },
    { path: '/login', name: 'login', component: Login },
    { path: '/room/house', name: 'roomHouse', component: House },
    { path: '/room/roomover', name: 'roomOver', component: RoomOver },
    // { path: '/bar/:id', name: 'bar', component: HelloWorld }
  ]
})

export default router;