/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-Banimage.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 * @dependency ext.gadget.Wikiplus
 */
/**
 * @author Jinzhe Zeng
 * @global Wikiplus
 */
/* eslint-disable no-script-url */

'use strict';

mw.loader.using([ 'ext.gadget.Wikiplus' ]).then(function () {
	if (!window.Wikiplus) {
		return;
	}

	window.banImage = function banImage() {
		window.Wikiplus.kotori.redirectTo('File:Banned Images.svg', window.Wikiplus.kotori.pageName, {
			success: function success() {
				window.Wikiplus.notice.create.success('创建重定向成功！');
				location.href = mw.config.get('wgArticlePath').replace(/\$1/gi, window.Wikiplus.kotori.pageName);
			},
			fail: function fail(d) {
				window.Wikiplus.notice.create.error('错误：' + d.message);
			}
		});
	};
	window.banArticle = function banArticle() {
		window.Wikiplus.kotori.redirectTo('Qiuwen:首页', window.Wikiplus.kotori.pageName, {
			success: function success() {
				window.Wikiplus.notice.create.success('创建重定向成功！');
				location.href = mw.config.get('wgArticlePath').replace(/\$1/gi, window.Wikiplus.kotori.pageName);
			},
			fail: function fail(d) {
				window.Wikiplus.notice.create.error('错误：' + d.message);
			}
		});
	};
	window.banTemplate = function banTemplate() {
		window.Wikiplus.kotori.redirectTo('Template:Void', window.Wikiplus.kotori.pageName, {
			success: function success() {
				window.Wikiplus.notice.create.success('创建重定向成功！');
				location.href = mw.config.get('wgArticlePath').replace(/\$1/gi, window.Wikiplus.kotori.pageName);
			},
			fail: function fail(d) {
				window.Wikiplus.notice.create.error('错误：' + d.message);
			}
		});
	};
	$(function () {
		if (mw.config.get('wgNamespaceNumber') === 0) {
			mw.util.addPortletLink('p-cactions', 'javascript:window.banArticle();', '禁用此页面');
		}
		if (mw.config.get('wgNamespaceNumber') === 6) {
			mw.util.addPortletLink('p-cactions', 'javascript:window.banImage();', '禁用此图片');
		}
		if (mw.config.get('wgNamespaceNumber') === 10) {
			mw.util.addPortletLink('p-cactions', 'javascript:window.banTemplate();', '禁用此模板');
		}
	});
});
