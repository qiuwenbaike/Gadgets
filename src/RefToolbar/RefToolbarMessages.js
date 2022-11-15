/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-RefToolbarMessages.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
'use strict';

if ([ 'zh', 'zh-hans', 'zh-cn', 'zh-my', 'zh-sg' ].indexOf(mw.config.get('wgUserLanguage')) !== -1) {
	mw.loader.load('/index.php?title=MediaWiki:Gadget-RefToolbarMessages-zh-hans.js&action=raw&ctype=text/javascript&smaxage=21600&maxage=86400');
} else if ([ 'zh-hant', 'zh-hk', 'zh-mo', 'zh-tw' ].indexOf(mw.config.get('wgUserLanguage')) !== -1) {
	mw.loader.load('/index.php?title=MediaWiki:Gadget-RefToolbarMessages-zh-hant.js&action=raw&ctype=text/javascript&smaxage=21600&maxage=86400');
} else {
	mw.loader.load('/index.php?title=MediaWiki:Gadget-RefToolbarMessages-en.js&action=raw&ctype=text/javascript&smaxage=21600&maxage=86400');
}
