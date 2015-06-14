define(['util', 'prototype', 'proxy'], function(util, prototype, proxy) {

	/**
	 * @member area.ui
	 * @description 实现城市自动补全
	 * @return
	 * @example 
	 *
	 * new autocomplete.Autocomplete({
	 *     id : 'city'
	 * });
	 *
	 */

	var Autocomplete = function(args) {
		// 默认参数
		var defArgs = {
			id       : 'autoCity',           // 输入框的默认 id 为 autoCity
			width    : '200',			     // 自动补全下拉框的宽度
			liNum    : 10,                   // 自动补全下拉框中 li 的可见数量
			liHeight : 25                    // 自动补全下拉框中每一条 li 的高度
		};

		// 自动补全下拉框 li 的模板
		this.TMP_LI = [
			'<li>',
				'<a href="javascript:void(0);" data-text="{city}" data-key="{keycode}">',
					'<span class="ca-r">{province}</span>',
					'{city}',
				'</a>',
			'</li>'
		];

		this.cfg = util.tool.extend(defArgs, args);

		this.curIndex = -1; // 初始化当前选中 li 的索值

		this.init();
	};	

	util.tool.extend(Autocomplete.prototype, {

		init : function(){
			var _t = this;

			_t.id = util.dom.getById(_t.cfg.id);

			_t.key = {
				up    : 38,  // 上
				down  : 40,  // 下
				left  : 37,  // 左
				right : 39,  // 右
				enter : 13,  // 回车
				esc   : 27,  // ESC 键
				tab   : 9    // Tab 键
			};

			// 生成外层的 Dom 结构
			_t.createHtml();

			// 邦定事件
			_t.bindEvent();
		},

		createHtml : function() {
			var _t = this, 
				pos = util.dom.getPos(_t.id),
				inputHeight = _t.id.offsetHeight;

			_t.oDiv = document.createElement('div');
			_t.oDiv.id = 'city_autocomplete';
			_t.oDiv.style.width = _t.cfg.width + 'px';
			
			_t.oDiv.style.left = pos.left + 'px';
			_t.oDiv.style.top  = pos.top + inputHeight - 1 + 'px';

			var oH2 = document.createElement('h2');
			oH2.innerHTML = '可输入城市拼音/汉字';

			_t.oUl = document.createElement('ul');
			_t.oUl.style.maxHeight = _t.cfg.liNum * _t.cfg.liHeight + 'px'; // max-height 不兼容ie6

			_t.oDiv.appendChild(oH2);
			_t.oDiv.appendChild(_t.oUl);

			oH2 = null;
		},

		bindEvent : function() {
			var _t = this, timer, value;
 
			// input 输入框的 keyup 事件
			util.event.addEvent(_t.id, 'keyup', function(e){
				var event = util.event.getEvent(e),
					keycode = event.keyCode;

				// input 框为空，则隐藏自动补全框
				(this.value == '') ? (_t.oDiv.style.display = 'none') : 
					(_t.oDiv.style.display = 'block');

				// input 框为空，则不发送请求
				if (this.value == '') return;

				// 如果按键是 enter 或者 tab 键就隐藏自动补全框
				if (_t.key.tab == keycode || _t.key.enter == keycode) {
					_t.hidePop();
					return;
				}

				// 如果按键不是 上、下、左、右、tab、esc 键就调用接口
				if (_t.key.left !== keycode && _t.key.right !== keycode && _t.key.up !== keycode && _t.key.down !== keycode && _t.key.esc !== keycode && _t.key.tab !== keycode) {
					value = this.value;
					timer && clearTimeout(timer);
					timer = setTimeout(function(){
						_t.proxy(value);
					}, 100);
				}

			});
			
			util.event.addEvent(document, 'keydown', function(e){
				var event = util.event.getEvent(e),
					target = util.event.getTarget(event);
				var keycode = event.keyCode;
					_t.setSelect(keycode);
			});

			// input 输入框的 click 事件
			util.event.addEvent(_t.id, 'click', function(){
				_t.hidePop();
			});
		},

		setSelect : function(keycode) {
			var _t = this;
			
			// 输入的如果不是 向上 或者 向下 或者 回车 键就返回
			if (!(_t.key.down == keycode || _t.key.up == keycode || _t.key.enter == keycode)) {
				return;
			}

			var oLi = util.dom.getByTagName(_t.oDiv, 'li'),
				oLen = oLi.length;

			if (oLen == 0) return; // 避免没有数据的时候，执行下面的语句的报错

			// 按下 回车 键，把选中的值填充到 input 输入框中
			if (_t.key.enter == keycode) {
				var city = util.dom.getByTagName(oLi[_t.curIndex], 'a')[0].getAttribute('data-text');
				(city != '' && _t.curIndex != -1) && (_t.id.value = city);
				_t.hidePop();
				return;
			}

			// 实现上下循环滚动
			switch (keycode) {
				case _t.key.down:
					(_t.curIndex == oLen - 1) && (_t.curIndex = -1);
					_t.curIndex++;
					break;
				case _t.key.up:
					(_t.curIndex == 0 || _t.curIndex == -1) && (_t.curIndex = oLen);
					_t.curIndex--;
					break;
				default:
					break;
			}

			var dataText = util.dom.getByTagName(oLi[_t.curIndex], 'a')[0].getAttribute('data-text');
				(dataText != '' && _t.curIndex != -1) && (_t.id.value = dataText);

			util.dom.removeAllClass(_t.oUl, 'sHover');
			oLi[_t.curIndex].className = 'sHover';

			_t.scrollLi();

		},

		// 当上下键头移动到中间的时候，滚动条向上滚动
		scrollLi : function() {
			var _t = this;
			if (_t.curIndex > _t.cfg.liNum / 2) {
				_t.oUl.scrollTop = ((_t.curIndex - _t.cfg.liNum / 2) * _t.cfg.liHeight);
			} else {
				_t.oUl.scrollTop = 0;
			}
		},

		// 调用接口，获取数据
		proxy : function(value) {
			var _t = this;
			var param = {
				key : value,
				abroad : 0
			};

			var callback = {
				success : function(res) {
					var data = res.data, length = data.length;

					if (length > 0) {
						_t.render(data);
						_t.addLiMoveEvent();
						_t.addLiClickEvent();
					} else {
						// 提示
						_t.oUl.innerHTML = '<li>没有数据</li>';
					}
				},
				failure : function(e) {
				}
			};
			proxy.MService.autocomplete(param, callback);
		},

		// 处理在 li 上移动的事件
		addLiMoveEvent : function() {
			var _t = this, 
				oLi = util.dom.getByTagName(_t.oDiv, 'li'),
				oLen = oLi.length;

			for (var k = 0; k < oLen; k++) {

				oLi[k].index = k;
				util.event.addEvent(oLi[k], 'mouseover', function(){
					_t.curIndex = this.index;
					util.dom.removeAllClass(_t.oUl, 'sHover');
					oLi[_t.curIndex].className = 'sHover';
				});
			}
		},

		// 处理在 li 上点击的事件
		addLiClickEvent : function() {
			var _t = this;
			_t.oUl.onclick = util.event.proxy(_t.fillInput, _t);
		},

		// 把选中的值填充到 input 框中
		fillInput : function(e) {
				var _t = this, city, 
					event = util.event.getEvent(e),
					target = util.event.getTarget(event);
				if (target.tagName.toLowerCase() == 'a') {
					city = target.getAttribute('data-text');
					if (city != '') {
						_t.id.value = city;
						_t.hidePop();
					}
				}
		},

		hidePop : function() {
			var _t = this;
			_t.oDiv.style.display = 'none';
			util.dom.removeAllClass(_t.oUl, 'sHover');
			_t.curIndex = -1; // 把索引值重新设为 -1 
			_t.oUl.scrollTop = 0; // 重新 ul 的 scrollTop 为0
		},

		// 渲染异步加载的数据
		render : function(data) {
			var _t = this, len = data.length, i = 0, 
				result = '', tmpList = _t.TMP_LI.join('');

			for (; i < len; i++) {
				result += tmpList.format({
					city : data[i].city,
					keycode : '',
					province : data[i].province 
				});
			}
			_t.oUl.innerHTML = result;
			_t.curIndex = -1;
			document.body.appendChild(_t.oDiv); 
		}
	});

	return {
		Autocomplete : Autocomplete
	};

});
