/**
 * Main JavaScript
 * Site Name
 *
 * Copyright (c) 2015. by Way2CU, http://way2cu.com
 * Authors:
 */

// create or use existing site scope
var Site = Site || {};

// make sure variable cache exists
Site.variable_cache = Site.variable_cache || {};


/**
 * Check if site is being displayed on mobile.
 * @return boolean
 */
Site.is_mobile = function() {
	var result = false;

	// check for cached value
	if ('mobile_version' in Site.variable_cache) {
		result = Site.variable_cache['mobile_version'];

	} else {
		// detect if site is mobile
		var elements = document.getElementsByName('viewport');

		// check all tags and find `meta`
		for (var i=0, count=elements.length; i<count; i++) {
			var tag = elements[i];

			if (tag.tagName == 'META') {
				result = true;
				break;
			}
		}

		// cache value so next time we are faster
		Site.variable_cache['mobile_version'] = result;
	}

	return result;
};

/**
 * Dialog system for logging in and out and as well as registering
 * new accounts on the system.
 */
Site.DialogSystem = function() {
	var self = this;

	self.message = {};
	self.sign_up = {};
	self.login = {};
	self.recovery = {};

	/**
	 * Complete object initialization.
	 */
	self._init = function() {
		// create error reporting dialog
		self.message.content = $('<div>');
		self.message.dialog = new Dialog();
		self.message.dialog
				.setSize(Site.is_mobile() ? 300 : 400, 'auto')
				.setScroll(false)
				.setClearOnClose(false)
				.setContent(self.message.content)
				.addClass('login');

		// create sign up dialog
		self.sign_up.dialog = new Dialog();
		self.sign_up.dialog.setSize(Site.is_mobile() ? 300 : 400, 'auto');
		self.sign_up.dialog.setScroll(false);
		self.sign_up.dialog.setClearOnClose(false);
		self.sign_up.dialog.setError(false);
		self.sign_up.dialog.addClass('login sign-up');

		self.sign_up.content = $('<form>');
		self.sign_up.message = $('<p>');

		self.sign_up.label_first_name = $('<label>');
		self.sign_up.input_first_name = $('<input>');

		self.sign_up.label_last_name = $('<label>');
		self.sign_up.input_last_name = $('<input>');

		self.sign_up.label_username = $('<label>');
		self.sign_up.input_username = $('<input>');

		self.sign_up.label_password = $('<label>');
		self.sign_up.input_password = $('<input>');

		self.sign_up.label_repeat_password = $('<label>');
		self.sign_up.input_repeat_password = $('<input>');

		self.sign_up.label_terms_agree = $('<label>');
		self.sign_up.input_terms_agree = $('<input>');
		self.sign_up.span_terms_agree = $('<span>');

		// configure elements
		self.sign_up.input_first_name
				.attr('name', 'first_name')
				.attr('type', 'text')
				.attr('maxlength', 100)
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleSignUpKeyPress);

		self.sign_up.input_last_name
				.attr('name', 'last_name')
				.attr('type', 'text')
				.attr('maxlength', 100)
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleSignUpKeyPress);

		self.sign_up.input_username
				.attr('name', 'username')
				.attr('type', 'email')
				.attr('maxlength', 50)
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleSignUpKeyPress);

		self.sign_up.input_password
				.attr('name', 'password')
				.attr('type', 'password')
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleSignUpKeyPress);

		self.sign_up.input_repeat_password
				.attr('name', 'repeat_password')
				.attr('type', 'password')
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleSignUpKeyPress);

		self.sign_up.input_terms_agree
				.attr('name', 'agreed')
				.attr('type', 'checkbox')
				.on('click', self._handleAgreeClick);

		// pack sign up dialog
		self.sign_up.message.appendTo(self.sign_up.content);

		self.sign_up.label_first_name
				.addClass('inline')
				.append(self.sign_up.input_first_name)
				.appendTo(self.sign_up.content);

		self.sign_up.label_last_name
				.addClass('inline')
				.append(self.sign_up.input_last_name)
				.appendTo(self.sign_up.content);

		self.sign_up.label_username
				.append(self.sign_up.input_username)
				.appendTo(self.sign_up.content);

		self.sign_up.content.append('<hr>');

		self.sign_up.label_password
				.append(self.sign_up.input_password)
				.appendTo(self.sign_up.content);

		self.sign_up.label_repeat_password
				.append(self.sign_up.input_repeat_password)
				.appendTo(self.sign_up.content);

		self.sign_up.content.append('<hr>');

		self.sign_up.label_terms_agree
				.append(self.sign_up.input_terms_agree)
				.append(self.sign_up.span_terms_agree)
				.appendTo(self.sign_up.content);

		self.sign_up.dialog.setContent(self.sign_up.content);

		// create sign up button
		self.sign_up.signup_button = $('<a>');
		self.sign_up.signup_button
				.attr('href', 'javascript:void(0);')
				.click(self._handleSignUpClick);
		self.sign_up.dialog.addControl(self.sign_up.signup_button);

		// prepare dialog
		self.login.dialog = new Dialog();
		self.login.dialog.setSize(Site.is_mobile() ? 300 : 400, 'auto');
		self.login.dialog.setScroll(false);
		self.login.dialog.setClearOnClose(false);
		self.login.dialog.setError(false);
		self.login.dialog.addClass('login');

		// create login button
		self.login.login_button = $('<a>');
		self.login.login_button
				.attr('href', 'javascript:void(0);')
				.click(self._handleLoginClick);
		self.login.dialog.addControl(self.login.login_button);

		// create login dialog content
		self.login.content = $('<form>');
		self.login.captcha_container = $('<div>');
		self.login.message = $('<p>');

		self.login.label_username = $('<label>');
		self.login.input_username = $('<input>');

		self.login.label_password = $('<label>');
		self.login.input_password = $('<input>');

		self.login.link_recovery = $('<a>');

		self.login.label_captcha = $('<label>');
		self.login.input_captcha = $('<input>');
		self.login.image_captcha = $('<img>');

		self.login.label_remember_me = $('<label>');
		self.login.input_remember_me = $('<input>');
		self.login.span_remember_me = $('<span>');

		// configure elements
		self.login.input_username
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleLoginKeyPress)
				.attr('name', 'email')
				.attr('type', 'email');

		self.login.input_password
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleLoginKeyPress)
				.attr('name', 'password')
				.attr('type', 'password');

		self.login.input_remember_me
				.attr('name', 'lasting')
				.attr('type', 'checkbox');

		self.login.link_recovery
				.click(self._showRecoveryDialog)
				.attr('href', 'javascript: void(0)');

		self.login.content
				.attr('action', '/')
				.attr('method', 'post');

		// load username if previously stored
		var cached_username = localStorage.getItem('username');
		if (cached_username)
			self.login.input_username.val(cached_username);

		// pack elements
		self.login.content.append(self.login.message);
		self.login.label_username
				.append(self.login.input_username)
				.appendTo(self.login.content);

		self.login.label_password
				.append(self.login.input_password)
				.appendTo(self.login.content);

		self.login.label_captcha
				.append(self.login.input_captcha)
				.append(self.login.image_captcha)
				.appendTo(self.login.captcha_container);

		self.login.label_remember_me
				.append(self.login.input_remember_me)
				.append(self.login.span_remember_me)
				.appendTo(self.login.content);

		self.login.captcha_container
				.addClass('captcha')
				.hide()
				.appendTo(self.login.content);

		self.login.content.append(self.login.link_recovery);
		self.login.dialog.setContent(self.login.content);

		// prepare recovery dialog
		self.recovery.dialog = new Dialog();
		self.recovery.dialog.setSize(Site.is_mobile() ? 300 : 400, 'auto');
		self.recovery.dialog.setScroll(false);
		self.recovery.dialog.setClearOnClose(false);
		self.recovery.dialog.setError(false);
		self.recovery.dialog.addClass('login recovery');

		// create recover button
		self.recovery.recover_button = $('<a>');
		self.recovery.recover_button
				.attr('href', 'javascript: void(0);')
				.click(self._handleRecoverClick);

		self.recovery.dialog.addControl(self.recovery.recover_button);

		// create recovery dialog content
		self.recovery.content = $('<div>');
		self.recovery.captcha_container = $('<div>');
		self.recovery.message = $('<p>');

		self.recovery.label_email = $('<label>');
		self.recovery.input_email = $('<input>');

		self.recovery.label_captcha = $('<label>');
		self.recovery.input_captcha = $('<input>');
		self.recovery.image_captcha = $('<img>');

		self.recovery.input_email
				.attr('name', 'email')
				.attr('type', 'text')
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleRecoveryKeyPress);

		// prepare captcha image
		var base = $('meta[property=base-url]').attr('content');

		self.recovery.input_captcha
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleRecoveryKeyPress)
				.addClass('ltr')
				.attr('maxlength', 4);

		self.login.input_captcha
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleLoginKeyPress)
				.addClass('ltr')
				.attr('maxlength', 4);

		self.recovery.image_captcha
				.click(self._handleCaptchaClick)
				.attr('data-src', base + '?section=captcha&action=print_image');
		self.login.image_captcha
				.click(self._handleCaptchaClick)
				.attr('data-src', base + '?section=captcha&action=print_image');

		// pack elements
		self.recovery.content.append(self.recovery.message);
		self.recovery.label_email
				.append(self.recovery.input_email)
				.appendTo(self.recovery.content);

		self.recovery.label_captcha
				.append(self.recovery.input_captcha)
				.append(self.recovery.image_captcha)
				.appendTo(self.recovery.captcha_container);

		self.recovery.captcha_container
				.addClass('captcha')
				.appendTo(self.recovery.content);
		self.recovery.dialog.setContent(self.recovery.content);

		// bulk load language constants
		var constants = [
				'login', 'login_dialog_title', 'login_dialog_message', 'label_email', 'label_password',
				'label_password_recovery', 'recovery_dialog_title', 'recovery_dialog_message', 'submit',
				'label_captcha', 'captcha_message', 'signup_dialog_title', 'sign_up', 'signup_dialog_message',
				'label_repeat_password', 'label_first_name', 'label_last_name', 'label_agree_to_terms',
				'label_remember_me'
			];
		language_handler.getTextArrayAsync(null, constants, self._handleStringsLoaded);

		// connect events
		$('a.login').click(self._showLoginDialog);
		$('a.logout').click(self._handleLogout);
		$('a.sign-up').click(self._showSignUpDialog);
		$('form.sign-up input').on('focusin', self._handleFocusIn);
	}

	/**
	 * Remove invalid class on focus in.
	 *
	 * @param object event
	 */
	self._handleFocusIn = function(event) {
		$(this).removeClass('invalid');
	};

	/**
	 * Handle pressing key on input fields in login dialog.
	 *
	 * @param object event
	 */
	self._handleLoginKeyPress = function(event) {
		var key_value = event.keyCode;

		switch (key_value) {
			case 13:  // enter
				self.login.login_button.trigger('click');
				event.preventDefault();
				break;

			case 27:
				self.login.dialog.hide();
				event.preventDefault();
				break;
		}
	};

	/**
	 * Handle pressing key on input fields in recovery dialog.
	 *
	 * @param object event
	 */
	self._handleRecoveryKeyPress = function(event) {
		var key_value = event.keyCode;

		switch (key_value) {
			case 13:  // enter
				self.recovery.recover_button.trigger('click');
				event.preventDefault();
				break;

			case 27:
				self.recovery.dialog.hide();
				event.preventDefault();
				break;
		}
	};

	/**
	 * Handle pressing key on input fields in login dialog.
	 *
	 * @param object event
	 */
	self._handleSignUpKeyPress = function(event) {
		var key_value = event.keyCode;

		switch (key_value) {
			case 13:  // enter
				self.sign_up.signup_button.trigger('click');
				event.preventDefault();
				break;

			case 27:
				self.sign_up.dialog.hide();
				event.preventDefault();
				break;
		}
	};

	/**
	 * Handle clicking on agree to terms.
	 *
	 * @param object event
	 */
	self._handleAgreeClick = function(event) {
		var item = $(this);
		item.removeClass('invalid');
	};

	/**
	 * Handle loading language constants from server.
	 *
	 * @param object data
	 */
	self._handleStringsLoaded = function(data) {
		with (self.login) {
			dialog.setTitle(data['login_dialog_title']);
			message.html(data['login_dialog_message']);
			login_button.html(data['login']);

			input_username.attr('placeholder', data['label_email']);
			input_password.attr('placeholder', data['label_password']);
			input_captcha.attr('placeholder', data['label_captcha']);
			link_recovery.html(data['label_password_recovery']);
			image_captcha.attr('title', data['captcha_message']);
			span_remember_me.html(data['label_remember_me']);
		}

		with (self.recovery) {
			dialog.setTitle(data['recovery_dialog_title']);
			message.html(data['recovery_dialog_message']);
			recover_button.html(data['submit']);

			input_email.attr('placeholder', data['label_email']);
			input_captcha.attr('placeholder', data['label_captcha']);
			image_captcha.attr('title', data['captcha_message']);
		}

		with (self.sign_up) {
			dialog.setTitle(data['signup_dialog_title']);
			message.html(data['signup_dialog_message']);
			signup_button.html(data['sign_up']);

			input_first_name.attr('placeholder', data['label_first_name']);
			input_last_name.attr('placeholder', data['label_last_name']);
			input_username.attr('placeholder', data['label_email']);
			input_password.attr('placeholder', data['label_password']);
			input_repeat_password.attr('placeholder', data['label_repeat_password']);
			span_terms_agree.html(data['label_agree_to_terms']);
		}
	};

	/**
	 * Logout user and navigate to linked page.
	 *
	 * @param object event
	 */
	self._handleLogout = function(event) {
		event.preventDefault();

		// perform logout
		new Communicator('backend')
				.on_success(function(data) {
					if (!data.error)
						window.location.reload();
				})
				.get('json_logout');
	};

	/**
	 * Handle clicking on login link.
	 *
	 * @param object event
	 */
	self._showLoginDialog = function(event) {
		// prevent default link behavior
		event.preventDefault();

		// show dialog
		self.login.dialog.show();

		// focus username
		setTimeout(function() {
			self.login.input_username[0].focus();
		}, 100);
	};

	/**
	 * Show password recovery dialog.
	 *
	 * @param object event
	 */
	self._showRecoveryDialog = function(event) {
		// prevent default link behavior
		event.preventDefault();

		self.login.dialog.hide();
		self.recovery.dialog.show();

		// focus username
		setTimeout(function() {
			self.login.image_captcha.attr('src', self.login.image_captcha.attr('data-src'));
			self.recovery.input_email[0].focus();
		}, 100);
	};

	/**
	 * Show sign up dialog when user clicks on get started link.
	 *
	 * @param object event
	 */
	self._showSignUpDialog = function(event) {
		// prevent default link behavior
		event.preventDefault();

		// show dialog
		self.sign_up.dialog.show();

		// focus username
		setTimeout(function() {
			self.sign_up.input_username[0].focus();
		}, 100);
	};

	/**
	 * Reload captcha image.
	 */
	self._handleCaptchaClick = function(event) {
		event.preventDefault();

		var base = $('meta[property=base-url]').attr('content');
		var url = base + '?section=captcha&action=print_image&' + Date.now();

		self.recovery.image_captcha.attr('src', url);
		self.login.image_captcha.attr('src', url);
	};

	/**
	 * Handle clicking on sign up button in dialog.
	 *
	 * @param object event
	 */
	self._handleSignUpClick = function(event) {
		// prevent form from submitting
		event.preventDefault();

		// check if all the fields are valid
		if (self.sign_up.input_first_name.val() == '')
			self.sign_up.input_first_name.addClass('invalid');

		if (self.sign_up.input_last_name.val() == '')
			self.sign_up.input_last_name.addClass('invalid');

		if (self.sign_up.input_username.val() == '')
			self.sign_up.input_username.addClass('invalid');

		if (self.sign_up.input_password.val() == '')
			self.sign_up.input_password.addClass('invalid');

		if (self.sign_up.input_password.val() != self.sign_up.input_repeat_password.val()) {
			self.sign_up.input_password.addClass('invalid');
			self.sign_up.input_repeat_password.addClass('invalid');
		}

		if (!self.sign_up.input_terms_agree.is(':checked'))
			self.sign_up.input_terms_agree.addClass('invalid');

		// cache objects
		var fields = self.sign_up.content.find('input');

		// collect data
		var data = {};
		fields.each(function(index) {
			var field = $(this);
			var name = field.attr('name');

			if (field.attr('type') != 'checkbox')
				data[name] = field.val(); else
				data[name] = field.is(':checked') ? 1 : 0;
		});

		// submit data
		if (fields.filter('.invalid').length == 0)
			self._performSignUp(data);
	};

	/**
	 * Perform sign up process with specified data.
	 *
	 * @param object data
	 */
	self._performSignUp = function(data) {
		// make sure user agrees
		if (data.agreed != 1)
			return;

		// fill in remaining data
		data.email = data.username;
		data.show_result = 1;

		// create new user and redirect
		new Communicator('backend')
				.on_success(self._handleSignupSuccess)
				.on_error(self._handleSignupError)
				.send('save_unpriviledged_user', data);
	};

	/**
	 * Handle successful submission of sign up data.
	 *
	 * @param object data
	 */
	self._handleSignupSuccess = function(data) {
		if (!data.error) {
			// hide signup dialog
			self.sign_up.dialog.hide();

			// successfully created new user account, reload
			self.message.dialog
					.setError(false)
					.setTitle(language_handler.getText(null, 'signup_dialog_title'));
			self.message.content.html(language_handler.getText(null, 'signup_completed_message'));
			self.message.dialog.show();

		} else {
			// hide signup dialog
			self.sign_up.dialog.hide();

			// there was a problem creating new user
			self.message.dialog
					.setError(true)
					.setTitle(language_handler.getText(null, 'signup_dialog_title'));
			self.message.content.html(data.message);
			self.message.dialog.show();
		}
	};

	/**
	 * Handle communication error during sign up process.
	 *
	 * @param object xhr
	 * @param string status_code
	 * @param string description
	 */
	self._handleSignupError = function(xhr, status_code, description) {
		// hide signup dialog
		self.sign_up.dialog.hide();

		// show error message
		self.message.dialog
				.setError(true)
				.setTitle(language_handler.getText(null, 'signup_dialog_title'));
		self.message.content.html(description);
		self.message.dialog.show();
	};

	/**
	 * Handle clicking on login button in dialog.
	 *
	 * @param object event
	 */
	self._handleLoginClick = function(event) {
		// prevent default control behavior
		event.preventDefault();

		// prepare data
		var data = {
				username: self.login.input_username.val(),
				password: self.login.input_password.val(),
				captcha: self.login.input_captcha.val()
			};

		// create communicator
		new Communicator('backend')
				.on_success(self._handleLoginSuccess)
				.on_error(self._handleLoginError)
				.get('json_login', data);
	};

	/**
	 * Handle successful login response.
	 *
	 * @param object data
	 */
	self._handleLoginSuccess = function(data) {
		if (data.logged_in) {
			// hide login dialog
			self.login.dialog.hide();

			// store username for next time
			var username = self.login.input_username.val();
			localStorage.setItem('username', username);

			// reload page on successful login
			window.location.reload();

			self.message.content.html(language_handler.getText(null, 'login_successful'));
			self.message.dialog
					.setError(false)
					.setTitle(language_handler.getText(null, 'signup_dialog_title'))
					.setCloseCallback(function() {
						window.location.reload();
						this.clearCloseCallback();
					});
			self.message.dialog.show();

		} else {
			// hide login dialog
			self.login.dialog.hide();

			// show error message
			self.message.dialog
					.setError(true)
					.setTitle(language_handler.getText(null, 'login_dialog_title'));
			self.message.content.html(data.message);
			self.message.dialog.setCloseCallback(function() {
						setTimeout(function() {
							self.login.dialog.show();
						}, 100);
					});
			self.message.dialog.show();

			// show captcha if required
			if (data.show_captcha) {
				self.login.image_captcha.attr('src', self.login.image_captcha.attr('data-src'));
				self.login.captcha_container.slideDown();

			} else {
				self.login.captcha_container.slideUp();
			}
		}
	};

	/**
	 * Handle communication error.
	 *
	 * @param object xhr
	 * @param string transfer_status
	 * @param string description
	 */
	self._handleLoginError = function(xhr, transfer_status, description) {
		// hide login dialog
		self.login.dialog.hide();

		// show error dialog
		self.message.dialog
				.setError(true)
				.setTitle(language_handler.getText(null, 'login_dialog_title'));
		self.message.content.html(description);
		self.message.dialog.show();
	};

	/**
	 * Handle clicking on recover button in dialog.
	 *
	 * @param object event
	 */
	self._handleRecoverClick = function(event) {
		// prevent default control behavior
		event.preventDefault();

		// prepare data
		var data = {
				username: self.recovery.input_email.val(),
				email: self.recovery.input_email.val(),
				captcha: self.recovery.input_captcha.val()
			};

		// create communicator
		new Communicator('backend')
				.on_success(self._handleRecoverSuccess)
				.on_error(self._handleRecoverError)
				.get('password_recovery', data);
	};

	/**
	 * Handle response from server for password recovery.
	 *
	 * @param object data
	 */
	self._handleRecoverSuccess = function(data) {
		if (!data.error) {
			// hide recovery dialog
			self.recovery.dialog.hide();

			// successfully created new user account, reload
			self.message.dialog
					.setError(false)
					.setTitle(language_handler.getText(null, 'recovery_dialog_title'));
			self.message.content.html(language_handler.getText(null, 'recovery_completed_message'));
			self.message.dialog.show();

		} else {
			// hide recovery dialog
			self.recovery.dialog.hide();

			// there was a problem creating new user
			self.message.dialog
					.setError(true)
					.setTitle(language_handler.getText(null, 'recovery_dialog_title'));
			self.message.content.html(data.message);
			self.message.dialog.show();
		}
	};

	/**
	 * Handle error in communication with server.
	 *
	 * @param object xhr
	 * @param string transfer_status
	 * @param string description
	 */
	self._handleRecoverError = function(xhr, transfer_status, description) {
		// hide login dialog
		self.recovery.dialog.hide();

		// show error dialog
		self.message.dialog
				.setError(true)
				.setTitle(language_handler.getText(null, 'recovery_dialog_title'));
		self.message.content.html(description);
		self.message.dialog.show();
	};

	// finalize object
	self._init();
}

Site.ItemView = function(item) {
	var self = this;

	self.item = item;
	self.cart = item.cart;
	self.currency = null;

	self.container = null;
	self.image = null;
	self.label_name = null;
	self.label_size = null;
	self.label_count = null;
	self.label_price = null;
	self.label_controls = null;
	self.controls = {};
	self.base_url = document.querySelector('meta[property]').getAttribute('content');

	/**
	 * Complete object initialization.
	 */
	self._init = function() {
		// get list containers
		var item_list = self.cart.get_list_container();
		self.currency = self.cart.default_currency;

		// create container
		self.container = document.createElement('li');
		self.container.className = "item";
		item_list.append(self.container);

		// create product image thumbnail
		self.image = document.createElement('img');
		self.container.appendChild(self.image);

		// create product name element
		self.label_name = document.createElement('span');
		self.label_name.className = "name";
		self.container.appendChild(self.label_name);

		// create count element
		self.label_count = document.createElement('span');
		self.label_count.className = "count";
		self.container.appendChild(self.label_count);

		// create price element
		self.label_price = document.createElement('span');
		self.label_price.className = "total";
		self.container.appendChild(self.label_price);

		// create cart controls container element
		self.label_controls = document.createElement('div');
		self.label_controls.className = "cart_control";
		self.container.appendChild(self.label_controls);
		self.label_remove = document.createElement('a');
		self.label_remove.innerHTML = '<svg><use href="#close" xlink:href='+ self.base_url+' /site/images/site-sprite.svg#close/></svg>';
		self.label_remove.className = "remove";
		self.label_remove.addEventListener('click', self._handle_remove);
		self.label_controls.appendChild(self.label_remove);

		// create decrease item count control
		self.label_decrease = document.createElement('a');
		self.label_decrease.innerHTML = '<svg><use href="#minus" xlink:href='+ self.base_url+' /site/images/site-sprite.svg#minus/></svg>';
		self.label_decrease.className = "decrease";
		self.label_decrease.setAttribute('data-direction', -1);
		self.label_decrease.addEventListener('click', self.controls.handle_alter);
		self.label_controls.appendChild(self.label_decrease);
		// create remove item control

		// create increase item count control
		self.label_increase = document.createElement('a');
		self.label_increase.innerHTML = '<svg><use href="#plus" xlink:href='+ self.base_url+' /site/images/site-sprite.svg#plus/></svg>';
		self.label_increase.className = "increase";
		self.label_increase.setAttribute('data-direction', 1);
		self.label_increase.addEventListener('click', self.controls.handle_alter);
		self.label_controls.appendChild(self.label_increase);
	};

	/**
	 * Handler externally called when item count has changed.
	 */
	self.handle_change = function() {
		var name = document.createTextNode(self.item.name[language_handler.current_language]);
		self.label_name.appendChild(name);

		var count = document.createTextNode(self.item.count);
		self.label_count.appendChild(count);

		var price = document.createTextNode(self.item.get_total_cost().toFixed(2));
		self.label_price.setAttribute('data-currency', self.currency);
		self.label_price.appendChild(price);

		self.image.setAttribute('src', self.item.image);
		self.image.setAttribute('alt', self.item.name[language_handler.current_language]);
	};

	/**
	 * Handle clicking on remove item.
	 *
	 * @param object event
	 */
	self._handle_remove = function(event) {
		event.preventDefault();
		self.item.remove();
	};

	/**
	 * Handle increasing or decreasing item count.
	 *
	 * @param object event
	 */
	self.controls.handle_alter = function(event) {
		var item = $(this);
		console.log(item)
		var direction = item.data('direction');

		// prevent default button behavior
		event.preventDefault();

		// alter item count
		self.item.alter_count(direction);
	};

	/**
	 * Handle shopping cart currency change.
	 *
	 * @param string currency
	 * @param float rate
	 */
	self.handle_currency_change = function(currency, rate) {
		// store values
		self.currency = currency;
		self.exchange_rate = rate;

		// update labels
		self.handle_change();
	};

	/**
	 * Handler externally called before item removal.
	 */
	self.handle_remove = function() {
		self.container.remove();
	};

	// finalize object
	self._init();
}

/**
 * Handle clicking on button add to cart
 */
Site.handle_add_to_cart = function(event) {
	// prevent default behaviour
	event.preventDefault();

	var uid = document.querySelector('div.detail').getAttribute('data-uid');

	// find item with same uid
	var item_list = Site.cart.get_item_list_by_uid(uid);
	var found_item = null;

	for(var i = 0, count = item_list.length; i < count; i++) {
		var item = item_list[i];
		if(item.uid == uid) {
			found_item = item;
			break;
		}
	}

	if(!found_item)
		Site.cart.add_item_by_uid(uid);

	if(found_item)
		found_item.alter_count(1);
}

/*
 * Handle clicking on nav#main
 */
Site.handle_menu_click = function(event) {
	this.classList.toggle('show');
}

/**
 * Handle product thumbnail click event
 */
Site.handle_product_thumbnail = function(event) {
	var index = event.target.dataset.index;
	var big_images = document.querySelectorAll('img.big_image');
	
	for (var i=0, count=big_images.length; i<count; i++) {
		if (index == i)
			big_images[i].classList.add('visible'); else
			big_images[i].classList.remove('visible');
	}
}

/**
 * Function called when document and images have been completely loaded.
 */
Site.on_load = function() {
	if (Site.is_mobile())
		Site.mobile_menu = new Caracal.MobileMenu();

	// create user dialogs
	Site.dialog_system = new Site.DialogSystem();

	// configure shopping cart
	Site.cart = new Caracal.Shop.Cart();
	Site.cart
		.set_checkout_url('/shop/checkout')
		.ui.add_item_list($('ul#products'))
		.ui.add_total_count_label($('div.cart span.products_count'))
		.ui.add_total_count_label($('div.cart div.total span.count'))
		.ui.add_total_cost_label($('div.cart div.total span.price'))
		.add_item_view(Site.ItemView);

	// create handler for add_to_cart button
	if(document.querySelector('a.add')) {
		var button_add_to_cart = document.querySelector('a.add');
		button_add_to_cart.addEventListener('click', Site.handle_add_to_cart);
	}

	// create function to open drop down menu
	var menu = document.getElementById('main');
	menu.addEventListener('click', Site.handle_menu_click);

	// create pagecontrol for home page slider
	Site.slider = new PageControl('div#slider', 'img');
	Site.slider
		.setWrapAround(true)
		.attachControls('div#slider a');

	// create function for rotating product big image
	if(document.querySelector('section.product_details')) {
		var product_thumbnails = document.querySelectorAll('img.thumbnail');
		var big_image = document.querySelectorAll('img.big_image')[0].classList.add('visible');
		for (var i = 0, count = product_thumbnails.length; i<count; i++) {
			product_thumbnails[i].dataset.index = i;
			product_thumbnails[i].addEventListener('click', Site.handle_product_thumbnail);
		}
	}
};

// connect document `load` event with handler function
$(Site.on_load);