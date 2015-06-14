define(['util', 'prototype', 'proxy', 'popui'], function(util, prototype, proxy, popui) {
	/**
	 * @member sdLogin.ui
	 * @description 实现登录框
	 * @return
	 * @example 
	 *
	 * new sdLogin({});
	 *
	 */

	var sdLogin = function(args) {
		// 默认参数
		var defArgs = {
			id : 'sdLogin'
		};

		this.cfg = util.tool.extend(defArgs, args);

		this.init();

		this.bindEvent();
	};

	util.tool.extend(sdLogin.prototype, {
		init : function() {
			var _t = this;

			_t.url = path;

			var html = ['<form id="miniLogin" method="post">',
							'<div class="miniLogin">',
								'<span class="msgTips" id="errorMsg"></span>',
								'<ul class="loginInput">',
									'<li id="dpLoginUser">',
										'<input type="hidden" value="2f0898a64de74b5fbb4af8bb9b3521f2" id="ratk" />',
										'<input type="text" autocomplete="off" placeholder="7天会员号/手机号/证件号" name="mebName" id="uname" class="inputCommon" />',
										'<span class="msgTips" id="userName_msg"></span>',
									'</li>',
									'<li id="dpLoginPwd">',
										'<input type="password" placeholder="请输入密码" name="password" id="password" class="inputCommon" name="imageCode" />',
										'<span class="msgTips" id="pwd_msg"></span>',
									'</li>',
									'<li id="dpCheckcode">',
										'<div class="rgcheckcodeWrapper">',
											'<input type="text" class="inputCommon rgcheckcode" autocomplete="off" placeholder="请输入验证码" name="imageCode" id="checkcode" />',
											'<span><img alt="点击刷新" id="yzm" src="'+_t.url+'/imageValideCode"></span>',
											'<span class="msgTips" id="yzm_msg"></span>',
													
										'</div>',
									'</li>',
								'</ul>',
								'<div class="miniLogin_auto clearfix">',
									'<label for="j_expiredays">',
										'<input type="checkbox" value="true" name="j_expiredays" id="j_expiredays" />',
										'<span>7天内免登录</span></label>',
								'</div>',
								'<p class="miniLogin_btn clearfix">',
									'<input type="button" value="立即登录" id="immBtnlogin">',
									'<input type="button" value="注册" id="btnRegister"/>',
								'</p>',
								'<p style="display:none;"><a id="forgetPwd" href="javascript:void(0);">忘记密码？</a></p>',
								'<div id="forgetPwdTip" style="display:none;">',
									'<p>1、使用“<a onclick="redirectDynamicPsd();" class="r_dynamic_psd" href="javascript:void(0);">手机动态密码登录</a>”</p>',
									'<p>2、如手机号码已更换，导致无法收到动态密码，请发送“修改资料”+“会员本人与注册证件合照”至微信：铂涛会。</p>',
								'</div>',
							'</div>',
						'</form>'
			];

			cancelPop = new popui.Pop({isMark : true, padding : 0, isBorder : false, isShowTitle : true, title : '登录与注册', isShadow : true, content : html.join(''), width : 650, height : 380, titleClsName : 'loginTitle'});
		},

		bindEvent : function() {
			var _t = this, yzm = util.dom.getById('yzm'),
				btnRegister = util.dom.getById('btnRegister'),
				miniLogin = util.dom.getById('miniLogin'),
				immBtnlogin = util.dom.getById('immBtnlogin');

			// 切换验证码
			util.event.addEvent(yzm, 'click', function(){
				this.setAttribute('src', _t.url + '/imageValideCode?t=' + new Date().getTime());
			});

			// 登录
			util.event.addEvent(immBtnlogin, 'click', function(){
				var errorMsg = util.dom.getById('errorMsg'),          // 错误提示
					mebName = util.dom.getById('uname'), 			  // 用户名
					password = util.dom.getById('password'),          // 密码
					checkcode = util.dom.getById('checkcode'),        // 验证码
					userName_msg = util.dom.getById('userName_msg'),  // 用户名提示信息
					pwd_msg = util.dom.getById('pwd_msg'), 			  // 密码提示信息
					yzm_msg = util.dom.getById('yzm_msg');            // 验证码提示信息

				if (mebName.value == '') {
					util.dom.addClass(mebName, 'msgTips_input');
					userName_msg.innerHTML = '请输入用户名';
					return;
				} else {
					util.dom.removeClass(mebName, 'msgTips_input');
					userName_msg.innerHTML = '';
				}

				if (password.value == '') {
					util.dom.addClass(password, 'msgTips_input');
					pwd_msg.innerHTML = '请输入密码';
					return;
				} else {
					util.dom.removeClass(password, 'msgTips_input');
					pwd_msg.innerHTML = '';
				}

				if (checkcode.value == '') {
					util.dom.addClass(checkcode, 'msgTips_input');
					yzm_msg.innerHTML = '请输入验证码';
					return;
				} else {
					util.dom.removeClass(checkcode, 'msgTips_input');
					yzm_msg.innerHTML = '';
				}

				var param = {
						mebName  : mebName.value,
						password : password.value,
						imageCode : checkcode.value
					},

					callback = {
						success : function(res) {
							if (res.code === 1){
								

								window.location.href = "http://login.plateno.com/logon?im="+res.token+"&redirect=" + encodeURIComponent(window.location.href);
							} else {
								yzm.setAttribute('src', _t.url + '/imageValideCode?t=' + new Date().getTime());
								checkcode.value = '';
								checkcode.focus();
								errorMsg.innerHTML = res.msg;
							}
						},
						failure : function(e) {
							console.log(e);
						}
					};

				proxy.MService.login(param, callback);

			});

			// 注册
			util.event.addEvent(btnRegister, 'click', function(){
				window.open('http://www.plateno.com/member/registry.html?fromUrl=' + encodeURIComponent(window.location.href));
			});
		}
	});

	return {
		sdLogin : sdLogin
	};
});
