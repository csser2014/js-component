define(['util', 'prototype', 'proxy', 'json2'], function(util, prototype, proxy, json) {

	/**
	 * @member sdCalendar.ui
	 * @description 实现特定的日历
	 * @return
	 * @example 
	 *
	 * new sdCalendar({id : 'calender'});
	 *
	 */

	/**
	 * fldInnId 		代表 酒店id
	 * fldBrandId   	代表 酒店品牌id
	 * fldScore     	代表 酒店评分
	 * fldRoomTypeId    代表 房型id
	 * fldDays          代表 预定天数
	 * fldFromDate      代表 预定开始日期
	 * fldPlanName      代表 价格方案
	 *
	 */

	var sdCalendar = function(args) {
		// 默认参数
		var defArgs = {
			id       : 'sdCalendar'          // 默认 id 为 sdCalendar
		};

		this.cfg = util.tool.extend(defArgs, args);

		this.init();
	};	

	util.tool.extend(sdCalendar.prototype, {

		init : function() {
		var _t = this;

			_t.sdCalendar = util.dom.getById('sdCalendar');

			if (_t.sdCalendar == null || !_t.sdCalendar) return;

			// 房型和数量
			_t.ROOM_TEMPL = [
				'<div class="roominfo_number">',
					'<h5>你已选择</h5>',
					'<p>房型：<span id="fldRoomTypeName">{ROOMTYPE}</span></p>',
					'<p>',
						'<span>数量：</span>',
						'<select name="roomCount" id="fldRoomCount">',
							'<option selected="selected" value="1">1间</option>',
							'<option value="2">2间</option>',
							'<option value="3">3间</option>',
						'</select>',
					'</p>',
				'</div>',
				'<div class="roominfo_tip">',
					'<p>房型介绍：<span id="roomSummary">{ROOMSUMMARY}</span></p>',
					'<div class="roominfo_orderNumber">',
						'<p class="ft-l">预订天数：<span id="fldDaysDisp">0天</span></p>',
						'<div id="periodDisCntr">',
							'<ul id="{DATE_0}">',
							'</ul>',
							'<ul id="{DATE_1}">',
							'</ul>',
							'<ul id="{DATE_2}">',
							'</ul>',
							'<ul id="{DATE_3}">',
							'</ul>',
						'</div>',
					'</div>',
				'</div>'
			];

			// 预订天数
			_t.ORDER_TEMPL = [
				'<li>',
					'<span class="s1">入住：</span>',
					'<span class="start-live">{START_DATE}</span>',
					'~',
					'<span class="s1">离店：</span>',
					'<span class="end-live">{END_DATE}</span>',
				'</li>'
			]

			// 网站前缀
			_t.prefixUrl = path;
			
			// 查询用户信息
			_t.queryUserInfo();

			// 设置 loading 的位置
			_t.loadingPos = util.dom.getPos(_t.sdCalendar);
			
			// 创建所需要的层
			_t.createWrap();

			// 获取当前的年和月和日
			var d = new Date();

			_t.year = d.getFullYear();
			_t.month = d.getMonth() + 1;
			_t.day = d.getDate();

			// 判断是否是当前年月
			_t.isCurMonthFlag = 1; 

			// 保存已经加载的数据
			_t.arrData = [];  		

			// 从页面传过来的房型的id
			_t.data_id = util.dom.getById('fldRoomTypeId').value;  	
			
			// 从页面传过来的酒店的id
			_t.fldInnId = util.dom.getById('fldInnId');

			// 从页面传过来的品牌id
			_t.brandId = util.dom.getById('fldBrandId');

			// 从页面传过来的日期
			_t.fldFromDate = util.dom.getById('fldFromDate');

			// 从页面传过来的天数
			_t.fldDays = util.dom.getById('fldDays');

			// 从页面传过来的支付方式
			_t.showPayType = util.dom.getById('showPayType');

			// 从页面传过来的价格方案
			_t.fldPlanName = util.dom.getById('fldPlanName').value;

			// 从页面传过来的用来保存不同数据的id
			_t.bNo = util.dom.getById('bNo').value;

			var item_showPayType = util.dom.getByClass(document, 'item-showPayType')[0];

			_t.showPayType.value === "0" ? item_showPayType.style.display = 'none' : 
											item_showPayType.style.display = 'block';

			// 从页面传过来的酒店评分
			_t.fldScore = util.dom.getById('fldScore');
			util.dom.getByClass(document, 'score')[0].innerHTML = '满意率 ' + _t.fldScore.value + '%';

			// 是否线上第三方注册勾选提示
			_t.fldShowThirdRegister = util.dom.getById('fldShowThirdRegister');

			_t.fldShowThirdRegister.value === "0" ? util.dom.getByClass(document, 'regOtherMember')[0].style.display = 'none' : 
											util.dom.getByClass(document, 'regOtherMember')[0].style.display = 'block';

			(_t.fldShowThirdRegister.value === "0") && (util.dom.getById('reg_o_member').checked = false);

			// 保存选择每个月的天数
			_t.arrMonth = []; 		

			// 实际支付
			_t.fldPriceTotal = util.dom.getById('fldPriceTotal');

			// 门市价
			_t.bp_price_1 = util.dom.getById('bp-price-1');

			// 卡的类型
			_t.bp_price_2 = util.dom.getById('bp-price-2');
			_t.arrCardType = ['门市', '普卡', '银卡', '公司会员', '一卡代理', '金卡', '白金卡'];
			
			// 已节省金额
			_t.fldDiscountTip = util.dom.getById('fldDiscountTip');

			// 房间数，默认是1间
			_t.roomCount = 1;

			// 保存选择门市价格
			_t.saveDoorPrice = 0; 

			// 保存选择普卡价格
			_t.saveNormalPrice = 0;

			// 保存选择是否要支付
			_t.arrNeedPay = []; 		

			// 保存支付的值
			_t.addNeedPay = 0;

			_t.selectDay = 0;

			_t.needPayTip = util.dom.getByClass(document, 'isNeedPay')[0];

			// 用户信息
			_t.USERINFO = {
				memberId    : 0,    // 判断有没有登录，小于 1 就是没有登录
				mebType     : 0,	// 默认没有登录的时候是0
				memberName  : '',   // 用户名
				mobilePhone : ''    // 手机号
			};

			// 根据当前月份，创建连续的四个月份
			_t.createMonth(_t.year, _t.month);

			// 创建表头
			_t.createHeader();

			// 根据当前月份的天数创建表格
			_t.createDay();

			// 根据当前年月日创建房型
			_t.createRoomType(_t.year, _t.month, _t.day);

			// 邦定事件
			_t.bindEvent();

			// 提交订单
			_t.submitOrder();

			// 配套设施
			_t.getRoomTypeFacility();

		},

		queryUserInfo : function() {
			var _t = this;

			var param = {},

			callback = {
				success : function(res) {
					var userName = util.dom.getById('userName'),    				// 导航的用户名
						usersUsablePoint = util.dom.getById('usersUsablePoint'),    // 导航的积分
						usersCash = util.dom.getById('usersCash'),   				// 导航的储值

						logout = util.dom.getById('logout'),

						unloginNav = util.dom.getById('unlogin-info'),
						loginNav = util.dom.getById('login-info'),
						topnavMenu = util.dom.getByClass(loginNav, 'topnav_bthmenu')[0],
						topnav = util.dom.getByClass(loginNav, 'topnav_bthmenu_popup')[0],
						formBooking = util.dom.getById('formBooking'),
						fields = util.dom.getByClass(formBooking, 'fields')[0];

					_t.fldName = util.dom.getById('fldName');
					_t.fldPhone = util.dom.getById('fldPhone');

					// 卡的类型
					_t.USERINFO.mebType = res.mebType;

					// 登录 id
					_t.USERINFO.memberId = res.memberId;

					_t.USERINFO.memberName = res.memberName;
					_t.USERINFO.mobilePhone = res.mobilePhone;

					// 填充信息
					if (res.memberId > 0) {
						_t.fldName.value = res.memberName;
						_t.fldPhone.value = res.mobilePhone;
					}
					
					userName.innerHTML = res.memberName;
					usersUsablePoint.innerHTML = res.usablePoint;
					usersCash.innerHTML = res.cash;

					if (res.mebType === 0) {
						util.dom.getById('bp-card-type').innerHTML = '普卡';
					} else {
						util.dom.getById('bp-card-type').innerHTML = _t.arrCardType[res.mebType];
					}

					// 导航
					if (_t.USERINFO.memberId < 1) {
						unloginNav.style.display = 'block';
						loginNav.style.display = 'none';
						util.dom.getById('bookingLoginWrap').style.display = 'block';
						fields.style.display = 'none';
					} else {
						unloginNav.style.display = 'none';
						loginNav.style.display = 'block';
						util.dom.getById('bookingLoginWrap').style.display = 'none';
						fields.style.display = 'block';
					}

					util.event.addEvent(topnavMenu, 'mouseover', function(){
						topnav.style.display = 'block';
					});

					util.event.addEvent(topnavMenu, 'mouseout', function(){
						topnav.style.display = 'none';
					});

				},

				failure : function(e) {
				}
			};
			proxy.MService.queryUserInfo(param, callback);
		},

		createWrap : function() {
			var _t = this, 

				roomPriceCal = document.createElement('div'),

				sd_bd = document.createElement('div'),
				roomPriceData = document.createElement('div'),
				sd_ft = document.createElement('div');


			_t.sd_hd = document.createElement('div');
			_t.sdroomType = document.createElement('div');
			_t.selectRoomInfo = document.createElement('div');

			_t.sdCalendar.style.display = 'none';

			roomPriceData.id = 'roomPriceData';
			roomPriceCal.id = 'roomPriceCal';

			_t.sdroomType.id = 'sdroomType';

			_t.sd_hd.id = 'sd_hd';

			sd_bd.id = 'sd_bd';
			sd_bd.className = 'clearfix';

			sd_ft.id = 'sd_ft';

			_t.selectRoomInfo.className = 'select_room_info clearfix';

			_t.table = document.createElement('table');
			_t.table.id = 'sd_cal_table';

			sd_bd.appendChild(_t.table);

			roomPriceCal.appendChild(_t.sd_hd);
			roomPriceCal.appendChild(sd_bd);
			roomPriceCal.appendChild(sd_ft);

			roomPriceData.appendChild(roomPriceCal);
			roomPriceData.appendChild(_t.selectRoomInfo);

			_t.sdCalendar.appendChild(_t.sdroomType);
			_t.sdCalendar.appendChild(roomPriceData);
			roomPriceCal = roomPriceData = sd_bd = sd_ft = null;
		},

		createRoomType : function(year, month, day) {
			var _t = this, i = 0, liStr = '', roomPlanName,
				sMonth = month.toString().leftFix('0', 2),
				sDay = day.toString().leftFix('0', 2),
				oUl = document.createElement('ul'),

				param = {
					innId : _t.fldInnId.value,
					fromDate : year + '-' + sMonth + '-' + sDay,
					days : _t.fldDays.value,
					planName : encodeURIComponent(_t.fldPlanName),
					rtId : _t.data_id
				};

			var callback = {
				success : function(res) {
					var roomType = res.roomTypes, 
						roomTypeId = res.roomTypeId,
						roomTypeName,
						len = roomType.length;


					for (; i < len; i++) {
						 roomTypeName = roomType[i].name.replace(/^(.*)(\(特惠价\))$/g, function($0, $1, $2){
							return $1 + ('<b>' + $2 + '</b>');
						});
						roomPlanName = (roomType[i].planName === null ? '' : roomType[i].planName);
						(roomType[i].typeID === roomTypeId && _t.fldPlanName == roomPlanName) ? 
							liStr += '<li class="cur" data_id=' + roomType[i].typeID + ' data_bNo=' + roomType[i].bNo + ' data_planame=' + roomPlanName + '>' + roomTypeName + '</li>' : 
							liStr += '<li data_id=' + roomType[i].typeID + ' data_bNo=' + roomType[i].bNo + ' data_planname=' + roomPlanName + '>' + roomTypeName + '</li>';
					}

					oUl.innerHTML = liStr;

					if (roomTypeId === '' || roomTypeId === 0) {
						var li = util.dom.getByTagName(oUl, 'li')[0];
						util.dom.addClass(li, 'cur');
						_t.data_id = roomType[0].typeID;
					}

					_t.sdroomType.appendChild(oUl);

					oUl = null;

					// 根据当前月份填充表格
					_t.appendData(_t.year, _t.month);

					// 显示房型和日期
					_t.sdCalendar.style.display = 'block';

					// 邦定点击房型事件
					_t.changeRoomType();

					// 选择房间数和提示
					_t.getSelectRoom(); 

					_t.isCurMonthFlag = _t.isCurMonth(year, sMonth);

					_t.getRoomDates(year, month, day, _t.isCurMonthFlag, roomTypeId, _t.fldPlanName, _t.bNo, false);

				},
				failure : function(e) {
				}
			};

			proxy.MService.getBookingInfo(param, callback);
		},

		// 显示loading
		showLoading : function() {
			var _t = this;
			_t.loadingDiv = document.createElement('div');
			_t.loadingDiv.id = 'loading';
			util.dom.setStyle(_t.loadingDiv, {
				position : 'absolute',
				left     : _t.loadingPos.left + 'px',
				top      : _t.loadingPos.top + 'px',
				width    : '664px',
				height   : '520px'
			});
			document.body.appendChild(_t.loadingDiv);
		},

		// 隐藏loading
		hideLoading : function() {
			var _t = this;
			document.body.removeChild(_t.loadingDiv);
		},

		// 判断是不是当前的年和月
		isCurMonth : function(tYear, tMonth) {
			var _t = this;
			if (tYear == _t.year && tMonth == _t.month) {
				return 1;
			} else {
				return 0;
			}
		},

		createMonth : function(year, month) {
			var _t = this, result, data_ref, i = 0, oLi = '',
				oUl = document.createElement('ul'), curSelect = '',
				compareDate, tmpYear = year, tmpMonth = month;

			for (; i < 4; i++) {
				// 月份大于12，则为明年的(月份 - 12)
				if (month > 12) {
					tmpYear = year + 1;
					tmpMonth = month - 12;
				} else {
					tmpMonth = month;
				}

				result = tmpYear + '年' + tmpMonth + '月';
				compareDate = tmpYear + '-' + tmpMonth.toString().leftFix('0', 2);
				data_ref = compareDate + '-' + '01';

				// 选中日期
				(i == 0) ? (curSelect = ' class="on"') : (curSelect = '');

				oLi += '<li data_ref="' + data_ref + '"' + curSelect + '>' + result + '</li>';

				month++;
			}

			oUl.className = 'sdCalMonth clearfix';
			oUl.innerHTML = oLi;
			_t.sd_hd.appendChild(oUl);
			oUl = null;
		},

		createHeader : function() {
			var header = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
			var oThead = document.createElement('thead'), _t = this,
				oTr = document.createElement('tr'), i = 0;
			
			for (; i < 7; i++) {
				var oTh = document.createElement('th');
				oTh.innerHTML = header[i];
				oTr.appendChild(oTh);
			}
			oThead.appendChild(oTr);
			_t.table.appendChild(oThead);
			oTr = oThead = oTh = null;
		},

		createDay : function() {
			var _t = this, i = 0;

			// 生成表格
			var tBody = document.createElement('tbody');
			for (; i < 6; i++) {
				var oTr = document.createElement('tr');
				for (var j = 0; j < 7; j++) {
					var oTd = document.createElement('td');
					oTr.appendChild(oTd);
				}
				tBody.appendChild(oTr);
			}
			_t.table.appendChild(tBody);
			tBody = oTr = oTd = null;
		},

		appendData : function(year, month) {
			// 清空 td 表格的数据，避免月份切换的时候出现之前的数据
			var _t = this, cTd = util.dom.getByTagName(_t.table, 'td'),
				len = cTd.length, innStr = '', k = 0, m = 0,

				// getFirstFromMonth 和 getDayInMonth 的 month 参数是没有加 '0' 的
				firstDay = Date.getFirstFromMonth(year, parseInt(month, 10)),    // 获取参数的年月的1号是星期几
				dayTotal = Date.getDayInMonth(year, parseInt(month, 10));        // 返回月份的天数

			for (; k < len; k++) {
				cTd[k].innerHTML = '';
			}
			
			dayTotal = dayTotal + firstDay;
			for (; m < 42; m++) {
				if (m >= firstDay && m < dayTotal) {
						innStr = '<a><span class="bd_date">' + (m - firstDay + 1) + '</span></a>';
				} else {
					innStr = '<a><span class="bd_date"></span></a>';
				}
				cTd[m].innerHTML = innStr;
			}
		},

		bindEvent : function() {
			var _t = this;

			// 点击表格的 td，把当前的 td 选中
			_t.selectPrice();

			// 切换月份
			_t.changeMonth(); 

		},

		selectPrice : function() {
		   var sd_cal_table = util.dom.getById('sd_cal_table'),
			   oTd = util.dom.getByTagName(sd_cal_table, 'td'),
		   	   len = oTd.length, _t = this, i = 0;

		   for (; i < len; i++) {
			   oTd[i].index = i;
			   util.event.addEvent(oTd[i], 'click', function(){
				   var bd_date = util.dom.getByTagName(this, 'span')[0];
				   var oA = util.dom.getByTagName(this, 'a')[0];
				   
				   var tPrice = util.dom.getByTagName(this, 'b')[0];

				   // 门市价
				   var doorPrice = util.dom.getByTagName(this, 'i')[0];

				   if (util.dom.hasClass(oA, 'money') && !util.dom.hasClass(oA, 'noRoom')) {

					   // 切换选中状态
					   util.dom.toggleClass(this, 'select');

					   var bdValue = parseFloat(bd_date.innerHTML),
						   bdPrice = parseFloat(tPrice.innerHTML),
						   bdDoorPrice = parseFloat(doorPrice.innerHTML),

						   // 是否需要支付
						   needPay = util.dom.getByTagName(this, 'u')[0].innerHTML;

					   // 获取天数并把天数添加到数组或者从数组删除天数
					   if (util.dom.hasClass(this, 'select')) {
						   
						   // 添加
						   _t.arrMonth[_t.curMonth].push(bdValue);

						   // 添加是否需要支付
						   _t.arrNeedPay[_t.curMonth].push(needPay);

						   (needPay === "1") && (_t.addNeedPay++);

						   // 实际支付和会员价
						   _t.saveDoorPrice = _t.saveDoorPrice + bdDoorPrice;
						   _t.saveNormalPrice = _t.saveNormalPrice + bdPrice;

						   _t.showPriceInfo();

						   _t.selectDay++;
					   } else {

						   // 删除
						   if (_t.arrMonth[_t.curMonth].in_array(bdValue)){
							   var idx = _t.arrMonth[_t.curMonth].indexOf(bdValue);
							   _t.arrMonth[_t.curMonth].splice(idx, 1);
						   }

						   if (_t.arrNeedPay[_t.curMonth].in_array(needPay)){
							   var idx = _t.arrNeedPay[_t.curMonth].indexOf(needPay);
							   _t.arrNeedPay[_t.curMonth].splice(idx, 1);
						   }

						   (needPay === "1") && (_t.addNeedPay--);

						   // 实际支付和会员价
						   _t.saveDoorPrice = _t.saveDoorPrice - bdDoorPrice;
						   _t.saveNormalPrice = _t.saveNormalPrice - bdPrice;

						   _t.showPriceInfo();

						   _t.selectDay--;
					   }

					   // 从小到大排序
					   _t.arrMonth[_t.curMonth].sort(function(a, b){
						   return a > b ? 1 : -1;
					   });

					   // 生成选择的月份并显示
					   _t.getDateInterval();

					   // 显示是否需要支付信息
					   _t.showNeedPayTips();
				   }

				   // 提示选择的天数
				   util.dom.getById('fldDaysDisp').innerHTML = _t.selectDay + '天';

			   });
		   }
		},

		showNeedPayTips : function() {
			var _t = this;
			if (_t.addNeedPay === 0) {
				_t.needPayTip.style.display = 'none';
			} else {
				_t.needPayTip.style.display = 'block';
			}
		},

		// 显示价格信息
		showPriceInfo : function() {
			var _t = this;
			_t.bp_price_1.innerHTML = '￥' + _t.round((_t.saveDoorPrice * _t.roomCount), 2);
			_t.bp_price_2.innerHTML = '￥' + _t.round((_t.saveNormalPrice * _t.roomCount), 2);
			_t.fldPriceTotal.innerHTML = _t.round((_t.saveNormalPrice * _t.roomCount), 2);
			_t.fldDiscountTip.innerHTML = '已节省' + _t.round(((_t.saveDoorPrice - _t.saveNormalPrice) * _t.roomCount), 2) + '元';
		},

		getDateInterval : function() {
			var _t = this, 
				i = k = j = 0, 
				result = '', 
				firstTime = true,
				retObj = {},
				
				// 保存当前年月中选中的日期
				tmpMonth = _t.arrMonth[_t.curMonth], 
				tLen = tmpMonth.length,
				rYear = _t.curMonth.split('-')[0],
				rMonth = _t.curMonth.split('-')[1],

				totalDay = Date.getDayInMonth(rYear, parseInt(rMonth, 10)),        // 返回月份的天数

				yearMonth = rYear + '-' + rMonth;


			for (; i < tLen; i++) {
				
				// 是否是连续的数字
				if (tmpMonth[i] + 1 != tmpMonth[i+1]) {


					if (firstTime) {
						retObj.startTime = yearMonth + '-' + tmpMonth[0].toString().leftFix('0', 2);
						firstTime = false;
					} else {
						retObj.startTime = yearMonth + '-' + tmpMonth[k+1].toString().leftFix('0', 2);
					}

					// 判断点击的是否是最后一天
					if ((i == tLen - 1) && parseInt(tmpMonth[i], 10) === parseInt(totalDay, 10)) {

						// 点击月份最后一天，则后天就是下个月的1号，同时要处理12月的最后一天
						retObj.endTime = _t.isLastMonthDay(rYear, rMonth);

					} else {
							retObj.endTime = yearMonth + '-' + (tmpMonth[i] + 1).toString().leftFix('0', 2);
					}

					k = i;
					
					result += _t.ORDER_TEMPL.join('').format({'START_DATE' : retObj.startTime, 'END_DATE' : retObj.endTime});

					retObj = {};
				}
			}

		   util.dom.getById(_t.curMonth).innerHTML = result;
		},

		isLastMonthDay : function(rYear, rMonth) {
			if (rMonth === '12'){
				rMonth = '01';
				rYear = parseInt(rYear, 10) + 1;
			} else {
				rMonth = parseInt(rMonth, 10) + 1;
			}
			return rYear.toString().leftFix('0', 2) + '-' + rMonth.toString().leftFix('0', 2) + '-' + '01';
		},

		changeMonth : function() {
			var _t = this, oUl = util.dom.getByClass(_t.sd_hd, 'sdCalMonth')[0]; 

			// 判断当前年月是否有保存数据
			_t.saveMonthToDay();

			util.event.addEvent(oUl, 'click', function(e){
				var event = util.event.getEvent(e),
					target = util.event.getTarget(event);

				if (target.tagName.toLowerCase() === 'li') {
					data_ref = target.getAttribute('data_ref').split('-');
					
					// 切换月份
					_t.appendData(data_ref[0], data_ref[1]);

					_t.isCurMonthFlag = _t.isCurMonth(data_ref[0], data_ref[1]);
					(_t.isCurMonthFlag == 1) ? sDay = _t.day : sDay = data_ref[2];

					util.dom.removeAllClass(_t.table, 'select');

					util.dom.removeAllClass(oUl, 'on');
					util.dom.addClass(target, 'on');

					_t.saveMonthToDay();

					// 加载房价信息
					_t.getRoomDates(data_ref[0], data_ref[1], sDay, _t.isCurMonthFlag, _t.data_id, _t.fldPlanName, _t.bNo, false);
				}
			});
		},

		showSelectDay : function(isSelect) {
			var _t = this, j = 0,
				tmpMonth = _t.arrMonth[_t.curMonth], needPay,
				aLen = tmpMonth.length, bd_price, bd_full,
				bd_date = util.dom.getByClass(_t.table, 'bd_date'),
				oTd = util.dom.getByTagName(_t.table, 'td');
				(isSelect === true) && (_t.selectDay = 0);
				(isSelect === true) && (_t.addNeedPay = 0);

			for (; j < aLen; j++){
				for (var i = 0;i < 42; i++){
					if (parseInt(bd_date[i].innerHTML, 10) === tmpMonth[j]) {
							bd_price = util.dom.getByTagName(bd_date[i].parentNode, 'b')[0];
							bd_full = util.dom.getByClass(bd_date[i].parentNode, 'full')[0];

							if (isSelect === false) {
								util.dom.addClass(oTd[i], 'select');
								break;
							} else {
								// 满或者为0
								if (((bd_price !== undefined) && (parseInt(bd_price.innerHTML, 10) != 0)) || !util.dom.hasClass(bd_full, 'full')) {
									util.dom.addClass(oTd[i], 'select');
									needPay = util.dom.getByTagName(oTd[i], 'u')[0].innerHTML;
									_t.selectDay++;

								    _t.arrNeedPay[_t.curMonth].push(needPay);
								   (needPay === "1") && (_t.addNeedPay++);

									break;
								} else {
								   _t.arrMonth[_t.curMonth].splice(j, 1);
								}
							}
					}
				}
			}
			_t.showNeedPayTips();
		},

		saveMonthToDay : function() {
			var _t = this,

			oUl = util.dom.getByClass(_t.sd_hd, 'sdCalMonth')[0];

			_t.curMonth = util.dom.getByClass(oUl, 'on')[0].getAttribute('data_ref');

			var month = 'month_' + _t.curMonth;

			if (typeof _t.arrMonth[_t.curMonth] === 'undefined') {
				_t.arrMonth[_t.curMonth] = [];
			}

			if (typeof _t.arrNeedPay[_t.curMonth] === 'undefined') {
				_t.arrNeedPay[_t.curMonth] = [];
			}
		},

		changeRoomType : function() {
			var _t = this, sDay, kMonth,
				oUl = util.dom.getByTagName(_t.sdroomType, 'ul')[0];

			util.event.addEvent(oUl, 'click', function(e){
				var dataRef = util.dom.getByClass(_t.sd_hd, 'on')[0];

				dataRef = dataRef.getAttribute('data_ref').split('-');

				(_t.isCurMonthFlag == 1) ? sDay = _t.day : sDay = dataRef[2];

				var event = util.event.getEvent(e),
					target = util.event.getTarget(event);

				if (target.tagName.toLowerCase() === 'li') {

					var sLi = util.dom.getByTagName(_t.sd_hd, 'li'),
						sLi_len = sLi.length, k = 0;

					// 选择房型的时候，把不是当前选中的其它月份的选中去掉
					util.dom.removeAllClass(_t.table, 'select');
				    for (; k < sLi_len; k++) {
					    kMonth = sLi[k].getAttribute('data_ref');
					    if (kMonth !== _t.curMonth) {
							_t.arrMonth[kMonth] = [];
					    }
						_t.arrNeedPay[kMonth] = [];
				    }

					_t.data_id = target.getAttribute('data_id');

					_t.fldPlanName = target.getAttribute('data_planname');

					_t.bNo = target.getAttribute('data_bno');

					util.dom.removeAllClass(oUl, 'cur');
					util.dom.addClass(target, 'cur');

					util.dom.getById('fldRoomTypeName').innerHTML = target.innerHTML;

					_t.appendData(dataRef[0], dataRef[1]);

					_t.getRoomDates(dataRef[0], dataRef[1], sDay, _t.isCurMonthFlag, _t.data_id, _t.fldPlanName, _t.bNo, true);

					_t.updateSummary();

					_t.getRoomTypeFacility();

				}
			});
		},

		clearDate : function() {
			var periodDisCntr = util.dom.getById('periodDisCntr'),
				oUl = util.dom.getByTagName(periodDisCntr, 'ul'),
				uLen = oUl.length, i = 0;

			for (; i < uLen; i++) {
				oUl[i].innerHTML = '';
			}
				
		},
		
		reCalcPrice : function() {
			var _t = this, i = 0, tDoorPrice = 0, tPrice = 0,
				oSelect = util.dom.getByClass(_t.table, 'select'),
				nLen = oSelect.length;

			_t.saveDoorPrice = 0;
			_t.saveNormalPrice = 0;

			for (; i < nLen; i++) {
				tDoorPrice = parseFloat(util.dom.getByTagName(oSelect[i], 'i')[0].innerHTML);
				tPrice = parseFloat(util.dom.getByTagName(oSelect[i], 'b')[0].innerHTML);
			   _t.saveDoorPrice = _t.saveDoorPrice + tDoorPrice;
			   _t.saveNormalPrice = _t.saveNormalPrice + tPrice;
			}

			_t.showPriceInfo();
		},

		// flag 1代表 从当天可以填充数据，0 代表从1号开始填充数据
		getRoomDates : function(tYear, tMonth, tDay, flag, roomTypeId, roomPlanName, bNo, isSelect) {
			var _t = this, tMonth = parseInt(tMonth, 10), tDay = parseInt(tDay, 10),
				rDate = tYear + '-' + tMonth.toString().leftFix('0', 2) + '-' + '01';

			var typeId = 'type' + bNo,
				dateId = 'date' + rDate;

			if (_t.arrData[typeId] == undefined){
				_t.arrData[typeId] = [];
			}

			var firstDay = Date.getFirstFromMonth(tYear, tMonth);    // 获取参数的年月的1号是星期几
			var dayTotal = Date.getDayInMonth(tYear, tMonth);        // 返回月份的天数

			oA = util.dom.getByTagName(_t.table, 'a');

			// retDay 计算要开始填充数据的位置
			if (flag == 1) {
				retDay = firstDay + tDay - 1;
			} else if (flag == 0) {
				retDay = firstDay;
			}
			
			// 要填充的数据的天数
			fillDay = dayTotal - tDay + 1;

			if (_t.arrData[typeId][dateId] != undefined) {
				_t.render(_t.arrData[typeId][dateId], oA, retDay, fillDay, isSelect);
				return;
			}

			var param = {
				innId    : _t.fldInnId.value,
				date     : rDate,
				planName : encodeURIComponent(roomPlanName),
				rtId     : roomTypeId
			};

			_t.showLoading();

			var callback = {
				success : function(res) {
					var rLen = res.length;

					_t.arrData[typeId][dateId] = res;

					if (rLen < 0) return;

					_t.render(res, oA, retDay, fillDay, isSelect);

					_t.hideLoading();
				},
				failure : function(e) {
				}
			};
			proxy.MService.getRoomDates(param, callback);
		},

		// 渲染数据
		render : function(result, table_a, cDay, tDayTotal, isSelect) {
			var _t = this, generalRoomRate, memberTypeDiscountRates, roomDoorPrice,
				roomRate, i =0, hasRoom, rLen = result.length, isNeedPay;

			for (; i < tDayTotal; i++) {

				if (i >= rLen) break;

				roomRate = result[i].forecastRoomStatus.showMemberRoomRate || 0;
				roomDoorPrice = result[i].forecastRoomStatus.memeberRoomRate || 0;

				hasRoom = result[i].forecastRoomStatus.hasRoom;
				isNeedPay = result[i].forecastRoomStatus.isNeedPay;

				var price = document.createElement('span');
				price.className = 'price';
				price.innerHTML = '￥' + '<b>' + _t.round(roomRate, 2) + '</b><i>' + _t.round(roomDoorPrice, 2) + '</i><u>' + isNeedPay + '</u>';

				table_a[cDay].className = 'money';
				table_a[cDay].appendChild(price);

				if (hasRoom === false) {

					util.dom.addClass(table_a[cDay], 'noRoom');

					var oHasRoom = document.createElement('span');
					oHasRoom.className = 'full';
					table_a[cDay].appendChild(oHasRoom);
				}

				cDay++;

			}

			// 重新显示之前出现的选择日期
			_t.showSelectDay(isSelect);

		   // 提示选择的天数
		   if (isSelect === true){
			   util.dom.getById('fldDaysDisp').innerHTML = _t.selectDay + '天';

				// 清空已经选择的日期
				_t.clearDate();

				_t.getDateInterval();
		   }

			// 重新计算价格
			(isSelect === true) && (_t.reCalcPrice());

			price = null;
		},

		submitOrder : function() {
			var _t = this, msg = '',
				isClick = false,
				orderBtn = util.dom.getByClass(document, 'btnBooking-submit')[0],
				fldErrorMsg = util.dom.getById('fldErrorMsg'),
				tFldName = util.dom.getById('fldName'),
				tFldPhone = util.dom.getById('fldPhone'),
				formBooking = util.dom.getById('formBooking');


			util.event.addEvent(orderBtn, 'click', function(){

				if (isClick === true) return;


				if (_t.USERINFO.memberId < 1) {
					fldErrorMsg.innerHTML = '亲，您还未登录哦，请登录后继续操作。';
					return;
				}

				if (tFldName.value.trim() === '') {
					fldErrorMsg.innerHTML = '入住人姓名不能为空。';
					return;
				} else if (tFldPhone.value.trim() === '') {
					fldErrorMsg.innerHTML = '入住人手机号码不能为空。';
					return;
				} else if (!util.validate.checkPhone(tFldPhone.value)){
					fldErrorMsg.innerHTML = '入住人手机号码不正确。';
					return;
				} else {
					fldErrorMsg.innerHTML = '';
				}


				var periodDisCntr = util.dom.getById('periodDisCntr'), arrTime = [],
					oLi = util.dom.getByTagName(periodDisCntr, 'li'), diffDay,
					tLength = oLi.length, i = 0, startLive, endLive, tmpDate;

				if (!tLength || tLength === 0)  {
					fldErrorMsg.innerHTML = '请选择日期再提交订单！';
					return;
				}
				
				// 把选中的日期添加到数组中去
				for (; i < tLength; i++){
					var startLive = util.dom.getByClass(oLi[i], 'start-live')[0].innerHTML,
						endLive = util.dom.getByClass(oLi[i], 'end-live')[0].innerHTML;

					diffDay = Date.DateDiff(startLive, endLive);

					if (diffDay == 1) {
						arrTime.push(startLive);
					} else {
						for (var j = 0; j < diffDay; j++) {
							tmpDate = new Date(startLive.replace(/-/g, '/'));
							arrTime.push(tmpDate.addDays(j).dateToString());
						}
					}
				}

				var dt = new Date(), k = 0, v_folioPayType = -2,
					v_folioPayType, dates = [];

				arrTime.each(function(value, index){
					dates.push(new Date(value.replace(/-/g, '/')).toISOString());
				});

				// 是否注册心享会
			    _t.reg_o_member = util.dom.getById('reg_o_member').checked;

				if (_t.showPayType.value === '0') {
					v_folioPayType = '-1';
				} else {
					payRadio = util.dom.getByClass(document, 'payRadio');
					for (; k < payRadio.length; k++) {
						if (payRadio[k].checked) {
							v_folioPayType = payRadio[k].value;
							break;
						}
					}
				}

				if (v_folioPayType === -2) {
					return;
				}

				var tmpObj = {
					arriveDate         : new Date(arrTime[0].replace(/-/g, '/')).toISOString(),
					bookingDates       : dates,
					bookingGuestName   : encodeURIComponent(_t.USERINFO.memberName),
					bookingMobilePhone : _t.USERINFO.mobilePhone,
					bookingType        : "normal",
					departureDate      : new Date(arrTime[arrTime.length-1].replace(/-/g, '/')).addDays(1).toISOString(), // 加1天
					folioPayType       : v_folioPayType,
					guestNames         : tFldName.value,
					guestPhone         : tFldPhone.value,
					innID              : _t.fldInnId.value,
					remark             : "",
					memberDocNo        : null,
					roomCount          : _t.roomCount,
					roomTypeID         : _t.data_id,
					planName           : encodeURIComponent(_t.fldPlanName),
					sellerId           : 0,
					regOtherMember     : _t.reg_o_member
				};

				var param = JSON.stringify(tmpObj);

				isClick = true;
				util.dom.addClass(orderBtn, 'gray');

				var callback = {
					success : function(res) {
						isClick = false;
						util.dom.removeClass(orderBtn, 'gray');
						if (res.result === 'success') {
							window.location.href = _t.prefixUrl + '/booking/bookingResult.do?brandId=' + _t.brandId.value;
						} else if (res.result === 'failed') {
							fldErrorMsg.innerHTML = res.message;
							return;
						}
					},
					failure : function(res) {
						isClick = false;
						util.dom.removeClass(orderBtn, 'gray');
					}
				}
				proxy.MService.getBooking(param, callback);
			});
		},

		updateSummary : function() {
			var _t = this,
				param = {
					roomTypeId : _t.data_id, 
					innId : _t.fldInnId.value
				},

				callback = {
					success : function(res) {
						util.dom.getById('roomSummary').innerHTML  = res.success;
					},
					failure : function(res) {
					}
				};

			proxy.MService.getRoomSummary(param, callback);
		},

		getSelectRoom : function() {
			var _t = this, sdCalendarLi = util.dom.getByTagName(_t.sd_hd, 'li'),
				aLen = sdCalendarLi.length, i = 0, 
				obj = {};

			for (; i < aLen; i++){
				obj['DATE_' + i] = sdCalendarLi[i].getAttribute('data_ref');
			}

			var param = {
					roomTypeId : _t.data_id, 
					innId : _t.fldInnId.value
				},

				callback = {
					success : function(res) {
						var data = res, result,
							roomType = util.dom.getByClass(_t.sdroomType, 'cur')[0];

						result = _t.ROOM_TEMPL.join('').format({'ROOMTYPE' : roomType.innerHTML, 'ROOMSUMMARY' : data.success,
								   'DATE_0' : obj.DATE_0, 'DATE_1' : obj.DATE_1, 'DATE_2' : obj.DATE_2, 'DATE_3' : obj.DATE_3});

						_t.selectRoomInfo.innerHTML = result;

						_t.changeRoomNumber();
					},
					failure : function(res) {
					}
				};

			proxy.MService.getRoomSummary(param, callback);
		},

		changeRoomNumber : function() {
			var _t = this;

		   _t.fldRoomCount = util.dom.getById('fldRoomCount');

			util.event.addEvent(_t.fldRoomCount, 'change', function(){

				_t.roomCount = this.value;

				if (parseFloat(_t.fldPriceTotal.innerHTML) > 0) {
					_t.bp_price_1.innerHTML = '￥' + _t.round((_t.saveDoorPrice * _t.roomCount), 2);
					_t.bp_price_2.innerHTML = '￥' + _t.round((_t.saveNormalPrice * _t.roomCount), 2);
					_t.fldPriceTotal.innerHTML = _t.round((_t.saveNormalPrice * _t.roomCount), 2);
					_t.fldDiscountTip.innerHTML = '已节省' + _t.round(((_t.saveDoorPrice - _t.saveNormalPrice) * _t.roomCount), 2) + '元';
				}
			});
		},

		getRoomTypeFacility : function() {
			var _t = this, resultDd = '',
				resultFacility = '', sLen, i = 0,
				ptss = util.dom.getById('ptss'),
				ptss_dl = util.dom.getByClass(ptss, 'ptss-dl')[1],
				param = {
					roomTypeId : _t.data_id, 
					innId : _t.fldInnId.value
				},

				callback = {
					success : function(res) {
						sLen = res.length;
						if (sLen > 0) {
							for (; i < sLen; i++) {
								resultDd += '<dd><em class="true fixpng">&nbsp;</em><span class="ptss-span">' + res[i] + '</span></dd>';
							}
							resultFacility += '<dt>房间设施</dt>'  + resultDd;
							ptss_dl.innerHTML = resultFacility;
						} else {
							ptss_dl.innerHTML = '<dt>房间设施</dt>';
						}
					},
					failure : function(res) {
					}
				};

			proxy.MService.getRoomTypeFacility(param, callback);
		},

		// 四舍五入
		round : function(num, digit){   
			return Math.round(num * Math.pow(10, digit)) / Math.pow(10, digit);   
		}   

	});

	return {
		sdCalendar : sdCalendar
	};

});
