define(function(require, exports, module){
	require("swfobject/swfobject");
	
	var um = new UserManager(),
		commonUtils = um.commonUtils,
		defaultTips = um.gConfig.tips;
	
	var FlashUtil = {};
	
	FlashUtil.prototype = {
		constructor : FlashUtil,
		//flash信令登录成功回调
		AsCallJSLogoinsuccess : function(guid){
			//下载隐藏
			//$(".live_show_handle .igo_downinfo").hide();
			userStartBoardSendFlash();
		},
		//flash信令登录失败回调
		AsCallJSloginfaild : function(islogin, errorType){
			if("2" == islogin || 2 == islogin){
				commonUtils.igoTipsDialogue(defaultTips.T1087);
			}else if("0" == islogin || 0 == islogin){
				commonUtils.igoTipsDialogue(defaultTips.T1028);
			}else{
				if("undefined" != typeof errorType){
					islogin +="::"+errorType;
				}
				commonUtils.igoTipsDialogue(islogin);
			}
		},
		//flash信令退出成功回调
		AsCallJSlogoutsuccess : function(){
			commonUtils.igoTipsDialogue(defaultTips.T1030);
		},
		//flash信令退出失败回调
		AsCallJSlogoutfaild : function(){
			commonUtils.igoTipsDialogue(defaultTips.T1031);
		},
		//flash信令用户开播成功回调
		AsPlayVideoSuccess : function(){
			$("#start_live").hide();
			if(currentUser.globalId == anthor.globalId){
				$(".video .interaction_zero_mic .interaction_zero_mic_btn").show();
			}
		},
		//flash信令用户开播失败回调
		AsPlayVideofaild : function(){
			commonUtils.igoTipsDialogue(defaultTips.T1035);
			//如果是开播状态，停播
			anthorStopLive();
		},
		/**TODO ???不知道是否有用的方法*/
		AsStopVideoSuccess : function(){
			//$("#start_live").show();
			//igoCommonUtils.igoTipsDialogue(IGO_DEFAULT_TIPS.T1030);
		},
		//助手关闭摄像头回调
		CloseCamara : function(){
			commonUtils.igoTipsDialogue("摄像头已经关闭!");
			//如果摄像头已经关闭，停播
			anthorStopLive();
		}
	};

	
	
	var videoObj = {};
	var initVideoString = "",
		anthorStatus = "",
		livestatus = "",
		isCheckIgoUI = false;
	
	//1、使用Json初始化变量、参数、属性 
	var vW = $("#roomVideo").width() != null ? $("#roomVideo").width():741, 
		vH = $("#roomVideo").height() != null ? $("#roomVideo").height():419,
		flashvars = {width:vW,  height: vH};
			//appName = navigator.appName; 
    var params = { 
      menu: "false",
      wmode: "transparent",
      allowFullScreen:true
    }; 
    var attributes = { 
      id: "dynamicContent2", 
      name: "dynamicContent2" 
    }; 
		
	swfobject.embedSWF(playUrl, "player1", vW,vH, "11.0.0", "../swfobject/expressInstall.swf", flashvars, params, attributes,function(data){
		videoObj = data.ref;
	}); 
	
	videoObj = {
		//名师开播停播调用flash接口
		anthorStatusSet	: function(str){
			
			if("undefined" != typeof str){
				anthorStatus = str;
			}
	 		if(null == videoObj || typeof videoObj != "object"){
	 			videoObj = swfobject.getObjectById("dynamicContent2");
			}
	 		if(null == videoObj || "undefined" == typeof videoObj || "function" != typeof videoObj.anthorStatusSet){
				setTimeout(arguments.callee, 1000);
			}else{
				videoObj.anthorStatusSet('{"status":"'+anthorStatus+'"}');
				
			}
		},
		//初始化RTMP协议视频
		initVideoRTMP : function(str, ls){
	 		if("undefined" != typeof str){
	 			initVideoString = str;
			}
	 		if("undefined" != typeof ls){
	 			livestatus = ls;
			}
	 		if(null == videoObj || typeof videoObj != "object"){
	 			videoObj = swfobject.getObjectById("dynamicContent2");
			}
			if(null == videoObj || 
				"undefined" == typeof videoObj || 
				"function" != typeof videoObj.playRtmpVideo){
				setTimeout(initVideoRTMP,1000);
			}else{
				try{
					videoObj.playRtmpVideo(initVideoString);
					if("undefined" != typeof livestatus)
					{
						anthorStatusSet(livestatus);
					}
				}catch(e){
					
				}finally{
					//destroyHtmlStopFlash();
				}
				
			}
		},
		//初始化视频
		initVideo : function(str){
			if("undefined" != typeof str){
				initVideoString = str;
			}
			if(null == videoObj || typeof videoObj != "object"){
				videoObj = swfobject.getObjectById("dynamicContent2");
			}
			if(null == videoObj || "undefined" == typeof videoObj){
				setTimeout(initVideo,1000);
			}else{
				videoObj.OpenVisureCamara();
				$(".live_show_handle .igo_downinfo").hide();
			}
		},
		//用户退出房间
		userLoginoutSendFlash : function(){
			if(null == videoObj || typeof videoObj != "object"){
				videoObj = swfobject.getObjectById("dynamicContent2");
			}
			videoObj.UserCallVideoStop();
		},
		//用户开播
		userStartBoardSendFlash : function(){
			if(null == videoObj || typeof videoObj != "object"){
				videoObj = swfobject.getObjectById("dynamicContent2");
			}
			var roomType = roominfo.getRoomType(roominfo.effectsType, roominfo.familyType);
			var obj = {
						roomtype:roomType,
						roomId:roominfo.roomId,
						userid:currentUser.userId,
						userole:currentUser.roleId,
						micOrder:"0",
						shoopname:"123",
						userNickName:currentUser.userNickname
					  };
			videoObj.UserOpenCamara($.toJSON(obj));
		},
		//用户停播
		userStopBoardFlash : function(){
			if(null == videoObj || typeof videoObj != "object")
			{
				videoObj = swfobject.getObjectById("dynamicContent2");
			}
			var roomType = roominfo.getRoomType(roominfo.effectsType, roominfo.familyType);
			var str = '{"roomtype":"'+roomType+'","roomId":"'+roominfo.roomId+'","userid":"'+
						currentUser.userId+'","userole":"'+currentUser.roleId+'"}';
			try{
				videoObj.UserCloseCamara(str);
			}catch(e){
				
			}
		},
		//关闭flash socket链接
		userCloseFlashSocket : function(){
			if(null == videoObj || typeof videoObj != "object")
			{
				videoObj = swfobject.getObjectById("dynamicContent2");
			}
			try{
				if(typeof videoObj == "object")
				{
					videoObj.WebCloseSocket();
				}
			}catch(e){
			}
		},
		/**
		*链接异常
		*ExternalInterface.call("connectFaild","testcheacksocket","SecurityErrorEvent");
		*ExternalInterface.call("connectFaild","testcheacksocket","IOErrorEvent");//检测IgoUi的通道
		*/
		connectFaild : function(socketType, errorType){
			try{
				console.log("socketType"+socketType,"errorType"+errorType);
			}catch(e){
				
			}
			if("testcheacksocket" == socketType){
				//如果是开播状态，停播
				anthorStopLive();
				$("#start_live").hide();
				$.ajax({
					   type:"GET",
			           url:GET_DOWNLOAD_IGO_URL,
			           data:"",
			           cache:false,
			           timeout:3000,
			           dataType:"json",
			           async:true,
			           success: function(data) {
			        	   if(0 == data.code)
				   			{
				   				$("#down_igo_service").attr("href",data.body.version_path);
				   			}
			        	   $("#igoDowninfo").show();
			           },
			           error: function(XMLHttpRequest, textStatus, errorThrown){
			        	   $("#igoDowninfo").show();
			           }
				});
			}
		},
		//助手关闭回调
		IgoAssitentClose : function(){
			igoCommonUtils.igoTipsDialogue(IGO_DEFAULT_TIPS.T1092,null,null,false);
			anthorStopLive();
		},
		//助手升级回调
		UpDateIgoUi : function(){
			igoCommonUtils.igoTipsDialogue(IGO_DEFAULT_TIPS.T1091,null,null,false);
			anthorStopLive();
		},
		//视音频通道建立完成
		initRoomMicState : function(){
			showRoomMicState();
		},
		startFlashVideoLive : function(){
			if("function" == typeof videoObj.UserCallVideoLive)
			{
				videoObj.UserCallVideoLive(initVideoString);
			}else{
				videoObj = swfobject.getObjectById("dynamicContent2");
				window.videoObj = videoObj;
				setTimeout(startFlashVideoLive,1000);
			}
		},
		//虚拟摄像头启动成功
		openVisurecamaraisOk : function(){
			startFlashVideoLive();
		},
		//虚拟摄像头启动失败
		theIgoAggistentisNoExist : function(){
			alert("虚拟摄像头启动失败");
			//如果是开播状态，停播
			anthorStopLive();
			$.ajax({
				   type:"GET",
		           url:GET_DOWNLOAD_IGO_URL,
		           data:"",
		           cache:false,
		           timeout:3000,
		           dataType:"json",
		           async:true,
		           success: function(data) {
		        	   if(0 == data.code)
			   			{
			   				$("#down_igo_service").attr("href",data.body.version_path);
			   			}
		        	   $(".live_show_handle .igo_downinfo").show();
		           },
		           error: function(XMLHttpRequest, textStatus, errorThrown){
		        	   $(".live_show_handle .igo_downinfo").show();
		           }
			});
		},
		//操作互动用户信息的显示删除
		opeMicUserInfo : function(micOrder, unn, micNum, opeType){
			if(null == videoObj || typeof videoObj != "object")
			{
				videoObj = swfobject.getObjectById("dynamicContent2");
			}
			var params = '{"micOrder":"'+micOrder+'","unn":"'+unn+'","micNum":"'+micNum+'","opeType":"'+opeType+'"}';
			videoObj.getMicSequene(params);
		},
		//助手网络连接断开，名师刷新页面，观众才能看到视频
		reFreshPage : function(){
			window.location.reload(true);
		},
		/**
		 * flash特效使用
		 * json字符串参数{"type":1,"status":0,"url":""}
		 * 参数说明：type1：边框2：组件3：全屏4：光影 5:音效	status：3:全删 2：单个删除1：添加
		 */
		setFlashEffVideo : function(Jsonvalue){
			if(null == videoObj || typeof videoObj != "object")
			{
				videoObj = swfobject.getObjectById("dynamicContent2");
				window.videoObj = videoObj;
			}
			if(null == videoObj || "undefined" == typeof videoObj)
			{
				setTimeout(function(){
					setFlashEffVideo(Jsonvalue);
				},1000);
				return;
			}
			try{
				if("undefined" != typeof videoObj.setSkillOverMeida)
				{
					videoObj.setSkillOverMeida(Jsonvalue);
				}else{
					setTimeout(function(){
						setFlashEffVideo(Jsonvalue);
					},1000);
					return;
				}
			}catch(e){
				//igoCommonUtils.igoTipsDialogue("setFlashEffVideo:"+IGO_DEFAULT_TIPS.T1080,null,null,false);
			}
		},
		/**
		 * 设置flash视频播放器参数
		 * zoom：0 显示 1 不显示 放大缩小
		 */
		setFlashOptions : function(){
			if(null == videoObj || typeof videoObj != "object")
			{
				videoObj = swfobject.getObjectById("dynamicContent2");
			}
			if(videoObj != null && "undefined" != typeof videoObj.setFlashOptions)
			{
				videoObj.setFlashOptions('{"zoom":1}');
			}else{
				setTimeout(setFlashOptions,2000);
			}
		},
		//flash日志显示的接口
		showFlashLogPrint : function(){
			if(null == videoObj || typeof videoObj != "object")
			{
				videoObj = swfobject.getObjectById("dynamicContent2");
			}
			try{
				videoObj.AddDebugInfo();
			}catch(e){
				igoCommonUtils.igoTipsDialogue("showFlashLogPrint:"+IGO_DEFAULT_TIPS.T1080,null,null,false);
			}
		},
		//上麦用户离开房间销毁flash对象
		destroyHtmlStopFlash : function(){
			window.onunload  = function(){
				userCloseFlashSocket();
			};
		}
	};

	destroyHtmlStopFlash();
	
	/**
	 * 稍后更新flash，延迟一天更新
	 */
	$("#cancelCheck_btn").click(function(){
		$("#flashCheck").hide();
		igoCommonUtils.igoCookie.set("isUpdateFlash","false",3);
	});

	//调用flash日志接口
	$("#showFlashLog").click(function(){
		showFlashLogPrint();
	});

	
	
	
	
	
	
	
	
	
});
