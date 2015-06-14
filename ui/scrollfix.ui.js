define(['prototype', 'util'], function(prototype, util){

	/**
	 * @member scrollfix.ui
	 * @description 实现滚动到导航条时固定在顶部
	 * @return 
	 * @example
	 *
	 */

	var ScrollFix = function(args) {
		// 默认参数
		var defArgs = {
			clsName      : 'scrollfix-ui',  // 要固定滚动对象的类名
			offsetTop    : 0,               // 当滚动到要固定对象的时候，offsetTop 代表的是要固定对象离顶部的距离
			offsetBottom : 0,       		// 当滚动到要固定对象的时候，offsetBottom 代表的是要固定对象离底部的距离
			is_fixed     : true     		// 默认是固定的
		};

		this.cfg = util.tool.extend(defArgs, args);
		
		this.init();
	};

	util.tool.extend(ScrollFix.prototype, {

		init : function() {
			
			this.setConfig();
			
			this.bindEvent();
		},

		// 获取初始化的参数
		setConfig : function() {
			this.node = util.dom.getByClass(document, this.cfg.clsName)[0];
			if (this.node) {
				this.docTop = util.dom.getPos(this.node).top; 				// 元素相对于文档的高度
				this.elTop = util.dom.css(this.node, 'top');    			// 获取元素的 top 属性值，带 px 单位的，默认是 auto
				this.elPosition = util.dom.css(this.node, 'position'); 		// 获取元素的 position 属性值，默认是 static
				this.marginTop = parseInt(util.dom.css(this.node, 'marginTop'), 10) || 0; // 要固定对象的 margin-top 的值
				this.elHeight = this.node.offsetHeight;  					//元素的高度，不带 px 单位的
				this.elWidth = this.node.offsetWidth;   					//元素的宽度，不带 px 单位的
				this.maxHeight =document.body.offsetHeight - this.cfg.offsetBottom;  // 距离底部的最大高度
			}
		},

		// 邦定事件
		bindEvent : function() {
			var _t = this, top = 0;
			util.event.addEvent(window, 'scroll', function(){

				var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

				// 不固定
				if (!_t.cfg.is_fixed) {
					return;
				}
				
				// 元素还没有到固定的时候就不停的获取距离顶部位置的高度，用于跟  scrollTop 比较
				if (util.dom.css(_t.node, 'position') !== 'fixed' && _t.cfg.is_fixed) {
					_t.docTop = util.dom.getPos(_t.node).top || 0;
				}

				// 判断是否已经滚动超过固定对象的位置了
				if (scrollTop >= (_t.docTop - _t.marginTop - _t.cfg.offsetTop)) {
				
					// 滚动到大于距离底部的最大高度元素就可以开始滚动了
					if (_t.maxHeight < (scrollTop + _t.elHeight + _t.marginTop + _t.cfg.offsetTop)){
						top = scrollTop + _t.elHeight + _t.marginTop + _t.cfg.offsetTop - _t.maxHeight;
					}else{
						top = 0;
					}

					_t.node.style.position = 'fixed';
					_t.node.style.top = (_t.cfg.offsetTop - top) + 'px';

				}else{
					// 没有滚动到超过固定的位置，就恢复原来的属性，否则会一直固定在那里
					_t.node.style.position = _t.elPosition;
					_t.node.style.top = _t.elTop;
					_t.node.style.width = _t.elWidth + 'px';
					_t.node.style.marginTop = _t.marginTop + 'px';
				}
			});
		}
	});
	return {
		ScrollFix : ScrollFix
	};
});
