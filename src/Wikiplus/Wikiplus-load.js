/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-Wikiplus.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
'use strict';

if (mw.config.get('wgAction') === 'view' && mw.config.get('wgIsArticle')) {
	mw.loader.load('/index.php?title=MediaWiki:Gadget-Wikiplus.js&action=raw&ctype=text/javascript&smaxage=600&maxage=600');
	if (!('ontouchstart' in document)) {
		mw.loader.addStyleTag('.Wikiplus-Symbol-Btn{vertical-align:bottom!important}.mw-ui-icon-portletlink-wphl-settings:before{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCI+PGcgZmlsbD0iIzU0NTk1ZCI+PGcgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEwIDEwKSI+PHBhdGggaWQ9ImEiIGQ9Ik0xLjUtMTBoLTNsLTEgNi41aDVtMCA3aC01bDEgNi41aDMiLz48dXNlIHRyYW5zZm9ybT0icm90YXRlKDQ1KSIgeGxpbms6aHJlZj0iI2EiLz48dXNlIHRyYW5zZm9ybT0icm90YXRlKDkwKSIgeGxpbms6aHJlZj0iI2EiLz48dXNlIHRyYW5zZm9ybT0icm90YXRlKDEzNSkiIHhsaW5rOmhyZWY9IiNhIi8+PC9nPjxwYXRoIGQ9Ik0xMCAyLjVhNy41IDcuNSAwIDAwMCAxNSA3LjUgNy41IDAgMDAwLTE1djRhMy41IDMuNSAwIDAxMCA3IDMuNSAzLjUgMCAwMTAtNyIvPjwvZz48L3N2Zz4=)}');
		mw.loader.load('/index.php?title=MediaWiki:Gadget-Wikiplus-highlight.js&action=raw&ctype=text/javascript&smaxage=600&maxage=600');
	}
}
