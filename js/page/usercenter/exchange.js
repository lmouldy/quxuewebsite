define(function(require, exports, module){
	var um = new UserManager(),
		gUrl = um.gConfig.AJAX_URL,
		iUserCenter = new IUserCenter();

	$(function(){
		if(!um.checkLogin()){
			openLoginRegistDialog('login.html');
		}else{

			var globalId = um.cookie.get('globalId'),
				ticketId = um.cookie.get('ticketId');
			function init(){

				//礼物、课程收益
				um.loadUserInfo(function(data){
					if(data.code == 0){
						$('.js-GiftIncome').text(data.body.assetGiftDou||0);
						$('.js-LessonIncome').text(data.body.assetLessonDou||0);
					}
				});

				//提现记录
				um.ajaxData.request('post',gUrl.accounting.queryExchangeRmb_url,{globalId:globalId,ticketId:ticketId,status:1},function(data){
					if (data.code == 0) {
						var json = data.body.result,
							shtml = '',
							obj = {
								'0':'未审核',
								'1':'审核通过',
								'2':'审核拒绝'
							};

						$.each(json, function(index, value){
							shtml += '<tr><td>'+ value.applyTime +'</td>';
							shtml += '<td>'+ value.bankName +'</td>';
							shtml += '<td>'+ value.bankNo +'</td>';
							shtml += '<td>'+ value.rmb +'</td>';
							shtml += '<td>'+ value.phone +'</td>';
							shtml += '<td>'+ obj[value.auditStatus] +'</td></tr>';
						});

						$('#ExchangeRmb').append(shtml);
					}
				});
			}
			init();

			$('.apply-exchange-btn').click(function(){
				$('.exchange-main').hide();
				$('.exchange-form').show();
			});

			//获取验证码
			$('.get-code-btn').click(function(){
				var phoneId = $('#phoneId').val();
				var _this = $(this),
					nowTime = 60;

				if(!/^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/.test(phoneId)){
					um.popupLayer.open({
						title:"书法报视频提示：",
						content:"请输入正确的手机号"
					});
					return false;
				}

				if($(this).text().indexOf('重新发送')!==-1){
					um.popupLayer.open({
						title:"书法报视频提示：",
						content:"请60秒后再试"
					});
					return false;
				};

				um.ajaxData.request('post',gUrl.usercenter.createPhoneCode_url,{phoneNo:phoneId},
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
								um.popupLayer.open({
									title:"书法报视频提示：",
									content:data.msg
								});
							}
						}
					}
				);
			});

			$('#coins').blur(function(){
				var val = $(this).val();
				if(val<500){
					um.popupLayer.alert('提现额度不能小于500元');
					val = 500;
				}
				$('#coins').val(val);
				$("#toExchangeNum").text(val||500);
			});
			
			//确定提现
			$('.submit-exchange').click(function(){
				var coins = $('#coins').val(),
					bankName = $('#bankName').val(),
					bankCard = $('#bankCard').val(),
					phoneCode = $('#phoneCode').val(),
					phoneId = $('#phoneId').val();

				if(!/\d/g.test(coins)){
					um.popupLayer.open({
						title:'书法报视频提示：',
						content:'请输入正确的提现金额'
					});
					return false;
				}

				if(!/^\d{16}|\d{19}$/.test(bankCard)){
					um.popupLayer.open({
						title:'书法报视频提示：',
						content:'请输入正确的银行卡号'
					});
					return false;
				}

				if(phoneCode == ""){
					um.popupLayer.open({
						title:"书法报视频提示：",
						content:"验证码不能为空"
					});
					return false;
				}else{
					//验证验证码
					um.ajaxData.request(
						'post',
						gUrl.usercenter.checkUserByPhoneCode_url,
						{userPhone:phoneId,code:phoneCode},
						function(data){
							if(data.code !== 0){
								um.popupLayer.open({
									title:"书法报视频提示：",
									content:data.msg||'异常错误'
								});	
							}else{
								var obj = {
									globalId:globalId,
									userBank:bankName,
									userBanknumber:bankCard,
									userPhone:phoneId
								};
								objJson = JSON.stringify(obj);

								um.ajaxData.request('post',gUrl.accounting.coins2Rmb_url,
									{
										globalId:globalId,
										ticketId:ticketId,
										coins:coins,
										applyMsg:objJson
									},
									function(data){
										if(data.code == 0){
											um.popupLayer.open({
													title:"书法报视频提示：",
													content:data.msg||'提现提交'
												});
										}else{
											um.popupLayer.open({
													title:"书法报视频提示：",
													content:data.msg||'异常错误'
												});
										}
									}
								);
							}	
						}
					);

				}
			});

			$('.cancel-exchange').click(function(){
				$('.exchange-main').show();
				$('.exchange-form').hide();
			});
		}

		
	});
});
