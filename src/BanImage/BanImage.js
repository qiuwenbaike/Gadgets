/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-BanImage.js
 * @author Jinzhe Zeng
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 * @dependency ext.gadget.window.Wikiplus
 */
/* global Wikiplus */
/* eslint-disable no-script-url */
'use strict';

mw.loader.using([ 'ext.gadget.Wikiplus' ], (function (mw) {
	var banPage = function banPage(targetName, currentName) {
		Wikiplus.kotori.redirectTo(targetName, currentName, {
			success: function success() {
				Wikiplus.notice.create.success('创建重定向成功！');
				location.href = mw.config.get('wgArticlePath').replace(/\$1/gi, currentName);
			},
			fail: function fail(d) {
				Wikiplus.notice.create.error('错误：' + d.message);
			}
		});
	};
	if (mw.config.get('wgNamespaceNumber') === 0) {
		window.banImage = banPage('File:Banned Images.svg', Wikiplus.kotori.pageName);
		mw.util.addPortletLink('p-cactions', 'javascript:window.banArticle();', '禁用此页面');
	}
	if (mw.config.get('wgNamespaceNumber') === 6) {
		window.banArticle = banPage('Qiuwen:首页', Wikiplus.kotori.pageName);
		mw.util.addPortletLink('p-cactions', 'javascript:window.banImage();', '禁用此图片');
	}
	if (mw.config.get('wgNamespaceNumber') === 10) {
		window.banTemplate = banPage('Template:Void', Wikiplus.kotori.pageName);
		mw.util.addPortletLink('p-cactions', 'javascript:window.banTemplate();', '禁用此模板');
	}
}(mediaWiki)));
