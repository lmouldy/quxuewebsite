function IRoomMessage(){
    this.time = new ITimer(3*1000);
}

/**
 * 启动房间页面定时器
 */
IRoomMessage.prototype.excuteLook = function(){
    //this.time.addFn(20, this.roomConsumeList);
    this.time.excute();
};






/**
 * 定时器类
 * @param baseTime
 * @constructor
 */
function ITimer(baseTime){
    var _timer = null;
    var _arrFn = [];
    var _baseTime = 1000;
    if(typeof baseTime == "number"){
        _baseTime = baseTime;
    }

    //定时器回调函数
    this.addFn = function(multi, fn){
        _arrFn.push({multi:multi, fn:fn});
        return this;
    };

    //执行定时器
    this.excute = function(){
        if(_timer != null){
            this.stop();
        }
        var _times = 1;
        var _excute = function(){
            for(var i=0; i<_arrFn.length; i++){
                if(_times % _arrFn[i].multi == 0){
                    _arrFn[i].fn();
                }
            }
            _times += 1;
        };
        _excute();
        _timer = setInterval(function(){
            _excute();
        }, _baseTime);
    };

    //停止执行定时器
    this.stop = function(){
        if(_timer != null){
            clearTimeout(_timer);
            _timer = null;
        }
    }

    //清除
    this.clear = function(){
        _arrFn = [];
        this.stop();
    };
};
