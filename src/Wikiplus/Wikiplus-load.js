/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-Wikiplus.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
if (mw.config.get('wgAction') === 'view' && mw.config.get('wgIsArticle')) {
	mw.loader.load('/wiki/MediaWiki:Gadget-Wikiplus.js?action=raw&ctype=text/javascript');
	if (!('ontouchstart' in document)) {
		mw.loader.addStyleTag('.Wikiplus-Symbol-Btn{vertical-align:bottom!important}.mw-ui-icon-portletlink-wphl-settings:before{background-image:url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cg%20fill%3D%22%2354595d%22%3E%3Cg%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20transform%3D%22translate(10%2010)%22%3E%3Cpath%20id%3D%22a%22%20d%3D%22M1.5-10h-3l-1%206.5h5m0%207h-5l1%206.5h3%22%2F%3E%3Cuse%20transform%3D%22rotate(45)%22%20xlink%3Ahref%3D%22%23a%22%2F%3E%3Cuse%20transform%3D%22rotate(90)%22%20xlink%3Ahref%3D%22%23a%22%2F%3E%3Cuse%20transform%3D%22rotate(135)%22%20xlink%3Ahref%3D%22%23a%22%2F%3E%3C%2Fg%3E%3Cpath%20d%3D%22M10%202.5a7.5%207.5%200%20000%2015%207.5%207.5%200%20000-15v4a3.5%203.5%200%20010%207%203.5%203.5%200%20010-7%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E")}');
		mw.loader.load('/wiki/MediaWiki:Wikiplus-highlight.js?action=raw&ctype=text/javascript');
	}
}
