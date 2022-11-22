/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-HotCat-zh-hant.js
 * @source https://commons.wikimedia.org/wiki/MediaWiki:Gadget-HotCat.js/zh-hant
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 * @dependency ext.gadget.HotCat
 */
/* global HotCat */
/* eslint-disable camelcase */
/* <nowiki> */
// Localizations of a few HotCat user interface texts.
if (typeof HotCat !== 'undefined') {
	HotCat.messages.commit = '儲存';
	HotCat.messages.ok = '確定';
	HotCat.messages.cancel = '取消';
	HotCat.messages.multi_error = '無法從伺服器取得頁面文字。因此，您的分類變更無法儲存。我們為此不便表示抱歉。';
	HotCat.categories = '分類';
	HotCat.engine_names.searchindex = '搜尋索引';
	HotCat.engine_names.pagelist = '頁面清單';
	HotCat.engine_names.combined = '合併搜尋';
	HotCat.engine_names.subcat = '子分類';
	HotCat.engine_names.parentcat = '上層分類';
	HotCat.tooltips.change = '變更';
	HotCat.tooltips.remove = '移除';
	HotCat.tooltips.add = '新增一個新分類';
	HotCat.tooltips.restore = '撤銷變更';
	HotCat.tooltips.undo = '撤銷變更';
	HotCat.tooltips.down = '開啟以變更並顯示子分類';
	HotCat.tooltips.up = '開啟以變更並顯示上層分類';
	HotCat.multi_tooltip = '變更多個分類';
}
/* </nowiki> */
