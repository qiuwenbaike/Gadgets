/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Common.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
'use strict';

/* <nowiki> */
/**
 * 这里的脚本仅为所有桌面版用户加载。
 * 作为小工具加载，请编辑[[MediaWiki:Gadget-SiteCommon.js]]。
 * 为登录用户加载请编辑[[MediaWiki:Group-user.js]]。
 */
mw.loader.using('ext.gadget.SiteCommonJs');
(function ($, mw) {
/* 方案1：来自外站的合理使用图片重定向至原位 */
// if (mw.config.get('wgNamespaceNumber') === 6 && $('#ca-view-foreign').length > 0) {
// if ($('#ca-talk').length > 0) { $('#ca-talk').remove(); }
// if ($('#ca-timedtext').length > 0) { $('#ca-timedtext').remove(); }
// if ($('#ca-edit').length > 0) { $('#ca-edit').remove(); }
// window.location.href = $('#ca-view-foreign > a').attr('href');
// }
/* 方案2：来自外站的合理使用图片，页面元素移除 */
if (mw.config.get('wgNamespaceNumber') === 6 && $('#ca-view-foreign').length > 0) {
	if ($('#ca-talk').length > 0) {
		$('#ca-talk').remove();
	}
	if ($('#ca-timedtext').length > 0) {
		$('#ca-timedtext').remove();
	}
	if ($('#ca-edit').length > 0) {
		$('#ca-edit').remove();
	}
	if ($('#ca-ve-edit').length > 0) {
		$('#ca-ve-edit').remove();
	}
	if ($('#Wikiplus-Edit-TopBtn').length > 0) {
		$('#Wikiplus-Edit-TopBtn').remove();
	}
	if ($('#filetoc').length > 0) {
		$('#filetoc').remove();
	}
	if ($('#file').length > 0) {
		$('#file').remove();
	}
	if ($('#filehistory').length > 0) {
		$('#filehistory').remove();
	}
	if ($('#mw-imagepage-section-filehistory').length > 0) {
		$('#mw-imagepage-section-filehistory').remove();
	}
	if ($('#filelinks').length > 0) {
		$('#filelinks').remove();
	}
	if ($('#mw-imagepage-section-linkstoimage').length > 0) {
		$('#mw-imagepage-section-linkstoimage').remove();
	}
}
}(jQuery, mediaWiki));
/* </nowiki> */
