/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-BanPage.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
/* eslint-disable no-script-url */
'use strict';

window.banPage = function banPage(targetName, summary) {
	var api = new mw.Api();
	api.edit(mw.config.get('wgPageName'), function () {
		return {
			text: '#REDIRECT [[' + targetName + ']]',
			summary: summary,
			minor: true
		};
	}).fail(api.create(mw.config.get('wgPageName'), {
		text: '#REDIRECT [[' + targetName + ']]',
		summary: summary,
		minor: true
	})).then(function () {
		mw.notify('页面禁用完成，即将刷新');
		location.reload(mw.config.get('wgServer') + mw.config.get('wgScript') + '?title=' + mw.config.get('wgPageName'));
	});
};
window.banImage = function banImage() {
	window.banPage('File:Banned Images.svg', '禁用此图片');
};
window.banTemplate = function banTemplate() {
	window.banPage('Template:Void', '禁用此模板');
};
window.banArticle = function banArticle() {
	window.banPage('Qiuwen:首页', '禁用此页面');
};
$(function () {
	switch (mw.config.get('wgNamespaceNumber')) {
		case 6:
			mw.util.addPortletLink('p-cactions', 'javascript:window.banImage();', '禁用此图片');
			break;
		case 10:
			mw.util.addPortletLink('p-cactions', 'javascript:window.banTemplate();', '禁用此模板');
			break;
		default:
			mw.util.addPortletLink('p-cactions', 'javascript:window.banArticle();', '禁用此页面');
			break;
	}
});
