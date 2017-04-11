 define(function(require, exports, module){
    require("util/common");
    require("page/interface/iRoom");
    require("page/interface/iUserCenter");
    require('swfobject/swfobject');
	require("page/interface/iMsg");
	require("util/DateFormateUtil");
	require("page/interface/iShare");
	require("util/classUtils");
	require("zeroclipboard-2.2.0/ZeroClipboard.min");

(function($){
	var um = new UserManager(),
		gcPlayType = um.gConfig.PLAY_TYPE,
		cookie = um.cookie,
		commonUtils = um.commonUtils,
		bLogin = um.checkLogin(),
		iRoom = new IRoom(),
		iUserCenter = new IUserCenter(),
		iMsg = new IMsg(),
		dateFormateUtil = new DateFormateUtil();

	var roomGlobalId = null,
		teacherId = null,
		oMsgRecieveIp = null,
		oMsgSendIp = null,
		oRtmp = null,
		oRoomInfo = null,
		oCurUserInfo = null,
		oTeacherInfo = null,
		oRoomViewerList = null,//用于保存房间观众数据
		_auctionTimer = null,//作品定价定时器
		_auctionListTimer = null; //竞拍列表定时器

	var loginAfterTo = "/index.html",
		sendMsgSocketFlag = false,
		recieveMsgSocketFlag = false,
		receiveMsgFlagCount = 0;

	var roomId = location.href.substring(location.href.lastIndexOf("/")+1);
	
	if(roomId == "14844"){
		$(".con-right .cost-box").html('<img src="../../../images/pm/14844.png" style="height:238px">');
	}

	$("#header").load("../header.html", function(){
        require("page/header");
        //初始化样式
        autoResize();
    });

    $(function(){
        //房间初始化
        initRoom();
		//实时通讯协议
		iMsg.initFlashMsg(gcPlayType.ROOM_MSG_SWF, "msgTransCon");
    });

    //房间初始化
    var initRoom = function(){
    	if(null == roomId || isNaN(roomId)){
    		window.location.href="index.html";
    	}else{
    		if(bLogin){
    			enterRoomInfo(cookie.get("globalId"), cookie.get("ticketId"), roomId);
    		}else{
    			enterRoomInfo("", "", roomId);
    		}
    	}
    };

    var enterRoomInfo = function(gid, tid, roomId){
    	iRoom.initRoom(gid, tid, roomId, function(data){
    		if(data.code == 0){
    			
    			oMsgRecieveIp = data.body.msgRecieveIp;
				oMsgSendIp = data.body.msgSendIp;
				oRtmp = data.body.rtmp;
    			oRoomInfo = data.body.room;
				oCurUserInfo = data.body.user;
				oTeacherInfo = data.body.zhubo;

				teacherId = oTeacherInfo.globalId;
				roomGlobalId = oRoomInfo.roomGlobalId;

				liveState = data.body.room.liveState||0;
				//测试调用，后期删除
				if(teacherId != oCurUserInfo.globalId){
					playVideo(data.body.rtmp.addr0);					
				}else{
					swfobject.removeSWF("qxPlayer");
				}
				var flashMsgTimer = setInterval(function(){
					iMsg.getFlashMsg();
					if(null != iMsg.flashObject && "undefined" != typeof iMsg.flashObject.createSubscribeSocket){
						clearInterval(flashMsgTimer);
						if(bLogin){
							iMsg.flashObject.createSubscribeSocket(oMsgRecieveIp.ip, oMsgRecieveIp.port, {name:oCurUserInfo.globalId, topic:roomId},
								"receiveSubscribeJSONArray", "receiveSubscribeError", gcPlayType.ROOM_MSG_SOCKET_TIME.SUBSCRIBE);
							iMsg.flashObject.sendMsgSocket(oMsgSendIp.ip, oMsgSendIp.port, null, "receiveSendMsgDate",
								"initReceiveSendMsgError", gcPlayType.ROOM_MSG_SOCKET_TIME.SEND);
						}else{
							iMsg.flashObject.createSubscribeSocket(oMsgRecieveIp.ip, oMsgRecieveIp.port, {topic:roomId},
								"receiveSubscribeJSONArray", "receiveSubscribeError", gcPlayType.ROOM_MSG_SOCKET_TIME.SUBSCRIBE);
						}
						$("#iMsgVersion").val(iMsg.flashObject.getMsgVersion());
					}
				}, 2000);

				//当前登录人为老师时
				if(cookie.get("globalId") == oTeacherInfo.globalId){
					//获取上行地址
					iRoom.getAnchorUpUrl(oRoomInfo.roomGlobalId, cookie.get("globalId"), cookie.get("ticketId"), function(data){
			    		if(data.code == 0){
			    			$("#playerPromtBox .p-con-url span").text(data.body + "/" + roomId);
			    			//以下是复制地址相关的代码设置
			    			var clip = new ZeroClipboard($('#copUrlBtn'));
			    		    $('#copUrlBtn').attr("data-clipboard-text", data.body + "/" + roomId);

			    			clip.on('ready', function(){
			    			    this.on('aftercopy', function(event){
			    			    	um.popupLayer.alert("复制成功！"+event.data["text/plain"] );

			    			    });
			    		    });

			    			$("#playerPromtBox").show();
			    			getPCDownloadUrl();
			    		}
			    	});

					//显示设置作品定位按钮
					$("#setPriceBtn").html('<a class="btn" href="javascript:void(0);"></a>');
				}else{

				}

				if(bLogin){
					$("#toPriPersonId").val("");
					$("#toPriPersonName").val("");
				}else{
					cookie.set("guestGlobalId", oCurUserInfo.globalId);
					cookie.set("guestUserId", oCurUserInfo.userId);
				}
				//房间信息初始化
				loadRoomInfo(oRoomInfo);
				//老师信息初始化
				loadTeacherInfo(oTeacherInfo);
				//欢迎自己
				welcomeMyself();
				//获取房间信息成功回调函数
				initRoomSuccessfulCall();
				//video-mask
				videoMask(liveState);

    		}else if(-3 == data.code){
				um.popupLayer.alert("房间人数已达上限");
				setTimeout(function(){
					window.location.href = loginAfterTo;
				}, 3000);
			}else if(-5 == data.code){
				openLoginRegistDialog('login.html');
				return;
			}else{
				commonUtils.check360browser5version();
				var msg = "初始化房间失败！";
				if (typeof data.msg != "undefined") {
					msg = data.msg;
				}
				um.popupLayer.alert(um.gConfig.tips[data.app]+msg);
				return;
			}

    	});
    };
    //房间信息初始化
    var loadRoomInfo = function(oRoom){
    	$(".teacher-info .t-detail .t-room-name").text(oRoom.roomTitle);
    };

	//老师信息初始化
    var loadTeacherInfo = function(oTeacher){
    	$(".teacher-info .t-avatar img").attr("src", oTeacher.userImageurl);
    	$(".teacher-info .t-detail .t-name").text(oTeacher.userNickname);
    	$(".teacher-info .t-detail .t-roomId").text("教室号："+roomId);
    	$(".teacher-info .t-detail .t-label").text(oTeacher.title);
    };

	//房间初始化成功后的操作
	var initRoomSuccessfulCall = function(){
		//房间延迟2秒加载的数据
		lazyInitRoom();
		//房间心跳
		roomHeartBeat();
		//加载礼物数据
		loadGiftList();
		//加载关注数量
		getFocusNum();
		//检验是否关注
		if(bLogin){
			checkIsFocus(teacherId);
		}
	};

	//房间延迟2秒加载的数据
	var lazyInitRoom = function(){
		setTimeout(function(){
			//获取作品定价信息
			getAuctionInfo();
			//判断房间是否有红包可抢
			checkRedPacket();
			//加载观众列表
			getViewerList();

			//加载老师课程信息
			loadCouseInfo(teacherId);

			//获取手机app二维码
			require.async('jquery.qrcode.min', function(){
				$('#appCodeBox .app-android p').qrcode({
					render: !+[1,] ? 'table' : 'canvas',
					width:130,
					height:130,
					correctLevel:0,
					text:um.gConfig.DOWNLOAD.DOWNLOAD_APP_URL
				}).append('<img src="../../images/default/down/logo.png">');
			});
		}, 2000);
	};


	var getFocusNum = function(){
		um.getFansCount(teacherId, function(data){
			if(data.code == 0){
				$(".t-focus span").text(data.body.count+Math.floor(Math.random()*10000));
			}
		});
	};

	//获取下载地址
	var getPCDownloadUrl = function(){
		um.ajaxData.request(um.gConfig.METHOD.P, um.gConfig.DOWNLOAD.GET_DOWNLOAD_IGO_URL, {}, function(data){
			if(data.code == 0){
				$("#downloadUrlLink").attr("href", data.body.version_path);
			}
		});
	};

	//初始化礼物列表
	var loadGiftList = function(){
		iRoom.getGiftList(function(data){
			var sHtml = "";
			if(data.code == 0){
				var obj = data.body;
				for(var i=0; i<obj.length; i++){
					sHtml += '<li id="'+obj[i].productId+'" data-price="'+obj[i].price+'" data-name="'+obj[i].productName+'">'
						+ '<img alt="'+obj[i].productName+'" src="'+obj[i].productImage+'" data-bigImg="'+obj[i].productEffectImg+'"></li>';
				}
			}
			$(".gift-box ul.gift-list").html(sHtml);
			$(".gift-box ul.gift-list").find("li:eq(0)").addClass("selected");
			$(".gift-box .gift-price span").text($(".gift-box ul.gift-list").find("li:eq(0)").attr("data-price"));
		});
	};

	//获取拍卖竞价列表
	var getOfferPriceList = function(auctionId){
		iRoom.getOfferPriceList(auctionId, function(data){
			var sHtml = "";
			if(data.code == 0){
				var obj = data.body;
				for(var i=0; i<obj.length; i++){
					sHtml += '<li data-gid="'+obj[i].userId+'">'+obj[i].userNickname+'：<span>'+obj[i].money+'</span>金币</li>';
				}
			}
			$(".cost-box .cost-list ul").html(sHtml);
		});
	};

	//设置作品定价倒计时
	var setAuctionTimer = function(auctionSetTime, auctionId){
		//启动作品定价计时器，以秒为单位
		_auctionTimer = setInterval(function(){
			if(auctionSetTime >= 0){
				var hours = Math.floor(auctionSetTime / 3600);
	            var minutes = Math.floor(auctionSetTime / 60);
	            var seconds = Math.floor(auctionSetTime % 60);

	            hours = hours < 10 ? '0'+hours : hours;
	            minutes = minutes < 10 ? '0'+minutes : minutes;
	            seconds = seconds < 10 ? '0'+seconds : seconds;

	            var sHtml = hours + " : " + minutes + " : " + seconds;
	            $("#priceShowBox .price-timer").text(sHtml);
	            --auctionSetTime;
			}else{
				clearInterval(_auctionTimer);
				_auctionTimer = null;
				clearInterval(_auctionListTimer);
				_auctionListTimer = null;
				$("#priceShowBox .price-timer").text("00 : 00 : 00  竞拍结束");
				getOfferPriceList($("#priceShowBox").attr("data-aid"));
			}
		}, 1000);

		_auctionListTimer = setInterval(function(){
			getOfferPriceList(auctionId);
		}, 2*60*1000);
	};

	//获取作品定价信息
	var getAuctionInfo = function(){
		//清除作品定价定时器
		clearInterval(_auctionTimer);
		_auctionTimer = null;
		clearInterval(_auctionListTimer);
		_auctionListTimer = null;
		iRoom.getAuctionInfo(teacherId, function(data){
			if(data.code == 0){
				$("#priceShowBox .last-price").text(data.body.floorPrice);
				setAuctionTimer(data.body.leftTime, data.body.auctionId);
				if(data.body.image){
					var sHtml='';
					var picArr = data.body.image.split(",");
					
					for(var i=0; i<picArr.length; i++){
						sHtml += '<a class="live-pic-item" href="javascript:void(0);"><img src="'+picArr[i]+'"></a>'
					}
					$("#priceShowBox .live-pic-show").html(sHtml);
					
					$("#priceShowBox .live-pic-show").delegate(".live-pic-item", "click", function(){
						var picSrc = $(this).find("img").attr("src");
						layer.open({
						  type: 1,
						  title: false,
						  closeBtn: 2,
						  maxWidth:'520px',
						  skin: 'layui-layer-nobg', //没有背景色
						  shade:0,
						  content: '<img src="'+picSrc+'">',
						  cancel: function(index){
							  $(document).find(".layui-layer").remove();
						  }
						});
					});
				}else{
					$("#priceShowBox .live-pic-show").html("暂无图片");
				}
    			$("#priceShowBox").attr("data-aid", data.body.auctionId).show().siblings().hide();
    			getOfferPriceList(data.body.auctionId);
			}
		});
	};



	//判断房间是否有红包可抢
	var checkRedPacket = function(){
		if(bLogin){
			iRoom.getWaitReceiveRedList(cookie.get("globalId"), cookie.get("ticketId"), roomId, function(data){
				if(data.code == 0){
					var sHtml = "";
					var obj = data.body;
					for(var i=0; i<obj.length; i++){
						sHtml += '<div id="rps_'+obj[i].redId+'" class="red-packet-show" data-obj='+JSON.stringify(obj[i])+'>'
							+ '<a href="javascript:void(0);"><span>'+obj[i].msg+'<br>领取红包</span></a></div>';
					}
					$("#redPacketShow").html(sHtml).fadeIn();
				}
			});
		}
	};

	/**
	 * 房间宽度自适应
	 *
	 */
    var autoResize = function(){
    	var wHeight = document.body.clientHeight;
    	var oPubMsgBox = $(".con-right .public-msg-box"),
    		hCostBox = $(".con-right .cost-box").height(),
    		hPriMsgBox = $(".con-right .private-msg-box").height(),
    		hMsgHandler = $(".con-right .msg-handle-box").height();
    	//计算聊天区的高度
    	var h = wHeight - $("#header").height() - hCostBox - hPriMsgBox - hMsgHandler - 10;
    	oPubMsgBox.height(h);

    	   /************************* 控制条操作 start ******************************************/
    	var oPubMsgBox = $(".con-right .public-msg-box")[0],
    		oPriMsgBox = $(".con-right .private-msg-box")[0],
    		oBar = $("#chatSlideBar")[0],
    		oBarBtn = $("#chatSlideBar i")[0];

    	var minT = 144,
    		maxT = $("#chatMsgBox").height() - 72;

    	oBarBtn.onmousedown = function(event){
    		var e = event || window.event;
    		var disY = e.clientY;
    		oBar.top = oBar.offsetTop;
    		//初始高度
    		var pubMsgBoxH = $(".con-right .public-msg-box").height(),
    			priMsgBoxH = $(".con-right .private-msg-box").height();
    		document.onmousemove = function(event){
    			var e = event || window.event;
    			var iT = oBar.top + e.clientY - disY;
    			oBar.style.margin = 0;
    			iT<= minT && (iT = minT);
    			iT >= maxT && (iT = maxT);
    			var t = iT - oBar.top;

    			//设置控制条的位置
    		    oBar.style.top = iT + "px";
    		    //设置两个区域的高度
    		    //私聊消息显示的区域高度
    		    oPubMsgBox.style.height = pubMsgBoxH + t + "px";
    		    oPriMsgBox.style.height = priMsgBoxH - t + "px";

    		    return false;
    		};
    		document.onmouseup = function() {
    		    document.onmousemove = null;
    		    document.onmouseup = null;
    		    oBar.releaseCapture && oBar.releaseCapture();
    		};
    		oBar.setCapture && oBar.setCapture();
    		return false;
    	};
    	/************************* 控制条操作 end **********************************************/
    };



 	/*********************** 直播间内的操作 begin ***********************/

    //直播信息框操作
    //查看直播教程
    $("#playerPromtBox .show-helptext-link").click(function(){
    	$("#liveHelptextBox").show();
    });
    //关闭信息提示框
    $("#playerPromtBox .close-btn").click(function(){
    	$("#playerPromtBox").hide();
    });
    //关闭直播教程弹框
    $("#liveHelptextBox .close-btn").click(function(){
    	$("#liveHelptextBox").hide();
    });

    //app
    $(".con-left .t-app-btn").hover(function(){
    	var _top = $(this).offset().top + 27;
    	$("#appCodeBox").css({"top":_top}).show();
    }, function(){
    	$("#appCodeBox").hide();
    });

    //分享
    $("#shareBox a").click(function(){
    	var dataRel = $(this).attr("data-rel"),
    		sTips =  '趣学:'+oRoomInfo.roomTitle,
    		shareImage = um.gConfig.DEFAULT.DEFAULT_SHARE_LOGO_IMG == ""?oRoomInfo.roomImage:um.gConfig.DEFAULT.DEFAULT_SHARE_LOGO_IMG;
    		shareUrl = window.location.href;
    	

    	switch(dataRel){
    		case 'wb': //微博分享
    			var iShare = new IShare({"title":sTips, "pic":um.gConfig.DEFAULT.DEFAULT_SHARE_LOGO_IMG, "url":shareUrl});
    			iShare.shareWeibo();
    			break;
    		case 'qq': //QQ分享
    			var si = "书法报视频在线教育平台" ;
    			var iShare = new IShare({
    				"url":shareUrl,
    				"pics":shareImage,
    				"site":si,
    				"title":sTips,
    				"summary":"书法报视频-中国书法报视频门户网站"
    				});

    			iShare.shareQQ();
    			break;
    		case 'zone': //QQ空间分享
    			var si = "书法报视频在线教育平台" ;
    			var iShare = new IShare({
    				"url":shareUrl,
    				"desc":sTips,
    				"title":sTips,
    				"summary":"书法报视频-中国书法报视频门户网站",
    				"pics":shareImage
    				});
    			iShare.shareQZone();
    			break;
    	}
    });


    function shareToWechat(){
    	var sTips =  oTeacherInfo.userNickname;
		var sPic  =  window.location.href;
		var url = window.location.href;
		var iShare = new IShare({"title":sTips,"pic":sPic,"url":url});

		var codeImgUrl  = iShare.shareWeixin(url);
		$("#shareBox img").attr("src", codeImgUrl);
		$("#shareBox").attr("data-flag", true);
    }

    //分享
    $(".con-left .t-share-btn, #shareBox").hover(function(){
    	if(!$("#shareBox").attr("data-flag")){
    		shareToWechat();
    	}
    	if($("#shareBox")[0].t){
    		clearTimeout($("#shareBox")[0].t);
    	}
    	var _top = $(".con-left .t-share-btn").offset().top + 27;
    	$("#shareBox").css({"top":_top}).show();
    }, function(){
    	if($("#shareBox")[0].t){
    		clearTimeout($("#shareBox")[0].t);
    	}
    	$("#shareBox")[0].t = setTimeout(function(){
    		$("#shareBox").hide();
    	}, 100);

    });


    //选择礼物
    $(".gift-box ul.gift-list").delegate("li", "click", function(){
    	$(this).addClass("selected").siblings().removeClass("selected");
    	var price = $(this).attr("data-price");
    	$(".gift-box .gift-price span").text(price);
    });

    //选择数量
    $(".gift-box .g-selector a").click(function(){
    	$("#giftNumSelector").fadeToggle();
    });

	$("#giftNumSelector li").click(function(){
		var giftObj = $(".gift-box ul.gift-list").find("li.selected");
		var num = $(this).attr("data-num");
		var price = parseInt(giftObj.attr("data-price"));
		$(".gift-box .g-selector input[type=text]").val(num);
		$(".gift-box .gift-price span").text(price *  num);
		$("#giftNumSelector").fadeOut();
	});

	$(".gift-list").delegate("li", "mouseover", function(){

		$("#giftDescBox .pic img").attr("src", $(this).find("img").attr("data-bigimg"));
		$("#giftDescBox .info .gift-name").text($(this).attr("data-name"));
		$("#giftDescBox .info .gift-desc span").text($(this).attr("data-price"));
		var _top = $(this).offset().top - $("#giftDescBox").height()-5,
			_left = $(this).offset().left - $("#giftDescBox").width()/2;
		$("#giftDescBox").css({"top": _top, "left": _left}).show();

	}).delegate("li", "mouseout", function(){
		$("#giftDescBox").hide();
	});


	$(".gift-box .g-selector input[type=text]").keyup(function(){
		var reg = /^[1-9]\d*$/;
		if(reg.test($(this).val())){
			var giftObj = $(".gift-box ul.gift-list").find("li.selected");
			var price = parseInt(giftObj.attr("data-price"));
			$(".gift-box .gift-price span").text(price *  $(this).val());
		}else{
			var oldVal = $(this).val();
			$(this).val(oldVal.substring(0,oldVal.length-1));
		}

	});

    //送礼
    $(".gift-handle .g-send-btn").click(function(){
		if(!bLogin){
			openLoginRegistDialog('login.html');
			return;
		}
    	var giftObj = $(".gift-box ul.gift-list").find("li.selected");
    	var optOn = teacherId,
    	giftName = giftObj.find("img").attr("alt"),
    	giftCode = giftObj.attr("id"),
    	giftNum = $(".gift-box .g-selector input[type=text]").val();
    	iRoom.sendGift(cookie.get("globalId"), oRoomInfo.roomGlobalId, cookie.get("ticketId"), optOn, giftName, giftCode, giftNum, function(data){
    		if(data.code == 0){
    			um.popupLayer.msg("赠送成功！");
    		}else{
    			um.popupLayer.alert(data.msg);
    		}
    	});
    });

    //判断是否关注该课程
   var checkIsFocus = function(teacherId){
	   um.isFocus(teacherId, function(data){
		  if(data.code == -1){
			  $(".teacher-info .t-focus a").addClass("remove-focus");
		  }
	   });
   };

    //关注与取消关注
    $(".teacher-info .t-focus a").click(function(){
		if(!bLogin){
			openLoginRegistDialog('login.html');
			return;
		}
    	if($(this).hasClass("remove-focus")){
    		//取消关注
    		um.popupLayer.confirm("您确定要取消对该课程的关注吗？",
    			{btn:['确定', '取消']},
    			function(index){
    				um.cancelFocus(oTeacherInfo.globalId, function(data){
    	    			if(data.code == 0){
    	    				um.popupLayer.msg("操作成功！");
    	    				$(".teacher-info .t-focus a").removeClass("remove-focus");
    	    				$(".teacher-info .t-focus span").text(parseInt($(".teacher-info .t-focus span").text()) -1 );
    	    			}else{
    	    				um.popupLayer.alert("操作失败！");
    	    			}
    	    		});
    				layer.close(index);
    			},
    			function(){
    				return ;
    			}
    		);
    	}else{
    		um.setFocus(oTeacherInfo.globalId, function(data){
    			if(data.code == 0){
    				um.popupLayer.msg("操作成功！");
    				$(".teacher-info .t-focus a").addClass("remove-focus");
    				$(".teacher-info .t-focus span").text(parseInt($(".teacher-info .t-focus span").text()) + 1 );
    			}else{
    				um.popupLayer.alert("操作失败！");
    			}
    		});
    	}
    });


    //充值
    $(".gift-handle .g-pay-btn").click(function(){
    	if(!bLogin){
    		openLoginRegistDialog("login.html");
			return;
    	}
    	$(this).attr("href", "/usercenter.html#pay");
    });


    //作品定价
    $("#setPriceBtn").delegate("a", "click", function(){
		if(bLogin){
			if(cookie.get("globalId") == oTeacherInfo.globalId){
				var sHtml = '<li><label>消费定价：</label><input type="text" name="price-num"/>金币&nbsp;即可获取本场教学作品</li>'
						+ '<li><div class="fl"><label>竞拍时长：</label>'
						+ '<select id="setPriceTimer"><option value="30">30分钟</option><option class="60">1小时</option></select></div>'
						+ '</li>'
						+ '<li><div class="fl live-pic-show"><a id="uploadWorksPic" href="javascript:void(0);"></a></div>'
						+ '<div class="fl">'
						+ '<a class="submit-btn" href="javascript:void(0);">确定</a>'
						+ '<a class="cancel-btn" href="javascript:void(0);">取消</a></div>'
						+ '<p class="live-pic-tips">最多可添加三张作品图片</p>'
						+ '</li>';
				$("#setPriceBox").html(sHtml).show().siblings().hide();
				
				require.async("uploadify/jquery.uploadify.min", function(){
					//上传图片
					$("#uploadWorksPic").uploadify({
						"swf"      : "../../js/uploadify/uploadify.swf",
						"uploader" : um.gConfig.UPLOAD.AVA,
						"buttonImage":"../../images/default/room/room_upload_btn.png",
						"height":48,
						"width":48,
						"removeTimeout":3,
						"multi":false,
						"fileTypeExts":"*.jpg;*.png;*.gif;*.bmp",
						"fileSizeLimit":"1GB",
						"uploadLimit ":1,
						"queueSizeLimit":1,
						"fileObjName": "file",
						"onInit": function () {                        
							$("#uploadWorksPic-queue").hide();
					    },
						"onUploadSuccess":function(file,data,response){
							$("#uploadWorksPic-queue").hide();
							data = $.evalJSON(data);
							var imgUrl = um.gConfig.UPLOAD.url + data.body.url;
							var sHtml = '<a class="live-pic-item" href="javascript:void(0);"><i class="remove-btn"></i><img src="'+imgUrl+'"></a>';
							$("#setPriceBox .live-pic-show").prepend(sHtml);
							var picLens = $("#setPriceBox .live-pic-show").find(".live-pic-item").length;
							if(picLens >= 3){
								$("#uploadWorksPic").hide();
							}else{
								$("#uploadWorksPic").show();
							}
							
							$("#setPriceBox").delegate(".live-pic-show .live-pic-item", "click", function(){
								var picSrc = $(this).find("img").attr("src");
								layer.open({
								  type: 1,
								  title: false,
								  closeBtn: 2,
								  maxWidth:'520px',
								  skin: 'layui-layer-nobg', //没有背景色
								  shade:0,
								  content: '<img src="'+picSrc+'">',
								  cancel: function(index){
									  $(document).find(".layui-layer").remove();
								  }
								});
							}).delegate(".live-pic-show .live-pic-item .remove-btn", "click", function(event){
								$(this).parent().remove();
								var picLens = $("#setPriceBox .live-pic-show").find(".live-pic-item").length;
								if(picLens >= 3){
									$("#uploadWorksPic").hide();
								}else{
									$("#uploadWorksPic").show();
								}
								event.stopPropagation();
							});
					    },
						"onUploadError":function(){
							um.popupLayer.alert("系统繁忙，请稍后再试");
						},
						"onFallback":function(){
							alert("请安装flash插件");
					        window.location.href="http://get.adobe.com/cn/flashplayer/otherversions/";
					    }
					});
				});
				
				
				
			}else{
				um.popupLayer.alert("抱歉，您没有设置定价的权限！");
				return ;
			}
		}else{
			openLoginRegistDialog("login.html");
			return;
		}
    });


    $("#setPriceBox input[name=price-num]").blur(function(){
    	var reg = /^[1-9]\d*$/, priceNum = $(this).val();
    	if(!reg.test(priceNum)){
    		$(this).val("");
    		um.popupLayer.alert("消费定价请输入整数！");
    		return ;
    	}
    });

    $("#setPriceBox").delegate('li .submit-btn', 'click', function(){
    	
    	var floorPrice = $("#setPriceBox input[name=price-num]").val();
    	if(floorPrice == ""){
    		um.popupLayer.alert("请输入消费定价！");
    		return ;
    	}
    	var duration = $("#setPriceTimer").val();
    	//作品图片地址
    	var pics = "";
    	$("#setPriceBox .live-pic-show").find(".live-pic-item").each(function(index, item){
    		pics += $(item).find("img").attr("src")+",";
    	});
    	pics = pics.substring(0, pics.length-1);
    	iRoom.createAuction(cookie.get("globalId"), cookie.get("ticketId"), roomId, floorPrice, duration, pics, function(data){
    		if(data.code == 0){
    			$("#priceShowBox .last-price").text(data.body.floorPrice);
				setAuctionTimer(data.body.leftTime, data.body.auctionId);
				if(data.body.image){
					var sHtml='';
					var picArr = data.body.image.split(",");
					
					for(var i=0; i<picArr.length; i++){
						sHtml += '<a class="live-pic-item" href="javascript:void(0);"><img src="'+picArr[i]+'"></a>'
					}
					$("#priceShowBox .live-pic-show").html(sHtml);
					
					$("#priceShowBox .live-pic-show").delegate(".live-pic-item", "click", function(){
						var picSrc = $(this).find("img").attr("src");
						layer.open({
						  type: 1,
						  title: false,
						  closeBtn: 2,
						  maxWidth:'520px',
						  skin: 'layui-layer-nobg', //没有背景色
						  shade:0,
						  content: '<img src="'+picSrc+'">',
						  cancel: function(index){
							  $(document).find(".layui-layer").remove();
						  }
						});
					});
				}else{
					$("#priceShowBox .live-pic-show").html("暂无图片");
				}
    			$("#priceShowBox").attr("data-aid", data.body.auctionId).show().siblings().hide();
    			$(".cost-box .cost-list ul").html("");
    		}else{
    			um.popupLayer.alert(data.msg);
    		}
    	});

    }).delegate(".cancel-btn", 'click', function(){
    	$("#setPriceBtn").show().siblings().hide();
    });


    //表情
    $(".msg-handle-box .face-btn").click(function(){
    	var faceHtml = commonUtils.loadFaceList();
    	$("#faceBox").html(faceHtml);
    	var left = $(this).offset().left - $("#faceBox").width()/2,
    		top = $(this).offset().top - $("#faceBox").height() -20;
        $("#faceBox").css({"left":left, "top": top}).show();
    });

    //选择表情
    $("#faceBox").delegate("table>tbody>tr>td", "click", function(){
    	var con = $(this).children("img").attr("alt");
    		//faceUrl = $(this).children("img").attr("src");
    	//um.popupLayer.alert(con+", "+faceUrl);
    	var msgText = $("#msgInput").val() + con;
    	$("#msgInput").val(msgText);
    	$("#faceBox").hide();
    });

    //清屏
    $(".msg-handle-box .clear-btn").click(function(){
    	$(".public-msg-box ul, .private-msg-box ul").empty();

    });

    /********** 红包 begin ***********/
	//发红包
	$("#redPacketBtn").click(function(){
		if(!bLogin){
			openLoginRegistDialog("login.html");
			return;
		}
		$("#redPacketBox").fadeIn();
		$(".lucky-mod input[name=redCount]").focus();
		$("#redPacketBox .lucky-mod").show().siblings().hide();
	});

	$("#redPacketBox .close-btn").click(function(){
		$("#redPacketBox").fadeOut();
	});


	$(".lucky-mod input[name=redNum]").blur(function(){
		var reg = /^[1-9]\d*$/;
		if(reg.test($(this).val())){
			$(".lucky-mod .red-total").text("￥"+$(this).val());
		}

	});

	//拼手气红包
	$("#redPacketBox .lucky-mod .give-redpacket").click(function(){
		var redCount = $(".lucky-mod input[name=redCount]").val(),
			redNum = $(".lucky-mod input[name=redNum]").val(),
			redMsg = $(".lucky-mod input[name=redMsg]").val();
		var reg = /^[1-9]\d*$/;
		if(!reg.test(redCount)){
			$(".lucky-mod input[name=redCount]").val("");
			um.popupLayer.alert('红包个数请输入整数!');
			return ;
		}
		if(!reg.test(redNum)){
			$(".lucky-mod input[name=redNum]").val("");
			um.popupLayer.alert('红包金额请输入整数!');
			return ;
		}else if(parseInt(redNum) < parseInt(redCount)){
			$(".lucky-mod input[name=redNum]").val("");
			um.popupLayer.alert("红包金额要大于红包个数!");
			return ;
		}else{
			$(".lucky-mod .red-total").text("￥"+$(this).val());
		}
		if(redCount == ""){
			um.popupLayer.alert("请输入红包个数!");
			return ;
		}
		if(redNum == ""){
			um.popupLayer.alert("请输入红包总金额!");
			return ;
		}
		if(redMsg == ""){
			redMsg = "恭喜发财，大吉大利";
		}
		redMsg = commonUtils.replaceHtmlCommon(redMsg);
		iRoom.sendRedPacketOfLucky(cookie.get("globalId"), cookie.get("ticketId"), roomId, redNum, redCount, redMsg,  function(data){
			if(data.code == 0){
				var sHtml = '<div id="rps_'+data.body.redId+'" class="red-packet-show" data-obj=\''+JSON.stringify(data.body)+'\'>'
				+ '<a class="ellipsis" href="javascript:void(0);"><span>'+data.body.msg+'<br>领取红包</span></a></div>';
				$("#redPacketShow").append(sHtml);
				$("#redPacketBox").fadeOut();
				$("#redPacketShow").fadeIn();
			}else{
				um.popupLayer.alert(data.msg);
			}
		});
	});

	//抢红包
	$("#redPacketShow").delegate(".red-packet-show a", "click", function(data){
		var showId = $(this).parent().attr("id"), dataObj = JSON.parse($(this).parent().attr("data-obj"));
		if(bLogin){
			$("#"+showId).fadeOut();
			$("#redPacketBox").attr("data-redId", dataObj.redId);
			$("#redPacketBox .grab-mod .red-hoster img").attr("src", dataObj.userImageurl);
			$("#redPacketBox .grab-mod .red-hoster p").text(dataObj.userNickName);
			$("#redPacketBox .grab-mod .red-detail .red-nick").text(dataObj.userNickName);
			$("#redPacketBox .grab-mod .red-detail .red-msg").text(dataObj.msg);
			$("#redPacketBox .result-mod .result-desc .red-msg").text(dataObj.msg);
			$("#redPacketBox .grab-mod").show().siblings().hide();
			$("#redPacketBox").fadeIn();
		}else{
			openLoginRegistDialog("login.html");
		}

	});

	//抢红包
	$("#redPacketBox .grab-mod .red-packet").click(function(){
		var redId = $("#redPacketBox").attr("data-redId");
		iRoom.grabRedPacket(cookie.get("globalId"), cookie.get("ticketId"), redId, function(data){
			if(data.code == 0){
				showReceivedRedList(data.body.redId);
				$("#redPacketBox .result-mod .result-desc .result-total").text(data.body.receivedMoney);
				$("#redPacketBox .result-mod").show().siblings().hide();
			}else{
				um.popupLayer.alert(data.msg);
			}
		});
	});

	var showReceivedRedList = function(redId){
		iRoom.getReceivedRedList(redId, function(data){

			if(data.code == 0){
				$("#redPacketBox .result-mod .red-hoster img").attr("src", data.body.redUserImageurl);
				$("#redPacketBox .result-mod .red-hoster p").text(data.body.redUserNickname);
				var sHtml = '<dt>'+data.body.totalRed + '个红包，共'+data.body.totalMoney+'金币</dt>';
				var obj = data.body.array;
				for(var i=0; i<obj.length; i++){
					sHtml += '<dd><div class="fl result-dd-pic"><img src="'+obj[i].userImageurl+'"></div>'
						+ '<div class="fl result-dd-user"><p>'+obj[i].userNickName+'</p></div>'
						+ '<div class="fr result-dd-coin">'+obj[i].money+'金币</div></dd>';
				}
				$("#redPacketBox .result-mod .result-list dl").html(sHtml);

			}else{
				um.popupLayer.alert(data.msg);
			}
			$("#redPacketBox .result-mod").show().siblings().hide();
		});
	};

	//查看红包详情
	$("#redPacketBox .grab-mod .red-list-link").click(function(){
		var redId = $("#redPacketBox").attr("data-redId");
		showReceivedRedList(redId);

	});
	/*********红包 end *************/

	/*********************** 直播间内的操作 end ***********************/

    /*********************** 课程介绍相关内容 begin ****************************/
	var loadWareByCourseId = function(courseId){
		iUserCenter.getCoursewareInfoList(courseId, function(data){
			if(data.code == 0){
				var obj = data.body;
				$(".ci-course .course-desc .course-num span").text(obj.length);
				var sHtml = "<dt>课程目录</dt>";
				for(var i=0; i<obj.length; i++){
					if(obj[i].saleType == 0){
						sHtml += '<dd><a target="_blank" href="/room/offlineVideo.html?tid='+obj[i].userGid+'&cid='+obj[i].courseId+'&id='+obj[i].id+'&roomId='+roomId+'">'+obj[i].name+'</a><span class="free">免费</span></dd>';
					}else{
						sHtml += '<dd><a target="_blank" href="/room/offlineVideo.html?tid='+obj[i].userGid+'&cid='+obj[i].courseId+'&id='+obj[i].id+'&roomId='+roomId+'">'+obj[i].name+'<a></dd>';
					}
				}
				$(".ci-course .course-list").html(sHtml).show();
			}
		});
	};
	//判断用户是否购买了课程
	var checkBuyLesson = function(courseId){
		iRoom.checkUserCourse(courseId, cookie.get("globalId"), cookie.get("ticketId"), function(data){
			if(data.code == 0){
				$(".ci-course .course-buy-btn").attr("data-flag", true);
			}else{
				$(".ci-course .course-buy-btn").attr("data-flag", false);
			}
		});
	};

	var loadCouseInfo = function(teacherId){
		iUserCenter.getCourseInfoByTeacherId(teacherId, function(data){
			var sHtml = "";
			if(data.code  == 0){
				$(".teacher-info .t-detail .t-course-name").text(data.body.courseTitle);
				var price = data.body.price > 0 ? data.body.price : "免费";
				var validTime = parseInt(data.body.vaildTime / 30);
				var time = validTime % 12 == 0 ? (validTime/12)+"年" : validTime+"个月";
				var btnLink = "../purchase.html?tid="+teacherId+"&cid="+data.body.courseId;
				sHtml += '<div class="fl course-poster"><img src="'+data.body.courseImg+'"></div>'
					+ '<dl class="fl course-desc">'
					+ '<dt>'+data.body.courseTitle+'</dt>';

				sHtml += '<dd><p class="price"><label>价格：</label><span>'+price+'</span></p>'
					+ '<p class="valid-time"><label>有效期：</label><span>'+time+'</span></p></dd>'
					+ '<dd><p class="course-num"><label>课时：</label><span>0</span></p>'
                    + '<p class="buy-count"><label>累计购买：</label><span>'+data.body.buyCount+'</span></p></dd>';
                    + '</dl>'
                    + '<a class="fl course-buy-btn" target="_blank" href="javaScript:void(0);" data-cid="'+data.body.courseId+'" data-href="'+btnLink+'"></a>';
				checkBuyLesson(data.body.courseId);
				loadWareByCourseId(data.body.courseId);
			}else{
				sHtml = '<p class="empty">暂无课程</p>';
			}
			$(".ci-course .course-info").html(sHtml);
		});
	};

	$(".ci-course").delegate(".course-buy-btn", "click", function(){
		if(bLogin){
			var linkUrl = $(this).attr("data-href");
			if($(this).attr("data-flag") == "true"){
				$(".ci-course .course-buy-btn").attr("href", linkUrl);
			}else{
				um.popupLayer.alert("您已经购买了此课程了！");
				return false;
			}
			
		}else{
			openLoginRegistDialog("login.html");
			return false;
		}
	});

    function loadCoCurUserInfo(type){
    	var sHtml = "";
    	switch(type){
	    	case 'ci-course':
	    		//获取老师的课程
	    		loadCouseInfo(teacherId);
	    		break;
	    	case 'ci-teacher':
	    		iUserCenter.getTeacherInfo(teacherId, function(data){
	    			if(data.code == 0){
	    				sHtml += '<div class="teacher-pic"><img src="'+data.body.userImg+'"></div>'
	    					+ '<div class="teacher-desc">'+commonUtils.HTMLDecodeHandler(data.body.content)+'</div>';
	    			}else{
	    				sHtml = '<p class="empty">暂无名师介绍内容</p>';
	    			}
	    			$(".ci-teacher").html(sHtml);
	    		});
	    		break;
	    	case 'ci-activity':
	    		iUserCenter.getArtActivityList(teacherId, function(data){
	    			if(data.code == 0){
	    				var obj = data.body;
	    				if(obj.length > 0){
	    					for(var i=0; i<obj.length; i++){
		    					sHtml += '<li>'
			    					+ '<p class="title">'+obj[i].title+'</p>'
			    					+ '<div class="desc">'+commonUtils.HTMLDecodeHandler(obj[i].content)+'</div>'
			    					+ '<a class="detail-link" target="_blank" href="/room/detail.html?type=activity&id='+obj[i].id+'&tid='+obj[i].userGid+'">详情&gt;</a></li>';
		    				}
	    				}else{
	    					sHtml = '<p class="empty">暂无艺术活动</p>';
	    				}
	    			}else{
	    				sHtml = '<p class="empty">暂无艺术活动</p>';
	    			}
	    			$(".ci-activity ul").html(sHtml);
	    		});
	    		break;
	    	case 'ci-study':
	    		iUserCenter.getStudyList(teacherId, function(data){
	    			if(data.code == 0){
	    				var obj = data.body;
	    				if(obj.length > 0){
	    					for(var i=0; i<obj.length; i++){
		    					sHtml += '<li>'
			    					+ '<p class="title">'+obj[i].title+'</p>'
			    					+ '<div class="desc">'+commonUtils.HTMLDecodeHandler(obj[i].content)+'</div>'
			    					+ '<a class="detail-link" target="_blank" href="/room/detail.html?type=study&id='+obj[i].id+'&tid='+obj[i].userGid+'">详情&gt;</a></li>';
		    				}
	    				}else{
	    					sHtml = '<p class="empty">暂无学术研究</p>';
	    				}
	    			}else{
	    				sHtml = '<p class="empty">暂无学术研究</p>';
	    			}
	    			$(".ci-study ul").html(sHtml);
	    		});
	    		break;
	    	case 'ci-works':
	    		iUserCenter.getWorksList(teacherId, function(data){
	    			if(data.code == 0){
	    				var obj = data.body;
	    				if(obj.length > 0){
	    					for(var i=0; i<obj.length; i++){
		    					sHtml += '<li id="'+obj[i].id+'">'
		    					+ '<p class="works-pic"><img src="'+obj[i].imgUrl+'"></p>'
		    					+ '<p class="works-name ellipsis">'+obj[i].name+'</p>'
		    					+ '</li>';
		    				}
	    				}else{
	    					sHtml = '<p class="empty">暂无作品展示</p>';
	    				}
	    			}else{
	    				sHtml = '<p class="empty">暂无作品展示</p>';
	    			}
	    			$(".ci-works ul").html(sHtml);
	    		});
	    		break;
	    	case 'ci-notice':
	    		iUserCenter.getNoticeList(teacherId, "", function(data){
	    			if(data.code == 0){
	    				var obj = data.body;
	    				if(obj.length > 0){
	    					for(var i=0; i<obj.length; i++){
		    					var noticeType = obj[i].type == 1 ? "活动" : "促销";
		    					sHtml += '<li>'
			    					+ '<div class="title"><p class="fl title-con">'+obj[i].title+'</p><span class="fl icon">'+noticeType+'</span><p class="fr date">'+obj[i].lastTime+'</p></div>'
			    					+ '<div class="desc">'+commonUtils.HTMLDecodeHandler(obj[i].content)+'</div>'
			    					+ '<a class="detail-link" target="_blank" href="/room/detail.html?type=notice&id='+obj[i].id+'&tid='+obj[i].userGid+'">详情&gt;</a></li>';
		    				}
	    				}else{
	    					sHtml = '<p class="empty">暂无公告公示</p>';
	    				}
	    			}else{
	    				sHtml = '<p class="empty">暂无公告公示</p>';
	    			}
	    			$(".ci-notice ul").html(sHtml);
	    		});
	    		break;
	    	default:
	    		break;
    	}
    }

    //活动、学术、
    $('.ci-activity,.ci-study').on('click', '.title,.desc', function(event) {
    	event.preventDefault();
    	var url = $(this).siblings('.detail-link').attr('href');
    	window.open(url);
    });
	//公告点击事件
	$('.ci-notice').on('click', '.title-con,.desc', function(event) {
		event.preventDefault();
		var url;
		if($(this).attr('class') == 'desc'){
			url = $(this).siblings('.detail-link').attr('href');
		}else{
			url = $(this).parent().siblings('.detail-link').attr('href');
		}

		window.open(url);
	});

    //课程相关介绍
    $(".course-intro .ci-tab a").click(function(){
    	$(this).addClass("active").siblings().removeClass("active");
    	var dataRel = $(this).attr("data-rel");
    	$(".course-intro .ci-detail ."+dataRel).show().siblings().hide();
    	loadCoCurUserInfo(dataRel);
    });

    /*********************** 课程介绍相关内容 end ****************************/

    /*********************** 观众列表相关 begin ****************************/

    var showAudienceList = function(obj){
    	var sHtml = "", sHtml2 = "";

    	for(var i=0; i<obj.length; i++){
    		var badge = um.getUserLevel(obj[i].badgeArray);
    		if(obj[i].role == "master"){
    			sHtml += '<li data-gid="'+obj[i].globalId+'" data-rid="'+obj[i].roomGlobalId+'" data-role="'+obj[i].role+'">'
        		+ '<p class="fl vl-level"><img src="'+badge.rich.badgeImage+'"></p>'
    			+ '<p class="fl vl-nick">'+obj[i].userNickname+'</p></li>';
    		}else if(obj[i].role == "member"){
    			sHtml2 += '<li data-gid="'+obj[i].globalId+'" data-rid="'+obj[i].roomGlobalId+'" data-role="'+obj[i].role+'">'
    			+ '<p class="fl vl-level"><img src="'+badge.rich.badgeImage+'"></p>'
        		+ '<p class="fl vl-nick">'+obj[i].userNickname+'</p></li>';
    		}else{
    			sHtml2 += '<li data-gid="'+obj[i].globalId+'" data-rid="'+obj[i].roomGlobalId+'" data-role="'+obj[i].role+'">'
        		+ '<p class="fl vl-nick">'+obj[i].userNickname+'</p></li>';
    		}

    	}
    	$("#viewerStudentList").html(sHtml + sHtml2);
    };
    var showManagerList = function(obj){
    	var sHtml = "";
    	for(var i=0; i<obj.length; i++){
    		var badge = um.getUserLevel(obj[i].badgeArray);
    		sHtml += '<li id="'+obj[i].id+'" data-gid="'+obj[i].globalId+'" data-rid="'+obj[i].roomGlobalId+'" data-role="manager">'
    		+ '<p class="fl vl-level"><img src="'+badge.rich.badgeImage+'"></p>'
    		+ '<p class="fl vl-nick">'+obj[i].userNickname+'</p></li>';
    	}
    	$("#viewerManagerList").html(sHtml);
    };

    var getViewerList = function(){
    	iRoom.showAudienceAndManagerList(roomGlobalId, function(data){
    		if(data.code == 0){
    			oRoomViewerList = data.body;
    			var student = data.body.member.concat(data.body.guest);
    			showAudienceList(student);
    			showManagerList(data.body.manager);
    			$("#showStudentBtn span").text(student.length + "人");

    		}
    	});
    };

    //操作
    $("#viewerHandleBox a").click(function(){
    	var className = $(this).attr("data-rel");
    	var optOn = $("#viewerHandleBox").attr("data-gid"),
    		optNick = $("#viewerHandleBox").attr("data-nick"),
    		rid = $("#viewerHandleBox").attr("data-rid");
    	switch(className){
	    	case 'public-say' :
	    		$("#toChatPerson").attr("data-gid", optOn).text(optNick);
	    		$(".handle-btns .msg-to a").show().removeClass("to-select");
	    		$("#priCheckBtn").prop("checked", false).removeAttr("disabled");
	    		if($("#toChatPersonList").find("a[data-gid='"+optOn+"']").length < 1){
	    			$("#toChatPersonList").append('<a href="javascript:void(0);" data-gid="'+optOn+'">'+optNick+'</a>');
	    		}
	    		break;
	    	case 'private-say':
	    		$("#priCheckBtn").removeAttr("disabled").prop("checked", true);
	    		$("#toChatPerson").attr("data-gid", optOn).text(optNick);
	    		$(".handle-btns .msg-to a").show().removeClass("to-select");
	    		if($("#toChatPersonList").find("a[data-gid='"+optOn+"']").length < 1){
	    			$("#toChatPersonList").append('<a href="javascript:void(0);" data-gid="'+optOn+'">'+optNick+'</a>');
	    		}

	    		break;
	    	case 'upto-manager':
	    		var type = $(this).attr("data-type");
	    		if("1003_" == optOn.substring(0,5)){
	    			um.popupLayer.alert("不能提游客为房间管理员！");
	    			return;
	    		}
	    		iRoom.promoteOrFireManager(cookie.get("globalId"), cookie.get("ticketId"), rid, optOn, type, function(data){
	    			if(data.code == 0){
	    				um.popupLayer.msg("操作成功！");
	    			}else{
	    				um.popupLayer.alert("操作失败！");
	    			}
	    		});
	    		break;

	    	case 'kick-out':
	    		iRoom.kickOutRoom(rid, cookie.get("globalId"), optOn, cookie.get("ticketId"), function(data){
	    			if(data.code == 0){
	    				um.popupLayer.msg("操作成功！");
	    				$("#viewerListBox .vl-list ul").find("li[data-gid='"+optOn+"']").remove();
	    			}else{
	    				um.popupLayer.alert("操作失败！");
	    			}
	    		});
	    		break;
	    	default:
	    		break;
    	}
    	$("#viewerHandleBox").hide();
    });

    $(".handle-btns .msg-to a").click(function(){
    	if($(this).hasClass("to-select")){
    		$("#toChatPersonList").fadeToggle();
    	}else{
    		$("#toChatPerson").removeAttr("data-gid").text("所有人");
    		$(".handle-btns .msg-to a").addClass("to-select");
    		$("#priCheckBtn").prop("checked", false).attr("disabled","disabled");
    	}
    });

    $("#toChatPersonList").delegate("a", "click", function(){
    	$("#toChatPerson").attr("data-gid", $(this).attr("data-gid")).text($(this).text());
		$(".handle-btns .msg-to a").removeClass("to-select");
		$("#priCheckBtn").prop("checked", false).removeAttr("disabled");
		$("#toChatPersonList").fadeOut();
    });

	/**
	 * 私聊check
	 */
	$("#priCheckBtn").change(function(){
		if(!$(this).is(":checked")){
			$("#toChatPerson").text("所有人");
			$("#toChatPerson").attr("data-id", "");
			$(this).attr("disabled","disabled");
			$(".handle-btns .msg-to a").addClass("to-select");
		}
	});

	$("#viewerListBox .vl-list ul").delegate("li", "click", function(){
		//当用户不为游客时，点击观众列表添加到对话框里
		if($(this).attr("data-role") != "guest"){
			var optOn = $(this).attr("data-gid"), optNick = $(this).find(".vl-nick").text();
			$("#toChatPerson").attr("data-gid", optOn).text(optNick);
			$(".handle-btns .msg-to a").show().removeClass("to-select");
			$("#priCheckBtn").prop("checked", false).removeAttr("disabled");
			if($("#toChatPersonList").find("a[data-gid='"+optOn+"']").length < 1){
				$("#toChatPersonList").append('<a href="javascript:void(0);" data-gid="'+optOn+'">'+optNick+'</a>');
			}
		}
	});

    $("#viewerListBox .vl-list ul").delegate("li", "mouseover", function(){
    	if(bLogin){
    		if($("#viewerHandleBox")[0].t){
        		clearTimeout($("#viewerHandleBox")[0].t);
        	}
        	var _top = $(this).offset().top - $("#viewerListBox").offset().top - $("#viewerHandleBox").height()/2 +15;

        	//被操作用户为游客时
        	var isMaster = $(this).attr("data-role") == "master", //被操作用户是否是房主
        		isManager = $(this).attr("data-role") == "manager", //被操作用户是否是管理
        		isGuest = $(this).attr("data-role") == "guest"; //被操作用户是否是游客


        	if(oCurUserInfo.role == "master" && !isMaster){
        		//显示踢人
        		$("#viewerHandleBox a.kick-out").addClass("block").removeClass("hide");
        		if(isGuest){
        			$("#viewerHandleBox a.upto-manager, #viewerHandleBox a.public-say, #viewerHandleBox a.private-say").addClass("hide");
        		}else{
        			$("#viewerHandleBox a.upto-manager, #viewerHandleBox a.public-say, #viewerHandleBox a.private-say").removeClass("hide");
        		}
        		if(isManager){
        			$("#viewerHandleBox a.upto-manager").addClass(".block").text("撤销管理").attr("data-type", 2);
        		}else{
        			$("#viewerHandleBox a.upto-manager").addClass(".block").text("提升为管理").attr("data-type", 1);
        		}
        	}else if(oCurUserInfo.role == "manager" && !isManager){
        		//显示踢人
        		$("#viewerHandleBox a.kick-out").addClass("block").removeClass("hide");
        		if(isGuest){
        			$("#viewerHandleBox a.public-say, #viewerHandleBox a.private-say").addClass("hide");
        		}else{
        			$("#viewerHandleBox a.public-say, #viewerHandleBox a.private-say").removeClass("hide");
        		}
        	}

        	//不能对自己进行操作
        	if(oCurUserInfo.globalId == $(this).attr("data-gid") || (oCurUserInfo.role == "member" && isGuest)){
        		$("#viewerHandleBox")[0].t = setTimeout(function(){
            		$("#viewerHandleBox").hide();
            	}, 100);
        	}else{
        		$("#viewerHandleBox").attr("data-nick", $(this).find(".vl-nick").text());
            	$("#viewerHandleBox").attr("data-gid", $(this).attr("data-gid"));
            	$("#viewerHandleBox").attr("data-rid", $(this).attr("data-rid"));
            	$("#viewerHandleBox").css({"top": _top}).show();
        	}


    	}
    }).delegate("li", "mouseout", function(){

    	$("#viewerHandleBox")[0].t = setTimeout(function(){
    		$("#viewerHandleBox").hide();
    	}, 100);
    });

    $("#viewerHandleBox").mouseover(function(){
    	if($("#viewerHandleBox")[0].t){
    		clearTimeout($("#viewerHandleBox")[0].t);
    	}
    	$("#viewerHandleBox").show();
    }).mouseout(function(){
    	$("#viewerHandleBox")[0].t = setTimeout(function(){
    		$("#viewerHandleBox").hide();
    	}, 100);
    });

    //切换
    $("#viewerListBox .vl-tab a").click(function(){
    	var index = $(this).index();
    	$(this).addClass("active").siblings().removeClass("active");
    	$("#viewerListBox .vl-list").find("ul:eq("+index+")").show().siblings().hide();
    });

    //加载学生列表
    $("#showStudentBtn").click(function(){
    	if($("#viewerListBox").is(":visible")){
    		$("#viewerListBox").hide();
    	}else{
    		var _left = $(this).offset().left - $("#viewerListBox").width();
        	$("#viewerListBox").css({"left":_left}).show();
        	getViewerList();
    	}
    });


    /*********************** 观众列表相关 end ****************************/

	/********************** 视频、消息相关内容 begin ************************/
    /*************视频播放器******************/
  //加载首页视频播放器
	var initVideo = function(){
		 var params = { menu: "false",wmode: "transparent"},
		     attributes = {id: "qxPlayer",name: "qxPlayer"};
		swfobject.embedSWF(um.gConfig.PLAY_TYPE.PERSONAL,"qxPlayer", 780, 438, "11.0.0", "../swfobject/expressInstall.swf", "", params, attributes);
	};
	var playVideo = function(rtmpUrl){
		var vobj = swfobject.getObjectById("qxPlayer");
		if(vobj == null  || "function" != typeof vobj.playRtmpVideo){
			setTimeout(function(){
				playVideo(rtmpUrl);
			},1000);
		}else{
			vobj.playRtmpVideo('{"anchorUrl":"'+rtmpUrl+'","livetype":"0"}');
		}
	};
	initVideo();


	//房间心跳
	var roomHeartBeat = function(){
		setInterval(function(){
			if(null != oCurUserInfo && oCurUserInfo.globalId && null != roomGlobalId){
				iRoom.updateHeartBeat(oCurUserInfo.globalId, roomGlobalId, function(data){});
			}
		}, 1000 * 60);
	};

	//进入房间欢迎自己
	var welcomeMyself = function(){
		var sHtml = '<li><span class="msg-time">'+dateFormateUtil.formatHourMinDate(new Date())+'</span>'
			+ '<span class="msg-desc">欢迎<span class="nick">'+oCurUserInfo.userNickname+'</span>进入直播间</span></li>'
		$("#publicChatMsgList").append(sHtml);
	};

	/**
	 * 发送消息
	 *
	 */
	var sendRoomChatMsg = function(){
		if(!bLogin){
			openLoginRegistDialog('login.html');
			return;
		}

		//选中悄悄话，表示私聊消息
		var priMsgChecked = $("#priCheckBtn").prop("checked");
		//消息内容
		var msgText = $("#msgInput").val();

		if($.trim(msgText) == ""){
			layer.tips('请输入聊天内容！', '#msgInput', {
			   tips: [1, '#333'] //还可配置颜色
			});
			return ;
		}

		msgText = commonUtils.replaceHtmlCommon(msgText);
		var toPersonName = $("#toChatPerson").text(),
			toPersonId = $("#toChatPerson").attr("data-gid"),
			fromId = oCurUserInfo.globalId,
			fromName = oCurUserInfo.userNickname;
		var msgFlag = 3;
		if(priMsgChecked){
			msgFlag = 9;
		}
		if("所有人" == toPersonName){
			toPersonId = "all";
			toPersonName = "all";
		}
		var msgData = {
			topic : roomId,
			toId : "*",
			fromId : oCurUserInfo.globalId,
			message : {
				parme1:fromId,
				parme2:fromName,
				parme3:toPersonId,
				parme4:toPersonName,
				parme5:roomId,
				parme6:msgText,
				parme7:"", //window.roomNodeid,
				parme8:"",
				parme9:msgFlag,
				parme10:"",
				other:{
					//optBadge:oCurUserInfo.getUserBadgeObject()
				}
			}
		};
		var code = iMsg.flashObject.sendMsgSocket(oMsgSendIp.ip, oMsgSendIp.port, msgData, "receiveSendMsgDate", "receiveSendMsgError");
		if(code != 0){
			um.popupLayer.alert(um.gConfig.tips.ROOM_SEND_MSG_CODE[code]);
			$("#msgInput").attr("disabled","disabled");
			setTimeout(function(){
				$("#msgInput").removeAttr("disabled");
			},3000);
		}
		receiveMsgFlagCount +=1;
		if(receiveMsgFlagCount > 2){
			iMsg.flashObject.createSubscribeSocket(oMsgRecieveIp.ip, oMsgRecieveIp.port,{name:oCurUserInfo.globalId, topic:roomId},
				"receiveSubscribeJSONArray", "receiveSubscribeError", gcPlayType.ROOM_MSG_SOCKET_TIME.SUBSCRIBE);
			receiveMsgFlagCount = 0;
			um.popupLayer.alert("网速较差,可能会丢失发送的消息!");
		}
		$("#msgInput").val("");
	};


	/**
	 * 发言
	 */
	$("#sendChatMsgBtn").click(function(){
		sendRoomChatMsg();
	});
	commonUtils.enterEventHandler($("#msgInput"), sendRoomChatMsg);
	/**
	 * 房间消息显示
	 */
	var CSMsgShow = function(b, msg_obj, content, direc, type){
		var str = b == 0?"#publicChatMsgList":"#privateChatMsgList";
		content = parseMsgNormalFace(content);
		if(content == null ||content == ""){
			content = msg_obj.content;
		}
		var msg = "";

		if(type == "gift"){
			var giftimg = '<img alt="'+roomCSMes.giftName+'" src="'+$("#"+roomCSMes.productId).find("img").attr("src")+'">';
			for(var i=1; i<=msg_obj.giftNum; i++){
				msg += '<li><span class="msg-time">'+msg_obj.create_time+'</span>';
				for(var k in msg_obj.optBadge){
					msg += '<img src="'+msg_obj.optBadge[k].badgeImage+'">';
				}
				msg += '<span class="nick" data-gid="'+msg_obj.opt+'">'+msg_obj.optName +'</span>'
					+ '赠送：<span class="msg-desc">'+i+"个"+ giftimg+'</span>'
					+ "</li>";
			}
		}else{
			msg += '<li><span class="msg-time">'+msg_obj.create_time+'</span>';
			for(var k in msg_obj.optBadge){
				msg += '<img src="'+msg_obj.optBadge[k].badgeImage+'">';
			}
			msg += content;
			msg += "</li>";
		}

		$(str).append(msg);
		igoScrollTop($(str),$(str).parent());
	};

	$("#chatMsgBox ul").delegate("li .nick", 'click', function(){
		if($(this).attr('data-gid') && $(this).attr('data-gid') != cookie.get("globalId")){
			var gid = $(this).attr('data-gid'), name = $(this).text();
			$("#toChatPerson").text(name);
			$("#toChatPerson").attr("data-gid", gid);
			$("#priCheckBtn").removeAttr("disabled");
			$(".handle-btns .msg-to a").removeClass("to-select");
		}
	});
	/**
	 * 滚动条滚动到最低层
	 */
	var igoScrollTop = function(con, win){
		var conH = con.height();
		var winH = win.height();
		var comH = conH - winH;
		if(comH >= 0)
		{
			win.scrollTop(win[0].scrollHeight);
		}
	};

	//处理消息中的普通表情
	var parseMsgNormalFace = function(content){
		//判断内容中是否有表情Key，拼接内容
		var normalFaceKey = um.gConfig.face;
		for(var n in normalFaceKey)
		{
			while(content.indexOf(n) > -1)
			{
				content = content.replace(n,"<img title='"+n.substring(1,n.length-1)+"' src='"+normalFaceKey[n].small+"'>");
			}
		}
		return content;
	};
	/**
	 * 解析房间轮询消息
	 *
	 */
	 function parseRoomMessage(msg){
		 msg = $.evalJSON(msg);
		 var msgtime = dateFormateUtil.formatHourMinDate(new Date());
		 msg.create_time = msgtime;
		 var content = "";
		 roomCSMes = new RoomCSMessage(msg);

		roomCSMes.content = roomCSMes.content.replace(new RegExp("%3C+", 'g'),'<');
		roomCSMes.content = roomCSMes.content.replace(new RegExp("%3e", 'g'),'>');
		roomCSMes.content = roomCSMes.content.replace(new RegExp("%2B", 'g'),'+');
		roomCSMes.content = roomCSMes.content.replace(new RegExp("%3F", 'g'),"?");
		roomCSMes.content = roomCSMes.content.replace(new RegExp("%25", 'g'), "%");
		roomCSMes.content = roomCSMes.content.replace(new RegExp("%26", 'g'), "&");
		type = parseInt(msg.flag);
		if("undefined" == typeof roomCSMes.optName || null == roomCSMes.optName || "null" == roomCSMes.optName)
		{
			if(type == 7)
			{
				roomCSMes.optName = "系统消息";
			}
		}
		if(type != 7 &&("undefined" == typeof roomCSMes.opt || null == roomCSMes.opt || "null" == roomCSMes.opt))
		{
			return;
		}
		roomCSMes.optName = roomCSMes.optName.replace(new RegExp("%2B", 'g'),'+');
		if("undefined" != typeof roomCSMes.optOnName && null != roomCSMes.optOnName && "null" != roomCSMes.optOnName)
		{
			roomCSMes.optOnName = roomCSMes.optOnName.replace(new RegExp("%2B", 'g'),'+');
		}
		//console.log(roomCSMes);
		//1.进入房间；2.送礼物;3.普通消息;4.踢出房间;5.系统消息;6.抢红包消息;7.提升管理;8.解除管理;9.私聊
		switch(type)
		{
			//加入房间结果
			case 1:
				if(oCurUserInfo.globalId != roomCSMes.opt)
				{
					content = "<span class='msg-desc'>欢迎  ";
					if("1003_" == roomCSMes.opt.substring(0,5)){
						roomCSMes.optName = "游客"+roomCSMes.optName.substring(2);
					}
					content +="<span class='nick' data-gid='"+roomCSMes.opt+"'>"+roomCSMes.optName+"</span>进入直播间";
					content +="</span>";
					CSMsgShow(0,roomCSMes,content);
				}
				break;
			//送礼物结果
			case 2:
				var giftimg = '<img alt="'+roomCSMes.giftName+'" src="'+$("#"+roomCSMes.productId).find("img").attr("src")+'">';
				content += "<span class='nick' data-gid='"+roomCSMes.opt+"'>"+roomCSMes.optName+"</span>赠送：<span class='msg-desc'>"+ roomCSMes.giftNum+"个"+"</span>"+ giftimg ;
				CSMsgShow(0,roomCSMes,content, "", "gift");
				break;
			//公聊消息
			case 3:
				if(roomCSMes.optOnName == "all"){
					content += "<span class='nick' data-gid='"+roomCSMes.opt+"'>"+roomCSMes.optName+"</span> 说：<span class='msg-desc'>"+roomCSMes.content+"</span>";
				}else{
					content += "<span class='nick' data-gid='"+roomCSMes.opt+"'>"+roomCSMes.optName+"</span> 对 ";
					content += "<span class='nick' data-gid='"+roomCSMes.optOn+"'>"+roomCSMes.optOnName+"</span> 说：<span class='msg-desc'>"+roomCSMes.content+"</span>";
				}
				CSMsgShow(0,roomCSMes,content,roomCSMes.director);
				break;
			//踢出房间
			case 4:
				content += "<span class='nick' data-gid='"+roomCSMes.opt+"'>"+roomCSMes.optName+"</span>将"
					+ "<span class='nick' data-gid='"+roomCSMes.optOn+"'>"+roomCSMes.optOnName+"</span><span class='msg-desc'>请出教室</span>" ;
				CSMsgShow(0,roomCSMes,content);
				getViewerList();
				break;
			//5.系统消息;
			case 5:
				content += "<span class='nick'>系统消息</span>：<span class='msg-desc'>"+roomCSMes.content+"</span>";
				CSMsgShow(0,roomCSMes,content);
				break;
			//6.发红包消息;
			case 6:
				content += "<span class='nick' data-gid='"+roomCSMes.opt+"'>"+roomCSMes.optName+"</span><span class='msg-desc'>发了一个红包</span>";
				CSMsgShow(0,roomCSMes,content);
				checkRedPacket();
				break;
			//7.提升管理;
			case 7:
				content += "<span class='nick' data-gid='"+roomCSMes.opt+"'>"+roomCSMes.optName+"</span>提升"
						+ "<span class='nick' data-gid='"+roomCSMes.optOn+"'>"+roomCSMes.optOnName+"</span><span class='msg-desc'>为房间管理</span>" ;
				CSMsgShow(0,roomCSMes,content);
				getViewerList();
				break;
			//8.解除管理;
			case 8:
				content += "<span class='nick' data-gid='"+roomCSMes.opt+"'>"+roomCSMes.optName+"</span>撤销了"
					+ "<span class='nick' data-gid='"+roomCSMes.optOn+"'>"+roomCSMes.optOnName+"</span><span class='msg-desc'>的管理</span>" ;
				CSMsgShow(0,roomCSMes,content);
				getViewerList();
				break;
			//9.私聊
			case 9:
				if("undefined" == typeof roomCSMes.optName)
				{
					content += "<span class='nick'>系统消息</span>：<span class='msg-desc'>"+roomCSMes.content+"</span>";
				}else{
					content += "<span class='nick' data-gid='"+roomCSMes.opt+"'>"+roomCSMes.optName+"</span> 对 ";
					content += "<span class='nick' data-gid='"+roomCSMes.optOn+"'>"+roomCSMes.optOnName+"</span> 悄悄说：<span class='msg-desc'>"+roomCSMes.content+"</span>";
				}
				if(oCurUserInfo.globalId == roomCSMes.opt || oCurUserInfo.globalId == roomCSMes.optOn){
					CSMsgShow(1,roomCSMes,content,roomCSMes.director);
				}
				break;
			//抢红包
			case 10 :
				content += "<span class='nick' data-gid='"+roomCSMes.opt+"'>"+roomCSMes.optName+"</span><span class='msg-desc'>抢到了一个红包</span>";
				CSMsgShow(0,roomCSMes,content);
				break;
//			//用户离开房间,收到用户离开房间消息，如果用户在麦序，管理，观众，贵宾席，守护列表中，更新列表
//			case 3:
//
//				content = "<span class='msg-desc'><span class='nick' >"+roomCSMes.optName+"</span>: 离开房间</span>";
//				CSMsgShow(0,roomCSMes,content);
//
//				if(oCurUserInfo.globalId == roomCSMes.opt && roomCSMes.userAgent == ROOM_COMMEN_CONFIG.ROOM_USER_RESOURCE.IGO_SHOW_COMMON)
//				{
//					igoCommonUtils.igoTipsDialogue("你已退出房间!");
//					setTimeout(function(){
//						window.location.href = loginAfterTo;
//					},3000);
//				}
//				break;
			//其它消息
			default:
				CSMsgShow(0,roomCSMes,content,roomCSMes.director);
				break;
		};

	}

	/********************** 视频、消息相关内容 end ************************/
	/********************************* MSG系统 ***************************************/
	//初始化发送通道
	function initReceiveSendMsgError(){
		iRoom.getMsgConfig(function(data){
			if(data.code == 0){   
				oMsgRecieveIp = data.body.recieveIp;   
				oMsgSendIp = data.body.sendIp;    
				setTimeout(function(){          
					if(bLogin){
						iMsg.flashObject.sendMsgSocket(oMsgSendIp.ip, oMsgSendIp.port, null,
							"receiveSendMsgDate", "initReceiveSendMsgError", gcPlayType.ROOM_MSG_SOCKET_TIME.SEND); 
					}
				}, 1000);
			}
		});
	}
	window.initReceiveSendMsgError = initReceiveSendMsgError;

	//发送消息通道
	function receiveSendMsgError(){
		iRoom.getMsgConfig(function(data){
			if(data.code == 0){
				oMsgRecieveIp = data.body.recieveIp;
				oMsgSendIp = data.body.sendIp;
			}
		});
	}
	window.receiveSendMsgError = receiveSendMsgError;
	/**
	 * 发送通道接收消息回调函数
	 */
	function receiveSendMsgDate(arr){
		sendMsgSocketFlag = true;
		//判断用户是否被禁言
		if(sendMsgSocketFlag && recieveMsgSocketFlag){
			$("#msgInput").removeAttr("disabled");
		}
	}
	window.receiveSendMsgDate = receiveSendMsgDate;
	/**
	 * 接收通道接收消息回调函数
	 */
	function receiveSubscribeJSONArray(arr){
		receiveMsgFlagCount = 0;
		for(var a in arr ){
			try{
				switch(arr[a].type){
					case "messagex":
						parseRoomMessage(arr[a].msg);
						break;
					case "subscribex":
						recieveMsgSocketFlag = true;
						//判断用户是否被禁言
						if(sendMsgSocketFlag && recieveMsgSocketFlag)
						{
							$("#msgInput").removeAttr("disabled");
						}
						break;
				}
			}catch(e){
				throw e;
			}

		}
	}
	window.receiveSubscribeJSONArray = receiveSubscribeJSONArray;
	/**
	 * 接收通道异常回调函数
	 */
	function receiveSubscribeError(str){
		iRoom.getMsgConfig(function(data){
			if(data.code == 0){
				oMsgRecieveIp = data.body.recieveIp;
				oMsgSendIp = data.body.sendIp;
				setTimeout(function(){
					if(bLogin){
						iMsg.flashObject.createSubscribeSocket(oMsgRecieveIp.ip, oMsgRecieveIp.port, {name:oCurUserInfo.globalId, topic:roomId},
							"receiveSubscribeJSONArray", "receiveSubscribeError",gcPlayType.ROOM_MSG_SOCKET_TIME.SUBSCRIBE);
					}else{
						iMsg.flashObject.createSubscribeSocket(oMsgRecieveIp.ip, oMsgRecieveIp.port, {topic:roomId},
							"receiveSubscribeJSONArray", "receiveSubscribeError", gcPlayType.ROOM_MSG_SOCKET_TIME.SUBSCRIBE);
					}
				}, 1000);
			}
		});
	}
	window.receiveSubscribeError = receiveSubscribeError;
	/**
	 * 定时器判断用户16分钟内是否发生消息。
	 */
	setInterval(function(){
		if(true == iMsg.sendSocketFlag){
			iMsg.flashObject.closeSendMsgSocket();
		}else{
			iMsg.sendSocketFlag == true;
		}
	},1000*60*5);
	/************************************* MSG系统 ***************************************/

	$(document.body).click(function(event){
		//观众列表点击其他地方关闭
		var viewerBtnLen = $(event.target).parents("a[id=showStudentBtn]").length,
			viewerParentLength = $(event.target).parents("div[id=viewerListBox]").length;
		if($("#viewerListBox").is(":visible") && event.target.id != "showStudentBtn" && !(viewerBtnLen > 0) && !(viewerParentLength > 0)){
			$("#viewerListBox").hide();
		}

		//表情窗口点击其他地方关闭
		var faceBtnLen = $(event.target).parents("a[id=faceBtn]").length,
			faceParentLength = $(event.target).parents("div[id=faceBox]").length;
		if($("#faceBox").is(":visible") && event.target.id != "faceBtn" && !(faceBtnLen > 0) && !(faceParentLength > 0)){
			$("#faceBox").hide();
		}

	});

	/************************************* video-mask ***************************************/
	function videoMask(liveState){
		if(!liveState){
			if(roomId == '19788' || roomId == '12851'|| roomId == "14844"){
                $('.video-mask').show();
                $(".video-mask").html("");
                $(".video-mask").css("background-image",'url("'+oRoomInfo.roomImage+'")');
                return;
             }
			um.ajaxData.request('get',um.gConfig.AJAX_URL.datahouse.queryByKey_url,{
				key: "LIVE_RECOMMEND,TEACHER_LESSON"
			},function(data){
				if (data.code == 0) {
					var onlive = data.body.LIVE_RECOMMEND,
						lesson = data.body.TEACHER_LESSON,
						shtml = '';

					if(onlive.length){
						$.each(onlive, function(index, el) {
							if(index < 2){
								shtml += '<div class="video-mask-box"><a href="./'+ el.roomId +'"><img src="'+ el.roomImage +'" alt="" />';
								shtml += '<span>'+ el.roomTitle +'</span></a></div>';
							}
						});
					};

					for (var i = 0; i < 2 - onlive.length; i++) {
						if(lesson.length){
							shtml += '<div class="video-mask-box"><a href="../room/offlineVideo.html?tid='+ lesson[i].teacherId +'&cid='+ lesson[i].courseId +'&roomId='+ roomId +'">';
							shtml += '<img src="'+ lesson[i].courseImg +'" alt="" />';
							shtml += '<span>'+ lesson[i].courseTitle +'</span></a></div>';
						};
					};

					$('.video-mask h3').after(shtml);
				}
			});
			$('.video-mask').show();
		}
	}


})(jQuery);

});
