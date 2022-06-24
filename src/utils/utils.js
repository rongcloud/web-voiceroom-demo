
import * as RecordRTC from "recordrtc"
import request from "../request/index";
import config from '../config'
//import { invokeSaveAsDialog } from "recordrtc"
function GetQueryString(name) {
    if (!window.location.href.split("?")[1]) {
        return;
    }
    var query = window.location.href.split("?")[1]
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == name) { return pair[1]; }
    }
    return
}

let recorder;
let stm;
let Recorder = {
    status: 0,
    start: function () {
        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(async function (stream) {
            recorder = RecordRTC(stream, {
                type: 'audio'
            });
            stm = stream;
            recorder.startRecording();
            recorder.statTime = new Date();
        });
    },
    cancel: function () {
        recorder.stopRecording(function () { });
        stm.getTracks().forEach(track => track.stop());
    },
    stop: function (user) {
        recorder.stopRecording(function () {
            let blob = recorder.getBlob();
            blob.lastModifiedDate = new Date();
            blob.name = "fileName";
            // eslint-disable-next-line no-undef
            var file = new File([blob], "rec.mp3", { type: "mp3", lastModified: Date.now() });

            request.uploadfile(file).then((res) => {
                if (res.data.code == 10000) {
                    console.log("上传成功地址：", config.picPath, res.data.data);
                    let content = {
                        _duration: Math.floor((blob.lastModifiedDate - recorder.statTime) / 1000 + 1) + "",
                        _path: config.picPath + res.data.data,
                        _userId: user.userId,
                        _userName: user.userName
                    }
                    user.im.messageUpdate("RC:VRVoiceMsg", content);
                    let voiceMsg;
                    voiceMsg =
                        "<span style='color:#7f7f7f' >" +
                        content._userName +
                        " </span>" +
                        `<span height: 22px;background: none;border-radius: 4px; border: 1px solid; color: #666; onclick="new Audio('` +
                        content._path +
                        `').play();">` +
                        content._duration +
                        "' " +
                        "<span  style='width:20px;height:20px;display:inline-block;margin-bottom:-5px;background-image: url(" +
                        // eslint-disable-next-line no-undef
                        require("../assets/live/icon-voice.png") +
                        ");  background-position: center;background-repeat: no-repeat;background-size:14px 14px'></span>" +
                        "</span>";


                    user.chatroom.push(voiceMsg);
                } else {
                    console.log("上传错误了", res);
                }
                stm.getTracks().forEach(track => track.stop());
            });
        });
    }
}

export {
    GetQueryString,
    Recorder,
}