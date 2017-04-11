define(function(require, exports, module) {
	require('util/config');
	require('util/common');
	require("page/interface/iRoom");
	require("page/interface/iMsg");
	require('swfobject/swfobject');
	require("page/interface/iShare");

	var um = new UserManager(),
		commonUtils = um.commonUtils,
		gc = um.gConfig,
		cookie = um.cookie,
		bLogin = um.checkLogin();


	$('#header').load('./header.html', function() {
		$('#header .not-logged .nav li').removeClass('active').eq(1).addClass('active');
		$('#header .logged-in .nav li').removeClass('active').eq(2).addClass('active');
		if(!bLogin) {
			openLoginRegistDialog('login.html');
			$(".home").empty().html("请先登录");
			return;
		}
		require('page/header');
	});
	$('#footer').load('./footer.html');

	$(function() {
		var getChessRoom=function(){};
		//获取房间信息
		getChessRoom.getViewerList=function(){
			var shtml = '';
			var getIntro_params = {
				"type": 6,
			};
			um.ajaxData.request(gc.METHOD.P, gc.AJAX_URL.chessNew.getRoomInfoByType_url, getIntro_params, function(data) {
				if(data.code == 0) {
					if(data.body.length > 0) {
						var json = data.body;
						$.each(json, function(index, value) {
							if(cookie.get("globalId")==value.globalId) {   //老师
								shtml += '<dd class="live-box"><a href="/rtm/' + value.roomId + '">';
								shtml += '<img src="' + value.roomImage + '" alt=""></a>';
								shtml += '<a href="/rtm/' + value.roomId + '" class="nickname">' + value.roomTitle + '</a>';
							}else {
								shtml += '<dd class="live-box"><a href="/rsm/' + value.roomId + '">';
								shtml += '<img src="' + value.roomImage + '" alt=""></a>';
								shtml += '<a href="/rsm/' + value.roomId + '" class="nickname">' + value.roomTitle + '</a>';
							}
							if(value.livestate && value.livestate == 1) {
								shtml += '<span class="onlive">直播</span>' + '</dd>';
							}
						});

					} else {
						shtml += '<dd class="live-box">暂无数据</dd>';
					}

					$('.onlive-box').append(shtml);
				}

			});
		}
			
		getChessRoom.getViewerList();
		

		//导航点击事件
		$('.navbar-list').on('click', 'li', function() {
			$(this).addClass('navbar-active').siblings().removeClass('navbar-active');
			$('.live-box').remove();
			var id = $(this).data('id');

		});
	})
})