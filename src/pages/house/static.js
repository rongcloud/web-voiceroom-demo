//房主房间设置
export const RoomFitItemList = [
    {
        value: "房间上锁",
        // eslint-disable-next-line no-undef
        img: "url(" + require("../../assets/roomicon/LockRoon.png") + ")",
    },
    {
        value: "房间标题",
        // eslint-disable-next-line no-undef
        img: "url(" + require("../../assets/roomicon/RoomTitle.png") + ")",
    },
    {
        value: "房间公告",
        // eslint-disable-next-line no-undef
        img: "url(" + require("../../assets/roomicon/RoomNotice.png") + ")",
    },
    {
        value: "房间背景",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/BRoombackground.png") + ")",
    },
    {
        value: "自由上麦",
        // eslint-disable-next-line no-undef
        img: "url(" + require("../../assets/roomicon/BFreeWheat.png") + ")",
    },
    {
        value: "全麦锁麦",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/MuteAllSeat.png") + ")",
    },
    {
        value: "全麦锁座",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/lockAllSeat.png") + ")",
    },
    {
        value: "静音",
        // eslint-disable-next-line no-undef
        img: "url(" + require("../../assets/roomicon/MuteOne.png") + ")",
    },
    {
        value: "设置4个座位",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/BSetFourSeats.png") + ")",
    },
    {
        value: "屏蔽词",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/ShieldingWords.png") + ")",
    },
    // {
    //     value: "音乐",
    //     // eslint-disable-next-line no-undef
    //     img: "url(" + require("../../assets/roomicon/BMusic.png") + ")",
    // },
]

//退出，离开房间
export const BackList = [
    {
        value: "离开房间",
        // eslint-disable-next-line no-undef
        img: "url(" + require("../../assets/roomicon/LeaveRoom.png") + ")",
    },
    {
        value: "关闭房间",
        // eslint-disable-next-line no-undef
        img: "url(" + require("../../assets/roomicon/CloseRoom.png") + ")",
    },
]

//mute and inset click 
export const muteAndInset = [
    {
        value: "抱下麦",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/HoldDownWheat.png") + ")",
    },
    {
        value: "关闭座位",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/lockAllSeat.png") + ")",
    },
    {
        value: "取消禁麦",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/UnMuteAllSeat.png") + ")",
    },
    {
        value: "踢出房间",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/KickOutRoom.png") + ")",
    },
]


//unmute and inset click 
export const unmuteAndInset = [
    {
        value: "抱下麦",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/HoldDownWheat.png") + ")",
    },
    {
        value: "关闭座位",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/lockAllSeat.png") + ")",
    },
    {
        value: "座位禁麦",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/MuteAllSeat.png") + ")",
    },
    {
        value: "踢出房间",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/KickOutRoom.png") + ")",
    },
]

//unmute and inset click 
export const isAdminAndInset = [
    {
        value: "抱下麦",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/HoldDownWheat.png") + ")",
    },
    {
        value: "踢出房间",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/KickOutRoom.png") + ")",
    },
]


// 点击不在座位用户
export const outset = [
    {
        value: "邀请上麦",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/HoldUpWheat.png") + ")",
    },

    {
        value: "踢出房间",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/KickOutRoom.png") + ")",
    },
]

// 空座 锁麦 锁座
export const emptyMuteAndLock = [
    {
        value: "开启座位",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/UnlockAllSeat.png") + ")",
    },

    {
        value: "取消禁麦",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/UnMuteAllSeat.png") + ")",
    },
]

// 空座 锁麦 未锁座
export const emptyMuteAndUnlock = [
    {
        value: "关闭座位",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/lockAllSeat.png") + ")",
    },

    {
        value: "取消禁麦",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/UnMuteAllSeat.png") + ")",
    },
]

// 空座 未锁麦 锁座
export const emptyUnmuteAndLock = [
    {
        value: "开启座位",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/UnlockAllSeat.png") + ")",
    },

    {
        value: "座位禁麦",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/MuteAllSeat.png") + ")",
    },
]

// 空座 未锁麦 未锁座
export const emptyUnmuteAndUnlock = [
    {
        value: "关闭座位",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/lockAllSeat.png") + ")",
    },

    {
        value: "座位禁麦",
        img:
            // eslint-disable-next-line no-undef
            "url(" + require("../../assets/roomicon/MuteAllSeat.png") + ")",
    },
]



