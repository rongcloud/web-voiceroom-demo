
import Axios from '../utils/request'
import store from '../store/index'
import { btoken } from '../request/BusinessToken'
// const btoken = 'vStHYPdrQoImm-7Ur0ks1g';
const baseURL = '/api'
export default {
    sendCode: (obj) => { //用户登陆获取token
        return Axios
            .post(baseURL + "/user/sendCode", { ...obj }, {
                headers: {
                    BusinessToken: btoken,
                }
            })
    },
    userLand: (obj) => { //用户登陆获取token
        return Axios
            .post(baseURL + "/user/login", { ...obj }, {
                headers: {
                    BusinessToken: btoken,
                }
            })
    },
    userUpdate: (obj) => { //用户登陆获取token
        return Axios
            .post(baseURL + "/user/update", { ...obj }, {
                headers: {
                    BusinessToken: btoken,
                    authorization: store.state.userInfo.authorization
                }
            })
    },
    roomList: (obj) => {//获取语聊房房间列表
        let typeTxt = '';
        if (obj.type) {
            typeTxt = "&type=" + obj.type
        }
        return Axios
            .get(baseURL + `/mic/room/list?page=${obj.page}&size=${obj.size}${typeTxt}`, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },
    creatRoom: (obj) => {//创建房间
        return Axios
            .post(baseURL + `/mic/room/create`, { ...obj }, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },
    checkUser: () => {//取礼物列表
        return Axios
            .get(baseURL + `/user/check`, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },

    joinRoom: (roomId) => {
        return Axios
            .get(baseURL + `/user/change?roomId=${roomId}`, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },
    creatLiveRoom: (obj) => {//创建直播房间
        return Axios
            .post(baseURL + `/mic/room/create`, { ...obj }, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },
    giftList: (id) => {//取礼物列表
        return Axios
            .get(baseURL + `/mic/room/${id}/gift/list`, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },
    getGiftList: (obj) => {//取礼物列表
        return Axios
            .get(baseURL + `/mic/room/${obj.roomId}/gift/list`, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },
    sendGift: (obj) => {//创建直播房间
        return Axios
            .post(baseURL + `/mic/room/gift/add`, { ...obj }, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: 'vStHYPdrQoImm-7Ur0ks1g',
                },
            })
    },
    deleteRoom: (obj) => {//删除房间
        return Axios
            .get(baseURL + `/mic/room/${obj.roomId}/delete`, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },
    roomuser: (obj) => {//获取房间用户列表
        return Axios
            .get(baseURL + `/mic/room/${obj.roomId}/members`, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },
    roominformation: (obj) => {//获取房间信息
        return Axios
            .get(baseURL + `/mic/room/${obj.roomId}`, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },
    roomuserinfor: (obj) => {//获取房间用户列表
        return Axios
            .get(baseURL + `/mic/room/${obj.roomId}/members`, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },

    manageList: (obj) => {//获取管理员列表
        return Axios
            .get(baseURL + `/mic/room/${obj.roomId}/manage/list`, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },
    setManage: (obj) => {//获取管理员列表
        return Axios
            .put(baseURL + `/mic/room/manage`, { ...obj }, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },
    setRoomBackground: (obj) => {//设置房间背景
        return Axios
            .put(baseURL + `/mic/room/background`, { ...obj }, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },
    setRoomTitle: (obj) => {//设置房间title
        return Axios
            .put(baseURL + `/mic/room/name`, { ...obj }, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },
    setRoomPrivate: (obj) => {//设置房间上锁如何
        return Axios
            .put(baseURL + `/mic/room/private`, { ...obj }, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },
    sensitiveAdd: (obj) => {//添加屏蔽词
        return Axios
            .post(baseURL + `/mic/room/sensitive/add`, { ...obj }, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },
    sensitiveDelet: (obj) => {//删除屏蔽词
        return Axios
            .get(baseURL + `/mic/room/sensitive/del/${obj.id}`, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },
    getsensitiveList: (obj) => {//获取屏蔽词列表
        return Axios
            .get(baseURL + `/mic/room/sensitive/${obj.roomId}/list`, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },
    getFollowList: () => {
        return Axios
            .get(baseURL + `/user/follow/list`, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },

    getUserCheck: () => {//是否创建过房间
        return Axios
            .put(baseURL + `/mic/room/create/check`, {}, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },
    follow: (obj) => {
        return Axios
            .get(baseURL + `/user/follow/${obj.userId}`, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                }
            })
    },

    getTextCheck: (obj) => {//获取屏蔽词列表
        return Axios
            .post(baseURL + `/mic/audit/text/${obj.text}`, {}, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                },
            })
    },

    uploadfile: (obj) => {//上传文件
        console.log("上传：", obj);
        let data = new FormData();
        data.append("file", obj)
        
        // Axios.defaults.baseURL = ''
        return Axios
            .post(`/file/upload`, data, {
                headers: {
                    Authorization: store.state.userInfo.authorization,
                    BusinessToken: btoken,
                    'Content-Type': 'multipart/form-data'
                },
            })
    }

}