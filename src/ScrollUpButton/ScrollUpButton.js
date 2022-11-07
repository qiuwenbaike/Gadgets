/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{CC-BY-SA-4.0}}'
 */
/**
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-ScrollUpButton.js
 * @source https://zh.wikipedia.org/wiki/MediaWiki:Gadget-scrollUpButton.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
/* scrollUpButton
 * Add a button to scroll up to the top of the current page.
 * @rev 3 (2019-28-07)
 * @author Kwj2772
 * @contributor Perhelion
 * No internationalisation required
 * [kowiki] Fixed an issue with help-panel-button ([[ko:User:ykhwong]])
 * [zhwiki] Add a timer to autohide button, check more gadgets. Add scrollDownButton
 *   @from https://ko.wikipedia.org/?oldid=25440719 CC BY-SA 3.0 <https://creativecommons.org/licenses/by-sa/3.0/>
 *   @maintainer 安忆 (https://zh.wikipedia.org/wiki/User:安忆)
 * [qwwiki] subsititute the icon
 *  scrollButtonIcon from https://www.qiuwenbaike.cn/wiki/File:Up_Arrow_(Blue,_White_BG).svg
 */
(function ($) {
var scrollButtonIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCAxMy4yMjkgMTMuMjI5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjYuNjE0IiBjeT0iNi42MTQiIHI9IjUuOTU3IiBmaWxsPSIjZmZmIiBzdHJva2U9IiMzNmMiIHN0cm9rZS13aWR0aD0iMS4zMTUiLz48cGF0aCBkPSJNNS44NjYgMTAuMjY0aDEuNDk3VjUuMTdsMS45NDEgMi4xNzcgMS4wMTUtLjg5LTMuNjc0LTMuODFoLS4wNjFMMi45MSA2LjQ1NmwxLjAyNy44OSAxLjkzLTIuMTc3WiIgZmlsbD0iIzM2YyIgc3Ryb2tlLXdpZHRoPSIuMzA5MTkyIi8+PC9zdmc+';
if (!document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1')) {
	scrollButtonIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAArlBMVEUAAAAxZc4zZswzZ8wzZswzZswzZ8wzZswzZswyZs0zZswzZswzZswzZswzZswxYs40Z8syZs0zZcwyZc0zZsw1ZcoxZ87///8zZsxZg9aguOjx9fyku+g4as5BcNDs8PrR3fR8nd81Z8zz9vzV4PW9zu95m95qj9pQfNTl7PlJd9I/b8/a4/bE0/CVr+Rskdpchdb7/P709/zd5vfF1PFxldxEctCqwOqRreSBoN/HTNawAAAAF3RSTlMAB8gY9PGVg+NG+enZwZYaSpiXLeUwL0nKGqkAAAGDSURBVDjLjVPZdoJADB1296pdiICIsrjgWqtt///HescMIGdeeh84THInN8kkooExdocD2x4M3a4hdLxMHKrhTC3RhuHZ1ILtGa3rJgHzU5QnSR6t5wSYT0HeOzDEwaevkAYxDJ3X+v4bjsvQf0K4lAxL6SP+KlCeJFE/wQoqnIcHcuXfx2VWMWD2HgI24lf+O1G5Vweo2FJkgvyU/nVHwP2q8kCmI2SA/kRs2cIvsdvWIo4hxqif61tsiFqMFP3oihHRqfbPY+jBvFk8TGsiVwyVwmKGYnN8ZodVxYhQqRgQ5TKjM0mmJPjfhK/M+4uoL1Ck7M0Nxh+fCf4RhxuMGVFPOCCwQuFXBP+XNltFYAkgPV4awuUIBZbgJBk1gcFJcpk6oSlTNirUCU2jZKsDndC0Wkz5sXRCWEoFISx+bp1Q8HO3B6Y4n4vWwGgjB2gjJ6yOPrQFD63CB499WruDshl7jsGLs44OWXbQFuc/qwdYo+fldS2hw+i6Zr/X65ut9f8DrtxN+RUzFqcAAAAASUVORK5CYII=';
}

var $scrollDownButton = $('<img>').attr({
	src: scrollButtonIcon,
	id: 'scrollDownButton'
}).css({
	'cursor': 'pointer',
	'opacity': 0.7,
	'position': 'fixed',
	'display': 'none',
	'right': '18px',
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
	id: 'scrollUpButton'
}).css({
	'cursor': 'pointer',
	'opacity': 0.7,
	'position': 'fixed',
	'display': 'none',
	'right': '18px',
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
}(jQuery));
