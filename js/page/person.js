define(function(require, exports, module) {
    require('util/common');

    $('#header').load('./header.html', function() {
        require('page/header');
        $("#navList li").each(function(){
            var link = $(this).attr("data-rel");
            if(link == 'profile.html?profile'){
                $(this).addClass('active').siblings().removeClass('active');
            }
        });
    });
    $('#footer').load('./footer.html');

    var um = new UserManager(),
        gMethod = um.gConfig.METHOD,
        gUrl = um.gConfig.AJAX_URL;

    (function($) {
        var id = getUrlParam("id");
        um.ajaxData.request('post', gUrl.datahouse.getPreviewInfo_url, {
            id: id
        }, function(data) {
            if (data.code == 0) {
                var arr = data.body.introduction.split(','),
                    shtml = "";
                arr.unshift(data.body.showImage);

                $.each(arr, function(index, value) {
                    shtml += '<li><a href="javascript:void(0);"><img src="' + value + '"></a></li>';
                });
                $(".tit").html(data.body.title);
                $(".date").html(data.body.createTime);
                $('.content').append(data.body.outline);
                $('#ban_pic1 ul,#ban_num1 ul').html(shtml);
                init();
            }
        });
        function init(){
            require.async('jquery.slideViewerPro.1.5', function() {
                $('#demo1').banqh({
                    box: "#demo1", //总框架
                    pic: "#ban_pic1", //大图框架
                    pnum: "#ban_num1", //小图框架
                    prev_btn: "#prev_btn1", //小图左箭头
                    next_btn: "#next_btn1", //小图右箭头
                    prev: "#prev1", //大图左箭头
                    next: "#next1", //大图右箭头             
                    mhc: ".mhc", //朦灰层
                    autoplay: true, //是否自动播放
                    interTime: 5000, //图片自动切换间隔
                    delayTime: 400, //切换一张图片时间
                    order: 0, //当前显示的图片（从0开始）
                    picdire: true, //大图滚动方向（true为水平方向滚动）
                    mindire: true, //小图滚动方向（true为水平方向滚动）
                    min_picnum: 10, //小图显示数量
                    pop_up: false //大图是否有弹出框
                });
            });
        }

        $('.ban').on('hover', '.ban2 li,.prev1,.next1').hover(function() {
            $('.prev1,.next1').show();
        }, function() {
            $('.prev1,.next1').hide();
        });

    })(jQuery);

});
