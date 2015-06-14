define(['jquery', 'mapui', 'proxy', 'pageui', 'popui'], function($, mapui, proxy, pageui, popui){
	
	/**
	 * @member
	 * @description 根据百度地图进行扩展，实现自定义地图
	 * @return 
	 * @example
	 *
	 */

	var HotelMap = function(args) {
		// 默认参数
		var defArgs = {
			mapNode : 'MapContent', 	// 地图的 ID
			map     : null,          	// 地图对象
			city    : '广州'            // 如果接口没有数据，默认的城市为广州
		};

		this.cfg = $.extend({}, defArgs, args);

		this.init();

	};

	$.extend(HotelMap.prototype, {
		init : function() {

			var _t = this;
			
			_t.map = new mapui.Map(_t.cfg.mapNode, {enableMapClick:false}); 			  // 初始化地图
			//console.log(_t.map);

			_t.map.enableScrollWheelZoom();                       // 在地图中使用鼠标滚轮控制缩放

			/**
			 * anchor表示控件的停靠位置，即控件停靠在地图的哪个角。当地图尺寸发生变化时，控件会根据停靠位置的不同来调整自己的位置
			 * anchor: BMAP_ANCHOR_TOP_LEFT 表示控件定位于地图的左上角，默认
			 * type : BMAP_NAVIGATION_CONTROL_LARGE 表示显示完整的平移缩放控件
			 * offset : 示控件距离地图边界有多少像素
			 */
			_t.map.addControl(new mapui.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE, offset: new mapui.Size(10, 10)}));

			// 这两句
			_t.map.centerAndZoom(_t.cfg.city, 12); 
			_t.map.setCurrentCity(_t.cfg.city); 

			_t.bindEvent();

		},
		
		// 邦定各种事件
		bindEvent : function() {
			var _t = this;

			_t.setPosition();

			_t.proxy(1448, 1);

			// 改变窗口，同时调整页面元素的位置
			$(window).resize(function(){
				_t.setPosition();
			});

		},

		// 调整窗口的位置
		setPosition : function() {
			var wHeight = $(window).height();
			var topHeight = $('.phd').outerHeight();
			var searchPage = $('#page').outerHeight();
			var searchSort = $('.search-sort').outerHeight();
			$('#MapContent').height(wHeight - topHeight);
			$('.search-list').height(wHeight - topHeight - searchPage - searchSort);
		},

		// 调用接口，获取数据
		proxy : function(totalNum, curPage, isLoading){
			var _t = this;
			var param = {
				c : decodeURI(_t.cfg.city),
				pno : curPage,
				s   : 15
			};
			if (isLoading){
				_t.oPop = new popui.Pop({isMark : true, content : '内容加载中...', isShowTitle : false});
			}
			var callback = {
				success : function(res){

					_t.fetchData(res.data.dataList);

					_t.hotelList(res.data.dataList);

					_t.totalNum = res.data.totalNum;

					new pageui.Page({total : _t.totalNum, adjust:1, curPage : curPage, showPrev : true, showNext : true, pageSize : 15, callback : _t.proxy, context : _t, isLoading : true});
					if (isLoading){
						_t.oPop.destroy();
					}
				},
				failure : function(e){
				}
			};
			proxy.MService.search(param, callback);
		},

		// 处理获取数据
		fetchData : function(dataList) {
			var _t = this;

			var points = [];
			var datas = [];
			var markers = [];

			// 如果接口没有数据
			if (dataList.length == 0) {

				_t.map.clearOverlays(); // 清除地图上所有覆盖物

				_t.map.centerAndZoom(_t.cfg.city, 12); // 初始化地图，设置中心点坐标和地图级别，如果center类型为字符串时，比如“广州”，第二个参数可以忽略，地图将自动根据center适配最佳zoom级别

				return false;
			}

			for (var i = 0; i < dataList.length; i++) {
				if (dataList[i].jingdu && dataList[i].weidu) {
					var point = new mapui.Point(parseFloat(dataList[i].jingdu), parseFloat(dataList[i].weidu)); // 创建坐标点
					points.push(point);
					datas.push(dataList[i]);
				}
			}

			if (points.length > 0) {
				_t.map.clearOverlays();    // 清除地图上所有覆盖物
				_t.map.setViewport(points, {margins:[40, 20, 20, 20]}); // 实现最佳视野内坐标
				$(window).resize(function(){
					_t.map.setViewport(points, {margins:[40, 20, 20, 20]});
				});

				/*
				地图API提供了如下几种覆盖物：
					Overlay  : 覆盖物的抽象基类，所有的覆盖物均继承此类的方法。
					Marker   : 标注表示地图上的点，可自定义标注的图标。
					Label    : 表示地图上的文本标注，您可以自定义标注的文本内容。
					Polyline : 表示地图上的折线。
					Polygon  : 表示地图上的多边形。多边形类似于闭合的折线，另外您也可以为其添加填充颜色。
					Circle   : 表示地图上的圆。
				*/

				for (var i = 0; i < points.length; i++) {
					// 自定义覆盖物
					var hm = new HotelMarker({
						index : i,
						point : points[i],
						hotelName : datas[i].hotelName,
						zoneUrl : datas[i].zoneUrl,
						minPriceRmb : datas[i].minPriceRmb
					});  
					markers.push(hm);
					
					_t.map.addOverlay(hm); // 将覆盖物添加到地图中，一个覆盖物实例只能向地图中添加一次

				}
			} else{
				_t.map.clearOverlays();
				_t.map.centerAndZoom(_t.cfg.city, 12);
			}
		},

		// 显示右边酒店的信息
		hotelList : function(data) {

			var i, dataLen = data.length, 
				result = ''; 
			
			// 没有酒店信息
			if (!data.length && data.length == 0) {
				// todo 提示
				return false;
			}
			
			// 右边酒店信息模板
			var TEMPLATE = [
				'<li>',
					'<div class="infoName">',
						'<h4><a href="#">{hotelName}</a></h4>',
						'<p><span>积分</span><span>77</span></p>',
						'<img alt="" src="images/sday.png">',
					'</div>',
					'<span class="icon-num">{num}</span>',
					'<div class="infoPrice">',
						'<a href="javascript:void(0);">满意率:<b>89%</b></a>',
						'<div class="price">￥<em>{price}</em>起</div>',
					'</div>',
				'</li>'
			];

			for (i = 0; i < dataLen; i++) {
				var t_hotelName = data[i].hotelName,
					t_minPriceRmb = data[i].minPriceRmb;
				result += TEMPLATE.join("").format({hotelName : t_hotelName, price : t_minPriceRmb, num : i+1});
			}
			$('.search-list ul').empty().append(result);
		}
	});

	
	function HotelMarker(args) {
		var defArgs = {
			index       : '',
			point       : '',
			hotelName   : '',
			zoneUrl     : '',
			minPriceRmb : ''
		};

		this.cfg = $.extend({}, defArgs, args);
	};

	HotelMarker.prototype = new mapui.Overlay();

	$.extend(HotelMarker.prototype, {
		// 抽象方法，用于初始化覆盖物，当调用map.addOverlay时，API将调用此方法。自定义覆盖物时需要实现此方法。自定义覆盖物时需要将覆盖物对应的HTML元素返回
		initialize : function(map) {
			var t = this;
			t.map = map;
			t.div = $('<div></div>');
			t.div.css({
				position	:	'absolute',
				width		:	'36px',
				height		:	'42px',					
				whiteSpace	:	'nowrap',
				fontSize	:	'12px',
				cursor		:	'pointer',
				zIndex		: 	mapui.Overlay.getZIndex(t.cfg.point.lat)
			});
			t.span = $('<span></span>');
			t.span.css({
				position	:	'absolute',
				top			:	'1px',
				left		:	'19px',
				height		:	'32px',
				lineHeight	:	'32px',
				border		:	'2px solid #f41e55',
				borderRadius:	'4px',
				background	:	'#fff',
				padding		:	'0 6px 0 18px'
			});
			t.div.append(t.span);
			t.a = $('<a></a>');
			t.a.css({
				color			:	'#000',
				textDecoration	:	'none'
			});
			t.a.attr({
				'href'		:	/*t.cfg.zoneUrl + '?sd=' + sd + '&ed=' + ed,*/ 'http://www.baidu.com',
				'target'	:	'_blank'
			});
			t.a.text(t.cfg.hotelName + ' ￥');
			t.span.append(t.a);
			t.strong = $('<strong><strong>');
			t.strong.css({
				fontSize		:	'18px',
				fontFamily		:	'微软雅黑',
				fontWeight		:	'normal',
				color			:	'#dc590a',
				verticalAlign	:	'middle',
				display			:	'inline'
			});
			t.strong.text(parseInt(t.cfg.minPriceRmb, 10));
			t.span.append(t.strong);
			t.p = $('<p></p>');
			t.p.css({
				position	:	'absolute',
				top			:	'0',
				left		:	'0',
				width		:	'36px',
				height		:	'42px',
				lineHeight	:	'34px',
				textAlign	:	'center',
				color		:	'#fefefe',
				fontSize	:	'20px',
				fontFamily	:	'微软雅黑'
				//background	:	'url(' + exports.CONST.STATIC_PREFIX + '/images/hotel/map-icon.png) 0 -162px no-repeat'
			});
			t.p.text(t.cfg.index + 1);
			t.div.append(t.p);
			t.bind();
			/* 地图提供了若干容器供覆盖物展示，通过map.getPanes方法可以得到这些容器元素，它们包括：
				floatPane         : 信息窗口内容
				markerMouseTarget : 标注点击区域层
				floatShadow       : 信息窗口阴影层
				labelPane         : 文本标注层
				markerPane        : 标注层
				mapPane           : 矢量图形层
			*/
			$(t.map.getPanes().labelPane).append(t.div);	 // 返回地图覆盖物容器列表
			//map.centerAndZoom(t.cfg.point, 18);
			return t.div[0];
		},
		
		// 抽象方法，当地图状态发生变化时，由系统调用对覆盖物进行绘制。自定义覆盖物需要实现此方法
		draw	:	function(){
	    	var t = this;
			// 根据地理坐标转换为像素坐标
		    var pixel = t.map.pointToOverlayPixel(t.cfg.point);
		    t.div.css({
		    	left:pixel.x - 18 + 'px',
		    	top:pixel.y - 42 + 'px'
		    });
	    },

		// 
		bind : function() {
			var _t = this;

			_t.div.mouseenter(function(){
				_t.span.css({
					borderColor:'#f9af0f'	
				});
				_t.p.css({
					backgroundPosition:'0 -253px'
				});		 
				$(this).css({
					zIndex:'999'	
				});		
			});

			_t.div.mouseleave(function(){
				_t.span.css({
					borderColor:'#f41e55'	
				});
				_t.p.css({
					backgroundPosition:'0 -162px'
				});		 
			});
		}
	});

	return {
		HotelMap : HotelMap
	};

});
