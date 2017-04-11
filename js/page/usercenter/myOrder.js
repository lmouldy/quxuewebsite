define(function(require, exports, module){
	var um = new UserManager(),
    	gUrl = um.gConfig.AJAX_URL,
    	cookie = um.cookie,
    	commonUtils = um.commonUtils,
    	iUserCenter = new IUserCenter();
	var pageSize = 7, pageNo = 1;

	//查看课程购买记录
	var loadOrderList = function(status, lessonTitle){
		var param = {
	        "globalId" : cookie.get("globalId"),
	        "page" : pageNo,
	        "pageSize" : pageSize
	    };
		if(status){
			param['status'] = status;//0:未完成  1：成功支付
		}
		if(lessonTitle){//课程名称
			param['lessonTitle'] = lessonTitle;
		}
		
		var opts = {};
		opts.pNo = pageNo,
		opts.pSize = pageSize,
		opts.pDis = pageSize,
		opts.pId = "oPage",
		opts.fn = callback_loadOrderList,
		opts.url = gUrl.accounting.pageLessonOrder_url,
		opts.params = param,
		opts.curName = "page";
		commonUtils.dynamicPage(opts);
	};
	
	loadOrderList();
	
	function callback_loadOrderList(obj){
		var sHtml = "";
		if(obj && obj.length > 0){
			for(var i=0; i<obj.length; i++){
				var link = "room/offlineVideo.html?tid="+obj[i].teacherId+"&cid="+obj[i].courseId;
				var state = obj[i].payStatus == 0 ? "待付款" : "已完成";
				sHtml += '<tr><td class="col1">'+obj[i].orderTime.substring(0, obj[i].orderTime.length-2)+'</td>'
					+ '<td class="col2">'+obj[i].orderId+'</td>'
					+ '<td class="col3"><a target="_blank" href="'+link+'"><img src="'+obj[i].courseImg+'"><span>'+obj[i].courseTitle+'</span></a></td>'
					+ '<td class="col4">'+obj[i].buyCount+'</td>'
					+ '<td class="col5">'+obj[i].lessonPrice+'</td>'
					+ '<td class="col6">'+obj[i].vaildTime+'天</td>'
					+ '<td class="col7">'+state+'</td>';
				if(obj[i].payStatus == 0){
					sHtml += '<td class="col8"><a class="mc-pay-btn" target="_blank" href="./purchase.html?tid='+obj[i].teacherId+'&cid='+obj[i].lessonId+'&oid='+ obj[i].orderId +'">立即支付</a>'
						+'<a class="mc-remove-btn" href="javascript:void(0);" data-orderId="'+obj[i].orderId+'">删除</a></td>';
				}else{
					sHtml += '<td class="col8"><a class="mc-remove-btn" href="javascript:void(0);" data-orderId="'+obj[i].orderId+'">删除</a></td></tr>';
				}
			}
			$(".my-order table>tbody").html(sHtml);
		}else{
			sHtml = '<div class="empty-con">暂无订单</div>';
			$(".my-order").html(sHtml);
		}
		
	};
	

    $(".my-order .u-tab a").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var dataRel = $(this).attr("data-rel");
        loadOrderList(dataRel);
    });
    
    //删除订单
    $(".my-order table>tbody").delegate("tr>td .mc-remove-btn", "click", function(){
    	var orderId = $(this).attr("data-orderId");
    	var dataRel = $(".my-order .u-tab").find("a.active").attr("data-rel");
    	um.popupLayer.confirm("您确定要删除该订单吗？",
			{btn:['确定', '取消']},
			function(index){
				iUserCenter.deleteOrder(cookie.get("globalId"), cookie.get("ticketId"), orderId, function(data){
		    		if(data.code == 0){
		    			um.popupLayer.msg("删除成功！");
		    			loadOrderList(dataRel);
		    		}else{
		    			um.popupLayer.alert("删除失败！<br>"+data.msg);
		    		}
		    	});
				layer.close(index);
			}, 
			function(){
				return ;
			}
		);
    });
    
    //搜索
    var searchFun = function(){
    	var searchTxt = $(".u-search input[type=text]").val();
    	if(searchTxt == ""){
    		um.popupLayer.alert("请输入要查询的课程名称！");
    		return;
    	}
    	var dataRel = $(".my-order .u-tab").find("a.active").attr("data-rel");
    	loadOrderList(dataRel, searchTxt);
    };
    $(".u-search .search-btn").click(function(){
    	searchFun();
    });
    
    um.commonUtils.enterEventHandler($(".u-search input[type=text]"), searchFun);
    
});