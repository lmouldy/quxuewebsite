define(function(require, exports, module){
	var um = new UserManager(),
	    gUrl = um.gConfig.AJAX_URL,
		cookie = um.cookie,
		commonUtils = um.commonUtils;
	var pageSize = 15, pageNo = 1;
	
	$(function(){
		//账户余额
		$('.mb-info-coins').text(cookie.get("assetBill") + '金币');
	});
	
	
	var payway = {
		'alipay': '支付宝',
		'unionPay': '银联',
		'tenPay': '财付通',
		'wechatPay': '微信支付',
		'account':'余额支付',
		'app_unionPay':'移动银联',
		'app_alipay':'手机支付宝',
		'app_wechatPay':'手机微信',
		'apple': '苹果支付'
	};
	
	var getPayRecordList = function(){
		var param = {
			"globalId" : cookie.get("globalId"),
			"status":1,
			"pageSize":pageSize,
			"page":pageNo
		};
		var opts = {};
		opts.pNo = pageNo,
		opts.pSize = pageSize,
		opts.pDis = pageSize,
		opts.pId = "bPage1",
		opts.fn = callback_getMyCourseList,
		opts.url = gUrl.accounting.pagePayRecord_url,
		opts.params = param,
		opts.curName = "page";
		commonUtils.dynamicPage(opts);
	};
	
	getPayRecordList();

	function callback_getMyCourseList(obj){
			var shtml = '';
			var nickname = $('.u-nick').text();

			$.each(obj, function(index, value){
				shtml += '<tr><td>'+ value.createTime +'</td>';
				shtml += ' <td>' + value.payId + '</td>';
				shtml += '<td>' + value.price + '</td>';
				shtml += ' <td>' + payway[value.payWay] + '</td>';
				shtml += '<td>' + nickname + '</td</tr>';
			});

			$('#payRecordList tbody').html(shtml);
		
	}
	
	var getSendRecordList = function(){
		var param = {
			"globalId" : cookie.get("globalId"),
			"ticketId": cookie.get("ticketId"),
			"pageSize":pageSize,
			"page":pageNo
		};
		var opts = {};
		opts.pNo = pageNo,
		opts.pSize = pageSize,
		opts.pDis = pageSize,
		opts.pId = "bPage2",
		opts.fn = callback_getSendRecordList,
		opts.url = gUrl.shop.sendGiftRecord_url,
		opts.params = param,
		opts.curName = "page";
		commonUtils.dynamicPage(opts);
	};
	
	
	function callback_getSendRecordList(obj){
		var shtml = '';

		$.each(obj, function(index, value){
			shtml += '<tr><td>'+ value.createTime +'</td>';
			shtml += '<td>' + value.orderId + '</td>';
			shtml += '<td>' + value.roomId + '</td>';
			shtml += '<td>' + value.teacherName + '</td>';
			shtml += '<td>' + value.productName + '</td>';
			shtml += '<td>' + value.num + '</td>';
			shtml += '<td>' + value.price + '</td></tr>';
		});

		$('#sendRecordList tbody').html(shtml);
	}

	//充值
	$('.mb-pay-btn').click(function(){
		window.location.href = 'usercenter.html#pay';
		window.location.reload();
	});

	$('.u-tab a').click(function(){
		$(this).addClass('active').siblings().removeClass('active');

		if($('.u-tab a').index(this) == 0){
			$('#payRecordList').show();
			$('#sendRecordList').hide();

			getPayRecordList();
		}else{
			$('#sendRecordList').show();
			$('#payRecordList').hide();
			getSendRecordList();
		}
	});
	
});