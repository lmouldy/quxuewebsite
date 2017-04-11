define(function(require, exports, module) {
    require("util/common");
    (function($) {
        var um = new UserManager(),
            gMethod = um.gConfig.METHOD,
            gUrl = um.gConfig.AJAX_URL;

        //引入头部导航
        $("#header").load("../header.html", function() {
            require("page/header");
        });

        $('#footer').load('../footer.html');

        var init = (function() {
            var type = window.location.search.slice(1),
                url = gUrl.datahouse.queryByKey_url;
            switch (type) {
                case 'zshd': //展赛活动
                    key = 'STATION_EVENTS';
                    break;
                case 'sfwd': //书法问答
                    key = 'CALLIGRAPHY_ASK';
                    break;
                case 'splc': //书法临创
                    key = 'CALLIGRAPHY_CREATE';
                    break;
                case 'profile': //封面人物
                    key = 'COVER_MAN';
                    break;
                case 'video': //点播推荐
                    key = 'DIANBO_RECOMMEND';
                    break;
                case 'kt'://开谈
                	key = 'TALKING_LIST';
                	break;
            };
            um.ajaxData.request(gMethod.G, url, {
                "key": key
            }, function(data) {
                if (data.code == 0) {
                    var obj = data.body[key];
                    var shtml = '';
                    for (var i = 0; i < obj.length; i++) {
                        var linkHref;
                        if (key == 'COVER_MAN') {
                            linkHref = 'person.html?id=' + obj[i].id;
                        } else {
                            linkHref = obj[i].vedioUrl ? obj[i].vedioUrl : 'profile-item.html?type='+type+'&id=' + obj[i].id;
                        }
                        var imgUrl = key == 'TALKING_LIST' ? obj[i].imgUrl : obj[i].showImage;
                        shtml += '<li class="profile-item" data-id="' + obj[i].id + '">';
                        shtml += '<a href="' + linkHref + '" target="_blank"><img src="' + imgUrl + '"></a>';
                        shtml += '<h3 class="profile-item-title">' + obj[i].title + '</h3>';
                        shtml += '<span class="profile-item-time">' + obj[i].createTime + '</span>';
                        if(obj[i].outline){
                        	shtml += '<p class="profile-item-information">' + obj[i].outline + '</p>';
                        }
                        shtml += '</li>';
                    }
                    $(".profile-list").html(shtml);
                    if(type === 'video'){
                        $('.profile-list .profile-item a').css('height','160px');
                    }
                }
            });
        })();



        $('.profile-list').on('click', '.profile-item-title,.profile-item-information', function() {
            var url = $(this).siblings('a').attr('href');
            window.location.href = url;
        })

        $('#oPage').on('click', 'a', function() {
            $('body').animate({
                scrollTop: 0
            }, speed);
            return false;
        })



    })(jQuery);
});
