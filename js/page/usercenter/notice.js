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
				    editor = UM.getEditor('noticeEditor', opts);
				
			});
		});
	}
	
	
	var loadNoticeList = function(type){
		iUserCenter.getNoticeList(um.cookie.get("globalId"), type, function(data){
			var sHtml = "";
			if(data.code == 0){
				var obj = data.body;
				for(var i=0; i<obj.length; i++){
					sHtml += '<li class="u-list-item" id="'+obj[i].id+'" data-type="'+obj[i].type+'">'
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
			$(".mn-main ul").html(sHtml);
		});
	};
	
	loadNoticeList();
	
	//切换
	$(".mn-main .u-tab a").click(function(){
		$(this).addClass("active").siblings().removeClass("active");
		var type = $(this).attr("data-type");
		loadNoticeList(type);
	});
	
	//新增
	$(".mn-main .u-add-btn").click(function(){
		
		$(".u-pop-layer").show().siblings().hide();
		$(".u-pop-layer .submit-btn").removeAttr("data-id");
		$(".u-pop-layer .title-text").val("");
		$(".u-pop-layer select").find("option[value='1']").prop("selected", true);
		if(editor == null){
			loadEditor();
		}
		$("#noticeEditor").val("");
	});
	
	//删除
	$(".mn-main ul").delegate("li .notice-delete", "click", function(data){
		var id = $(this).parents("li").attr("id");
		um.popupLayer.confirm("您确定要删除该内容吗？",
			{btn:['确定', '取消']},
			function(index){
				iUserCenter.delNotice(id, function(data){
					if(data.code == 0){
						um.popupLayer.msg("操作成功！");
						loadNoticeList();
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
	$(".mn-main ul").delegate("li .notice-edit", "click", function(data){
		$(".u-pop-layer").show().siblings().hide();
		var id = $(this).parents("li").attr("id");
		$(".u-pop-layer .submit-btn").attr("data-id", id);
		$(".u-pop-layer .title-text").val($(this).parents("li").find("h3").text());
		var type = $(this).parents("li").attr("data-type");
		$("#noticeEditor").text($(this).parents("li").find(".notice-content").html());
		$(".u-pop-layer select").find("option[value='"+type+"']").prop("selected", true);
		
		if(editor == null){
			loadEditor();
		}
		
	});
	
	//保存内容
	$(".u-pop-layer .submit-btn").click(function(){
		var teacherId = um.cookie.get("globalId"),
			title = $(".u-pop-layer .title-text").val(),
			type = $(".u-pop-layer select").val(),
			content = editor.getContent();
		if("" == title){
			um.popupLayer.msg("请输入标题！");
			return;
		}
		if("" == content){
			um.popupLayer.alert("请输入正文内容！");
			return;
		}
		if($(this).attr("data-id")){
			//更新
			iUserCenter.updateNotice($(this).attr("data-id"), teacherId, type, title, content, function(data){
				if(data.code == 0){
					um.popupLayer.msg("操作成功！");
					$(".mn-main").show().siblings().hide();
					loadNoticeList();
				}else{
					um.popupLayer.alert("操作失败！");
				}
			});
			
		}else{
			//新增
			iUserCenter.addNotice(teacherId, type, title, content, function(data){
				if(data.code == 0){
					um.popupLayer.msg("操作成功！");
					$(".mn-main").show().siblings().hide();
					loadNoticeList();
				}else{
					um.popupLayer.alert("操作失败！");
				}
			});
		}
	});
	//取消
	$(".u-pop-layer .cancel-btn").click(function(){
		$(".mn-main").show().siblings().hide();
	});
	
});