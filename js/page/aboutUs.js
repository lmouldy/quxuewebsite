define(function(require,exports,module){
	$('#header').load('./header.html');
	$('#footer').load('./footer.html');
	require('util/common');

	$(function(){
		var url=window.location.search.substring(1);

		switch (url){
			case 'aboutUs':
				showText(0);
				break;
			case 'connectionUs':
				showText(1);
				break;
			case 'advertises':
				showText(2);
				break;
			default:
				showText(0);
				break;
		}

		$("#container .news-navs .news-list-nav .news-nav li").click(function(){
			var index = $(this).index();

			$(this).addClass('active').siblings().removeClass('active');
			showText(index);
		})

		function showText(index){
			$("#container .news-navs .news-list-nav .news-nav li").eq(index).addClass("active").siblings().removeClass("active");
			$("#container .news-container .news2").eq(index).show();
			$("#container .news-container .news2").not(":eq("+index+")").hide();
		}
	})

})



