define(['util', 'prototype'], function(util, prototype) {

	/**
	 * @member pop.ui
	 * @description 实现弹窗
	 * @return 
	 * @example 
	 *
	 * new popui.Pop({isMark : true, content : '这是一个内容来的'});
	 *
	 */

	var Pop = function(args) {
		// 默认参数
		var defArgs = {
			clsName       : 'pop-ui',                            // 默认类名
			id            : 'pop_ui_' + (new Date()).getTime(),  // 生成随机id
			height        : 200,                                 // 弹出框的默认高度
			width         : 200,                                 // 弹出框的默认宽度
			type          : 'alert',                             // TODO
			content       : '',                                  // 弹出框的内容
			isMark        : false,							     // 是否需要遮罩层，默认没有
			isCustom      : false, 								 // 是否需要自定义样式
			markClsName   : 'mark-ui',                           // 遮罩层的默认类名
			markBgColor   : '#000',                              // 遮罩层的颜色
			markOpacity   : 0.1,								 // 遮罩层的透明度
			closeClsName  : 'close',                             // 自定义关闭按钮的类名
			position      : 'center',				// 默认显示为屏幕中间，值为 center | rightTop | rightBottom | leftTop | leftBottom
			title         : '提示',                              // 默认标题名称
			titleClsName  : 'title',                             // 标题的默认类名
			isShowTitle   : true,								 // 默认显示标题
			isShowClose   : true,								 // 默认显示关闭按钮
			isBorder      : true, 							  	 // pop-ui 是否显示边框
			isShadow      : false,                               // pop-ui 是否显示阴影
			titlePos      : 'center',                            // 文字标题的位置，默认居中 // TODO
			isDrag        : false,                               // 默认不可拖动
			callback      : function() {},					     // 回调函数
			padding       : 5,                                   // 默认 padding 的值为4px
			context       : ''								     // 回调函数中的上下文
		};

		this.cfg = util.tool.extend(defArgs, args);

		this.init();
	};	

	util.tool.extend(Pop.prototype, {

		init : function(){

			var _t = this;

			// 生成 dom 结构
			_t.createHTML();

			// 邦定事件
			_t.bindEvent();
		},

		createHTML : function() {
			var _t = this;

			_t.oPop = document.createElement('div');
			_t.oPop.className = _t.cfg.clsName;
			_t.oPop.id = _t.cfg.id;

			var oWrap = document.createElement('div');
			oWrap.className = 'pop-ui-wrap';

			if (!_t.cfg.isCustom) {

				util.dom.setStyle(_t.oPop, {
					height     : _t.cfg.height + 'px',
					width      : _t.cfg.width + 'px',
					padding    : _t.cfg.padding + 'px',
					background : _t.cfg.isBorder ?  'rgba(0, 0, 0, 0.05)' : 'none',
					boxShadow :  _t.cfg.isShadow ? '0 0 5px rgba(0, 0, 0, 0.5)' : 'none'
				});

				util.dom.setStyle(oWrap, {
					height  : _t.cfg.height + 'px',
					width   : _t.cfg.width + 'px'
				});
			}


			// 调整窗口的位置
			_t.setPosition();

			// 是否有遮罩层
			if (_t.cfg.isMark) {
				_t.oMark = document.createElement('div');
				_t.oMark.className = _t.cfg.markClsName;
				_t.oMark.id = 'mark_' + (new Date()).getTime();
				util.dom.setStyle(_t.oMark, {
					background : _t.cfg.markBgColor,
					opacity    : _t.cfg.markOpacity,
					filter     : "alpha(opacity=" + (_t.cfg.markOpacity * 100) + ")"
				});
				document.body.appendChild(_t.oMark);
			}

			// 是否有标题
			if (_t.cfg.isShowTitle) {
				var oH2 = document.createElement('h2');
				var strTitle = _t.cfg.title + (_t.cfg.isShowClose ? '<span class="close">×</span>' : '');
				oH2.className = _t.cfg.titleClsName;
				oH2.innerHTML = strTitle;
				oWrap.appendChild(oH2);
				oH2 = null;
			}
			
			// 内容
			var oContent = document.createElement('div');
			oContent.className = 'pop-content clearfix';
			oContent.innerHTML = _t.cfg.content;
			oWrap.appendChild(oContent);

			_t.oPop.appendChild(oWrap);
			document.body.appendChild(_t.oPop);

			oContent = null;
		},

		setPosition : function() {
			var _t = this, left = 0, top = 0,
				screenWidth = document.documentElement.clientWidth || document.body.clientWidth,
				screenHeight = document.documentElement.clientHeight || document.body.clientHeight;

			switch (_t.cfg.position) {
				case 'center':                                      // 居中
					left = (screenWidth - _t.cfg.width - 2 * _t.cfg.padding) / 2;
					top = (screenHeight - _t.cfg.height - 2 * _t.cfg.padding) / 2;
					break;
				case 'rightTop':                                    // 右上
					left = screenWidth - _t.cfg.width - 2 * _t.cfg.padding;
					top = 0;
					break;
				case 'rightBottom':                                 // 右下
					left = screenWidth - _t.cfg.width - 2 * _t.cfg.padding;
					top = screenHeight - _t.cfg.height - 2 * _t.cfg.padding;
					break;
				case 'leftTop':                                     // 左上
					left = 0;
					top = 0;
					break;
				case 'leftBottom':                                  // 左下
					left = 0;
					top = screenHeight - _t.cfg.height - 2 * _t.cfg.padding;
					break;
				default:
					left = 0;
					top = 0;
					break;
			}
			if (_t.oPop) {
				_t.oPop.style.left = left + 'px';
				_t.oPop.style.top = top + 'px';
			}
		},

		bindEvent : function(){
			var _t = this;
			
			// 改变窗口位置，重新调整位置
			util.event.addResizeEvent(function(){
				_t.setPosition();
			});

			// 是否可以拖动
			(_t.cfg.isDrag && _t.cfg.isShowTitle) && util.drag.start(_t.cfg.id);


			// 关闭事件
			if (_t.cfg.isShowTitle && !_t.cfg.isCustom) {
				var oClose = util.dom.getByClass(_t.oPop, 'close')[0];
				util.event.addEvent(oClose, 'click', function(){
					_t.destroy();
				});
			}

			// 是否是自定义样式
			if (_t.cfg.isCustom) {
				// 判断是否有关闭按钮
				var tClose = util.dom.getByClass(_t.oPop, _t.cfg.closeClsName)[0];
				if (tClose !== undefined) {
					util.event.addEvent(tClose, 'click', function(){
						_t.destroy();
					});
				}
			}

			// 点击遮罩层事件
			if (_t.cfg.isMark) {
				util.event.addEvent(_t.oMark, 'click', function(){
					_t.destroy();
				});
			}

			// 回调函数
			if (_t.cfg.callback && util.type.isFunction(_t.cfg.callback)){
				_t.cfg.callback.call(_t.cfg.context, null);
			}

		},

		destroy : function() {
			var _t = this;

			// 移除遮罩层
			(_t.cfg.isMark) && (_t.oMark.parentNode.removeChild(_t.oMark));

			// 移动弹出框
			_t.oPop.parentNode.removeChild(_t.oPop);

			_t.oMark = null;
			_t.oPop = null;
		}

	});

	return {
		Pop : Pop
	};

});
