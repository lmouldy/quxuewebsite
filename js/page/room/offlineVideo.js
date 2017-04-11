define(function(require, exports, module){
	require('util/common');
	//require("/flowplayer/flowplayer-3.2.12.min");
	require("page/interface/iShare");

(function($){
	$('#header').load('../header.html',function(){
		require("page/header");
	});
	$('#footer').load('../footer.html');
	
	var um = new UserManager(),
    	cookie = um.cookie,
    	CommonUtils = um.commonUtils,
    	ajaxdata = um.ajaxData,
    	gc = um.gConfig,
    	bLogin = um.checkLogin();
	
	var jd1 = 0,jd2 = 0;
	var play_permit = 0;
	
	var gid = cookie.get("globalId");
	var ticid =  cookie.get("ticketId");
	
	var roomId = CommonUtils.getUrlParam("roomId"),
		cid = CommonUtils.getUrlParam("cid"),
		tid =  CommonUtils.getUrlParam("tid"),
		id = CommonUtils.getUrlParam("id")||"";
	
	
	//切换名师介绍和课程目录
	$(".ov-tab a").click(function(){
		$(".ov-tab a").removeClass("active");
		$(this).addClass("active");
		$(".intro-video").removeClass("active");
		$(".intro-teacher").removeClass("active");
		$("."+$(this).attr("data-rel")).addClass("active");
	});
	
	//获取课程信息
	var getCourseInfoById = function(cid){
		var getCourseInfoById_params={
				"courseId" : cid
			};
			ajaxdata.request('post',gc.AJAX_URL.shop.getCourseInfoById_url,getCourseInfoById_params,function(data){
				if(data.code==0){
					$(".clearfix dt").html(data.body.courseTitle);
					if(data.body.price==0){
						$(".clearfix .c-pirce span").html("免费");
					}
					else{
						$(".clearfix .c-pirce span").html("￥"+data.body.price);
					}
					$(".ov-c-poster img").attr("src",data.body.courseImg);
					$(".clearfix .c-vaild span").html(data.body.vaildTime);
					$(".clearfix .c-paid span").html(data.body.buyCount);
				}
				
			});
	};
	
	var loadVideo = function(){
		if("" == id){
			$(".ov-c-list ul").find("li").removeClass("on");
			$(".ov-c-list ul").find("li:eq(0)").addClass("on");
			id = $(".ov-c-list ul").find("li:eq(0)").attr("data-kjid");
			if($(".ov-c-list ul li").eq(0).attr("data-needPay")=="1"){
				getvideo(id,1);
			}else{
				getvideo(id,0);
			}
		}else{
			var len = $(".ov-c-list ul").find("li[data-kjid='"+id+"']").length;
			if(len > 0){
				if($(".ov-c-list ul").find("li[data-kjid='"+id+"']").attr("data-needPay") == "1"){
					getvideo(id,1);
				}else{
					getvideo(id,0);
				}
			}else{
				um.popupLayer.alert('在本课程内没有找到该课件！');
				return;
			}
			
		}
	};
	
	//根据课程id获取课程列表
	var getCourseWareListByCourseId = function(cid){
		var param = {
			"courseId" : cid
		};
		ajaxdata.request(gc.METHOD.P, gc.AJAX_URL.pws.getCoursewareInfoList_url, param, function(data){
			var htm = '';
			if(data.code == 0){
				for(var  i=0;i<data.body.length;i++){
					var spe1 = data.body[i].saleType ? '收费' : '免费';
					htm += '<li data-kjid="'+data.body[i].id+'" data-needPay="'+data.body[i].saleType+'">'+data.body[i].name+'<span>'+spe1+'</span></li>';
				}
				$(".ov-c-list ul").html(htm);
				$(".clearfix .c-time span").html(data.body.length);
				loadVideo();
			}else{
				um.popupLayer.alert(data.msg);
			}
		});
	};

	//获取名师介绍
	var getTeacherIntro = function(tid){
		var getTintro_params={
				"userGid" : tid
		};
		ajaxdata.request(gc.METHOD.P,gc.AJAX_URL.pws.getTeacherInfo_url,getTintro_params,function(data){
			if(data.code==0){
				$(".intro-teacher img").attr("src",data.body.userImg);
				$(".intro-teacher p").html(um.commonUtils.HTMLDecodeHandler(data.body.content));
				$(".ov-teacher label").html(data.body.title);
			}else if(data.code==1){
				$(".intro-teacher img").remove();
				$(".intro-teacher p").text("暂无介绍");
				$(".intro-teacher p").addClass("nothing1");
			}
			else{
				if(undefined != (data.msg)){
					um.popupLayer.alert(data.msg);
				}
			}
		});
	};
	
	//获取老师信息
	var getTeacherInfo = function(tid){
		var getTinfo_params={
			"globalId" : tid
		};
		ajaxdata.request(gc.METHOD.P, gc.AJAX_URL.usercenter.findUserBaseInfoByGlobalId_url, getTinfo_params,function(data){
			if(data.code==0){
				$(".ov-ava img").attr("src",data.body.userImageurl);
				$(".ov-teacher span").html(data.body.userNickname);
			}
			else{
				um.popupLayer.alert(data.msg);
			}
		});
	};
	
	//查询用户是否购买课程
	var checkIsBuyCourse = function(cid, gid){
		var param = {
			"courseId" : cid,
			"globalId" : gid	
		};
		ajaxdata.request(gc.METHOD.P, gc.AJAX_URL.shop.checkUserCourse_url, param, function(data){
			if(data.code == 0){
				play_permit = 0;
				$(".ov-pay-link").removeClass("disable");
			}
			else if(data.code==-1){
				play_permit = 1;
				jd2 = 1;
				$(".ov-pay-link").addClass("disable");
			}
		});
	};
	
	//进入课程购买页
	$(".ov-pay-link").click(function(){
		if(!bLogin){
			openLoginRegistDialog("login.html");
			return;
		}
		if($(this).hasClass("disable")){
			return;
		}
		if(jd2){
			um.popupLayer.alert("您已购买了该课程，无须再次购买");
		}
		else{
			$(this).attr("href", '/purchase.html?tid='+tid+"&cid="+cid);
		}
	});
	
	
	//设置学习记录 -- 已登录用户调用
	function setLearnRecord(kjid){
		ajaxdata.request(gc.METHOD.P, gc.AJAX_URL.pws.learnRecord_url, {"globalId":cookie.get("globalId"), "coursewareId":kjid}, function(data){
			if(data.code == 0){}
		});
	}
	
	//获取视频的m3u8地址并播放
	function initVideoByFieldId(videoFileId){
		var param={
			"fileId" : videoFileId
		};
		ajaxdata.request(gc.METHOD.P, gc.AJAX_URL.vms.initVideo_url, param, function(data){
			if(data.code==0){
				imageUrl = "/images/default/room/room_course_bg.png";
				tempUrl = data.body.m3u8;
				$("#player").attr("data-url",tempUrl);
				
				require.async("../../../vodplayer/flowplayer.min.js", function(){
					flowplayer($("#player .flowplayer"), {
						swfHls:window.location.protocol+"//"+window.location.host+"/vodplayer/flowplayerhls.swf",
						autoplay:true,loop:true,tooltip:false,
					    clip: {
					        sources: [
					              { type: "application/x-mpegurl",
					                src: $("#player").attr("data-url") }
					        ],
					        flashls:{maxbufferlength:30,maxbackbufferlength:30}
					    }
					}).load({
							autoplay:true,loop:true,
					        sources: [
					              { type: "application/x-mpegurl",
					                src: $("#player").attr("data-url") }
					        ],
					        flashls:{maxbufferlength:30,maxbackbufferlength:30}
					    });
				});
				
			}
			else{
				if(undefined != (data.msg)){
					um.popupLayer.alert(data.msg);
				}
			}
		});
	}
	
	//查看播放次数
	function getLearnCountByCoursewareId(kjid){
		var getLearnCountByCoursewareId_params = {
				"coursewareId" : kjid
		};
		ajaxdata.request(gc.METHOD.P,gc.AJAX_URL.pws.getLearnCountByCoursewareId_url, getLearnCountByCoursewareId_params, function(data){
			if(data.code==0){
				$(".played-num span").html(data.body.learnCount);
			}
			else{
				$(".played-num span").html(0);
			}
		});
	}
	
	
	//确定可以播放，进行播放
	function do_play(kjid){
		var getKJ_params={
			"id" : kjid
		};
		ajaxdata.request(gc.METHOD.P, gc.AJAX_URL.pws.getCoursewareInfoById_url, getKJ_params, function(data){
			if(data.code==0){
				$(".ov-tit").html(data.body.name);
				//记录学习历史
				if(bLogin){
					setLearnRecord(kjid);
				}
				//拿到fileId获取m3u8地址并播放
				if(data.body.vedioFileId){
					initVideoByFieldId(data.body.vedioFileId);
				}else{
					um.popupLayer.alert("无此视频信息");
				}
				
				//查看播放次数
				getLearnCountByCoursewareId(kjid);
			}
			else{
				if(undefined != (data.msg)){
					um.popupLayer.alert(data.msg);
				}
			}
		});
	}
	
	//根据课件id获取视频
	function getvideo(kjid, jd_permit){
		//判断是否收费课件是否已购买    jd_permit为1则为收费
		if(jd_permit == 1){
			if(!bLogin){
				openLoginRegistDialog('login.html');
				um.popupLayer.alert('该课件为收费课件，请先登录购买该课程！');
				return;
			}
			//课程收费且当前用户不是该课程老师时提示购买
			if(play_permit == 0 && tid != cookie.get("globalId")){
				um.popupLayer.alert('该课件为收费课件，请购买课程后进行观看！');
				return;
			}
			else {
				if(kjid){do_play(kjid);};
			}
		}
		else{
			play_permit = 1;
			if(kjid){do_play(kjid);};
		}
		
	}
	
	//点击课程列表
	$(".ov-c-list ul").delegate("li", "click", function(){
		if($(this).attr("data-kjid")!=""){
			$(this).addClass("on").siblings().removeClass("on");
			if($(this).attr("data-needPay")=="1"){
				getvideo($(this).attr("data-kjid"),1);
			}
			else{
				getvideo($(this).attr("data-kjid"),0);
			}
		}
	});
	
	//获取评论内容
	function getComment(){
		var getCourseCommentPage_params = {
				"courseId" : cid,
				"pageNo" : 1,
				"pageSize" : 1000
		};
		ajaxdata.request(gc.METHOD.P,gc.AJAX_URL.pws.getCourseCommentPage_url,getCourseCommentPage_params,function(data){//根据收藏与否确定功能为取消后场还是收藏
			if(data.code==0){
				$(".review-num span").html(data.body.totalCount);
				var htm = '';
				var obj = data.body.result;	
				for(var i=0;i<obj.length;i++){
					var content = obj[i].content;
					htm += '<div class="show-review"><div class="review-con">';
					htm += '<img src="'+obj[i].userImg+'">';
					htm += '<div class="review-info">';
					htm += '<p class="con-name">'+obj[i].userName+'</p>';
					htm += '<p class="con-time">'+obj[i].createTime+'</p>';
					htm += '<p class="con-text">'+CommonUtils.replaceHtmlCommon(decodeURI(content))+'</p>';
					htm += '</div></div></div>';
				}
				$(".review-window").html(htm);

				//if(jd1){//如果是发表了评论刷新，则跳至底部
				//	$(".review-window").scrollTop( $(".review-window .show-review").length*parseInt($(".show-review").css("height")) );
				//	$("body,html").animate({'scrollTop':parseInt($(".review-top").offset().top)},1000);
				//}
			}
			else{
				if(undefined != (data.msg)){
					um.popupLayer.alert(data.msg);
				}
			}
		});
	}
	
	//验证是否收藏 
	function checkKeepCourse(){
		var checkKeepCourse_params={
				"globalId" : gid,
				"ticketId" : ticid,
				"courseId" : cid
		};
		ajaxdata.request(gc.METHOD.P, gc.AJAX_URL.pws.checkKeepCourse_url, checkKeepCourse_params,function(data){
			if(data.code==0){
				$(".collect").removeClass("done");
			}else{
				$(".collect").addClass("done");
			}
		});
	}

	$(".collect").click(function(){
		if(!bLogin){
			openLoginRegistDialog("login.html");	
			return;
		}
		var do_focusurl = gc.AJAX_URL.pws.keepCourse_url; 
		//根据收藏与否确定功能为取消收藏还是收藏
		if($(this).hasClass("done")){
			do_focusurl = gc.AJAX_URL.pws.cancelKeepCourse_url;
		}
		var param = {
				"globalId" : gid,
				"ticketId" : ticid,
				"courseId" : cid
		};
		ajaxdata.request(gc.METHOD.P, do_focusurl, param,function(data){
			if(data.code==0){
				um.popupLayer.alert("取消收藏成功！");
				checkKeepCourse();
			}
			else{
				if(undefined != (data.msg)){
					um.popupLayer.alert(data.msg);
				}
			}
		});
	});

	$(function(){
		$(".ov-room-link").attr("href", "/rm/"+roomId);
		getCourseInfoById(cid);
		getCourseWareListByCourseId(cid);
		getTeacherInfo(tid);
		if(bLogin){
			checkIsBuyCourse(cid, cookie.get("globalId"));
			checkKeepCourse();
		}
		getComment();
		getTeacherIntro(tid);
	});
	
	//发表评论
	$(".do-review .review-btn").click(function(){
		if(!bLogin){
			openLoginRegistDialog('login.html');
			return;
		}
		if("" == $(".do-review input").val()){
			um.popupLayer.alert("请输入评论内容！");
			return;
		}
		var saveCourseComment_params = {
				"globalId" : gid,
				"ticketId" : ticid,
				"courseId" : cid,
				"content" : encodeURI($(".do-review input").val())
		};
		ajaxdata.request('post',gc.AJAX_URL.pws.saveCourseComment_url,saveCourseComment_params,function(data){
			if(data.code==0){
				um.popupLayer.msg("发表评论成功！");
				jd1 = 1;
				$(".do-review input").val("");
				getComment();
			}else{
				um.popupLayer.alert(data.msg);
			}
		});
	});
	
	
	//分享
	$(".share-way .weibo").click(function(){
		var anthorName = $(".ov-tit").html(),
			Cimg = $(".ov-c-poster img").attr("src");
		var sTips =  '趣学:'+anthorName;
		var Share = new IShare({"title":sTips,"pic":Cimg});
		Share.shareWeibo();
	});
	$(".share-way .qq").click(function(){
		var anthorName = $(".ov-tit").html(),
		Cimg = $(".ov-c-poster img").attr("src");
		var sTips =  '趣学:'+anthorName;
		var si = "书法报视频" ;
		var Share = new IShare({"title":sTips,"pics":Cimg,"site":si,"summary":"书法报视频-中国书法报视频门户网站"});
		Share.shareQQ();
	});
	$(".share-way .qzong").click(function(){
		var anthorName = $(".ov-teacher span").html(),
		Cimg = $(".ov-c-poster img").attr("src");
		var sTips =  '小伙伴们，快来看“'+anthorName+'”的精彩课程吧！';
		var si = "书法报视频"+anthorName+"直播间提供"+anthorName+"的精彩直播、离线课程、艺术活动、学术研究等各种精彩内容。" ;
		var Share = new IShare({"desc":sTips,"pics":Cimg,"summary":si});
		Share.shareQZone();
	});
	$(".share-way .weixin").click(function(){
		var anthorName = $(".ov-teacher span").html(),
		Cimg = $(".ov-c-poster img").attr("src");
		var sTips =  '趣学 '+anthorName+'”的精彩课程吧！';
		var WxUrl = window.location.href;
		var Share = new IShare({"title":sTips,"pic":Cimg,"url":WxUrl});
		Share.shareWeixin2();
	});
	
	
})(jQuery);
});