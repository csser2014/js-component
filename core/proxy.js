define(['jquery', 'util', 'prototype'], function($, util, prototype){
	
	/**
	 * @member
	 * @return 
	 * @description 跨域调用
	 * @example
	 *
	 */

	var Proxy = function(args){

		var ts = new Date().getTime() + '' + Math.floor(Math.random() * 1000);
		var defArgs = {
				protocol    : 'http',   		// 默认 http 协议
				host        : '',               // 默认为空
				port        : '80', 			// 默认 80　端口
				crossdomain : false, 			// 默认不跨域
				proxy       : 'proxy.html',    // 默认代理文件为 proxy.html
				iframeName  : 'iframe_' + ts    
		};
		// 调用方式
		this.METHOD = {
			GET  : 'get',
			POST : 'post'
		};

		this.CONTENTTYPE = {
			FORM : 'application/x-www-form-urlencoded',
			JSON : 'application/json'
		};

		// 覆盖默认参数
		this.cfg = util.tool.extend(defArgs, args);

	};
	
	/**
	 * 成功返回数据调用
	 */
	var successHandler = function(callback, p){
		if(callback && callback.success && util.type.isFunction(callback.success)){
			callback.success.call(callback, p);
		}
	};

	/**
	 * 失败调用
	 */
	var failureHandler = function(callback, p){
		if(callback && callback.failure && util.type.isFunction(callback.failure)){
			callback.failure.call(callback, p);
		}
	};

	/**
	 * 提示信息
	 *
	 */ 
	var MSG = {
			SERVER_ERROR		:	'服务器忙，请稍候再试',
			NONE_DATA			:	'没有数据',
			LOADING_DATA_ERROR	:	'加载数据错误'
	};

	util.tool.extend(Proxy.prototype, {
	    
		xjQuery : function(url, method, param, callback) {
			try {
				var _args = arguments, _jQuery = null, _this = this, _frameName = null;
				try {
					_frameName = frames[_this.cfg.iframeName];
					_jQuery = frames[_this.cfg.iframeName]
							&& frames[_this.cfg.iframeName].jQuery;
				} catch (e) {}
				
				if (_jQuery) {
					var Aargs = $.makeArray(_args);
					Aargs = Aargs.slice(1); 
					_jQuery[_args[0]].apply(_jQuery, Aargs); 
				} else {
					if(!_frameName){
						jQuery('body')
								.append('<iframe src="'
										+ _this.cfg.protocol + '://' + _this.cfg.host + ':' + _this.cfg.port + _this.cfg.proxy 
										+ '" name="' + _this.cfg.iframeName + '" style="display:none"></iframe>');
					}
					setTimeout(function() {
							_args.callee.apply(_this, _args); 
						}, 500);
				}
			} catch (e) {
			}
		},
		
		req : function(url, method, param, callback, contentType) {
			if(this.cfg.crossdomain){
				this.xjQuery('ajax',{
					url : url,
					type : method,
					data : param,
					cache : false,
					dataType : 'json',
					contentType : contentType,
					success : function(data,textStatus){
						if(data){
							successHandler(callback, data);
						}else{
							failureHandler(callback, MSG.SERVER_ERROR);
						}
					},
					error : function (XMLHttpRequest, textStatus, errorThrown) {
						failureHandler(callback, MSG.SERVER_ERROR + '[' + textStatus + ']');
					}
				});
			}else{
				jQuery.ajax({
					url : url,
					type : method,
					data : param,
					cache : false,
					dataType : 'json',
					contentType : contentType,
					success : function(data,textStatus){
						if(data){
							successHandler(callback, data);
						}else{
							failureHandler(callback, MSG.SERVER_ERROR);
						}
					},
					error : function (XMLHttpRequest, textStatus, errorThrown) {
						failureHandler(callback, MSG.SERVER_ERROR + '[' + textStatus + ']');
					}
				});
			}	
		}
	});
	
	//　地图的接口 
	var MapService = function(cfg){
		MapService.superclass.constructor.call(this, cfg);
	};
	util.tool.mix(MapService, Proxy);
	
	_fpr = MapService.prototype;
	
	_fpr.search = function(param, callback){
		this.req('/hotel/domestic/getDomesticHotel', this.METHOD.GET, param, callback, this.CONTENTTYPE.FORM);
	};

	_fpr.autocomplete = function(param, callback){
		this.req('/hotel/search/city', this.METHOD.GET, param, callback, this.CONTENTTYPE.FORM);
	};

	_fpr.getBookingInfo = function(param, callback){
		this.req('booking/getBookingInfo.do', this.METHOD.GET, param, callback, this.CONTENTTYPE.FORM);
	};

	_fpr.getRoomDates = function(param, callback){
		this.req('booking/roomDates.do', this.METHOD.GET, param, callback, this.CONTENTTYPE.FORM);
	};

	var  MService= new MapService({
	   host        : 'travel.****.cn',
	   crossdomain : true,
	   proxy       : '/proxy.html'
	});

	return {
		MService : MService
	};
});
