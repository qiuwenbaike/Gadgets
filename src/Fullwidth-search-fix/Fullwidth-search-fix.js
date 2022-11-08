/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-Fullwidth-search-fix.js
 * @source zh.wikipedia.org/wiki/MediaWiki:Gadget-fullwidth-search-fix.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 * @dependency ext.gadget.SiteCommonJs, mediawiki.util
 */
(function ($, mw) {
// don't be too aggresive. just fix some obvious typos
var searchTerm = mw.util.getParamValue('search');
if (searchTerm !== null && mw.util.getParamValue('fulltext') === null) {
	// namespace names
	var colonIdx = searchTerm.indexOf('：');
	if (colonIdx !== -1) {
		var ns = searchTerm.slice(0, Math.max(0, colonIdx));
		var page = searchTerm.slice(Math.max(0, colonIdx + 1));
		if (mw.config.get('wgNamespaceIds')[ns.toLowerCase()]) {
			// valid namespace
			var url = mw.config.get('wgScript') + '?search=' + encodeURIComponent(ns + ':' + page);
			mw.notify(wgULS('重定向至', '重新導向至') + mw.html.escape(url));
			window.location.href = url;
		}
	}
}
}(jQuery, mediaWiki));
