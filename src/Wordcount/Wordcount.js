/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-Wordcount.js
 * @source https://zh.wikipedia.org/wiki/MediaWiki:Gadget-Wordcount.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0>
 */

'use strict';

(function ($, mw) {
function bytecount(text) {
	// eslint-disable-next-line no-control-regex
	text = text.replace(/[\u0000-\u007F]/g, '.');
	text = text.replace(/[\u0080-\u07FF\uD800-\uDFFF]/g, '..');
	text = text.replace(/[\u0800-\uD7FF\uE000-\uFFFF]/g, '...');
	return text.length;
}
function cjkcount(text) {
	text = text.replace(/\./g, '');
	text = text.replace(/[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FCC\uF900-\uFA6D\uFA70-\uFAD9]|[\uD840-\uD868][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|[\uD86A-\uD86C][\uDC00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]/g, '.');
	// eslint-disable-next-line no-useless-escape
	text = text.replace(/[^\.]/g, '');
	return text.length;
}
function getwcbytext(text) {
	return text.length + ' character(s) (' + cjkcount(text) + ' CJK)<br>' + bytecount(text) + ' byte(s) in <a href="' + mw.config.get('wgScript') + '?title=UTF-8">UTF-8</a> encoding';
}
function getsel() {
	return window.getSelection().toString();
}
function dowc() {
	$('.wordcount').remove();
	var text = getsel();
	if (text.length === 0) {
		return;
	}
	var divj = $('<div>').html(getwcbytext(text)).css({
		position: 'fixed',
		right: '0',
		bottom: '0',
		margin: '4px',
		padding: '6px'
	}).addClass('wordcount ui-state-highlight ui-corner-all').appendTo('body');
	window.setTimeout(function () {
		divj.fadeOut('slow');
	}, 5000);
}
if ('ontouchstart' in document) {
	$(document).on('touchstart touchend', dowc);
} else {
	$(document).on('mouseup', dowc).on('keyup', dowc);
}
}(jQuery, mediaWiki));
