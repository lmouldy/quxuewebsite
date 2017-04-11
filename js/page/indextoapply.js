define(function(require, exports, module){
	require('util/common');
	
(function($){
	var um = new UserManager();
	
	$('#header').load('./header.html', function(){
		require("page/header");
	});
	$('#footer').load('./footer.html');
	
	if(um.checkLogin()){
		$(".apply-access-link").attr("href", '/apply.html');
	}else{
		$(".apply-access-link").click(function(){
			openLoginRegistDialog("login.html");
			return;
		});
	}
	
})(jQuery);	

});