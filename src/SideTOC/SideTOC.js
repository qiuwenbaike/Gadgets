/**
 * SPDX-License-Identifier: GPL-3.0
 * _addText: '{{Gadget Header|license=GPL-3.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-SideTOC.js
 * @license GPL-3.0
 */
'use strict';

// 仅保留平滑滚动部分；核心部分已移动至主题内部
$(function () {
	window.setTimeout(function () {
		$('#toc a, #site-toc a').each(function () {
			$(this).on('click', function () {
				$('html, body').animate({
					scrollTop: $($(this).attr('href')).offset().top - 60 + 'px'
				}, {
					duration: 660,
					easing: 'swing'
				});
				return false;
			});
		});
	}, 0);
});
