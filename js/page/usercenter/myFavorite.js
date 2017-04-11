define(function(require, exports, module){
	var um = new UserManager();
    var iUserCenter = new IUserCenter();
    
    var loadFavoriteList = function(){
        iUserCenter.getFavoriteList(function(data){
        	var sHtml = "<div class='empty-con'>暂无收藏，现在就去收藏<a href='/teacherLesson.html?teacherLesson' target='teacherLesson'>课程</a></div>";
        	if(0 == data.code){
        		for(var k in data.body){
        			var obj = data.body[k];
        			sHtml += '<li id="'+obj.courseId+'" class="fl">'
        				+ '<div class="mf-poster"><img src="'+obj.courseImg+'"></div>'
        				+ '<div class="mf-info">'
        				+ '<p class="mf-name ellipsis">'+obj.courseTitle+'</p>'
        				+ '<p class="mf-detail"><span class="fl mf-price">￥'+obj.price+'</span><span class="fr mf-num">'+obj.buyCount+'人已学</span></p>'
        				+ '</div>'
        				+ '<a class="mf-delete" href="javascript:void(0);"></a></li>';
        		}
        	}
        	$(".my-favorite ol").html(sHtml);
        });
    };
    
    loadFavoriteList();
    
    //取消收藏
    $(".my-favorite ol").delegate("li .mf-delete", "click", function(){
    	var courseId = $(this).parents("li").attr("id");
    	um.popupLayer.confirm("您确定要取消该课程的收藏吗？", 
			{btn:['确定', '取消']},function(){
				iUserCenter.removeFavoriteCourse(courseId, function(data){
		    		if(data.code == 0){
		    			um.popupLayer.msg("操作成功！");
		    			loadFavoriteList();
		    		}else{
		    			um.popupLayer.alert("操作失败！");
		    		}
		    	});
			}, function(index){
    			um.popupLayer.close(index);
			}
    	);
    	
    });
});