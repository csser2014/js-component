define(['util', 'prototype'], function(util, prototype) {

	/**
	 * @member 
	 * @description 实现点击 input 弹出热门城市框
	 * @return 
	 * @example 
	 *  
	 */

	var PopCity = function(args) {
		// 默认参数
		var defArgs = {
			clsName  : 'city',			 // 点击弹出热门框的默认类名
			callback : function(){},     // 回调函数
			context  : ''                // 回调函数的上下文
		};

		this.data = [{"HOT":["三亚","海口","厦门","桂林","丽江","成都","广州","上海","杭州","北京","黄山","西安","苏州","青岛","大连","深圳","武汉","南京","宁波","昆明","沈阳","天津","无锡","南昌","香港","澳门","台湾"]},{"ABCD":["阿坝","阿里山","安阳","鞍山","澳门","白沙","白山","蚌埠","包头","保山","保亭","北戴河","北海","北京","亳州","博鳌","长春","长沙","常熟","常州","成都","池州","滁州","承德","重庆","大理","大连","大同","丹东","儋州","德州","定安","东莞","东营","都江堰","敦煌"]},{"EFGHJ":["峨眉山","恩施","佛山","福州","赣州","高雄","广州","贵阳","桂林","贵州","哈尔滨","海口","杭州","合肥","菏泽","衡山","呼和浩特","葫芦岛","虎门","怀柔","淮安","淮北","黄冈","黄山","惠州","基辅","基隆","吉林","济南","佳木斯","嘉兴","江阴","金华","荆门","景德镇","九寨沟"]},{"KLMNPQ":["喀什","开封","昆明","拉萨","兰州","廊坊","乐东","丽江","聊城","临沂","陵水","柳州","龙岩","洛阳","漯河","马鞍山","满洲里","绵阳","牡丹江","南昌","南京","南宁","南通","宁波","宁德","攀枝花","蓬莱","平遥","普陀山","齐齐哈尔","千岛湖","秦皇岛","青岛","琼海","曲阜","泉州"]},{"RSTW":["日照","三亚","山海关","汕头","上海","韶关","韶山","绍兴","深圳","沈阳","十堰","石家庄","石狮","顺义","苏州","台北","台湾","台州","太原","泰安","泰山","唐山","天津","通州","吐鲁番","万宁","威海","潍坊","温州","文昌","乌鲁木齐","无锡","五指山","武当山","武汉","武夷山"]},{"XYZ":["西安","西宁","厦门","咸阳","香港","香格里拉","湘西","襄阳","新乡","徐州","许昌","雅安","烟台","盐城","扬州","阳朔","宜昌","义乌","银川","营口","岳阳","湛江","张家港","张家界","肇庆","镇江","郑州","中山","重庆","舟山","株洲","珠海","驻马店","淄博","自贡","遵义"]}];	

		this.cfg = util.tool.extend(defArgs, args);

		this.init();

		this.bindEvent();
	};

	util.tool.extend(PopCity.prototype, {

		init : function() {
			var _t = this;

			_t.oCity = util.dom.getByClass(document, _t.cfg.clsName)[0];

			_t.render();
		},

		// 处理数据，并填充到 Dom 结构
		render : function() {
			var _t = this,

				// 定义热门的 tab
				tab = ['HOT', 'ABCD', 'EFGHJ', 'KLMNPQ', 'RSTW', 'XYZ'];

			// 初始化页面上的 DOM 结构
			_t.oPopCity = document.createElement('div');
			_t.oPopCity.className = 'pop-city-ui';

			// Header
			var oPopCityHeader = document.createElement('div');
			oPopCityHeader.className = 'pop-city-header';
			oPopCityHeader.innerHTML = '可输入城市拼音/汉字';
			_t.oPopCity.appendChild(oPopCityHeader);
			oPopCityHeader = null;
			
			// Tab
			_t.oPopCityTab = document.createElement('ul');
			_t.oPopCityTab.className = 'pop-city-tab clearfix';
			_t.oPopCity.appendChild(_t.oPopCityTab);

			// Content
			_t.oPopCityContent = document.createElement('div');
			_t.oPopCityContent.className = 'pop-city-content';
			_t.oPopCity.appendChild(_t.oPopCityContent);

			document.body.appendChild(_t.oPopCity);

			// 把数组添加到热门 tab 上去
			var retTab = '', flag, i = 0,
				length = tab.length;

			for (; i < length; i++){
				flag = (i == 0) ? ' class="on"' : ''; // 默认把第一个选项设置为当前选项
				retTab += '<li' + flag + '>' + (tab[i] == 'HOT' ? '热门' : tab[i]) + '</li>';
			}
			_t.oPopCityTab.innerHTML = retTab;

			// 把数组热门tab的内容添加到对应 DOM 结构
			var j = 0, k, liLen,
				len = _t.data.length;

			for (; j < len; j++) {
				var tabContent = _t.data[j][tab[j]], // 对应的是每个 tab 的内容
					liContent = '';  

				for (k = 0, liLen = tabContent.length; k < liLen; k++){
					liContent += '<li><a href="javascript:void(0);">' + tabContent[k] +'</a></li>';
				}

				var ulContent = '<ul>' + liContent + '</ul>';
				var popList = document.createElement('div');
				popList.className = 'pop-city-list';
				popList.innerHTML = ulContent;

				(j == 0) ? util.dom.addClass(popList, 'cur') : ''; // 把第一个选项内容显示出来
				_t.oPopCityContent.appendChild(popList);
				popList = null;
			}
		},

		// 邦定事件
		bindEvent : function() {
			var _t = this, i = 0, j = 0,

				// 获取 tab 下的所有 li
				oCityTabLi = util.dom.getByTagName(_t.oPopCityTab, 'li'),  

				// 获取 pop-city-content 下所有的 pop-city-list
				oPopCityList = util.dom.getByClass(_t.oPopCityContent, 'pop-city-list'), 

				iLen = oCityTabLi.length,
				listLen = oPopCityList.length;

			_t.setPosition();

			// 处理弹出框的显示和隐藏
			util.event.addEvent(_t.oCity, 'click', function(e){
				_t.oPopCity.style.display = 'block';
				_t.oCity.select();
			});
			util.event.addEvent(_t.oCity, 'keyup', function(e){
				if (this.value != _t.city) {
					_t.oPopCity.style.display = 'none';
				}
			});

			// 处理 tab 的点击事件
			for (; i < iLen; i++) {
				oCityTabLi[i].index = i;
				util.event.addEvent(oCityTabLi[i], 'click', function(){

					// tab 标签
					util.dom.removeAllClass(_t.oPopCityTab, 'on');
					oCityTabLi[this.index].className = 'on';

					// tab 内容
					util.dom.removeAllClass(_t.oPopCityContent, 'cur');
					util.dom.addClass(oPopCityList[this.index], 'cur');

				});
			}
			
			// 点击热门城市后把值填充到 input 里去
			for (; j < listLen; j++) {
				oPopCityList[j].index = j;
				util.event.addEvent(oPopCityList[j], 'click', function(e){

					var event = util.event.getEvent(e),
						target = util.event.getTarget(event);
					if (target.tagName.toLowerCase() === 'a') {
						_t.city = target.innerHTML;
						_t.oCity.value = _t.city;
					}
					_t.oPopCity.style.display = 'none';

					// 如果回调函数可用，就直接执行
					if (_t.cfg.callback && util.type.isFunction(_t.cfg.callback)) {
						_t.cfg.callback.call(_t.cfg.context, _t.city);
					}
				});
			}

			// 处理 document 点击事件
			util.event.addEvent(document, 'click', function(e){
				var event = util.event.getEvent(e),
					target = util.event.getTarget(event);

				// 如果点击的目标不是 input 并且也不是 _t.oPopCityTab，就把 _t.oPopCity 隐藏
				if (target != _t.oCity && target.parentNode != _t.oPopCityTab) {
					_t.oPopCity.style.display = 'none';
				}

				return false;
			});
		},

		setPosition : function() {
			var _t = this, pos, left = 0, top = 0,
				screenWidth = document.documentElement.clientWidth || document.body.clientWidth,
				inputCityWidth = _t.oCity.offsetWidth,
				popCityWidth = parseInt(util.dom.css(_t.oPopCity, 'width'), 10) + 2;

			pos = util.dom.getPos(_t.oCity);

			left = pos.left;

			// 屏幕宽度的距离减去输入框到最左边的距离是否大于弹出框的距离
			if (screenWidth - pos.left < popCityWidth){
				left = pos.left - (popCityWidth - inputCityWidth);
			}

			var inputHeight = _t.oCity.offsetHeight;
			// 调整位置 
			_t.oPopCity.style.left = left + 'px';
			_t.oPopCity.style.top = pos.top + inputHeight - 1 + 'px';
		}
	});

	return {
		PopCity : PopCity
	};
});
