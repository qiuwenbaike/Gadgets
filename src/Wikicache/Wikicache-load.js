/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-Wikicache-load.js
 * @source https://zh.wikipedia.org/wiki/User:PhiLiP/wikicache/load.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 * @dependency ext.gadget.SiteCommonJs
 */
'use strict';

$(function () {
	if (window.JSON === undefined) {
		mw.loader.load('/index.php?title=MediaWiki:Gadget-JSON2.js&action=raw&ctype=text/javascript&smaxage=21600&maxage=86400', autoload);
	} else {
		autoload();
	}
	function autoload() {
		mw.loader.getScript('/index.php?title=MediaWiki:Gadget-jQuery.storage.js&action=raw&ctype=text/javascript&smaxage=21600&maxage=86400').then(function () {
			mw.loader.load('/index.php?title=MediaWiki:Gadget-Wikicache.js&action=raw&ctype=text/javascript&smaxage=21600&maxage=86400');
		});
	}
});
