define(function(require, exports, module){
	var um = new UserManager(),
		iUserCenter = new IUserCenter();
	
	$("ul.pay-num-selector li").click(function(){
		$(this).addClass("active").siblings().removeClass("active");
		var coins = parseInt($(this).attr("data-num"));
		$(".pay-coin b").html(coins);
	});
	
	//账户余额
	$('.coin-num b').text($('.u-coins label').text());
	$('.pay-nick').text($('.u-nick').text());

	//自定义充值金额
	$("#otherPay").blur(function() {
        var reg = /^([1-9]|[0-9]{0,4}\d|1000000)$/;
        if(reg.test($(this).val())){
			$(".otherwarn").css("color","#3f3f3f");
			$("ul.pay-num-selector li").removeClass("active");
			$(".pay-coin b").text($("#otherPay").val());
		}else{
			$("#otherPay").val("");
			$(".otherwarn").css("color","#ff0000");
			$("ul.pay-num-selector li").eq(0).addClass("active").siblings().removeClass("active");
			$(".pay-coin b").text($("ul.pay-num-selector li.active").attr("data-num"));
		}
    });
	
	$(".pay-submit").click(function(){
		if(!um.checkLogin()){
			openLoginRegistDialog('login.html');
			return;
		}
		var payUrl = um.gConfig.AJAX_URL.accounting.payOnLive_url,
			gid = um.cookie.get("globalId"),
			tid = um.cookie.get("ticketId"),
			price = $.trim($(".pay-coin b").text()),
			payWay = $("input[name='payChannel']:checked").attr("id");
		
		if("wechatPay" == payWay){
			var param = {
				"globalId" : gid,
				"ticketId" : tid,
				"price" : price,
				"payWay" : payWay
			};
			um.ajaxData.request(um.gConfig.METHOD.G, payUrl, param, function(data){
				if(data.code == 0){
					var codeImgUrl = "http://qr.liantu.com/api.php?gc=222222&el=l&w=200&m=10&text="+data.body.codeUrl;
					var sHtml = '<div class="wx-pay"><img src="'+codeImgUrl+'">'
						+ '<p>充值金额：'+price+'元</p></div>';
					layer.open({
					  type: 1,
					  title:false,
					  skin: 'layui-layer-rim', //加上边框
					  area: ['260px', '280px'], //宽高
					  content: sHtml
					});
				} 
			});
		}else{
			window.open(payUrl+"?globalId="+gid+"&ticketId="+tid+"&price="+price+"&payWay="+payWay);	
		}
		
		layer.confirm('充值是否成功？', {
			  scrollbar: false,
			  btn: ['成功','失败'] //按钮
			}, function(index){
				window.location.href = "/usercenter.html#balance";
				layer.close(index);
				showPageByOther();
			}, function(index){
				layer.close(index);
			}
		);

	});

});