define(['prototype', 'util'], function(prototype, util){

	/**
	 *
	 * @member scrolltop.ui
	 * @description 实现按钮返回到顶部的组件
	 * @return 
	 * @example
	 *
	 */

	function ScrollTop(args) {

		//默认参数
		var defArgs = {
			clsName 	: 'scrolltop-ui', 								// 默认类名
			id      	: 'scrolltop_ui_' + (new Date()).getTime(),     // 生成随机id
			showText    : false,                                        // 是否显示按钮的文字，默认不显示
			text    	: '返回顶部',                                   // 按钮的文字
			time    	: 20, 											//默认返回到顶部的时间为20毫秒
			top     	: 100  											//钮默是滚动到大于 100px 的时候出现返回顶部按钮
		};

		this.cfg = util.tool.extend(defArgs, args);

		this.init();
	}


	util.tool.extend(ScrollTop.prototype, {
		init : function() {
			this.createHtmlDom();

			this.bindEvent();

		},
		
		// 创建 dom 结构
		createHtmlDom : function() {

			// 创建返回顶部的 div
			var oDiv = document.createElement('div');
			oDiv.id = this.cfg.id;
			oDiv.className = this.cfg.clsName;

			var oA = document.createElement('a');
			oA.className = 'scrolltop_ui_btn';
			oA.href = 'javascript:void(0)';
			oA.innerHTML = this.cfg.showText == true ? this.cfg.text : '';
			oDiv.appendChild(oA);

			// 把 div 添加到 document.body
			document.body.appendChild(oDiv);
		},

		//邦定事件
		bindEvent : function() {
			var _t = this, oTimer = null,
				scrollTop = nowScrollTop = speed = 0;

			var oDiv = util.dom.getByClass(document, _t.cfg.clsName)[0];

			util.event.addEvent(window, 'scroll', function(){
				scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				if (scrollTop > _t.cfg.top){
					oDiv.style.display = 'block'; //显示返回顶部按钮
				} else{
					oDiv.style.display = 'none'; //隐藏返回顶部按钮
				}
			});
			
			// 返回顶部按钮事件
			util.event.addEvent(oDiv, 'click', function(){
				clearInterval(oTimer);

				oTimer = setInterval(function(){
					nowScrollTop =  document.documentElement.scrollTop || document.body.scrollTop;  // 获取每次离顶部的距离

					speed = Math.floor((0 - nowScrollTop) / 10); // 实现减速运动

					if (nowScrollTop == 0){  // 已经到顶
						clearInterval(oTimer);
					} else {
						document.documentElement.scrollTop = document.body.scrollTop = nowScrollTop + speed;
					}
				}, _t.cfg.time);
			});

		}
	});
	return {
		ScrollTop : ScrollTop
	};
});
