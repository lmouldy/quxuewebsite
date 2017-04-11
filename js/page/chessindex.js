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
			oRoomViewerList = null,
			mcuPosition=null,
			oRoomListNum=null,
			stuIndex=null,
			stuNum=0,
			stuIndex=1;

		var loginAfterTo = "/index.html",
			sendMsgSocketFlag = false,
			recieveMsgSocketFlag = false,
			receiveMsgFlagCount = 0;

		var roomId =location.href.substring(location.href.lastIndexOf("/") + 1);

		var videoMpService=function(){};


		//判断是否登录
		if(isLogin) {
			$(".mes-con").attr("disabled", false).next().hide();
			$(".mes-send").css("background", "#1dd388");
		}else{
			$(".mes-con").attr("disabled", true);
			$(".state-login span").click(function() {
				openLoginRegistDialog('login.html');
				return;
			});
		}

		//房间初始化
		initRoom();
		//实时通讯协议
		iMsg.initFlashMsg(gcPlayType.ROOM_MSG_SWF, "msgtx1");

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
						data.body.rtmp.mcu_student = data.body.rtmp.addr0+"-mp1";
					}
                    playVideo(data.body.rtmp.mcu_teacher);
					//测试调用，后期删除
					if(teacherId == oCurUserInfo.globalId) {
						playVideo2(data.body.rtmp.mcu_student);						
					}
                    
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

								clip.on('ready', function() {
									this.on('aftercopy', function(event) {
										um.popupLayer.alert("复制成功！" + event.data["text/plain"]);

									});
								});

								$("#playerPromtBox").show();
								getPCDownloadUrl();
							}
						});
					
					if(!isLogin) {
						cookie.set("guestGlobalId", oCurUserInfo.globalId);
						cookie.set("guestUserId", oCurUserInfo.userId);
					}
					//获取房间信息成功回调函数
					initRoomSuccessfulCall();
					//视频创建合成输出                  
                    composeOutput();
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
		var getPCDownloadUrl = function(){
			um.ajaxData.request(um.gConfig.METHOD.P, um.gConfig.DOWNLOAD.GET_DOWNLOAD_IGO_URL, {}, function(data){
				if(data.code == 0){
					$("#downloadUrlLink").attr("href", data.body.version_path);
				}
			});
		};
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
		 /*************视频播放器******************/
		  //加载首页视频播放器
			var initVideo = function(){
				 var params = { menu: "false",wmode: "transparent"},
				     attributes = {id: "qxPlayer",name: "qxPlayer"};
				swfobject.embedSWF(um.gConfig.PLAY_TYPE.MCU_VIDEO,"qxPlayer", "100%", "100%", "11.0.0", "../swfobject/expressInstall.swf", "", params, attributes);
                
                 var params = { menu: "false",wmode: "transparent"},
				     attributes = {id: "qxPlayer2",name: "qxPlayer2"};
				swfobject.embedSWF(um.gConfig.PLAY_TYPE.MCU_VIDEO,"qxPlayer2", "100%", "100%", "11.0.0", "../swfobject/expressInstall.swf", "", params, attributes);
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
            var playVideo2 = function(rtmpUrl){
                var vobj = swfobject.getObjectById("qxPlayer2");
				if(vobj == null  || "function" != typeof vobj.playRtmpVideo){
					setTimeout(function(){
						playVideo2(rtmpUrl);
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
		var msgFlag=0;
		function sendRoomChatMsg(msgFlag) {
			if(!isLogin) {
				openLoginRegistDialog('login.html');
				return;
			}
			var toPersonName = $(".choose-obj  option:selected").text(),
				toPersonId = $(".choose-obj option:selected").attr("data-gid"),
				fromId = oCurUserInfo.globalId,
				fromName = oCurUserInfo.userNickname;
			
			if(msgFlag==2){				
				var msgText =$(".count-down font").html();
			}
			if(msgFlag==22){
				var msgText ="";
			}
			if(msgFlag==3){
				
				var msgText = $(".mes-con").val();
	
				if($.trim(msgText) == "") {
					layer.tips('请输入聊天内容！', '.mes-con', {
						tips: [1, '#333'] //还可配置颜色
					});
					return;
				}
				if($.trim(msgText).length>50) {
					layer.tips('请输入小于50个字！', '.mes-con', {
						tips: [1, '#333'] //还可配置颜色
					});
					return;
				}
				$(".mes-con").val("");
				msgText = commonUtils.replaceHtmlCommon(msgText);
			}


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
			
		}

		/*发言*/
		$(".mes-send").click(function() {
			sendRoomChatMsg(3);
		});
		commonUtils.enterEventHandler($(".mes-con"), sendRoomChatMsg);

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
		var count=0;
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
			
			console.log(roomCSMes);
			
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
			//console.log(roomCSMes);
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
					CSMsgShow(0,roomCSMes);
					break;
				case 22:
					CSMsgShow(0,roomCSMes);
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
					count=0;
					$(".hideorder").each(function(){				
						if($(this).is(":visible")){
							count+=1;							
						}
						//console.log(count);
						$(".stu-list li").each(function(){
							if($(this).attr("data-gid")==roomCSMes.opt){
								$(this).find(".hideorder").removeClass("hidden").html(count);
								//console.log(count);
	/*							iRoom.mpServiceInstruct(cookie.get("globalId"),roomId,cookie.get("ticketId"),5,"",-1,"","",function(data) {
									if(data.code == 0) {				
										console.log("取消音频");
									}
								});
	*/							}
						})				
					})
					CSMsgShow(0,roomCSMes);
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

		$(document.body).click(function(event) {
			//表情窗口点击其他地方关闭
			var faceBtnLen = $(event.target).parents("a[class=facebtn]").length,
				faceParentLength = $(event.target).parents("div[id=faceBox]").length;
			if($("#faceBox").is(":visible") && event.target.id != "facebtn" && !(faceBtnLen > 0) && !(faceParentLength > 0)) {
				$("#faceBox").hide();
			}
		});
		
		function getViewerList() {
			iRoom.showManagerList(roomGlobalId, function(data) {
				if(data.code == 0) {
					oRoomViewerList = data.body;
					oRoomListNum=oRoomViewerList.length;
					showStuList(oRoomViewerList);
					getShadow(oRoomViewerList);
					stuPrivate(oRoomViewerList);
					
					$(".stu-head span").text("(" + oRoomViewerList.length + "人)");
				}
			});
		};
		function showStuList(obj) {
			var sHtml = "";
			for(var i = 0; i < obj.length; i++) {				
				if(obj.length>0) {					
					sHtml += '<li data-gid="' + obj[i].globalId + '" data-rid="' + obj[i].roomGlobalId + '" data-name="' + obj[i].userNickname + '" data-position="' + obj[i].mcuPosition+ '">';
					sHtml += '<a class="stu-ava"><img src="'+obj[i].userImageurl+'"></a>';
					sHtml += '<font>'+obj[i].userNickname+'</font>';
					sHtml += '<span class="stu-fuc"><a class="icon-by-glass" title="放大视频"></a><a class="icon-by-camear" title="关闭视频"></a>';
					sHtml += '<em><a class="icon-by-voice" title="切换语音"></a><i class="hidden hideorder">0</i></em>'
					sHtml += '<a class="icon-by-refresh switchTwo" title="切换视频"></a></span>'
					sHtml += '</li>';	
				}else{
					$(".stu-list").html("暂无学生");
				}
			}			
			$(".stu-list").html(sHtml);
			ellipsisCut($(".stu-list li font"),8);
			videoMpService.switchVoice();			
		};		
				
		function getShadow(obj){
			var ohtml = "";			
			for(var i = 0; i<oRoomViewerList.length;i++) {
				if(obj.length>0) {					
					ohtml += '<li>';
					ohtml += '<div class="unonline hidden"><h2>' + "待上线" + '</h2></div>';
					ohtml += '<div class="apply-shadow hidden"><button class="apply-btn">'+obj[i].userNickname+'申请发言</button></div>';
					ohtml += '</li>';
				}
			}
			$(".c-video-list").html(ohtml);
			
		}
		//单独对话
		function stuPrivate(obj){
			var ohtml = "";		
			ohtml+='<option>所有人</option>';
			for(var i = 0; i<obj.length;i++) {
				if(obj.length>0) {						
					ohtml += '<option>'+obj[i].userNickname+'</option>';
				}
			}			
			$(".choose-obj").html(ohtml);
			ellipsisCut($(".choose-obj option"),7);
		}

		//切换音频
		videoMpService.switchVoice=function(){
			var _flag=true;
			$(".stu-list").delegate(".icon-by-voice","click",function(){
				var _index=$(this).parents("li").attr("data-position");
				var _name=$(this).parents("li").attr("data-name");
				$(this).parents("li").addClass("stu-bg").siblings().removeClass("stu-bg");
				if(_flag){
					$(this).css("color","red").attr("title","取消语音");
					
					$(this).parents("li").find(".hideorder").addClass("hidden");
					$(".stu-list .hideorder").each(function(){
						if($(this).is(":visible")){	
							if($(".hideorder").eq(_index-1).html()<$(this).html()){
								$(this).html(parseFloat($(this).html())-1);
							}
						}
					})
					
					iRoom.mpServiceInstruct(cookie.get("globalId"),roomId,cookie.get("ticketId"),5,"",_index,"","",function(data) {
						if(data.code == 0) {				
							console.log("切换音频");
						}
					});
					$(".count-down").show();
					$('.count-down font').html(_name);
					countDown(5);
					//倒计时3分钟关闭音频
					sendRoomChatMsg(2);
				}else{
					iRoom.mpServiceInstruct(cookie.get("globalId"),roomId,cookie.get("ticketId"),5,"",-1,"","",function(data) {
						if(data.code == 0) {				
							console.log("取消音频");
						}
					});
					$(".count-down").hide();
					$(this).css("color","#1DD388");
					_flag=true;					
				}
			})
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

		//关闭流
		videoMpService.closeStu=function(){
			$(".c-closestu").click(function(){
				$(".c-stushadow").show();
			})
		}
		
		//设置画中画的位置
		videoMpService.paintSite=function(){
			iRoom.mpServiceInstruct(cookie.get("globalId"),roomId,cookie.get("ticketId"),6,"","",0,0,function(data) {
				if(data.code == 0) {				
					console.log("设置画中画的位置");
				}
			});
		}
		
		//关闭单个学生推流
		videoMpService.closeSingleStu=function(){
			
			$(".stu-list").delegate(".icon-by-camear","click",function(){	
				um.popupLayer.alert(um.gConfig.tips.M02);
				$(this).parents("li").addClass("stu-bg").siblings().removeClass("stu-bg");
				var _index=$(this).parents("li").attr("data-position");
				//$(this).parents("li").addClass("stu-bg").siblings().removeClass("stu-bg");
				if($(this).hasClass("red")){
					um.popupLayer.alert(um.gConfig.tips.M02);
					var index=_index-1;
					iRoom.mpServiceInstruct(cookie.get("globalId"),roomId,cookie.get("ticketId"),10,"",index,"","",function(data) {
						if(data.code == 0) {
							console.log("打开单个学生");							
						}
					});
					$(this).removeClass("red");
					
				}else{		
					iRoom.mpServiceInstruct(cookie.get("globalId"),roomId,cookie.get("ticketId"),7,"",_index,"","",function(data) {
						if(data.code == 0) {
							console.log("关闭单个学生");
							//$(".unonline").eq(_index).toggleClass("hidden");
						}
					});
					
				}
			})
		}
		//放大单个学生画面
		videoMpService.amplification=function(){
			
			$(".stu-list").delegate(".icon-by-glass","click",function(){
				um.popupLayer.alert(um.gConfig.tips.M02);
				$(this).parents("li").addClass("stu-bg").siblings().removeClass("stu-bg");
				var _index=$(this).parents("li").attr("data-position");				
				if($(this).hasClass("red")){
					um.popupLayer.alert(um.gConfig.tips.M02);
					if(stuNum==0){
						stuNum=2;
					}
					iRoom.mpServiceInstruct(cookie.get("globalId"),roomId,cookie.get("ticketId"),3,stuNum,"","","",function(data) {
						if(data.code == 0) {				
							console.log("放大单个学生画面12");							
						}
					});
					iRoom.mpServiceInstruct(cookie.get("globalId"),roomId,cookie.get("ticketId"),2,"",1,"","",function(data) {
						if(data.code == 0) {				
							console.log("huanyuan0weihuamian");
							
						}
					});
					$(this).removeClass("red");
				}else{
					$(this).addClass("red");
					iRoom.mpServiceInstruct(cookie.get("globalId"),roomId,cookie.get("ticketId"),3,1,"","","",function(data) {
						if(data.code == 0) {				
							console.log("放大单个学生画面1");
						}
					});
					iRoom.mpServiceInstruct(cookie.get("globalId"),roomId,cookie.get("ticketId"),2,"",_index,"","",function(data) {
						if(data.code == 0) {				
							console.log("放大单个学生画面2");
						}
					});
					
				}
				
			})
		}
		//切换显示画面
		
		videoMpService.cutDisplayField=function(){
			
			$(".stu-list").delegate(".switchTwo","click",function(){
				var _index=$(this).parents("li").attr("data-position");	
				$(this).parents("li").addClass("stu-bg").siblings().removeClass("stu-bg");
				if($(this).hasClass("red")){
					iRoom.mpServiceInstruct(cookie.get("globalId"),roomId,cookie.get("ticketId"),1,"",stuIndex,"","",function(data) {
						if(data.code == 0) {				
							console.log("切换老师和学生画面");
						}
					});
					iRoom.mpServiceInstruct(cookie.get("globalId"),roomId,cookie.get("ticketId"),0,1,"","","",function(data) {
						if(data.code == 0) {				
							console.log("取消画中画");
						}
					});
					$(this).removeClass("red");
										
				}else{	
					$(this).addClass("red")
					iRoom.mpServiceInstruct(cookie.get("globalId"),roomId,cookie.get("ticketId"),0,11,"","","",function(data) {
						if(data.code == 0) {				
							console.log("设置画中画");
						}
					});
					iRoom.mpServiceInstruct(cookie.get("globalId"),roomId,cookie.get("ticketId"),4,"",_index,"","",function(data) {
						if(data.code == 0) {
							stuIndex=_index;
							console.log("切换显示画面");
						}
					});
					
				}
			})
		}
		//视频创建合成输出
		var flagleg=true;
		function composeOutput(){	
			iRoom.mpServiceInstruct(cookie.get("globalId"),roomId,cookie.get("ticketId"),0,1,"","","",function(data) {
				if(data.code == 0) {				
					console.log("取消画中画");
				}
			});
			cutAutoNum(2);
			controllCut(2);
			videoMpService.closeStu();
			videoMpService.paintSite();
			videoMpService.cutDisplayField();
			//videoMpService.closeSingleStu();
			videoMpService.amplification();
			
			
			
			$(".autoV").mouseover(function(){
				$("#switchStu").show().click(function(){
					if(flagleg){
						um.popupLayer.alert(um.gConfig.tips.M02);
						iRoom.mpServiceInstruct(cookie.get("globalId"),roomId,cookie.get("ticketId"),1,"",stuIndex,"","",function(data) {
							if(data.code == 0) {				
								console.log("切换老师和学生画面");
							}
						});
						flagleg=false;
					}else{
						um.popupLayer.alert(um.gConfig.tips.M02);
						iRoom.mpServiceInstruct(cookie.get("globalId"),roomId,cookie.get("ticketId"),13,"",stuIndex,"","",function(data) {
							if(data.code == 0) {				
								console.log("切换老师和学生画面3sdsd");
							}
						});
						flagleg=true;
					}
				});
				
			})
			$(".autoV").mouseleave(function(){
				$("#switchStu").hide();
			})
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
		//分屏切换高亮
		$(".change-screen span").hover(function() {
			/*var _num = $(this).index() + 2;
			
			if(oRoomViewerList.length<_num*_num){
				//alert("当前只有"+oRoomViewerList.length+"名学生");
				return;
			}else{*/
				$(this).find("img").eq(0).toggle();
			/*}	*/		
		})
		$(".change-screen span").click(function() {
			stuNum= $(this).index() + 2;
			um.popupLayer.alert(um.gConfig.tips.M02);
			/*if(oRoomViewerList.length<_num*_num){
				//alert("当前只有"+oRoomViewerList.length+"名学生");
				return;
			}else{*/
				$(this).find("img").eq(0).addClass("hide").parent().siblings().children().removeClass("hide");				
				cutAutoNum(stuNum);
				controllCut(stuNum);
			/*}*/
		}).unbind("hover");
		//默认切换4格
		
		function controllCut(num){	
			iRoom.mpServiceInstruct(cookie.get("globalId"),roomId,cookie.get("ticketId"),3,num,"","","",function(data) {
				if(data.code == 0) {				
					console.log("qiehuan");
				}
			});
			iRoom.mpServiceInstruct(cookie.get("globalId"),roomId,cookie.get("ticketId"),2,"",1,"","",function(data) {
				if(data.code == 0) {				
					console.log("huanyuan0weihuamian");
				}
			});
		}
		
		//分享页面
		$(".share-img").on("mouseover", function(ev) {
			$(".share-box").show();
			setTimeout(mLeave(ev), 1000);
		});
	
		function mLeave(ev) {
			var e=ev ||window.event;
			$(document).bind('mousemove', function(ev) {
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
	    }	});
		function ellipsisCut(ele,maxLength){	
			$(ele).each(function(){
				if($(this).text().length>maxLength){
					$(this).text($(this).text().substring(0,maxLength));
					$(this).html($(this).html()+"...");
				}		
			})
		};
		//视频切换
		function cutAutoNum(n){
			changeSize(n);
			$(window).resize(function() {
				changeSize(n);
			});
		
		}
		//视屏自适应
		function changeSize(n) {
			/*var cheadh = $(".c-header").height() + 21, //头部区高度
				
				bivh = 9 / 16 * bivw; //老师视频的高
			var chatw = $(".c-mes-r").width(),
				facew = $("#faceBox").width();
		
			if(chatw < facew) {
				$(".c-mes-r").width(facew);
				$(".c-mes-l").width($(".c-wrap-l").width() - $(".c-mes-r").width());
				$("#qxPlayer2").width(facew).height(winh - cheadh);
				var left = $(".c-mes-r").width() / 2 - $("#faceBox").width() / 2;
				$("#faceBox").css("left", left).show();
			}else{
				$(".c-mes-r").width("50%");
				$(".c-mes-l").width("50%");
				$("#qxPlayer2").width("100%").height(winh - cheadh);
				$("#faceBox").css("left", "50px").show();
				
			}
		*/
			var cheadh = $(".c-header").height() + 21, //头部区高度
				winw = $(window).width(), //窗口宽度
				winh = $(window).height(), //窗口高度
				smvh = (winh - cheadh) / n, //学生视频的高
				smvw = 4/ 3* smvh, //学生视频的宽
				bivw = winw - (n * smvw), //老师视频的宽
				bivh = 9 / 16 * bivw, //老师视频的高
				facew = $("#faceBox").width();//表情的宽
				
			
				$(".c-wrap-l").width(winw - (4 / 3* smvh * n));
				$(".autoV").height(bivh).width(bivw);
				$(".c-wrap-r").width(4 / 3 * smvh * n).height(winh-cheadh);
				$(".c-video-list li").width(smvw).height(smvh);
				$(".c-title").width(bivw);
				$(".mes-chat").height(winh - cheadh - 76 - bivh); //聊天部分76px
				$(".stu-list").height(winh - cheadh - 37 - bivh); //学生列表37px
				$(".c-video-list").height(winh - cheadh).width(smvw * n);
				//$(".unonline h2").css("line-height", smvh + "px");
				//$(".apply-btn").css("margin-top", smvh * 0.5 - 16);
				$(".p-inner").css("margin-top",bivh/2-98);//上行地址绝对居中
				
				//老师视频固定宽500px
				if(bivw<500){
					$(".c-wrap-l").width(500);
					$(".c-wrap-r").width(winw-500);
					$(".c-video-list").width(winw-500);
					$(".c-video-list li").width((winw-500)/n).height(3/4*((winw-500)/n));
					$(".autoV").height(281.25).width(500);
					$(".p-inner").css("margin-top",43);//上行地址绝对居中
					$(".mes-chat").height(winh - cheadh - 76 - 281.25); //聊天部分76px
					$(".stu-list").height(winh - cheadh - 37 - 281.25); //学生列表37px
					$(".c-mes-r").width("50%");
					$(".c-mes-l").width("50%");
					$(".c-video-list").width(winw-500).height(winh-cheadh);
					$("#faceBox").css("left", "2px").show();
					$(".c-title").width(500);
				}
			
		}
		
		//按钮高亮更改图片路径
		function cutImgUrl(eacharray) {
			$(eacharray).each(function() {	
				var imgSrc = $(this).attr("src");
				var imgSrcShort = imgSrc.substring(imgSrc.lastIndexOf('../'), imgSrc.lastIndexOf('.'));
				$(this).parent().hover(function() {
					if(imgSrcShort.indexOf("_c") != -1) {
						$(this).find("img").attr("src", imgSrcShort + ".png");
					} else {
						$(this).find("img").attr("src", imgSrcShort + "_c.png");
					}
				}, function() {
					$(this).find("img").attr("src", imgSrcShort + ".png");
				});
			});
		}
});


