define(['prototype'], function(prototype){

	// 各种实用工具类
	var Tool = {

		/**
		 * @member Tool
		 * @description 对象扩展
		 * @return {Object}
		 * @example
		 *
		 */
		extend : function(destination, source) {
			for (var property in source) {
				destination[property] = source[property];
			}
			return destination;
		},

		/**
		 * @member Tool
		 * @description 实现对象的继承
		 * @return {Object}
		 * @example
		 *
		 */
		mix : function(subClass,superClass){
			var F = function(){};
			F.prototype = superClass.prototype;
			subClass.prototype = new F();
			subClass.prototype.constructor = subClass;
			subClass.superclass = superClass.prototype;
			if(superClass.prototype.constructor == Object.prototype.constructor) {
				superClass.prototype.constructor = superClass;
			}
		},

		/**
		 * @member Tool
		 * @description 把伪数组转换为数组
		 * @return {Array}
		 * @example
		 *
		 */
		makeArray : function(iterator) {
			if (!iterator) return [];
			var result = null;
			try {
				result = Array.prototype.slice.call(iterator, 0);
			} catch (e) {
				var i = 0, result = [], len = iterator.length;
				for (i = 0; i < len; i++){
					result.push(iterator[i]);
				}
			}
			return result;
		},

		/**
		 * @member Tool
		 * @description 获取选中文本
		 * @return 
		 * @example
		 *
		 */
		getSelectTxt : function(){
			var txt='';
			if(document.selection) {
				txt = document.selection.createRange().text;
			} else {
				txt = document.getSelection();
			}
			return txt.toString();
		},

		/**
		 * @member Tool
		 * @description 自动调整iframe的高度
		 * @return {String}
		 * @example
		 *
		 */
		iframeHeight:function(id, timer){
			var iframeId = Dom.getById(id), i = 0, 
				timer = timer || 15, intervalId = null,
				iDoc, iHeight;

			if (!iframeId || iframeId == null) return;

			intervalId = setInterval(function(){
				(++i == timer) && clearInterval(intervalId);
				iDoc = iframeId.contentWindow && iframeId.contentWindow.document || iframeId.contentDocument;
				iHeight = Math.max(iDoc.body.scrollHeight, iDoc.documentElement.scrollHeight);
				iframeId.style.height = iHeight + 'px';
			}, 30);
		}
	};

	// 处理 Dom 操作
	var Dom = {

		/**
		 * @member Dom
		 * @description 根据 id 获取元素的 dom 结点
		 * @return {Dom}
		 * @example
		 *
		 */
		getById : function(id){
			return (typeof id === 'string') ?  document.getElementById(id) : id;
		},

		/**
		 * @member Dom
		 * @description 获取元素标签的结果集
		 * @return
		 * @example
		 *
		 */
		getByTagName : function(parent, tagName){
			return (parent || document).getElementsByTagName(tagName);
		},

		/**
		 * @member Dom
		 * @description 根据指定的元素获取这个元素下类为 clsName 的结果集
		 * @return {Dom Array}
		 * @example
		 * 
		 */
		getByClass : function(parent, clsName){
			if (!parent || !clsName) return false;
			var result = [], i, elem;
			if (parent.getElementsByClassName){
				elem = parent.getElementsByClassName(clsName), len = elem.length;
				for (i = 0; i < len; i++) {
					result.push(elem[i]);
				}
			} else {
				var reg = new RegExp('(^|\\s)' + clsName + '(\\s|$)');
				elem = Dom.getByTagName(document, '*'), len = elem.length;
				for (i = 0; i < len; i++) {
					reg.test(elem[i].className) && result.push(elem[i]);
				}
			}
			return result;
		},

		/**
		 * @member Dom
		 * @description 根据元素和类来判断所给元素是否有这个类
		 * @return (true || false)
		 * @example
		 *
		 */
		hasClass : function(elem, clsName){
			if (!elem || !clsName) return false;
			var reg = new RegExp('(^|\\s)' + clsName + '(\\s|$)');
			return reg.test(elem.className);
		},

		/**
		 * @member Dom
		 * @description 移除指定元素的指定类
		 * @return {Dom}
		 * @example
		 *
		 */
		removeClass : function(elem, clsName) {
			if (!elem || !clsName) return;
			if (Dom.hasClass(elem, clsName)){
				var regExp = new RegExp('(\\s*)' + clsName + '(\\s*)');
				elem.className = elem.className.replace(regExp, ' ').trim();
			}
		},

		/**
		 * @member Dom
		 * @description 根据指定元素来删除这个元素下指定的所有类名为 clsName
		 * @return {Dom}
		 * @example
		 *
		 */
		removeAllClass : function(parent, clsName){
			if (!parent || !clsName) return;
			var removeCls = Dom.getByClass(parent, clsName), len = removeCls.length;
			removeCls.each(function(_this, index){
				Dom.removeClass(_this, clsName);
			});
		},

		/**
		 * @member Dom
		 * @description 为指定的元素添加类
		 * @return {Dom}
		 * @example
		 *
		 */
		addClass : function(elem, clsName){
			if (!elem || !clsName) return;
			if (!Dom.hasClass(elem, clsName)) {
				elem.className = elem.className ? elem.className + ' ' + clsName : clsName;
			}
		},

		/**
		 * @member Dom
		 * @description 用新的类替换当前元素旧的类，如果类不存在，直接添加新的类
		 * @return  {Dom}
		 * @example
		 *
		 */
		replaceClass : function(elem, oldClsName, newClsName){
			if (!elem) return;
			if (Dom.hasClass(elem, oldClsName)) {
				var regExp = new RegExp('(^|\\s)' + oldClsName + '(?=\\s|$)');
				elem.className = elem.className.replace(regExp, "$1" + newClsName);
			} else {
				Dom.addClass(elem, newClsName);
			}
		},

		/**
		 * @member Dom
		 * @description 切换当前元素的类
		 * @return {Dom}
		 * @example
		 *
		 */
		toggleClass : function(elem, oldClsName, newClsName){
			newClsName = newClsName || '';
			if (Dom.hasClass(elem, oldClsName)) {
				Dom.replaceClass(elem, oldClsName, newClsName);
			} else {
				Dom.replaceClass(elem, newClsName, oldClsName);
			}
		},

		/**
		 * @member Dom
		 * @description 计算元素的样式
		 * @return
		 * @example
		 *
		 */
		css : function(elem, attr) {
			return elem.currentStyle ? elem.currentStyle[attr] : getComputedStyle(elem, false)[attr];
		},

		/**
		 * @member Dom
		 * @description 一次添加多个 css 的属性
		 * @return
		 * @example
		 *
		 */
		setStyle : function(elem, obj) {
			for (var i in obj) {
				obj.hasOwnProperty(i) && (elem.style[i] = obj[i]);
			}
		},

		/**
		 * @member Dom
		 * @description 设置透明度
		 * @return
		 * @example
		 *
		 */
		setOpacity : function(elem, alpha) {
			if (elem.filters) {
				elem.style.filter = 'alpha(opacity=' + alpha + ')';
			} else {
				elem.style.opacity = alpha / 100;
			}
		},

		/**
		 * @member Dom
		 * @description 获取元素到浏览器顶部的距离
		 * @return {Dom}
		 * @example
		 *
		 */
		getPos : function(elem){
			var pos = {left:0, top:0};
			while(elem) {
				pos.left += elem.offsetLeft;
				pos.top += elem.offsetTop;
				elem = elem.offsetParent;
			}
			return pos;
		}

	};

	// 处理 Event 事件
	var Event = {

		/**
		 * @member Event
		 * @description 获取事件的event对象
		 * @return {event对象}
		 * @example
		 *
		 */
		getEvent : function(event) {
			return event ? event : window.event;
		},

		/**
		 * @member Event
		 * @description 获取事件的target对象
		 * @return {target对象}
		 * @example
		 *
		 */
		getTarget : function(event) {
			return event.target || event.srcElement;
		},

		/**
		 * @member Event
		 * @description 添加事件
		 * @return {true or false}
		 * @example
		 *
		 */
		addEvent : function(node, type, fn) {
			if (!node) return false;
			if (node.addEventListener) {
				node.addEventListener(type, fn, false);
				return true;
			} else if (node.attachEvent) {
				node['e' + type + fn] = fn;
				node[type + fn] = function() {
					node['e' + type + fn](window.event);
				};
				node.attachEvent('on' + type, node[type + fn]);
				return true;
			}
			return false;
		},

		/**
		 * @member Event
		 * @description 删除事件
		 * @return {true or false}
		 * @example
		 *
		 */
		removeEvent : function(node, type, fn) {
			if (!node) return false;
			if (node.removeEventListener) {
				node.removeEventListener(type, fn, false);
				return true;
			} else if (node.detachEvent) {
				node.detachEvent('on' + type, node[type + fn]);
				node[type + fn] = null;
				return true;
			}
			return false;
		},

		/**
		 * @member Event
		 * @description 当窗口位置调整时，调用函数
		 * @return
		 * @example
		 *
		 */
		addResizeEvent : function(fn) {
			var timer = null;
			Event.addEvent(window, 'resize', function(){
				timer && clearTimeout(timer);
				timer = setTimeout(fn, 100);
			});
		},

		/**
		 * @member Event
		 * @description 阻止冒泡
		 * @return
		 * @example
		 *
		 */
		stopBubble : function(ev) {
			if (ev.stopPropagation){
				ev.stopPropagation();
			} else {
				ev.cancelBubble = true;
			}
		},

		/**
		 * @member Event
		 * @description 阻止默认事件
		 * @return
		 * @example
		 *
		 */
		preventDefault : function(ev) {
			if (ev.preventDefault){
				ev.preventDefault();
			} else {
				ev.returnValue = false;
			}
		},

		/**
		 * @member Event
		 * @description 阻止冒泡和默认事件
		 * @return
		 * @example
		 *
		 */
		stopEvent : function(ev) {
			Event.stopBubble(ev);
			Event.preventDefault(ev);
		},

		/**
		 * @member Event
		 * @description 用于向上下文指向不同对象的元素添加事件
		 * @return
		 * @example
		 *
		 */
		proxy : function(fn, context) {
			var slice = Array.prototype.slice;
			if (!Type.isFunction(fn)) {
				return undefined;
			}
			var args = slice.call(arguments, 2);
			return function() {
				return fn.apply(context, args.concat(slice.call(arguments)));
			};
		}
	};

	// 判断各种数据类型
	var Type = (function() {

		/**
		 * @member Type
		 * @description 判断各种数据类型
		 * @return {true or false}
		 * @example
		 *
		 */
		var func = ['String', 'Array', 'Function', 'RegExp', 'Number', 'Date', 'Boolean'],
			type = {};

		func.each(function(value, index){
			type['is' + value] = function(obj) {
				return Object.prototype.toString.call(obj) === '[object ' + value + ']';
			}
		});

		/**
		 * @member Type
		 * @description 判断是否是 dom 元素
		 * @return {true or false}
		 * @example
		 *
		 */
		function isElement(obj) {
			return !!(obj && obj.nodeType == 1);
		}

		/**
		 * @member Type
		 * @description 判断是否是 undefined
		 * @return {true of false}
		 * @example
		 *
		 */
		function isUndefined(obj) {
			return typeof obj === 'undefined';
		}

		return {
			isString    : type['isString'],
			isArray     : type['isArray'],
			isFunction  : type['isFunction'],
			isRegExp    : type['isRegExp'],
			isNumber    : type['isNumber'],
			isDate      : type['isDate'],
			isBoolean   : type['isBoolean'],
			isElement   : isElement,
			isUndefined : isUndefined
		};

	})();

	// 元素的拖动效果
	var Drag = {
		start : function(obj){
			var disX = disY = 0, isDrag = false;

			var oTarget = Dom.getById(obj);

			// 获取要拖动元素的标题
			var oH2 = Dom.getByTagName(oTarget, 'h2')[0];

			// 按住标题拖动
			Event.addEvent(oH2, 'mousedown', function(event){
				var event = Event.getEvent(event);
				isDrag = true;
				
				// disX 和 disY 是一个固定值，是鼠标点的位置到元素的左边和上边的距离
				// 可以根据元素移动的 clientX 和 clientY 来求出它们距顶部和左边的距离
				disX = event.clientX - oTarget.offsetLeft;
				disY = event.clientY - oTarget.offsetTop;

				oH2.style.cursor = 'move';

				this.setCapture && this.setCapture();
				return false;
			});

			Event.addEvent(document, 'mousemove', function(event){
				if (!isDrag) return;
				oH2.style.cursor = 'move';
				var event = Event.getEvent(event);

				// 元素在移动过程中距离顶部和左边的距离
				var left = event.clientX - disX,
					top = event.clientY - disY;

				// 元素移动的最大范围
				var maxL = document.documentElement.clientWidth - oTarget.offsetWidth,
					maxT = document.documentElement.clientHeight - oTarget.offsetHeight;

				// 元素移动的最小范围和最大范围
				left = left < 0 ? 0 : left;
				left = left > maxL ? maxL : left;
				top = top < 0 ? 0 : top;
				top = top > maxT ? maxT : top;

				oTarget.style.left = left + 'px';
				oTarget.style.top = top + 'px';

				return false;
			});

			Event.addEvent(document, 'mouseup', function(){
				isDrag = false;
				oH2.style.cursor = 'default';
				oH2.releaseCapture && oH2.releaseCapture();
			});
		}
	};

	// 常用的 tab 切换
	var Tab = {
		start : function(obj, method){
			if (!obj) return;
			method = method || 'click'; // 默认为点击事件
			var tab = Dom.getById(obj),
				tabNav = Dom.getByClass(tab,'tabNav'),
				tabContent = Dom.getByClass(tab, 'tabContent'),
				len = tabNav.length;

			for(var i = 0; i < len; i++) {
				tabNav[i].index = i;
				Event.addEvent(tabNav[i], method, function(){
					for (var j = 0; j < len; j++){
						Dom.removeClass(tabNav[j], 'active');
						tabContent[j].style.display = 'none';
					}
					tabNav[this.index].className = 'active';
					tabContent[this.index].style.display = 'block';
				});
			}

		}
	};

	// 判断浏览器
	var Browser = (function(){
	})();

	// Tween类
	var Tween = {
		Linear : function(t,b,c,d) { 
			return c*t/d + b; 
		},
		Quad : {
			easeIn : function(t,b,c,d) {
				return c*(t/=d)*t + b;
			},
			easeOut: function(t,b,c,d) {
				return -c *(t/=d)*(t-2) + b;
			},
			easeInOut: function(t,b,c,d) {
				if ((t/=d/2) < 1) return c/2*t*t + b;
				return -c/2 * ((--t)*(t-2) - 1) + b;
			}
		},
		Cubic : {
			easeIn: function(t,b,c,d) {
				return c*(t/=d)*t*t + b;
			},
			easeOut: function(t,b,c,d) {
				return c*((t=t/d-1)*t*t + 1) + b;
			},
			easeInOut: function(t,b,c,d) {
				if ((t/=d/2) < 1) return c/2*t*t*t + b;
				return c/2*((t-=2)*t*t + 2) + b;
			}
		},
		Quart : {
			easeIn: function(t,b,c,d) {
				return c*(t/=d)*t*t*t + b;
			},
			easeOut: function(t,b,c,d) {
				return -c * ((t=t/d-1)*t*t*t - 1) + b;
			},
			easeInOut: function(t,b,c,d) {
				if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
				return -c/2 * ((t-=2)*t*t*t - 2) + b;
			}
		},
		Quint : {
			easeIn: function(t,b,c,d) {
				return c*(t/=d)*t*t*t*t + b;
			},
			easeOut: function(t,b,c,d) {
				return c*((t=t/d-1)*t*t*t*t + 1) + b;
			},
			easeInOut: function(t,b,c,d) {
				if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
				return c/2*((t-=2)*t*t*t*t + 2) + b;
			}
		}
	};
		
	// 各种常用的验证方式
	var Validate = (function(){

		/**
		 * @member Validate
		 * @description 验证手机号码
		 * @return {true or false}
		 * @example
		 *
		 */
		function checkPhone(code) {
			var ret = true,
				reg = /^(13[0-9]\d{8})$|^(14[57])\d{8}$|^(15[0-35-9])\d{8}$|^(18[0-9])\d{8}$/;
			if (!code || !reg.test(code)){
				ret = false;
			}
			return ret;
		}

		/**
		 * @member Validate
		 * @description 验证固定电话 020-87463743 | 0754-7553665
		 * @return {true or false}
		 * @example
		 *
		 */
		function checkTel(code) {
			var ret = true,
				reg = /^\d{3}-\d{8}|\d{4}-\d{7}$/;
			if (!code || !reg.test(code)){
				ret = false;
			}
			return ret;
		}

		/**
		 * @member Validate
		 * @description 验证邮箱
		 * @return {true or false}
		 * @example
		 *
		 */
		function checkEmail(code) {
			var ret = true,
				reg = /^[a-zA-Z0-9]+[0-9|aA-zZ|_|\.|-]*@([0-9|aA-zZ]{2,30}\.){1,4}[aA-zZ]{2,}$/i;
			if (!code || !reg.test(code)){
				ret = false;
			}
			return ret;
		}

		/**
		 * @member Validate
		 * @description 验证邮政编码
		 * @return {true or false}
		 * @example
		 *
		 */
		function checkZipCode(code) {
			var ret = true,
				reg = /^[0-9]{6}$/i;
			if (!code || !reg.test(code)){
				ret = false;
			}
			return ret;
		}

		/**
		 * @member Validate
		 * @description 验证身份证
		 * @return {true or false}
		 * @example
		 *
		 */
		function checkIdCard(code) {
			var ret = true,
			//地址编码
			city = {11:'北京',12:'天津',13:'河北',14:'山西',15:'内蒙古',21:'辽宁',22:'吉林',23:'黑龙江 ',31:'上海',32:'江苏',33:'浙江',34:'安徽',35:'福建',36:'江西',37:'山东',41:'河南',42:'湖北 ',43:'湖南',44:'广东',45:'广西',46:'海南',50:'重庆',51:'四川',52:'贵州',53:'云南',54:'西藏 ',61:'陕西',62:'甘肃',63:'青海',64:'宁夏',65:'新疆',71:'台湾',81:'香港',82:'澳门',91:'国外'},
			//加权因子
			factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
			//校验位
			parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2],
			reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i,
			ai = 0,
			wi = 0,
			sum = 0,
			i = 0;
			
			if(!code){
				ret = false;
			}else if(!reg.test(code)){
				ret = false;
			}else if(!city[code.substr(0,2)]){
				ret = false;
			}else{
				//18位身份证需要验证最后一位校验位
				if(code.length == 18){
					for(; i < 17; i++){
						ai = parseInt( code.charAt(i) );
						wi = factor[i];
						sum += ai * wi;
					}
					
					if(parity[sum % 11] != code.charAt(17)){
						ret = false;
					}
				}
			}
			return ret;
		}

		/**
		 * @member Validate
		 * @description 验证日期 yyyy-mm-dd
		 * @return {true or false}
		 * @example
		 *
		 */
		function checkDate(code){
			var ret = true,
				reg = /^\d{4}-\d{2}-\d{2}$/ig;
			if (!code || !reg.test(code)){
				ret = false;
			}
			return ret;
		}

		/**
		 * @member Validate
		 * @description 验证QQ
		 * @return {true or false}
		 * @example
		 *
		 */
		function checkQQ(code){
			var ret = true,
				reg = /^[1-9]\d{4,11}$/;
			if (!code || !reg.test(code)){
				ret = false;
			}
			return ret;
		}

		return {
			checkPhone   : checkPhone,
			checkTel     : checkTel,
			checkEmail   : checkEmail,
			checkZipCode : checkZipCode,
			checkIdCard  : checkIdCard,
			checkDate    : checkDate,
			checkQQ      : checkQQ
		};

	})();

	// 兼容所有浏览器的 console 实现方式
	(function(){
		var noop = function(){},
		
			methods = ['warn', 'time', 'timeEnd', 'info', 'error', 'log', 'dir', 'trace', 'profile', 'assert', 'debug'],
			console = window.console || {},
			length = methods.length;

		while (length--){
			console[methods[length]] = console[methods[length]] || noop;
		}
		
	})();

	return {
		tool     : Tool,         // 实用的工具类
		dom      : Dom,          // Dom的常用操作
		event    : Event,        // 事件
		type     : Type,         // 数据类型判断
		drag     : Drag,         // 拖动
		tab      : Tab,			 // Tab 切换
		browser  : Browser,      // 浏览器
		tween    : Tween,         // 
		validate : Validate      // 验证
	};
});
