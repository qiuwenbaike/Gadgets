/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-Wikicache-load.js
 * @source zh.wikipedia.org/w/index.php?oldid=16537574
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
'use strict';

(function ($, mw) {
mw.loader.getScript('/index.php?title=MediaWiki:Gadget-jQuery.storage.js&action=raw&ctype=text/javascript&smaxage=3600&maxage=3600').then(function () {
	mw.loader.load('/index.php?title=MediaWiki:Gadget-Wikicache.js&action=raw&ctype=text/javascript&smaxage=3600&maxage=3600');
});
}(jQuery, mediaWiki));
