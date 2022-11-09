/**
 * SPDX-License-Identifier: GPL-3.0
 * _addText: '{{Gadget Header|license=GPL-3.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-ShortURL.js
 * @source https://zh.wikipedia.org/wiki/MediaWiki:Gadget-Difflink.js
 * @license GPL-3.0
 */
/*
 * @author WaitSpring
 * @author 安忆 (AnYiLin)
 *
 * Copyright (c) 2020-present, 安忆.
 * Copyright (c) 2021-present, WaitSpring
 *
 * This source code is licensed under the GPLv3 license.
 */
'use strict';

/* 生成短链接 */
(function ($, mw) {
if (mw.config.get('wgNamespaceNumber') !== -1 && /* 不为特殊页面生成短链接 */
  $('.noarticletext').length === 0 && (/* 不为不存在的页面生成短链接 */
	// eslint-disable-next-line no-mixed-operators
	mw.config.get('wgDiffOldId') && mw.config.get('wgDiffNewId') || $('.mw-revision.warningbox').length !== 0 || mw.config.get('wgArticleId') !== 0) /* 不为不存在的页面版本生成短链接 */) {
	mw.loader.using([ 'mediawiki.api', 'mediawiki.util', 'mediawiki.widgets', 'oojs-ui-windows' ]).then(function () {
		var sidebarTitle = wgULS('短链接', '短網址'),
			sidebarDesc = wgULS('显示该页短链接', '顯示該頁短網址'),
			sidebarLink = mw.util.addPortletLink($('#p-pagemisc').length !== 0 ? 'p-pagemisc' : 'p-tb', '#', sidebarTitle, 't-report', sidebarDesc),
			shorturlTitle = wgULS('本页短链接：', '本頁短網址：'),
			shorturl = '';
		if (mw.config.get('wgDiffNewId')) {
			/* Code block from 安忆, see [[MediaWiki:Gadget-Difflink.js]] */
			if (mw.config.get('wgDiffOldId')) {
				new mw.Api().get({
					action: 'compare',
					fromrev: mw.config.get('wgDiffNewId'),
					prop: 'ids',
					torelative: 'prev'
				}).then(function (data) {
					if (!(data.compare && data.compare.fromrev === mw.config.get('wgDiffOldId'))) {
						shorturl += '/p/' + mw.config.get('wgRevisionId');
					} else {
						shorturl += '/d/' + mw.config.get('wgRevisionId') + '/' + mw.config.get('wgDiffOldId');
					}
				});
			}
		} else if (mw.config.get('wgArticleId') !== 0) {
			shorturl += '/c/' + mw.config.get('wgArticleId');
		} else {
			return;
		}
		$(sidebarLink).on('click', function (e) {
			e.preventDefault();
			var $dom = $('<div>');
			[ 'https://bkwz.cn' + shorturl, 'https://qwbk.cc' + shorturl ].forEach(function (url) {
				/* 'https://qwbk.org' + shorturl, */
				$dom.append(new mw.widgets.CopyTextLayout({
					align: 'top',
					copyText: url
				}).$element);
			});
			OO.ui.alert($dom, {
				title: shorturlTitle,
				size: 'medium'
			});
		});
	});
}
}(jQuery, mediaWiki));
