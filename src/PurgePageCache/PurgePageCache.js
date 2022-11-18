/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/mediawiki:gadget-PurgePageCache.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 * @dependency ext.gadget.SiteCommonJs, ext.gadget.Ding, mediawiki.api, mediawiki.util
 */
'use strict';

(function ($, mw) {
if (mw.config.get('wgAction') === 'view' && mw.config.get('wgIsArticle') && mw.config.get('wgCurRevisionId') !== 0 && mw.config.get('wgRevisionId') !== 0 && mw.config.get('wgCurRevisionId') === mw.config.get('wgRevisionId')) {
	mw.loader.using([ 'ext.gadget.Ding', 'mediawiki.api', 'mediawiki.util' ]).then(function () {
		var isMinerva = document.body.classList.contains('skin-minerva'),
			pos = '';
		if (isMinerva) {
			pos = 'p-tb';
			var style = document.createElement('style');
			style.id = 'css-purgepagecache';
			style.appendChild(document.createTextNode('.mw-ui-icon-portletlink-ca-purge:before{background:url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22%3E%3Cg fill=%22%2354595d%22%3E%3Cpath d=%22M7 0a2 2 0 00-2 2h9a2 2 0 012 2v12a2 2 0 002-2V2a2 2 0 00-2-2z%22/%3E%3Cpath d=%22M13 20H4a2 2 0 01-2-2V5a2 2 0 012-2h9a2 2 0 012 2v13a2 2 0 01-2 2zm-6.5-3.5l.41-1.09L8 15l-1.09-.41-.41-1.09-.41 1.09L5 15l1.09.41.41 1.09zm2.982-.949l.952-2.561 2.53-.964-2.53-.964L9.482 8.5l-.952 2.562-2.53.964 2.53.964.952 2.561zM6 10.5l.547-1.453L8 8.5l-1.453-.547L6 6.5l-.547 1.453L4 8.5l1.453.547L6 10.5z%22/%3E%3C/g%3E%3C/svg%3E")}'));
			document.head.appendChild(style);
		} else {
			pos = 'p-cactions';
		}
		var dom = mw.util.addPortletLink(pos, '#', wgULS('清除缓存', '清除快取'), 'ca-purge', wgULS('更新服务器缓存', '更新伺服器快取'));
		var fn = function fn(e, pageTitle) {
			e.preventDefault();
			window.bldkDingExposedInterface('正在清除…', 'default', 'long');
			new mw.Api().post({
				action: 'purge',
				format: 'json',
				forcelinkupdate: true,
				titles: pageTitle
			}).then(function () {
				window.localStorage.removeItem('MediaWikiModuleStore:' + mw.config.get('wgWikiID'));
				window.location.reload(true);
			}).catch(function () {
				window.bldkDingExposedInterface(wgULS('清除失败，请重试', '清除失敗，請重試'), 'default', 'long');
			});
		};
		var clickDom = isMinerva ? dom : dom.firstElementChild;
		if (clickDom) {
			clickDom.addEventListener('click', function (e) {
				fn(e, mw.config.get('wgPageName'));
			});
		}
		var node = document.querySelectorAll('a[href*="action=purge"]');
		for (var i = 0; i < node.length; i++) {
			var params = new URL(node[i].href).searchParams,
				title = mw.config.get('wgPageName') || params.get('title');
			// eslint-disable-next-line no-loop-func
			node[i].addEventListener('click', function (e) {
				fn(e, title);
			});
		}
	});
}
}(jQuery, mediaWiki));
