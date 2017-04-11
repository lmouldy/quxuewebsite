/**
 * 
 */
define(function(require, exports, module){
	var $ = require("jquery-1.11.1.min");
	require("jquery.json-2.4");
	var gc = require("util/config");
	var gcBase = gc.config.BASE;
	var gcRegex = gc.config.REGEX;
	var gcMethod = gc.config.METHOD;
	var gUrl = gc.config.AJAX_URL;
	var popupLayer = require("layer-v2.4/layer");
	
	popupLayer.config({
		path: gcBase.BASE_URL + 'js/layer-v2.4/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
	});

	
	
	function Cookie(){};
	Cookie.prototype = {
		constructor : Cookie,
		_path : "/",
		expire : new Date(),
		setPath : function(path) {
	        this._path = !path ? this._path : path;
	    },
		getPath : function() {return this._path;},
		set : function(name,value,day) {
			if(this.get(name))this.del(name);
			 day = day ? day : 0;
			this.expire.setTime(this.expire.getTime()+day*24*3600*1000);
		    document.cookie = name + "="+ escape (value) + (day!=0?";expires=" + this.expire.toGMTString():"")+ ";path=" + this.getPath();
		},
		get : function(name) {
		    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
		    if(arr != null){
		    	return unescape(arr[2]);
		    } 
		},
		del : function(name) {
		    if (this.get(name)){
		    	document.cookie = name + "=" + "; expires=Thu, 01-Jan-70 00:00:01 GMT;path="+this.getPath();
		    }
		},
		delAll : function() {
			var arr=document.cookie.match(/[^ =;]+(?=\=)/g);
			if (arr) { 
				for (var i = arr.length; i--;) {
					this.del(arr[i]);
				}
			}
		}
	};
	
	function AjaxData(async){
		this.url = "";
		this.requestTimeOut = 5000;
		this.dataType = "json";
		this.method = gcMethod.P;
		this.async = (async == undefined ||async)?true:false;//true为异步，false为同步 默认为true
	}
	
	AjaxData.prototype = {
		contructor : AjaxData,
		setMethod:function(method){
			this.method = method;
		},
		setUrl:function(url){
			this.url = url;
		},
		parseData:function(object){
			var dataStr = '';
			for (var i in object){
//				dataStr += i +"="+encodeURIComponent(object[i])+"&";//后端未做反转义，暂时屏蔽
				var objStr = object[i];
				if("string" == typeof objStr) {
					objStr = objStr.replace(new RegExp("%", 'g'), "%25");
					objStr = objStr.replace(/\+/g,'%2B');
					objStr = objStr.replace(/\?/g,"%3F");
					objStr = objStr.replace(new RegExp("&", 'g'), "%26");//飞屏用&符号，导致后端调用cs飞屏接口失败，暂屏蔽
					//objStr = objStr.replace(new RegExp("&", 'g'), "");
				}
				dataStr += i +"="+objStr+"&";
			}
			this.data = dataStr.substr(0,dataStr.length-1);
		},
		SetRequestTimeOut : function(t){
			this.requestTimeOut=t;
		},
		request: function (method,url,data,callback){
			if(data != undefined) {
				this.parseData(data);
			}
			if(method != undefined) {
				this.method = method;
			}
			if(url != undefined) {
				var proto = window.location.protocol;
				proto = proto.substring(0,proto.length-1);
				var urlProto = url.substring(0,url.lastIndexOf("://"));
				if("https" != urlProto && proto != urlProto)
				{
					url = url.replace("http://","https://");
				}
				this.url= url;
			}
			if(this.method == '' || this.url == '')
			{
				alert("参数有误");
				return;
			}
			if($.trim(this.method.toLowerCase())=='get'){
				this.cache=true;
			}else{
				this.cache=false;
			}
			$.ajax({
		           type:this.method,
		           url:this.url,
		           data:this.data,
		           cache:this.cache,
		           timeout:this.timeOut,
		           dataType:this.dataType,
		           async:this.async,
		           success: function(data,textStatus,xhr) {
						if(typeof callback == "function")
						{
							//try{
								json = $.toJSON(data);
								json = json.replace(new RegExp("%2B", 'g'),'+');
								json = json.replace(new RegExp("%3F", 'g'),"?");
								json = json.replace(new RegExp("%26", 'g'), "&");
								json = json.replace(new RegExp("%25", 'g'), "%");
								var secId = secId + Math.random();
								var html = '<div id="'+secId+'" style="display:none"></div>';
								$("body").append(html);
								var sec = $("#"+secId+"").text(json).html();
								$("#"+secId+"").remove();
								data = $.evalJSON(sec);
							//}catch(e){
							//	throw e;
							//}

							if(data.code == -5){
								openLoginRegistDialog("login.html");
							}else if(data.code == -6){
								data['msg'] = "您的账户余额不足，<a href='/usercenter.html#pay' target='_blank'>请充值</a>"
							}
							callback(data,textStatus,xhr);
							
						};
						
		           },
		           error: function(xhr, textStatus, errorThrown){
		        	   var errorMess = "";
		        	   if(textStatus != undefined)
		    		   {
		        		   switch(textStatus){
		        		   case "timeout":
		        			   errorMess="请求超时，请稍后再试！";
		        			   break;
		        		   case "error":
		        			   errorMess="请求错误，请稍后再试！";
		        			   break;
		        		   case "notmodified":
		        			   errorMess="请求异常，请稍后再试！";
		        			   break;
		        		   case "parsererror":
		        			   errorMess="解析错误，请稍后再试！";
		        			   break;
		        		   }
		    		   }
		        	   if(errorThrown != undefined)
		    		   {
		        		   errorMess =errorThrown;
		    		   }
		        	   if(xhr != undefined)
		    		   {
		        		   switch(xhr.status){
		        		   case 400:
		        			   errorMess="请求参数有误，请稍后再试！";
		        			   break;
		        		   case 401:
		        			   errorMess="请求身份验证失败，请稍后再试！";
		        			   break;
		        		   case 403:
		        			   errorMess="请求被拒绝，请稍后再试！";
		        			   break;
		        		   case 404:
		        			   errorMess="请求资源未找到，请稍后再试！";
		        			   break;
		        		   case 405:
		        			   errorMess="请求方法错误，请稍后再试！";
		        			   break;
		        		   case 413:
		        			   errorMess="请求信息超载，请稍后再试！";
		        			   break;   
		        		   case 500:
		        			   errorMess="别闹，加载是件正经事！";
		        			   break;
		        		   case 503:
		        			   errorMess="别闹，加载是件正经事！";
		        			   break;
		        		   case 502:
		        		   case 504:
		        			   errorMess="别闹，加载是件正经事！";
		        			   break;
		        			default:
		        				errorMess="别闹，加载是件正经事！";
		        				break;
		        		   }
		    		   }

		           }
		     });
		}
	};
	
	//自定义hover方法，用于显示隐藏效果
	$.iHover=function(){
		/*
		 两个参数：选择器1,选择器2
		 三个参数：选择器1,选择器2,执行函数
		 四个参数：选择器1,选择器2,执行函数1,执行函数2
		 */
		var o=arguments;
		switch(o.length){
			case 0:
			case 1:
				return;
				break;
			case 2:
				try{
					$(o[0]+","+o[1]).hover(function(){
						$(o[1]).show();
					},function(){
						$(o[1]).hide();
					});
				}catch(ex){}
				break;
			case 3:
				try{
					$(document).on("mouseover",o[0]+","+o[1],function(){
						if(o[2]&&typeof o[2]=="function")o[2](arguments[0]);
					}).on("mouseout",o[0]+","+o[1],function(){
						if(o[2]&&typeof o[2]=="function")o[2](arguments[0]);
					});
				}catch(ex){}
				break;
			case 4:
				try{
					$(o[0]+","+o[1]).hover(function(){
						if(o[2]&&typeof o[2]=="function")o[2]();
					},function(){
						if(o[3]&&typeof o[3]=="function")o[3]();
					});
				}catch(ex){}
				break;
		}
	};
	
	function CommonUtils(){}
	CommonUtils.userAgent = navigator.userAgent.toLowerCase();
	CommonUtils.prototype = {
		constructor : CommonUtils,
		browser : {    
			version: (CommonUtils.userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],    
			safari: /webkit/.test(CommonUtils.userAgent),    
			opera: /opera/.test(CommonUtils.userAgent),    
			msie: /msie/.test(CommonUtils.userAgent) && !/opera/.test(CommonUtils.userAgent),    
			mozilla: /mozilla/.test(CommonUtils.userAgent) && !/(compatible|webkit)/.test(CommonUtils.userAgent)    
		},
		check360browser5version:function(){
			var check360browser={
				//如果是360 浏览器的话
				"ok":function (){
					//这里是判断360成功之后的代码
					alert('本站暂不支持低于360浏览器7.0的版本访问,请使用360浏览器7.0及以上(或其它浏览器访问),可畅快在本站玩耍!');
					return;
				},
				"try360SE":function (callback){  
					var ret = false,    
					img = new Image();  
					img.src = 'res://360se.exe/2/2025';  
					img.onload = function(){   
						ret = true;  
					};  
					setTimeout(function(){   
						if(ret==true){
							check360browser.ok();
						}else{
							ret=check360browser.try360SE_2();
							if(ret){
								check360browser.ok();
							}
						}
					}, 100); 
				},
				"try360SE_2":function (){  
					//var is360 = false;  
					if(window.navigator.userAgent.indexOf('Chrome')!=-1){ 
						if(window.navigator.webkitPersistentStorage){ 
						}else{ 
							return true; 
						} 
					} 
				}
			};
			try{
				check360browser.try360SE();
			}catch(ex){ throw ex; };
		},
		/**
		 *  获取URL传参
		 *  参数 name 
		 */
		getUrlParam : function(name){
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		    var r = window.location.search.substr(1).match(reg);
		    if (r != null){
		    	r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
		    	return decodeURI(r[2]); 
		    }
		    return "";
		},
		
		/**
		 * 脚本注入校验* @param s * @returns
		 */
		replaceHtmlCommon : function(s){
			var str=s.replace(/(?:<[\/a-zA-Z]+[1-6]{0,1}\s*[^<|>]*(?:>)|%3C[\/a-zA-Z]+[1-6]{0,1}\s*[^%3C|%3E]*(?:%3E))/g, function() {
				return arguments[0].replace(/(?:(<)([\/a-zA-Z]+[1-6]{0,1}\s*[^<|>]*)(?:(>))|(%3C)([\/a-zA-Z]+[1-6]{0,1}\s*[^%3C|%3E]*)(?:(%3E)))/g, "%26lt;$2%26gt;");
			});
			return str;
		},
		/**
		 * 滚动条滚动到最低层
		 */
		scrollTopHandler:function(con, win){
			var conH = con.height();
			var winH = win.height();
			var comH = conH - winH;
			if(comH > 0)
			{
				//	win.scrollTop(win.scrollTop()+win.height());
				win.scrollTop(win[0].scrollHeight);
			}
		},
		/**
		 * 输入框回车事件
		 */
		enterEventHandler:function(obj,callback){
			obj.keydown(function(event){
				if(event.keyCode == 13){
					callback();
				}
			});
		},
		HTMLDecodeHandler : function(str){
			if(str != null){
				var  s = str.replace(/&amp;/g, "&");
				s = s.replace(/&lt;|&amp;lt;/g, "<");
				s = s.replace(/&gt;|&amp;gt;/g, ">");
				s = s.replace(/&nbsp;/g, " ");
				s = s.replace(/'/g, "\'");
				s = s.replace(/&quot;/g, "\"");
				s = s.replace(/ <br>/g, "\n");
				return s;
			}
			return str;
		},
		/**阻止mouseover、mouseout多次触发事件**/
		checkHover:function(e,target){
			function contains(parentNode, childNode) {
				if (parentNode.contains) {
					return parentNode != childNode && parentNode.contains(childNode);
				} else {
					return !!(parentNode.compareDocumentPosition(childNode) & 16);
				}
			}
			//取得当前window对象的事件
			function getEvent(e) {
				return e || window.event;
			}

			if (getEvent(e).type == "mouseover") {
				return !contains(target, getEvent(e).relatedTarget
					|| getEvent(e).fromElement)
					&& !((getEvent(e).relatedTarget || getEvent(e).fromElement) === target);
			} else {
				return !contains(target, getEvent(e).relatedTarget
					|| getEvent(e).toElement)
					&& !((getEvent(e).relatedTarget || getEvent(e).toElement) === target);
			}
		},
		/**跳转*/
		go : function(type,url){
			switch(type){
				case 1:
					window.location.href=url;
					break;
				case 2:
					window.location.replace(url);
					break;
				case 3:
					window.location.reload();
					break;
				case 4:
					window.open(url);
					break;
			}
		},
		getElementsByClass : function (sClass,oParent,tag){
			var oBox = oParent||document,
				sTag = tag||"div",
				aTag = oBox.getElementsByTagName(sTag),temp=[];
			for(var i=0,len=aTag.length; i<len; i++){
				var oTag = aTag[i],
					aClass = oTag.className.replace(/^\s*|\s*$/g,"").split(/\s+/);
				for(var j=0; j<aClass.length; j++){
					if(aClass[j] == sClass){
						temp.push(oTag);
					}
				}
			}
			if(temp.length <= 0)return false;
			return temp;
		},
		//拖拽窗口 oHandle：鼠标点击拖拽位置，oWin:拖拽窗口，b:是否拖拽 true是 false否
		dragWin:function(oHandle,oWin,b){
			oHandle.onmousedown=function(event){
				this.style.cursor="move";
				var e=event||window.event;
				oWin.downX=e.clientX-oWin.offsetLeft,
					oWin.downY=e.clientY-oWin.offsetTop;
				document.currentDragObj=oWin;
				document.onmousemove=function(event){
					var e=event||window.event,
						oWin=document.currentDragObj,
						w=this.documentElement.clientWidth-oWin.offsetWidth,
						h=this.documentElement.clientHeight-oWin.offsetHeight,
						l=e.clientX-oWin.downX,
						t=e.clientY-oWin.downY;
					oWin.style.margin=0;
					if(oWin.setCapture)oWin.setCapture(true);
					if(b){
						if(l>w)l=w;
						if(l<0)l=0;
						if(t>h)t=h;
						if(t<0)t=0;
					}
					oWin.style.left=l+'px';
					oWin.style.top=t+'px';
				};
				document.onmouseup=function(e){
					var oWin=document.currentDragObj;
					if(oWin.releaseCapture)oWin.releaseCapture();
					document.onmousemove=null;
					document.onmouseup=null;
					document.currentDragObj=null;
				};
				return false;
			};
		},
		drag:function(obj,b){
			obj.onmousedown=function(event){
				this.style.cursor="move";
				var e=event||window.event;
				this.downX=e.clientX-this.offsetLeft,
					this.downY=e.clientY-this.offsetTop;
				document.currentDragObj=obj;
				document.onmousemove=function(event){
					var e=event||window.event,
						obj=document.currentDragObj,
						w=this.documentElement.clientWidth-obj.offsetWidth,
						h=this.documentElement.clientHeight-obj.offsetHeight,
						l=e.clientX-obj.downX,
						t=e.clientY-obj.downY;
					obj.style.margin=0;
					if(obj.setCapture)obj.setCapture(true);
					if(b){
						if(l>w)l=w;
						if(l<0)l=0;
						if(t>h)t=h;
						if(t<0)t=0;
					}
					obj.style.left=l+'px';
					obj.style.top=t+'px';
				};
				document.onmouseup=function(e){
					var obj=document.currentDragObj;
					if(obj.releaseCapture)obj.releaseCapture();
					document.onmousemove=null;
					document.onmouseup=null;
					//delete document.currentDragObj;
					document.currentDragObj=null;
				};
				return false;
			};
		},

		consoleLog : function(msg,name){
			try{
				console.log(name+":::"+msg);
			}catch(ex){

			}
		},
		igoSelect:function(obj,callback){
			var target=old=obj;
			if(!$(target).hasClass("s-selector")){
				target=$(target).parents(".s-selector")[0];
			}
			var	oSelectedTxt=$(target).find(".selected-txt"),
				oSelectArrow=$(target).find(".select-arrow"),
				oSelectOptions=$(target).find(".options");
			oSelectOptions.toggle();
			oSelectArrow.toggleClass("arrow-down arrow-up");
			$(document.body).click(function(){
				if($(arguments[0].target).parents(".s-selector").length>0||$(arguments[0].target).hasClass("s-selector")){
					return;
				}else{
					if(oSelectArrow.hasClass("arrow-up")){
						oSelectOptions.hide();
						oSelectArrow.toggleClass("arrow-up arrow-down");
					}
				}
			});

			var txt=$(old).text()?$(old).text():oSelectedTxt.text();
			oSelectedTxt.text(txt);
			if(callback&&typeof callback=="function"){
				callback(old);
			}
		},
		igoLoadScript:function(url,callback,opt,existScript){//动态加载js文件
			/*
			 url:js文件绝对路径 如:http://ww.a.com/c/d.js
			 callback:加载完成回调
			 opt:自定义属性
			 existScript:script节点对象
			 */
			try{
				if(url.lastIndexOf(".js")==-1){
					throw "The param is not correct!" ;
				}
				var aScript=top.document.getElementsByTagName("script"),
					scriptName=url.substring((url.lastIndexOf("/")+1),url.lastIndexOf(".js")),
					b=false;
				for(var i=0;i<aScript.length;i++){
					var surl=aScript[i].src,
						name=surl.substring((surl.lastIndexOf("/")+1),surl.lastIndexOf(".js"));
					if(scriptName!=name){
						continue;
					}else{
						b=true;
						if(callback&&typeof callback=="function")callback();
						break;
					}
				}
				if(!b){
					var oScript=top.document.createElement("script");
					oScript.type="text/javascript";
					oScript.src=url;
					if(opt&&typeof opt=="object"){
						for(var a in opt){
							oScript.setAttribute(a,opt[a]);
						}
					}
					var oHead=top.document.getElementsByTagName("head")[0];
					if(existScript){
						oHead.insertBefore(oScript,existScript);
					}else{
						oHead.appendChild(oScript);
					}
					oScript.onload=oScript.onreadystatechange=function(){
						if(!this.readyState||this.readyState == 'loaded' || this.readyState == 'complete')if(callback&&typeof callback=="function")callback();
					};
				}
			}catch(ex){
				console.log(ex);
			}
		},
		insertTxtAtCursorPos : function (field, v){
			if (document.selection){//ie9/8/7
				field.focus();
				var oRange=document.selection.createRange();
				oRange.text=v;
				oRange.select();
			}else if (typeof field.selectionStart === 'number' && typeof field.selectionEnd === 'number') {//ff/ch/ie11
				var startPos= field.selectionStart,
					endPos=field.selectionEnd,
					restoreTop=field.scrollTop,
					sV=field.value,
					len=sV.length;
				field.value=sV.substring(0,startPos)+v+sV.substring(endPos,len);
				if (restoreTop > 0)field.scrollTop = restoreTop;
				field.focus();
				field.selectionStart=startPos+v.length;
				field.selectionEnd=startPos+v.length;
			}else{
				field.value+=v;
				field.focus();
			}
		},
		//分页
		page: function(opt) {
		    var o = {
		        "pageContainerId": null,
		        "pageSum": null,
		        "pageCur": null,
		        "pageDisplay": null,
		        "pageCurClass": null,
		        "pageCommonUrl": null,
		        "pageEnabledClass": null,
		        "pageDisabledClass": null,
		        "pagePrevText": "上一页",
		        "pageNextText": "下一页",
		        "pageIndexText": "首页",
		        "pageEndText": "尾页",
		        "bIndex": false,
		        "bLast": false,
		        "bPrev": false,
		        "bNext": false,
		        "bSum": false,
		        "callback": null
		    },
		    D = document,
		    //W = window,
		    P, n, id, pd, pc, ps, pu, pes, pds, pcs, fn, it, et, pt, nt;
		    for (var a in opt) {
		        if (!o.hasOwnProperty(a)) o[a] = opt[a];
		        else o[a] = opt[a] || o[a];
		    }
		    id = o.pageContainerId, pd = o.pageDisplay, ps = o.pageSum, pc = o.pageCur,
		    pu = o.pageCommonUrl, pes = o.pageEnabledClass, pcs = o.pageCurClass, pds = o.pageDisabledClass,
		    it = o.pageIndexText, et = o.pageEndText, pt = o.pagePrevText, nt = o.pageNextText,
		    fn = o.callback, bI = o.bIndex, bL = o.bLast, bN = o.bNext, bP = o.bPrev, bS = o.bSum;
		    pd = ps < pd ? ps: pd,
		    n = parseInt(pd / 2) + 1;
		    try {
		        if (typeof id != "string" || id.length <= 0) throw "The container of page sould be set a attribute of id!";
		    } catch(ex) {
		        console.log(ex);
		        return false;
		    }
		    try {
		        P = D.getElementById(id);
		        if (!P) throw "The dom object of container of page could not be created!";
		    } catch(ex) {
		        console.log(ex);
		        return false;
		    }
		    if (ps <= 1) return;
		    var F = D.createDocumentFragment(),
		    S = D.createElement("span");
		    S.innerHTML = "第" + pc + "/" + ps + "页",
		    S.className = pds;
		    if (!bS) F.appendChild(S);
		    var oA = D.createElement("a");
		    oA.innerHTML = it;
		    if (pc == 1) {
		        oA.href = "javascript:void(0)",
		        oA.className = pds,
		        oA.title = 0;
		    } else {
		        oA.href = pu + "?p=1",
		        oA.className = pes,
		        oA.title = 1;
		    }
		    if (!bI) F.appendChild(oA);
		    oA = D.createElement("a"),
		    oA.innerHTML = pt;
		    if (pc > 1) {
		        oA.href = pu + "?p=" + (pc - 1),
		        oA.className = pes,
		        oA.title = pc - 1;
		    } else {
		        oA.href = "javascript:void(0);",
		        oA.className = pds,
		        oA.title = 0;
		    }
		    F.appendChild(oA);
		    if (ps <= pd) {
		        for (var i = 0; i < ps; i++) {
		            oA = D.createElement("a");
		            oA.innerHTML = i + 1;
		            if (i + 1 == pc) {
		                oA.className = pcs;
		                oA.href = "javascript:void(0);";
		                oA.title = 0;
		            } else {
		                oA.href = pu + "?p=" + (i + 1);
		                oA.title = i + 1;
		            }
		            F.appendChild(oA);
		        }
		    } else {
		        if (pc <= n) {
		            for (var i = 0; i < pd; i++) {
		                oA = D.createElement("a");
		                if (pc == i + 1) {
		                    oA.className = pcs;
		                }
		                oA.href = pu + "?p=" + (i + 1);
		                oA.innerHTML = i + 1;
		                oA.title = i + 1;
		                F.appendChild(oA);
		            }
		        } else {
		            for (var i = 0; i < pd; i++) {
		                oA = D.createElement("a");
		                if (ps - pc < n - 1) {
		                    oA.href = pu + "?p=" + (ps - pd + i + 1);
		                    oA.innerHTML = ps - pd + i + 1;
		                    oA.title = ps - pd + i + 1;
		                    if (pc == ps - pd + i + 1) {
		                        oA.className = pcs;
		                    }
		                } else {
		                    oA.href = pu + "?p=" + (pc - n + i + 1);
		                    oA.innerHTML = pc - n + i + 1;
		                    oA.title = pc - n + i + 1;
		                    if (pc == pc - n + i + 1) {
		                        oA.className = pcs;
		                    }
		                }
		                F.appendChild(oA);
		            }
		        }
		    }
		    oA = D.createElement("a");
		    var iNext = pc + 1 < ps ? (pc + 1) : ps;
		    oA.innerHTML = nt;
		    if (pc > 1 && pc != ps) {
		        oA.href = pu + "?p=" + iNext;
		        oA.className = pes;
		        oA.title = iNext;
		    } else {
		        oA.href = "javascript:void(0);";
		        if (pc == ps) {
		            oA.title = 0,
		            oA.className = pds;
		        } else {
		            if (pc == 1) oA.title = 2,
		            oA.className = pes;
		        }
		    }
		    if (!bN) F.appendChild(oA);
		    oA = D.createElement("a");
		    oA.innerHTML = et;
		    if (pc == ps) {
		        oA.href = "javascript:void(0);";
		        oA.title = 0;
		        oA.className = pds;
		    } else {
		        oA.href = pu + "?p=" + (ps);
		        oA.title = ps;
		        oA.className = pes;
		    }
		    if (!bL) F.appendChild(oA);
		    oA = null;
		    P.innerHTML = "";
		    P.appendChild(F);
		    F = null;
		    if (fn && typeof fn == "function") {
		        try {
		            fn(o);
		        } catch(ex) {
		            console.log(ex);
		        }
		    };
		    var aA = P.getElementsByTagName("a"),
		    oArg = arguments;
		    for (var i = 0; i < aA.length; i++) {
		        aA[i].onclick = function() {
		            var iCur = parseInt(this.title);
		            if (!iCur || this.className == pcs) return false;
		            oArg.callee({
		                "pageContainerId": id,
		                "pageSum": ps,
		                "pageCur": iCur,
		                "pageDisplay": pd,
		                "pageCurClass": pcs,
		                "pageEnabledClass": pes,
		                "pageDisabledClass": pds,
		                "callback": fn,
		                "pagePrevText": pt,
		                "pageNextText": nt,
		                "pageIndexText": it,
		                "pageEndText": et,
		                "bIndex": bI,
		                "bLast": bL,
		                "bPrev": bP,
		                "bNext": bN,
		                "bSum": bS
		            });
		            return false;
		        };
		    }
		},
		dynamicPage : function(opts){
			/*
			 pNo:当前页码
			 pSize:当前页信息条数
			 pDis:分页可见页码数
			 pId:分页容器id
			 fn:分页信息插入函数
			 url:请求地址
			 params:请求参数
			 curname:页码参数名  以防有些地址的页码参数名不同
			 */
			var pageNo = opts.pNo,
			 	pageSize = opts.pSize,
			 	pageDisplay = 10,//opts.pDis,
			 	pageId = opts.pId,
			 	insertDomFn = opts.fn,
			 	url = opts.url,
			 	params = opts.params,
			 	method = "undefined" == typeof opts.method?"POST":opts.method;
			 	curName = opts.curName;// curname:页码参数名
			var pageSum = 0;
			function getInitPage(pageNo,pageSize,pageId,url,params){//获取动态
				var successCallback = function (data) {
			        var oPage=$('#'+pageId),
			   		info=data;
			        var html="";
			        if (info.code == 0) {
			        	var obj = info.body;
			        	var $body = "";
			        	if(obj.hasOwnProperty("result")){
			        		$body = obj.result;
			        		pageSum = info.body.totalPages;   
			        	}else if(obj.hasOwnProperty("rows")){
			        		$body = obj.rows;
			        		pageSum = info.body.totalPages;   
			        	}else if(info.hasOwnProperty("totalPage")){
			        		pageSum = data.totalPage;
			        		$body = info;
			        	}else{
			        		$body = obj;
			        		pageSum = obj.length; 
			        	}
			        	if(1 == pageSum){
			        		oPage.hide();
			        	}else{
			        		oPage.show();
			        	}
			        	 html = insertDomFn($body, info.body.totalCount);

			        }else{
			        	window[pageId]=1;
			        	html=insertDomFn("", 0);
			        }
		
			    };
			    new AjaxData().request(method, url, params, successCallback);
			}

			getInitPage(pageNo,pageSize,pageId,url,params);

			function getPage(pageId,pageDisplay, pageSize){//分页
				var t=setTimeout(function(){
					if(pageSum>0){
						clearTimeout(t);
						CommonUtils.prototype.page({
							"pageContainerId":pageId,
							"pageSum":pageSum,
							"pageCur":1,
							"pageDisplay":pageDisplay,
							"pageCurClass":"cur",
							"pageCommonUrl":"t=1",
							"pageEnabledClass":"enabled",
							"pageDisabledClass":"disabled",
							"callback":function(o){
								if(o.pageCur==1&&$("#"+o.pageContainerId).attr("data-ini")!="true"){
									return;
								}else{
									$("#"+o.pageContainerId).attr("data-ini","true");
										params[curName] = o.pageCur;
										params.pageSize=pageSize;
										getInitPage(o.pageCur,pageDisplay,o.pageContainerId,url,params);
									}
								}
							});
					}else{
						clearTimeout(t);
						t=setTimeout(arguments.callee,100);
					}
				},100);
			}
			getPage(pageId,pageDisplay, pageSize);
		},
		//初始化表情列表
		loadFaceList : function(){
			var sHtml = "<table class='face-table'>", count = 0;
			var faceList = gc.config.face;
			for(var k in faceList){
				var obj = faceList[k];
				if(count % 9 == 0){
					sHtml += "<tr><td><img alt='"+k+"' src='"+obj.small+"'></td>";
				}else if(count / 9 == 0 || count == faceList.length){
					sHtml += "<td><img alt='"+k+"' src='"+obj.small+"'></td></tr>";
				}else{
					sHtml += "<td><img alt='"+k+"' src='"+obj.small+"'></td>";
				}
				count++;
			}
			sHtml += "</table>";
			return sHtml;
		},
		//替换内容中的表情
		replaceFaceHtml : function(content){
			var faceList = gc.config.face;
			for(var k in faceList){
				if(content.search(k) > -1){
					content = content.replace(k, '<img alt="'+k+'" src="'+faceList[k].small+'">');
				}
			}
			return content;
		}
		
	};/*end of CommonUtils */
	
	
	
	function LoginAndRegister(){}
	LoginAndRegister.prototype = {
		constructor : LoginAndRegister,	
		//根据范围获取随机数
		getPicNumByRandom : function(n, m){
			var c = m-n+1;
			return Math.floor(Math.random()*c + n);
		},
		//获取图片验证码
		getImgCode : function(obj){
			var imgSrc = $(obj).find("img"),
				src = imgSrc.attr("src"),
				url = src + "?timestamp=" + new Date().toString();
			imgSrc.attr("src",url);
		},
		//判断密码强度
		checkPwdStrength : function(tipObj, pwd){
			//判断字符是哪个类型
		    function CharMode(iN){
		        if (iN>=48 && iN <=57) //数字
		            return 1;
		        if (iN>=65 && iN <=90) //大写
		            return 2;
		        if (iN>=97 && iN <=122) //小写
		            return 4;
		        else
		            return 8;
		    }
		    //bitTotal函数
		    //计算密码模式
		    function bitTotal(num){
		        var mode = 0;
		        for (i=0;i<4;i++){
		            if (num & 1) {
		                mode++;
		            }
		            num>>>=1;
		        }
		        return mode;
		    }
		    
		    var modes = 0, strength =0;
		    if(pwd.length >= 6){
		    	for(var i=0; i<pwd.length; i++){
	                //pwd.charCodeAt(i) 返回对应字符的Unicode 编码
	                //CharMode(pwd.charCodeAt(i)) 根据字符的Unicode 编码判断字符分别属于数字，大写字母，小写字母
	                //modes|= 通过按位或运算，得出密码最终的一个模式
	                modes|=CharMode(pwd.charCodeAt(i));
	            }
	            strength =  bitTotal(modes);
		    }
		    switch(strength){
	            case 0:
                    //removeClass移除多个class属性中间用空格间格
	                tipObj.find("em").removeClass("active");
	                $("#bWeek").removeClass("active");
	                $("#bStrong").removeClass("active");
	                break;
	            case 1:
	                tipObj.find("em.pwd-week").addClass("active").siblings().removeClass("active");
	                $("#bWeek").removeClass("active");
	                $("#bStrong").removeClass("active");
	                break;
	            case 2:
	                tipObj.find("em.pwd-strong").removeClass("active").siblings().addClass("active");
	                $("#bWeek").addClass("active");
	                $("#bStrong").removeClass("active");
	                break;
	            default:
	                tipObj.find("em").addClass("active");
	            	$("#bWeek").removeClass("active");
	            	$("#bStrong").addClass("active");
	                break;
	        }
		},
		checkInputByType : function(val, tipObj, type){
			switch(type){
				case 'phoneNum':
					//手机号的验证
					 var filterReg1 = gcRegex.MOBILE_PHONE,
					 	 filterReg2 = /^[1-9]\d*$/;
					 //判断是否是正常的手机格式
	                 if(filterReg1.test(val)){
	                	 tipObj.find(".line[data-node='line1']").addClass("line-s").removeClass("line-e");
	                 }else{
	                	 tipObj.find(".line[data-node='line1']").addClass("line-e").removeClass("line-s");
	                 }
	                 //判断是否只含有数字
	                 if(filterReg2.test(val)){
	                	 tipObj.find(".line[data-node='line2']").addClass("line-s").removeClass("line-e");
	                 }else{
	                	 tipObj.find(".line[data-node='line2']").addClass("line-e").removeClass("line-s");
	                 }
					break;
				case 'mailAddress':
					//邮箱的验证
					 var filterReg1 = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/,
						filterReg2 = /[\u4e00-\u9fa5]/;
					//判断邮箱格式是否正确
					if(filterReg1.test(val)){
						tipObj.find(".line[data-node='line1']").addClass("line-s").removeClass("line-e");
					}else{
						tipObj.find(".line[data-node='line1']").addClass("line-e").removeClass("line-s");
					}
					//判断是否包含中文
					if(!filterReg2.test(val)){
	                	 tipObj.find(".line[data-node='line2']").addClass("line-s").removeClass("line-e");
	                 }else{
	                	 tipObj.find(".line[data-node='line2']").addClass("line-e").removeClass("line-s");
	                 }
					break;
				case 'pwd':
					var filterReg1 = /^[A-Za-z0-9]{6,20}$/,
						filterReg2 = /\s/g; 
					//如果密码长度小于6或者大于20，提示错误
					if(val.length<6||val.length>20){
						tipObj.find(".line[data-node='line1']").addClass("line-e").removeClass("line-s");
					}else{
						tipObj.find(".line[data-node='line1']").addClass("line-s").removeClass("line-e");
					}
					//判断是否只包含数字，字母
					if(filterReg1.test(val)){
						tipObj.find(".line[data-node='line2']").addClass("line-s").removeClass("line-e");
					}else{
						tipObj.find(".line[data-node='line2']").addClass("line-e").removeClass("line-s");
					}
					//判断是否包含空格
					if(val.length==0 ||filterReg2.test(val)){
						tipObj.find(".line[data-node='line3']").addClass("line-e").removeClass("line-s");
					}else{
						tipObj.find(".line[data-node='line3']").addClass("line-s").removeClass("line-e");
					}
					checkPwdStrength(val,tipObj);
					break;
				default :
					break;
			}
		},
		//注册
		vRegist : function(){
			require.async("util/validation.js", function(){
                //获取手机验证码
				$(".v-register .getAuthCode").click(function(){
					var pinCode = '1234', 
						phoneNum = $(this).parents("form").find("input[name='phoneNum']").val(),
						filterReg = gcRegex.MOBILE_PHONE;
					 var that=this;
				        this.sec=this.sec?this.sec:120;
					if(!filterReg.test(phoneNum)){
						popupLayer.alert("请输入正确有效的手机号码！");
						clearTimeout(that.t);
	                    $(that).html("免费获取验证码");
	                    delete that.t;
	                    delete that.sec;
						return;
					}
					
					//获取验证码 倒计时点击事件
			        if(this.t){
			            //倒计时范围内重复点击提示
			        	popupLayer.alert("请1分钟后再试");
			            return;
			        }
			        if(!this.t){
			        	new UserManager().getPhoneCode($(this).parents("form").find("input[name='phoneNum']").val(), pinCode, function(data){
			        		if(data.code !=0){
			        			popupLayer.alert(data.msg);
			        			clearTimeout(that.t);
			                    $(that).html("免费获取验证码");
			                    delete that.t;
			                    delete that.sec;
			        		}
			        	});
			            that.t = setTimeout(function(){
			                if((that.sec--)>0){
			                    $(that).html("重新发送("+that.sec+")");
			                    that.t=setTimeout(arguments.callee,1000);
			                }else{
			                    clearTimeout(that.t);
			                    $(that).html("免费获取验证码");
			                    delete that.t;
			                    delete that.sec;
			                }
			            },1000);
			        }
				});
				//请求校验脚本后执行校验回调
				$(".v-register").formValidation({
					cssOnFail:		{
						display:  "block"
					},
					//执行校验
					submitSelector:".submit-reg",
					onFail:function(){
						//失败校验
						var obj=arguments[0];
						if(!$(obj).hasClass("invalid"))$(obj).addClass("invalid");
						var len=$(obj).prevAll(".invalid:visible").length;
						len>0?$(obj).hide():"";
					},
					onSubmit:function(){
						if(!$("#agreementCheckBtn").prop("checked")){
							popupLayer.msg("请选择阅读并同意书法报视频使用协议！");
							return;
						}
						//提交注册
						var obj = arguments[0];
					    var tip = function(msg){
							popupLayer.alert(msg);
						};
						if($(obj).attr("data-submited") != "true"){
							$(obj).attr("data-submited","true");
							//form序列化是用encodeURIComponent进行编码的。form序列化后用decodeURIComponent解码，防止乱码 。
							var data = decodeURIComponent($("form.v-register").serialize().split("&")).split(","), json={};
							for(var i=0,len=data.length;i<len;i++){
								var arr=data[i].split("=");
								json[arr[0]]=arr[1];
							}
							var pinCode="1234",
                                phoneNum = "", //注册用户名
								userName = "",
								phoneCode = "";
							phoneNum = $(obj).parents("form").find("input[name=phoneNum]").val(),
                            phoneCode = $(obj).parents("form").find("input[name=phoneCode]").val();
							userName = $(obj).parents("form").find("input[name=regName]").val();
								//pinCode = $(obj).parents("form").find("input[name=pinCode]").val();
							var call_back={
								"success":function callback(msg){
									//提交注册后成功回调
									window["jsonLogin"]={
											username:userName,
											phone : phoneNum, 
											password:$(obj).parents("form").find("input[name=pwd]").val(),
											phoneCode:phoneCode,
											pinCode:pinCode,
											callback:{
												"success":function(msg){
													new CommonUtils().go(1,loginAfterTo);
												},
												"error":function(msg){
													popupLayer.alert(msg);
												},
												"b":true
											}
									};
									$(obj).attr("data-submited","false");
									$(obj).parents("form").find(":text,:password").val("");
									popupLayer.msg("恭喜您注册成功！自动登录中......");
									setTimeout(function(){
										UserManager.prototype.doLogin(window["jsonLogin"].username, window["jsonLogin"].password,window["jsonLogin"].callback, "regist");
									},2000);
								},
								"error":function callback(msg){
									//提交注册后错误回调
									tip(msg);
									$(obj).attr("data-submited","false");
									$(obj).parents("form").find(":input[name='mailCode']").val("");
									$(obj).parents("form").find(":password").val("").eq(0).focus();
								}
							};
							var igoUserManager=new UserManager();
							//执行注册请求 userName||password||phoneCode||pinCode||hunterId
							igoUserManager.regist(userName, phoneNum, json.pwd, phoneCode,pinCode,call_back);
						}else{
							tip("注册中，请稍后操作！");
						}
					}
				});
			});
		},
		//登录
		vLogin : function(){
			//登录校验方法
			require.async("util/validation.js", function(){
				//登录校验脚本加载完成后执行登录校验
				$(".v-login").formValidation({
					cssOnFail:		{
						display:  "block"
					},
					//执行登录校验
					enterKey:true,
					submitSelector:".submit-login",
					onFail:function(){
						//错误校验状态
						var obj=arguments[0];
						if(!$(obj).hasClass("invalid")){
							$(obj).addClass("invalid");
						}
					},
					onSubmit:function(){
						//登录提交
						var obj = arguments[0];
						if($(obj).attr("data-submited")!="true"){
							//初次登录点击
							$(obj).attr("data-submited","true");
							var data = decodeURIComponent($(obj).parents("form").serialize().split("&")).split(","),
								json = {};
							for(var i=0,len=data.length; i<len; i++){
								var arr = data[i].split("=");
								json[arr[0]] = arr[1];
							}
							var callback={
								"success":function(msg){
									$(".v-login .submit-login").attr("data-submited","false");
										new CommonUtils().go(1,loginAfterTo);
								},
								"error":function(msg){
									$(".v-login .submit-login").attr("data-submited","false").parents(".v-login").find(":password,:text").val("").eq(0).focus();
									popupLayer.alert(msg);
								},
								"b":true
							};
							//执行登录请求
							UserManager.prototype.doLogin(json.userName, json.password,  callback, "login");
						}else{
							//重复登录点击
							popupLayer.alert("登录中，请稍后操作！");
						}
					}
				});
			});
		},
		openDialog : function(url) {
			var oBox = $("#loginBox"),
				oMaskLayer = $("#loginBox .mask-layer"),
				oInnerBox = $("#loginBox .login-inner"),
				oInnerConBox = $("#loginBox .login-inner .login-con"),
				oTransText = $("#loginBox .login-inner .trans-link p"),
				oTransLink = $("#loginBox .login-inner .trans-link a"),
				oCloseBtn = $("#loginBox .close-btn");

			var callback ;

			var loadLoginPage = function (pageUrl) {
				//打开注册登录窗口
				oInnerConBox.load("/" + pageUrl + "?time=" + new Date().getTime(), function () {
					if (pageUrl.indexOf("login") > -1) {
						oInnerBox.addClass("to-login");
						oTransText.html("还没有账号？");
						oTransLink.html("立即注册").attr('data-url', 'regist.html');
						callback = LoginAndRegister.prototype.vLogin;
					} else {
						oInnerBox.removeClass("to-login");
						oTransText.html("已有账号？");
						oTransLink.html("立即登录").attr('data-url', 'login.html');
						callback = LoginAndRegister.prototype.vRegist;
					}

					if (callback && typeof callback == "function") {
						callback();
					}
				});
			};

			loadLoginPage(url);
			oBox.fadeIn(400);
			oMaskLayer.fadeIn(400);

			//登录注册窗口互切
			oTransLink.click(function(){
				//event.stopPropagation();
				var transUrl = $(this).attr("data-url");
				loadLoginPage(transUrl);
			});

            function closeDialog(){
                oBox.fadeOut(400);
				oMaskLayer.fadeOut(400);
            };

            //关闭登录注册框
            oCloseBtn.unbind("click").click(function(){
                closeDialog();
            });


            //输入校验
            oInnerBox.delegate(".v-register input[name=pwd]", "keyup", function(){
            	LoginAndRegister.prototype.checkPwdStrength($("#pwdStrengthBar"), $(this).val());
            }).delegate(".v-register input[name=regName]", "blur", function(){
            	//检测用户名是否已经使用
            	var regName = $(this).val();
            	UserManager.prototype.checkUserName(regName, function(data){
            		if(data.code == 0){
            			$("#repeatRegName").hide();
            		}else{
            			$("#repeatRegName").show().siblings().find(".validator").hide();
            		}
            	});
            });


           //第三方登录
            oInnerBox.undelegate("click").delegate(".login-side .partner-wx", "click", function(){
                closeDialog();
                $(this).undelegate("click");
                window.open ('../third-login/loginbyweixin.html','wx','height=520,width=410,top=80,left=240') ;

            }).delegate(".login-side .partner-qq","click",function(){
                closeDialog();
                $(this).undelegate("click");
                window.open ('../third-login/loginbyqq.html','TencentLogin','width=450,height=320,menubar=0,scrollbars=1,resizable=1,status=1,titlebar=0,toolbar=0,location=1,top=80,left=240') ;

            }).delegate(".login-side .partner-wb","click",function(){
                closeDialog();
                window.open ('../third-login/loginbysinawb.html','sinaLogin','height=520,width=410,top=80,left=240') ;
            });


		}
	};
	
	function UserManager(){}
	
	UserManager.prototype = {
		popupLayer : popupLayer, //弹出层插件
		gConfig : gc.config,	
		cookie : new Cookie(),
		commonUtils : new CommonUtils(),
		ajaxData : new AjaxData(),
		loginRegister : new LoginAndRegister(),
		constructor : UserManager,
		getUserLevel : function(badge){
			if(!badge || badge.length<=0 || $.isEmptyObject(badge)) {
				return false;
			}
			var o={};
			if(badge instanceof Array){
				for(var i=0,len=badge.length;i<len;i++){
					o[badge[i].badgeAid]={};
					for(var j in badge[i]){
						o[badge[i].badgeAid][j]=badge[i][j];
					}
				}
			}
			if(o.hasOwnProperty("rich")){
				return o;
			} else {
				return false;
			}
		},
		addMsgHtml : function(b){
			var imsg=0;
			if(!isNaN(this.cookie.get("imsg")))
				imsg = this.cookie.get("imsg");
			if(b)imsg-=1;//删除或者读取密信时条数减1
			if(imsg<=0){
				$("#header-inner .user-panel .user-msg i").removeClass("none").html("");
			}else{
				$("#header-inner .user-panel .user-msg i").addClass("none").html("<b>"+imsg+"</b>");
			}
			this.cookie.set("imsg", imsg);
		},
		checkSingle : function(callback){
			try{
				var param = {
					"ticketId" : this.cookie.get("ticketId"),
					"globalId" : this.cookie.get("globalId")
				};
				this.ajaxData.request(gcMethod.P, gUrl.usercenter.checkSingle_url, param, function(data){
					callback(data);
				});
			}catch(ex){}
		},
		//通过用户id获取用户信息
		getUserInfoById : function(globalId, callback){
			try{
				var param = {
					"globalId" : globalId
				};
				this.ajaxData.request(gcMethod.P,  gUrl.usercenter.findUserBaseInfoByGlobalId_url, param, function(data){
					callback(data);
				});
			}catch(ex){}
		},
		checkLogin : function(callback){
			try{
				var sTicketId = this.cookie.get("ticketId"),
					sGlobalId = this.cookie.get("globalId");
				if(sTicketId && sTicketId != "" && sTicketId != "undefined" && sTicketId != "null" && sTicketId != "''"){
					if(callback&&typeof callback=="function")callback();
					return true;
				}else{
					if(callback&&typeof callback=="function")callback();
					return false;
				}
			}catch(ex){
				console.log(ex.name+ex.message);
			}
		},
		doLogin :function(u,p,callback, type){
			var that=this,msg;
			try{
				this.ajaxData.request(gcMethod.P, gUrl.usercenter.loginSingle_url, {"userName":u,"password":p}, function(data){
					if(data.code==0){
						//下次自动登录，将密码缓存到用户本地
						//if($("#autoLogin").prop('checked')){
						//	window.localStorage && window.localStorage.setItem("userName", u);
						//	window.localStorage && window.localStorage.setItem("password", p);
						//}
						
						that.cookie.set("ticketId",data.body.ticketId);
						that.ajaxData.request(gcMethod.P, gUrl.usercenter.checkSingle_url, {"ticketId":data.body.ticketId,"globalId":data.body.user.globalId},function(data){
							if(data.code==0){

								function m(o,fn){
									if(typeof o=="object"){
										o["userSex"]=o["userSex"]?o["userSex"]:"女";
										for(i in o){
											if(o.hasOwnProperty(i)&&i!="badge"&&i!="userId"&&i!="zhuboNextNum"&&i!="revDou"&&i!="richNextNum"){
												if(typeof o[i]=="object"){
													arguments.callee(o[i],fn);
												}else{
													fn(i,o[i]);
												}
											}
										}
									}
								}
								m(data.body,function(a,b){
									that.cookie.set(a,b);
								});
								
								msg="ok";
								if(callback&&typeof callback=="object"&&callback.b){
									that.commonUtils.go(3);
								}else{
									if(callback&&typeof callback=="object"&&typeof callback.success=="function"&&msg)callback.success(msg);
								}
								that=null;
								return;
							}
							if(data.msg)msg=data.msg;
						});
					}else{
						if(data.msg)msg=data.msg;
					}
					if(callback&&typeof callback=="object"&&typeof callback.error=="function"&&msg)callback.error(msg);
				});
			}catch(ex){
				console.log(ex.name+ex.message);
			}
		},
		exit: function(callback){
			try{
				this.cookie.delAll();
				window.localStorage && window.localStorage.removeItem("userName");
				window.localStorage && window.localStorage.removeItem("password");
				if(callback&&typeof callback=="function")callback();
			}catch(ex){
				console.log(ex.name+ex.message);
			}
		},
		regist :function(u,phoneNum, p,c,m, callback){
			//用户注册  u->用户名,p->密码,c->验证码,h->猎头Id, callback->回调对象{success:function(){},error:function(){}}
			var that=this,
				msg;
			try{
				function fn(){
					var data=arguments[0];
					if(data.code==0){
						//alert("恭喜您，注册成功！");
						msg="ok";
						//that.igoCookie.set("ticketId",data.body.ticketId);
						that=null;
						if(callback&&typeof callback=="object"&&typeof callback.success=="function"&&msg)callback.success(msg);
						return;
					};
					if(data.msg)msg=data.msg;
					if(callback&&typeof callback=="object"&&typeof callback.error=="function"&&msg)callback.error(msg);
				}
				/*userName  用户名
				 password  密码
				 phoneCode 手机验证码
				 pinCode   用户验证码*/
				this.ajaxData.request("post",gUrl.usercenter.regist_url,{
					password:p,
					phone:phoneNum,
					phoneCode:c,
					userName:u,
					pinCode:m
				},fn);
			}catch(ex){
				console.log(ex.name+ex.message);
			}
		},
		checkUserName : function(u,callback){
			try{
				function fn(data){
					if(callback&&typeof callback=="function")callback(data);
				}
				this.ajaxData.request("post", gUrl.usercenter.checkUserName_url, {"userName":u}, fn);
			}catch(ex){
				console.log(ex.name+ex.message);
			}
		},
		//用户头像更新
		editUserImage : function(userImageUrl,callback){
			try{
				this.ajaxData.request(gcMethod.P, gUrl.usercenter.editUserImage_url, {"userImageUrl":userImageUrl,"globalId":this.cookie.get("globalId"),"ticketId":this.cookie.get("ticketId")}, function(data){
					if(typeof callback == "function"){
						callback(data);
					}
				});
			}catch(ex){
				console.log(ex.name+ex.message);
			}
		},
		editPassword : function(oldPW,newPW,callback){
			//防止输入内容转码
			oldPW = decodeURIComponent(oldPW);
			newPW = decodeURIComponent(newPW);
			//用户密码修改
			try{
				this.ajaxData.request(gcMethod.P,gUrl.usercenter.editPassword_url,{"password":oldPW,"newPassword":newPW,"globalId":new IgoCookie().get("globalId")},function(data){
					if(typeof callback == "function")
					{
						callback(data);
					}
				});
			}catch(ex){
				console.log(ex.name+ex.message);
			}
		},
		bindEmail : function(PW,email,callback){
			//用户邮箱绑定
			try{
				this.ajaxData.request(gcMethod.P, gUrl.usercenter.editUserMail_url,{"globalId":new IgoCookie().get("globalId"),"password":PW,"userMail":email,"ticketId":this.cookie.get("ticketId")},function(data){
					if(typeof callback == "function")
					{
						callback(data);
					}

				});
			}catch(ex){
				console.log(ex.name+ex.message);
			}
		},
		getPhoneCode : function(param, pinCode, callback,url){
			//用户获取短信验证码
			try{
				var sUrl= gUrl.usercenter.createPhoneCode_url,
					o={};
					o.globalId=this.cookie.get("globalId");
					o.phoneNo = param;
					o.pinCode = pinCode;
				this.ajaxData.request(gcMethod.P,sUrl,o,function(data){
					if(typeof callback == "function"){
						callback(data);
					}
				});
			}catch(ex){
				console.log(ex.name+ex.message);
			}
		},
		editPhone : function(code,phone,pw,callback){
			try{
				this.ajaxData.request(gcMethod.P,gUrl.usercenter.editUserPhone_url,{"globalId":this.cookie.get("globalId"),"code":code,"userPhone":phone,"password":pw,"ticketId":this.cookie.get("ticketId")},function(data){
					if(typeof callback == "function")
					{
						callback(data);
					}
				});
			}catch(ex){
				console.log(ex.name+ex.message);
			}
		},
		editUserNickName : function(nickName,globalId,callback){
			try{
				this.ajaxData.request(gcMethod.P,gUrl.usercenter.editUserNickName_url,{"userNickname":nickName,"globalId":globalId,"ticketId":this.cookie.get("ticketId")},function(data){
					if(typeof callback == "function")
					{
						callback(data);
					}
				});
			}catch(ex){
				console.log(ex.name+ex.message);
			}
		},
		checkExtUser : function(gid,ticketId,callback){
			try{
				var o={"globalId":gid,"ticketId":ticketId};
				this.ajaxData.request(gcMethod.P, gUrl.usercenter.checkExtUser_url, o, function(data){
					if(typeof callback == "function")
					{
						callback(data);
					}
				});
			}catch(ex){}
		},
		searchUser : function(context, callback){
			try{
				var o={"content":context};
				this.ajaxData.request(gcMethod.G, gUrl.room.SEARCH_URL, o, function(data){
					if(typeof callback == "function")
					{
						callback(data);
					}
				});
			}catch(ex){
				console.log(ex.name+ex.message);
			}
		},
		loadUserInfo : function(callback){
			var param = {"ticketId":this.cookie.get("ticketId"),"globalId":this.cookie.get("globalId")};
			this.ajaxData.request(gcMethod.P, gUrl.usercenter.checkSingle_url, param, function(data){callback(data);});
		},
		resetPass : function(b,options,callback,url){
			try{
				if(b){
					var sUrl= gUrl.usercenter.findPassword_url;
					if(url)sUrl= gUrl.usercenter.checkUserByPhoneCode_url;
					this.ajaxData.request(gcMethod.P, sUrl,options, callback);
				}else{
					this.ajaxData.request(gcMethod.P, gUrl.usercenter.resetPassword_url, options, callback);
				}
			}catch(ex){
				console.log(ex.name+ex.message);
			}
		},
        getUserRoom : function(gid, tid, callback){
            var param = {
                "globalId": gid || this.cookie.get("globalId")
            };
            if(!gid){ param.ticketId = this.cookie.get("ticketId");}

            this.ajaxData.request(gcMethod.P, gUrl.room.getUsersRoom_url, param, function(data){
                if(typeof callback == "function"){
                    callback(data);
                }
            });
        },
        isFocus : function(teacherId, callback){
        	var param = {
                "ticketId":this.cookie.get("ticketId"),
                "globalId":this.cookie.get("globalId"),
                "teacherId":teacherId
            };
        	this.ajaxData.request(gcMethod.P, gUrl.pws.checkFansShip_url, param, function(data){
                callback(data);
            });
        },
        //关注
        setFocus : function(teacherId, callback){
            var param = {
                "ticketId":this.cookie.get("ticketId"),
                "globalId":this.cookie.get("globalId"),
                "teacherId":teacherId
            };
            this.ajaxData.request(gcMethod.P, gUrl.pws.fansByShip_url, param, function(data){
                callback(data);
            });
        },
        //取消关注
        cancelFocus : function(teacherId, callback){
            var param = {
                "ticketId":this.cookie.get("ticketId"),
                "globalId":this.cookie.get("globalId"),
                "teacherId":teacherId
            };
            this.ajaxData.request(gcMethod.P, gUrl.pws.cancelFansByShip_url, param, function(data){
                callback(data);
            });
        },
        //获取关注的数量
        getFansCount : function(teacherId, callback){
        	var param = {
                "teacherGid":teacherId
            };
        	this.ajaxData.request(gcMethod.P, gUrl.pws.getFansCount_url, param, function(data){
                callback(data);
            });
        },
		//处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
		banBackSpace : function(e){
			var ev = e || window.event;//获取event对象
			var obj = ev.target || ev.srcElement;//获取事件源
			var t = obj.type || obj.getAttribute('type');//获取事件源类型
			//获取作为判断条件的事件类型
			var vReadOnly = obj.getAttribute('readonly');
			//处理null值情况
			vReadOnly = (vReadOnly == "") ? false : vReadOnly;
			//当敲Backspace键时，事件源类型为密码或单行、多行文本的，
			//并且readonly属性为true或enabled属性为false的，则退格键失效
			var flag1=(ev.keyCode == 8 && (t=="password" || t=="text" || t=="textarea")
			&& vReadOnly=="readonly")?true:false;
			//当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
			var flag2=(ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea")
				?true:false;

			//判断
			if(flag2){
				return false;
			}
			if(flag1){
				return false;
			}
		}
	};
	
	$(document.body).delegate(".igo-search .s-btn", "click", function(){//搜索点击提交
		var content = $(".igo-search .s-input").val();
		if($.trim(content)==""){
			CommonUtils.prototype.igoTipsDialogue(IGO_DEFAULT_TIPS.T03);
			return;
		}
		CommonUtils.prototype.go(1,"searchinfo.html?context="+encodeURI(content)); 
	}).delegate(".igo-search .s-input", "keydown", function(e){//搜索回车提交
		if(e.keyCode==13){
			$(this).siblings(".s-btn").trigger("click");
		}
	});
	

	window.UserManager = UserManager;
	window.getUrlParam = UserManager.prototype.commonUtils.getUrlParam;
	window.openLoginRegistDialog = UserManager.prototype.loginRegister.openDialog;
	window.getImgCode = UserManager.prototype.loginRegister.getImgCode;
	
});