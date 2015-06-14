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

	var sdSlider = function(args) {
		// 默认参数
		var defArgs = {
			id : 'slider'          // 轮播图的 id 默认为 slider
		};

		this.cfg = util.tool.extend(defArgs, args);

		this.init();
	};	

	util.tool.extend(sdSlider.prototype, {

		init : function(){
			var _t = this;

			_t.sdSlider = util.dom.getById('sdSlider');
			if (_t.sdSlider === null || !_t.sdSlider) return;

			// 小图
			_t.oLi = util.dom.getByTagName(_t.sdSlider, 'li');
			_t.liLength = _t.oLi.length;          // li 的总数

			if (!_t.liLength || _t.liLength === 0) return;

			_t.liWidth = _t.oLi[0].offsetWidth; // 每一个 li 的 width
			var ulWidth = _t.liLength * (_t.liWidth + 2);
			
			// 设定 ul 的宽度
			_t.oUl = util.dom.getByTagName(_t.sdSlider, 'ul')[0];
			_t.oUl.style.width = ulWidth + 'px';

			// 大图
			_t.oPic = util.dom.getByClass(_t.sdSlider, 'showPic')[0];
			_t.oImg = util.dom.getByTagName(_t.oPic, 'img');

			_t.idx = 0; // 用来控制左右按钮

			_t.curIndex = 0; // 用来控制点击小图标的索引

			_t.timer = _t.picTimer = null;
			
			// 邦定事件
			_t.bindEvent();
		},

		bindEvent : function(){
			var _t = this;

			_t.changeLeft();

			_t.changeRight();

			_t.showPic();
		},

		changeLeft : function() {
			var _t = this,
				leftArr = util.dom.getByClass(_t.sdSlider, 'leftArr')[0];

			// 点击 left 按钮
			util.event.addEvent(leftArr, 'click', function(){
				if (_t.idx > 0) {
					_t.idx--;
					_t.startMove(-((_t.liWidth + 2) * _t.idx)); // 小图动画效果
				}
				if (_t.curIndex > 0) {
					_t.curIndex--;
					_t.changeImg(_t.curIndex);
				}
			});

		},

		changeRight : function() {
			var _t = this,
				rightArr = util.dom.getByClass(_t.sdSlider, 'rightArr')[0];

			// 点击 right 按钮
			util.event.addEvent(rightArr, 'click', function(){
				if (_t.idx < _t.liLength - 5) {
					_t.idx++;
					_t.startMove(-((_t.liWidth + 2) * _t.idx)); // 小图动画效果
				}
				if (_t.curIndex < _t.liLength - 1) {
					_t.curIndex++;
					_t.changeImg(_t.curIndex);
				}
			});
		},

		showPic : function() {
			var _t = this, i = 0;

			_t.tImg = util.dom.getByTagName(_t.oUl, 'img');
			len = _t.tImg.length;

			// 点击小图
			for (; i < len; i++) {
				_t.tImg[i].index = i;
				util.event.addEvent(_t.tImg[i], 'mouseover', function(){
					_t.curIndex = this.index;
					_t.changeImg(_t.curIndex);
				});
			}
		},

		changeImg : function(index) {
			var _t = this;

			// 切换小图
			util.dom.removeAllClass(_t.oUl, 'active');
			util.dom.addClass(_t.tImg[index], 'active');

			// 切换大图
			util.dom.removeAllClass(_t.oPic, 'on');
			util.dom.addClass(_t.oImg[index], 'on');
			_t.setOpacity(index);
		},

		setOpacity : function(index) {
			var _t = this, alpha = 0, tLen = _t.oImg.length;
			
			// 隐藏图片
			for (var i = 0; i < tLen; i++) {
				util.dom.setOpacity(_t.oImg[i], 0);
			}

			_t.picTimer && clearInterval(_t.picTimer);
			_t.picTimer = setInterval(function(){
				alpha += 2;
				(alpha > 100) && (alpha = 100);

				// 显示图片
				util.dom.setOpacity(_t.oImg[index], alpha);

				(alpha == 100) && clearInterval(_t.picTimer);

			}, 20);
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
		sdSlider : sdSlider
	};

});
