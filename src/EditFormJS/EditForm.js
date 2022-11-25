/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-Editform.js
 * @source zh.wikipedia.org/wiki/MediaWiki:Common.js/edit.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 * @dependency ext.gadget.SiteCommonJs
 */
'use strict';

/* <nowiki> */
/**
 * 管理员注意：
 *
 * 本页面脚本在使用传统编辑器、可视化编辑器、2017维基文本编辑器时均会加载，且只加载一次。
 *
 * 但可视化编辑器与2017维基文本编辑器有两个问题：
 * 1. 此脚本运行时，编辑器可能尚未加载完成。
 * 2. 互相切换时，或者放弃编辑之后再次点击编辑时，浏览器页面不会刷新，本页面脚本不会再次加载。
 * 因此，如果代码与VE/2017维基文本编辑器相关，需要在进入编辑器时运行，请集中放在后面的
 * mw.hook('ve.activationComplete').add(function () {
 * ……
 * });
 * 中。如有疑问，请到测试站进行测试。
 */

/*
== 編輯工具欄 ==
*/

/**
 * tip for custom edittools
 *
 * Maintainers: fdcn@zh.wikipedia
 */
if (mw.config.get('wgAction') === 'edit' && $('span.oo-ui-fieldLayout-header')) {
	$('span.oo-ui-fieldLayout-header').css('max-width', 'none'); // 一行显示编辑摘要
}

$(function () {
	var veCount = 0;

	// 在提交新段落時，讓主題欄在特定情況下失效
	if ($('#no-new-title').length) {
		if ($('#editform input[name=wpSection]').val() === 'new') {
			// 傳統文本編輯器
			$('#wpSummary').attr('disabled', true);
			$('#wpSummary').val('');
		}
	}

	// 視覺化編輯器 / 新 wikitext 模式
	var noSectionTitlePages = [ 'Qiuwen:过滤器处理/报告', 'Qiuwen:字词转换处理/地区词候选' ];
	if (noSectionTitlePages.indexOf(mw.config.get('wgPageName')) !== -1 && mw.util.getParamValue('section') === 'new') {
		mw.util.addCSS('h2.ve-ui-init-desktopArticleTarget-sectionTitle { display: none; }');
	}

	// 快速选择常见编辑摘要
	// 摘要内容请到[[MediaWiki:Summary]]及相关中文变体页面维护。
	var insertSummary = function insertSummary($this, $summary) {
		var summary = $summary.val();
		var $item = $this.parent('.mw-summary-preset-item');
		summary = summary.replace(/\s+$/g, '');
		if (summary !== '') {
			summary += ' ';
		}
		summary += $item.attr('title') || $this.text();
		$this.replaceWith($this.contents());
		$summary.val(summary).trigger('change');
	};

	// 传统编辑器
	$('#wpSummaryLabel .mw-summary-preset').on('click', '.mw-summary-preset-item a', function (e) {
		e.preventDefault();
		insertSummary($(this), $('#wpSummary'));
	});

	// VE / 新Wikitext
	var isInitSummary = false;
	mw.hook('ve.saveDialog.stateChanged').add(function () {
		// 编辑摘要链接在第一次点击“发布更改”按钮之后才会加载，因此需要额外判断
		if (!isInitSummary) {
			$('div.ve-ui-mwSaveDialog-summaryLabel span.mw-summary-preset-item > a').removeAttr('target').on('click', function (e) {
				e.preventDefault();
				insertSummary($(this), $('div.ve-ui-mwSaveDialog-summary > textarea'));
			});
			isInitSummary = true;
		}
	});

	// 每次进入可视化/2017维基文本编辑器都要运行的代码请集中放在此处，
	// 由于无法保证加载顺序，请避免另外实现mw.hook('ve.activationComplete').add(...)。
	mw.hook('ve.activationComplete').add(function () {
		// 由于无法保证用户是第一次进入编辑器，需记录进入次数。
		veCount = veCount + 1;

		// 编辑摘要链接初始化
		isInitSummary = false;
	});
});

/**
 * -------------------------------------------------------------------------------
 *  Force Preview JavaScript code - Start
 *
 *  For MediaWiki >= 1.23
 *
 *  To allow any group to bypass being forced to preview,
 *  enter the group name in the permittedGroups array.
 *  E.g.
 * var permittedGroups = []; // force everyone
 * var permittedGroups = [ 'user' ]; // permit logged-in users
 * var permittedGroups = [ 'sysop', 'bureaucrat' ]; // permit sysop, bureaucrat
 * -------------------------------------------------------------------------------
 */

(function () {
var permittedGroups = [ 'confirmed', 'autoconfirmed' ];
if (mw.config.get('wgAction') !== 'edit' || permittedGroups.some(function (val) {
	return mw.config.get('wgUserGroups').indexOf(val) > -1;
})) {
	return;
}
mw.loader.using('oojs-ui-core', function () {
	var originalLabel;
	mw.hook('wikipage.editform').add(function ($editForm) {
		var saveButton;
		try {
			saveButton = OO.ui.infuse($editForm.find('#wpSaveWidget'));
		} catch (e) {
			return;
		}
		if (!$('#wikiPreview, #wikiDiff').is(':visible')) {
			if (saveButton.isDisabled()) {
				return;
			}
			if (originalLabel === undefined) {
				originalLabel = saveButton.getLabel();
			}
			saveButton.setDisabled(true).setLabel(originalLabel + wgULS('（请先预览）', '（請先預覽）'));
		} else if (originalLabel !== undefined) {
			saveButton.setLabel(originalLabel).setDisabled(false);
		}
	});
});
}());

/**
 * -----------------------------------------------------
 *   Force Preview JavaScript code - End
 * -----------------------------------------------------
 */

/*

== 取消修訂編輯摘要修正 ==
*/
/**
 * fix edit summary prompt for undo
 * this code fixes the fact that the undo function combined with the "no edit summary prompter" causes problems if leaving the edit summary unchanged
 * this was added by Deskana, code by Tra
 */
$(function () {
	var autoSummary = document.getElementsByName('wpAutoSummary')[0];
	if (document.location.search.indexOf('undo=') !== -1 && autoSummary) {
		autoSummary.value = '';
	}
});

/* </nowiki> */
