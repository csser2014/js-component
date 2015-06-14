define(['util', 'prototype', 'dataarea'], function(util, prototype, dataarea) {

	/**
	 * @member district.ui
	 * @description 
	 * @return
	 * @example 
	 *
	 */

	var District = function(args) {
		// 默认参数
		var defArgs = {
			clsName 	: 'startPlace',          // 输入框的类名，默认为 startPlace
			target      : this,
			id      	: 'area_tab_' + (new Date()).getTime(),
			idx_li_1 	: 'idx_li_1_' + (new Date()).getTime(),
			idx_li_2 	: 'idx_li_2_' + (new Date()).getTime(),
			idx_li_3 	: 'idx_li_3_' + (new Date()).getTime(),
			idx_li_4 	: 'idx_li_4_' + (new Date()).getTime(),
			idx_tab_1   : 'idx_tab_1_' + (new Date()).getTime(),
			idx_tab_2   : 'idx_tab_2_' + (new Date()).getTime(),
			idx_tab_3   : 'idx_tab_3_' + (new Date()).getTime(),
			idx_tab_4   : 'idx_tab_4_' + (new Date()).getTime()
		};

		this.cfg = util.tool.extend(defArgs, args);

		this.init();
	};	

	util.tool.extend(District.prototype, {

		init : function(){
			var _t = this;

			//_t.input = util.dom.getByClass(document, _t.cfg.clsName)[0];
			_t.input = _t.cfg.target;

			if (!_t.input || _t.input === null) return;

			// 定位
			_t.getPos();

			// 创建 html
			_t.createHTML();

			// 邦定事件
			_t.bindEvent();
		},

		createHTML : function() {
			var _t = this, oUl, oLi_1, oLi_2, oLi_3, oLi_4,
				oTab_b_common, oTab_b_province, oTab_b_city, 
				oTab_b_district, oCommon_Ul;

			_t.oDiv = document.createElement('div');
			_t.oDiv.id = _t.cfg.id;
			_t.oDiv.className = 'area-tab';

			oUl = document.createElement('ul');
			oUl.className = "ul-area-tab clearfix";

			oLi_1 = document.createElement('li');
			oLi_1.id = _t.cfg.idx_li_1;
			oLi_1.className = 's-tab-t current';
			oLi_1.innerHTML = '常用';

			oLi_2 = document.createElement('li');
			oLi_2.id = _t.cfg.idx_li_2;
			oLi_2.className = 's-tab-t';
			oLi_2.innerHTML = '省';

			oLi_3 = document.createElement('li');
			oLi_3.id = _t.cfg.idx_li_3;
			oLi_3.className = 's-tab-t';
			oLi_3.innerHTML = '市';

			oLi_4 = document.createElement('li');
			oLi_4.id = _t.cfg.idx_li_4;
			oLi_4.className = 's-tab-t';
			oLi_4.innerHTML = '区县';

			oUl.appendChild(oLi_1);
			oUl.appendChild(oLi_2);
			oUl.appendChild(oLi_3);
			oUl.appendChild(oLi_4);

			oTab_close = document.createElement('div');
			oTab_close.id = 'area-tab-close';

			oTab_b_common = document.createElement('div');
			oTab_b_common.className = 's-tab-b on';
			oTab_b_common.id = _t.cfg.idx_tab_1;

			oTab_b_province = document.createElement('div');
			oTab_b_province.className = 's-tab-b';
			oTab_b_province.id = _t.cfg.idx_tab_2;

			oTab_b_city = document.createElement('div');
			oTab_b_city.className = 's-tab-b';
			oTab_b_city.id = _t.cfg.idx_tab_3;

			oTab_b_district = document.createElement('div');
			oTab_b_district.className = 's-tab-b';
			oTab_b_district.id = _t.cfg.idx_tab_4;

			oCommon_Ul = document.createElement('ul');
			oCommon_Ul.className = 'clearfix';
			oCommon_Ul.innerHTML = _t.getCommonCity();

			oTab_b_common.appendChild(oCommon_Ul);

			oTab_b_province.innerHTML = _t.getProvince();

			_t.oDiv.appendChild(oUl);

			_t.oDiv.appendChild(oTab_close);

			_t.oDiv.appendChild(oTab_b_common);
			_t.oDiv.appendChild(oTab_b_province);
			_t.oDiv.appendChild(oTab_b_city);
			_t.oDiv.appendChild(oTab_b_district);

			_t.oDiv.style.left = _t.left;
			_t.oDiv.style.top = _t.top;

			document.body.appendChild(_t.oDiv);

			oLi_1 = oLi_2 = oLi_3 = oLi_4 = null;
			oTab_b_common = oTab_b_province = oTab_b_city = null;
			oTab_b_district = oCommon_Ul = oProvince_Ul = null;
		},

		// 获取常用城市
		getCommonCity : function() {
			var commonCity = '';
			for (var name in common_city) {
				commonCity += '<li><a code="' + name + '" class="panel-item" href="javascript:;">' + common_city[name] + '</a></li>';
			}
			return commonCity;
		},

		// 获取省份
		getProvince : function() {
			var strProvince = '', i = 0, strDL = '';
			for (var item in select_province) {
				strDL = '<dl class="panel-category">';
				strDL += '<dt>' + item + '</dt>';
				strDL += '<dd><ul class="clearfix">';
				for (var prov in select_province[item]) {
					strDL += '<li><a code="' + prov + '" class="panel-item" href="javascript:;">' + select_province[item][prov] + '</a></li>';
				}
				strDL += '</ul></dd>';
				strDL += '</dl>';
				strProvince += strDL;
			}
			return strProvince;
		},

		// 定位
		getPos : function() {
			var _t = this, pos;

			pos = util.dom.getPos(_t.input);
			_t.left = pos.left + 'px';
			_t.top = pos.top + _t.input.offsetHeight + 2 + 'px';
		},

		// 各种事件
		bindEvent : function(){
			var _t = this, event, target, 
				i = 0, s_tab_t, len;


			// 标签
			_t.ul_area_tab = util.dom.getByClass(_t.oDiv, 'ul-area-tab')[0];
			s_tab_t = util.dom.getByTagName(_t.ul_area_tab, 'li');
			len = s_tab_t.length;

			// 标签的内容
			_t.s_tab_b = util.dom.getByClass(_t.oDiv, 's-tab-b');

			for (; i < len; i++) {
				s_tab_t[i].index = i;
				util.event.addEvent(s_tab_t[i], 'click', function(){
					util.dom.removeAllClass(_t.ul_area_tab, 'current');
					util.dom.addClass(this, 'current');

					util.dom.removeAllClass(_t.s_tab_b, 'on');
					util.dom.addClass(_t.s_tab_b[this.index], 'on');
				});
			}

			_t.selectCityEvent();

			_t.selectProvince();

			_t.inputEvent();

			// 选择市
			_t.cityEvent();

			// 选择区县
			_t.districtEvent();

		},

		inputEvent : function() {
			var _t = this, event, target;

			util.event.addEvent(document, 'click', function(e){
				event = util.event.getEvent(e);
				target = util.event.getTarget(event);
				
				if (target !== null && target.parentNode !== null) {
					if (target != _t.input && target.parentNode != _t.ul_area_tab && target.parentNode.tagName != 'LI') {
						(_t.oDiv !== null && _t.oDiv.parentNode !== null) && (_t.oDiv.parentNode.removeChild(_t.oDiv));
					}
				}
				return false;
			});
		},

		// 常用
		selectCityEvent : function() {
			var _t = this, idx_1_cur;

			_t.idx_tab_1 = util.dom.getById(_t.cfg.idx_tab_1);
			_t.s_tab_li = util.dom.getByTagName(_t.ul_area_tab, 'li')[3];

			util.event.addEvent(_t.idx_tab_1, 'click', function(e) {
				var event, target, code;

				event = util.event.getEvent(e);
				target = util.event.getTarget(event);


				if (target.tagName.toLowerCase() === 'a'){

					idx_1_cur = util.dom.getByClass(_t.idx_tab_1, 'cur')[0];

					util.dom.removeClass(idx_1_cur, 'cur');
					util.dom.addClass(target, 'cur');

					util.dom.removeAllClass(_t.ul_area_tab, 'current');
					util.dom.addClass(_t.s_tab_li, 'current');

					// 标签4
					util.dom.removeAllClass(_t.s_tab_b, 'on');
					util.dom.addClass(_t.s_tab_b[3], 'on');

					code = target.getAttribute('code');

					// 省
					_t.getProvinceByCity(code);

					// 市
					_t.getCity(code); 

					_t.cityEvent();

					// 区县
					_t.getDistrictByCity(code);

					_t.fillInput();

				}
			});
				
		},

		fillInput : function() {
			var _t = this, idx_2_txt = '', idx_3_txt = '', idx_4_txt = '';

			_t.idx_tab_2 = util.dom.getById(_t.cfg.idx_tab_2);
			if (util.dom.getByClass(_t.idx_tab_2, 'select')[0] !== undefined) {
				idx_2_txt = util.dom.getByClass(_t.idx_tab_2, 'select')[0].innerHTML;
			}

			_t.idx_tab_3 = util.dom.getById(_t.cfg.idx_tab_3);
			if (util.dom.getByClass(_t.idx_tab_3, 'sel')[0] !== undefined) {
				idx_3_txt = '-' + util.dom.getByClass(_t.idx_tab_3, 'sel')[0].innerHTML;
			}

			_t.idx_tab_4 = util.dom.getById(_t.cfg.idx_tab_4);
			if (util.dom.getByClass(_t.idx_tab_4, 'curr')[0] !== undefined) {
				idx_4_txt = '-' + util.dom.getByClass(_t.idx_tab_4, 'curr')[0].innerHTML;
			}

			_t.input.value = '';

			_t.input.value = idx_2_txt + idx_3_txt + idx_4_txt;
		},

		// 省
		selectProvince : function() {
			var _t = this, idx_2_cur, code;

				_t.idx_tab_2 = util.dom.getById(_t.cfg.idx_tab_2);

			util.event.addEvent(_t.idx_tab_2, 'click', function(e) {
				var event, target, s_tab_cur;
				event = util.event.getEvent(e);
				target = util.event.getTarget(event);


				if (target.tagName.toLowerCase() === 'a'){

					idx_2_cur = util.dom.getByClass(_t.idx_tab_2, 'select')[0];
					s_tab_cur = util.dom.getByTagName(_t.ul_area_tab, 'li')[2];

					util.dom.removeClass(idx_2_cur, 'select');
					util.dom.addClass(target, 'select');

					// 移除常用的所有选中
					util.dom.removeAllClass(_t.idx_tab_1, 'cur');
					util.dom.removeAllClass(_t.idx_tab_4, 'curr');

					code = target.getAttribute('code');

					util.dom.removeAllClass(_t.ul_area_tab, 'current');
					util.dom.addClass(s_tab_cur, 'current');

					util.dom.removeAllClass(_t.s_tab_b, 'on');
					util.dom.addClass(_t.s_tab_b[2], 'on');

					// 市
					_t.getCity(code); 

					_t.cityEvent();

					_t.fillInput();

				}
			});
		},

		// 根据市来选择省
		getProvinceByCity : function(code) {
			var _t = this, tmpCode = code.split(',')[1], 

			curCode = code.split(',')[0] + ',' + code.split(',')[1],
			tmp_oA, tmpProvince, i = 0, idx_2_tcur;

			idx_2_tcur = util.dom.getByClass(_t.idx_tab_2, 'select')[0];
			tmpProvince = area_data['0'][tmpCode];

			tmp_oA = util.dom.getByTagName(_t.idx_tab_2, 'a');
			tLen = tmp_oA.length;

			util.dom.removeClass(idx_2_tcur, 'select');
			for (;i < tLen; i++) {
				(tmp_oA[i].getAttribute('code') == curCode) && (util.dom.addClass(tmp_oA[i], 'select'));
			}
		},

		// 获得城市
		getCity : function(code) {
			var _t = this, city = '';
			_t.idx_tab_3 = util.dom.getById(_t.cfg.idx_tab_3);
			_t.idx_tab_3.innerHTML = '';
			oUl = document.createElement('ul');
			oUl.className = 'clearfix';
			tCode = code.split(',')[0] + ',' + code.split(',')[1];

			for (var name in area_data[tCode]) {
				if ((tCode + ',' + name) === code) {
					city += '<li><a code="' + (tCode + ',' + name) + '" class="panel-item sel" href="javascript:;">' + area_data[tCode][name] + '</a></li>';
				} else {
					city += '<li><a code="' + (tCode + ',' + name) + '" class="panel-item" href="javascript:;">' + area_data[tCode][name] + '</a></li>';
				}
			}

			oUl.innerHTML = city;
			_t.idx_tab_3.appendChild(oUl);
			oUl = null;
		},

		// 根据市来选择区县
		getDistrictByCity : function(code) {
			var _t = this, idx_tab_4, oUl, district = '';
			idx_tab_4 = util.dom.getById(_t.cfg.idx_tab_4);
			idx_tab_4.innerHTML = '';
			oUl = document.createElement('ul');
			oUl.className = 'clearfix';

			for (var name in area_data[code]) {
				district += '<li><a code="' + name + '" class="panel-item" href="javascript:;">' + area_data[code][name] + '</a></li>';
			}

			oUl.innerHTML = district;
			idx_tab_4.appendChild(oUl);

			oUl = null;
		},

		// 选择市
		cityEvent : function() {
			var _t = this, event, target, idx_3_cur;

			util.event.addEvent(_t.idx_tab_3, 'click', function(e) {

				event = util.event.getEvent(e);
				target = util.event.getTarget(event);

				if (target.tagName.toLowerCase() === 'a'){

					idx_3_cur = util.dom.getByClass(_t.idx_tab_3, 'sel')[0];

					util.dom.removeClass(idx_3_cur, 'sel');
					util.dom.addClass(target, 'sel');

					code = target.getAttribute('code');

					util.dom.removeAllClass(_t.ul_area_tab, 'current');
					util.dom.addClass(_t.s_tab_li, 'current');

					util.dom.removeAllClass(_t.s_tab_b, 'on');
					util.dom.addClass(_t.s_tab_b[3], 'on');

					// 区县
					_t.getDistrictByCity(code);

					_t.fillInput();

				}
			});
		},

		// 选择区县
		districtEvent : function() {
			var _t = this, event, target, idx_4_cur;

			_t.idx_tab_4 = util.dom.getById(_t.cfg.idx_tab_4);

			util.event.addEvent(_t.idx_tab_4, 'click', function(e) {

				event = util.event.getEvent(e);
				target = util.event.getTarget(event);

				if (target.tagName.toLowerCase() === 'a'){

					idx_4_cur = util.dom.getByClass(_t.idx_tab_4, 'curr')[0];

					util.dom.removeClass(idx_4_cur, 'curr');
					util.dom.addClass(target, 'curr');

					code = target.getAttribute('code');

					_t.fillInput();
				}
			});
		}
	});

	return {
		District : District
	};

});
