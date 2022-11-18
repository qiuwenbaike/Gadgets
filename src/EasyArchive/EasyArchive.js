/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-EasyArchive.js
 * @source https://zh.wikipedia.org/wiki/MediaWiki:Gadget-easy-archive.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
/* eslint-disable camelcase */

'use strict';

if (!('bluedeck' in window)) {
	window.bluedeck = {};
}
if (!('external_config' in window.bluedeck)) {
	window.bluedeck.external_config = {};
}
if (!('easy_archive' in window.bluedeck.external_config)) {
	window.bluedeck.external_config.easy_archive = {};
}
window.bluedeck.external_config.easy_archive.never_enable_on_these_pages_regex = [];
window.bluedeck.external_config.easy_archive.never_enable_on_these_namespaces_int = [ 0 ];

/* Due to ES6 issues */
/* _addText: '{{editnotice|text=因技术原因，源代码请参见[[MediaWiki:Gadget-EasyArchive-main.js|Gadget-EasyArchive-main.js]]。}}' */
mw.loader.load('/index.php?title=MediaWiki:Gadget-EasyArchive-main.js&action=raw&ctype=text/javascript&smaxage=3600&maxage=3600');
