define(function(require, exports, module){
	require("uploadify/jquery.uploadify.min");
	var um = new UserManager(),
		gc = um.gConfig;
		iUserCenter = new IUserCenter();
	
	var loadWorksList = function(){
		iUserCenter.getWorksList(um.cookie.get("globalId"), function(data){
			var sHtml = "";
			if(data.code == 0){
				var obj = data.body;
				for(var i=0; i<obj.length; i++){
					sHtml += '<li id="'+obj[i].id+'">'
						+ '<div class="works-pic"><img src="'+obj[i].imgUrl+'"></div>'
						+ '<p class="works-name ellipsis">'+obj[i].name+'</p>'
						+ '<p class="works-btn"><a class="works-edit" href="javascript:void(0);"></a><a class="works-del" href="javascript:void(0);"></a></p>'
						+ '</li>';
				}
			}
			$(".works-main ul").html(sHtml);
		});
	};
	
	loadWorksList();
	
	
	//上传图片
	$("#uploadPic").uploadify({
		"swf"      : "js/uploadify/uploadify.swf",
		"uploader" : gc.UPLOAD.AVA,
		"buttonImage":"../images/default/usercenter/upload_pic_btn.png",
		"height":200,
		"width":200,
		"removeTimeout":10,
		"multi":false,
		"fileTypeExts":"*.jpg;*.png;*.gif;*.bmp",
		"fileSizeLimit":"512kb",
		"uploadLimit ":1,
		"queueSizeLimit":1,
		"fileObjName": "file",
		"onInit": function () {                        
			$("#uploadPic-queue").hide();
	    },
		"onUploadSuccess":function(file,data,response){
			$("#uploadPic-queue").hide();
			data = $.evalJSON(data);
			imgUrl = gc.UPLOAD.url + data.body.url;
			$(".u-pop-layer .pic-show img").attr("src", imgUrl);
	    },
		  "onUploadError":function(){
			um.popupLayer.alert("系统繁忙，请稍后再试");
		},
		 "onFallback":function(){
			alert("请安装flash插件");
	        window.location.href="http://get.adobe.com/cn/flashplayer/otherversions/";
	    }
	});
	
	//新增
	$(".works-main .u-add-btn").click(function(){
		$(".u-pop-layer").show().siblings().hide();
		$(".u-pop-layer .submit-btn").removeAttr("data-id");
		$(".u-pop-layer .title-text").val("");
		$(".u-pop-layer .pic-show img").attr("src", "");
	});
	
	//编辑
	$(".works-main ul").delegate("li .works-edit", "click", function(data){
		$(".u-pop-layer").show().siblings().hide();
		$(".u-pop-layer .submit-btn").attr("data-id", $(this).parents("li").attr("id"));
		$(".u-pop-layer .title-text").val($(this).parents("li").find(".works-name").text());
		imgUrl = $(this).parents("li").find(".works-pic img").attr("src");
		$(".u-pop-layer .pic-show img").attr("src", imgUrl);
	});
	
	//保存
	//保存内容
	$(".u-pop-layer .submit-btn").click(function(){
		var teacherId = um.cookie.get("globalId"),
			title = $(".u-pop-layer .title-text").val();
		if("" == title){
			um.popupLayer.alert("请输入标题！");
			return;
		}
		if("" == imgUrl){
			um.popupLayer.alert("请上传图片！");
			return;
		}
		if($(this).attr("data-id")){
			//更新
			iUserCenter.updateWorks($(this).attr("data-id"), teacherId, title, imgUrl, function(data){
				if(data.code == 0){
					um.popupLayer.msg("操作成功！");
					$(".works-main").show().siblings().hide();
					loadWorksList();
				}else{
					um.popupLayer.alert("操作失败！");
				}
			});
			
		}else{
			//新增
			iUserCenter.addWorks(teacherId, title, imgUrl, function(data){
				if(data.code == 0){
					um.popupLayer.msg("操作成功！");
					$(".works-main").show().siblings().hide();
					loadWorksList();
				}else{
					um.popupLayer.alert("操作失败！");
				}
			});
		}
	});
	//取消
	$(".u-pop-layer .cancel-btn").click(function(){
		$(".works-main").show().siblings().hide();
	});
	
	//删除
	$(".works-main ul").delegate("li .works-del", "click", function(){
		var id = $(this).parents("li").attr("id");
		um.popupLayer.confirm("您确定要删除该内容吗？",
			{btn:['确定', '取消']},
			function(index){
				iUserCenter.delWorks(id, function(data){
					if(data.code == 0){
						um.popupLayer.msg("操作成功！");
						loadWorksList();
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
		
	});
	
});