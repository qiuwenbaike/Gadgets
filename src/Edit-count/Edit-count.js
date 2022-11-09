'use strict';

/**
 * SPDX-License-Identifier: CC-BY-SA-3.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-3.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-Edit-count.js
 * @license <https://creativecommons.org/licenses/by-sa/3.0/>
 */
/* 原作者：安忆； CC BY-SA 3.0 <https://creativecommons.org/licenses/by-sa/3.0/> */
(function (a) {
if (a !== null) {
	mw.loader.addStyleTag('#pt-mycontris>a::after, .menu__item--userContributions>span>span::after, #mw-mf-page-left .menu__item--userContributions>span::after {content: " (' + a + ')"}');
}
}(mw.config.get('wgUserEditCount')));
