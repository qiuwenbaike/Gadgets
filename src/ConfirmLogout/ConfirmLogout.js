/**
 * SPDX-License-Identifier: GPL-3.0
 * _addText: '{{Gadget Header|license=GPL-3.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-ConfirmLogout.js
 * @license GPL-3.0
 * @dependency ext.gadget.SiteCommonJs, ext.gadget.ding, mediawiki.api, oojs-ui-windows
 */
/* !
 * @author 安忆
 * @file ConfirmLogout.js
 *
 * Copyright (c) 2021-present, 安忆.
 *
 * This source code is licensed under the GPL v3 license.
 */
(function ($, mw) {
var confirmLogout = function () {
	var dom = document.querySelector('#ca-cb-logout>a') || document.querySelector('.menu__item--logout') || document.querySelector('#pt-logout>a');
	if (dom && mw.config.get('wgUserName')) {
		var newDom = document.createElement('a');
		if (dom.className) {

			newDom.className = dom.className;
		}
		newDom.href = dom.href;
		newDom.innerHTML = dom.innerHTML;
		dom.parentNode.appendChild(newDom);
		dom.parentNode.removeChild(dom); // ES6: dom.remove()
		newDom.addEventListener('click', function (e) {
			e.preventDefault();
			e.stopPropagation();
			OO.ui.confirm($('<div class="oo-ui-window-foot" style="border:.1rem solid #0645ad;display:flex;justify-content:space-evenly"><span style="font-size:1.2rem;font-weight:500;line-height:1.8;padding:.4em 0">您' + wgUVS('确', '確') + '定要' + wgUVS('退', '登') + '出' + wgUVS('吗', '嗎') + '？</span></div>')).then(function (confirmed) {
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
};
mw.loader.using([ 'ext.gadget.ding', 'mediawiki.api', 'oojs-ui-windows' ]).then(function () {
	$(confirmLogout);
});
}(jQuery, mw));
