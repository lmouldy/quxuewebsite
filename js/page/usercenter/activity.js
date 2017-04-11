define(function(require, exports, module){
	require("umeditor/umeditor.config");
	var um = new UserManager(),
		commonUtils = um.commonUtils,
		gc = um.gConfig,
		iUserCenter = new IUserCenter();
	var editor = null;
	
	function loadEditor(){
		require.async("umeditor/umeditor.min", function(){
			require.async("umeditor/lang/zh-cn", function(){
				var opts = {
						imageUrl:um.gConfig.UPLOAD.AVA,
				        toolbar:[
				            'bold italic underline strikethrough | forecolor backcolor | removeformat |',
				            ' selectall cleardoc paragraph | fontfamily fontsize' ,
				            '| justifyleft justifycenter justifyright justifyjustify |',
				            'link unlink '//| image 
				        ],
				        initialFrameWidth: 880,
				        initialFrameHeight:300
				    };
				    editor = UM.getEditor('activityEditor', opts);
				
			});
		});
	}
	
	
	var loadActivityList = function(){
		iUserCenter.getArtActivityList(um.cookie.get("globalId"), function(data){
			var sHtml = "";
			if(data.code == 0){
				
				var obj = data.body;
				for(var i=obj.length-1; i>=0; i--){
					sHtml += '<li class="u-list-item" id="'+obj[i].id+'">'
						+ '<div class="fl notice-info">'
						+ '<h3>'+obj[i].title+'</h3>'
						+ '<div class="notice-content">'+commonUtils.HTMLDecodeHandler(obj[i].content)+'</div>'
						+ '</div>'
						+ '<div class="fr notice-handle">'
						+ '<p class="notice-date">'+obj[i].lastTime+'</p>'
						+ '<p><a class="notice-edit" href="javascript:void(0);">编辑</a>'
						+ '<a class="notice-delete" href="javascript:void(0);">删除</a></p>'
						+ '</div></li>';
				}
			}
			$(".ma-main ul").html(sHtml);
		});
	};
	
	loadActivityList();
	
	//新增
	$(".ma-main .u-add-btn").click(function(){
		if(um.checkLogin()){
			$(".u-pop-layer").show().siblings().hide();
			$(".u-pop-layer .submit-btn").removeAttr("data-id");
			$(".u-pop-layer .title-text").val("");
			if(editor == null){
				loadEditor();
			}
			$("#activityEditor").val("");
		}else{
			openLoginRegistDialog("login.html");
		}
	});
	
	//删除
	$(".ma-main ul").delegate("li .notice-delete", "click", function(data){
		var id = $(this).parents("li").attr("id");
		um.popupLayer.confirm("您确定要删除该内容吗？",
			{btn:['确定', '取消']},
			function(index){
				iUserCenter.delArtActivity(id, function(data){
					if(data.code == 0){
						um.popupLayer.msg("操作成功！");
						loadActivityList();
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
	
	//编辑
	$(".ma-main ul").delegate("li .notice-edit", "click", function(data){
		$(".u-pop-layer").show().siblings().hide();
		$(".u-pop-layer .submit-btn").attr("data-id", $(this).parents("li").attr("id"));
		$(".u-pop-layer .title-text").val($(this).parents("li").find("h3").text());
		var content = $(this).parents("li").find(".notice-content").html();
		
		if(editor == null){
			loadEditor();
		}
		$("#activityEditor").text(content);
		
	});
	
	//保存内容
	$(".u-pop-layer .submit-btn").click(function(){
		var teacherId = um.cookie.get("globalId"),
			title = $(".u-pop-layer .title-text").val(),
			content = editor.getContent();
		if("" == title){
			um.popupLayer.alert("请输入标题！");
			return;
		}
		if("" == content){
			um.popupLayer.alert("请输入正文内容！");
			return;
		}
		title = commonUtils.replaceHtmlCommon(title);
		
		if($(this).attr("data-id")){
			//更新
			iUserCenter.updateArtActivity($(this).attr("data-id"), teacherId, title, content, function(data){
				if(data.code == 0){
					um.popupLayer.msg("操作成功！");
					$(".ma-main").show().siblings().hide();
					loadActivityList();
				}else{
					um.popupLayer.alert("操作失败！");
				}
			});
			
		}else{
			//新增
			iUserCenter.addArtActivity(teacherId, title, content, function(data){
				if(data.code == 0){
					um.popupLayer.msg("操作成功！");
					$(".ma-main").show().siblings().hide();
					loadActivityList();
				}else{
					um.popupLayer.alert("操作失败！");
				}
			});
		}
	});
	//取消
	$(".u-pop-layer .cancel-btn").click(function(){
		$(".ma-main").show().siblings().hide();
	});

});