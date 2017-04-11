define(function(require, exports, module){
    require("util/common");
    require("page/interface/iUserCenter");
    
    (function($){
        var um = new UserManager(),
            cookie = um.cookie;

        //引入头部导航
        $("#header").load("/header.html", function(){
        	require ("page/header");
        });
        
        //用户信息
        var loadUserInfo = (function(){
        	if(um.checkLogin()){
        		um.loadUserInfo(function(data){
            		if(data.code == 0){
            			$(".u-base-info .u-ava img").attr("src",  data.body.userImageurl);
            			$(".u-base-info .u-nick").html(data.body.userNickname);
            			cookie.set("assetBill", data.body.assetBill);
            			$(".u-base-info .u-coins label").html(data.body.assetBill);
            			$(".u-base-info .u-beans label").html(data.body.assetGiftDou);
            		}
            	});
                um.getUserRoom(cookie.get("globalId"), cookie.get("ticketId"), function(data){
                    if(data.code == 0 && data.body.roomId){
                        $('.teacher-apply-link').hide();
                        $('.u-menu .only-teacher').show();
                    };
                });
        	}else{
        		layer.msg('请先登录网站！', {
    			  icon: 6,
    			  shade:0.5,
    			  time: 2000 //2秒关闭（如果不配置，默认是3秒）
    			}, function(){
    				window.location.href = "/index.html";
    			});   
        	}
        	
        })();
        
        

        //导航页面切换
        function mainModLoad(url, onTab, callback){
            var oMainMod = $(".container");
            var page = url.substring(11).split(".")[0];
            if(onTab){
                window.location.hash = "#" + page + "&" + onTab;
            }else{
                window.location.hash = "#" + page;
            }
            oMainMod.find(".u-main").empty().load(url, function(){
                var jsUrl = "page/usercenter/"+ page +".js?t="+new Date().getTime();
                require.async(jsUrl);
                
                //页面切换
                if(page == "balance" || page == "pay" || page == "exchange" || page == "basicInfo"){
                	um.loadUserInfo(function(data){
                		if(data.code == 0){
                			$(".u-base-info .u-ava img").attr("src",  data.body.userImageurl);
                			$(".u-base-info .u-nick").html(data.body.userNickname);
                			cookie.set("assetBill", data.body.assetBill);
                			$(".u-base-info .u-coins label").html(data.body.assetBill);
                			$(".u-base-info .u-beans label").html(data.body.assetGiftDou);
                		}
                	});
                }
                
            });

            $('body').animate({'scrollTop':0},500);
        }

        function showNav(pageUrl){
            var onTab = pageUrl.split("&")[1],
                page = pageUrl.split("&")[0],
                obj = $(".container .u-menu a[data-id='"+page+"']"),
                url = "usercenter/" +page+ ".html",
                sHover = "active",
                sClass = $(obj).attr("class");
            if(sClass && sClass.indexOf(sHover) > -1){
                mainModLoad(url, onTab);
            }else{
                $(".container .u-menu a").removeClass(sHover);
                $(obj).addClass(sHover);
                mainModLoad(url, onTab);
            }
        }

        //从其他页面进入管理中心
        function showPageByOther(){
            var hash = window.location.hash.substring(1);
            var page = hash == "" ? "myCourse" : hash;
            showNav(page);
        }

        showPageByOther();

        $(".container .u-menu a").click(function(){
            var page = $(this).attr("data-id");
            var hash = window.location.hash.substring(1);
            if(page != hash){
            	if(page == "teacherIntro" || page == "study" || page == "activity" || page == "notice"){
                	window.location.href = "/usercenter.html#"+page;
                	window.location.reload();
                }else{
                	showNav(page);
                }
            }
        });
        
        window.showPageByOther = showPageByOther;

    })(jQuery);
});
