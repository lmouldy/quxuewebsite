define(function(require,exports,module){
	require("util/common");
	
	var url = window.location.href;
	var url0 = window.location.host;
	var url_title = url.substring(url.lastIndexOf('title') + 1,url.lastIndexOf('&') - 1);
	var url1 = location.href.split("?")[1];
	var url1_0 = decodeURI(url1.split("&")[0]);
	var url1_1 = url1.split("&")[1];
	var wxurl = url1.split("&")[2].substring(4);
	var codeImgUrl = "http://qr.liantu.com/api.php?gc=222222&el=l&w=165&m=10&text="+wxurl;
	
	$("#weixin1 p span").html(url1_0.substring(6));
	$("#weixin1 img").attr("src",codeImgUrl);
	
//	房间页面需要的js代码，第一行require放在上方
/*	
	require("util/igo_share");
	$("#weixin").click(function(){
		var sTips =  '【主播昵称】';
		var sPic  =  '10002990';
		var igoShare = new IgoShare({"title":sTips,"pic":sPic});
		igoShare.igoShareWeixin();
	});
*/	

//	房间页面需要的js代码
/*
	
*/
	
});