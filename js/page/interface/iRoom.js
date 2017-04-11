/**
 * Created by Administrator on 2016/7/19. 
 */
function IRoom(){
    var um = new UserManager();
    this.cookie = um.cookie;
    this.ajaxData =um.ajaxData;
    this.method = um.gConfig.METHOD;
    this.gUrl = um.gConfig.AJAX_URL;
}
//房间初始化
IRoom.prototype.initRoom = function(gid, tid, roomId, callback){
    var param = {
        "globalId" : gid,
        "ticketId" : tid,
        "roomId" : roomId
    };
    this.ajaxData.request(this.method.P, this.gUrl.room.initRoom_url, param, function(data){
        callback(data);
    });
};
//消息断线重联
IRoom.prototype.getMsgConfig = function(callback){
    var param = {};
    this.ajaxData.request(this.method.P, this.gUrl.room.getMsgConfig_url, param, function(data){
        callback(data);
    });
};
//获取主播开播上行地址
IRoom.prototype.getAnchorUpUrl = function(roomGlobalId, gid, tid, callback){
    var param = {
    	"roomGlobalId" : roomGlobalId,
    	"globalId" : gid, 
    	"ticketId" : tid
    };
    this.ajaxData.request(this.method.P, this.gUrl.room.getAnchorUpUrl_url, param, function(data){
        callback(data);
    });
};
//获取老师视频上行地址
IRoom.prototype.getMcuUpUrl = function(roomGlobalId, gid, tid, callback){
    var param = {
    	"roomGlobalId" : roomGlobalId,
    	"globalId" : gid, 
    	"ticketId" : tid
    };
    this.ajaxData.request(this.method.P, this.gUrl.chessNew.getMcuUpUrl_url, param, function(data){
        callback(data);
    });
};

//离开房间
IRoom.prototype.leaveRoom = function(gid, roomId, tid, callback){
    var param = {
        "globalId" : gid,
        "roomId" : roomId,
        "ticketId" : tid
    };
    this.ajaxData.request(this.method.P, this.gUrl.room.leaveRoom_url, param, function(data){
        callback(data);
    });
};
//上传心跳
IRoom.prototype.updateHeartBeat = function(gid, roomGlobalId, callback){
    var param = {
        "globalId" : gid,
        "roomGlobalId" : roomGlobalId
    };
    this.ajaxData.request(this.method.P, this.gUrl.room.updateHeartBeat_url, param, function(data){
        callback(data);
    });
};
//获取观众与管理列表
IRoom.prototype.showAudienceAndManagerList = function(roomGlobalId, callback){
    var param = {"roomGlobalId":roomGlobalId};
    this.ajaxData.request(this.method.P, this.gUrl.room.showAudienceAndManagerList_url, param, function(data){
       callback(data);
    });
};
//获取学生列表
IRoom.prototype.showManagerList = function(roomGlobalId, callback){
    var param = {"roomGlobalId":roomGlobalId};
    this.ajaxData.request(this.method.P, this.gUrl.chessNew.showManagerList_url, param, function(data){
       callback(data);
    });
};
//老师端mp指令
IRoom.prototype.mpServiceInstruct= function(gid,roomId,tid,type,composeType,inputIndex,xDistance,yDistance,callback){
	var diffContent;
	switch(type){
		case 13://画中画切换显示画面
		diffContent='{"cmd":4,"body":{"outindex":0,"setval":[{"display":1,"index":0},{"display":0,"index":'+inputIndex+'}]}}';
		break;
		case 1://画中画切换显示画面
		diffContent='{"cmd":4,"body":{"outindex":0,"setval":[{"display":0,"index":0},{"display":1,"index":'+inputIndex+'}]}}';
		break;
		case 2://放大显示画面 
		diffContent='{"cmd":4,"body":{"outindex":1,"setval":[{"display":0,"index":'+inputIndex+'}]}}';
		break;
		case 3://切换合成模式
		diffContent='{"cmd":3,"body":{"outindex":1,"type":'+composeType+'}}';
		break;
		case 0://老师无画中画
		diffContent='{"cmd":3,"body":{"outindex":0,"type":'+composeType+'}}';
		break;
		case 4://学生列表切换显示画面
		diffContent='{"cmd":4,"body":{"outindex":0,"setval":[{"display":1,"index":0},{"display":0,"index":'+inputIndex+'}]}}';
		break;
		case 5://切换音频
		diffContent='{"cmd":5,"body":{"outindex":1,"index":'+inputIndex+'}}';
		break;
		case 6://设置画中画位置
		diffContent='{"cmd":6,"body":{"outindex":0,"x":'+xDistance+',"y":'+yDistance+'}}';
		break;
		case 7://关闭对应的输入流
		diffContent='{"cmd":7,"body":{"index":'+inputIndex+'}}';
		break;
		case 10://打开对应的输入流
		diffContent='{"cmd":2,"body":{"index":'+inputIndex+',"url"="rtmp://192.168.100.130:1935/live/123_1"}}';
		break;
		case 8://关闭输出流
		diffContent='{"cmd":8,"body":{"outindex":1}}';
		break;
		case 9://退出
		diffContent='{"cmd":9}';
		default:
		diffContent='';
	};
    var param = {
        "globalId" : gid,
        "roomId" : roomId,
        "ticketId" : tid,
        "toId":"mp",
        "content":diffContent
	};
    this.ajaxData.request(this.method.P, this.gUrl.chessNew.setMcuControlMsg, param, function(data){
       callback(data);
    });
};
//获取观众列表
IRoom.prototype.showAudienceList = function(roomGlobalId, callback){
    var param = {"roomGlobalId":roomGlobalId};
    this.ajaxData.request(this.method.P, this.gUrl.room.showAudienceList_url, param, function(data){
       callback(data);
    });
};
//获取管理列表
IRoom.prototype.showManagerList = function(roomGlobalId, callback){
    var param = {"roomGlobalId":roomGlobalId};
    this.ajaxData.request(this.method.P, this.gUrl.room.showManagerList_url, param, function(data){
       callback(data);
    });
};

//提升管理
IRoom.prototype.promoteOrFireManager = function(gid, tid, roomGlobalId, optOn, type, callback){
    var param = {
		"globalId" : gid,
		"ticketId" : tid,
		"roomGlobalId":roomGlobalId,
		"optOn" : optOn,//被操作人
		"type":type //1提升  2撤销
	};
    this.ajaxData.request(this.method.P, this.gUrl.room.promoteOrFireManager_url, param, function(data){
       callback(data);
    });
};
//踢出房间
IRoom.prototype.kickOutRoom = function(roomGlobalId, gid, optOn, tid, callback){
    var param = {
		"roomGlobalId":roomGlobalId,
		"globalId" : gid,
		"optOn" : optOn,//被操作人
		"ticketId" : tid
	};
    this.ajaxData.request(this.method.P, this.gUrl.room.kickOutRoom_url, param, function(data){
       callback(data);
    });
};

//获取房间礼物列表
IRoom.prototype.getGiftList = function(callback){
    this.ajaxData.request(this.method.P, this.gUrl.shop.productList_url, {}, function(data){
        callback(data);
    });
};
//在线购买课程
IRoom.prototype.buyLesson = function(orderId, sellerId, buyerId, lessonId, payWay, callback){
    var param = {
        "orderId" : orderId, //（可选）未完成的订单id，继续支付
        "sellerId" : sellerId, //课程所属人id
        "buyerId" : buyerId, //购买人id
        "lessonId" : lessonId, //课程id
        "payWay" : payWay //account：余额支付|unionPay:银联支付|alipay:支付宝支付|wechatPay:微信支付|tenpay:财付通支付
    };
    this.ajaxData.request(this.method.P, this.gUrl.accounting.buyLesson_url, param, function(data){
       callback(data);
    });
};
//房间送礼
IRoom.prototype.sendGift = function(gid, roomGlobalId, tid, optOn, giftName, productId, giftNum, callback){
    var param = {
        "globalId" : gid,
        "roomGlobalId" : roomGlobalId,
        "ticketId" : tid,
        "optOn" : optOn,
        "giftName" : giftName,
        "productId" :productId,
        "giftNum" : giftNum
    };
    this.ajaxData.request(this.method.P, this.gUrl.room.sendGift_url, param, function(data){
        callback(data);
    });
};

//发起拍卖
IRoom.prototype.createAuction = function(gid, tid, roomId, floorPrice, duration,imagesUrl, callback){
    var param = {
        "userId" : gid,
        "ticketId" : tid,
        "productName" : "",
        "roomId" : roomId,
        "floorPrice" : floorPrice,
        "duration" : duration,
        "image":imagesUrl
    };
    this.ajaxData.request(this.method.P, this.gUrl.integral.createAuction_url, param, function(data){
        callback(data);
    });
};

//获取正在进行中的拍卖信息
IRoom.prototype.getAuctionInfo = function(teacherId, callback){
    var param = {
        "userId" : teacherId
    };
    this.ajaxData.request(this.method.P, this.gUrl.integral.getAuctionInfo_url, param, function(data){
        callback(data);
    });
};

//获取拍卖竞价列表
IRoom.prototype.getOfferPriceList = function(auctionId, callback){
    var param = {
        "auctionId" : auctionId
    };
    this.ajaxData.request(this.method.P, this.gUrl.integral.getOfferPrice_url, param, function(data){
        callback(data);
    });
};

//结算拍卖接口
IRoom.prototype.finishAuction = function(auctionId, callback){
    var param = {
        "auctionId" : auctionId
    };
    this.ajaxData.request(this.method.P, this.gUrl.integral.finishAuction_url, param, function(data){
        callback(data);
    });
};

//拼手气红包
IRoom.prototype.sendRedPacketOfLucky = function(gid, tid, roomId, totalMoney, totalRed, msg, callback){
    var param = {
        "userId" : gid,
        "ticketId" : tid,
        "roomId" : roomId,
        "totalMoney" : totalMoney,
        "totalRed" : totalRed,
        "msg" : msg
    };
    this.ajaxData.request(this.method.P, this.gUrl.integral.sendRedPackets_url, param, function(data){
        callback(data);
    });
};

//抢红包
IRoom.prototype.grabRedPacket = function(gid, tid, redId, callback){
    var param = {
        "userId" : gid,
        "ticketId" : tid,
        "redId" : redId
    };
    this.ajaxData.request(this.method.P, this.gUrl.integral.receiveRedPackets_url, param, function(data){
        callback(data);
    });
};

//查看红包详情
IRoom.prototype.getReceivedRedList = function(redId, callback){
    var param = {
        "redId" : redId
    };
    this.ajaxData.request(this.method.P, this.gUrl.integral.getReceivedRedList_url, param, function(data){
        callback(data);
    });
};

//查看红包是否已经抢完
IRoom.prototype.getWaitReceiveRedList = function(gid, tid, roomId, callback){
    var param = {
        "userId" : gid,
        "ticketId" : tid,
        "roomId" : roomId
    };
    this.ajaxData.request(this.method.P, this.gUrl.integral.getWaitReceiveRedList_url, param, function(data){
        callback(data);
    });
};

//判断用户是否已经购买了课程
IRoom.prototype.checkUserCourse = function(courseId, gid, tid, callback){
    var param = {
    	"courseId" : courseId,
    	"globalId" : gid,
    	"ticketId" : tid
    };
    this.ajaxData.request(this.method.P, this.gUrl.shop.checkUserCourse_url, param, function(data){
        if(typeof callback != "undefined")
        {
            callback(data);
        }
    });
};

/**
 * 获取消息服务的发送ip
 */
IRoom.prototype.getMsgIpConfig = function(callback){
    this.ajaxData.request(this.method.P, CONFIG_URL.ROOM_URL.GET_MSG_IP_CONFIG_URL, "", function(data){
        if(typeof callback != "undefined")
        {
            callback(data);
        }
    });
};
/**
 * 错误收集系统接口
 */
IRoom.prototype.setErrorCollect = function(errortyep,errormsg,callback){
    var data = {"msgType":errortyep,"body":errormsg};
    this.ajaxData.request(this.method.P, CONFIG_URL.ERROR_SERVICE_URL.ERROR_COLLECT_URL, data, function(data){
        if(typeof callback != "undefined")
        {
            callback(data);
        }
    });
};
