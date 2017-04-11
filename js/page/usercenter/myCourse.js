define(function(require, exports, module){
	require("util/DateFormateUtil");
	var um = new UserManager(),
		cookie = um.cookie,
		iUserCenter = new IUserCenter(),
		dateFormateUtil = new DateFormateUtil();
	
	var getMyCourseList = function(courseName){
		iUserCenter.getCourseInfoByUser(cookie.get("globalId"), courseName, function(data){
			var sHtml = '<div class="empty-con">暂无课程，现在就去选<a href="/teacherLesson.html?teacherLesson" target="teacherLesson">课程</a></div>';
			if(data.code == 0){
				var obj = data.body;
				if(obj.length>0){
					sHtml = '';
					for(var i=0; i<obj.length; i++){
						var valid = parseInt(obj[i].vaildTime/30);
						var days = dateFormateUtil.daysBetween(obj[i].createTime, dateFormateUtil.getCurentDate());
						var usefulDate = obj[i].vaildTime - days;
						var link = "room/offlineVideo.html?tid="+obj[i].teacherId+"&cid="+obj[i].courseId;
						sHtml += '<li>'
							+ '<a class="fl mc-pic" target="_blank" href="'+link+'"><img src="'+obj[i].courseImg+'"></a>'
							+ '<div class="fl mc-info"><a class="mc-name" target="_blank" href="'+link+'">'+obj[i].courseTitle+'</a>'
							+ '<p><span class="mc-price">价格：<label>'+obj[i].price+'金币</label></span>'
							+ '<span class="mc-time">课时：<label>'+obj[i].courseCount+'</label></span>'
							+ '<span class="mc-valid">有效期：<label>'+(valid % 12 == 0 ? (valid / 12)+"年" : valid+"个月")+'</label></span></p>'
							+ '<p><span class="mc-buy-time">购买时间：<label>'+obj[i].createTime+'</label></span></p>'
							+ '<p><span class="mc-useful-time">有效时间：<label>'+usefulDate+'天</label></span></p>'
							+ '</div></li>';
					}
				}
			}
			$(".my-course ul").html(sHtml);
			
		});
	};
	
	getMyCourseList();

	var searchFun = function(){
		var searchTxt = $(".u-search input[type=text]").val();
		getMyCourseList(searchTxt);
	};
	
	$(".u-search .search-btn").click(function(){
		searchFun();
	});
	
	um.commonUtils.enterEventHandler($(".u-search input[type=text]"), searchFun);
	
});