
//校验密码
function passwordValidation(id)
{
	if(id.indexOf("#") == -1)
	{
		id = "#"+id;
	}
	var pw = $(id).val();
	var reg = new RegExp("^[A-Za-z0-9]{4,12}$");
	if(!pw.match(reg)){
	    alert("输入的密码不符合规定!");
	    return false;
	} 
	return true;
};
//确认输入的密码
function confirmPassword(id1,id2)
{
	if(id1.indexOf("#") == -1)
	{
		id1 = "#"+id1;
	}
	if(id2.indexOf("#") == -1)
	{
		id2 = "#"+id2;
	}
	if(escape($(id1).val()) != escape($(id2).val()) || !passwordValidation(id1))
	{
		 alert("输入的密码不符合规定!");
		 return false;
	}
	return true;
};

//验证身份证号
function checkIdentity(sValue){
	//各省市身份证区号
	var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
			   21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",
			   33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",
			   41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",
			   46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",
			   54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",
			   65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
	var iSum=0;
	//var info="";

	if(!/^\d{17}(\d|x)$/.test(sValue)){
		return "输入的身份证号长度不对！";
	} 
	
	sValue=sValue.replace(/x$/,"a");  
	if(aCity[parseInt(sValue.substr(0,2))]==null){
		return "非法地区！";
	}

	var sBirthday=sValue.substring(6,10)+"-"+Number(sValue.substring(10,12))+"-"+Number(sValue.substring(12,14));  
	var d=new Date(sBirthday.replace(/-/g,"/"));
	if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())){
		return "非法生日!"; 

	}
	for(var i = 17;i>=0;i --) 
		iSum += (Math.pow(2,i) % 11) * parseInt(sValue.charAt(17 - i),11) ; 
	if(iSum%11!=1){
		return "非法证号!"; 
	}
	return 1;
	//return aCity[parseInt(sValue.substring(0,2))]+","+sBirthday+","+(sValue.substring(16,17)%2?"男":"女"); 
}

//过滤非法字符
function filterIllegalCharacter(s) { 
	var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]") 
	var rs = ""; 
	for (var i = 0; i < s.length; i++) { 
		rs = rs+s.substr(i, 1).replace(pattern, ''); 
	} 
	return rs; 
} 

(function($){
	$.validationSettings =  {
			selector:		".validator",
			verifyOnBlur:	true,
			verifyOnFocus:  true,
			verifyOnSubmit:	true,
			cssOnValidated:	{display: "none"},
			cssOnFail:		{
				display:  "block",
				color:    "red",
				fontSize: "12px"
			},
			onValidated:	function(validator){return;},
			onFail:			function(validator){return;},
			onSubmit:		function(form){return true;}
	};
		
	$.validationOptions = function(options){
		$.validationSettings = $.extend($.validationSettings, options);
		return $.validationSettings;
	};
	$.fn.validators = function(){
		var settings = $.validationSettings;
		return $(this).parent().find(settings.selector);
	};
		
	$.fn.formValidation = function(options){
		settings = $.validationOptions(options);
		this.each(function(){
			var validators = $(settings.selector, this);
			if (settings.verifyOnBlur){
				$("input,textarea,select", this).blur(function(){
					$(this).validators().verify();
				});
			}	
			if(settings.verifyOnFocus){
				$("input,textarea,select", this).focus(function(){
					$(this).validators().css(settings.cssOnValidated);
				});
			}
			if($(this)[0].tagName.toLowerCase=="form"){
				$(this).submit(function(event){
					settings = $.validationOptions(options);
					var verified = true;
					if (settings.verifyOnSubmit){
						verified = validators.verify();
					}
					return verified && settings.onSubmit(this);
				});	
			};
			if(settings.submitSelector){
				$(settings.submitSelector,this).click(function(event){
					settings = $.validationOptions(options);
					var verified = true;
					if (settings.verifyOnSubmit){
						verified = validators.verify();
					}
					return verified && settings.onSubmit(this);
				});
			}
			if(settings.enterKey){
				$(document).keydown(function(event){
					if(event.keyCode==13){
						settings = $.validationOptions(options);
						var verified = true;
						if (settings.verifyOnSubmit){
							verified = validators.verify();
						}
						var that=settings.submitSelector;
						return verified && settings.onSubmit(that);
					}
				});
			}
		});
		return this;
	};
		
	$.fn.verify = function(){
		var success = true;
		var settings = $.validationSettings;
		this.each(function(){
			var type = $(this).attr("data-type");
			//var element = $(this).attr("data-element");
			var max = parseFloat($(this).attr("data-max"));
			var min = parseFloat($(this).attr("data-min"));
			var ref = $(this).attr("data-ref");
			var mask = new RegExp($(this).attr("data-mask"));
			var sValue = $(this).parent().find("input").val();
			var iValue = parseInt(sValue);			
			var validated = false;
			var errorMsg = "";
			switch(type){
				case "regName":
					if(sValue.length<6||sValue.length>16){
						validated = false;
						break;
					}
					//判断用户名中是否有特殊字符
					var filterReg = /[(\ )(\~)(\!)(\@)(\#)   (\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)   (\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)   (\<)(\>)(\?)(\)]+/.test(sValue);
					if(filterReg){
						validated = false;
						break;
					}
					var reg = /^([a-zA-Z]{1,}[a-zA-Z0-9]*)|([0-9]*[a-zA-Z]{1,}[0-9]*)$/.test(sValue);
					validated = reg;
					break;
				case "email":
					var filterReg1 = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/,
						filterReg2 = /[\u4e00-\u9fa5]/;
					validated = /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/.test(sValue);	
					validated = validated && (!filterReg2.test(sValue));
					break;
				case "phoneNum":
					var filterReg1 = /^[1]([3][0-9]{1}|[5][(0-3)|(5-9)]{1}|[7][0-9]{1}|[8][0-9]{1}|45|47)[0-9]{8}$/,
				 	 	filterReg2 = /^[1-9]\d*$/;
					validated = filterReg1.test(sValue);	
					validated =  validated && (filterReg2.test(sValue));
					break;
				case "userName":
					validated = /^[a-zA-Z]{1}([a-zA-Z0-9]){5,19}$/.test(sValue);
					break;
				case "natural":
					validated = /[0-9]+/.test(sValue);
					break;
				case "integer":
					validated = /[+\-]?[0-9]+/.test(sValue);
					break;
				case "float":
					validated = /[\+\-]?[0-9]+(\.[0-9]+)?(E([\+\-]?[0-9]+))?/.test(sValue);
					break;
				case "mask":
					validated = mask.test(sValue);
					break;
				case "required":
					validated = (sValue != "" && sValue != null && sValue != undefined)? true : false;
					break;
				case "QQ":
					validated = /^[1-9][0-9]{4,10}$/.test(sValue);
					break;
				case "checked":
					//value = $("#"+element+":checked").val();
					value =$(this).parent().find("input:checked").length;
					validated = (value>0)? true : false;
					break;
				case "equals":
					validated = (sValue == ref);
					break;
				case "different":
					validated = (sValue != ref);
					break;
				case "range-value":
					validated = (iValue >= min && iValue <= max)? true: false;
					break;
				case "max-value":
					validated = (iValue <= max)? true: false;
					break;
				case "min-value":
					validated = (iValue >= min)? true: false;
					break;
				case "range-length":
					validated = (sValue.length >= min && sValue.length <= max)? true: false;
					break;
				case "max-length":
					validated = (sValue.length <= max)? true: false;
					break;
				case "min-length":
					validated = (sValue.length >= min)? true: false;
					break;
				case "identity":
					var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
					var iSum=0  ;
					var reg = /^\d{17}(\d|x|X)$/;
					if(!reg.test(sValue)){
						errorMsg = "输入的身份证号长度不对！";
						validated = false;
						break;
					} 
					
					sValue=sValue.replace(/x|X$/,"a");  
					if(aCity[parseInt(sValue.substring(0,2))]==null){
						errorMsg = "非法地区！";
						validated = false;
						break;
					}
			
					sBirthday=sValue.substring(6,10)+"-"+Number(sValue.substring(10,12))+"-"+Number(sValue.substring(12,14));  
					var d=new Date(sBirthday.replace(/-/g,"/"));
					if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())){
						errorMsg = "非法生日!"; 
						validated = false;
						break;
					}
					for(var i = 17;i>=0;i --) 
						iSum += (Math.pow(2,i) % 11) * parseInt(sValue.charAt(17 - i),11) ; 
					
					if(iSum%11!=1){
						errorMsg = "非法证号!"; 
						validated = false;
						break;
					}
				default:
					validated=true;
					break;
			}
			
			if (validated) {
				$(this).css(settings.cssOnValidated);
				settings.onValidated(this);
			} else {
				$(this).css(settings.cssOnFail);
				var oInput=$(this).parent().find("input,textarea,select");
				oInput.attr("placeholder","").val("");
				if(errorMsg != ""){
					$(this).html(errorMsg);
				}
				settings.onFail(this);
			}			
			success = success && validated;			
		});
		return success;
	};	
})(jQuery);
