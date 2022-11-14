/**
 * SPDX-License-Identifier: MIT
 * _addText: '{{Gadget Header|license=MIT}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-PreviewWithVariant.js
 * @source https://zh.wikipedia.org/wiki/Special:Permalink/67345361
 * @license MIT
 * @dependency ext.gadget.SiteCommonJs, mediawiki.Uri, mediawiki.user, oojs-ui, oojs-ui-core
 */
/**
 * @file Add a "Preview with variant" option to the edit form.
 * @author Diskdance
 * @author Lt2818
 * @license MIT
 */
// <nowiki>
'use strict';

(function ($, mw) {
var initialized = false;

mw.hook('wikipage.editform').add(function () {
	if (initialized) {
		return;
	}
	var $editForm = $('#editform');
	var $templateSandboxPreview = $editForm.find('input[name="wpTemplateSandboxPreview"]');
	// It is possible that a user want to preview a page with a non-wikitext module
	// Do not return in this case
	if (mw.config.get('wgPageContentModel') !== 'wikitext' && !$templateSandboxPreview.length) {
		return;
	}

	var $layout = $editForm.find('.editCheckboxes .oo-ui-horizontalLayout');
	if (!$layout.length) {
		return;
	}
	initialized = true;

	var VARIANTS = [ { data: 'zh', label: wgULS('不转换', '不轉換') }, { data: 'zh-hans', label: '简体' }, { data: 'zh-hant', label: '繁體' }, { data: 'zh-cn', label: '大陆简体' }, { data: 'zh-hk', label: '香港繁體' }, { data: 'zh-mo', label: '澳門繁體' }, { data: 'zh-my', label: '大马简体' }, { data: 'zh-sg', label: '新加坡简体' }, { data: 'zh-tw', label: '臺灣繁體' } ];
	var uriVariant = new mw.Uri().query.variant;
	var checkbox = new OO.ui.CheckboxInputWidget({
		selected: uriVariant
	});
	var dropdown = new OO.ui.DropdownWidget({
		$overlay: true,
		disabled: !checkbox.isSelected(),
		menu: {
			items: VARIANTS.map(function (item) {
				return new OO.ui.MenuOptionWidget({ data: item.data, label: item.label });
			})
		}
	});
	dropdown.getMenu().selectItemByData(mw.config.get('wgUserVariant') || uriVariant || mw.user.options.get('variant'));
	checkbox.on('change', function (selected) {
		dropdown.setDisabled(!selected);
	});

	function getSelectedVariant() {
		if (!checkbox.isSelected()) {
			return null;
		}
		var selectedItem = dropdown.getMenu().findSelectedItem();
		return selectedItem ? selectedItem.getData() : null;
	}

	function manipulateActionUrl() {
		var selectedVariant = getSelectedVariant(),
			originalAction = $editForm.attr('action');
		if (selectedVariant && originalAction) {
			$editForm.attr('action', new mw.Uri(originalAction).extend({ variant: selectedVariant }).getRelativePath());
		}
	}

	function manipulateVariantConfig() {
		// 不知道为什么，页内预览根本就不理睬wgUserVariant。
		// 参考API请求，猜测直接改成wgUserLanguage可以修复此问题。
		mw.config.set('wgUserLanguage', getSelectedVariant() || mw.user.options.get('variant'));
	}

	$editForm.find('#wpPreview').on('click', !mw.user.options.get('uselivepreview') ? manipulateActionUrl : manipulateVariantConfig);
	$templateSandboxPreview.on('click', manipulateActionUrl);

	var checkboxField = new OO.ui.FieldLayout(checkbox, {
		align: 'inline',
		label: wgULS('预览字词转换', '預覽字詞轉換')
	});
	var dropdownField = new OO.ui.FieldLayout(dropdown, {
		align: 'top',
		label: wgULS('使用该语言变体显示预览：', '使用該語言變體顯示預覽：'),
		invisibleLabel: true
	});
	$layout.append(checkboxField.$element, dropdownField.$element);
});

// Register 2017 wikitext editor version to VE
mw.loader.using('ext.visualEditor.desktopArticleTarget.init').then(function () {
	mw.libs.ve.addPlugin('ext.gadget.PreviewWithVariant2017');
});
}(jQuery, mediaWiki));
// </nowiki>
