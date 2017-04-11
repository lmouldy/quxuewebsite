/**
 * 日期处理格式
 */
function DateFormateUtil(){}
/**
 * 格式化日期
 */
DateFormateUtil.prototype.formatAllDate = function(date){
	var paddNum = function(num){
	      num += "";
	      return num.replace(/^(\d)$/,"0$1");
	    };
	    //指定格式字符
	    var cfg = {
	       yyyy : date.getFullYear(), //年 : 4位
	       yy : date.getFullYear().toString().substring(2),//年 : 2位
	       M  : date.getMonth() + 1,  //月 : 如果1位的时候不补0
	       MM : paddNum(date.getMonth() + 1), //月 : 如果1位的时候补0
	       d  : date.getDate(),   //日 : 如果1位的时候不补0
	       dd : paddNum(date.getDate()),//日 : 如果1位的时候补0
	       hh : paddNum(date.getHours()),  //时
	       mm : paddNum(date.getMinutes()), //分
	       ss : paddNum(date.getSeconds()) //秒
	    };
	    var format = "yyyy-MM-dd hh:mm:ss";
	    return format.replace(/([a-z])(\1)*/ig,function(m){return cfg[m];});
};
/**
 * 格式化日期到分秒
 */
DateFormateUtil.prototype.formatMinSecondDate = function(date){
	var paddNum = function(num){
	      num += "";
	      return num.replace(/^(\d)$/,"0$1");
	    };
	    //指定格式字符
	    var cfg = {
	       hh : paddNum(date.getHours()),
	       mm : paddNum(date.getMinutes()), //分
	       ss : paddNum(date.getSeconds()) //秒
	    };
	    var format = "hh:mm:ss";
	    return format.replace(/([a-z])(\1)*/ig,function(m){return cfg[m];});
};
/**
 * 格式化日期到时分
 */
DateFormateUtil.prototype.formatHourMinDate = function(date){
	var paddNum = function(num){
	      num += "";
	      return num.replace(/^(\d)$/,"0$1");
	    };
	    //指定格式字符
	    var cfg = {
	       hh : paddNum(date.getHours()),
	       mm : paddNum(date.getMinutes())
	    };
	    var format = "hh:mm";
	    return format.replace(/([a-z])(\1)*/ig,function(m){return cfg[m];});
};
//求两个时间的天数差 日期格式为 YYYY-MM-dd 
DateFormateUtil.prototype.daysBetween = function (DateOne,DateTwo)
{   
    var OneMonth = DateOne.substring(5,7);  
    var OneDay = DateOne.substring(8,11);  
    var OneYear = DateOne.substring(0,DateTwo.indexOf ('-'));  
  
    var TwoMonth = DateTwo.substring(5,7);  
    var TwoDay = DateTwo.substring(8,11);  
    var TwoYear = DateTwo.substring(0,DateTwo.indexOf ('-'));  
  
    var cha=((Date.parse(OneMonth+'/'+OneDay+'/'+OneYear)- Date.parse(TwoMonth+'/'+TwoDay+'/'+TwoYear))/86400000);   
    return Math.abs(cha);  
};

//根据日期获取月份的天数
DateFormateUtil.prototype.getDaysByMonth = function(date){
	var m = date.substring(5, 7);
	var m1 = date.substring(5,6);
	var m2 = date.substring(6, 7);  
   // var d = date.substring(date.length, date.lastIndexOf ('-')+1); 
	var y = date.substring(0, date.indexOf ('-'));  
	if(m1 == 0){
		return 32-new Date(y,m2-1,32).getDate();
	}else{
		return 32-new Date(y,m-1,32).getDate();
	}
};

//取得当前日期所在月的最大天数  
DateFormateUtil.prototype.MaxDayOfDate = function()  
{   
	var d= new Date();
	return new Date(d.getFullYear(), d.getMonth()+1,0).getDate();
};

//计算两个时间的时间差
DateFormateUtil.prototype.between = function(date1,date2){
	date1 = date1.replace(new RegExp("-","gm"),"/");
	date2 = date2.replace(new RegExp("-","gm"),"/");
	var date3 = Math.abs(new Date(date2).getTime()-new Date(date1).getTime());  //时间差的毫秒数

	//计算出相差天数
	var days=Math.floor(date3/(24*3600*1000));
	 
	//计算出小时数
	var leave1=date3%(24*3600*1000);    //计算天数后剩余的毫秒数
	var hours=Math.floor(leave1/(3600*1000));
	
	//计算相差分钟数
	var leave2=leave1%(3600*1000);       //计算小时数后剩余的毫秒数
	var minutes=Math.floor(leave2/(60*1000));

	//计算相差秒数
	var leave3=leave2%(60*1000);     //计算分钟数后剩余的毫秒数
	var seconds=Math.round(leave3/1000);
	
	var time_difference = days+","+hours+","+minutes+","+seconds;

	return time_difference;
};

//比较两个日期的大小  startdate：较近的日期  enddate：较远的日期 
DateFormateUtil.prototype.CompareDate = function(startdate,enddate){
	var arr=startdate.split("-");    
	var starttime=new Date(arr[0],arr[1],arr[2]);    
	var starttimes=starttime.getTime();   
	  
	var arrs=enddate.split("-");    
	var lktime=new Date(arrs[0],arrs[1],arrs[2]);    
	var lktimes=lktime.getTime();   
	  
	if(starttimes>=lktimes){   
		return false;   
	}else{
		return true;   
	}  
};

//获取当前日期
DateFormateUtil.prototype.getCurentDate = function()
{ 
    var now = new Date();
    var date = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-').replace(/(?=\b\d\b)/g,'0');
    //获取当年日期 yy-mm-dd HH:mm:ss
    //var date = [
    //[now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-'),
    //[now.getHours(), now.getMinutes(), now.getSeconds()].join(':')
    //].join(' ').replace(/(?=\b\d\b)/g, '0'); // 正则补零 (略微改动)
    return date; 
};
//获取月份最后一天
DateFormateUtil.prototype.getMonthLastDay = function(year,month)      
{      
	 var new_year = year;    //取当前的年份      
	 var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）      
	 if(month>12)            //如果当前大于12月，则年份转到下一年      
	 {      
		 new_month -=12;        //月份减      
		 new_year++;            //年份增      
	 }      
	 var newnew_date = new Date(new_year,new_month,1);                //取当年当月中的第一天      
	 return (new Date(newnew_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期      
};

/**
 * 增加指定月份
 * cur:指定日期
 * month:指定月份
 */
DateFormateUtil.prototype.addTimeByMonth = function(cur, month){
	var newDate = "";
	if (month && !isNaN(month)){
		var arr = cur.split("-");
        var y = parseInt(arr[0]);
        var m = parseInt(arr[1]);
        var d = parseInt(arr[2]);
        m += parseInt(month);
        if (m > 12){
            y = parseInt(y + m / 12);
            m = m % 12;
        }
        
        var isPN = function(_year) {
            if ((_year % 100 == 0 && _year % 400 == 0) || (_year % 100 != 0 && _year % 4 == 0)){
                return true;
            }
            return false;
        };

        if (m == 2){
            isPN(y) ? d = 29 : d = 28;
        }
        
        m < 10 ? m = "0"+m : m;
        d < 10 ? d = "0"+d : d;

        newDate = y + "-" + m + "-" + d;
	}
	return newDate;
};