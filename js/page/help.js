define(function(require, exports, module){
	require('util/config');
	require('util/common');

	$('#header').load('./header.html',function(){
		require('page/header');
	});
	$('#footer').load('./footer.html');

	$(function(){
		$('.menu dd').click(function(){
			$(this).addClass('active').siblings().removeClass('active');
			$('.menu-box').hide();
			$('.' + $(this).data('id')).show();
		})
	})

})