define(function(require, exports, module){
	var um = new UserManager(),
		iUserCenter = new IUserCenter();
	
    var loadHistoryList = function(){
    	var endTime = new Date().toLocaleDateString().replace(/\/(\d+)/g,function(all,m){return m<10?'-0'+m:'-'+m;}),
    		startTime = (function(){
    					    var now = new Date;
    					    now.setDate(now.getDate() - 7);
    					    return now.toLocaleDateString().replace(/\/(\d+)/g,function(all,m){return m<10?'-0'+m:'-'+m;});
    					})();

    	iUserCenter.getLearnRecordList(um.cookie.get('globalId'), startTime, endTime, function(data){
    		var sHtml = "<div class='empty-con'>暂无学习历史</div>";
    		if(data.code == 0){
    			if(data.body != null){
    				sHtml = "";
    				for(var k in data.body){
    					sHtml += '<li><p class="mh-title"><span class="mh-date">'+k+'</span><a class="mh-remove" href="javascript:void(0);">删除</a></p>'
    					+ '<ol>';
    					$.each(data.body[k], function(i, obj){
    						sHtml += '<li class="course-item" data-courseid="'+ obj.courseId +'">'
    						+ '<div class="c-poster"><img src="'+obj.courseImg+'"></div>'
    						+ '<div class="c-info"><p class="c-name">'+obj.courseTitle+'</p>'
    						+ '<p class="c-detail"><span class="fl c-price">￥'+obj.price+'</span><span class="fr c-num">'+obj.buyCount+'人已学</span></p>'
    						+ '</div><a class="c-delete" href="javascript:void(0);"></a></li>';
    					});
    					sHtml += '</ol><i class="mh-icon"></i></li>';
    				}
    			}
    		}
    		$(".my-history ul").html(sHtml);
    	});
    };
    
    loadHistoryList();

    //删除记录 -- 单条
    $(".my-history ul").delegate("li ol>li .c-delete", "click", function(){
    	var userGid = um.cookie.get('globalId'),
    	 	courseId = $(this).parents("li.course-item").data("courseid"),
    		date = $(this).parents('ol').prev().find('.mh-date').text(),
            _this = $(this);
    	um.popupLayer.confirm("您确定要删除此条学习记录么？",
			{btn:['确定', '取消']},
			function(index){
				iUserCenter.delHistoryById(userGid, courseId, date, function(data){
					if(data.code == 0){
						um.popupLayer.msg("操作成功！");
						_this.parents("li.course-item").remove();
					}else{
						um.popupLayer.alert("操作失败！");
					}
				});
				layer.close(index);
			}, 
			function(){
				return ;
			}
		);
    });
    
    //删除记录 -- 按时间
    $(".my-history ul").delegate("li .mh-remove", "click", function(){
    	var dateStr = $(this).siblings(".mh-date").text();
    	um.popupLayer.confirm("您确定要删除"+dateStr+"所有的学习记录么？",
			{btn:['确定', '取消']},
			function(index){
				iUserCenter.delHistoryByDate(um.cookie.get("globalId"), dateStr, function(data){
					if(data.code == 0){
						um.popupLayer.msg("操作成功！");
						loadHistoryList();
					}else{
						um.popupLayer.alert("操作失败！");
					}
				});
				layer.close(index);
			}, 
			function(){
				return ;
			}
		);
    });
});