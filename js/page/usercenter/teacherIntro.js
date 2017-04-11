define(function(require, exports, module){
	require("uploadify/jquery.uploadify.min");
	require("umeditor/umeditor.config");
	var um = new UserManager(),
		commonUtils = um.commonUtils,
		gc = um.gConfig;
	var iUserCenter = new IUserCenter();
	var imgUrl = "/images/default/usercenter/upload_default_01.png";
	var umEditor = null;
	
	function loadEditor(){
		require.async("umeditor/umeditor.min", function(){
			require.async("umeditor/lang/zh-cn", function(){
				var opts = {
					imageUrl:gc.UPLOAD.AVA,
			        toolbar:[
			            'bold italic underline strikethrough | forecolor backcolor | removeformat |',
			            ' selectall cleardoc paragraph | fontfamily fontsize' ,
			            '| justifyleft justifycenter justifyright justifyjustify |',
			            'link unlink '//| image 
			        ],
			        maximumWords:500,
			        initialFrameWidth: 680,
			        initialFrameHeight:300,
			        autoHeightEnabled:false
			    };
			    umEditor = UM.getEditor('teacherEditor', opts);
				    
				//完成编辑
				$(".ti-main .complete-btn").click(function(){
					var teacherId = um.cookie.get("globalId"),
						teacherName = $(".ti-main .ti-name input[type=text]").val(),
						teacherTitle = $(".ti-main .ti-title input[type=text]").val(),
						content = umEditor.getContent();//$(".ti-main textarea").val();
					iUserCenter.saveTeacherInfo(teacherId,imgUrl, teacherName, teacherTitle, content, function(data){
						if(data.code == 0){
							um.popupLayer.msg("保存成功！");
						}else{
							um.popupLayer.alert("保存失败！");
						}
					});
				});    
			});
		});
	}
	
	$(function(){
		umEditor = null;
		loadEditor();
	});
	
	//加载名师介绍信息
	var loadTeacherInfo = function(){
		iUserCenter.getTeacherInfo(um.cookie.get("globalId"), function(data){
			if(data.code == 0){
				imgUrl = data.body.userImg;
				$(".ti-main .ti-poster-show img").attr("src", data.body.userImg);
				$(".ti-main .ti-name input[type=text]").val(data.body.name);
				$(".ti-main .ti-title input[type=text]").val(data.body.title);
				$(".ti-main textarea").val(commonUtils.HTMLDecodeHandler(data.body.content));
				$(".ti-main").show().siblings().hide();
			}else{
				$(".ti-empty").show().siblings().hide();
			}
		});
	};
	
	loadTeacherInfo();
	

	//进入编辑页
	$(".ti-empty .edit-btn").click(function(){
		$(".ti-main").show().siblings().hide();
	});

	//取消编辑
	$(".ti-main .cancel-btn").click(function(){
		loadTeacherInfo();
	});
	
	//上传图片
	$("#uploadTeacherPic").uploadify({
		"swf"      : "js/uploadify/uploadify.swf",
		"uploader" : um.gConfig.UPLOAD.AVA,
		"buttonImage":"../images/default/usercenter/u_upload_btn.png",
		"height":34,
		"width":85,
		"removeTimeout":3,
		"multi":false,
		"fileTypeExts":"*.jpg;*.png;*.gif;*.bmp",
		"fileSizeLimit":"512kb",
		"uploadLimit ":1,
		"queueSizeLimit":1,
		"fileObjName": "file",
		"onInit": function () {                        
			$("#uploadTeacherPic-queue").hide();
	    },
		"onUploadSuccess":function(file,data,response){
			$("#uploadTeacherPic-queue").hide();
			data = $.evalJSON(data);
			imgUrl = gc.UPLOAD.url + data.body.url;
			$(".ti-main .ti-poster-show img").attr("src", imgUrl);
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