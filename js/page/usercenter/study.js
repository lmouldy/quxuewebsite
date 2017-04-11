define(function(require, exports, module){
	require("umeditor/umeditor.config");
	var um = new UserManager(),
		commonUtils = um.commonUtils,
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
				            'link unlink'//| image 
				        ],
				        initialFrameWidth: 880,
				        initialFrameHeight:300
				    };
				    editor = UM.getEditor('studyEditor', opts);
				
			});
		});
	}
	
	
	var loadStudyList = function(){
		iUserCenter.getStudyList(um.cookie.get("globalId"), function(data){
			var sHtml = "";
			if(data.code == 0){
				var obj = data.body;
				for(var i=0; i<obj.length; i++){
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
			$(".ms-main ul").html(sHtml);
		});
	};
	
	loadStudyList();
	
	//新增
	$(".ms-main .u-add-btn").click(function(){
		$(".u-pop-layer").show().siblings().hide();
		$(".u-pop-layer .submit-btn").removeAttr("data-id");
		$(".u-pop-layer .title-text").val("");
		if(editor == null){
			loadEditor();
		}
		$("#studyEditor").val("");
	});
	
	//删除
	$(".ms-main ul").delegate("li .notice-delete", "click", function(data){
		var id = $(this).parents("li").attr("id");
		um.popupLayer.confirm("您确定要删除该内容吗？",
			{btn:['确定', '取消']},
			function(index){
				iUserCenter.delStudy(id, function(data){
					if(data.code == 0){
						um.popupLayer.msg("操作成功！");
						loadStudyList();
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
	$(".ms-main ul").delegate("li .notice-edit", "click", function(data){
		$(".u-pop-layer").show().siblings().hide();
		$(".u-pop-layer .submit-btn").attr("data-id", $(this).parents("li").attr("id"));
		$(".u-pop-layer .title-text").val($(this).parents("li").find("h3").text());
		$("#studyEditor").text($(this).parents("li").find(".notice-content").html());
		if(editor == null){
			loadEditor();
		}
		
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
		if($(this).attr("data-id")){
			//更新
			iUserCenter.updateStudy($(this).attr("data-id"), teacherId, title, content, function(data){
				if(data.code == 0){
					um.popupLayer.msg("操作成功！");
					$(".ms-main").show().siblings().hide();
					loadStudyList();
				}else{
					um.popupLayer.alert("操作失败！");
				}
			});
			
		}else{
			//新增
			iUserCenter.addStudy(teacherId, title, content, function(data){
				if(data.code == 0){
					um.popupLayer.msg("操作成功！");
					$(".ms-main").show().siblings().hide();
					loadStudyList();
				}else{
					um.popupLayer.alert("操作失败！");
				}
			});
		}
	});
	//取消
	$(".u-pop-layer .cancel-btn").click(function(){
		$(".ms-main").show().siblings().hide();
	});
});