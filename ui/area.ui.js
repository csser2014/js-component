define(['util', 'prototype', 'dataarea'], function(util, prototype, dataarea) {

	/**
	 * @member area.ui
	 * @description 实现全国省市区三级联动下拉菜单
	 * @return
	 * @example 
	 *
	 * new Area({provinceId : 'province'});
	 *
	 */

	var Area = function(args) {
		// 默认参数
		var defArgs = {
			parentId   : 'obj',
			provinceId : 'province',          // 省份 select 框的id，默认为 province
			cityId     : 'city',              // 城市 select 框的id，默认为 city
			districtId : 'district'           // 区域 select 框的id，默认为 district
		};

		this.cfg = util.tool.extend(defArgs, args);

		this.init();
	};	

	util.tool.extend(Area.prototype, {

		init : function(){
			var _t = this;

			_t.oProvince = util.dom.getById(_t.cfg.provinceId);
			_t.oCity = util.dom.getById(_t.cfg.cityId);
			_t.oDistrict = util.dom.getById(_t.cfg.districtId);

			_t.provinceDataId = _t.cityDataId = _t.districtDataId = -1;

			if (_t.oProvince === null || _t.oCity === null || _t.oDistrict === null) return;

			_t.initTip({
				initProvince : true,
				initCity     : true,
				initDistrict : true
			});

			(_t.oProvince != null) && _t.getFirstSelect();

			_t.cfg.retId = (new Function('', 'return ' + _t.cfg.parentId))();

			// 选中省
			(typeof _t.cfg.retId.provinceValue !== 'undefined') && (_t.selectProvince());

			// 选中城市
			(typeof _t.cfg.retId.cityValue !== 'undefined') && (_t.selectCity());

			// 选中区域
			(typeof _t.cfg.retId.districtValue !== 'undefined') && (_t.selectDistrict());
				
			// 邦定事件
			_t.bindEvent();
		},

		// 初始化提示语
		initTip : function(obj) {
			var _t = this;
			if (_t.oProvince != null && obj.initProvince == true) {
				var option = document.createElement('option');
				option.innerHTML = '省份';
				_t.oProvince.appendChild(option);
			}

			if (_t.oCity != null & obj.initCity == true) {
				var option = document.createElement('option');
				option.innerHTML = '地级市';
				_t.oCity.appendChild(option);
			}

			if (_t.oDistrict != null && obj.initDistrict == true) {
				var option = document.createElement('option');
				option.innerHTML = '市、县、区';
				_t.oDistrict.appendChild(option);
			}
		},

		// 生成第一个 select 框的省份的数据
		getFirstSelect : function() {
			var _t = this, pOption,
				aProvince = area_data[0];
			for (var name in aProvince) {
				// 创建省份的 option
				pOption = document.createElement('option');
				pOption.value= aProvince[name];
				pOption.setAttribute('data-id', name);
				pOption.innerHTML = aProvince[name];
				_t.oProvince.appendChild(pOption);
			}
		},

		selectProvince : function() {
			var _t = this, i = 0, 
				selectId = util.dom.getById(_t.cfg.parentId),
				oOption = util.dom.getByTagName(selectId, 'option'),
				oLen = oOption.length;

			for (; i < oLen; i++) {
				if (oOption[i].value === _t.cfg.retId.provinceValue) {
					_t.provinceDataId = '0,' + oOption[i].getAttribute('data-id');
					oOption[i].selected = 'selected';
					break;
				}
			}
		},

		selectCity : function() {
			var _t = this, selCity, tOption;

			if (_t.provinceDataId != -1) {
				selCity = area_data[_t.provinceDataId];
			}

			_t.createSelOption(selCity, _t.oCity, _t.cfg.retId.cityValue, 1);
		},

		selectDistrict : function() {
			var _t = this, selDistrict, kOption;

			if (_t.cityDataId != -1) {
				selDistrict = area_data[_t.cityDataId];
			}

			_t.createSelOption(selDistrict, _t.oDistrict, _t.cfg.retId.districtValue, 0);

		},

		createSelOption : function(oSelect, oTarget, tmpValue, flag) {
			var _t = this, option;

			for(var name in oSelect) {

				option = document.createElement('option');
				option.value = oSelect[name];
				option.setAttribute('data-id', name);
				option.innerHTML = oSelect[name];
				oTarget.appendChild(option);

				if (option.value === tmpValue) {
					if (flag === 1) {
						_t.cityDataId = _t.provinceDataId + ',' + option.getAttribute('data-id');
					}
					option.selected = 'selected';
				}
			}
		},

		bindEvent : function(){
			var _t = this;

			// 选择省份
			util.event.addEvent(_t.oProvince, 'change', function(){
				var aCity = area_data['0,' + this.options[this.selectedIndex].getAttribute('data-id')], cOption;
				(_t.oCity != null) && (_t.oCity.innerHTML = '');
				(_t.oDistrict != null) && (_t.oDistrict.innerHTML = '');
				_t.initTip({
					initProvince : false,
					initCity     : true,
					initDistrict : true
				});
				if (_t.oCity == null) return;
				for (var name in aCity) {
					// 创建城市的 option
					cOption = document.createElement('option');
					cOption.value = aCity[name];
					cOption.setAttribute('data-id', name);
					cOption.innerHTML = aCity[name];
					_t.oCity.appendChild(cOption);
				}
			});

			// 选择城市
			util.event.addEvent(_t.oCity, 'change', function(){
				var provinceValue = _t.oProvince.options[_t.oProvince.selectedIndex].getAttribute('data-id'),
					districtIdx = [0, provinceValue, this.options[this.selectedIndex].getAttribute('data-id')].join(","),
					aDistrict = area_data[districtIdx], dOption;
				(_t.oDistrict != null) && (_t.oDistrict.innerHTML = '');
				_t.initTip({
					initProvince : false,
					initCity     : false,
					initDistrict : true
				});
				if (_t.oDistrict == null)  return;
				for(var name in aDistrict) {
					// 创建区域的 option
					dOption = document.createElement('option');
					dOption.value = aDistrict[name];
					dOption.setAttribute('data-id', name);
					dOption.innerHTML = aDistrict[name];
					_t.oDistrict.appendChild(dOption);
				}
			});
		}
	});

	return {
		Area : Area
	};

});
