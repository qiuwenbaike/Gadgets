/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{CC-BY-SA-4.0}}'
 * _addText: '{{Gadget Header}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-Did-you-mean.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
(function ($, mw) {
if ($('#noarticletext-dym-link a:not(.mw-selflink)').length !== 0) {
	var url = $('#noarticletext-dym-link a:not(.mw-selflink)').attr('href');
	mw.notify(wgULS('重定向中……', '重新導向中……'));
	window.location.href = url;
}
}(jQuery, mediaWiki));
