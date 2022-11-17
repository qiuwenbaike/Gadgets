/**
 * SPDX-License-Identifier: CC-BY-SA-3.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-ToolsRedirect-bio-latin-names.js
 * @source https://zh.wikipedia.org/wiki/Special:Permalink/61193369
 * * @license <https://creativecommons.org/licenses/by-sa/4.0>
 */

'use strict';

// <nowiki>
mw.loader.using([ 'ext.gadget.ToolsRedirect' ], function () {
	'use strict';

	var prefixReg = /[學学]名\s*：?\s*$/,
		colonReg = /^\s*[:：]?\s*$/,
		tr = mw.toolsRedirect;
	tr.findRedirectCallback(function (pagename, $content) {
		var retTitles = [];
		$content.find('> p > [lang="la"], > p > i').each(function () {
			var title,
				prevNode = this.previousSibling;
			if (prevNode && colonReg.test(prevNode.textContent)) {
				prevNode = prevNode.previousSibling;
			}
			if (prevNode && prefixReg.test(prevNode.textContent)) {
				// trim() is not supported by IE<9
				title = jQuery(this).text().replace(/^\s+|\s+$/g, '');
				retTitles.push(title);
				tr.setRedirectTextSuffix(title, '\n{{学名重定向}}');
			}
		});
		return jQuery.uniqueSort(retTitles);
	});
});

// </nowiki>
