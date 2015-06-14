define(['util', 'prototype'], function(util, prototype) {

	/**
	 * @member sdSlider.ui
	 * @description 实现轮播图
	 * @return
	 * @example 
	 *
	 * new sdSlider({id : 'slider'});
	 *
	 */

	var Slider = function(args) {
		// 默认参数
		var defArgs = {
			id : 'carousel',          // 轮播图的 id 默认为 carousel
			prveBtn : 'prve',
			nextBtn : 'next',
			time  : 1000
		};

		this.cfg = util.tool.extend(defArgs, args);

		this.init();
	};	

	util.tool.extend(Slider.prototype, {

		init : function(){
			var _t = this;

			_t.oUl = util.dom.getByClass(_t.cfg.id, 'picRoll-1-small')[0];
			
			// 小图
			_t.oLi = util.dom.getByTagName(_t.oUl, 'li');
			_t.liLength = _t.oLi.length;     
			
			if (_t.liLength === 1) return;
			
			// 大图
			_t.oPic = util.dom.getById('jsShow-pic');
			_t.oImg = util.dom.getByTagName(_t.oPic, 'img')[0];

			_t.curIndex = 0; // 用来控制当前图标的索引

			_t.timer = _t.picTimer = _t.timerId = null;
			
			// 邦定事件
			_t.bindEvent();
		},

		bindEvent : function(){
			var _t = this;

			_t.changeLeft();

			_t.changeRight();

			_t.showPic();
			
			_t.triggerEvent();
			
			_t.autoPlay();
		},

		changeLeft : function() {
			var _t = this,
				leftArrow = util.dom.getByClass(_t.cfg.id, _t.cfg.prevBtn)[0];

			// 点击 left 按钮
			util.event.addEvent(leftArrow, 'click', function(){
				(_t.curIndex > 0) ?  (_t.changeImg(--_t.curIndex)) : (_t.changeImg(_t.curIndex = _t.liLength - 1));
			});

		},

		changeRight : function() {
			var _t = this,
				rightArrow = util.dom.getByClass(_t.cfg.id, _t.cfg.nextBtn)[0];

			// 点击 right 按钮
			util.event.addEvent(rightArrow, 'click', function(){
				(_t.curIndex < _t.liLength - 1) ? ( _t.changeImg(++_t.curIndex)) : (_t.changeImg(_t.curIndex = 0));
			});
		},

		showPic : function() {
			var _t = this, i = 0;

			// 点击小图
			for (; i < _t.liLength; i++) {
				_t.oLi[i].index = i;
				util.event.addEvent(_t.oLi[i], 'mouseover', function(){
					(this.index != _t.curIndex) && _t.changeImg(_t.curIndex = this.index);
				});
			}
		},

		changeImg : function(index) {
			var _t = this;

			// 切换小图
			util.dom.removeAllClass(_t.oUl, 'curr');
			util.dom.addClass(_t.oLi[index], 'curr');

			_t.setOpacity(index);
		},

		setOpacity : function(index) {
			var _t = this, alpha = 0,
				pImg = util.dom.getByTagName(_t.oLi[index], 'img')[0];

			_t.oImg.setAttribute('src', pImg.getAttribute('src'));
			
			// 隐藏图片
			_t.picTimer && clearInterval(_t.picTimer);
			_t.picTimer = setInterval(function(){
				alpha += 2;
				(alpha > 100) && (alpha = 100);

				// 显示图片
				util.dom.setOpacity(_t.oImg, alpha);

				(alpha == 100) && clearInterval(_t.picTimer);

			}, 20);
		},
		
		autoPlay : function() {
			var _t = this;
			_t.timerId && clearInterval(_t.timerId);
			_t.timerId = setInterval(function(){
				(_t.curIndex < _t.liLength - 1) ? ( _t.changeImg(++_t.curIndex)) : (_t.changeImg(_t.curIndex = 0));
				_t.changeImg(_t.curIndex);
			}, _t.cfg.time);
		},
		
		triggerEvent : function() {
			var _t = this, oDiv = util.dom.getById(_t.cfg.id);

			util.event.addEvent(oDiv, 'mousemove', function(){
				clearInterval(_t.timerId);
			});

			util.event.addEvent(oDiv, 'mouseout', function(){
				_t.autoPlay();
			});
		},

		// 实现动画效果
		startMove : function(target) {
			var _t = this;
			_t.timer && clearInterval(_t.timer);
			_t.timer = setInterval(function(){
				var iSpeed = (target - _t.oUl.offsetLeft) / 10;
				iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
				if (target == _t.oUl.offsetLeft) {
					clearInterval(_t.timer);
				} else {
					_t.oUl.style.left = _t.oUl.offsetLeft + iSpeed + 'px';
				}
			}, 20);
		}
	});

	return {
		Slider : Slider
	};

});
