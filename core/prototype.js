define(['jquery'], function($){
	/**
	 *
	 * 扩展 Array 类
	 *
	 */
	$.extend(Array.prototype, {

		/**
		 * @member Array
		 * @description 实现查找数组中的一个最大值
		 * @return {Max Number}
		 * @example
		 *
		 */
		max : function() {
			return Math.max.apply({}, this);
		},

		/**
		 * @member Array
		 * @description 实现查找数组中的一个最小值
		 * @return {Min Number}
		 * @example
		 *
		 */
		min : function() {
			return Math.min.apply({}, this);
		},
		
		/**
		 * @member Array
		 * @description 判断数组中是否有这个数
		 * @return {true or false}
		 * @example
		 *
		 */
		in_array : function(search){
			var i = 0, len = this.length;
			for (; i < len; i++) {
				if (this[i] === search) {
					return true;
				}
			}
			return false;
		},

		/**
		 * @member Array
		 * @description 对数组提供的所有子元素逐一进行方法调用
		 * @return 
		 * @example
		 *
		 */
		each : function(iterator, context) {
			var i = 0, len = this.length;
			for (; i < len; i++){
				iterator.call(context, this[i], i, this);
			}
		},

		/**
		 * @member Array
		 * @description 清空数组
		 * @return {Array}
		 * @example
		 *
		 */
		clear : function() {
			this.length = 0;
			return this;
		},

		/**
		 * @member Array
		 * @description 返回数组的第一个元素
		 * @return {Array First Element}
		 * @example
		 *
		 */
		first : function() {
			return this[0];
		},

		/**
		 * @member Array
		 * @description　返回数组的最后一个元素
		 * @return {Array Last Element}
		 * @example
		 *
		 */
		last : function() {
			return this[this.length - 1];
		},

		/**
		 * @member Array
		 * @description 返回数组的长度
		 * @return {Number}
		 * @example
		 *
		 */
		size : function() {
			return this.length;
		},

		/**
		 * @member Array
		 * @description  返回根据给定元素找到的第一个索引值，否则返回-1
		 * @return {index or -1}
		 * @example
		 *
		 */
		indexOf : function(search, index){
			index = index || 0;
			var len = this.length;
			for (index; index < len; index++){
				if (this[index] === search) {
					return index;
				}
			}
			return -1;
		},
		
		/**
		 * @member Array
		 * @description 数组的所有元素是否都符合函数的过滤条件，所有通过返回 true
		 * @return  {true or false}
		 * @example
		 *
		 */
		every : function(iterator, context){
			var i = 0, len = this.length;
			for (; i < len; i++) {
				if (!iterator.call(context, this[i], i)) return false;
			}
			return true;
		},

		/**
		 * @member Array
		 * @description 数组的所有元素是否都符合函数的过滤条件，只要有一个通过返回 true
		 * @return {true or false} 
		 * @example 
		 *
		 */
		some : function(iterator, context) {
			var i = 0, len = this.length;
			for (; i < len; i++) {
				if (iterator.call(context, this[i], i)) return true;
			}
			return false;
		},

		/**
		 * @member Array
		 * @description 数组中的每一个元素是否都符合函数的过滤条件，符合条件就把值放到新数组里并返回
		 * @return {Array}
		 * @example
		 *
		 */
		filter : function(iterator, context) {
			var result = [];
			this.each(function(value, index){
				(iterator.call(context, value, index)) && result.push(value);
			});
			return result;
		}
		
	});

	/**
	 * 扩展 String 类
	 *
	 */
	$.extend(String.prototype, {

		/**
		 * @member String
		 * @description 去除左边空格
		 * @return  {String}
		 * @example
		 *
		 */
		ltrim : function() {
			return this.replace(/^\s+/g, '');
		},

		/**
		 * @member String
		 * @description 去除右边空格
		 * @return {String}
		 * @example
		 *
		 */
		rtrim : function() {
			return this.replace(/\s+$/g, '');
		},

		/**
		 * @member String
		 * @description 去除两边的空格
		 * @return {String}
		 * @example
		 *
		 */
		trim : function() {
			return this.replace(/^\s+|\s+$/g, '');
		},

		/**
		 * @member String
		 * @description 将特定的 html 编码转换为字符串
		 * @return {String}
		 * @example
		 *
		 */
		escapeHTML : function() {
			return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		},

		/**
		 * @member String
		 * @description 将字符串转换为特定的 html 编码
		 * @return {String}
		 * @example
		 *
		 */
		unescapeHTML : function() {
			return this.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
		},

		/**
		 * @member String
		 * @description 字符串长度小于 length 时，对 str 左边填入 fixStr
		 * @return {String}
		 * @example  
		 *
		 */
		leftFix : function(fixStr, length) {
			var str = this;
			while (str.length < length){
				str = fixStr + str;
			}
			return str;
		},

		/**
		 * @member String
		 * @description 获取长度，中文用2位表示
		 * @return {String}
		 * @example 
		 *
		 */
		getCNlen : function() {
			return this.replace(/[^\x00-\xff]/g, '**').length;
		},

		/**
		 * @member String
		 * @description 实现模板的简单替换
		 * @return {String}
		 * @example
		 *
		 */
		format : function() {
			var a = arguments;
			var data = (a.length == 1 && typeof(a) == 'object') ? a[0] : a;
			return this.replace(/\{([\d\w]+)\}/g, function(m, i){
				return data[i] != undefined ? data[i].toString() : '';
			});
		},

		/**
		 * @member String
		 * @description 删除 Tag 标签
		 * @return {String}
		 * @example
		 *
		 */
		/*stripTags : function() {
			return this.replace(/<\/?[^>]+>/gi, '');
		},*/

		/**
		 * @member String
		 * @description 把字符串用 - 分割成数组，把跟在 - 后面的首字母大写
		 * @return {String}
		 * @example
		 *
		 */
		camelize : function() {
			var parts = this.split('-'),
				len = parts.length;
			if (len == 1) return parts[0];

			var camelized = this.charAt(0) == '-' ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1) : parts[0];

			for (var i = 1; i < len; i++){
				camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);
			}
			return camelized;
		},

		/**
		 * @member String
		 * @description 把首字母大写
		 * @return {String}
		 * @example
		 *
		 */
		capitalize : function() {
			return this.charAt(0).toUpperCase() + this.substring(1);
		},

		/**
		 * @member String
		 * @description 判断一个字符串是否包含另一个字符串
		 * @return {true of false}
		 * @example
		 *
		 */
		include : function(str) {
			return this.indexOf(str) > -1;
		},

		/**
		 * @member String
		 * @description 把一个字符串逆序显示
		 * @return {String}
		 * @example
		 *
		 */
		reverse : function() {
			return this.split('').reverse().join('');
		},

		/**
		 * @member String
		 * @description 把一个字符串逆序显示
		 * @return {String}
		 * @example
		 *
		 */
		repeat : function(times) {
			times = times || 1;
			return new Array(times + 1).join(this);
		}

	});

	/**
	 * 扩展 Function 类
	 *
	 */
	$.extend(Function.prototype, {
	});

	/**
	 * 扩展 Date 类
	 *
	 */
	$.extend(Date.prototype, {

		/**
		 * @member Date
		 * @description 把日期里的小时分秒毫秒都设置为0
		 * @return {Date}
		 * @example
		 *
		 */

		clearTime : function() {
			this.setHours(0);            // 小时
			this.setMinutes(0);          // 分
			this.setSeconds(0);          // 秒
			this.setMilliseconds(0);     // 毫秒
			return this;
		},

		/**
		 * @member Date
		 * @description 把日期里的小时分秒毫秒设置为当前的
		 * @return {Date}
		 * @example
		 * 
		 */
		setTimeToNow : function() {
			var now = new Date();
			this.setHours(now.getHours());
			this.setMinutes(now.getMinutes());
			this.setSeconds(now.getSeconds());
			this.setMilliseconds(now.getMilliseconds());
			return this;
		},

		/**
		 * @member Date
		 * @description 把日期增加一天，返回的还是日期对象
		 * @return {Date}
		 * @example
		 *
		 */
		addDays : function(value) {
			this.setDate(this.getDate() + value);
			return this;
		},

		/**
		 * @member Date
		 * @description 把日期转换为字符串
		 * @returns {String}
		 * @example
		 *
		 */
		dateToString : function() {
			var year = this.getFullYear();     // 获取年
			var month = this.getMonth() + 1;   // 获取月
			var day = this.getDate();          // 获取日
			
			// 返回日期的字符串
			return year + '-' + month.toString().leftFix('0', 2) + '-' + day.toString().leftFix('0', 2);  
			
		},

		/**
		 * @member Date
		 * @description 以字符串值的形式返回采用 ISO 格式的日期
		 * @return 
		 * @example
		 *
		 */
		toISOString : function() {
			var utcYear = this.getUTCFullYear(),
				utcMonth = (this.getUTCMonth() + 1).toString().leftFix('0', 2),
				utcDay = this.getUTCDate().toString().leftFix('0', 2),
				utcHours = this.getUTCHours().toString().leftFix('0', 2),
				utcMinutes = this.getUTCMinutes().toString().leftFix('0', 2),
				utcSeconds = this.getUTCSeconds().toString().leftFix('0', 2);

			return utcYear + '-' + utcMonth + '-' + utcDay + 'T' + 
				   utcHours + ':' + utcMinutes + ':' + utcSeconds + 'Z';
		}

	});

	/**
	 * 扩展 Date 类，静态方法
	 *
	 */

	$.extend(Date, {

		/**
		 * @member Date
		 * @description 判断是否是润年，润年的二月份有29天，不是润年的二月份有28天
		 * @return (true || false)
		 * @example
		 *
		 */
		isLeapYear : function(year) {
			return ((year % 4 == 0 && year % 100 !=0) || year % 400 == 0 );
		},

		/**
		 * @member Date
		 * @description 返回月份的天数
		 * @return {Number}
		 * @example
		 *
		 */
		getDayInMonth : function(year, month) {
			var monthDay = [31, (Date.isLeapYear(year) ? 29 : 28) , 31 , 30 , 31 , 30 , 31 , 31 , 30 , 31 , 30 , 31];
			return monthDay[month-1];
		},

		/**
		 * @member Date
		 * @description 返回某年某月1号是星期几
		 * @return {Number}
		 * @example
		 *
		 *
		 */
		getFirstFromMonth : function(year, month) {
			var d = new Date();

			d.setFullYear(year);
			d.setMonth(month - 1);
			d.setDate(1);

			return d.getDay();
		},
		
		/**
		 * @member Date
		 * @description 比较两个日期，如果日期1大于日期2，则返回 true
		 * @return {true || false | 0}
		 * @example
		 *
		 */
		 compare : function(date1, date2) {
			 if (date1 instanceof Date && date2 instanceof Date) {
				 return (date1 > date2) ? true : (date1 < date2) ? false : 0;
			 } else {
				 throw new TypeError(date1 + '-' + date2);
			 }
		 },

		 /**
		  * @member Date
		  * @description 计算两个日期相差的天数
		  * @return
		  * @example
		  *
		  */
		 DateDiff : function(strStartDate, strEndDate) {
			 var aStartDate, aEndDate, oStartDate, oEndDate, ret;

			 aStartDate = strStartDate.split('-');
			 oStartDate = new Date(aStartDate[0] + '/' + aStartDate[1] + '/' + aStartDate[2]);

			 aEndDate = strEndDate.split('-');
			 oEndDate = new Date(aEndDate[0] + '/' + aEndDate[1] + '/' + aEndDate[2]);

			 ret = parseInt((oEndDate - oStartDate)/(1000 * 60 * 60 * 24), 10);

			 return ret;
		 }
	});
	
});
