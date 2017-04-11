function IShare(args){
	this.wbParams = this.getWbParams(args);
	this.qqParams = this.getQQParams(args);
	this.wxParams = this.getWxParams(args);
}

/**
 * url:分享页面链接
 * searchPic:是否要自动抓取页面上的图片。true|falsetrue:自动抓取,false:不自动抓取。
 * title:分享的文字内容(可选，默认为所在页面的title)
 * language:语言设置：zh_cn|zh_tw
 * pics:分享图片的路径(可选)，多张图片通过"||"分开。
 * width:指定宽度
 * height:指定高度，根据按钮样式的不同而不同
 */
IShare.prototype.shareWeibo = function(){
	var weiboUrl = 'http://service.weibo.com/share/share.php?';
		weiboUrl += this.wbParams.wbUrl+ '&content=utf-8' ;
	window.open(weiboUrl,'_blank', 'width=615,height=505');
};

IShare.prototype.shareQQ = function(){
	var qqUrl = 'http://connect.qq.com/widget/shareqq/index.html?';
	qqUrl += this.qqParams.qUrl;
	window.open(qqUrl);
};

IShare.prototype.shareQZone = function(){
	var qqUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?';
	qqUrl += this.qqParams.qUrl;
	window.open(qqUrl);
};

IShare.prototype.shareWeixin = function(url){
	
	return "http://qr.liantu.com/api.php?gc=222222&el=l&w=100&m=2&text="+url;
};

IShare.prototype.shareWeixin2 = function(){
	var weixinUrl = 'http://'+window.location.host+'/shareweixin.html?';
	weixinUrl += this.wxParams.wxUrl+ '&content=utf-8' ;
	window.open(weixinUrl,'_blank', 'width=717,height=640');
};

IShare.prototype.getWbParams = function(args){
	var wbp = new Object();
	wbp.language = "";
	wbp.title = "";
	wbp.pic = "";
	wbp.appkey = "1397402791";
	wbp.url = window.location.href;
	if("undefined" != args){
		if("undefined" != typeof args.language){
			wbp.language = args.language;
		}
		if("undefined" != typeof args.title){
			wbp.title = args.title;
		}
		if("undefined" != typeof args.pic){
			wbp.pic = args.pic;
		}
		if("undefined" != typeof args.appkey){
			wbp.appkey = args.appkey;
		}
		if("undefined" != typeof args.url){
			wbp.url = args.url;
		}
	}
	var s = [];
	for(var i in wbp){
		s.push(i + '=' + encodeURIComponent(wbp[i]||''));
	}
	wbp.wbUrl = s.join('&');
	return wbp;
};

IShare.prototype.getWxParams = function(args){
	var wxp = new Object();
	wxp.title = "";
	wxp.pic = "";
	if("undefined" != args){
		if("undefined" != typeof args.title){
			wxp.title = args.title;
		}
		if("undefined" != typeof args.pic){
			wxp.pic = args.pic;
		}
		if("undefined" != typeof args.url){
			wxp.url = args.url;
		}
	}
	var s = [];
	for(var i in wxp){
		s.push(i + '=' + encodeURIComponent(wxp[i]||''));
	}
	wxp.wxUrl = s.join('&');
	return wxp;
};

/**
 * url:可加上来自分享到QQ标识，方便统计
 * desc:分享理由(风格应模拟用户对话),支持多分享语随机展现（使用|分隔）
 * title:分享标题(可选)
 * summary:分享摘要(可选)
 * pics:分享图片(可选)
 * flash: 视频地址(可选)
 * site:分享来源(可选) 如：QQ分享
 * style:'203',
 * width:24,
 * height:24
 */
IShare.prototype.getQQParams = function(args){
	var qqp = new Object();
	qqp.url = window.location.href;
	qqp.desc = "";
	qqp.title = "";
	qqp.pics = "";
	//qqp.site = "";
	qqp.summary = "";
	qqp.flash = "";
	qqp.style = "202";
	qqp.width = "24";
	qqp.height = "24";
	if("undefined" != args){
		if("undefined" != typeof args.url){
			qqp.url = args.url;
		}
		if("undefined" != typeof args.desc){
			qqp.desc = args.desc;
		}
		if("undefined" != typeof args.title){
			qqp.title = args.title;
		}
		if("undefined" != typeof args.pics){
			qqp.pics = args.pics;
		}
		//if("undefined" != typeof args.site){
		//	qqp.site = args.site;
		//}
		if("undefined" != typeof args.summary){
			qqp.summary = args.summary;
		}
		if("undefined" != typeof args.flash){
			qqp.flash = args.flash;
		}
		if("undefined" != typeof args.style){
			qqp.style = args.style;
		}
		if("undefined" != typeof args.width){
			qqp.width = args.width;
		}
		if("undefined" != typeof args.height){
			qqp.height = args.height;
		}
	}
	var s = [];
	for(var i in qqp){
		s.push(i + '=' + encodeURIComponent(qqp[i]||''));
	}
	qqp.qUrl = s.join('&');
	return qqp;
};