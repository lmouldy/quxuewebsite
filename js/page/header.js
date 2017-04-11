define(function(require, exports, module){
(function($){
    var um = new UserManager(),
    	//gMethod = um.gConfig.METHOD,
    	//gUrl = um.gConfig.AJAX_URL,
       // commonUtils = um.commonUtils,
        cookie = um.cookie,
        bLogin = um.checkLogin();

    var pageLink = window.location.href;
    var curPage = pageLink.substring(pageLink.lastIndexOf('/')+1);
    $("#navList li").each(function(){
        var link = $(this).attr("data-rel");
        if(curPage.indexOf(link) > -1){
            $(this).addClass('active').siblings().removeClass('active');
        }
    });

    //已登录的操作
    if(bLogin){
        //如果已登录则显示登录后的导航
    	$(".header-inner .logged-in").show().siblings(".header-btn").hide();
        var uBox = $(".logged-in .user-box");
        uBox.find(".user-nick span").html(cookie.get("userNickname"));
        
        //链接
        $(".logged-in .user-box .user-nick, .logged-in .user-link-box").hover(function(){
        	var toLeft = $(".logged-in .user-box .user-nick").offset().left - $(".logged-in").offset().left ;
			$(".logged-in .user-link-box").css("left", toLeft).show();
		},function(){
			$(".logged-in .user-link-box").hide();
		});
        
        um.getUserRoom(cookie.get("globalId"), cookie.get("ticketId"), function(data){
        	if(data.code == 0){
        		$(".user-link-box").append('<a href="/rm/'+data.body.roomId+'" target="_blank">我的直播间</a>');
        		$(".user-box .user-nick").attr("href", "/usercenter.html#roomSet");
        	}else{
        		$(".user-box .user-nick").attr("href", "/usercenter.html#myCourse");
        	}
        });
        
        //获取消息条数
        
        //退出登录
        uBox.find(".exit-btn").click(function(){
        	function callback(){
				window.location.reload();
			}
        	um.exit(callback);
        });
        
    }else{
        //未登录显示的导航
        $(".header-inner .not-logged").show().siblings().hide();
    }

    $('.update').click(function(){
        if(bLogin){
            window.location.href = '/update.html';
        }else{
            openLoginRegistDialog('login.html');
        }
    })

    /*搜索功能*/
    var search = function(){
        var obj = {
            '老师昵称':'userNickname',
            '课程名称':'courseName',
            '教室编号':'roomId'
        };
        
        var val = $("#hSearchBox .search-text").val();
        var typeName = $("#hSearchBox .search-type-show span").text();
        var type = obj[typeName] ? obj[typeName] : 'userNickname';
        window.location.href = "../search.html?val=" + val + "&type=" + type;
    };

    $('.search-btn').click(search);
    um.commonUtils.enterEventHandler($('.search-box input'), search);
    
    $("#hSearchBox .search-type-show").click(function(){
    	$("#hSearchBox .search-type ul").fadeToggle();
    });
    
    $("#hSearchBox .search-type ul li").click(function(){
        $("#hSearchBox .search-type-show span").text($(this).text());
        $("#hSearchBox .search-type ul").fadeOut();
    });
})(jQuery);
});