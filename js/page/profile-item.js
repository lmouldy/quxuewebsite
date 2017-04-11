define(function(require, exports, module){
    require("util/common");
    require("page/interface/iUserCenter");
(function($){
    var um = new UserManager(),
        commonUtils = um.commonUtils,
        gUrl = um.gConfig.AJAX_URL;

    //引入头部导航
    $("#header").load("../header.html", function(){
        require("page/header");
        $("#navList li").each(function(){
            var link = $(this).attr("data-rel");
            if(link == 'profile.html?'+getUrlParam("type")){
                $(this).addClass('active').siblings().removeClass('active');
            }
        });
    });

    $('#footer').load('../footer.html');

    function init(){
    	
        var type = getUrlParam("type"), id = getUrlParam("id");
        var reqUrl = "";
        if(type == 'video'){
        	reqUrl = gUrl.datahouse.getPreviewInfo_url;
        }else if(type == 'kt'){
        	reqUrl = gUrl.pws.getTalkingById_url;
        }
        um.ajaxData.request('post', reqUrl, {id:id}, function(data){
            if(data.code == 0){
                $(".tit").html(data.body.title);
                $(".date").html(data.body.createTime);
                var content = data.body.introduction? data.body.introduction :data.body.content;
                content = commonUtils.HTMLDecodeHandler(content);
                $(".content").html(content);
                if($(".content").find("video").length > 0){  
                	for(var i=0; i<$(".content").find("video").length; i++){
                		var obj = $(".content").find("video")[i];
                		var srcUrl = $(obj).attr("src"),
                		w = $(obj).width(),
                		h = $(obj).height();
                		//var shtml = '<video width="'+w+'" height="'+h+'"controls autobuffer src="'+srcUrl+'"><source src="'+srcUrl+'" type="video/mp4"></video>';
                		
                		var randomId = "obj"+Math.floor(Math.random()*10000);
                		var shtml = '<div id="'+randomId+'" style="width:'+w+'px;height:'+h+'px;margin-left: 2em;"><div class="flowplayer"></div></div>';
                		$(obj).replaceWith(shtml);
                		$("#"+randomId+"").parent().css("text-indent","0");
                		flowplayer($("#"+randomId+" .flowplayer"), {
        					swfHls:window.location.protocol+"//"+window.location.host+"/vodplayer/flowplayerhls.swf",
        					autoplay:true,loop:true,tooltip:false, bgcolor:"#fff",
        				    clip: {
        				        sources: [
        				              { type: "application/x-mpegurl",
        				                src: srcUrl }
        				        ]
        				    }
        				});

                	} 	
                	
                }

            }
        });
    }
    init();
})(jQuery);
});
