define(function(require, exports, module) {
	require('util/config');
	require('util/common');
	require("page/interface/iRoom");
	require("page/interface/iMsg");
	require("util/DateFormateUtil");
	require('swfobject/swfobject');
	require("page/interface/iShare");
	require("util/classUtils");
	require("zeroclipboard-2.2.0/ZeroClipboard.min");

	$(function() {
		var um = new UserManager(),
			gc = um.gConfig,
			gcPlayType = um.gConfig.PLAY_TYPE,
			cookie = um.cookie,
			commonUtils = um.commonUtils,
			iRoom = new IRoom(),
			dateFormateUtil = new DateFormateUtil(),
			iMsg = new IMsg(),
			isLogin = um.checkLogin();

		var roomGlobalId = "null",
			teacherId = null,
			oMsgRecieveIp = null,
			oMsgSendIp = null,
			oRtmp = null,
			oRoomInfo = null,
			oCurUserInfo = null,
			oTeacherInfo = null,
			oRoomViewerList = null;

		var loginAfterTo = "/index.html",
			sendMsgSocketFlag = false,
			recieveMsgSocketFlag = false,
			receiveMsgFlagCount = 0,
			holdhands=false;

		var roomId = location.href.substring(location.href.lastIndexOf("/") + 1);

		//判断是否登录
		if(isLogin) {
			$(".mes-con").attr("disabled", false).next().hide();
			$(".mes-send").css("background", "#1dd388");

		} else {
			$(".mes-con").attr("disabled", true);
			$(".state-login span").click(function() {
				openLoginRegistDialog('login.html');
				return;
			});
		}

		//房间初始化
		initRoom();
		//实时通讯协议
		iMsg.initFlashMsg(gcPlayType.ROOM_MSG_SWF, "msgtx");

		//房间初始化
		function initRoom() {
			if(null == roomId || isNaN(roomId)) {
				window.location.href = "index.html";
			} else {
				if(isLogin) {
					enterRoomInfo(cookie.get("globalId"), cookie.get("ticketId"), roomId);
				} else {
					enterRoomInfo("", "", roomId);
				}
			}
		};

		function enterRoomInfo(gid, tid, roomId) {
			iRoom.initRoom(gid, tid, roomId, function(data) {
				if(data.code == 0) {

					oMsgRecieveIp = data.body.msgRecieveIp;
					oMsgSendIp = data.body.msgSendIp;
					oRtmp = data.body.rtmp;
					oRoomInfo = data.body.room;
					oCurUserInfo = data.body.user;
					oTeacherInfo = data.body.zhubo;

					teacherId = oTeacherInfo.globalId;
					roomGlobalId = oRoomInfo.roomGlobalId;

					liveState = data.body.room.liveState || 0;
					
					if(oRoomInfo.roomType == 3){
						data.body.rtmp.mcu_teacher = data.body.rtmp.addr0+"-mp0";
					}

					playVideo(data.body.rtmp.mcu_teacher);
					

					var flashMsgTimer = setInterval(function() {
						iMsg.getFlashMsg();
						if(null != iMsg.flashObject && "undefined" != typeof iMsg.flashObject.createSubscribeSocket) {
							clearInterval(flashMsgTimer);
							if(isLogin) {
								iMsg.flashObject.createSubscribeSocket(oMsgRecieveIp.ip, oMsgRecieveIp.port, { name: oCurUserInfo.globalId, topic: roomId },
									"receiveSubscribeJSONArray", "receiveSubscribeError", gcPlayType.ROOM_MSG_SOCKET_TIME.SUBSCRIBE);
								iMsg.flashObject.sendMsgSocket(oMsgSendIp.ip, oMsgSendIp.port, null, "receiveSendMsgDate",
									"initReceiveSendMsgError", gcPlayType.ROOM_MSG_SOCKET_TIME.SEND);
							} else {
								iMsg.flashObject.createSubscribeSocket(oMsgRecieveIp.ip, oMsgRecieveIp.port, { topic: roomId },
									"receiveSubscribeJSONArray", "receiveSubscribeError", gcPlayType.ROOM_MSG_SOCKET_TIME.SUBSCRIBE);
							}
							//$("#iMsgVersion").val(iMsg.flashObject.getMsgVersion());
						}
					}, 2000);

					//获取地址
					iRoom.getMcuUpUrl(oRoomInfo.roomGlobalId, cookie.get("globalId"), cookie.get("ticketId"), function(data) {
						if(data.code == 0) {
								
								$("#playerPromtBox .p-con-url span").text(data.body.replace("/live/","/"));
								//复制地址代码设置
								var clip = new ZeroClipboard($('#copUrlBtn'));
								$('#copUrlBtn').attr("data-clipboard-text", data.body.replace("/live/","/"));
								playVideo2("rtmp://"+data.body);
								clip.on('ready', function() {
									this.on('aftercopy', function(event) {
										um.popupLayer.alert("复制成功！" + event.data["text/plain"]);

									});
								});

								$("#playerPromtBox").show();
								getPCDownloadUrl();
/*							$(".tech-btn").click(function(){
								$(this).parent().hide();
								$(".star-tech").hide()
								$("#playerPromtBox .p-con-url span").text(data.body.replace("/live/","/"));
								//复制地址代码设置
								var clip = new ZeroClipboard($('#copUrlBtn'));
								$('#copUrlBtn').attr("data-clipboard-text", data.body.replace("/live/","/"));
								playVideo2("rtmp://"+data.body);
								clip.on('ready', function() {
									this.on('aftercopy', function(event) {
										um.popupLayer.alert("复制成功！" + event.data["text/plain"]);

									});
								});

								$("#playerPromtBox").show();
								getPCDownloadUrl();
							})
	*/					}
					});

					if(!isLogin) {
						cookie.set("guestGlobalId", oCurUserInfo.globalId);
						cookie.set("guestUserId", oCurUserInfo.userId);
					}
					//获取房间信息成功回调函数
					initRoomSuccessfulCall();
					//video-mask
					//videoMask(liveState);
				} else if(-3 == data.code) {

					setTimeout(function() {
						window.location.href = loginAfterTo;
					}, 3000);
				} else if(-5 == data.code) {
					openLoginRegistDialog('login.html');
					return;
				} else {
					commonUtils.check360browser5version();
					var msg = "初始化房间失败！";
					if(typeof data.msg != "undefined") {
						msg = data.msg;
					}
					um.popupLayer.alert(um.gConfig.tips[data.app] + msg);
					return;
				}

			});
		};
		//获取下载地址
		var getPCDownloadUrl = function() {
			um.ajaxData.request(um.gConfig.METHOD.P, um.gConfig.DOWNLOAD.GET_DOWNLOAD_IGO_URL, {}, function(data) {
				if(data.code == 0) {
					$("#downloadUrlLink").attr("href", data.body.version_path);
				}
			});
		};
		//直播信息框操作
		//查看直播教程
		$("#playerPromtBox .show-helptext-link").click(function() {
			$("#liveHelptextBox").show();
		});
		//关闭信息提示框
		$("#playerPromtBox .close-btn").click(function() {
			$("#playerPromtBox").hide();
		});
		//关闭直播教程弹框
		$("#liveHelptextBox .close-btn").click(function() {
			$("#liveHelptextBox").hide();
		});

		/*************视频播放器******************/
		//加载首页视频播放器
		var initVideo = function() {
			$(".tech-shadow").hide();
			var params = { menu: "false", wmode: "transparent" },
				attributes = { id: "qxPlayer3", name: "qxPlayer3" };
			swfobject.embedSWF(um.gConfig.PLAY_TYPE.MCU_VIDEO, "qxPlayer3", "100%", "100%", "11.0.0", "../swfobject/expressInstall.swf", "", params, attributes);

			var params = { menu: "false", wmode: "transparent" },
				attributes = { id: "qxPlayer4", name: "qxPlayer4" };
			swfobject.embedSWF(um.gConfig.PLAY_TYPE.MCU_VIDEO, "qxPlayer4", "100%", "100%", "11.0.0", "../swfobject/expressInstall.swf", "", params, attributes);
		};
		var playVideo = function(rtmpUrl) {
			var vobj = swfobject.getObjectById("qxPlayer3");
			if(vobj == null || "function" != typeof vobj.playRtmpVideo) {
				setTimeout(function() {
					playVideo(rtmpUrl);
				}, 1000);
			} else {
				vobj.playRtmpVideo('{"anchorUrl":"' + rtmpUrl + '","livetype":"0"}');
			}
		};
		var playVideo2 = function(rtmpUrl) {
			var vobj = swfobject.getObjectById("qxPlayer4");
			if(vobj == null || "function" != typeof vobj.playRtmpVideo) {
				setTimeout(function() {
					playVideo2(rtmpUrl);
				}, 1000);
			} else {
				vobj.playRtmpVideo('{"anchorUrl":"' + rtmpUrl + '","livetype":"0"}');
			}
		};
		initVideo();

		//房间心跳
		var roomHeartBeat = function() {
			setInterval(function() {
				if(null != oCurUserInfo && oCurUserInfo.globalId && null != roomGlobalId) {
					iRoom.updateHeartBeat(oCurUserInfo.globalId, roomGlobalId, function(data) {});
				}
			}, 1000 * 60);
		};

		function initRoomSuccessfulCall() {
			//房间延迟2秒加载的数据
			lazyInitRoom();
			//房间心跳
			roomHeartBeat();
		}

		//房间延迟2秒加载的数据
		function lazyInitRoom() {
			setTimeout(function() {
				//加载观众列表
				getViewerList();

			}, 2000);
		};
		
		//表情
		$(".facebtn").click(function() {
			var faceHtml = commonUtils.loadFaceList();
			$("#faceBox").html(faceHtml).show();
		});

		//选择表情
		$("#faceBox").delegate("table>tbody>tr>td", "click", function() {
			var con = $(this).children("img").attr("alt");
			var msgText = $(".mes-con").val() + con;
			if(isLogin) {
				$(".mes-con").val(msgText);
			}
			$("#faceBox").hide();
		});

		//清屏
		$(".func-some .clearbtn").click(function() {
			$(".chat-list").empty();
		});


		/*发送消息*/
		function sendRoomChatMsg(msgFlag) {
			if(!isLogin) {
				openLoginRegistDialog('login.html');
				return;
			}
			
			
			var toPersonName = $(".choose-obj  option:selected").text(),
				toPersonId = $(".choose-obj option:selected").attr("data-gid"),
				fromId = oCurUserInfo.globalId,
				fromName = oCurUserInfo.userNickname;
			
			if(msgFlag==4){
				
				var msgText ="";
			}
			if(msgFlag==3){
				var msgText = $(".mes-con").val();
				if($.trim(msgText) == ""){
					layer.tips('请输入聊天内容！', '.mes-con', {
						tips: [1, '#333'] //还可配置颜色
					});
					return;
				}
				if($.trim(msgText).length > 50) {
					layer.tips('请输入小于50个字！', '.mes-con', {
						tips: [1, '#333'] 
					});
					return;
				}
			}
			msgText = commonUtils.replaceHtmlCommon(msgText);
			if("所有人" == toPersonName) {
				toPersonId = "all";
				toPersonName = "all";
			}
			var msgData = {
				topic: roomId,
				toId: "*",
				fromId: oCurUserInfo.globalId,
				message: {
					parme1: fromId,
					parme2: fromName,
					parme3: toPersonId,
					parme4: toPersonName,
					parme5: roomId,
					parme6: msgText,
					parme7: "", //window.roomNodeid,
					parme8: "",
					parme9: msgFlag,
					parme10: "",
					other: {
						//optBadge:oCurUserInfo.getUserBadgeObject()
					}
				}
			};
			var code = iMsg.flashObject.sendMsgSocket(oMsgSendIp.ip, oMsgSendIp.port, msgData, "receiveSendMsgDate", "receiveSendMsgError");
			if(code != 0) {
				um.popupLayer.alert(um.gConfig.tips.ROOM_SEND_MSG_CODE[code]);
				$(".mes-con").attr("disabled", "disabled");
				setTimeout(function() {
					$(".mes-con").removeAttr("disabled");
				}, 3000);
			}
			receiveMsgFlagCount += 1;
			if(receiveMsgFlagCount > 2) {
				iMsg.flashObject.createSubscribeSocket(oMsgRecieveIp.ip, oMsgRecieveIp.port, { name: oCurUserInfo.globalId, topic: roomId },
					"receiveSubscribeJSONArray", "receiveSubscribeError", gcPlayType.ROOM_MSG_SOCKET_TIME.SUBSCRIBE);
				receiveMsgFlagCount = 0;
				um.popupLayer.alert("网速较差,可能会丢失发送的消息!");
			}
			$(".mes-con").val("");
		}

		/*发言*/
		$(".mes-send").click(function() {
			sendRoomChatMsg(3);
		});
		commonUtils.enterEventHandler($(".mes-con"), sendRoomChatMsg);
		
		//举手发言
		$(".handsup").click(function(){			
			if($(this).hasClass("red")){	
				um.popupLayer.alert(um.gConfig.tips.M01);
				$(this).unbind("click");				
			}else{
				sendRoomChatMsg(4);
				$(this).addClass("red");
				$(".handsup span").html("取消发言");
			}
			
		})
		
	    //收藏与取消收藏
	    $(".spl-collect").click(function(){
	    	if($(this).hasClass("red")){
	    		//取消关注   		
	 	  		um.popupLayer.confirm("您确定要取消收藏吗？",
	    			{btn:['确定', '取消']},
	    			function(index){
	    				um.cancelFocus(oTeacherInfo.globalId, function(data){
	    	    			if(data.code == 0){
	    	    				//um.popupLayer.msg("操作成功！");
								$(".spl-collect span").html("收藏");
	    	    				$(".spl-collect").removeClass("red");
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
	    				um.popupLayer.alert("操作成功！");
	    				$(".spl-collect").addClass("red");
						$(".spl-collect span").html("取消收藏");   				
	    			}else{
	    				um.popupLayer.alert("操作失败！");
	    			}
	    		});
	    	}
	    });

		
		/*消息显示*/
		function CSMsgShow(b, msg_obj, content, direc, type) {
			//var str = b == 0?"#publicChatMsgList":"#privateChatMsgList";

			content = parseMsgNormalFace(content);
			if(content == null || content == "") {
				content = msg_obj.content;
			}
			var msg = "";

			msg += '<li><span>' + msg_obj.create_time + '</span>';
			msg += content;
			msg += "</li>";

			$(".chat-list").append(msg);
			$(".chat-list").scrollTop($(".chat-list").prop("scrollHeight"));
		};

		//处理消息中的普通表情
		function parseMsgNormalFace(content) {
			//判断内容中是否有表情Key，拼接内容
			var normalFaceKey = um.gConfig.face;
			for(var n in normalFaceKey) {
				while(content.indexOf(n) > -1) {
					content = content.replace(n, "<img title='" + n.substring(1, n.length - 1) + "' src='" + normalFaceKey[n].small + "'>");
				}
			}
			return content;
		};
		
		/**
		 * 解析房间轮询消息
		 *
		 */
		function parseRoomMessage(msg) {
			msg = $.evalJSON(msg);
			var msgtime = dateFormateUtil.formatHourMinDate(new Date());
			msg.create_time = msgtime;
			var content = "";
			roomCSMes = new RoomCSMessage(msg);

			roomCSMes.content = roomCSMes.content.replace(new RegExp("%3C+", 'g'), '<');
			roomCSMes.content = roomCSMes.content.replace(new RegExp("%3e", 'g'), '>');
			roomCSMes.content = roomCSMes.content.replace(new RegExp("%2B", 'g'), '+');
			roomCSMes.content = roomCSMes.content.replace(new RegExp("%3F", 'g'), "?");
			roomCSMes.content = roomCSMes.content.replace(new RegExp("%25", 'g'), "%");
			roomCSMes.content = roomCSMes.content.replace(new RegExp("%26", 'g'), "&");
			type = parseInt(msg.flag);
			
			if("undefined" == typeof roomCSMes.optName || null == roomCSMes.optName || "null" == roomCSMes.optName) {
				if(type == 7) {
					roomCSMes.optName = "系统消息";
				}
			}
			if(type != 7 && ("undefined" == typeof roomCSMes.opt || null == roomCSMes.opt || "null" == roomCSMes.opt)) {
				return;
			}
			roomCSMes.optName = roomCSMes.optName.replace(new RegExp("%2B", 'g'), '+');
			if("undefined" != typeof roomCSMes.optOnName && null != roomCSMes.optOnName && "null" != roomCSMes.optOnName) {
				roomCSMes.optOnName = roomCSMes.optOnName.replace(new RegExp("%2B", 'g'), '+');
			}
			console.log(roomCSMes);
			//1.进入房间;3.普通消息;5.系统消息;9.私聊
			switch(type) {
				//加入房间结果
				case 1:
					if(oCurUserInfo.globalId != roomCSMes.opt) {
						content = "<div class='chat-con'>";
						if("1003_" == roomCSMes.opt.substring(0, 5)) {
							roomCSMes.optName = "游客" + roomCSMes.optName.substring(2);
						}
						content += "<font data-gid='" + roomCSMes.opt + "'>" + roomCSMes.optName + "</font> <em>进入直播间</em>";
						content += "</div>";
						CSMsgShow(0, roomCSMes, content);
					}
					break;
					//倒计时
				case 2:					
					$(".count-down").show();
					$(".count-down font").html(roomCSMes.content);
					countDown(5);
					$(".handsup").removeClass("red");
					$(".handsup span").html("举手发言");
					CSMsgShow(0,roomCSMes);
					break;
				case 22:					
					$(".count-down").hide();
					CSMsgShow(0,roomCSMes);
					$(".handsup").click(function(){			
						if($(this).hasClass("red")){	
							um.popupLayer.alert(um.gConfig.tips.M01);
							$(this).unbind("click");				
						}else{
							sendRoomChatMsg(4);
							$(this).addClass("red");
							$(".handsup span").html("取消发言");
						}
						
					})
					break;
					//公聊消息
				case 3:
					if(roomCSMes.optOnName == "all") {
						content += "<div class='chat-con'><font  data-gid='" + roomCSMes.opt + "'>" + roomCSMes.optName + "</font> <em class='msg-desc'>" + roomCSMes.content + "</em></div>";
					} else {
						content += "<div class='chat-con'><font  data-gid='" + roomCSMes.opt + "'>" + roomCSMes.optName + "</font> 对 ";
						content += "<font  data-gid='" + roomCSMes.optOn + "'>" + roomCSMes.optOnName + "</font> <em class='msg-desc'>" + roomCSMes.content + "</em></div>";
					}
					CSMsgShow(0, roomCSMes, content, roomCSMes.director);
					break;
					//举手发言
				case 4:
					if(roomCSMes.optName == oCurUserInfo.userNickname) {
						content += "<div class='chat-con'><font >您</font> <em class='msg-desc'>正在申请发言</em></div>";
					} else {
						content += "<div class='chat-con'><font >"+roomCSMes.optName+"</font> <em class='msg-desc'>正在申请发言</em></div>";
					}
					CSMsgShow(0,roomCSMes,content);
					break;
					//5.系统消息;
				case 5:
					content += "<div class='chat-con'><font >系统消息</font> <em class='msg-desc'>" + roomCSMes.content + "</em></div>";
					CSMsgShow(0, roomCSMes, content);
					break;	
					//其它消息
				default:
					CSMsgShow(0, roomCSMes, content, roomCSMes.director);
					break;
			};

		}
		//发言倒计时
		var  timeID;	
		function countDown(intDiff){//倒计时总秒数量
			clearInterval(timeID);
		  	timeID=window.setInterval(function(){
		    var day=0,
		        hour=0,
		        minute=0,
		        second=0;//时间默认值        
		    if(intDiff > 0){
		        day = Math.floor(intDiff / (60 * 60 * 24));
		        hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
		        minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
		        second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
		    }
		    if (minute <= 9) minute = '0' + minute;
		    if (second <= 9) second = '0' + second;
		    $('.count-down span').html(minute+":"+second);
		    intDiff--;
		    if(intDiff<-1){
		    	$(".count-down").hide();
		    	clearInterval(timeID);
		    }
		    }, 1000);
		} 					

		$(document.body).click(function(event) {
			//表情窗口点击其他地方关闭
			var faceBtnLen = $(event.target).parents("a[class=facebtn]").length,
				faceParentLength = $(event.target).parents("div[id=faceBox]").length;
			if($("#faceBox").is(":visible") && event.target.id != "facebtn" && !(faceBtnLen > 0) && !(faceParentLength > 0)) {
				$("#faceBox").hide();
			}
		});

		function showStuList(obj) {
			var sHtml = "";
			for(var i = 0; i < obj.length; i++) {
				if(obj.length > 0) { //暂时判断 后期改					
					sHtml += '<li data-gid="' + obj[i].globalId + '" data-rid="' + obj[i].roomGlobalId + '" data-role="' + obj[i].role + '">';
					sHtml += '<a class="stu-ava"><img src="'+obj[i].userImageurl+'"></a>';
					sHtml += '<font>' + obj[i].userNickname + '</font>';
					sHtml += '</li>';
				}
			}
			$(".stu-list").html(sHtml);
			ellipsisCut($(".stu-list li font"),8);

		};

		function getViewerList() {
			iRoom.showManagerList(roomGlobalId, function(data) {
				if(data.code == 0) {
					oRoomViewerList = data.body;
					showStuList(oRoomViewerList);
					stuPrivate(oRoomViewerList);
					$(".c-mes-l h3 span").text("(" + oRoomViewerList.length + "人)");
				}
			});
		};

		//单独对话
		function stuPrivate(obj) {
			var ohtml = "";
			ohtml += '<option>所有人</option>';
			ohtml += '<option>' + oTeacherInfo.userNickname + '</option>';
			for(var i = 0; i < obj.length; i++) {
				if(obj.length > 0) {
					ohtml += '<option>' + obj[i].userNickname + '</option>';
				}
			}
			$(".choose-obj").html(ohtml);
			ellipsisCut($(".choose-obj option"), 7);
		}
		
		/*MSG*/
		//初始化发送通道
		function initReceiveSendMsgError() {
			iRoom.getMsgConfig(function(data) {
				if(data.code == 0) {
					oMsgRecieveIp = data.body.recieveIp;
					oMsgSendIp = data.body.sendIp;
					setTimeout(function() {
						if(isLogin) {
							iMsg.flashObject.sendMsgSocket(oMsgSendIp.ip, oMsgSendIp.port, null,
								"receiveSendMsgDate", "initReceiveSendMsgError", gcPlayType.ROOM_MSG_SOCKET_TIME.SEND);
						}
					}, 1000);
				}
			});
		}
		window.initReceiveSendMsgError = initReceiveSendMsgError;

		//发送消息通道
		function receiveSendMsgError() {
			iRoom.getMsgConfig(function(data) {
				if(data.code == 0) {
					oMsgRecieveIp = data.body.recieveIp;
					oMsgSendIp = data.body.sendIp;
				}
			});
		}
		window.receiveSendMsgError = receiveSendMsgError;

		//发送通道接收消息回调函数
		function receiveSendMsgDate(arr) {
			sendMsgSocketFlag = true;
			//判断用户是否被禁言
			if(sendMsgSocketFlag && recieveMsgSocketFlag) {
				$(".mes-con").removeAttr("disabled");
			}
		}
		window.receiveSendMsgDate = receiveSendMsgDate;

		//接收通道接收消息回调函数
		function receiveSubscribeJSONArray(arr) {
			receiveMsgFlagCount = 0;
			for(var a in arr) {
				try {
					switch(arr[a].type) {
						case "messagex":
							parseRoomMessage(arr[a].msg);
							break;
						case "subscribex":
							recieveMsgSocketFlag = true;
							//判断用户是否被禁言
							if(sendMsgSocketFlag && recieveMsgSocketFlag) {
								$(".mes-con").removeAttr("disabled");
							}
							break;
					}
				} catch(e) {
					throw e;
				}

			}
		}
		window.receiveSubscribeJSONArray = receiveSubscribeJSONArray;

		//接收通道异常回调函数
		function receiveSubscribeError(str) {
			iRoom.getMsgConfig(function(data) {
				if(data.code == 0) {
					oMsgRecieveIp = data.body.recieveIp;
					oMsgSendIp = data.body.sendIp;
					setTimeout(function() {
						if(isLogin) {
							iMsg.flashObject.createSubscribeSocket(oMsgRecieveIp.ip, oMsgRecieveIp.port, { name: oCurUserInfo.globalId, topic: roomId },
								"receiveSubscribeJSONArray", "receiveSubscribeError", gcPlayType.ROOM_MSG_SOCKET_TIME.SUBSCRIBE);
						} else {
							iMsg.flashObject.createSubscribeSocket(oMsgRecieveIp.ip, oMsgRecieveIp.port, { topic: roomId },
								"receiveSubscribeJSONArray", "receiveSubscribeError", gcPlayType.ROOM_MSG_SOCKET_TIME.SUBSCRIBE);
						}
					}, 1000);
				}
			});
		}
		window.receiveSubscribeError = receiveSubscribeError;

		//聊天高亮
		cutImgUrl(".func-some a img");

		//右边列表区
		changeSize();
		$(window).resize(function() {
			changeSize();
		})
		//分享页面
		$(".share-img").on("mouseover", function(e) {
			$(".share-box").show();
			setTimeout(mLeave(e), 1000);
		});

		function mLeave(e) {
			$(document).bind('mousemove', function(event) {
				var _target = event.target;
				if($(_target).parents(".share").length == 0) {
					$(".share-box").hide();
					$(document).unbind('mousemove');
				}
			});
		}
		
	    $(".share-box a").click(function(){
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
	    function shareToWechat() {
	    	var sTips = oTeacherInfo.userNickname;
	    	var sPic = window.location.href;
	    	var url = window.location.href;
	    	var iShare = new IShare({ "title": sTips, "pic": sPic, "url": url });

	    	var codeImgUrl = iShare.shareWeixin(url);
	    	$(".share-box img").attr("src", codeImgUrl);
	    	$(".share-box").attr("data-flag", true);
	    }	
	});
		

})

function ellipsisCut(ele, maxLength) {
	$(ele).each(function() {
		if($(this).text().length > maxLength) {
			$(this).text($(this).text().substring(0, maxLength));
			$(this).html($(this).html() + "...");
		}
	})
};

function cutImgUrl(eacharray) {
	$(eacharray).each(function() {
		var imgSrc = $(this).attr("src");
		var imgSrcShort = imgSrc.substring(imgSrc.lastIndexOf('../'), imgSrc.lastIndexOf('.'));
		$(this).parent().hover(function() {
			if(imgSrcShort.indexOf("after") != -1) {
				$(this).find("img").attr("src", imgSrcShort + ".png");
			} else {
				$(this).find("img").attr("src", imgSrcShort + "_c.png");
			}
		}, function() {
			$(this).find("img").attr("src", imgSrcShort + ".png");
		});
	});
}

function changeSize() {
	var cheadh = $(".c-header").height() + 21, //头部区高度
		winw = $(window).width(), //窗口宽度
		winh = $(window).height(), //窗口高度
		vlw = winw - 500, //左侧视频界面的宽度
		vlh = 3 / 4 * vlw, //四比三视频界面的高度
		mp = 0.5 * (winh - cheadh - vlh), //视频绝对居中
		ml = 0.5 * winw - (2 / 3 * (winh - cheadh)) - 250; //视频绝对居中
		$(".s-con-video").height(winh - cheadh).width(vlw);
	var osm = 4 / 3 * (winh - cheadh);
		$(".c-title").width(vlw);
		$(".mes-chat").height(winh - cheadh - 76 - 375); //聊天部分76px
		$(".stu-list").height(winh - cheadh - 37 - 375); //学生列表37px
		$(".s-con-video").height(winh - cheadh);
		if(vlh - winh + cheadh >= 0) {
			$(".s-con-video").height(winh - cheadh);
		}
		if(osm - vlw >= 0) {
			$(".s-con-video").width(vlw);
		}
		$(".s-conr").css("top", cheadh);
}