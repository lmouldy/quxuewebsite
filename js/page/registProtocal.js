define(function(require,exports,module){
	require("util/common");
	$('#header').load('header.html',function(){
		require('page/header');
	});
	$('#footer').load('footer.html');

});