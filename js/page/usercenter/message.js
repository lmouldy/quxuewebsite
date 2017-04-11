define(function(require, exports, module){
	var um = new UserManager(),
	    gUrl = um.gConfig.AJAX_URL,
		cookie = um.cookie,
		commonUtils = um.commonUtils,
		iUserCenter = new IUserCenter();
	var pageSize = 20, pageNo = 1;
	
	$(".u-tab a").click(function(){
		$(this).addClass("active").siblings().removeClass("active");
    	var dataRel = $(this).attr("data-rel");
    	var dataType = $(this).attr("data-type");
    	$("."+dataRel).show().siblings().hide();
    	getMessageList(dataType);
    });
	
	var getMessageList = function(type){
		var param = {
	        "globalId" : cookie.get("globalId"),
	        "type" : type, //1:系统通知 2：系统公告
	        "pageSize":pageSize,
			"page":pageNo
	    };
		var opts = {};
		opts.pNo = pageNo,
		opts.pSize = pageSize,
		opts.pDis = pageSize;
		if(type == 2){
			opts.pId = "mPage2",
			opts.fn = callback_getAnnouncementList;
		}else{
			opts.pId = "mPage1",
			opts.fn = callback_getNoticeList;
		}
		
		opts.url = gUrl.room.pageSysNotice_url,
		opts.params = param,
		opts.curName = "page";
		commonUtils.dynamicPage(opts);
	};
	
	getMessageList(1);
	
	
	function callback_getNoticeList(obj){
		var sHtml = "";
		for(var i=0; i<obj.length; i++){
			sHtml += '<li id="'+ obj[i].id +'" data-type="1">'
				+ '<span><input type="checkbox" name="checkOne"></span>'
				+ '<span class="msg-date">' + obj[i].createTime + '</span>'
				+ '<span class="msg-desc">'+obj[i].title+'</span>';
			if(obj[i].content == "buyLesson"){
				sHtml += '<a class="detail-link" href="javascript:void(0);">查看详情</a>';
			}
			sHtml += '<a class="msg-remove" href="javascript:void(0);">删除</a>'
				+ '</li>';
		}
		$(".notice ol").html(sHtml);
		$("#nCheckAll").prop("checked", false);
	}
	
	$(".notice ol").delegate("li .detail-link", "click", function(){
		window.location.href="/usercenter.html#myCourse";
		showPageByOther();
	});
	
	
	function callback_getAnnouncementList(obj){
		var sHtml = "";
		for(var i=0; i<obj.length; i++){
			sHtml += '<li id="'+ obj[i].id +'" data-type="2">'
				+ '<div class="msg-info">'
				+ '<span><input type="checkbox" name="checkOne"></span>'
				+ '<span class="msg-title">'+obj[i].title+'</span>'
				+ '<span class="msg-date">' + obj[i].createTime + '</span>'
				+ '<a class="msg-remove" href="javascript:void(0);">删除</a></div>'
				+ ' <div class="msg-detail">'+obj[i].content+'</div>'
				+ '</li>';
		}
		$(".announcement ol").html(sHtml);
		$("#aCheckAll").prop("checked", false);
	}
	
	//全选
	$("#nCheckAll, .ncheck-all-label").click(function(){
		if($("#nCheckAll").prop("checked")){
			$(".notice ol").find("li input[name=checkOne]").prop("checked", true);
		}else{
			$(".notice ol").find("li input[name=checkOne]").prop("checked", false);
		}
	});
	//全选
	$("#aCheckAll, .acheck-all-label").click(function(){
		if($("#aCheckAll").prop("checked")){
			$(".announcement ol").find("li input[name=checkOne]").prop("checked", true);
		}else{
			$(".announcement ol").find("li input[name=checkOne]").prop("checked", false);
		}
	});
	
	//消息删除方法
	function delSystemMsgs(id, type){
		um.popupLayer.confirm("您确定要删除吗？",
			{btn:['确定', '取消']},
			function(index){
				iUserCenter.delSysMsg(cookie.get("globalId"), cookie.get("ticketId"), id, function(data){
					if(data.code == 0){
						um.popupLayer.msg("操作成功！");
						getMessageList(type);
					}else{
						um.popupLayer.alert("操作失败！");
					}
				});
				
				layer.close(index);
			}, 
			function(){
				$(".msg-con").find("input[type=checkbox]").prop("checked", false);
				return ;
			}
		);
	}
	
	//单个删除
	$(".msg-con ol").delegate("li .msg-remove", "click", function(){
		var id = $(this).parents("li").attr("id");
		var type = $(this).parents("li").attr("data-type");
		delSystemMsgs(id, type);
	});
	
	$(".notice .remove-all").click(function(){
		var selectedList = $(".notice ol").find("li input[name=checkOne]:checked");
		if(selectedList.length < 1){
			um.popupLayer.alert("请选择要删除的消息！");
			return ;
		}
		var ids = "";
		for(var i=0; i<selectedList.length; i++){
			ids += $(selectedList[i]).parents("li").attr("id") + ",";
		}
		ids = ids.substring(0, ids.length-1);
		delSystemMsgs(ids, 1);
	});
	
	
	$(".announcement .remove-all").click(function(){
		var selectedList = $(".announcement ol").find("li input[name=checkOne]:checked");
		if(selectedList.length < 1){
			um.popupLayer.alert("请选择要删除的消息！");
			return ;
		}
		var ids = "";
		for(var i=0; i<selectedList.length; i++){
			ids += $(selectedList[i]).parents("li").attr("id") + ",";
		}
		ids = ids.substring(0, ids.length-1);
		delSystemMsgs(ids, 2);
	});
	
	
});