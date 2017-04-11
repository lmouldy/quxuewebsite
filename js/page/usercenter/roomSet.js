define(function(require, exports, module){
	require("uploadify/jquery.uploadify.min");

	var um = new UserManager(),
		gUrl = um.gConfig.AJAX_URL,
		cookie = um.cookie,
		iUserCenter = new IUserCenter(),
		roomType,roomGlobalId;
	
	var roomTypeObj = {
		'1':'钢笔字帖',	
		'2':'行书',
		'3':'行书字帖',
		'4':'硬笔书法',
		'5':'楷书',
		'6':'字帖'
	};
	
	var loadRoomInfo = function(){
		um.getUserRoom(cookie.get("globalId"), cookie.get("ticketId"), function(data){
			if(data.code == 0){
				roomType = data.body.roomType;
				roomGlobalId = data.body.roomGlobalId;
				$(".rs-main .rs-poster img").attr("src", data.body.roomImage);
				$(".live-img").html("<img src='"+ data.body.roomImage +"'>");
				$(".rs-main .rs-room-link").attr("href", "/rm/"+data.body.roomId);
				$(".rs-main .rs-id label").html(data.body.roomId);
				$(".rs-main .rs-type label").html(roomTypeObj[data.body.roomType]);
				$(".rs-main .rs-name label").html(data.body.roomTitle);
				$(".rs-pop-layer .room-id").html(data.body.roomId);
				$(".rs-pop-layer .room-title").val(data.body.roomTitle);
				var state = data.body.validStatus == 1 ? "正常使用" : "停止使用";
				$(".rs-main .rs-status label").html(state);
			};
		});
	};
	
	loadRoomInfo();
	
	
	function loadRoomManagerList(){
		um.ajaxData.request('post',gUrl.room.showManagerList_url,
				{
					"roomGlobalId": roomGlobalId
				},function(data){
					var json = data.body,
						shtml = '';

					$.each(json, function(index, value){
						shtml += '<li><span data-gid="'+ value.globalId +'">'+ value.userNickname +'</span>';
						shtml += '<a class="rs-delete" href="javascript:void(0);"></a></li>';
					});

					$('.rs-add-manager ol').html(shtml);
				});
	}
	//房间设置
	$(".rs-main .rs-edit-btn").click(function(){
		$(".u-pop-layer").show().siblings().hide();
		loadRoomManagerList();
		
	});
	
	//添加管理
	$('.add-btn').click(function(){
		$('.rs-add-manager-val').show();
	});
	$('.rs-add-manager-val a').click(function(){
		var name = $(this).prev('input').val();
		var param = {
			"globalId": um.cookie.get('globalId'),
			"ticketId": um.cookie.get('ticketId'),
			"type": 1
		};
		if(name == ''){
			um.popupLayer.alert('昵称不能为空');
			return false;
		};
		param.name = name;
		iUserCenter.addOrDelManager(param,function(data){
			if(data.code == 0){
				um.popupLayer.msg('添加成功',{
					icon:1,
					time:2000
				});
				$(this).prev('input').val("");
				loadRoomManagerList();
			}else{
				um.popupLayer.alert('添加失败');
			}
		});
	});
	
	//删除管理
	$('.rs-add-manager ol ').on('click','.rs-delete', function(event) {
		var param = {
			"globalId": um.cookie.get('globalId'),
			"ticketId": um.cookie.get('ticketId'),
			"optOn": $(this).prev().data("gid"),
			"type": 2
		};
		iUserCenter.addOrDelManager(param,function(data){
			if(data.code == 0){
				um.popupLayer.msg('删除成功',{
					icon:1,
					time:2000
				});
				loadRoomManagerList();
			}else{
				um.popupLayer.alert('删除失败');
			}
		});
	});

	//保存房间设置
	$(".u-pop-layer .submit-btn").click(function(){
		var roomTitle = $('.room-title').val(),
		roomImage = $('.live-img img').attr('src'),
		smallImage = $('.live-img img').attr('src');
		iUserCenter.setUserRoom(cookie.get("globalId"), cookie.get("ticketId"), roomTitle, roomImage, smallImage, roomType, function(data){
			if(data.code == 0){
				um.popupLayer.msg("操作成功！");
				$(".rs-main .rs-poster img").attr("src", roomImage);
				$(".rs-main").show().siblings().hide();
			}else{
				um.popupLayer.alert("操作失败！");
			}
		});
		
	});
	
	$(".u-pop-layer .cancel-btn").click(function(){
		$(".rs-main").show().siblings().hide();
		$('.rs-add-manager-val').hide();
	});

	//上传图片
	$("#uploadify").uploadify({
		"swf"      : "js/uploadify/uploadify.swf",
		"uploader" : um.gConfig.UPLOAD.AVA,
		"buttonText":"上传直播间图片",
		"height":30,
		"width":130,
		"removeTimeout":10,
		"multi":false,
		"fileTypeExts":"*.jpg;*.png;*.gif;*.bmp",
		"fileSizeLimit":"512kb",
		"uploadLimit ":1,
		"queueSizeLimit":1,
		"fileObjName": "file",
		"onInit": function () {                        
			$("#uploadify-queue").hide();
	    },
		"onUploadSuccess":function(file,data,response){
			$("#uploadify-queue").hide();
			data = $.evalJSON(data);
			var imgUrl = um.gConfig.UPLOAD.url + data.body.url;
			$(".live-img").html("<img src='"+ imgUrl +"'>");
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