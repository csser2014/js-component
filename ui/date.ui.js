define(['jquery'], function($) {
	/**
	 * @member
	 * @description 在 jqueryUI datepicker 基本上进行扩展
	 * @return 
	 * @example 
	 *
	 *  new MyDatePicker({numberOfMonths : 2});
	 *
	 */

	var MyDatePicker = function(args) {
		// 默认参数
		var defArgs = {
			isChangeMonth  : false,			 // 是否显示月份的下拉框
			isChangeYear   : false,          // 是否显示年份的下拉框
			numberOfMonths : 1,              // 默认弹出一个月份
			minDate        : '0d',           // 默认弹出框最小日期为当前日期
			dateFormat     : 'yy-mm-dd',     // 默认的日期格式为 2014-10-11
			startDateCls   : 'startDate',    // 默认开始时间的 input 类为 startDate
			endDateCls     : 'endDate'       // 默认结束时间的 input 类为 endDate
		};

		this.cfg = $.extend({}, defArgs, args);

		this.init();
	};

	$.extend(MyDatePicker.prototype, {
		init : function() {
			var _t = this;
			var curStartDate = $('.' + _t.cfg.startDateCls),    
				curEndDate = $('.' + _t.cfg.endDateCls);
			if (curStartDate.val() === '') {  
				var start_dts = (new Date()).dateToString();
				curStartDate.val(start_dts);  // 如果没有设置开始日期，就在当前日期
			}
			if (curEndDate.val() === '') {
				var end_dts = (new Date()).addDays(1).dateToString();
				curEndDate.val(end_dts);      // 如果没有设置结束日期，就在当前日期加1天
			}
			var sd_date = new Date(curStartDate.val().replace(/-/g, '/'));   // 把 input 的值转换为日期
			var ed_date = new Date(curEndDate.val().replace(/-/g, '/'));     // 把 input 的值转换为日期
			var elapseDay = (ed_date - sd_date) / 1000 / 60 / 60 / 24;       // 两个日期相差几天

			// 开始日期
			curStartDate.datepicker({
				changeMonth    : _t.cfg.isChangeMonth,
				changeYear     : _t.cfg.isChangeYear,
				numberOfMonths : _t.cfg.numberOfMonths,
				minDate        : _t.cfg.minDate,
				dateFormat     : _t.cfg.dateFormat,
				onSelect       : function(selectDate) {
					var sde_date = new Date(curStartDate.val().replace(/-/g, '/'));   
					var ede_date = new Date(curEndDate.val().replace(/-/g, '/'));     

					if ($(this).hasClass(_t.cfg.startDateCls)) { // 如果点击的是开始日期
						 // 如果开始日期小于结束，点击开始日期的时候，结束日期不变，否则，结束日期加 elapseDay
						if (sde_date >= ede_date){              
							var sd = new Date(selectDate.replace(/-/g, '/')); // 一定要把 - 变成 /，不然，IE8以下会获取不到 sd 的值
							var std = sd.addDays(elapseDay).dateToString();   // 改变开始日期，则结束日期也要跟着原来这两个日期的差值
							curEndDate.val(std);
						}
					}
					// 每次改变开始日期的时候，就根据当前开始日期加上 elapseDay 来改变结束日期的最小值
					curEndDate.datepicker('option', {'minDate': sde_date.addDays(elapseDay)});  
				}
			});
			
			// 结束日期
			curEndDate.datepicker({
				changeMonth    : _t.cfg.isChangeMonth,
				changeYear     : _t.cfg.isChangeYear,
				numberOfMonths : _t.cfg.numberOfMonths,
				minDate        : _t.cfg.minDate,
				dateFormat     : _t.cfg.dateFormat,
				onSelect       : function(selectDate) {
				}
			});

			var EndD = curEndDate.datepicker('getDate'), 		// 获取当前 input 的类为 curEndDate 的日期
				minD = new Date(EndD);
			minD.setDate(minD.getDate());   			    	// 根据 curEndDate 的值来作为 curEndDate 的最小值
			curEndDate.datepicker('option', {'minDate': minD}); // 初始化时，设置结束日期的最小值
		}
	});

	return {
		MyDatePicker : MyDatePicker
	};
});
