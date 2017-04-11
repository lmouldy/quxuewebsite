define(function(require, exports, module){
	require('util/config');
	require('util/common');

	$('#header').load('./header.html',function(){
		require('page/header');
	});
	$('#footer').load('./footer.html');

	var um = new UserManager(),
		gMethod = um.gConfig.METHOD,
		gUrl = um.gConfig.AJAX_URL;

	$(function(){
		var val = decodeURI(um.commonUtils.getUrlParam('val')),
			type = um.commonUtils.getUrlParam('type'),
			param = {}, gurl = {},
		    shtml = '';

		var oSearchType = {
			'userNickname' : '老师昵称',
			'courseName' : '课程名称',
			'roomId': '教室编号'
        };
		
		gurl.roomId = gUrl.room.queryRoom_url;
		gurl.userNickname = gUrl.usercenter.getRoomInfoByTeacher_url;
		gurl.courseName = gUrl.shop.getRoomInfoByCourseTitle_url;
		param[type] = val;

		um.ajaxData.request(gMethod.P, gurl[type], param, function(data){
			if(data.code == 0 && data.body){
					
				$('.content .title').text('按【'+oSearchType[type]+'】搜索“'+val+'”共找到'+ data.body.length +'条记录');
			
				$.each(data.body,function(index,value){
					shtml += '<div class="live-box"><a href="/rm/'+ value.roomId +'">';
					shtml += '<img src="'+ value.roomImage +'" alt=""></a>';
					shtml += '<span>房间名称：'+ value.roomTitle +'</span>';
					shtml += '<span>老师名称：'+ value.userNickname +'</span>';
					shtml += '<span>教室编号：'+ value.roomId +'</span></div>';
				});				
				
			}else{

				shtml += '<div class="live-box">没有找到搜索结果</div>';

				um.popupLayer.msg('没有找到搜索结果',{
					icon:2,
					time:3000
				});
			}	

			$('.content').append(shtml);
		});
	})
})