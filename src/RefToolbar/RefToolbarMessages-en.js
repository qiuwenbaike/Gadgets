/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-RefToolbarMessages-en.js
 * @source https://zh.wikipedia.org/wiki/MediaWiki:RefToolbarMessages-en.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
'use strict';

switch (mw.config.get('wgUserLanguage')) {
	case 'zh-hant':
	case 'zh-hk':
	case 'zh-mo':
	case 'zh-tw':
		mw.loader.load('/index.php?title=MediaWiki:Gadget-RefToolbarMessages-zh-hant.js&action=raw&ctype=text/javascript&smaxage=21600&maxage=86400');
		break;
	default:
		mw.loader.load('/index.php?title=MediaWiki:Gadget-RefToolbarMessages-zh-hans.js&action=raw&ctype=text/javascript&smaxage=21600&maxage=86400');
}
