define(['util', 'prototype'], function(util, prototype) {

	/**
	 * @member page.ui
	 * @description 实现分页效果
	 * @return
	 * @example 
	 *
	 */

	var Page = function(args) {

		// 默认参数
		var defArgs = {
			node     : 'page',          // 要操作的默认结点id
			total    : -1,				// 总条数
			pageSize : 5,				// 每一页有多少条数据
			curPage  : 7,				// 默认当前为第一页
			adjust   : 3,				// 以当前页为准，向前和向后加 adjust，形成一个有效的范围
			showPrev : false,           // 默认不显示 上一页 按钮
			showNext : false,           // 默认不显示 下一页 按钮
			prevText : '上一页',        // 默认显示 上一页 的文字
			nextText : '下一页',        // 默认显示 下一页 的文字
			isLoading: false,           // 是否弹出加载框
			callback : function() {},   // 回调函数
			context  : ''               // 回调函数中的上下文
		};

		this.cfg = util.tool.extend(defArgs, args);

		this.init();
	};	

	util.tool.extend(Page.prototype, {

		init : function(){
			var _t = this;

			// 生成 dom 结构
			_t.getLink();

			// 邦定事件
			_t.bindEvent();
		},

		// 根据 curPage 和 adjust 来获取中间数一个有效的范围
		getLimitPage : function(){
			var _t = this, 
				pageRange = [], 	// 保存中间数的范围
				startPage,  		// 中间数的开始位置
				endPage;    		// 中间数的结束位置

			_t.totalPage = Math.ceil(_t.cfg.total / _t.cfg.pageSize);
			
			startPage = Math.max(_t.cfg.curPage - _t.cfg.adjust, 1);

			(startPage <= _t.cfg.adjust) && (startPage = 1);

			endPage = _t.cfg.curPage + _t.cfg.adjust + 1;

			(endPage > _t.totalPage - 1) && (endPage = _t.totalPage + 1);

			for (var i = startPage; i < endPage; i++){
				(i > 0 && i <= _t.totalPage) && pageRange.push(i);
			}
			
			_t.showFirst = pageRange.in_array(1);
			_t.showLast = pageRange.in_array(_t.totalPage);

			_t.isCurPage = (_t.cfg.curPage >= 1) && (_t.cfg.curPage <= _t.totalPage);

			return pageRange;
		},

		bindEvent : function(){
			var _t = this;
			_t.oNode.onclick = function(e) {
				var event = util.event.getEvent(e),
					target = util.event.getTarget(event),
					page;

				if (target.tagName.toLowerCase() === 'a') {
					// 点击上一页
					if (target.className === 'prev') {
						page = _t.cfg.curPage = _t.cfg.curPage - 1;
					}

					// 点击下一页
					if (target.className === 'next') {
						page = _t.cfg.curPage = _t.cfg.curPage + 1;
					}

					// 点击页码数
					var p = parseInt(target.innerHTML, 10);
					if (/\d+/.test(p)){
						page = _t.cfg.curPage = p;
					}

					// 判断是否是函数
					if (_t.cfg.callback && util.type.isFunction(_t.cfg.callback)) {
						// 判断是否有上下文对象
						_t.cfg.context = _t.cfg.context ? _t.cfg.context : null;
						_t.cfg.callback.call(_t.cfg.context, _t.cfg.total, page, _t.cfg.isLoading);

						// 点击页码数的时候要重绘
						_t.getLink();
					}

				}
				return false;
			};
			
		},

		getLink : function() {
			var _t = this, 
				limitPage = _t.getLimitPage();

			_t.oNode = util.dom.getById(_t.cfg.node);

			if (!_t.isCurPage) return;

			_t.oNode.innerHTML = '';

			// 显示上一页的按钮
			if (_t.cfg.showPrev && _t.cfg.curPage > 1) {
				// 创建 上一页 的dom结构
				var prevNode = document.createElement('a');
				prevNode.className = 'prev';
				prevNode.href='javascript:void(0);';
				prevNode.innerHTML = _t.cfg.prevText;
				_t.oNode.appendChild(prevNode);
				prevNode = null;
			}

			// 判断前面的省略号
			if (!_t.showFirst) {
				// 创建 ... 的dom结构
				var fPage = document.createElement('a');
				fPage.href = 'javascript:void(0);';
				fPage.innerHTML = 1;
				var fSpan = document.createElement('span');
				fSpan.innerHTML = '...';
				_t.oNode.appendChild(fPage);
				_t.oNode.appendChild(fSpan);
				fPage = fSpan = null;
			}

			// 创建中间范围的dom结构
			var mStrong = document.createElement('strong'), mPage;
			for (var i = 0; i < limitPage.length; i++) {
				if(limitPage[i] === _t.cfg.curPage) {
					mStrong.innerHTML = _t.cfg.curPage;
					_t.oNode.appendChild(mStrong);
				} else {
					mPage = document.createElement('a');
					mPage.innerHTML = limitPage[i];
					mPage.href = 'javascript:void(0);';
					_t.oNode.appendChild(mPage);
				}
			}
			mStrong = mPage = null;

			// 判断后面的省略号
			if (!_t.showLast) {
				// 创建 ... 的dom结构
				var lSpan = document.createElement('span');
				lSpan.innerHTML = '...';
				var lPage = document.createElement('a');
				lPage.href = 'javascript:void(0);';
				lPage.innerHTML = _t.totalPage;
				_t.oNode.appendChild(lSpan);
				_t.oNode.appendChild(lPage);
				lSpan = lPage = null;
			}

			// 显示下一页的按钮
			if (_t.cfg.showNext && _t.cfg.curPage < _t.totalPage) {
				var nextNode = document.createElement('a');
				nextNode.className = 'next';
				nextNode.href='javascript:void(0);';
				nextNode.innerHTML = _t.cfg.nextText;
				_t.oNode.appendChild(nextNode);
				nextNode = null;
			}
		}
	});

	return {
		Page : Page
	};

});
