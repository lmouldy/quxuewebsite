/***********************************igo类***************************************************************/
//用户类
function UserInfo(obj)
{
    this.opt = obj.opt;
    this.richNextNum = obj.richNextNum;
	this.zhuboNextNum = obj.zhuboNextNum;
	this.optName = obj.optName;
	this.flag = obj.flag;
	this.userImageurl = obj.userImageurl;
	this.roleId = obj.roleId;
	this.configNum = obj.configNum;
	this.roomGlobalId = obj.roomGlobalId;
	this.revDou = obj.revDou;
	this.assetBill = obj.assetBill;
	this.member = obj.member;
	this.assetDou = obj.assetDou;
	this.globalId = obj.globalId;
	this.userName = obj.userName;
	this.userId = obj.userId;
	this.modelUrl;
	this.userNickname = obj.userNickname;
	this.richLevel = 0;
	this.richNextNum = obj.richNextNum;
	this.zhuboNextNum = obj.zhuboNextNum;
	this.revDou = obj.revDou;
	if("undefined" == typeof obj.micOrder)
	{
		obj.micOrder = 0;
	}
	this.micOrder = parseInt(obj.micOrder);
	this.badgeArray = {};
	this.badgeArray = obj.badge;
	this.isGuest = 0;
	this.ban = obj.ban;
	this.director = "0";
	if("undefined" != typeof obj.director){
		this.director = obj.director;
	}
	this.popularity = "0";
	if("undefined" != typeof obj.popularity){
		this.popularity = obj.popularity;
	}
	this.giftBan = 0;
	if("undefined" != typeof obj.giftBan){
		this.giftBan = obj.giftBan;
	}
}
/**
 * 用户徽章
 */
UserInfo.prototype.getUserBadgeObject = function(){
	var badgeArr = new Array();
	var badge =this.badgeArray;
	for(var i in badge){
		if(badge[i].badgeAid != ROOM_TOOLS_CONFIG.roomBadge.anchor)
		{
			var obj = {
					badgeLevel:badge[i].badgeLevel,
					badgeAid:badge[i].badgeAid,
					badgeImage:badge[i].badgeImage,
					badgeName:badge[i].badgeName,
					badgeId:badge[i].badgeId,
					badgeTitle:badge[i].badgeTitle,
					badgeTypeId:badge[i].badgeTypeId,
					badgeDesc:badge[i].badgeDesc,
					badgeCode:badge[i].badgeCode
			};
			badgeArr.push(obj);
		}
	}
	return badgeArr;
};

//主播类
function AnthorUserInfo(obj)
{
	this.userImageurl = obj.userImageurl;
	this.globalId = obj.globalId;
	this.revDou = obj.revDou;
	this.revRed = obj.revRed;
	this.userNickname = obj.userNickname;
	this.assetBill = obj.assetBill;
	this.assetDou = obj.assetDou;
	this.userName = obj.userName;
	this.userId = obj.userId;
	this.zhuboNextNum = obj.zhuboNextNum;
	this.richNextNum = obj.richNextNum;
	this.userSex = "女";
	this.anchorBadgeLevel = 0;
	if(obj.badgeImage){
		this.anchorBadgeImage = obj.badgeImage;
	}
	if(obj.growNum){
		this.anchorGrowNum = obj.growNum;
	}
	
	if("undefined" != typeof obj.userSex)
	{
		this.userSex = obj.userSex;
	}
	this.badgeArray = new Array();
	if(typeof obj.badge != "undefined" && obj.badge.length > 0)
	{
		for(b in obj.badge)
		{
			this.badgeArray.push(new BadgeInfoClass(obj.badge[b]));
			if(ROOM_TOOLS_CONFIG.roomBadge.anchor == obj.badge[b].badgeAid)
			{
				this.anchorBadgeLevel = obj.badge[b].badgeLevel;
				break;
			}
		}
		
	}
	this.virtualState = 0;
	if("undefined" != typeof obj.virtualState){
		this.virtualState = obj.virtualState;
	}
	this.hifiState = 0;
	if("undefined" != typeof obj.hifiState){
		this.hifiState = obj.hifiState;
	}
	this.zhuboFlag = 0;
	if("undefined" != typeof obj.zhuboFlag){
		this.zhuboFlag = obj.zhuboFlag;
	}
}

//徽章信息
function BadgeInfoClass(obj)
{
	this.badgeTypeId = obj.badgeTypeId;
	this.badgeImage = obj.badgeImage;
	this.badgeLevel = obj.badgeLevel;
	this.badgeAid = obj.badgeAid;
	this.badgeTitle = obj.badgeTitle;
	this.badgeName = obj.badgeName;
	this.badgeId = obj.badgeId;
	this.badgeCode = obj.badgeCode;
	this.badgeDesc = obj.badgeDesc;
}
//房间初始化消息体，房间信息
function InitRoomInfo(obj)
{
	this.familyType = obj.familyType;
	this.userCity = "火星";
	if("undefined" != typeof  obj.userCity)
	{
		this.userCity = obj.userCity;
	}
	if("undefined" == typeof obj.liveState)
	{
		obj.liveState =0;
	}
	this.liveState = obj.liveState;
	this.roomImage = obj.roomBg;
	this.roomPoster = obj.roomImage;
	this.liveTime = obj.liveTime;
	this.effectsType = obj.effectsType;
	this.roomId = obj.roomId;
	this.roomGlobalId = obj.roomGlobalId;
	this.roomCount = obj.roomCount;
	this.roomNum = obj.roomNum;
	this.roomPriBbs = obj.roomPriBbs;
	this.roomPriBbsHref = obj.roomPriBbsHref;
	this.roomPubBbs = obj.roomPubBbs;
	this.roomPubBbsHref = obj.roomPubBbsHref;
	if("undefined" == typeof obj.roomPubRight)
	{
		obj.roomPubRight = 1;
	}
	this.roomPubRight = obj.roomPubRight;
	this.roomActivity = 0;
	if("undefined" != typeof obj.roomActivity){
		this.roomActivity = obj.roomActivity;
	}
	this.roomReal = 0;
	if("undefined" != typeof obj.roomReal){
		this.roomReal = obj.roomReal;
	}
	this.roomPrice = 0;
	if("undefined" != typeof obj.roomPrice){
		this.roomPrice =  obj.roomPrice;
	}
	this.roomType = 0;
	if("undefined" != typeof obj.roomType){
		this.roomType =  obj.roomType;
	}
}

//用户红包类
function UserRedBagInfo(obj)
{
	this.revRed = obj.revRed;
	this.redNum = obj.redNum;
	this.sendRed = obj.sendRed;
	this.lastDateTime = obj.lastDateTime;
}

//房间消息类
function RoomCSMessage(obj)
{
	this.opt = obj.opt;
	this.optName = obj.optName;
	this.optImage = obj.optImage;
	this.optOn = obj.optOn;
	this.optOnName = obj.optOnName;
	this.optOnImage = obj.optOnImage;
	this.content = "";
	if(obj.content){
		this.content = obj.content;
	}else if(typeof obj.chatMsg != "undefined"){
		this.content = obj.chatMsg;
	}
	this.flag = obj.flag;
	this.giftName = obj.giftName;
	this.giftNum = obj.giftNum;
	this.productId = obj.productId;

	this.create_time = obj.create_time;
	this.optBadge = {};
	this.optOnBadge = {};
	this.optBadge = obj.optBadge;
	this.optOnBadge = obj.optOnBadge;

}
//房间消费榜单类
function RoomConsumptionList(obj)
{
	this.totalNum = obj.totalNum||obj.totalCost;
	this.userImageurl = obj.userImageurl;
	this.userName = obj.userName;
	this.globalId = obj.globalId;
	this.userNickname = obj.userNickname;
	this.stealth=obj.stealth;
	this.badgeArray = new Array();
	this.richBadgeUrl = "";
	var userbadge = obj.userbadge||obj.badge;
	if(typeof userbadge != "undefined" && userbadge.length > 0)
	{
		for(b in userbadge)
		{
			this.badgeArray.push(new BadgeInfoClass(userbadge[b]));
			if(ROOM_TOOLS_CONFIG.roomBadge.rich == userbadge[b].badgeAid)
			{
				this.richBadgeUrl = userbadge[b].badgeImage;
			}
		}
	}
}
//商品信息类
function ProductInfo(obj)
{
	 this.ver = obj.ver;
	 this.updateTime = obj.updateTime;
	 this.totalNum = obj.totalNum;
	 this.swfImage = obj.swfImage;
	 this.subtag = obj.subtag;
	 this.realNum = obj.realNum;
	 this.hotvalue = obj.hotvalue;
	 this.code = obj.code;
	 this.canDown = obj.canDown;
     this.productTypeId = obj.productTypeId;
	 this.productRebate = obj.productRebate;
	 this.productTagId = obj.productTagId;
	 this.countTime = obj.countTime;
	 this.productImage = obj.productImage;
	 this.creatTime = obj.creatTime;
	 this.transePrice = obj.transePrice;
	 this.productId = obj.productId;
	 this.productDesc = obj.productDesc;
	 this.price = obj.price;
	 this.productStatus = obj.productStatus;
	 this.familyZhuoRebate = obj.familyZhuoRebate;
	 this.smallImage = obj.smallImage;
	 this.brandImage = obj.brandImage;
	 this.productName = obj.productName;
	 this.famillyRoomRebate = obj.famillyRoomRebate;
	 this.priceList = new Array();
	 for(var p in obj.priceList )
	 {
		 this.priceList.push(obj.priceList[p]);
	 };
	 this.level = 0;
	 if("undefined" != typeof obj.level){
		 this.level = obj.level;
	 }
};

/**
 * 观众列表
 */
function RoomAudience(obj)
{
	this.member = obj.member;
	this.userImageurl = obj.userImageurl;
	this.vipStatus = obj.vipStatus;
	this.wardStatus = obj.wardStatus;
	this.globalId = obj.globalId;
	this.userNickname = obj.userNickname;
	this.contributionValue = obj.contributionValue;
	this.onlineStatus = obj.onlineStatus;
	this.roleId = obj.roleId;
	this.userId = obj.userId;
	this.userName = obj.userName;
	this.badges = new Array();
	if(typeof obj.badge != "undefined")
	{
		for(b in obj.badge)
		{
			this.badges.push(new BadgeInfoClass(obj.badge[b]));
		}
	}else if(typeof obj.badgeArray != "undefined"){
		this.badges = obj.badgeArray;
	}
	this.userAgent = "";
	if(typeof obj.userAgent != "undefined")
	{
		this.userAgent = obj.userAgent;
	}
	this.stealth = "0";
	if("undefined" != typeof obj.stealth){
		this.stealth = obj.stealth;
	}
	this.richLevel = 0;
	if("undefined" != typeof obj.richLevel){
		this.richLevel = obj.richLevel;
	}
	this.normalVip = 0;
	this.diamondCard = 0;
	for(var n in this.badges)
	{
		if(this.badges[n].badgeAid == ROOM_TOOLS_CONFIG.roomBadge.normalVip)
		{
			this.normalVip = ROOM_TOOLS_CONFIG.roomBadge.normalVip;
		}
		if(this.badges[n].badgeAid == ROOM_TOOLS_CONFIG.roomBadge.diamondCard)
		{
			this.diamondCard = ROOM_TOOLS_CONFIG.roomBadge.diamondCard;
		}
		if(this.badges[n].badgeAid == ROOM_TOOLS_CONFIG.roomBadge.rich)
		{
			this.richLevel = this.badges[n].badgeLevel;
		}
	}
	this.msgId = "";
	if("undefined" != typeof obj.msgId){
		this.msgId = obj.msgId;
	}
	this.pid = obj.pid;
	this.powder = obj.powder;
};
/***********************************igo类***************************************************************/





