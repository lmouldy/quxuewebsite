function IMsg(sucCB, failCB){
    this.callback = sucCB;
    this.exceptionFun = failCB;
    this.flashId = "dynamic"+Math.random();
    this.flashObject = null;
    this.sendSocketFlag = false;
    this.loadFlag = false;
}

/**
 * 初始化聊天flash
 * @param url: msg.swf 文件地址
 * @param conId : msg.swf 在html网页中的容器id
 *
 */
IMsg.prototype.initFlashMsg = function(url, conId){
    var flashVars = {width:1, height:1};
    var attributes = {
        id : this.flashId,
        name : this.flashId
    };
    var params = {
        menu : "false",
        wmode : "transparent"
    };
    swfobject.embedSWF(url, conId, 1, 1, "11.0.0", "../../swfobject/expressInstall.swf", flashVars, params, attributes, function(data){});
};

/**
 * 获取msg.swf对象
 */
IMsg.prototype.getFlashMsg = function(){
    if(null == this.flashObject || "undefined" == typeof this.flashObject){
        this.flashObject = swfobject.getObjectById(this.flashId);
    }
};

IMsg.prototype.getUtf8Length = function(str){
    var bytes = 0, len = str.length;
    for(var i=0; i<len; i++){
        var code = str.charCodeAt(i);
        //对第一个字节进行判断
        if(code < 0){
            continue;
        }else if(code <= 127){
            bytes += 1;
        }else if(code <= 2047){
            bytes += 2;
        }else if(code <= 65535){
            bytes += 3;
        }else if(code <= 1114111){
            bytes += 4;
        }
        return bytes;
    }
};

IMsg.prototype.getUtf8SubIndex = function(str, bytes){
    var idx = 0;
    var code = 0;
    while(bytes > 0){
        code = str.charCodeAt(idx);
        if(code < 0){
            continue;
        }else if(code <= 127){
            bytes -= 1;
        }else if(code <= 2047){
            bytes -= 2;
        }else if(code <= 65535){
            bytes -= 3;
        }else if(code <= 1114111){
            bytes -= 4;
        }
        idx++;
    }
    if(bytes == 0){
        return idx;
    }else{
        return -1;
    }
};
