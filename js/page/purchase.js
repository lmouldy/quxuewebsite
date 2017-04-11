define(function(require, exports, module){
	require('util/common');

	$('#header').load('./header.html',function(){
		require('page/header');
	});
	$('#footer').load('./footer.html');

	var um = new UserManager(),
		gMethod = um.gConfig.METHOD,
		gUrl = um.gConfig.AJAX_URL;

	$(function(){
		var tid = getUrlParam("tid"), cid = getUrlParam("cid"), orderId = getUrlParam('oid');
		um.checkSingle(function(data){
			if(data.code == 0){
				$("#usableCoin").html(data.body.assetBill);
			}
		});
		
		var param = {
	    		"courseId" : cid
	    };
	    um.ajaxData.request(gMethod.P, gUrl.shop.getCourseInfoById_url, param, function(data){
	        if(data.code == 0){
	        	$(".information .course").text(data.body.courseTitle);
	        	$(".information .money b").text(data.body.price);
	        	
	        	if(parseInt(um.cookie.get("assetBill")) < parseInt(data.body.price)){
	        		$("#useableTips").show();
	        	}else{
	        		$("#useableTips").hide();
	        	}
	        	
	        }
	    });
	   
	    $("#usableChk").change(function(){
	    	if($(this).prop("checked")){
	    		$("#threepay").prop("checked", false);
	    	}else{
	    		$("#threepay").prop("checked", true);
	    	}
	    });
	    
	    $("#threepay").change(function(){
	    	if($(this).prop("checked")){
	    		$("#usableChk").prop("checked", false);
	    	}else{
	    		$("#usableChk").prop("checked", true);
	    	}
	    });
	    
	    
	    
	    $("#submitBtn").click(function(){
	    	var payType = "";
	    	if($("#usableChk").prop("checked")){
	    		payType = "account";
	    		var param = {
	    			"orderId":orderId,
    				"sellerId":tid, //课程所属人id
    				"buyerId":um.cookie.get("globalId"),//购买人id
    				"ticketId":um.cookie.get("ticketId"),
    				"lessonId":cid,//课程id
    				"payWay":payType//支付方式
    			}; 
	    		um.ajaxData.request(gMethod.G, gUrl.accounting.buyLesson_url, param, function(data){
					if(data.code == 0){
						window.location.href = "/usercenter.html#myCourse";
					}else{
						um.popupLayer.alert(data.msg);
					}
				});
	    	}else{
	    		$(".threepay-box input[name='pay']").each(function(){
		    		if($(this).prop("checked")){
		    			payType = $(this).val();
		    		}
		    	});
	    		if("wechatPay" == payType){
	    			var param = {
        				"sellerId":tid, //课程所属人id
        				"buyerId":um.cookie.get("globalId"),//购买人id
        				"ticketId": um.cookie.get("ticketId"),
        				"lessonId":cid,//课程id
        				"payWay":payType//支付方式
        			}; 
	    			um.ajaxData.request(um.gConfig.METHOD.G, gUrl.accounting.buyLesson_url, param, function(data){
	    				if(data.code == 0){
	    					var codeImgUrl = "http://qr.liantu.com/api.php?gc=222222&el=l&w=200&m=10&text="+data.body.codeUrl;
	    					var sHtml = '<div class="wx-pay"><img src="'+codeImgUrl+'">'
	    						+ '<p>充值金额：'+$(".information .money b").text()+'元</p></div>';
	    					layer.open({
	    					  type: 1,
	    					  title:false,
	    					  skin: 'layui-layer-rim', //加上边框
	    					  area: ['260px', '280px'], //宽高
	    					  content: sHtml
	    					});
	    				}else{
	    					um.popupLayer.alert(data.msg);
	    				} 
	    			});
	    		}else{
	    			window.open(gUrl.accounting.buyLesson_url+"?sellerId="+tid+"&buyerId="+um.cookie.get("globalId")+"&ticketId="+um.cookie.get("ticketId")+"&lessonId="+cid+"&payWay="+payType);	
	    		}
	    		
	    	}

		});
	    
	});
	

});