/**
 * Created by Administrator on 2016/7/19.
 */
function IUserCenter(){
    var um = new UserManager();
    this.cookie = um.cookie;
    this.ajaxData =um.ajaxData;
    this.method = um.gConfig.METHOD;
    this.download = um.gConfig.DOWNLOAD;
    this.gUrl = um.gConfig.AJAX_URL;
}

//更新用户信息
IUserCenter.prototype.updateUserInfo = function(gid, tid, opts, callback){
	var param = {
		"globalId" : gid,
		"ticketId" : tid,
        "userMsg" : opts
    };
    this.ajaxData.request(this.method.P, this.gUrl.usercenter.fillUserMsg_url, param, function(data){
        callback(data);
    });
};

//修改密码
IUserCenter.prototype.updatePassword = function(gid, tid, oldPwd, newPwd, callback){
	var param = {
        "globalId" : gid,
        "ticketId" : tid,
        "password" : oldPwd,
        "newPassword" : newPwd
    };
    this.ajaxData.request(this.method.P, this.gUrl.usercenter.editPassword_url, param, function(data){
        callback(data);
    });
};

//更新用户头像
IUserCenter.prototype.updataAvatar = function(gid, tid, imgUrl, callback){
	var param = {
        "globalId" : gid,
        "ticketId" : tid,
        "userImageUrl" : imgUrl
    };
    this.ajaxData.request(this.method.P, this.gUrl.usercenter.editUserImage_url, param, function(data){
        callback(data);
    });
};

//获取名师介绍
IUserCenter.prototype.getTeacherInfo = function(teacherId, callback){
    var param = {
        "userGid" : teacherId
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.getTeacherInfo_url, param, function(data){
        callback(data);
    });
};
//保存名师介绍
IUserCenter.prototype.saveTeacherInfo = function(teacherId, userImg, teacherName, teacherTitle, content, callback){
    var param = {
        "userGid" : teacherId,
        "userImg" : userImg,
        "name" : teacherName,
        "title" : teacherTitle,
        "content" : content
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.saveTeacherInfo_url, param, function(data){
        callback(data);
    });
};

//获取艺术活动列表
IUserCenter.prototype.getArtActivityList = function(teacherId, callback){
    var param = {
        "userGid" : teacherId
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.getArtActivityList_url, param, function(data){
        callback(data);
    });
};
//获取艺术活动详情
IUserCenter.prototype.getArtActivityById = function(id, callback){
    var param = {
        "id" : id
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.getArtActivityById_url, param, function(data){
        callback(data);
    });
};

//添加艺术活动详情
IUserCenter.prototype.addArtActivity = function(teacherId, title, content, callback){
    var param = {
        "userGid" : teacherId,
        "title" : title,
        "content" : content
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.addArtActivity_url, param, function(data){
        callback(data);
    });
};
//编辑艺术活动详情
IUserCenter.prototype.updateArtActivity = function(id, teacherId, title, content, callback){
    var param = {
        "id" : id,
        "userGid" : teacherId,
        "title" : title,
        "content" : content
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.updateArtActivity_url, param, function(data){
        callback(data);
    });
};
//删除艺术活动
IUserCenter.prototype.delArtActivity = function(id, callback){
    var param = {
        "id" : id
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.delArtActivity_url, param, function(data){
        callback(data);
    });
};

//获取老师的学术研究列表
IUserCenter.prototype.getStudyList = function(teacherId, callback){
    var param = {
        "userGid" : teacherId
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.getAcademicResearchList_url, param, function(data){
        callback(data);
    });
};
//获取学术研究详情
IUserCenter.prototype.getStudyById = function(id, callback){
    var param = {
        "id" : id
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.getAcademicResearchById_url, param, function(data){
        callback(data);
    });
};
//添加学术研究详情
IUserCenter.prototype.addStudy = function(teacherId, title, content, callback){
    var param = {
        "userGid" : teacherId,
        "title" : title,
        "content" : content
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.addAcademicResearch_url, param, function(data){
        callback(data);
    });
};
//编辑学术研究详情
IUserCenter.prototype.updateStudy = function(id, teacherId, title, content, callback){
    var param = {
        "id" : id,
        "userGid" : teacherId,
        "title" : title,
        "content" : content
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.updateAcademicResearch_url, param, function(data){
        callback(data);
    });
};
//删除学术研究
IUserCenter.prototype.delStudy = function(id, callback){
    var param = {
        "id" : id
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.delAcademicResearch_url, param, function(data){
        callback(data);
    });
};

//获取老师的代表作品
IUserCenter.prototype.getWorksList = function(teacherId, callback){
    var param = {
        "userGid" : teacherId
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.getRepresentativeList_url, param, function(data){
        callback(data);
    });
};
//获取代表作品详情
IUserCenter.prototype.getWorksById = function(id, callback){
    var param = {
        "id" : id
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.getRepresentativeById_url, param, function(data){
        callback(data);
    });
};
//添加代表作品详情
IUserCenter.prototype.addWorks = function(teacherId, name, imgUrl, callback){
    var param = {
        "userGid" : teacherId,
        "name" : name,
        "imgUrl" : imgUrl
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.addRepresentative_url, param, function(data){
        callback(data);
    });
};
//编辑代表作品详情
IUserCenter.prototype.updateWorks = function(id, teacherId, name, imgUrl, callback){
    var param = {
        "id" : id,
        "userGid" : teacherId,
        "name" : name,
        "imgUrl" : imgUrl
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.updateRepresentative_url, param, function(data){
        callback(data);
    });
};
//删除代表作品
IUserCenter.prototype.delWorks = function(id, callback){
    var param = {
        "id" : id
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.delRepresentative_url, param, function(data){
        callback(data);
    });
};
//获取老师的公告列表
IUserCenter.prototype.getNoticeList = function(teacherId, type, callback){
    var param = {
        "userGid" : teacherId
    };
    if(type && type != "" && type != null){
    	param["type"] = type;
    }
    this.ajaxData.request(this.method.P, this.gUrl.pws.getPublicInfoList_url, param, function(data){
        callback(data);
    });
};
//获取老师的公告列表详情
IUserCenter.prototype.getNoticeById = function(id, callback){
    var param = {
        "id" : id
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.getPublicInfoById_url, param, function(data){
        callback(data);
    });
};
//添加老师公告公示
IUserCenter.prototype.addNotice = function(teacherId, type, title, content, callback){
    var param = {
        "userGid" : teacherId,
        "type" : type,
        "title" : title,
        "content" : content
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.addPublicInfo_url, param, function(data){
        callback(data);
    });
};
//添加老师公告公示
IUserCenter.prototype.updateNotice = function(id, teacherId, type, title, content, callback){
    var param = {
        "id" : id,
        "userGid" : teacherId,
        "type" : type,
        "title" : title,
        "content" : content
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.updatePublicInfo_url, param, function(data){
        callback(data);
    });
};
//删除代表作品
IUserCenter.prototype.delNotice = function(id, callback){
    var param = {
        "id" : id
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.delPublicInfo_url, param, function(data){
        callback(data);
    });
};

//添加课程
IUserCenter.prototype.addCourse = function(opts, callback){
    var param = {
        "teacherId" : opts.teacherId,
        "courseType" : opts.courseType,
        "courseTitle" : opts.courseTitle,
        "courseImg" : opts.courseImg,
        "vaildTime" : opts.vaildTime,
        "price" : opts.price
    };
    this.ajaxData.request(this.method.P, this.gUrl.shop.addCourse_url, param, function(data){
        callback(data);
    });
};

//修改课程
IUserCenter.prototype.updateCourse = function(opts, callback){
    var param = {
		"courseId": opts.courseId,
        "teacherId" : opts.teacherId,
        "courseType" : opts.courseType,
        "courseTitle" : opts.courseTitle,
        "courseImg" : opts.courseImg,
        "vaildTime" : opts.vaildTime,
        "price" : opts.price
    };
    this.ajaxData.request(this.method.P, this.gUrl.shop.updateCourse_url, param, function(data){
        callback(data);
    });
};

//删除课程
IUserCenter.prototype.deleteCourse = function(courseId, callback){
    var param = {
        "courseId" : courseId
    };
    this.ajaxData.request(this.method.P, this.gUrl.shop.deleteCourse_url, param, function(data){
        callback(data);
    });
};

//根据课程ID获取课程的定价和基础信息
IUserCenter.prototype.getCourseInfoByCourseId = function(courseId, callback){
    var param = {
    		"courseId" : courseId
    };
    this.ajaxData.request(this.method.P, this.gUrl.shop.getCourseInfoById_url, param, function(data){
        callback(data);
    });
};

//根据老师GID获取课程的定价和基础信息
IUserCenter.prototype.getCourseInfoByTeacherId = function(teacherId, callback){
    var param = {
        "teacherId" : teacherId
    };
    this.ajaxData.request(this.method.P, this.gUrl.shop.getCourseInfoByUserId_url, param, function(data){
        callback(data);
    });
};

//根据课程id获取课件列表
IUserCenter.prototype.getCoursewareInfoList = function(courseId, callback){
    var param = {
        "courseId" : courseId
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.getCoursewareInfoList_url, param, function(data){
        callback(data);
    });
};

//添加课件详情
IUserCenter.prototype.addCoursewareInfo = function(opts, callback){
    var param = {
        "userGid" : opts.teacherId,
        "saleType" : opts.saleType,
        "name" : opts.name,
        "courseId" : opts.courseId,
        "vedioUrl" : opts.videoUrl,
        "vedioType" : opts.videoType,
        "vedioTime" : opts.videoTime,
        "vedioSize" : opts.videoSize
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.addCoursewareInfo_url, param, function(data){
        callback(data);
    });
};
//编辑课件详情
IUserCenter.prototype.editCoursewareInfo = function(opts, callback){
    var param = {
        "id" : opts.id,
        "userGid" : opts.teacherId,
        "saleType" : opts.saleType,
        "name" : opts.name,
        "courseId" : opts.courseId,
        "vedioUrl" : opts.videoUrl,
        "vedioType" : opts.videoType,
        "vedioTime" : opts.videoTime,
        "vedioSize" : opts.videoSize
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.updateCoursewareInfo_url, param, function(data){
        callback(data);
    });
};

//根据课件id获取课件详情
IUserCenter.prototype.getCoursewareInfoById = function(id, callback){
    var param = {
        "id" : id
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.getCoursewareInfoById_url, param, function(data){
        callback(data);
    });
};

//删除课件详情
IUserCenter.prototype.delCoursewareInfo = function(id, callback){
    var param = {
        "id" : id
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.delCoursewareInfo_url, param, function(data){
        callback(data);
    });
};
//获取未关联课程的视频信息
IUserCenter.prototype.getCoursewareInfoListNoCourse = function(gid, callback){
    var param = {
        "userGid" : gid
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.getCoursewareInfoListNoCourse_url, param, function(data){
        callback(data);
    });
};
//获取用户视频使用空间大小
IUserCenter.prototype.getCoursewareVedioSize = function(gid, callback){
    var param = {
        "userGid" : gid
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.getCoursewareVedioSize_url, param, function(data){
        callback(data);
    });
};


//我的关注
IUserCenter.prototype.getFocusList = function(callback){
    var param = {
        "globalId" : this.cookie.get("globalId"),
        "ticketId" : this.cookie.get("ticketId")
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.getFansShipList_url, param, function(data){
        callback(data);
    });
};


//获取学习历史记录
IUserCenter.prototype.getLearnRecordList = function(userGid, startTime, endTime, callback){
    var param = {
		"userGid":userGid,
		"startTime": startTime,
		"endTime":endTime
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.getLearnRecordList_url, param, function(data){
        callback(data);
    });
};

//根据Id删除学习历史记录
IUserCenter.prototype.delHistoryById = function(userGid, courseId, date, callback){
    var param = {
        "userGid" : userGid,
        "courseId" : courseId,
        "date" : date
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.deleteLearnRecordById_url, param, function(data){
        callback(data);
    });
};

//根据日期删除学习历史记录
IUserCenter.prototype.delHistoryByDate = function(userGid, dateStr, callback){
    var param = {
        "userGid" : userGid,
        "dateStr" : dateStr
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.deleteLearnRecordByDate_url, param, function(data){
        callback(data);
    });
};

//我的收藏
IUserCenter.prototype.getFavoriteList = function(callback){
    var param = {
        "globalId" : this.cookie.get("globalId"),
        "ticketId" : this.cookie.get("ticketId")
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.getKeepCourseList_url, param, function(data){
        callback(data);
    });
};

//取消收藏
IUserCenter.prototype.removeFavoriteCourse = function(courseId, callback){
    var param = {
        "globalId" : this.cookie.get("globalId"),
        "ticketId" : this.cookie.get("ticketId"),
        "courseId" : courseId
    };
    this.ajaxData.request(this.method.P, this.gUrl.pws.cancelKeepCourse_url, param, function(data){
        callback(data);
    });
};

//设置房间信息
IUserCenter.prototype.setUserRoom = function(gid, tid, roomTitle, roomImage, smallImage, roomType, callback){
    var param = {
        "globalId" : gid,
        "ticketId" : tid, 
        "roomTitle" : roomTitle || "", //可选
        "roomImage" : roomImage || "",//可选
        "smallImage" : smallImage || "",//可选
        "roomType" : roomType || ""//可选
    };
    this.ajaxData.request(this.method.P, this.gUrl.room.setUsersRoom_url, param, function(data){
       callback(data);
    });
};


//删除系统消息
IUserCenter.prototype.delSysMsg = function(gid, tid, id, callback){
	var param = {
		"globalId" : gid,
		"ticketId" : tid,
		"id" : id
	};
	this.ajaxData.request(this.method.P, this.gUrl.room.delSysMsg_url, param, function(data){
       callback(data);
    });
};

//添加、删除管理
IUserCenter.prototype.addOrDelManager = function(param, callback){
    this.ajaxData.request(this.method.P,this.gUrl.room.addOrDelManager_url,param,function(data){
        callback(data);
    });
};

//获取用户的课程列表
IUserCenter.prototype.getCourseInfoByUser = function(gid, courseName, callback){
	var param = {
		"userGid" : gid
	};
	if(courseName){
		param['courseName'] = courseName;
	}
	this.ajaxData.request(this.method.P, this.gUrl.shop.getCourseInfoByUser_url, param, function(data){
       callback(data);
    });
};

//取消订单
IUserCenter.prototype.cancelOrder = function(gid, tid, orderId, callback){
	var param = {
		"globalId" : gid,
		"ticketId" : tid,
		"orderId" : orderId
	};
    this.ajaxData.request(this.method.P,this.gUrl.accounting.cancelOrder_url,param,function(data){
        callback(data);
    });
};

//删除订单
IUserCenter.prototype.deleteOrder = function(gid, tid, orderId, callback){
	var param = {
		"globalId" : gid,
		"ticketId" : tid,
		"orderId" : orderId
	};
    this.ajaxData.request(this.method.P,this.gUrl.accounting.deleteOrder_url,param,function(data){
        callback(data);
    });
};

//获取上传助手下载地址
IUserCenter.prototype.getQxUploadsVersion = function(callback){
	var param = {};
    this.ajaxData.request(this.method.P, this.download.getQxUploadsVersion_url,param,function(data){
        callback(data);
    });
};
