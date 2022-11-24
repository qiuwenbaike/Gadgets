/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-BanPage.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
/* eslint-disable no-script-url */
'use strict';

window.banPage = function banPage() {
	var api = new mw.Api(),
		targetName = '',
		summary = '禁用此';
	switch (mw.config.get('wgNamespaceNumber')) {
		case 6:
			targetName += 'File:Banned Images.svg';
			summary += '图片';
			break;
		case 10:
			targetName += 'Template:Void';
			summary += '模板';
			break;
		default:
			targetName += 'Qiuwen:首页';
			summary += '页面';
			break;
	}
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
		window.location.href = mw.config.get('wgServer') + mw.config.get('wgScript') + '?title=' + mw.config.get('wgPageName');
	});
};
$(function () {
	var banPageTitle = '禁用此';
	switch (mw.config.get('wgNamespaceNumber')) {
		case 6:
			banPageTitle += '图片';
			break;
		case 10:
			banPageTitle += '模板';
			break;
		default:
			banPageTitle += '页面';
			break;
	}
	mw.util.addPortletLink('p-cactions', 'javascript:window.banPage();', banPageTitle);
});
