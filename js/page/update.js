define(function(require, exports, module){
	require('util/common');

	var um = new UserManager(),
		gMethod = um.gConfig.METHOD,
		gUrl = um.gConfig.AJAX_URL,
		gc = um.gConfig;

	$('#header').load('./header.html',function(){
		require('page/header');
		if(!um.checkLogin()){
			openLoginRegistDialog('login.html');
		}
	});
	$('#footer').load('./footer.html');

	function init(){
		require.async("uploadify/jquery.uploadify.min",function(){
			//上传直播海报
			$("#update").uploadify({
				"swf"      : "js/uploadify/uploadify.swf",
				"uploader" : gc.UPLOAD.AVA,
				"buttonText":"上传图片",
				"buttonImage":"../images/default/update-btn.png",
				"height":60,
				"width":80,
				"removeTimeout":3,
				"multi":true,
				"fileTypeExts":"*.jpg;*.png",
				"fileSizeLimit":"5120kb",
				"uploadLimit ":10,
				"queueSizeLimit":10,
				"fileObjName": "file",
				"onInit": function () {                       
					$("#update-queue").hide();
			    },
				"onUploadSuccess":function(file,data,response){
					$("#update-queue").hide();
					data = $.evalJSON(data);
					var imgurl = data.body.url;
					var html = "<div><img src='"+ gc.UPLOAD.url+imgurl +"'><a href='javascript:void(0);'>X</a></div>"
					$(".imgList").append(html).show();
			    },
				  "onUploadError":function(){
					alert("系统繁忙，请稍后再试");
				},
				 "onFallback":function(){
					alert("请安装flash插件");
			        window.location.href="http://get.adobe.com/cn/flashplayer/otherversions/";
			    }
			});
		});

		$('.imgList').on('click','a',function(){
			$(this).parent().remove();
			$(this).remove();
			if (!$('.imgList div img').length) {
				$('.imgList').hide();
			}
		})
	}

	init();

	//重置
	function resetInfo(){
		$('#title').val("");
		$('#summary').val("");
		$('#writer').val("");
		$('#telPhone').val("");
		$(".imgList").empty().hide();
	}

	require.async("util/validation", function(){
		$(".main").formValidation({
			cssOnFail:{
				display:  "inline-block"
			},
			submitSelector: '#btn1',
			onFail: function(){
				//失败校验
				var obj=arguments[0];
				if(!$(obj).hasClass("invalid"))$(obj).addClass("invalid");
				var len=$(obj).prevAll(".invalid:visible").length;
				len>0?$(obj).hide():"";
			},
			onValidated: function(){

			},
			onSubmit: function(){
				var title = $('#title').val(),
					summary = $('#summary').val(),
					writer = $('#writer').val(),
					telPhone = $('#telPhone').val();
				var images = "";
				$(".imgList div img").each(function(){
					images += $(this).attr("src") + ",";
				});
				images = images.substring(0, images.length-1);
				if(images == ""){
					um.popupLayer.alert("请上传图片！");
					return;
				}
				var param = {
					"globalId": um.cookie.get("globalId"),
					"title": title,
					"image": images,
					"writer": writer,
					"summary": summary,
					"telPhone": telPhone
				};
				um.ajaxData.request(gMethod.P, gUrl.datahouse.submitContribution_url, param, function(data){
					if(data.code == 0){
						um.popupLayer.msg("投稿提交成功！");
						resetInfo();
					}else{
						um.popupLayer.alert(data.msg);
					}
				});
			}
		})
	});

	$('#btn2').click(function(){
		//window.location.reload();
		resetInfo();
	})
})