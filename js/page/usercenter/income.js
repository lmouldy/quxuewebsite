define(function(require, exports, module){
	var um = new UserManager(),
	    gUrl = um.gConfig.AJAX_URL,
		cookie = um.cookie,
		commonUtils = um.commonUtils;
	var pageSize = 18, pageNo = 1;
	
	var getCourseIncomeList = function(){
		var param = {
			"globalId" : cookie.get("globalId"),
			"pageSize":pageSize,
			"page":pageNo
		};
		var opts = {};
		opts.pNo = pageNo,
		opts.pSize = pageSize,
		opts.pDis = pageSize,
		opts.pId = "iPage1",
		opts.fn = callback_getCourseIncomeList,
		opts.url = gUrl.accounting.pageLessonIncome_url,
		opts.params = param,
		opts.curName = "page";
		commonUtils.dynamicPage(opts);
	};
	
	getCourseIncomeList();
	
	function callback_getCourseIncomeList(obj, totalcount){
		$("#totalCoins").text(cookie.get("lessonIncome"));
		$("#totalCount").text(totalcount);
		var sHtml = "";
		for(var i=0; i<obj.length; i++){
			sHtml += '<tr><td>'+obj[i].payTime+'</td>'
				+ '<td>'+obj[i].courseTitle+'</td>'
				+ '<td>'+obj[i].lessonPrice+'</td><td>1</td>'
				+ '<td>'+obj[i].userNickname+'</td></tr>';
		}
		$("#courseIncomeList table>tbody").html(sHtml);
	};
	
	
	var getGiftIncomeList = function(){
		var param = {
			"globalId" : cookie.get("globalId"),
			"pageSize":pageSize,
			"page":pageNo
		};
		var opts = {};
		opts.pNo = pageNo,
		opts.pSize = pageSize,
		opts.pDis = pageSize,
		opts.pId = "iPage2",
		opts.fn = callback_getGiftIncomeList,
		opts.url = gUrl.accounting.pageGiftIncome_url,
		opts.params = param,
		opts.curName = "page";
		commonUtils.dynamicPage(opts);
	};
	
	
	function callback_getGiftIncomeList(obj, totalcount){
		$("#totalCoins").text(cookie.get("giftIncome"));
		$("#totalCount").text(totalcount);
		var sHtml = "";
		for(var i=0; i<obj.length; i++){
			sHtml += '<tr><td>'+obj[i].orderTime.substring(0, obj[i].orderTime.length-2)+'</td>'
				+ '<td>'+obj[i].productName+'</td>'
				+ '<td>'+obj[i].productNum+'</td>'
				+ '<td>'+obj[i].coins+'</td>'
				+ '<td>'+obj[i].userNickname+'</td></tr>';
		}
		$("#giftIncomeList table>tbody").html(sHtml);
	};
	
	
	$(".mi-tab a").click(function(){
		var dataRel = $(this).attr("data-rel");
		if(dataRel == "courseIncomeList"){
			getCourseIncomeList();
		}else{
			getGiftIncomeList();
		}
		$("#"+dataRel).show().siblings().hide();
	});
	
});