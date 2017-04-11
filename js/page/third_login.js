define(function(require,exports,module){
	require("util/common");
	var um = new UserManager(),
		gc = um.gConfig,
		commonUtils= um.commonUtils;
	
	function loginByQQ(qc){
		//qq授权登录
	    qc.Login({
	    	//初始化登录界面和事件
	       btnId:"qqLoginBtn",	//插入按钮的节点id
	       size:"A_L"
		});
		if(qc.Login.check()){
			//检测已登录
			$("#loading").show();
			qc.Login.getMe(function(openId, accessToken){
				//获取qq资料
				um.ajaxData.request("post", gc.AJAX_URL.usercenter.loginSingleOpenQQ_url, {"openId":openId,"accessToken":accessToken }, function(data){
					//根据qq返回的openId和accessToken登录书法报视频执行回调
					$("#loading").hide();
					if(data.code==0){
						for(var i in data.body){
							if(typeof i=="object"&&$.isArray(i)){
								for(var j=0;j<data.body[i].length;j++){
									um.cookie.set(i+j,data.body[i][j]);
								}
							}else{
								um.cookie.set(i,data.body[i]);
							}
						}
						commonUtils.go(1,um.gConfig.BASE.BASE_URL+"index.html");
					}else{
						um.popupLayer.alert("openId=="+openId+"==accessToken=="+accessToken);
						um.popupLayer.alert(data.msg);
						$("#loaded").show();
					}
						window.opener.location.reload();						
						window.open('','_self');
						window.close();
				});
			});

		}else{
			//未登录状态开启倒计时自动跳转qq授权界面
			 var T=5;
			 var t=setTimeout(function(){
				 $("#tips .count").html(T+" 秒后将自动跳转登录");
				if(T--<=0){
					if($("#qqLoginBtn a").length>0){
						clearTimeout(t);
						t=null;
						commonUtils.go(1, "https://graph.qq.com/oauth2.0/authorize?client_id=101146999&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fedu.baiqu.tv%2Fthird-login%2Floginbyqq.html");
					}else{
						t=setTimeout(arguments.callee,1000);
					}
				}else{
					t=setTimeout(arguments.callee,1000);
				}
			},0);
			$("#qqLoginBtn a")[0].onclick="return false";//禁止登录按钮的默认click
			$("#qqLoginBtn").on("click","a",function(){
				//添加自定义按钮的click事件
				if(t)clearTimeout(t);
				t=null;
				commonUtils.go(1, "https://graph.qq.com/oauth2.0/authorize?client_id=101146999&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fedu.baiqu.tv%2Fthird-login%2Floginbyqq.html");
			});
		}
	}
	function loginBySina(wb2){
		//sina微博授权登录
		wb2.anyWhere(function (W) {
			//引用sina微博登录的接口
		    W.widget.connectButton({
		    	//新浪登录界面初始化和事件回调注册
		        id: "wb_connect_btn",
		        type: '2,1',
		        callback: {
		            login: function () { 
		            	//登录后的回调函数 ，sina默认登录后存入accessToken和sinaId到cookie，获取即可
	            	    var tocken=um.cookie.get("weibojs_1353924884"),
	            	    	array = tocken.split("&"),
	            	    	accessToken = array[0].split("=")[1],
	            	    	sinaId = array[3].split("=")[1];
	            	    $("#loading").show();
		            	um.ajaxData.request("post",gc.AJAX_URL.usercenter.loginSingleOpenSina_url,
	            			{"accessToken":accessToken,"sinaId":sinaId },function(data){
		            		$("#loading").hide();
							if(data.code==0){
								for(var i in data.body){
									if(typeof i=="object"&&$.isArray(i)){
										for(var j=0;i<data.body[i].length;i++){
											um.cookie.set(i+j,data.body[i][j]);
										}
									}else{
										um.cookie.set(i,data.body[i]);
									}
								}
								
								commonUtils.go(1,um.gConfig.BASE.BASE_URL+"index.html");
							}else{
								um.popupLayer.alert(data.msg);
								$("#loaded").show();
							}
							window.opener.location.reload();
							window.open('','_self');
							window.close();
					    });

		            },
		            logout: function () { 
		            	//退出后的回调函数
		               um.cookie.delAll();
		            }
		        }
		    });
		});
	}
	
	function loginByWeixin(){
		//初始化微信二维码
		var wx = new WxLogin({
		    id:"weChatBox", 
		    appid: "wx0674d0f10b858db7", 
		    scope: "snsapi_login", 
		    redirect_uri: "http%3A%2F%2Fedu.baiqu.tv%2Fthird-login%2Floginbyweixin.html",
		    state: new Date().getTime(),
		    style: "white",
		    href: ""
		});
		//用户授权后获取code
		var wxcode = getUrlParam("code");
		if(wxcode){
        	//获取code后登录xiu90
			um.ajaxData.request("post", gc.AJAX_URL.usercenter.loginSingleWeixin_url, {"code":wxcode}, function(data){
				if(data.code==0){
					for(var i in data.body){
						if(typeof i=="object"&&$.isArray(i)){
							for(var j=0;i<data.body[i].length;i++){
								um.cookie.set(i+j,data.body[i][j]);
							}
						}else{
							um.cookie.set(i,data.body[i]);
						}
					}
					
					commonUtils.go(1,um.gConfig.BASE.BASE_URL+"index.html");
				}else{
					um.popupLayer.alert(data.msg);
				}
				window.opener.location.reload(); 
				window.open('','_self');
				window.close();
			});
		}
	}

	exports.a=loginByQQ;//输出模块接口，方便seajs外部use时回调函数的参数对象调用
	exports.b=loginBySina;//输出模块接口，方便seajs外部use时回调函数的参数对象调用
	exports.c=loginByWeixin;//输出模块接口，方便seajs外部use时回调函数的参数对象调用
})


