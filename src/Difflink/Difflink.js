/**
 * SPDX-License-Identifier: GPL-3.0
 * _addText: '{{Gadget Header|license=GPL-3.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-Difflink.js
 * @source https://zh.wikipedia.org/wiki/MediaWiki:Gadget-Difflink.js
 * @license GPL-3.0
 */
/*
 * @author 安忆 (AnYiLin)
 * @file Difflink.js
 *
 * Copyright (c) 2020-present, 安忆.
 *
 * This source code is licensed under the GPL v3 license.
 */
/* 如想自定义复制结果中的文本可通过向自己的common.js中加入以下内容：
 *   window.difflink = ['版本差异', '固定版本'];
 * 如想使用默认值1，但自定值2，请将值1留空，如下例：
 *   window.difflink = ['', '固定版本'];
*/

'use strict';

(function ($, mw) {
var $nav = $('#contentSub').find('#mw-revision-nav').length === 1 || $('main#content>.pre-content #mw-revision-nav').length === 1;
if (!($nav || $('table').hasClass('diff'))) {
	return;
}
mw.loader.using([ 'mediawiki.api', 'mediawiki.util', 'mediawiki.widgets', 'oojs-ui-windows' ]).then(function () {
	var defaultTex = [ wgUVS('版本差异', '版本差異'), '固定版本' ];
	if (typeof window.difflink !== 'undefined' && Object.prototype.toString.call(window.difflink) === '[object Array]') {
		if (window.difflink[0] !== '' && Object.prototype.toString.call(window.difflink[0]) === '[object String]') {
			defaultTex[0] = window.difflink[0];
		}
		if (window.difflink[1] !== '' && Object.prototype.toString.call(window.difflink[1]) === '[object String]') {
			defaultTex[1] = window.difflink[1];
		}
	}
	var isMinerva = mw.config.get('skin') === 'minerva',
		pos = 'p-cactions';
	if ($('body').hasClass('mw-special-MobileDiff')) {
		pos = 'mw-mf-diffarea';
	} else if (isMinerva) {
		pos = 'p-tb';
	}
	var ins = function ins(tex, dec, link, id, perma) {
		var linkDom = document.getElementById('t-difflink');
		if (linkDom === null) {
			linkDom = mw.util.addPortletLink(pos, '#', tex, 't-difflink', dec);
			if (linkDom === null) {
				return;
			}
			if (isMinerva) {
				var style = document.createElement('style');
				style.id = 'css-difflink';
				style.appendChild(document.createTextNode('.mw-ui-icon-portletlink-t-difflink:before{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzU0NTk1ZCI+PHBhdGggZD0iTTQuODMgMTVoMi45MWE0Ljg4IDQuODggMCAwIDEtMS41NS0ySDVhMyAzIDAgMSAxIDAtNmgzYTMgMyAwIDAgMSAyLjgyIDRoMi4xYTQuODIgNC44MiAwIDAgMCAuMDgtLjgzdi0uMzRBNC44MyA0LjgzIDAgMCAwIDguMTcgNUg0LjgzQTQuODMgNC44MyAwIDAgMCAwIDkuODN2LjM0QTQuODMgNC44MyAwIDAgMCA0LjgzIDE1ek0xNS4xNyA1aC0yLjkxYTQuODggNC44OCAwIDAgMSAxLjU1IDJIMTVhMyAzIDAgMSAxIDAgNmgtM2EzIDMgMCAwIDEtMi44Mi00aC0yLjFhNC44MiA0LjgyIDAgMCAwLS4wOC44M3YuMzRBNC44MyA0LjgzIDAgMCAwIDExLjgzIDE1aDMuMzRBNC44MyA0LjgzIDAgMCAwIDIwIDEwLjE3di0uMzRBNC44MyA0LjgzIDAgMCAwIDE1LjE3IDV6Ii8+PC9zdmc+)}'));
				document.head.appendChild(style);
			}
			if (pos === 'mw-mf-diffarea') {
				$(linkDom).css('float', 'right');
				$(linkDom).find('a>span:first-child').css('vertical-align', 'text-bottom');
			}
		}
		(pos !== 'mw-mf-diffarea' && isMinerva ? linkDom : linkDom.firstElementChild).onclick = function (e) {
			e.preventDefault();
			var $dom = $('<div>'),
				hash = perma ? decodeURIComponent(window.location.hash) : '';
			[ link, '[[' + link + hash + ']]', '[[' + link + hash + '|' + defaultTex[id] + ']]' ].forEach(function (v) {
				$dom.append(new mw.widgets.CopyTextLayout({
					align: 'top',
					copyText: v
				}).$element);
			});
			if (/(?:Android|iPhone|Mobile)/i.test(navigator.userAgent)) {
				OO.ui.alert($dom);
			} else {
				OO.ui.alert($dom, {
					size: 'medium'
				});
			}
		};
	};
	var init = function init(diffId, oldId, revisionId) {
		if (diffId) {
			var buildLink = function buildLink(_oldId) {
				var link = 'Special:Diff/';
				if (_oldId) {
					link += _oldId + '/';
				}
				link += diffId;
				ins(wgUVS('当前差异链接', '當前差異連結'), wgUVS('复制链接到当前差异版本的维基语法', '複製連結到當前差異版本的維基語法'), link, 0, 0);
			};
			buildLink(oldId);
			if (oldId) {
				new mw.Api().get({
					action: 'compare',
					fromrev: diffId,
					prop: 'ids',
					torelative: 'prev'
				}).then(function (data) {
					if (diffId === mw.config.get('wgDiffNewId') && data.compare && data.compare.fromrevid === mw.config.get('wgDiffOldId')) {
						buildLink(false);
					}
				});
			}
		} else if ($nav && revisionId) {
			ins(wgUVS('当前修订链接', '當前修訂連結'), wgUVS('复制链接到当前修订版本的维基语法', '複製連結到當前修訂版本的維基語法'), 'Special:PermaLink/' + revisionId, 1, 1);
		}
	};
	mw.hook('wikipage.content').add(function (e) {
		if (e.attr('id') !== 'mw-content-text') {
			return;
		}
		init(mw.config.get('wgDiffNewId'), mw.config.get('wgDiffOldId'), mw.config.get('wgRevisionId'));
	});
});
}(jQuery, mediaWiki));
