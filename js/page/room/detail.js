/**
 * Created by Administrator on 2016/7/14.
 */
define(function(require, exports, module){
    require("util/common");
    require("page/interface/iUserCenter");
(function($){
	var um = new UserManager(),
		commonUtils = um.commonUtils,
        gUrl = um.gConfig.AJAX_URL,
		iUserCenter = new IUserCenter();
	
    //引入头部导航
    $("#header").load("../header.html", function(){
    	require("page/header");
    });

    $('#footer').load('../footer.html');


    var type = getUrlParam("type"),
    	id = getUrlParam("id"),
    	teacherId = getUrlParam("tid");
    
    switch(type){
    case 'study': 
        $('.list-title').text('学术研究');
    	iUserCenter.getStudyById(id, function(data){
    		if(data.code == 0){
    			$(".article .article-tit").html(data.body.title);
    			$(".article .article-date").html(data.body.lastTime);
    			$(".article .article-con").html(commonUtils.HTMLDecodeHandler(data.body.content));
    		}
    	});
    	iUserCenter.getStudyList(teacherId, function(data){
    		var sHtml = "";
    		if(data.code == 0){
    			var obj = data.body;
    			for(var i=0; i<obj.length; i++){
    				sHtml += '<dl id="'+obj[i].id+'" + data-type="study" data-tid="'+teacherId+'"><dt>'+obj[i].title+'</dt>'
    					+ '<dd>'+commonUtils.HTMLDecodeHandler(obj[i].content)+'</dd></dl>';
    			}
    		}
    		$(".detail-list .list-item").html(sHtml);
    	});
        $('title').text('学术研究');
    	break;
    case 'activity': 
        $('.list-title').text('相关活动');
    	iUserCenter.getArtActivityById(id, function(data){
    		if(data.code == 0){
    			$(".article .article-tit").html(data.body.title);
    			$(".article .article-date").html(data.body.lastTime);
    			$(".article .article-con").html(commonUtils.HTMLDecodeHandler(data.body.content));
    		}
    	});
    	iUserCenter.getArtActivityList(teacherId, function(data){
    		var sHtml = "";
    		if(data.code == 0){
    			var obj = data.body;
    			for(var i=0; i<obj.length; i++){
    				sHtml += '<dl id="'+obj[i].id+'" + data-type="activity" data-tid="'+teacherId+'"><dt>'+obj[i].title+'</dt>'
    					+ '<dd>'+commonUtils.HTMLDecodeHandler(obj[i].content)+'</dd></dl>';
    			}
    		}
    		$(".detail-list .list-item").html(sHtml);
    	});
        $('title').text('艺术活动');
    	break;
    case 'notice':
        $('.list-title').text('相关公告');
    	iUserCenter.getNoticeById(id, function(data){
    		if(data.code == 0){
    			$(".article .article-tit").html(data.body.title);
    			$(".article .article-date").html(data.body.lastTime);
    			$(".article .article-con").html(commonUtils.HTMLDecodeHandler(data.body.content));
    		}
    	});
    	iUserCenter.getNoticeList(teacherId, "", function(data){
    		var sHtml = "";
    		if(data.code == 0){
    			var obj = data.body;
    			for(var i=0; i<obj.length; i++){
    				sHtml += '<dl id="'+obj[i].id+'" + data-type="notice" data-tid="'+teacherId+'"><dt>'+obj[i].title+'</dt>'
    					+ '<dd>'+commonUtils.HTMLDecodeHandler(obj[i].content)+'</dd></dl>';
    			}
    		}
    		$(".detail-list .list-item").html(sHtml);
    	});
        $('title').text('公示公告');
    	break;
    case 'preview': 
        $('.con-title').html('<a href="../index.html">首页</a>&gt;精彩预告');
        $('.list-title').text('相关预告');
        um.ajaxData.request('post',gUrl.datahouse.getPreviewInfo_url,{id:id},function(data){
            if(data.code == 0){
                $(".article .article-tit").html(data.body.lesson);
                $(".article .article-date").html(data.body.createTime);
                $(".article .article-con").html(commonUtils.HTMLDecodeHandler(data.body.introduction));
            }
        });
        um.ajaxData.request('get', gUrl.datahouse.queryByKey_url, {key: "LIVE_PREVIEW"},function(data){
            var shtml = '';
            if (data.code == 0 && data.body.LIVE_PREVIEW) {
                var json = data.body.LIVE_PREVIEW;
                $.each(json, function(index, value){
                    shtml += '<dl id="'+ value.id +'" data-type="preview"><dt>'+ value.lesson +'</dt>';
                    shtml += '<dd>'+ value.outline +'</dd></dl>';
                });

                $(".detail-list .list-item").html(shtml);
            }
        });
        $('title').text('精彩预告');
        break;
    }

    //相关预告事件
    $('.list-item').on('click', 'dl', function(){
        var id = $(this).attr('id'),
            type = $(this).data('type'),
            tid = $(this).data('tid');
        if(!tid){
            window.location.href = "detail.html?type=" + type + "&id=" + id; 
        }else{
            window.location.href = "detail.html?type=" + type + "&id=" + id  + "&tid=" + tid; 
        }
        
    });
})(jQuery);
});