(function ($) {
	"use strict";

	if ($(".tabs-box").length) {
		$(".tabs-box .tab-buttons .tab-btn").on("click", function (e) {
			e.preventDefault();
			var target = $($(this).attr("data-tab"));

			if ($(target).is(":visible")) {
				return false;
			} else {
				target
					.parents(".tabs-box")
					.find(".tab-buttons")
					.find(".tab-btn")
					.removeClass("active-btn");
				$(this).addClass("active-btn");
				target
					.parents(".tabs-box")
					.find(".tabs-content")
					.find(".tab")
					.fadeOut(0);
				target
					.parents(".tabs-box")
					.find(".tabs-content")
					.find(".tab")
					.removeClass("active-tab");
				$(target).fadeIn(300);
				$(target).addClass("active-tab");
			}
		});
	}



	if ($(".wow").length) {
		var wow = new WOW({
			boxClass: "wow", // animated element css class (default is wow)
			animateClass: "animated", // animation css class (default is animated)
			mobile: true, // trigger animations on mobile devices (default is true)
			live: true, // act on asynchronously loaded content (default is true)
		});
		wow.init();
	}


	if ($(".marquee_mode").length) {
		$('.marquee_mode').marquee({
			speed: 50,
			gap: 0,
			delayBeforeStart: 0,
			direction: 'left',
			duplicated: true,
			pauseOnHover: true,
			startVisible: true,
		});
	}

	if ($(".marquee_mode-two").length) {
		$('.marquee_mode-two').marquee({
			speed: 50,
			gap: 0,
			delayBeforeStart: 0,
			direction: 'right',
			duplicated: true,
			pauseOnHover: true,
			startVisible: true,
		});
	}
	// ===Portfolio===
	function projectMasonaryLayout() {
		if ($(".masonary-layout").length) {
			$(".masonary-layout").isotope({
				layoutMode: "masonry"
			});
		}
		if ($(".post-filter").length) {
			$(".post-filter li")
				.children(".filter-text")
				.on("click", function () {
					var Self = $(this);
					var selector = Self.parent().attr("data-filter");
					$(".post-filter li").removeClass("active");
					Self.parent().addClass("active");
					$(".filter-layout").isotope({
						filter: selector,
						animationOptions: {
							duration: 500,
							easing: "linear",
							queue: false
						}
					});
					return false;
				});
		}

		if ($(".post-filter.has-dynamic-filters-counter").length) {
			// var allItem = $('.single-filter-item').length;
			var activeFilterItem = $(".post-filter.has-dynamic-filters-counter").find(
				"li"
			);
			activeFilterItem.each(function () {
				var filterElement = $(this).data("filter");
				var count = $(".filter-layout").find(filterElement).length;
				$(this)
					.children(".filter-text")
					.append('<span class="count">' + count + "</span>");
			});
		}
	}


	// Type Effect
	if ($('.typed-effect').length) {
		$('.typed-effect').each(function () {
			var typedStrings = $(this).data('strings');
			var typedTag = $(this).attr('id');
			var typed = new Typed('#' + typedTag, {
				typeSpeed: 100,
				backSpeed: 100,
				fadeOut: true,
				loop: true,
				strings: typedStrings.split(',')
			});
		});

	}

	// window load event
	$(window).on("load", function () {

		projectMasonaryLayout();

		if ($(".post-filter").length) {
			var postFilterList = $(".post-filter li");
			// for first init
			$(".filter-layout").isotope({
				filter: ".filter-item",
				animationOptions: {
					duration: 500,
					easing: "linear",
					queue: false
				}
			});
			// on click filter links
			postFilterList.on("click", function () {
				var Self = $(this);
				var selector = Self.attr("data-filter");
				postFilterList.removeClass("active");
				Self.addClass("active");

				$(".filter-layout").isotope({
					filter: selector,
					animationOptions: {
						duration: 500,
						easing: "linear",
						queue: false
					}
				});
				return false;
			});
		}

		if ($(".post-filter.has-dynamic-filter-counter").length) {
			// var allItem = $('.single-filter-item').length;

			var activeFilterItem = $(".post-filter.has-dynamic-filter-counter").find(
				"li"
			);

			activeFilterItem.each(function () {
				var filterElement = $(this).data("filter");
				var count = $(".filter-layout").find(filterElement).length;
				$(this).append("<sup>[" + count + "]</sup>");
			});
		}


	});

	// window scroll event


})(jQuery);