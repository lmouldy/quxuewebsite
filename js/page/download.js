define(function(require, exports, module){
	require('util/common');
	function requ(){
		if(typeof(jQuery) != "undefined"){
			require.async('../jquery.qrcode.min',init());
		}
		else{
			setTimeout(requ,1000);
		}
	}
	requ();
	

	$('#header').load('./header.html',function(){
		require("page/header");
	});
	$('#footer').load('./footer.html');
	
	function init(){
		$(function(){
			
			var um = new UserManager(),
		    ajaxdata = um.ajaxData,
		    gc = um.gConfig;
			
			//安卓二维码
			(function createAndriodCode(){
				//二维码插件配置
				var option = {
					width:145,
					height:145,
					correctLevel:0 //容错级别
				};
				if(!+[1,]){
					option.render = 'table'; //ie
				}else{
					option.render = 'canvas';
				}
				
				var shtml = '';
				option.text = gc.DOWNLOAD.DOWNLOAD_APP_URL;
				
				shtml += '<span><img src="../../images/default/down/logo.png" alt="" /></span>';
				$('#qrcode').qrcode(option).append(shtml);
			})();
			
			//安卓下载按钮
			ajaxdata.request('post',gc.DOWNLOAD.GET_ANDROID_VERSION_URL,{},function(data){
				if(data.code==0){
					$('#download-btn').attr("href",data.body.version_path);
				}
			});
			
			
			//IOS二维码
			(function createAndriodCode(){
				//二维码插件配置
				var option = {
					width:145,
					height:145,
					correctLevel:0 //容错级别
				};
				if(!+[1,]){
					option.render = 'table'; //ie
				}else{
					option.render = 'canvas';
				}
				
				var shtml = '';
				option.text = gc.DOWNLOAD.DOWNLOAD_IOS_URL;
				
				shtml += '<span><img src="../../images/default/down/logo.png" alt="" /></span>';
				$('#qrcodeIphone').qrcode(option).append(shtml);
				$('#download-btn-ios').attr("href",gc.DOWNLOAD.DOWNLOAD_IOS_URL);
			})();

		});
	}
	
	
	
});