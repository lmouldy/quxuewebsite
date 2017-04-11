define(function(require, exports, module){
	require('util/common');
	$('#header').load('./header.html',function(){
		require("page/header");
	});
	
	var pageLink = window.location.search.slice(1);
	$("#mainCon").load("/activity/"+pageLink+".html")
	
	$('#footer').load('./footer.html');
});