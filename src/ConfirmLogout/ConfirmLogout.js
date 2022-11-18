/**
 * SPDX-License-Identifier: GPL-3.0
 * _addText: '{{Gadget Header|license=GPL-3.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-ConfirmLogout.js
 * @license GPL-3.0
 * @dependency ext.gadget.SiteCommonJs, ext.gadget.Ding, mediawiki.api, oojs-ui-windows
 */
'use strict';

/* !
 * @author 安忆
 * @file ConfirmLogout.js
 *
 * Copyright (c) 2021-present, 安忆.
 *
 * This source code is licensed under the GPL v3 license.
 */
(function ($, mw) {
mw.loader.using([ 'ext.gadget.Ding', 'mediawiki.api', 'oojs-ui-windows' ]).then(function () {
	$(function () {
		var dom = document.querySelector('#ca-cb-logout>a') || document.querySelector('.menu__item--logout') || document.querySelector('#pt-logout>a');
		if (dom && mw.config.get('wgUserName')) {
			var newDom = document.createElement('a');
			if (dom.className) {
				newDom.className = dom.className;
			}
			newDom.href = dom.href;
			newDom.innerHTML = dom.innerHTML;
			dom.parentNode.appendChild(newDom);
			dom.parentNode.removeChild(dom);
			newDom.addEventListener('click', function (e) {
				e.preventDefault();
				e.stopPropagation();
				OO.ui.confirm($('<div>').attr({
					class: 'oo-ui-window-foot',
					style: 'border: .1rem solid #0645ad; display: flex; justify-content: space-evenly;'
				}).html($('<span>').attr({
					style: 'font-size :1.2rem; font-weight: 500; line-height: 1.8; padding: .4em 0'
				}).text('您' + wgUVS('确', '確') + '定要' + wgUVS('退', '登') + '出' + wgUVS('吗', '嗎') + '？'))).then(function (confirmed) {
					if (confirmed) {
						window.bldkDingExposedInterface(mw.message('logging-out-notify'), 'default', 'long');
						new mw.Api().postWithEditToken({
							action: 'logout'
						}).then(function () {
							window.location.reload();
						});
					}
				});
			});
		}
	});
});
}(jQuery, mediaWiki));
