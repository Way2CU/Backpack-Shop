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

	// create function to open drop down menu
	var menu = document.getElementById('main');
	menu.addEventListener('click', Site.handle_menu_click);

	// create pagecontrol for home page slider
	Site.slider = new PageControl('div#slider', 'img');
	Site.slider
		.setWrapAround(true)
		.attachControls('div#slider a');

	// create function for rotating product big image
	var product_thumbnails = document.querySelectorAll('img.thumbnail');
	var big_image = document.querySelectorAll('img.big_image')[0].classList.add('visible');
	for (var i = 0, count = product_thumbnails.length; i<count; i++) {
		product_thumbnails[i].dataset.index = i;
		product_thumbnails[i].addEventListener('click', Site.handle_product_thumbnail);
	}
};


// connect document `load` event with handler function
$(Site.on_load);
