/**
 * SPDX-License-Identifier: CC-BY-SA-3.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-ToolsRedirect-opt-bolds.js
 * @source https://zh.wikipedia.org/wiki/MediaWiki:Gadget-ToolsRedirect-opt-bolds.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0>
 */
'use strict';

mw.loader.using([ 'ext.gadget.ToolsRedirect' ], function () {
	mw.toolsRedirect.findRedirectBySelector('div#mw-content-text p > b');
});
