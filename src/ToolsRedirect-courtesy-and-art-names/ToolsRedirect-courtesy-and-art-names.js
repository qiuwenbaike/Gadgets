/**
 * SPDX-License-Identifier: CC-BY-SA-3.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-ToolsRedirect-courtesy-and-art-names.js
 * @source https://zh.wikipedia.org/wiki/MediaWiki:Gadget-ToolsRedirect-courtesy-and-art-names.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0>
 */
'use strict';

/* <nowiki> */
mw.loader.using([ 'ext.gadget.ToolsRedirect' ], function () {
	var compSurnameReg,
		prefixReg = /[字号號]\s*$/,
		fdc = mw.toolsRedirect.findRedirectCallback,
		compSurnames = [ '欧阳', '歐陽', '令狐', '皇甫', '上官', '司徒', '诸葛', '諸葛', '司马', '司馬', '宇文', '呼延', '端木', '申屠', '尉迟', '尉遲', '轩辕', '軒轅', '夏侯', '南宫', '南宮', '司空', '鲜于', '鮮于', '西门', '西門', '独孤', '獨孤', '东方', '東方', '司寇', '羊舌', '第五', '梁丘', '锺离', '鍾離', '东郭', '東郭', '公孙', '公孫', '孟孙', '孟孫', '仲孙', '仲孫', '叔孙', '叔孫', '季孙', '季孫', '长孙', '長孫', '慕容', '闾丘', '閭丘', '东门', '東門', '公羊', '万俟', '百里', '公冶', '呼延', '浮屠', '即墨', '单于', '單于', '田丘' ];
	compSurnameReg = new RegExp('^(' + compSurnames.join('|') + ').');
	function findSurname(pagename) {
		if (compSurnameReg.test(pagename)) {
			return compSurnameReg.exec(pagename)[1];
		}
		return pagename[0];
	}

	// eslint-disable-next-line no-unused-vars
	fdc(function (pagename, $content, titles) {
		var surname,
			retTitles = [];
		$content.find('> p > b').each(function () {
			var prevNode = this.previousSibling;
			if (prevNode && prefixReg.test(prevNode.textContent)) {
				// trim() is not supported by IE<9
				var name = jQuery(this).text().replace(/^\s+|\s+$/g, '');
				if (!surname) {
					surname = findSurname(pagename);
				}
				retTitles.push(surname + name);
			}
		});
		return jQuery.uniqueSort(retTitles);
	});
});

/* </nowiki> */
