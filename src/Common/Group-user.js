/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Group-user.js
 * @source https://zh.wikipedia.org/wiki/MediaWiki:Common.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
'use strict';

/* <nowiki> */
/* 这里的任何JavaScript将只为注册用户加载 */
(function ($, mw) {
/**
 * Magic editintros
 * Description: Adds editintros on disambiguation pages, BLP pages, policy pages and guidlines.
 */
$(function () {
	function addEditIntro(name) {
		$('.mw-editsection, #ca-edit, #ca-addsection').find('a').each(function (i, el) {
			el.href = $(this).attr('href') + '&editintro=' + name;
		});
	}
	var cats = mw.config.get('wgCategories');
	if (!cats) {
		return;
	}
	switch (mw.config.get('wgNamespaceNumber')) {
		case 0:
			if (cats.indexOf('全部消歧義頁面') !== -1) {
				addEditIntro('Template:Disambig_editintro');
			}
			if (cats.indexOf('在世人物') !== -1) {
				addEditIntro('Template:BLP_editintro');
			}
			break;
		case 4:
			if (cats.indexOf('求闻百科方针完整列表') !== -1) {
				addEditIntro('Template:Policy_editintro');
			}
			break;
		case 8:
			if (cats.indexOf('CC-BY-NC-SA-4.0') !== -1) {
				addEditIntro('Template:NonCommercial_editintro');
			}
			break;
		default:
	}
});
$(function () {
	// MassEditRegex page
	if (mw.config.get('wgCanonicalSpecialPageName') === 'MassEditRegex') {
		$('#wpSummaryLabel').html($('#wpSummaryLabel').text().replace(/\[\[#\.\|(.+?)\]\]/g, '$1'));
	}
	// Import page
	if (mw.config.get('wgCanonicalSpecialPageName') === 'Import') {
		$('#ooui-php-3').val('zhwiki');
		$('#ooui-php-5').val('导入自[[zhwiki:|此网站]]的同名页面［页面文字原许可：[[cc-by-sa:3.0|CC BY-SA 3.0]]］');
		$('#ooui-php-29').val('［页面文字原许可：[[cc-by-sa:3.0|CC BY-SA 3.0]]］');
	}
	// ImportFile page
	if (mw.config.get('wgCanonicalSpecialPageName') === 'FileImporter-SpecialPage') {
		$('[name=intendedRevisionSummary]').val('导入自[[commons:File:' + $('h2.mw-importfile-header-title').html() + '|此处]]［页面文字原许可：[[cc-by-sa:3.0|CC BY-SA 3.0]]；文件许可请参见页面描述］');
	}
	// Delete page
	if (!($('body.action-delete').length === 0)) {
		$('#wpReason').val('');
	}
});
}(jQuery, mediaWiki));
/* </nowiki> */
