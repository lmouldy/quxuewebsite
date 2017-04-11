define(function(require, exports, module){
	require('util/common');
	require('swfobject/swfobject');
	$('#header').load('./header.html',function(){
		require('page/header');
	});
	$('#footer').load('./footer.html');

	var um = new UserManager(),
		gMethod = um.gConfig.METHOD,
		gUrl = um.gConfig.AJAX_URL;

	$(function(){
		var getIndexData = function(){
			um.ajaxData.request(gMethod.G, gUrl.datahouse.queryByKey_url, {
				key: "VEDIO_RECOMMEND,ACTIVITY,TEACHER_RECOMMEND,TEACHER_LESSON,LIVE_PREVIEW,STATION_EVENTS,CALLIGRAPHY_ASK,CALLIGRAPHY_CREATE,COVER_MAN,DIANBO_RECOMMEND,TALKING_LIST"
			},function(data){
				if(data.code == 0){
					//热门直播
					if(data.body.TEACHER_RECOMMEND){
						var json = data.body.TEACHER_RECOMMEND,
							shtml = '';

						$.each(json,function(index, value){

							if(index < 6){
								shtml += '<dd class="live-box"><a href="/rm/'+ value.roomId +'">';
								shtml += '<img src="'+ value.roomImage +'" alt=""></a>';
								shtml += '<a href="/rm/'+ value.roomId +'" class="nickname">'+ value.roomTitle +'</a>';
								if(value.liveState && value.liveState == 1){
									shtml += '<span class="onlive">直播</span>';
								}
								shtml += '</dd>'; 	
							}

						});

						if(!json.length){
							shtml += '<h4>暂无数据</h4>'
						}

						$('#onlive-box').html(shtml);

					}
					//展赛活动
					if(data.body.STATION_EVENTS){
						var json = data.body.STATION_EVENTS,
							shtml = '';

						$.each(json,function(index, value){

							if(index < 6){
								shtml += '<dd class="live-box"><a href="'+ value.vedioUrl +'">';
								shtml += '<img src="'+ value.showImage +'" alt=""></a>';
								shtml += '<a href="'+ value.vedioUrl +'" class="nickname">'+ value.title +'</a>';
								shtml += '</dd>'; 	
							}

						});

						if(!json.length){
							shtml += '<h4>暂无数据</h4>'
						}

						$('#STATION_EVENTS').html(shtml);

					}
					
					//书法问答
					if(data.body.CALLIGRAPHY_ASK){
						var json = data.body.CALLIGRAPHY_ASK,
							shtml = '';

						$.each(json,function(index, value){

							if(index < 6){
								shtml += '<dd class="live-box"><a href="'+ value.vedioUrl +'">';
								shtml += '<img src="'+ value.showImage +'" alt=""></a>';
								shtml += '<a href="'+ value.vedioUrl +'" class="nickname">'+ value.title +'</a>';
								shtml += '</dd>'; 	
							}

						});

						if(!json.length){
							shtml += '<h4>暂无数据</h4>'
						}

						$('#CALLIGRAPHY_ASK').html(shtml);

					}
					
					//书法临创
					if(data.body.CALLIGRAPHY_CREATE){
						var json = data.body.CALLIGRAPHY_CREATE,
							shtml = '';

						$.each(json,function(index, value){

							if(index < 6){
								shtml += '<dd class="live-box"><a href="'+ value.vedioUrl +'">';
								shtml += '<img src="'+ value.showImage +'" alt=""></a>';
								shtml += '<a href="'+ value.vedioUrl +'" class="nickname">'+ value.title +'</a>';
								shtml += '</dd>'; 	
							}

						});

						if(!json.length){
							shtml += '<h4>暂无数据</h4>'
						}

						$('#CALLIGRAPHY_CREATE').html(shtml);

					}
					
					//封面人物
					if(data.body.COVER_MAN){
						var json = data.body.COVER_MAN,
							shtml = '';

						$.each(json,function(index, value){
							var imgUrl = value.showImage.split(',')[0];

							if(index < 6){
								shtml += '<li><a href="person.html?id='+ value.id +'">';
								shtml += '<img src="'+ imgUrl+'"></a></li>';	
							}

						});

						if(!json.length){
							shtml += '<h4>暂无数据</h4>'
						}

						$('#COVER_MAN').html(shtml);

					}

					//点播推荐
					if(data.body.DIANBO_RECOMMEND){
						var json = data.body.DIANBO_RECOMMEND,
							shtml_text_r = '',
							shtml_text_l = '',
							shtml = '';

						$.each(json,function(index, value){
							//大图
							if(index == 0){
								$('#DIANBO_RECOMMEND .demand-box .demand-img')
									.html('<a href="profile-item.html?type=video&id='+ value.id +'"><img src="'+ value.showImage+'"></a>');
							}

							//右边5排标题
							if(index > 0 && index < 6){
								shtml_text_r += '<li><a href="profile-item.html?type=video&id='+ value.id +'">';
								shtml_text_r += value.title+'</a></li>';	
							}

							//左边三排标题
							if(index > 5 && index < 9){
								shtml_text_l += '<li><a href="profile-item.html?type=video&id='+ value.id +'">';
								shtml_text_l += value.title+'</a></li>';	
							}

							if(index > 8 && index < 15){
								shtml += '<li><img src="'+ value.showImage +'">';
								shtml += '<span><a href="profile-item.html?type=video&id='+ value.id +'">'+ value.title +'</a>';
								shtml += '</span></li>';
							}
						});

						$('#DIANBO_RECOMMEND .demand-box .demand-list ul').html(shtml_text_r);
						$('#DIANBO_RECOMMEND .demand-box-01 .demand-list ul').html(shtml_text_l);
						$('#DIANBO_RECOMMEND .demand-box-01 .demand-play ul').html(shtml);
					}
					//开谈
					if(data.body.TALKING_LIST){
						json = data.body.TALKING_LIST;
						shtml = '';
						$.each(json, function(index, value){
							if(index < 6){
								var linkUrl = "profile-item.html?type=kt&id="+value.id;
								shtml += '<dd class="live-box"><a href="'+linkUrl+'" target="_blank"><img src="'+value.imgUrl+'" alt="'+value.title+'"></a>';
								shtml += '<a href="'+linkUrl+'" class="nickname" target="_blank">'+value.title+'</a></dd>';
							}
						});
						if(!json.length){
							shtml += '<h4>暂无数据</h4>';
						}
						$("#kt-box").html(shtml);
					}
					
					//名师讲堂
					if(data.body.TEACHER_LESSON){
						json = data.body.TEACHER_LESSON;
						shtml = '';

						$.each(json,function(index, value){

							if(index < 6){
								shtml += '<dd class="live-box"><a href="./room/offlineVideo.html?tid='+ value.teacherId +'&cid='+ value.courseId +'&roomId='+ value.roomId +'">';
								shtml += '<img src="'+ value.courseImg +'" alt=""></a>';
								shtml += '<a href="./room/offlineVideo.html?tid='+ value.teacherId +'&cid='+ value.courseId +'&roomId='+ value.roomId +'" class="nickname">'+ value.courseTitle +'</a>';
								//shtml += '<span>￥'+ value.price +'</span><span>'+ value.buyCount +'人已学</span>'+'</dd>';
								shtml += '</dd>';
							}

						});

						if(!json.length){
							shtml += '<h4>暂无数据</h4>';
						}

						$('#teacher-lesson-box').html(shtml);
					}

					//首页视频
					if(data.body.VEDIO_RECOMMEND){
						var json = data.body.VEDIO_RECOMMEND;
						if(json[0]){
							if(json[0].liveState && json[0].liveState == 1){
								initVideo(json[0].liveUrl);
							}else{
								initVideoByFieldId(json[0].vedioUrl);
							}

							if(json[0].roomId){
								$(".video .enter-room").attr("href", '../rm/'+json[0].roomId);
							}else{
								$(".video .enter-room").remove();
							}
						}
					}
				}else{

					um.popupLayer.msg(data.msg||'异常错误',{
						icon:2,
						time:2000
					});
				}
			});
		};

		//加载首页视频播放器
		var initVideo = function(url){
			 var params = { menu: "false",wmode: "transparent"},
			 	 flashvars = {width:908,height:512},
			     attributes = {id: "qxPlayerid",name: "qxPlayerid"};
			swfobject.embedSWF(um.gConfig.PLAY_TYPE.INDEX_VIDEO,"qxPlayerId", 908, 512, "11.0.0", "../swfobject/expressInstall.swf", flashvars, params, attributes);

			playVideo(url);
		};
		var playVideo = function(rtmpUrl){
			var vobj = swfobject.getObjectById("qxPlayerid");
			if(vobj == null  || "function" != typeof vobj.playRtmpVideo){
				setTimeout(function(){
					playVideo(rtmpUrl);
				},1000);
			}else{
				vobj.playRtmpVideo('{"anchorUrl":"'+rtmpUrl+'","livetype":"1"}');
			}
		};
		getIndexData();

		//加载离线视频播放器
		function initVideoByFieldId(videoUrl){
			$("#fpVideoId").attr("data-url",videoUrl);
			require.async("../../vodplayer/flowplayer.min.js", function(){
				flowplayer($("#qxPlayerId .flowplayer"), {
					swfHls:window.location.protocol+"//"+window.location.host+"/vodplayer/flowplayerhls.swf",
					autoplay:true,loop:true,tooltip:false, bgcolor:"#fff",
				    clip: {
				        sources: [
				              { type: "application/x-mpegurl",
				                src: $("#fpVideoId").attr("data-url") }
				        ],
				        flashls:{maxbufferlength:30,maxbackbufferlength:30}
				    }
				});
			});
		}

		//精彩预告点击事件
		$('.preview dl').on('click', '.preview-box', function(event) {
			event.preventDefault();
			var url = $(this).children('a').attr('href');
			window.location.href = url;
		});
	});
});
