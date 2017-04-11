define(function(require, exports, module){
	require("uploadify/jquery.uploadify.min");
	require("util/DateFormateUtil");
	var um = new UserManager(),
		gc = um.gConfig,
		dateFormateUtil = new DateFormateUtil(),
		iUserCenter = new IUserCenter();
	var imgUrl = "", videoUrl = "", courseWareObj = {};
	
	//获取用户课件上传已使用容量
	(function getUseSize(){
		iUserCenter.getCoursewareVedioSize(um.cookie.get("globalId"), function(data){
			if(data.code == 0){
				var size = data.body.vedioSizeTotal / 1024 / 1024;
				$(".ci-main .ci-tab .ci-use-size").text(size.toFixed(2)+'M');
			}
		});
	})();
	
	//根据课程ID获取课件列表
	var getCourseWareListById = function(courseId){
		iUserCenter.getCoursewareInfoList(courseId, function(data){
			var sHtml = "";
			if(data.code == 0){
				var obj = data.body;
				for(var i=0; i<obj.length; i++){
					courseWareObj[obj[i].id] = obj[i];
					sHtml += '<li id="'+obj[i].id+'" data-courseId="'+obj[i].courseId+'">'
						+ '<span class="fl ci-item-name ellipsis">'+obj[i].name+'</span>';
					if(obj[i].saleType == 0){
						sHtml += '<span class="fl ti-free-icon">免费</span>';
					}
		
					sHtml += '<a class="fr ti-item-del" href="javascript:void(0);">删除</a>'
						+ '<a class="fr ti-item-edit" href="javascript:void(0);">编辑</a>'
						+ '<span class="fr ti-item-num">'+obj[i].learnCount+'人观看</span></li>';
				}
				$(".ci-detail .ci-info .ci-count span").html(obj.length);
			}
			$("#courseWareList").html(sHtml).attr("data-couId",courseId);
		});
	};
	
	//获取课程信息
	var loadCourseInfoByTeacherId = function(){
		iUserCenter.getCourseInfoByTeacherId(um.cookie.get("globalId"), function(data){
			var sHtml = "";
			if(data.code == 0){
				$(".ci-main .u-add-btn").hide();
				imgUrl = data.body.courseImg;
				var time = parseInt(data.body.vaildTime / 30) == 4 ? "1年" : parseInt(data.body.vaildTime / 30)+"个月";
				sHtml += '<dd><div class="fl ci-poster"><img src="'+data.body.courseImg+'"></div>'
					+ '<div class="fl ci-detail"><p class="ci-tit">'+data.body.courseTitle+'</p>'
					+ '<div class="fl ci-info">'
					+ '<p class="ci-price">价格：<span>'+data.body.price+'</span></p>'
					+ '<p class="ci-count">课时：<span>'+data.body.buyCount+'</span></p>'
					+ '<p class="ci-valid">有效期：<span>'+time+'</span></p>'
					+ '<p class="ci-num">购买：<span>'+data.body.buyCount+'</span></p></div>'
					+ '<ol id="courseWareList" class="fl"></ol></div>'
					+ '<div class="ci-handle" data-id="'+data.body.courseId+'"><a class="ci-new-btn" href="javascript:void(0);"></a>'
					+ '<a class="ci-edit-btn" href="javascript:void(0);"></a>'
					+ '<a class="ci-del-btn" href="javascript:void(0);"></a></div></dd>';
				
				$(".ci-main dl").html(sHtml);
				getCourseWareListById(data.body.courseId);
			}
		});
	};
	loadCourseInfoByTeacherId();
	
	var getCourseWareListNoCourse = function(type){
		iUserCenter.getCoursewareInfoListNoCourse(um.cookie.get("globalId"), function(data){
			var sHtml = "";
			if(data.code == 0){
				var obj = data.body;
				if(obj.length > 0){
					for(var i=0; i<obj.length; i++){
						var videoSize = obj[i].vedioSize/1024/1024;
						if(i==0){
							sHtml += '<li class="active" id="'+obj[i].id+'" data-fieldId="'+obj[i].vedioFileId+'" data-fieldUrl="'+obj[i].vedioUrl+'" data-size="'+obj[i].vedioSize+'" data-type="'+obj[i].vedioType+'">'
							+ '<input type="radio" name="courseWareFile" checked>';
							
						}else{
							sHtml += '<li id="'+obj[i].id+'" data-fieldId="'+obj[i].vedioFileId+'" data-fieldUrl="'+obj[i].vedioUrl+'" data-size="'+obj[i].vedioSize+'" data-type="'+obj[i].vedioType+'">'
							+ '<input type="radio" name="courseWareFile">';
						}
						sHtml += '<span class="file-name">'+obj[i].name+'</span>'
							+ '<span class="file-size">'+videoSize.toFixed(2)+'M</span></li>';
					}
					$("#courseWareEditBox .ci-file .file-choose ol").html(sHtml);
					if(type == 'new'){
						$("#chooseFile").prop("checked", true).removeAttr("disabled");
						$("#uploadFile").prop("checked", false);
					}
					
				}else{
					sHtml = "<li>暂无已上传的课件</li>";
					$("#chooseFile").prop("checked", false).attr("disabled", "disabled");
					$("#uploadFile").prop("checked", true);
				}
			}else{
				sHtml = "<li>暂无已上传的课件</li>";
				$("#chooseFile").prop("checked", false).attr("disabled", "disabled");
				$("#uploadFile").prop("checked", true);
			}
			$("#courseWareEditBox .ci-file .file-choose ol").html(sHtml);
		});
	};
	
	//获取上传助手下载地址
	var getQxUploadDownloadUrl = function(){
		iUserCenter.getQxUploadsVersion(function(data){
			if(data.code == 0){
				$("#qxUploadsLinkBtn").attr("href", data.body.version_path);
			}
		});
	};
	
	getQxUploadDownloadUrl();
	
	//选择课件视频
	$("#courseWareEditBox .ci-file .file-choose ol").delegate("li", "click", function(){
		$(this).addClass("active").find("input[type=radio]").prop("checked", true);
		$(this).siblings().removeClass("active").find("input[type=radio]").prop("checked", false);
		$("#chooseFile").prop("checked", true);
		$("#uploadFile").prop("checked", false);
	});
	
	$("#chooseFile").click(function(){
		if($(this).prop("checked")){
			$("#uploadFile").prop("checked", false);
		}else{
			$("#uploadFile").prop("checked", true);
		}
	});
	$("#uploadFile").click(function(){
		if($(this).prop("checked")){
			$("#chooseFile").prop("checked", false);
		}else{
			$("#chooseFile").prop("checked", true);
		}
	});
	
	//新增课程
	$(".ci-main .u-add-btn").click(function(){
		$(".ci-new-course").show().siblings().hide();
		$(".ci-new-course .submit-btn").attr("data-flag", "");
		$(".ci-new-course .submit-btn").attr("data-id", "");
		$(".ci-new-course .upload-course-poster .pic-show img").attr("src", "");
		$(".ci-new-course input[name=courseName]").val("");
		$(".ci-new-course input[name=coursePrice]").val("");
	});
	
	//编辑课程
	$(".ci-main dl").delegate("dd .ci-handle .ci-edit-btn", "click", function(){
		if(!$(".ci-handle").attr("data-id")){
			um.popupLayer.msg("请先添加课程！");
			return;
		}
		$(".ci-new-course").show().siblings().hide();
		$(".ci-new-course .submit-btn").attr("data-id", $(".ci-handle").attr("data-id"));
		$(".ci-new-course .submit-btn").attr("data-flag", "update");
		$(".ci-new-course .upload-course-poster .pic-show img").attr("src", $(".ci-poster img").attr("src"));
		$(".ci-new-course input[name=courseName]").val($(".ci-tit").text());
		$("#courseType").find("option[value='"+($(".ci-tit").attr("data-type"))+"']").prop("selected", true);
		$(".ci-new-course input[name=coursePrice]").val($(".ci-detail .ci-info .ci-price span").text());
		var time = $(".ci-detail .ci-info .ci-valid span").text();
		$("#courseTime").find("option[value='"+(parseInt(time/30))+"']").prop("selected", true);
	});
	
	//删除课程
	$(".ci-main dl").delegate("dd .ci-handle .ci-del-btn", "click", function(){
		if(!$(".ci-handle").attr("data-id")){
			um.popupLayer.msg("请先添加课程！");
			return;
		}
		um.popupLayer.confirm("您确定要删除该课程吗？",
			{btn:['确定', '取消']},
			function(index){
				var courseId = $(".ci-handle").attr("data-id");
				iUserCenter.deleteCourse(courseId, function(data){
					if(data.code == 0){
						um.popupLayer.msg("操作成功！");
						loadCourseInfoByTeacherId();
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
	
	//保存课程
	$(".ci-new-course .submit-btn").click(function(){
		var opts = {};
        opts.teacherId = um.cookie.get("globalId");
        opts.courseType = $("#courseType").val();
        opts.courseTitle = $(".ci-new-course input[name=courseName]").val();
        opts.courseImg = imgUrl;
        opts.price = $(".ci-new-course input[name=coursePrice]").val();
        //当前时间
        var nowTime = dateFormateUtil.getCurentDate();
        var newTime = dateFormateUtil.addTimeByMonth(nowTime, $("#courseTime").val());
        opts.vaildTime = dateFormateUtil.daysBetween(nowTime, newTime);
        
        if(opts.courseTitle == ""){
        	um.popupLayer.alert("请输入课程名称！");
        	return;
        }
        var reg = /^[0-9]\d*$/;
		if(!reg.test(opts.price)){
			$(".ci-new-course input[name=coursePrice]").val("");
			um.popupLayer.alert('课程定价请输入整数!');
			return ;
		}
        if(opts.courseImg == ""){
        	um.popupLayer.alert("请上传课程图片！");
        	return;
        }
        if($(this).attr("data-flag")){
        	opts.courseId = $(this).attr("data-id");
        	iUserCenter.updateCourse(opts, function(data){
        		if(data.code == 0){
            		um.popupLayer.msg("课程更新成功！");
            		$(".ci-main").show().siblings().hide();
            		loadCourseInfoByTeacherId();
            	}else{
            		um.popupLayer.alert("课程更新失败！");
            	}
        	});
        }else{
        	iUserCenter.addCourse(opts, function(data){
            	if(data.code == 0){
            		um.popupLayer.msg("课程添加成功！");
            		$(".ci-main").show().siblings().hide();
            		loadCourseInfoByTeacherId();
            	}else{
            		um.popupLayer.alert("课程添加失败！");
            	}
            });
        }
        
	});
	
	
	
	

	//添加课件详情
	$(".ci-main dl").delegate("dd .ci-handle .ci-new-btn", "click", function(){
		if(!$(".ci-handle").attr("data-id")){
			um.popupLayer.msg("请先添加课程！");
			return;
		}
		$(".ci-upload-course .ci-update-promt").hide();
		$(".ci-upload-course").show().siblings().hide();
		$(".ci-upload-course .course-ware-name").val("");
		$(".ci-upload-course .pic-show").html("");
		$(".ci-upload-course .submit-btn").removeAttr("data-id");
		getCourseWareListNoCourse('new');
	});
	//编辑课件详情
	$(".ci-main dl").delegate("dd ol>li .ti-item-edit", "click", function(){
		$(".ci-upload-course .ci-update-promt").show();
		$(".ci-upload-course").show().siblings().hide();
		var isFree = $(this).parent("li").find(".ti-free-icon").length > 0 ? 0 : 1;
		$(".ci-upload-course .course-ware-name").val($(this).parent("li").find(".ci-item-name").text());
		$("#saleType").find("option[value='"+isFree+"']").prop("selected", true);
		$(".ci-upload-course .submit-btn").attr("data-id", $(this).parent("li").attr("id"));
		getCourseWareListNoCourse('update');
	});
	
	//删除课件
	$(".ci-main dl").delegate("dd ol>li .ti-item-del", "click", function(){
		var id = $(this).parent("li").attr("id");
		um.popupLayer.confirm("您确定要删除该课件吗？",
			{btn:['确定', '取消']},
			function(index){
				iUserCenter.delCoursewareInfo(id, function(data){
					if(data.code == 0){
						um.popupLayer.msg("操作成功！");
						getCourseWareListById($("#courseWareList").attr("data-couId"));
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
	
	//保存课件
	$(".ci-upload-course .submit-btn").click(function(){
		var opts = {};
		opts.teacherId = um.cookie.get("globalId");
        opts.saleType = $("#saleType").val();//是否免费 0收费  1免费
        opts.name = $(".ci-upload-course .course-ware-name").val();//课件名称
        opts.courseId = $(".ci-handle").attr("data-id");//课程id
        opts.videoUrl = "";//视频地址
        opts.videoType = "";//视频类型
        opts.videoTime = "";//视频时长
        opts.videoSize = "";//视频大小
        
        if($("#chooseFile").prop("checked")){
        	var chkObj = $("#courseWareEditBox .file-choose ol").find("li.active");
        	opts.id = chkObj.attr("id");
        	opts.videoUrl = chkObj.attr("data-fieldUrl");
        	opts.videoType = chkObj.attr("data-type");
        	opts.videoSize = chkObj.attr("data-size");
        }
        
        if($("#uploadFile").prop("checked")){
        	opts.videoUrl = $(".ci-upload-course .pic-show").attr("data-vurl");
            opts.videoType =  $(".ci-upload-course .pic-show").attr("data-vtype");
            opts.videoSize =  $(".ci-upload-course .pic-show").attr("data-vsize");
        }
        if(opts.name == ""){
        	um.popupLayer.alert("请输入课件名称！");
        	return;
        }
        
        if($(".ci-upload-course .submit-btn").attr("data-id") || opts.id){
        	var id = $(".ci-upload-course .submit-btn").attr("data-id");
        	opts.id = opts.id || id;
        	if(opts.videoUrl == undefined || opts.videoUrl == ""){
        		opts.videoUrl = courseWareObj[id].vedioUrl;//视频地址
                opts.videoType = courseWareObj[id].vedioType;//视频类型
                opts.videoTime = courseWareObj[id].vedioTime;//视频时长
                opts.videoSize = courseWareObj[id].vedioSize;//视频大小
        	}
        	
        	iUserCenter.editCoursewareInfo(opts, function(data){
        		if(data.code == 0){
    				um.popupLayer.msg("更新成功，课件视频更新需要等待后台重新审核！", {time: 3000});
    				$(".ci-main").show().siblings().hide();
    				getCourseWareListById(opts.courseId);
    			}else{
    				um.popupLayer.alert("操作失败！");
    			}
        	});
        }else{
        	if(!opts.videoUrl || opts.videoUrl == ""){
        		um.popupLayer.alert("请选择已有课件视频或者上传课件视频！");
        		return;
        	}
        	iUserCenter.addCoursewareInfo(opts, function(data){
    			if(data.code == 0){
    				um.popupLayer.msg("您上传的课件已成功，请等待后台人工审核！", {time: 3000});
    				$(".ci-main").show().siblings().hide();
    				getCourseWareListById(opts.courseId);
    			}else{
    				um.popupLayer.alert("操作失败！");
    			}
    		});
        }
		
	});
	
		
	//取消
	$(".u-pop-layer .cancel-btn").click(function(){
		$(".ci-main").show().siblings().hide();
	});	
		
	//上传课件
	$("#uploadCouserBtn").uploadify({
		"swf"      : "js/uploadify/uploadify.swf",
		"uploader" : gc.UPLOAD.UPLOADVIDEO,
		"buttonImage":"../images/default/usercenter/upload_default_03.png",
		"height":110,
		"width":110,
		"multi":false,
		"fileTypeExts":"*.flv;*.mp4",
		"fileSizeLimit":"2GB",
		"uploadLimit ":1,
		"queueSizeLimit":1,
		"fileObjName": "file",
		"removeCompleted": true,
		"removeTimeout": 1,
		"onInit": function () {                        
		//	$("#uploadCouserBtn-queue").hide();
	    },
	    //onUploadProgress: function(file,bytesUploaded,bytesTotal,totalBytesUploaded,totalBytesTotal){
	    //	var totalSize = bytesTotal/1024/1024, uploadSize = totalBytesTotal/1024/1024;
	    //	$(".ci-upload-course .pic-show").html('总共需要上传'+totalSize.toFixed(2)+'MB，'+'已上传'+uploadSize.toFixed(2)+'MB');
       // },
		"onUploadSuccess":function(file,data,response){
			//$("#uploadCouserBtn-queue").hide();
			data = $.evalJSON(data);
			videoUrl = data.body.url;
			$(".ci-upload-course .pic-show").html(file.name);
			$(".ci-upload-course .pic-show").attr({"data-vsize":file.size, "data-vurl":videoUrl,"data-vtype":videoUrl.substring(videoUrl.lastIndexOf(".")+1)});
	    },
		"onUploadError":function(){
			um.popupLayer.alert("系统繁忙，请稍后再试");
		},
		 "onFallback":function(){
			um.popupLayer.alert("请安装flash插件");
	        window.location.href="http://get.adobe.com/cn/flashplayer/otherversions/";
	    }
	});
		
	//上传图片
	$("#uploadPic").uploadify({
		"swf"      : "js/uploadify/uploadify.swf",
		"uploader" : gc.UPLOAD.AVA,
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
			$("#uploadPic-queue").hide();
	    },
		"onUploadSuccess":function(file,data,response){
			$("#uploadPic-queue").hide();
			data = $.evalJSON(data);
			imgUrl = gc.UPLOAD.url + data.body.url;
			$(".ci-new-course .upload-course-poster .pic-show img").attr("src", imgUrl);
	    },
		  "onUploadError":function(){
			um.popupLayer.alert("系统繁忙，请稍后再试");
		},
		 "onFallback":function(){
			 um.popupLayer.alert("请安装flash插件");
	         window.location.href="http://get.adobe.com/cn/flashplayer/otherversions/";
	    }
	});
});