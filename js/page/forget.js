define(function(require, exports, module){
	require('util/config');
	require('util/common');

	$('#header').load('./header.html',function(){
		require('page/header');
	});
	$('#footer').load('./footer.html');

	var um = new UserManager(),
		gMethod = um.gConfig.METHOD,
		gUrl = um.gConfig.AJAX_URL;

	$(function(){
		var GLOBALOBJECT = {};
		GLOBALOBJECT.checkPhoneId = function(val){
			if(!/^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/.test(val)){
				um.popupLayer.msg("请输入正确的手机号",{
					icon:2,
					time:2000
				});
				return false;
			}
		}

		//验证身份
		var editPasswordByPhone = function(){
			var phoneId = $('#phoneId').val(),
				phoneCode = $('#phoneCode').val();

			if(GLOBALOBJECT.checkPhoneId(phoneId) == false)return false;
			if(phoneCode == ""){
				um.popupLayer.msg("验证码不能为空",{
					icon:2,
					time:2000
				});
				return false;
			}
	
			um.ajaxData.request(
				gMethod.P,
				gUrl.usercenter.checkUserByPhoneCode_url,
				{userPhone:phoneId,code:phoneCode},
				function(data){
					if(data.code == 0){
						showNext(1);
						$('#nickname').val(data.body.userName);
					}else if(data.code == 1){
						um.popupLayer.alert("查无数据",{
							icon:2
						});
					}else{
						um.popupLayer.alert(data.msg||"异常错误",{
							icon:2
						});
					}
				}
			)
		}

		//修改密码
		var editPassword = function(){
			var password_1 = $('#password').val(),
				password_2 = $('#password_2').val(),
				data = {};

			if(!/^[A-Za-z0-9]{4,12}$/.test(password_1)){
				um.popupLayer.msg("输入的密码不符合规定",{
					icon:2,
					time:2000
				});
				return false;
			}
			if(password_1 !== password_2){
				um.popupLayer.msg("两次密码不一致",{
					icon:2,
					time:2000
				});
				return false;
			}

			data.userName = $('#nickname').val();
			data.code = $('#phoneCode').val();
			data.password = decodeURIComponent(password_1);

			um.ajaxData.request(gMethod.P,gUrl.usercenter.editPasswordByPhone_url,data,
				function(data){
					if(data.code !== 0){
						if(data.msg){
							um.popupLayer.alert(data.msg||"异常错误",{
								icon:2
							});
						}
					}else{
						showNext(2);
					}
				}
			)
		}

		//获取手机验证码
		$('.js-phoneCode').click(function(){
			if(GLOBALOBJECT.checkPhoneId($('#phoneId').val()) == false)return false;

			var _this = $(this),
				nowTime = 60;

			if($(this).text().indexOf('重新发送')!==-1){
				um.popupLayer.msg("请60秒后再试",{
					icon:2,
					time:2000
				});
				return false;
			};

			GLOBALOBJECT.phoneId = $('#phoneId').val();
			um.ajaxData.request(gMethod.P,gUrl.usercenter.createPhoneCode_url,{phoneNo:GLOBALOBJECT.phoneId},
				function(data){
					if(data.code == 0){
						var timer = setInterval(function(){
							_this.text("重新发送("+ (nowTime--) +")");
							if(nowTime < 1){
								_this.text("获取验证码");
								clearInterval(timer);
							}
						},1000);
					}else{
						if(data.msg){
							um.popupLayer.alert(data.msg||"异常错误",{
								icon:2
							});
						}
					}
				}
			)

		})

		//下一步事件
		$('.next').click(function(){
			var next = $('.next').index(this) + 1;

			switch (next){
				case 1:
					editPasswordByPhone();
					break;
				case 2:
					editPassword();
					break;
				case 3:
					um.doLogin($('#nickname').val(), $('#password').val(),{
						success:function(msg){
							window.location.href = "index.html";
						}
					});
					break;	
			}
		});	

		function showNext(next){
			$('.title span').eq(next).addClass('title_active')
				.siblings()
				.removeClass('title_active');
			$('.next').eq(next).parentsUntil('.content')
				.show()
				.siblings('div').hide();
		}

	})
})