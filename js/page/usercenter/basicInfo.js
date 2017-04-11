define(function(require, exports, module){
	require('component/cityselect/jquery.cityselect');
	require("uploadify/jquery.uploadify.min");
	var um = new UserManager,
		cookie = um.cookie,
		iUserCenter = new IUserCenter();
	
(function($){
	var imgUrl = "";
	
	$(function(){
        $(".system-ava-list .ava-list").load("avatar.html");
        um.getUserInfoById(cookie.get("globalId"), function(data){
        	if(data.code == 0){
        		$(".bi-detail input[name=userNick]").val(data.body.userNickname);
        		$(".bi-detail input[name=userPhone]").val(data.body.userPhone);
        		$(".bi-detail input[name=userEmail]").val(data.body.userMailEX);
        		$(".bi-detail").find("input[name=sex][value='"+data.body.userSex+"']").prop("checked", true);
        		
        	}
        });
        
    });

    $(".basic-info .u-tab a").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var dataRel = $(this).attr("data-rel");
        $(".basic-info .bi-detail").find("."+dataRel).show().siblings().hide();
    });

    $("#city").citySelect({prov:"湖北", city:"武汉"});
    
    /******* 以下是更新用户基础信息 ********/
    
    $(".bi-detail input[name=userEmail]").blur(function(){
    	if(um.gConfig.REGEX.EMAIL.test($(this).val())){
    		$(this).parent().find(".validator").removeClass("invalidate");
    	}else{
    		$(this).parent().find(".validator").addClass("invalidate");
    		$(this).focus().val("");
    		return;
    	}
    }).keydown(function(){
    	$(this).parent().find(".validator").removeClass("invalidate");
    });
    
    $(".bi-detail .bi-info-submit").click(function(){
    	var userNick = $(".bi-detail input[name=userNick]").val(),
    		userEmail = $(".bi-detail input[name=userEmail]").val(),
    		//userPhone = $(".bi-detail input[name=userPhone]").val(),
    		sex = $(".bi-detail input[name=sex]:checked").val();
    	
    	if(um.gConfig.REGEX.EMAIL.test(userEmail)){
    		$(".bi-detail input[name=userEmail]").parent().find(".validator").removeClass("invalidate");
    	}else{
    		$(".bi-detail input[name=userEmail]").parent().find(".validator").addClass("invalidate");
    		$(".bi-detail input[name=userEmail]").focus().val("");
    		return;
    	}
    	
        userNick = um.commonUtils.replaceHtmlCommon(userNick);

    	var opts = {};
    	opts.globalId = cookie.get("globalId");
    	opts.sex = sex;
    	opts.userMail = userEmail;
    	opts.userNickname = userNick;
    	opts.userCity = $("#city").val();
    	
    	iUserCenter.updateUserInfo(cookie.get("globalId"), cookie.get("ticketId"), JSON.stringify(opts), function(data){
    		if(data.code == 0){
    			cookie.set("userNickname", userNick);
    			cookie.set("userName", userNick);
    			$(".u-base-info .u-nick").html(userNick);
    			$("#header .logged-in .user-box").find(".user-nick span").html(userNick);
    			um.popupLayer.msg("更新成功！");
    		}else{
    			um.popupLayer.alert(data.msg);
    		}
    	});
    	
    });
    
    /******* 以下是修改用户密码 ***********/
    $(".bi-pwd .bi-pwd-submit").click(function(){
    	var nowPwd = $(".bi-pwd input[name=nowPwd]").val(),
    		newPwd = $(".bi-pwd input[name=newPwd]").val(),
    		newPwd2 = $(".bi-pwd input[name=newPwd2]").val();
    	if(nowPwd == ""){
    		um.popupLayer.alert("请输入当前密码！");
    		return;
    	}
    	if(newPwd == ""){
    		um.popupLayer.alert("请输入新密码！");
    		return;
    	}
    	if(newPwd2 == ""){
    		um.popupLayer.alert("请再次输入新密码！");
    		return;
    	}
    	if(nowPwd == newPwd){
    		um.popupLayer.alert("新密码不可以和当前密码相同！");
    		$(".bi-pwd input[name=newPwd]").val("");
    		$(".bi-pwd input[name=newPwd2]").val("");
    		return;
    	}
    	if(newPwd != newPwd2){
    		um.popupLayer.alert("两次输入的新密码不致！");
    		$(".bi-pwd input[name=newPwd2]").val("");
    		return;
    	}
    	iUserCenter.updatePassword(cookie.get("globalId"), cookie.get("ticketId"), nowPwd, newPwd, function(data){
    		if(data.code == 0){
    			um.popupLayer.msg("密码更新成功！");
    		}else{
    			um.popupLayer.alert("密码更新失败！");
    		}
    	});
    });
    
    
    
    /******* 以下是修改用户头像 ************/
    
    $(".bi-avatar .bi-avatar-tab input[name=avaType], .bi-avatar .bi-avatar-tab label").click(function(){
    	var dataRel = $("input[name='avaType']:checked").attr("data-rel");
    	$(".bi-avatar-con ."+dataRel).show().siblings().hide();
    });
    
    $(".bi-avatar .system-ava-list .ava-list").delegate("a", "click", function(){
    	$(this).addClass("selected").siblings().removeClass("selected");
    	imgUrl = $(this).find("img").attr("src");
    	$(".system-ava-list .ava-show img").attr("src", imgUrl);
    });
	
    $(".bi-avatar .bi-avatar-con .bi-avatar-submit").click(function(){
    	iUserCenter.updataAvatar(cookie.get("globalId"), cookie.get("ticketId"), imgUrl, function(data){
    		if(data.code == 0){
    			um.popupLayer.msg("更新头像成功！");
    			$(".u-base-info .u-ava img").attr("src", imgUrl);
    		}else{
    			um.popupLayer.alert("更新头像失败！");
    		}
    	});
    });
    
    
  //上传图片
	$(".upload-btn").uploadify({
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
			$("#uploadPic-queue").hide();
	    },
		"onUploadSuccess":function(file,data,response){
			$("#uploadPic-queue").hide();
			data = $.evalJSON(data);
			imgUrl = um.gConfig.UPLOAD.url + data.body.url;
			$(".diy-ava-box .pic-show img").attr("src",  imgUrl);
	    },
		  "onUploadError":function(){
			um.popupLayer.alert("系统繁忙，请稍后再试");
		},
		 "onFallback":function(){
			alert("请安装flash插件");
	        window.location.href="http://get.adobe.com/cn/flashplayer/otherversions/";
	    }
	});
	
    
})(jQuery);	

});
