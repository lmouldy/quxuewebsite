define(function(require){

//定义单全局变量，避免全局变量过多
var GLOBAL_CONFIG = {};
var locationProtocol = window.location.protocol == "https:" ? "https:" :"http:";
var picShowIp = "http://www.xiu90.com";

//基础配置
GLOBAL_CONFIG.BASE = {
	BASE_PROTOCOL : locationProtocol,
	BASE_URL :  locationProtocol +"//"+window.location.host+"/",
	BASE_PHONE_URL : "http://m0.xiu90.com/",

	BASE_UPLOAD_GET_URL : locationProtocol+"//192.168.100.212",
	BASE_UPLOAD_URL : locationProtocol+"//192.168.100.212:8082"

};

//数据提交方式
GLOBAL_CONFIG.METHOD = {
	G : "GET",
	P : "POST"	
}

//图片上传地址
GLOBAL_CONFIG.UPLOAD = {
	AVA : GLOBAL_CONFIG.BASE.BASE_UPLOAD_URL +"/uploads/ufupload",
	RM : GLOBAL_CONFIG.BASE.BASE_UPLOAD_URL +"/uploads/rmupload",
	PM : GLOBAL_CONFIG.BASE.BASE_UPLOAD_URL +"/uploads/pmupload",
	P : GLOBAL_CONFIG.BASE.BASE_UPLOAD_URL +"/uploads/getProgress",
	UPLOADVIDEO : GLOBAL_CONFIG.BASE.BASE_UPLOAD_URL +"/uploads/videoUpload",
	url : GLOBAL_CONFIG.BASE.BASE_UPLOAD_GET_URL + "/uploads/"
};

//正则表达式
GLOBAL_CONFIG.REGEX = {
	//移动手机号
	MOBILE_PHONE : /^[1]([3][0-9]{1}|[5][(0-3)|(5-9)]{1}|[7][0-9]{1}|[8][0-9]{1}|45|47)[0-9]{8}$/,
	EMAIL : /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/
};

//默认值
GLOBAL_CONFIG.DEFAULT = {
	//默认用户头像图片地址
    DEFAULT_USER_IMG : "/images/pm/default/default_head.jpg",
    //默认分享的图片logo
    DEFAULT_SHARE_LOGO_IMG: GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/default/sheare_icon.png"
};

GLOBAL_CONFIG.DOWNLOAD = {
    //书法报视频助手下载地址
    GET_DOWNLOAD_IGO_URL : GLOBAL_CONFIG.BASE.BASE_URL+"uploads/getIgoAssistClientVersion",
	//书法报视频安卓端下载地址
    GET_ANDROID_VERSION_URL : GLOBAL_CONFIG.BASE.BASE_URL+"uploads/getAndroidVersion",
    //上传文件助手下载地址
    getQxUploadsVersion_url : GLOBAL_CONFIG.BASE.BASE_URL + "/uploads/getQxUploadsVersion",
    //Web下载App二维码地址
    DOWNLOAD_APP_URL:"http://192.168.100.224/",
    //下载IOS二维码地址
    DOWNLOAD_IOS_URL:"https://itunes.apple.com/us/app/qx/id1157270839?l=zh&ls=1&mt=8"
    
};

GLOBAL_CONFIG.PLAY_TYPE = {
	PERSONAL : "../flash/QuxuePlayer.swf",
	CHESS_VIDEO:"../flash/QuxuePlayer100.swf",
	INDEX_VIDEO : "../flash/QuxuePlayerIndex.swf",
	MCU_VIDEO:"../flash/QuxuePlayer100.swf",
	GIFTTOOLS : "../flash/IgoGift.swf",
	ROOM_MODULE : "../flash/ImModule.swf",
	ROOM_MSG_SWF : "../flash/Msg1.0.6.swf",
	ROOM_MOST_GIFT_EFFECT_SWF : "flash/GiftTextFloat.swf",
	ROOM_MSG_SOCKET_TIME : {
		SUBSCRIBE:4000,
		SEND:2000
	}
};

GLOBAL_CONFIG.ROOM_LIMIT = {
	BASE_URL : GLOBAL_CONFIG.BASE.BASE_URL,
	LINE_STATUS : {
		ON_LINE : 1,
        OFF_LINE : 0
    },
	KICK_TIME:{
		NORMAL_KICK : 10,
		SUPER_KICK : 60
	},
	IGO_NUM_LIMIT : {
		ROOM_BROAD_BILL:500,
		ROOM_GUARD_SHOW_MAX:6,
		ROOM_GUARD_SHOW_FAMIILY_MAX:9,
		ROOM_KP_FLASH_WIDTH:200,
		ROOM_KP_FLASH_HEIGHT:200,
		ROOM_GUARD_FLASH_WIDTH:640,
		ROOM_GUARD_FLASH_HEIGHT:550,
		ROOM_MODEL_FLASH_WIDTH:155,
		ROOM_MODEL_FLASH_HEIGHT:380,
		ROOM_GIFT_FLASH_WIDTH:1280,
		ROOM_GIFT_FLASH_HEIGHT:760,
		ROOM_CHAT_MIN_LENGTH:1,
		ROOM_CHAT_MAX_LENGTH:50,
		ROOM_GUEST_CHAT_MAX_LENGTH:10
	},
	ROOM_USER_RESOURCE:{
		IGO_SHOW_COMMON:"jwchat",
		"IgoShowAndroid":"/images/themes/default/room/call_icon.png"
	},
	ROOM_SHOP_PRICE:{
	    ROOM_FLY:1000,
	    ROOM_BORAD:500,
	    ROOM_MIC:200,
	    ROOM_SOFA:200,
		ROOM_PIC:1000,
		ROOM_NORMAL_SINGER:500,
		ROOM_MID_SINGER:1000,
		ROOM_TOP_SINGER:1500
	},
	INTEGRAL_TASK:{
		TASK_STAY_NUMBER:5005,
		TASK_STAY_TIME:5,
		CHAT_COUNT:5,
		CHAT_COUNT_NUMBER:5001,
		CHAT_COUNT_LUNCH:10,
		CHAT_COUNT_LUNCH_MIN_TIME:13,
		CHAT_COUNT_LUNCH_MAX_TIME:18,
		CHAT_COUNT_LUNCH_NUMBER:5011,
		CHAT_COUNT_DINNER:10,
		CHAT_COUNT_DINNER_NUMBER:5012,
		CHAT_COUNT_DINNER_MIN_TIME:19,
		CHAT_COUNT_DINNER_MAX_TIME:24,
		SHARE_WB_NUMBER:5010,
		SHARE_QQ_NUMBER:5006,
		SHARE_QZ_NUMBER:5007,
		SHARE_WX_NUMBER:5008
	},
	//房间角色配置文件 1013注册用户
	ROOM_ROLE:{
		"anchor":1000,//名师
		"manager":1001,//管理员
		"member":1002,//会员
		"guest":1003,//游客
		"roomController":1004,//房间总管
		"controller":1005,//总管
		"directed":1006,//导播
		"chief":1007,//会长
		"committeeChief":1008,//常务会长
		"deputyChief":1009,//副会长
		"host":1010,//主持人
		"familyAnchor":1011,//公会名师
		"clansman":1012//会员
	},
	//房间配置文件
	ROOM_TOOLS_CONFIG : {
		"roomToolsType":"8",
		"roomToolsTag":{"roombgTag":"35","roomHideTypeId":17,"roomHideTypeName":"库存","roomIntegralTypeName":"积分"},
		"roomGiftType":2,
		"roomGiftType3D":3,
		"roomFaceType":{"typeId":12,"normalFace":"免费表情","vipFace":"VIP表情","guardFace":"守护表情"},
		"roomBadge":{"normalProductId":"110","goldenProductId":"109","rich":"rich","anchor":"anchor",
			"extremeVip":105,"normalVip":104,"diamondCard":"107","pearlCard":"106","familyBadge":1001,"loveM":"10000079"},
		"roomPubRight":{"all":1,"manager":2,"rich":3},
		"roomBg":{"bgTypeId":8,"bgTagId":35},
		"imagePath":{"normal_guard":GLOBAL_CONFIG.BASE.BASE_URL+"images/badges_g_icon.png","golden_guard":GLOBAL_CONFIG.BASE.BASE_URL+"images/badges/golden_g_icon.png"},
		PRODUCT_ID:{FLY_SCREEN:1007,BROCAST:1011,MIC:1002,SOFA:1001,CHAT_PIC:1008,NORMAL_SINGER:1010,MID_SINGER:1000565,TOP_SINAGER:1000630,SYSTEM_MAIL:1000}
	},
	//房间类型
	ROOM_TYPE : {
		ROOM_2D_TYPE:0,
		//ROOM_3D_TYPE:1,
		FAMILY_TYPE:1,
		NORMAL_TYPE:0
	},
	//房间回退使用
	IGO_ROOM_BASE : {
		PERSONAL_2D_ROOM:GLOBAL_CONFIG.BASE.BASE_URL+"rm/",
		PERSONAL_ZONE:GLOBAL_CONFIG.BASE.BASE_URL+"/zone.html?"
    }
};	

//商品配置
GLOBAL_CONFIG.PRODUCT = {
	//商品一级类别
	PRODUCT_TYPES : {
		CLOTHES:1, //服饰
		GIFT_2D:2, //2d礼物
		GIFT_3D:3, //3d礼物
		VIP_CARD:4, //会员卡
		LOVE_MANAGE:5, //爱心管理
		SAFE:6, //守护
		NORMAL_PROPS:7, //常规道具
		BACKGROUND:8, //背景
		CAR:9, //座驾
		OPERATION_COST:10, //操作消费
		BADGE:11, //徽章
		FACIAL_EXPRESSION:12, //表情
		POP_STAR:13
	},
	//商品二级类型
	PRODUCT_TAGS :{
		VIP:23, //vip
		SUPER_VIP:24, //至尊vip
		PEARL_CARD:25, //珍珠卡
		DIAMOND_CARD:26, //钻石卡
		GOLD_SAFE:28, //金守护
		SILVER_SAFE:29, //银守护
		ROOM_BG:35, //房间背景
		AR_BG:48, //AR背景
		PROP_3D:34, //3d道具
		FREE_FACE:49, //免费表情
		VIP_FACE:50, //vip表情
		SAFE_FACE:51 //守护表情
	},
	//商品id
	PRODUCT_IDS : {
		PROP1 : 114,//隐身符
		PROP2 : 111,//随意贴
		PROP3 : 112,//随意进
		PROP4 : 113//随意说
	},
	//商品使用状态
	PRODUCT_STATUS : {
		USING:1,
		NON_USE:0
	},
	//库存礼物
	STOREPRODUCT : {
		productId:1002173,
		productTypeId : 17
	}
};

//各省市身份证前两位代号
GLOBAL_CONFIG.IDAREA_CODE = {
	//省份
	PROVINCE : {
		11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古", 21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",
		33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",
		46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",
		65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"
	}
};

//常用邮箱链接地址
GLOBAL_CONFIG.EMAIL_ADDRESS = {
	'qq.com': 'http://mail.qq.com', 
	'gmail.com': 'http://mail.google.com', 
	'sina.com': 'http://mail.sina.com.cn', 
	'163.com': 'http://mail.163.com', 
	'126.com': 'http://mail.126.com', 
	'yeah.net': 'http://www.yeah.net/', 
	'sohu.com': 'http://mail.sohu.com/', 
	'tom.com': 'http://mail.tom.com/', 
	'sogou.com': 'http://mail.sogou.com/', 
	'139.com': 'http://mail.10086.cn/', 
	'hotmail.com': 'http://www.hotmail.com', 
	'live.com': 'http://login.live.com/', 
	'live.cn': 'http://login.live.cn/', 
	'live.com.cn': 'http://login.live.com.cn', 
	'189.com': 'http://webmail16.189.cn/webmail/', 
	'yahoo.com.cn': 'http://mail.cn.yahoo.com/', 
	'yahoo.cn': 'http://mail.cn.yahoo.com/', 
	'eyou.com': 'http://www.eyou.com/', 
	'21cn.com': 'http://mail.21cn.com/', 
	'188.com': 'http://www.188.com/', 
	'foxmail.coom': 'http://www.foxmail.com' 
};

//离线视频类型和审核类型
GLOBAL_CONFIG.VIDEO_TYPE = {
	//审核状态
	CTYPE:{
		NOT_ALLOW:"0",
		PASS_ALLOW:"1",
		NO_PASS_ALLOW:"2",
		ALL:""
	},
	//视频类型
	QVTYPE:{
		ANCHOR:"0",
		FUN:"1",
		OTHER:"2",
		ALL:""
	},
	SHOW_TYPE:{
		"0":"名师视频",
		"1":"音乐娱乐",
		"2":"大杂烩"
	}
};


//接口地址
GLOBAL_CONFIG.AJAX_URL = {
	chessNew:{
        //获取视频房间信息
        getRoomInfoByType_url:GLOBAL_CONFIG.BASE.BASE_URL+"room/service/client/v1/room/getRoomInfoByType",
        //获取学生列表信息
        showManagerList_url:GLOBAL_CONFIG.BASE.BASE_URL+"room/service/client/v1/manager/showManagerList",
        //获取上行地址信息
        getMcuUpUrl_url:GLOBAL_CONFIG.BASE.BASE_URL+"room/service/client/v1/room/getMcuUpUrl",
        //获取分频参数
        setMcuControlMsg:GLOBAL_CONFIG.BASE.BASE_URL+"room/service/client/v1/sysMsg/setMcuControlMsg"
	},
	datahouse: {
		//首页推荐、课堂
		queryByKey_url: GLOBAL_CONFIG.BASE.BASE_URL + "datahouse/service/client/v1/commonQuery/queryByKey",
		//精彩预告详情
		getPreviewInfo_url: GLOBAL_CONFIG.BASE.BASE_URL + "datahouse/service/client/v1/report/getPreviewInfo",
		//提交投稿信息
		submitContribution_url: GLOBAL_CONFIG.BASE.BASE_URL + "datahouse/service/client/v1/report/submitContribution",
        //查询数据
        //key: (LIVE_PREVIEW 精彩预告 精彩专题 | DIANBO_RECOMMEND 精彩预告 点播推荐 | COVER_MAN 精彩预告 封面人物 |
        // STATION_EVENTS 展赛活动 | CALLIGRAPHY_ASK 导航专栏  书法问答 | CALLIGRAPHY_CREATE 导航专栏  书法临创)
        queryByKey_url: GLOBAL_CONFIG.BASE.BASE_URL + "datahouse/service/client/v1/commonQuery/queryByKey",
        //点播推荐、封面人物
        getPreviewInfo_url: GLOBAL_CONFIG.BASE.BASE_URL + "datahouse/service/client/v1/report/getPreviewInfo",
	},
	usercenter: {
		//用户登录
		loginSingle_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/loginSingle",
		//用户自动登录验证
		checkSingle_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/checkSingle",
		//用户注册
		regist_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/regist",
		//修改密码
		editPassword_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/editPassword",
		//修改用户头像
		editUserImage_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/editUserImage",
		//编辑手机信息
		editUserPhone_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/editUserPhone",
		//发送手机验证码
		createPhoneCode_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/createPhoneCode",
		//修改用户昵称
		editUserNickName_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/editUserNickName",
		//QQ账号登录
		loginSingleOpenQQ_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/loginSingleOpenQQ",
		//新浪账号登陆
		loginSingleOpenSina_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/loginSingleOpenSina",
		//微信登录
		loginSingleWeixin_url : GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/loginSingleWeixin",
		//查询用户基础信息
		findUserBaseInfoByGlobalId_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/findUserBaseInfoByGlobalId",
		//退出登录
		logout_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/logout",
		//编辑用户邮箱
		editUserMail_url:GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/editUserMail",
		//验证用户邮箱
		checkEMail_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/checkEMail",
		//检查用户名是否已注册
		checkUserName_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/checkUserName",
		//通过邮箱重置用户密码
		resetPassword_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/resetPassword",
		//获取用户物理信息
		getUserPhysicalinfo_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/getUserPhysicalinfo",
		//通过昵称获取用户信息
		getUserByUserNickname_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/getUserByUserNickname",
		//通过账号名发送手机验证码
		createPhoneCodeByUserName_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/createPhoneCodeByUserName",
		//通过手机修改密码
		editPasswordByPhone_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/editPasswordByPhone",
		//通过邮箱找回用户密码
		findPassword_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/findPassword",
		//通过手机号码找回用户信息
		checkUserByPhoneCode_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/checkUserByPhoneCode",
		//微信账号登录
		loginSingleWeixin_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/loginSingleWeixin",
		//检查用户是否第三方用户
		checkExtUser_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/checkExtUser",
		//获取用户徽章列表
		pageUserBadge_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/badge/pageUserBadge",
		//老师昵称搜索
		getRoomInfoByTeacher_url: GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/getRoomInfoByTeacher",
		//更新用户信息
		fillUserMsg_url : GLOBAL_CONFIG.BASE.BASE_URL + "usercenter/service/client/v1/user/fillUserMsg"
	},
	integral:{
		//发红包接口
		sendRedPackets_url: GLOBAL_CONFIG.BASE.BASE_URL + "integral/service/client/v1/activity/sendRedPackets",
		//抢红包接口
		receiveRedPackets_url: GLOBAL_CONFIG.BASE.BASE_URL + "integral/service/client/v1/activity/receiveRedPackets",
		//查看红包详情接口
		getReceivedRedList_url: GLOBAL_CONFIG.BASE.BASE_URL + "integral/service/client/v1/activity/getReceivedRedList",
		//查看房间可抢红包列表接口
		getWaitReceiveRedList_url: GLOBAL_CONFIG.BASE.BASE_URL + "integral/service/client/v1/activity/getWaitReceiveRedList",
		//发起拍卖接口
		createAuction_url: GLOBAL_CONFIG.BASE.BASE_URL + "integral/service/client/v1/activity/createAuction",
		//查看正在进行中的拍卖信息接口
		getAuctionInfo_url: GLOBAL_CONFIG.BASE.BASE_URL + "integral/service/client/v1/activity/getAuctionInfo",
		//获取拍卖竞价列表接口
		getOfferPrice_url: GLOBAL_CONFIG.BASE.BASE_URL + "integral/service/client/v1/activity/getOfferPrice",
		//结算拍卖接口
		finishAuction_url: GLOBAL_CONFIG.BASE.BASE_URL + "integral/service/client/v1/activity/finishAuction"
	},
	vms:{
		//视频初始化接口
		initVideo_url: GLOBAL_CONFIG.BASE.BASE_URL + "vms/service/client/v1/video/initVideo"
	},
	accounting:{
		//银联在线支付
		payOnLive_url: GLOBAL_CONFIG.BASE.BASE_URL + "accounting/service/client/v1/pay/payOnLive",
		//查看用户充值记录
		pagePayRecord_url: GLOBAL_CONFIG.BASE.BASE_URL + "accounting/service/client/v1/pay/pagePayRecord",
		//兑换人民币申请
		coins2Rmb_url: GLOBAL_CONFIG.BASE.BASE_URL + "accounting/service/client/v1/exchange/coins2Rmb",
		//查看兑换人民币申请
		queryExchangeRmb_url: GLOBAL_CONFIG.BASE.BASE_URL + "accounting/service/client/v1/exchange/queryExchangeRmb",
		//查看礼物收益
		pageGiftIncome_url: GLOBAL_CONFIG.BASE.BASE_URL + "accounting/service/client/v1/report/pageGiftIncome",
		//查看课程收益
		pageLessonIncome_url: GLOBAL_CONFIG.BASE.BASE_URL + "accounting/service/client/v1/report/pageLessonIncome",
		//购买课程，双方升等级
		buyLesson_url: GLOBAL_CONFIG.BASE.BASE_URL + "accounting/service/client/v1/lesson/buyLesson",
		//学生查看购买课程的记录
		pageLessonOrder_url: GLOBAL_CONFIG.BASE.BASE_URL + "accounting/service/client/v1/lesson/pageLessonOrder",
		//取消订单
		cancelOrder_url : GLOBAL_CONFIG.BASE.BASE_URL + "accounting/service/client/v1/lesson/cancelOrder",
		//删除订单
		deleteOrder_url : GLOBAL_CONFIG.BASE.BASE_URL + "accounting/service/client/v1/lesson/deleteOrder",
		//注册时用户账户初始化
		initUserAsset_url: GLOBAL_CONFIG.BASE.BASE_URL + "accounting/service/session/v1/account/initUserAsset"
	},
	pws:{
		//获取名师介绍详情
		getTeacherInfo_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/getTeacherInfo",
		//保存名师介绍详情
		saveTeacherInfo_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/saveTeacherInfo",
		//获取老师的艺术活动列表
		getArtActivityList_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/getArtActivityList",
		//根据艺术活动ID获取艺术活动详情
		getArtActivityById_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/getArtActivityById",
		//添加老师艺术活动详情
		addArtActivity_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/addArtActivity",
		//编辑老师艺术活动详情
		updateArtActivity_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/updateArtActivity",
		//删除老师艺术活动详情
		delArtActivity_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/delArtActivity",
		//获取老师的学术研究列表	
		getAcademicResearchList_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/getAcademicResearchList",
		//根据学术研究ID获取学术研究详情
		getAcademicResearchById_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/getAcademicResearchById",
		//添加老师学术研究详情
		addAcademicResearch_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/addAcademicResearch",
		//编辑老师学术研究详情
		updateAcademicResearch_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/updateAcademicResearch",
		//删除老师学术研究详情
		delAcademicResearch_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/delAcademicResearch",
		//获取老师的代表作品列表
		getRepresentativeList_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/getRepresentativeList",
		//根据代表作品ID获取代表作品详情
		getRepresentativeById_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/getRepresentativeById",
		//添加老师的代表作品详情
		addRepresentative_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/addRepresentative",
		//编辑老师的代表作品详情
		updateRepresentative_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/updateRepresentative",
		//删除老师的代表作品详情
		delRepresentative_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/delRepresentative",
		//根据类型获取老师的公示公告列表
		getPublicInfoList_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/getPublicInfoList",
		//根据公告ID获取公示公告详情
		getPublicInfoById_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/getPublicInfoById",
		//添加老师的公示公告详情
		addPublicInfo_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/addPublicInfo",
		//编辑老师的公示公告详情
		updatePublicInfo_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/updatePublicInfo",
		//删除老师的公示公告详情
		delPublicInfo_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/teacher/delPublicInfo",
		//根据课程ID获取课件列表
		getCoursewareInfoList_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/course/getCoursewareInfoList",
		//添加课件详情
		addCoursewareInfo_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/course/addCoursewareInfo",
		//编辑课件详情
		updateCoursewareInfo_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/course/updateCoursewareInfo",
		//删除课件详情
		delCoursewareInfo_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/course/delCoursewareInfo",
		//根据课件ID获取课件详情
		getCoursewareInfoById_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/course/getCoursewareInfoById",
		//审核课件
		aduitCoursewareInfoById_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/course/aduitCoursewareInfoById",
		//校验是否关注
		checkFansShip_url : GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/fans/checkFansShip",
		//关注
		fansByShip_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/fans/fansByShip",
		//取消关注
		cancelFansByShip_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/fans/cancelFansByShip",
		//我的关注
		getFansShipList_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/fans/getFansList",
		//学习记录
		learnRecord_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/course/learnRecord",
		//根据Id删除学习历史记录
		deleteLearnRecordById_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/course/deleteLearnRecordById",
		//根据日期删除学习历史记录
		deleteLearnRecordByDate_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/course/deleteLearnRecordByDate",
		//校验是否收藏
		checkKeepCourse_url :  GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/fans/checkKeepCourse",
		//收藏
		keepCourse_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/fans/keepCourse",
		//取消收藏
		cancelKeepCourse_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/fans/cancelKeepCourse",
		//我的收藏
		getKeepCourseList_url: GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/fans/getKeepCourseList",
		//获取收藏的数量
		getKeepCourseCount_url : GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/fans/getKeepCourseCount",
		//获取关注的数量
		getFansCount_url : GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/fans/getFansCount",
		//学习历史
		getLearnRecordList_url : GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/course/getLearnRecordList",
		//获取课程浏览次数(根据 课程 ID)
		getLearnCount_url : GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/server/v1/course/getLearnCount",
		//获取课程浏览次数(根据 课件 ID)
		getLearnCountByCoursewareId_url : GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/server/v1/course/getLearnCountByCoursewareId",
		//发表评论
		saveCourseComment_url : GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/course/saveCourseComment",
		//获取课程评论，带分页
		getCourseCommentPage_url : GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/course/getCourseCommentPage",
		//删除评论
		deleteComment_url : GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/course/deleteComment",
		//获取未关联课程的视频信息
		getCoursewareInfoListNoCourse_url : GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/course/getCoursewareInfoListNoCourse",
		//获取用户视频使用空间大小
		getCoursewareVedioSize_url : GLOBAL_CONFIG.BASE.BASE_URL + "pws/service/client/v1/course/getCoursewareVedioSize",
		//根据id获取开谈详情
		getTalkingById_url: "pws/service/client/v1/talking/getTalkingById"
	},
	room:{
		//教师入驻，申请房间
		applyRoom_url: GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/room/applyRoom",
		//进入房间,初始化房间
		initRoom_url: GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/room/initRoom",
		//获取主播开播上行地址
		getAnchorUpUrl_url : GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/room/getUpUrl",
		//消息断线重联
		getMsgConfig_url :GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/room/getMsgUrl",
		//离开房间
		leaveRoom_url: GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/room/leaveRoom",
		//获取房间麦状态
		getMicState_url: GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/room/getMicState",
		//上传心跳
		updateHeartBeat_url: GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/heartbeat/updateHeartBeat",
		//主播开播
		beginBo_url: GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/room/beginBo",
		//主播停播
		endBo_url: GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/room/endBo",
		//用户送礼物
		sendGift_url: GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/action/sendGift",
		//用户图片聊天
		sendPicture_url: GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/action/sendPicture",
		//申请成为管理员
		applyManager_url: GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/manager/applyManager",
		//批准/拒绝成为房管
		dealApplication_url: GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/manager/dealApplication",
		//用户提升为管理/撤销用户管理
		promoteOrFireManager_url: GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/manager/promoteOrFireManager",
		//查看房间观众和管理
		showAudienceAndManagerList_url: GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/manager/showAudienceAndManagerList",
		//查询房间观众列表
		showAudienceList_url : GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/manager/showAudienceList",
		//查询房间管理列表
		showManagerList_url : GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/manager/showManagerList",
		//提升或者撤销管理
		promoteOrFireManager_url : GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/manager/promoteOrFireManager",
		//添加管理
		addOrDelManager_url : GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/manager/addOrDelManager",
		//踢出房间
		kickOutRoom_url : GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/room/kickOutRoom",
		//获取用户拥有的房间
		getUsersRoom_url: GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/userRoom/getUserRoom",
		//设置房间
		setUsersRoom_url: GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/userRoom/setUsersRoom",
		//查询系统通知/系统公告
		pageSysNotice_url: GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/sysMsg/pageSysMsg",
		//删除系统消息 -- 可批量
		delSysMsg_url: GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/sysMsg/delSysMsg",
		//房间号模糊查询
		queryRoom_url: GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/report/queryRoom",
		//统计消息数量
		countUnReadMsg_url : GLOBAL_CONFIG.BASE.BASE_URL + "room/service/client/v1/sysMsg/countUnReadMsg"
	},
	shop:{
		//前端页面礼物列表
		productList_url: GLOBAL_CONFIG.BASE.BASE_URL + "shop/service/client/v1/product/productList",
		//根据课程ID获取课程的定价和基础信息
		getCourseInfoById_url: GLOBAL_CONFIG.BASE.BASE_URL + "shop/service/client/v1/course/getCourseInfoById",
		//根据老师GID获取课程的定价和基础信息
		getCourseInfoByUserId_url: GLOBAL_CONFIG.BASE.BASE_URL + "shop/service/client/v1/course/getCourseInfoByUserId",
		//根据用户信息获取课程列表
		getCourseInfoByUser_url : GLOBAL_CONFIG.BASE.BASE_URL + "shop/service/client/v1/course/getCourseInfoByUser",
		//根据商品ID获取商品信息
		POSTProductById_url: GLOBAL_CONFIG.BASE.BASE_URL + "shop/service/client/v1/product/POSTProductById",
		//课程信息 添加
		addCourse_url: GLOBAL_CONFIG.BASE.BASE_URL + "shop/service/client/v1/course/addCourse",
		//课程信息 修改
		updateCourse_url: GLOBAL_CONFIG.BASE.BASE_URL + "shop/service/client/v1/course/updateCourse",
		//课程信息 删除
		deleteCourse_url: GLOBAL_CONFIG.BASE.BASE_URL + "shop/service/client/v1/course/deleteCourse",
		//首页 名师课程推荐列表
		courseListByIndexPage_url: GLOBAL_CONFIG.BASE.BASE_URL + "shop/service/client/v1/course/courseListByIndexPage",
		//直播页 学习课堂列表
		courseListByLivePage_url: GLOBAL_CONFIG.BASE.BASE_URL + "shop/service/client/v1/course/courseListByLivePage",
		//课程名称搜索
		getRoomInfoByCourseTitle_url: GLOBAL_CONFIG.BASE.BASE_URL + "shop/service/client/v1/course/getRoomInfoByCourseTitle",
		//赠送记录
		sendGiftRecord_url: GLOBAL_CONFIG.BASE.BASE_URL + "shop/service/client/v1/product/sendGiftRecord",
		//校验用户是否购买课程
		checkUserCourse_url: GLOBAL_CONFIG.BASE.BASE_URL + "shop/service/server/v1/product/checkUserCourse"
	}

};/*end of AJAX_URL*/

//表情
GLOBAL_CONFIG.face = {
	"[狂笑]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/0-kuangxiao.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/0-kuangxiao.png"
	},
	"[大笑]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/1-daxiao.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/1-daxiao.png"
	},
	"[惊讶]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/2-jingya.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/2-jingya.png"
	},
	"[害羞]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/3-haixiu.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/3-haixiu.png"
	},
	"[窃笑]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/4-qiexiao.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/4-qiexiao.png"
	},
	"[发怒]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/5-fanu.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/5-fanu.png"
	},
	"[大哭]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/6-daku.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/6-daku.png"
	},
	"[色色]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/7-sese.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/7-sese.png"
	},
	"[坏笑]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/8-huaixiao.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/8-huaixiao.png"
	},
	"[火大]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/9-huoda.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/9-huoda.png"
	},
	"[汗]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/10-han.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/10-han.png"
	},
	"[奸笑]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/11-jianxiao.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/11-jianxiao.png"
	},
	"[欢迎]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/12-huanying.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/12-huanying.png"
	},
	"[再见]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/13-zaijian.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/13-zaijian.png"
	},
	"[白眼]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/14-baiyan.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/14-baiyan.png"
	},
	"[抠鼻]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/15-koubi.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/15-koubi.png"
	},
	"[顶]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/16-ding.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/16-ding.png"
	},
	"[胜利]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/17-shenli.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/17-shenli.png"
	},
	"[OK]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/18-ok.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/18-ok.png"
	},
	"[抱拳]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/19-baoquan.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/19-baoquan.png"
	},
	"[囧]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/20-jiong.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/20-jiong.png"
	},
	"[淡定]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/21-danding.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/21-danding.png"
	},
	"[美女]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/22-meinv.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/22-meinv.png"
	},
	"[靓仔]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/23-liangzai.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/23-liangzai.png"
	},
	"[神马]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/24-shenma.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/24-shenma.png"
	},
	"[开心]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/25-kaixin.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/25-kaixin.png"
	},
	"[给力]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/26-geili.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/26-geili.png"
	},
	"[飞吻]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/27-feiwen.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/27-feiwen.png"
	},
	"[眨眼]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/28-zhayan.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/28-zhayan.png"
	},
	"[V5]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/29-V5.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/29-V5.png"
	},
	"[来吧]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/30-laiba.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/30-laiba.png"
	},
	"[围观]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/31-weiguan.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/31-weiguan.png"
	},
	"[飘过]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/32-piaoguo.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/32-piaoguo.png"
	},
	"[地雷]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/33-dilei.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/33-dilei.png"
	},
	"[菜刀]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/34-caidao.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/34-caidao.png"
	},
	"[帅]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/35-shuai.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/35-shuai.png"
	},
	"[审视]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/36-shenshi.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/36-shenshi.png"
	},
	"[无语]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/37-wuyu.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/37-wuyu.png"
	},
	"[无奈]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/38-wulan.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/38-wulan.png"
	},
	"[亲亲]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/39-qinqin.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/39-qinqin.png"
	},
	"[勾引]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/40-gouyin.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/40-gouyin.png"
	},
	"[后后]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/41-houhou.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/41-houhou.png"
	},
	"[吐血]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/42-tuxie.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/42-tuxie.png"
	},
	"[媚眼]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/43-meiyan.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/43-meiyan.png"
	},
	"[愁人]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/44-chouren.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/44-chouren.png"
	},
	"[肿么了]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/45-zhongmele.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/45-zhongmele.png"
	},
	"[调戏]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/46-tiaoxi.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/46-tiaoxi.png"
	},
	"[抽]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/47-chou.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/47-chou.png"
	},
	"[哼哼]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/48-hengheng.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/48-hengheng.png"
	},
	"[鄙视]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/49-bs.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/49-bs.png"
	},
	"[鸡冻]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/50-jidong.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/50-jidong.png"
	},
	"[眼馋]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/51-yanchan.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/51-yanchan.png"
	},
	"[热汗]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/52-rehan.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/52-rehan.png"
	},
	"[输]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/53-shu.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/53-shu.png"
	},
	"[石化]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/54-shihua.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/54-shihua.png"
	},
	"[蔑视]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/55-mieshi.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/55-mieshi.png"
	},
	"[哭]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/56-ku.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/56-ku.png"
	},
	"[骂]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/57-ma.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/57-ma.png"
	},
	"[狂哭]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/58-kuangku.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/58-kuangku.png"
	},
	"[狂汗]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/59-kuanghan.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/59-kuanghan.png"
	},
	"[笑哭]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/60-xiaoku.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/60-xiaoku.png"
	},
	"[狗狗]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/61-gougou.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/61-gougou.png"
	},
	"[喵喵]": {
		"small": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/62-miaomiao.gif",
		"big": GLOBAL_CONFIG.BASE.BASE_URL + "images/pm/face/62-miaomiao.png"
	}
};/*end of face*/

GLOBAL_CONFIG.tips = {
		T1:"密码重置邮件已发送到您的安全邮箱，请注意查收",
		T2:"请输入用户名！",
		T3:"请输入有效的E_mail！",
		T4:"请输入有效的手机号！",
		T5:"正在处理，请稍后操作!",
		T6:"密码修改成功，请您使用新密码重新登录!",
		T7:"修改成功!",
		T8:"验证邮件已发送到您的邮箱，请注意查收!",
		T9:"手机绑定成功！",
		T0:"秒后重试",
		T1001:"请输入数量或者输入值不合法！",
		T1002:"您的趣币数量不够，请充值！",
		T1003:"需要管理员权限才可进行此操作！",
		T1004:"需要拥有财富等级才可进行此操作！",
		T1005:"您没有私聊的权限！",
		T1006:"您没有公聊消息的权限！",
		T1007:"不带'富'的普通玩家每次发言限10个字!",
		T1008:"初始化房间失败！",
		T1009:"贵宾席数量小于现有数量或趣币数量不够！",
		T1010:"趣币数量不够或输入值不合法！",
		T1011:"请输入您要添加的歌曲名称！",
		T1012:"添加歌曲成功！",
		T1013:"删除歌曲成功！",
		T1014:"删除歌曲失败！",
		T1015:"编辑歌曲成功！",
		T1016:"编辑歌曲失败！",
		T1017:"恭喜您，购买商品成功!！",
		T1018:"输入为空或趣币数量不够！",
		T1019:"设置成功！",
		T1020:"设置失败！",
		T1021:"房间未开播，请稍后再点歌！",
		T1022:"点歌成功,等待名师处理中!",
		T1023:"每次发言内容限(1-50)字以内!",
		T1024:"下麦成功！",
		T1025:"房间背景图片加载失败，请稍后重试！",
		T1026:"请求服务超时，请稍后重试!",
		T1027:"申请成功！",
		T1028:"视频初始化失败,请刷新重试！",
		T1029:"视频初始化登录成功！",
		T1030:"视频退出成功！",
		T1031:"视频退出失败！",
		T1032:"你已退出房间，确定返回首页!",
		T1034:"视频开播成功!",
		T1035:"视频开播失败!",
		T1036:"操作成功!",
		T1037:"视频连接异常，请刷新重试！",
		T1038:"爱歌助手启动成功！",
		T1041:"结束直播成功！",
		T1042:"房间公聊区公告设置失败！",
		T1043:"房间私聊区公告设置失败！",
		T1044:"您已被管理员踢出房间十分钟！",
		T1045:"密信内容为空或超过规定字符数！",
		T1046:"回复密信成功！",
		T1047:"发送密信成功！",
		T1048:"无此昵称用户存在，请确认发送对象的昵称是否有误！",
		T1049:"删除成功！",
		T1050:"房间公聊区公告设置成功！",
		T1051:"房间私聊区公告设置成功！",
		T1052:"输入内容限(1-50)字!",
		T1053:"房间人数已达上限！",
		T1057:"批准名师上麦成功！",
		T1058:"批准主持上麦成功！",
		T1059:"上传海报成功！",
		T1060:"请输入有效的用户昵称！",
		T1061:"添加好友请求已发送成功！",
		T1062:"想添加您为好友",
		T1063:"请选择符合规范大小以内的文件!",
		T1064:"不允许添加完全重复的数据！",
		T1065:"不允许添加自己为好友！",
		T1067:"请选择要上传的海报范围!",
		T1068:"神秘人进入房间！",
		T1069:"设置房间广播成功！",
		T1070:"TA还没有签名",
		T1071:"该用户已被贴条，要贴早动手啊!",
		T1072:"用户领取任务奖励成功！",
		T1073:"请选择要送出的礼物！",
		T1074:"礼物赠送成功!",
		T1075:"已拒绝礼物赠送!",
		T1076:"输入值不合法!",
		T1077:"关闭房间成功!",
		T1078:"麦序用户余额不足,不能执行此操作!",
		T1079:"检测书法报视频助手异常,请刷新重试!",
		T1080:"flash player插件异常,请刷新重试!",
		T1081:"204 ： 暂无数据返回!",
		T1082:"数据提交成功!",
		T1083:"你的账号已进入其他房间,你将被退出本房间！",
		T1084:"你的趣币数量不足或消费金额超过限制值！",
		T1085:"初始化MTS信息失败!",
		T1086:"点歌用户余 额不足!",
		T1087:"书法报视频助手不允许同时开播2个以上(含2个)房间,请关闭其他房间再开播!",
		T1088:"与视频服务连接网络异常,请刷新重试!",
		T1089:"聊天系统账号掉线或你的账号已进入其他房间,你将被退出本房间！",
		T1090:"聊天请求服务超时，需要刷新重新连接，确定刷新！",
		T1091:"书法报视频助手正在升级中,请更新完毕后再开播!",
		T1092:"助手连接关闭,你已退出助手！",
		T1093:"上传视频文件成功!",
		T1094:"请上传视频文件和输入文件名!",
		T1095:"视频文件提交成功,审核通过后可使用!",
		T1096:"视频文件提交失败,请重新提交!",
		T1097:"视频文件删除成功!",
		T1098:"视频文件删除失败,请重新删除!",
		T1099:"请输入文件名!",
		T1100:"编辑视频成功!",
		T1101:"编辑视频失败,请重新编辑!",
		T1102:"上传视频海报文件成功!",
		T1103:"复制成功!",
		T1104:"上传视频文件超过规定数,删除原有视频后再上传!",
		T1105:" 书法报视频 美女视频 美女直播 聊天室 视频聊天 视频交友",
		T1106:"请指定操作用户!",
		T1107:"摄像头已经关闭!",
		T1108:"已经打开此房间!",
		T1109:"确定要使用超级踢,踢出用户 ",
		T1110:"请选择签到日期!",
		T1111:"游客宝宝注册一下就可以与名师互动聊天了。",
		T1112:"喜欢名师就点关注吧！",
		T1113:"喜欢名师就给TA刷礼物哦！",
		T1114:"名师很寂寞，快来跟名师聊天吧！",
		T1115:"需财富等级1级以上才可以发口令红包!",
		T1116:"红包口令只允许输入3-8个汉字!",
		T1117:"红包数不得少于10个且趣币总数不得少于500。",
		T1118:"关注名师才可以抢红包!",
		T1119:"红包发送成功!",
		T1120:"购买成功!",
		T1121:"已经拥有房间!",
		T01:"暂无数据",
		T02:"系统繁忙，请稍后再试",
		T03:"请输入内容",
		T04:"您的登录账号为：<a href='/zone.html?{gid}' style='color:#ff00ff'>{name}</a>",
		T2001:"没有守护的对象，请查看守护的购买流程！",
		T2002:"恭喜您，成为护花使者！",
		T2003:"成功申请房间升级后，次月开始执行！",
		T2004:"您已开通了房间，如需开通其他类型房间，请重新申请账号！",
		T2005:"请选择您要删除的好友！",
		T2006:"删除好友成功！",
		T2007:"请选择您要列入黑名单的好友！",
		T2008:"您选择的好友已加入黑名单！",
		T2009:"房间申请已提交系统审核，请静候佳音！",
		T2010:"导播申请已提交系统审核，请静候佳音！",
		T2011:"礼包领取成功！",
		T2012:"购买成功！",
		T2013:"赠送成功！",
		T2014:"索要消息发送成功，请静候佳音！",
		T2015:"购买成功，可以去【我的道具】中使用座驾！",
		T2016:"该用户不存在，请确认输入的昵称是否正确！",
		T2017:"请输入您要赠送商品的用户昵称！",
		T2018:"请输入您索要商品的用户昵称！",
		T2019:"您的账户余额不足，请及时充值！<a target='_blank' href='/usercenter.html#paycenter' style='color:#ff00ff'>立即充值</a>",
		T2020:"删除黑名单成功!",
		T2021:"请选择一位好友列入黑名单！",
		T2022:"对不起，您还没有相关数据！",
		T2023:"您已经购买了至尊VIP，确定要购买VIP会员卡吗？",
		T2024:"操作成功！",
		T2025:"您要守护的用户没有房间，无法守护TA！",
		T2026:"请确认阅读且同意房间申请协议！",
		T2027:"您输入的公会名称已被使用，请重新输入！",
		T2028:"您输入的公会勋章名称已被使用，请重新输入！",
		T2029:"您确定要购买吗？",
		T2030:"您确定要赠送吗？",
		T2031:"您确定要将该成员踢出公会吗？",
		M01:"请等老师接受请求之后再点击！",
		M02:"请耐心等待几秒哦~",
		sas:"商城服务：",
		family:"公会管理服务：",
		datahouse:"数据仓库服务：",
		accounting:"记账服务：",
		pm:"产品管理服务：",
		idserver:"ID服务：",
		room:"房间管理服务：",
		session:"会话服务：:",
		uploads:"上传下载服务：",
		usercenter:"用户中心服务：",
		weibo:"个人空间服务：",
		director:"导播服务：",
		request:"服务请求：",
		integral:"任务系统：",
		ps:"推广系统：",
		ROOM_SEND_MSG_CODE:{
			"-1":"你的消息发送过于频繁,请休息一下再发送!",
			"-2":"你的消息发送过于频繁,请休息一下再发送!",
			"-3":"发送对象为null!"
		},
		SYS_CONTENT_ARRAY:["游客宝宝注册一下就可以与名师互动聊天了。",
	                       "喜欢名师就点关注吧！",
	                       "喜欢名师就给TA刷礼物哦！",
	                       "名师很寂寞，快来跟名师聊天吧！",
	                       "想给名师一个惊喜吗？开守护吧！",
	                       "送幸运礼物，最高可以中4000倍大奖哦！试试手气吧！",
	                       "幸运大转盘，大奖领不停！点击右侧“转盘”，赶紧领奖哦！中奖的礼物放在库存中，可以送给名师哦！",
	                       "新土豪首充有大礼，巨献等您来拿！充5000元，返50000趣币哦！",
	                       "老土豪猴年充值乐翻天！充5000元，返40000趣币哦！",
	                       "签到有惊喜，全勤有大奖！专属礼物“金玫瑰”，等您来领！",
	                       "每日任务，每日精彩！轻松做任务，轻松赚趣币！ 祝您的每一天都那么精彩！",
	                       "新手任务，丰富多彩！验证手机，就有大奖！现在就来开始您的书法报视频愉快之旅吧！"
	                       ]	
};/*end of tips*/

	return { config : GLOBAL_CONFIG};
});