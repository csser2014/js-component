define(['util', 'prototype', 'proxy'], function(util, prototype, proxy){

	/**
	 * @member starrating.ui
	 * @description 实现星星评分的功能
	 * @return 
	 * @example
	 *
	 */

	var StarRating = function(args) {

		// 默认参数
		var defArgs = {
			node    	: 'star-ui',		// 要操作的默认结点id
			starNum 	: 5,                // 默认星星的个数，默认为5个
			total   	: 5,                // 星星总的评分，默认为5分
			callback 	: function() {},    // 回调函数
			context     : '',			    // 回调函数中的上下文
			isAjax  	: true				// 是否需要 ajax 操作
		};

		this.cfg = util.tool.extend(defArgs, args);
		
		this.init();
	};

	util.tool.extend(StarRating.prototype, {

		init : function() {
			
			var _t = this;
			//this.createHtmlDom();

			_t.oDiv = util.dom.getById(_t.cfg.node);
			if (!((_t.oDiv !== null) && (isFirstEva == 1))) return;
			
			this.bindEvent();
		},

		// // 创建 dom 结构
		createHtmlDom : function() {
			/*
			var _t = this, oA;
			for (var i = 0; i < _t.cfg.starNum; i++) {
				oA = document.createElement('a');
				oA.href = 'javascript:void(0)';
				_t.oDiv.appendChild(oA);
			}
			*/
		},

		// 邦定事件
		bindEvent : function() {
			var _t = this;
			_t.flag = true;
			_t.oA = _t.oDiv.getElementsByTagName('a');
			util.tool.makeArray(_t.oA).each(function(_this, index){ // index 从 0 开始
				(function(num){
					// 鼠标移进
					util.event.addEvent(_this, 'mouseover', function(){
						_t.addStar(num);
					});

					// 鼠标移出
					util.event.addEvent(_this, 'mouseout', function(){
						_t.addStar(_t.curNum - 1);
					});

					// 鼠标点击
					util.event.addEvent(_this, 'click', function(){
						if (_t.flag) {
							_t.addStar(num);
							_t.curNum = util.dom.getByClass(_t.oDiv, 'hover').length; // 点击的时候，获取小于当前索引的长度
							var score = parseInt(_t.cfg.total / _t.cfg.starNum * _t.curNum,10);

							// 回调函数
							if (_t.cfg.callback && util.type.isFunction(_t.cfg.callback)){
								_t.cfg.callback.call(_t.cfg.context, score);
							}
						}
						// ajax 请求
						if (_t.cfg.isAjax && _t.flag) {
							_t.flag = false;
							_t.proxy();
						}
					});
				})(index);
			});
		},

		// 添加小于当前索引值的所有 hover 类，并移除剩下的 hover 类
		addStar : function(iNum) {
			var _t = this, len = _t.oA.length;
			for (var i = 0; i < len; i++){
				_t.oA[i].className = i <= iNum ? 'hover' : '';  
			}
		},

		proxy : function() {
			var _t = this,
				param = {
					num : _t.curNum
				},
				callback = {
					success : function(res) {
						_t.flag = true;
					},
					failure : function(e) {
						console.log(e);
					}
				};
			proxy.MService.search(param, callback);
		}
	});
	return {
		StarRating : StarRating
	};
});
