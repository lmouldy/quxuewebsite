define(function(require, exports, module){
    var um = new UserManager(),
    	iUserCenter = new IUserCenter();

    var loadFocusList = function(){
        iUserCenter.getFocusList(function(data){
        	var sHtml = "<div class='empty-con'>暂无关注，现在就去关注<a href='/hotlive.html' target='hotlive'>名师</a></div>";
        	if(data.code == 0){
        		var obj = data.body;
        		if(obj != null){
        			sHtml = "";
        			for(var i in obj){
        				sHtml += '<li id="'+obj[i].globalId+'" class="fl">';
        				sHtml += '<div class="mf-poster"><img src="'+obj[i].roomImage+'">';
        				
        				if(obj[i].lveState && obj[i].liveState == 1){
        					sHtml +='<i class="live-icon"></i>';
        				}
        				
        				sHtml += '</div><p class="mf-name ellipsis">'+obj[i].roomTitle+'</p>' ;
        				sHtml += '<a class="mf-delete" href="javascript:void(0);"></a>';
        				sHtml += '</li>';
        			}
        		}
        	}  
        	$(".my-focus ol").html(sHtml);
        });
    };
    
    loadFocusList();
    
    //取消关注
    $(".my-focus ol").delegate("li .mf-delete", "click", function(){
    	var teacherId = $(this).parents("li").attr("id");
    	um.popupLayer.confirm("您确定要取消对该课程的关注吗？",
    			{btn:['确定', '取消']},
    			function(index){
    				um.cancelFocus(teacherId, function(data){
    		    		if(data.code == 0){
    		    			um.popupLayer.msg("操作成功！");
    		    			loadFocusList();
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