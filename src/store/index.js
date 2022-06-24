import Vue from "vue";
import Vuex from 'vuex';

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        uploadAddress: '/api/file/upload',
        defaultAddress: '/api/file/show?path=',
        roomBackground: '/api/static/room/1.gif',
        imgList: [],
        roomList: [],
        showToast: {
            show: false,
            value: "",
        },
        userInfo: {
            authorization: '',
            imToken: '',
            portrait: '',
            type: '',
            userId: '',
            userName: ''
        },
        itemList: [],
        roomTitle: '',
        roomPrivate: {},
        muteMicrophone: false,
        creatUser: false,
        TheRoomAdmin: false,
        userInseat: false,
        HasApply: false,
        GiftAndManageList: {},
        roomUserList: [],
        RequestSeatUserIds: [],
        defaultAvatarUrl: 'https://cdn.ronghub.com/demo/default/rce_default_avatar.png',
        roomInformation: {},
        setCounts: 9,
        muteOwer: null,
        Chatroom: null,
        micData: [],
        sensitiveList: [],
        onMic: false,//在麦位上
        isFollowed: false,//是否已关注
        giftNum: 0, //礼物数量  
        isFreeEnterSeat: false, //上麦模式默认需要申请
        onLink: false, //连线中
        owerDisconnet: false,//是否为主动断开连接判断
        roomType: "",
        picking: '', //主动邀请他人状态

        //控制更新
        seatInfoList: 2,
        giftValue: 2,
        AdminValue: 2,
        SpeakingChengeControl: 2,
        SpeakingChenge: 100,

    },
    getters: {//如果要使用watch观察状态改变那么一定配置这一项
        // im: () => this.state.im,
        // imgList: () => this.state.imgList
    },
    mutations: {//需要执行多个state 的操作 , 使用 mutations 会来触发会比较好维护
        //s设置主播座位信息
        setItemList(state, newVal) {
            state.itemList = newVal
        },
        //设置用户信息
        setUserInfo(state, newVal) {
            state.userInfo = { ...state.userInfo, ...newVal }
            console.log("更新用户资料", state.userInfo);
        },
        //创建页面图片全局化
        setImgList(state, newVal) {
            state.imgList = [...newVal]
        },
        //设置房间list
        setRoomsList(state, newVal) {
            state.roomList = [...newVal]
        },
        //toast全局化更新
        showToastName(state, newVal) {
            state.showToast.value = newVal.value
            state.showToast.show = newVal.show
        },
        //设置房间信息
        setRoomInformation(state, newVal) {
            state.roomInformation = newVal.value
        },
        //设置房间用户信息
        setRoomUserList(state, newVal) {
            state.roomUserList = newVal.value
        },
        //及时更新本地麦位信息，主动触发动作
        setSeatInfoList(state, newVal) {
            state.seatInfoList = newVal.value
        },
        //是否为房主控制
        creatuser(state, newVal) {
            state.creatUser = newVal.value
        },
        //设置房间背景roomTitle
        setroomBackground(state, newVal) {
            state.roomBackground = newVal.value
        },
        //设置房间标题
        setroomTitle(state, newVal) {
            state.roomTitle = newVal.value
        },
        //设置房间上锁解锁
        setroomPrivate(state, newVal) {
            state.roomPrivate = { ...newVal.value }
        },
        //设置房间麦克风
        setMicrophone(state, newVal) {
            state.muteMicrophone = newVal.value
        },
        RoomAdmin(state, newVal) {
            state.TheRoomAdmin = newVal.value
        },
        //setGiftAndManageList
        setGiftAndManageList(state, newVal) {
            state.GiftAndManageList = {
                ...newVal.value
            }
        },
        //Chatroom组建监听
        setChatroom(state, newVal) {
            state.Chatroom = newVal.value
        },
        //礼物人数控制
        setMicData(state, newVal) {
            state.micData = newVal.value
        },
        //观众是否在座位判断
        setuserInseat(state, newVal) {
            state.userInseat = newVal.value
        },
        //设置排麦list
        setRequestSeatUserIds(state, newVal) {
            state.RequestSeatUserIds = [...newVal.value]
        },
        //设置是否请求排麦
        setuserHasApply(state, newVal) {
            state.HasApply = newVal.value
        },
        //更新礼物
        setgiftUpdate(state, newVal) {
            state.giftValue = newVal.value
        },
        //更新管理员
        setAdminUpdate(state, newVal) {
            state.AdminValue = newVal.value
        },
        //扩散动作
        setSpeakingChenge(state, newVal) {
            state.SpeakingChenge = newVal.value
            state.SpeakingChengeControl = Math.random()
        },
        setsetCountsChange(state, newVal) {
            state.setCounts = newVal.value
        },
        //设置屏蔽词数据
        setsensitiveList(state, newVal) {
            console.log("设置", state, newVal);
            state.sensitiveList = newVal.value
        },
        //主动断开连接
        setOwerDisconnet(state, newVal) {
            state.owerDisconnet = newVal.value
        },
        //修改房间标识
        setRoomType(state, newVal) {
            state.roomType = newVal.value
        },
    },
    actions: {//需要执行多个 mutations 就需要用 action 了
        //更新主播座位信息
        updateItemList({ commit }, newVal) {
            commit('setItemList', newVal);
        },
        //更新用户信息
        updateUserInfo({ commit }, newVal) {
            commit('setUserInfo', newVal);
        },
        //设置背景图list
        changesImgList({ commit }, newVal) {
            let arrList = []
            for (let i = 0; i < newVal.length; i += 1) {
                if (i === 0) {
                    arrList.push({ url: newVal[i], select: true });
                } else {
                    arrList.push({ url: newVal[i], select: false });
                }
            }
            commit('setImgList', arrList)
        },
        //修改房间list
        changesRoomsList({ commit }, newVal) {
            commit('setRoomsList', newVal);
        },
        //toast全局化
        showToast({ commit }, newVal) {
            commit('showToastName', { value: newVal.value, show: true })
            setTimeout(() => {
                commit('showToastName', { value: '', show: false })
            }, newVal.time || 800)
        },
        //获取房间信息
        getRoomInformation({ commit }, newVal) {
            commit('setRoomInformation', { value: newVal })
        },
        //获取房间用户信息
        getRoomUserList({ commit }, newVal) {
            commit('setRoomUserList', { value: newVal })
        },
        //及时更新本地麦位信息，主动触发动作
        getSeatInfoList({ commit },) {
            commit('setSeatInfoList', { value: Math.random() })
        },
        //是否为房主控制
        setcreatuser({ commit }, newVal) {
            commit('creatuser', { value: newVal })
        },
        //设置房间背景
        getroomBackground({ commit }, newVal) {
            commit('setroomBackground', { value: newVal })
        },
        //设置房间标题
        getroomTitle({ commit }, newVal) {
            commit('setroomTitle', { value: newVal })
        },
        //设置房间上锁解锁
        getroomPrivate({ commit }, newVal) {
            commit('setroomPrivate', { value: newVal })
        },
        //设置房间麦克风
        getMicrophone({ commit }, newVal) {
            commit('setMicrophone', { value: newVal })
        },
        //设置房间管理
        setRoomAdmin({ commit }, newVal) {
            commit('RoomAdmin', { value: newVal })
        },
        //GiftAndManageList
        getGiftAndManageList({ commit }, newVal) {
            commit('setGiftAndManageList', { value: newVal })
        },
        //Chatroom组建监听
        getChatroom({ commit }, newVal) {
            commit('setChatroom', { value: newVal })
        },
        //礼物人数控制
        getMicData({ commit }, newVal) {
            commit('setMicData', { value: newVal })
        },
        //观众是否在座位判断
        updateuserInseat({ commit }, newVal) {
            commit('setuserInseat', { value: newVal })
        },
        //获取排麦listsetRequestSeatUserIds
        getRequestSeatUserIds({ commit }, newVal) {
            commit('setRequestSeatUserIds', { value: newVal })
        },
        //设置是否请求排麦
        userHasApply({ commit }, newVal) {
            commit('setuserHasApply', { value: newVal })
        },
        //礼物更新
        giftUpdate({ commit },) {
            commit('setgiftUpdate', { value: Math.random() })
        },
        //管理员更新
        AdminUpdate({ commit },) {
            commit('setAdminUpdate', { value: Math.random() })
        },
        //
        getSpeakingChenge({ commit }, newVal) {
            commit('setSpeakingChenge', { value: newVal })
        },

        //房间座位发生改变
        getsetCountsChange({ commit }, newVal) {
            commit('setsetCountsChange', { value: newVal })
        },

        //获取屏蔽词
        getsensitiveList({ commit }, newVal) {
            console.log("获取屏蔽词", newVal)
            commit('setsensitiveList', { value: newVal })
        },

        //主动断开连接
        getOwerDisconnet({ commit }, newVal) {
            commit('setOwerDisconnet', { value: newVal })
        },

        //主动断开连接
        getRoomType({ commit }, newVal) {
            commit('setRoomType', { value: newVal })
        },
    }
})
export default store