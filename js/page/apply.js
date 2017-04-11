define(function(require, exports, module){
	var $ = require("jquery-1.11.1.min");
	require('util/common');
	require("jquery.json-2.4");
	
	$('#header').load('./header.html',function(){
		require("page/header");
		if(!um.checkLogin()){
			openLoginRegistDialog('login.html');
		}
	});
	$('#footer').load('./footer.html');
	
	require('util/region_select');
	
	var um = new UserManager(),
    cookie = um.cookie,
    CommonUtils = um.commonUtils,
    ajaxdata = um.ajaxData,
    gc = um.gConfig;
	
	var locationProtocol = window.location.protocol == "https:" ? "https:" :"http:";
	var base_url = locationProtocol +"//"+window.location.host+"/";
	var apply_url = base_url+'room/service/client/v1/room/applyRoom';
	
	var id_img_url = "";
	var jd1 = 0;
	
	
	$(function(){
		
		$(".next1 .ne").click(function(){
			if(!um.checkLogin()){
				openLoginRegistDialog('login.html');
				return;
			}
			$(".ste").removeClass("active");
			$(".con").removeClass("active");
			$(".next").removeClass("active");
			$(".ste2").addClass("active");
			$(".con2").addClass("active");
			$(".next2").addClass("active");
			$("#tab-nickname input").val(cookie.get("userNickname"));
			
			require.async("util/validation",function(){
				//验证必填项是否为空
				function checkEmpty(){
					if("" == $("#tab-name input").val()){
						alert("姓名不得为空，请填写完整！");
						return false;
					}
					if(null == $("#tab-name input").val().match("^[\u3400-\u9FFF]{2,8}$")){
						alert("姓名限输入2~8个汉字！");
						return false;
					}
					if("" == $("#tab-id input").val()){
						alert("身份证号不得为空，请填写完整！");
						return false;
					}
					var checkid = checkIdentity($("#tab-id input").val());
					if(checkid!=1){
						alert("身份证错误："+checkid);
						return false;
					}
					if(jd1==0){
						alert("请成功上传身份证再提交！");
						return false;
					}
					return true;
				}
				
				$(".next2 .ne").click(function(){//填完资料点下一步
					if(!checkEmpty()){
						return;
					}
					var applymsg = {
							"globalId" : cookie.get("globalId"),
							"sex" : $("#tab-sex input:checked").val(),
							"realName" : $("#tab-name input").val(),
							"userLicence" : $("#tab-id input").val(),
							"userLicenceA" : id_img_url
						},
					apply_params = {
							"globalId" : cookie.get("globalId"),
							"ticketId" : cookie.get("ticketId"),
							"roomType" : parseInt( $("#tab-tepe input:checked").attr("class").substring(2) ),
							"applyMsg" : $.toJSON(applymsg)
					};
					ajaxdata.request('post',apply_url,apply_params,function(data){
						if(data.code==0){
							$(".ste").removeClass("active");
							$(".con").removeClass("active");
							$(".next").removeClass("active");
							$(".ste3").addClass("active");
							$(".con3").addClass("active");
							$(".next3").addClass("active");
							$("body,html").delay(600).animate({'scrollTop':parseInt($(".step").offset().top)-10},1000);
						}
						else{
							alert(data.msg);
						}
					});
					
				});
			});
			
			require.async("uploadify/jquery.uploadify.min",function(){
				//上传直播海报
				$("#poster").uploadify({
					"swf"      : "js/uploadify/uploadify.swf",
					"uploader" : gc.UPLOAD.AVA,
					"buttonText":"上传图片",
					"buttonImage":"../images/default/apply/apply_idcard.png",
					"height":228,
					"width":391,
					"removeTimeout":10,
					"multi":false,
					"fileTypeExts":"*.jpg;*.png",
					"fileSizeLimit":"1024kb",
					"uploadLimit ":1,
					"queueSizeLimit":1,
					"fileObjName": "file",
					"onInit": function () {                        
						$("#poster-queue").hide();
				    },
					"onUploadSuccess":function(file,data,response){
						$("#poster-queue").hide();
						data = $.evalJSON(data);
						var imgurl = data.body.url;
						var file_msg = "<img src='"+gc.UPLOAD.url+imgurl+"'>";
						// poster_Url = IGO_UPLOAD.url+imgurl;
						$("#poster-button").css("background","url("+gc.UPLOAD.url+imgurl+") no-repeat");
						$("#poster-button").css("background-size","100% 100%");
						id_img_url = gc.UPLOAD.url+imgurl;
						jd1 = 1;
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
			
			ajaxdata.request('get',gc.AJAX_URL.datahouse.queryByKey_url,{"key":"ROOM_TYPE"},function(data){
				if(data.code==0){
					var htm = '<b class="b4">教学内容</b>： ',spe1 = "",spe2="",spe3="",spe4="";
					for(i=0;i<data.body.ROOM_TYPE.length;i++){
						if(i==0){
							spe1='checked="checked"';
							spe4=' active';
						}
						else{
							spe1='';
							spe4='';
						}
						if(i!=0 && i%4==0){
							spe2=' first';
						}
						else{
							spe2='';
						}
						if(i%4==3){
							spe3='</br>';
						}
						else{
							spe3='';
						}
						htm += '<input id="in'+data.body.ROOM_TYPE[i].id+'" class="in'+data.body.ROOM_TYPE[i].id+'" type="radio" name="teach-type" '+spe1+'><label for="in'+data.body.ROOM_TYPE[i].id+'" class="'+spe2+spe4+'">'+data.body.ROOM_TYPE[i].name+'</label>'+spe3;
					}
					$("#tab-tepe").html(htm);
					$(".con .content label").click(function(){
						$(this).parent().find("label").removeClass("active");
						$(this).addClass("active");
					});
				}
				else if(data.code==-5){
					alert('未登录或登录超时，请重新登录再试！');
				}
				else{
					if(undefined != (data.msg)){
						alert(data.msg);
					}
				}
			});
			
		});
		
		new PCAS('add_p','add_c','add_a' ,'北京市','北京市','东城区');
		
	})
})