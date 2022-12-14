/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-ScrollUpButton.js
 * @source https://zh.wikipedia.org/wiki/MediaWiki:Gadget-scrollUpButton.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
'use strict';

/* scrollUpButton
 * Add a button to scroll up to the top of the current page.
 * @rev 3 (2019-28-07)
 * @author Kwj2772
 * @contributor Perhelion
 * No internationalisation required
 * [kowiki] Fixed an issue with help-panel-button (ykhwong)
 * [zhwiki] Add a timer to autohide button, check more gadgets. Add scrollDownButton
 *   @from https://ko.wikipedia.org/?oldid=25440719 CC BY-SA 3.0 <https://creativecommons.org/licenses/by-sa/3.0/>
 *   @maintainer 安忆 (https://zh.wikipedia.org/wiki/User:安忆)
 * [qiuwen] subsititute the icon
 *  scrollButtonIcon from https://www.qiuwenbaike.cn/wiki/File:Up_Arrow_(Blue,_White_BG).svg
 */
$(function () {
	var scrollButtonIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCAxMy4yMjkgMTMuMjI5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjYuNjE0IiBjeT0iNi42MTQiIHI9IjUuOTU3IiBmaWxsPSIjZmZmIiBzdHJva2U9IiMzNmMiIHN0cm9rZS13aWR0aD0iMS4zMTUiLz48cGF0aCBkPSJNNS44NjYgMTAuMjY0aDEuNDk3VjUuMTdsMS45NDEgMi4xNzcgMS4wMTUtLjg5LTMuNjc0LTMuODFoLS4wNjFMMi45MSA2LjQ1NmwxLjAyNy44OSAxLjkzLTIuMTc3WiIgZmlsbD0iIzM2YyIgc3Ryb2tlLXdpZHRoPSIuMzA5MTkyIi8+PC9zdmc+';
	var $scrollDownButton = $('<img>').attr({
		src: scrollButtonIcon,
		id: 'scrollDownButton',
		alt: '滚动至页底'
	}).css({
		'cursor': 'pointer',
		'opacity': 0.7,
		'position': 'fixed',
		'display': 'none',
		'right': '8px',
		'user-select': 'none',
		'width': '32px',
		'height': '32px',
		'transform': 'rotate(180deg)'
	}).on('click', function () {
		$('html, body').animate({
			scrollTop: $(document).height() - $(window).height()
		}, 660);
	}).on('mouseenter mouseleave', function (e) {
		this.style.opacity = e.type === 'mouseenter' ? 1 : 0.7;
	}).attr('draggable', 'false').appendTo('body');
	var $scrollUpButton = $('<img>').attr({
		src: scrollButtonIcon,
		id: 'scrollUpButton',
		alt: '滚动至页顶'
	}).css({
		'cursor': 'pointer',
		'opacity': 0.7,
		'position': 'fixed',
		'display': 'none',
		'right': '8px',
		'width': '32px',
		'height': '32px',
		'user-select': 'none'
	}).on('click', function () {
		$('html, body').animate({
			scrollTop: 0
		}, 660);
	}).on('mouseenter mouseleave', function (e) {
		this.style.opacity = e.type === 'mouseenter' ? 1 : 0.7;
	}).attr('draggable', 'false').appendTo('body');
	var scrollButtonTimer;
	$(window).on('scroll', function () {
		if ($('#cat_a_lot').length > 0 || $('#proveit').length > 0 || $('.wordcount').length > 0) {
			$scrollDownButton.css('bottom', '78px');
			$scrollUpButton.css('bottom', '120px');
		} else {
			$scrollDownButton.css('bottom', '36px');
			$scrollUpButton.css('bottom', '78px');
		}
		if ($(this).scrollTop() > 60) {
			$scrollDownButton.fadeIn('slow');
			$scrollUpButton.fadeIn('slow');
		} else {
			$scrollDownButton.fadeOut('slow');
			$scrollUpButton.fadeOut('slow');
		}
		this.clearTimeout(scrollButtonTimer);
		scrollButtonTimer = this.setTimeout(function () {
			$scrollDownButton.fadeOut('slow');
			$scrollUpButton.fadeOut('slow');
		}, 2000);
	});
	$scrollDownButton.on('mouseenter', function () {
		window.clearTimeout(scrollButtonTimer);
	});
	$scrollUpButton.on('mouseenter', function () {
		window.clearTimeout(scrollButtonTimer);
	});
}());
