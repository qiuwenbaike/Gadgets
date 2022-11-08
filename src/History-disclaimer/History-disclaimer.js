/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{CC-BY-SA-4.0}}'
 * _addText: '{{Gadget Header}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-History-disclaimer.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 * @dependency ext.gadget.SiteCommonJs
 */
'use strict';
$(function () {
	/* History disclaimer */
	if (
		(mw.config.get('wgCurRevisionId') || -1) > 0 &&
		(mw.config.get('wgRevisionId') || -1) > 0 &&
		((mw.config.get('wgCurRevisionId') || -1) > (mw.config.get('wgRevisionId') || -1))
	) {
		$('<div>').css({
			'display': 'block',
			'background': "url('/resources/assets/qiuwen/history-notice/historynotice-" + wgULS('zh-hans', 'zh-hant') + ".png') repeat",
			'z-index': '99999',
			'pointer-events': 'none',
			'position': 'fixed',
			'inset': '5em 0 0'
		}).appendTo($('body'));
	}
});
