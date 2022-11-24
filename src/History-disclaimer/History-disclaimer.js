/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-History-disclaimer.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
'use strict';

/* History disclaimer */
$(function (mw) {
	if ((mw.config.get('wgCurRevisionId') || -1) > 0 && (mw.config.get('wgRevisionId') || -1) > 0 && (mw.config.get('wgCurRevisionId') || -1) > (mw.config.get('wgRevisionId') || -1)) {
		$('<div>').attr('id', 'historyDisclaimer').appendTo($('body'));
	}
}(mediaWiki));
