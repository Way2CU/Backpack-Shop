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

		// create remove item control
		self.label_remove = document.createElement('a');
		self.label_remove.innerHTML = '<svg><use href="#close" xlink:href='+ self.base_url+' /site/images/site-sprite.svg#close/></svg>';
		self.label_remove.className = "remove";
		self.label_remove.addEventListener('click', self._handle_remove);
		self.label_controls.appendChild(self.label_remove);

		// create increase item count control
		self.label_increase = document.createElement('a');
		self.label_increase.innerHTML = '<svg><use href="#plus" xlink:href='+ self.base_url+' /site/images/site-sprite.svg#plus/></svg>';
		self.label_increase.className = "increase";
		self.label_increase.setAttribute('data-direction', 1);
		self.label_increase.addEventListener('click', self.controls.handle_alter);
		self.label_controls.appendChild(self.label_increase);

		// create decrease item count control
		self.label_decrease = document.createElement('a');
		self.label_decrease.innerHTML = '<svg><use href="#minus" xlink:href='+ self.base_url+' /site/images/site-sprite.svg#minus/></svg>';
		self.label_decrease.className = "decrease";
		self.label_decrease.setAttribute('data-direction', -1);
		self.label_decrease.addEventListener('click', self.controls.handle_alter);
		self.label_controls.appendChild(self.label_decrease);
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
 * Function which handles altering item amount on page.
 *
 * @param object event
 */
Site.alter_item_count = function(event) {
	var control = $(this);
	var difference = control.hasClass('increase') ? 1 : -1;
	var uid = control.data('uid');

	// get item with specified unique id
	var item = Site.cart.get_item_by_uid(uid);

	if (item == null && difference > 0) {
		// create new item
		Site.cart.add_item_by_uid(uid);

	} else {
		item.remove();
	}
};

/**
 * Handle clicking on button add to cart
 */
Site.handle_add_to_cart = function(event) {
	// prevent default behaviour
	event.preventDefault();

	var uid = document.querySelector('div.detail').getAttribute('data-uid');

	// insert item to cart
	Site.cart.add_item_by_uid(uid);
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

	// configure shopping cart
	Site.cart = new Caracal.Shop.Cart();
	Site.cart
		.set_checkout_url('/shop/checkout')
		.ui.add_item_list($('ul#products'))
		.ui.add_total_count_label($('div.cart span.products_count'))
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