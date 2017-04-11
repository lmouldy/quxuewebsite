define(function(require, exports, module){
	require('util/config');
	require('util/common');

	$('#header').load('./header.html',function(){
		$('#header .not-logged .nav li').removeClass('active').eq(1).addClass('active');
		$('#header .logged-in .nav li').removeClass('active').eq(2).addClass('active');
		require('page/header');
	});
	$('#footer').load('./footer.html');

	var um = new UserManager(),
		gMethod = um.gConfig.METHOD,
		gUrl = um.gConfig.AJAX_URL;

	$(function(){
		function getData(param, callback){
			var arr = param.split(',');
			if(arr[0] == "LIVE_RECOMMEND_0" && arr[1] == "STUDY_CLASS_0"){
				arr[0] = "LIVE_RECOMMEND";
				arr[1] = "STUDY_CLASS";
				param = arr.join(',');
			}

			um.ajaxData.request('get',gUrl.datahouse.queryByKey_url,{key:param},function(data){
				callback(data,param);
			})
		}

		//渲染DOM
		function renderDom (data,id){
			var arr = id.split(',');

/*			//正在直播
			if(data.code == 0){
				var shtml = '';

				if(data.body[arr[0]] && data.body[arr[0]].length > 0){
					json = data.body[arr[0]];

					$.each(json, function(index, value){

						shtml += '<dd class="live-box"><a href="/rm/'+ value.roomId +'">';
						shtml += '<img src="'+ value.roomImage +'" alt=""></a>';
						shtml += '<a href="/rm/'+ value.roomId +'" class="nickname">'+ value.roomTitle +'</a>';
						if(value.livestate&&value.livestate == 1){
							shtml += '<span class="onlive">直播</span>'+'</dd>';
						}
					});

				}else{
					shtml += '<dd class="live-box">暂无数据</dd>';
				}

				$('.onlive-box').append(shtml);
			}*/
			//学习课堂
			if(data.code == 0){
				var shtml = '';
				if (data.body[arr[1]] && data.body[arr[1]].length > 0) {
					json = data.body[arr[1]];

					$.each(json, function(index, value){
						shtml += '<dd class="live-box"><a href="/room/offlineVideo.html?tid='+ value.teacherId +'&cid='+ value.courseId + '&roomId='+ value.roomId +'">';
						shtml += '<img src="'+ value.courseImg +'" alt=""></a>';
						shtml += '<a href="/room/offlineVideo.html?tid='+ value.teacherId +'&cid='+ value.courseId + '&roomId='+ value.roomId +'" class="nickname">'+ value.courseTitle +'</a>';
						shtml += '<span>￥'+ value.price +'</span><span>'+ value.buyCount +'人已学</span>'+'</dd>';
					});

				}else{
					shtml += '<dd class="live-box">暂无数据</dd>';
				}

				$('.study-box').append(shtml);
			}
		}

		//房间分类人数
		getData('COUNT_LESSON ',function(data){
			if(data.code == 0 && data.body.COUNT_LESSON ){
				var json = data.body.COUNT_LESSON ,
					shtml = '',html='';

				$.each(json, function(index, value){

					if(value.id == 0){
						html += '<li data-id="'+ value.id +'" class="navbar-active">'+ value.name +'('+ value.count +')</li>';
					}else{
						shtml += '<li data-id="'+ value.id +'">'+ value.name +'('+ value.count +')</li>';
					}

				});

				$('.navbar-list').append(html + shtml);
			}
		});

		getData('LIVE_RECOMMEND,STUDY_CLASS',renderDom);

		//导航点击事件
		$('.navbar-list').on('click', 'li', function(){
			$(this).addClass('navbar-active').siblings().removeClass('navbar-active');
			$('.live-box').remove();

			var id = $(this).data('id');
			getData('LIVE_RECOMMEND_' + id + ',STUDY_CLASS_' + id, renderDom);
		});
	})
})
