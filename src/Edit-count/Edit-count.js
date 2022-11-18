/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-Edit-count.js
 * @author 安忆
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
'use strict';

(function (a) {
if (a !== null) {
	mw.loader.addStyleTag('#pt-mycontris>a::after, .menu__item--userContributions>span>span::after, #mw-mf-page-left .menu__item--userContributions>span::after {content: " (' + a + ')"}');
}
}(mw.config.get('wgUserEditCount')));
