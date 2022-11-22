/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-HotCat-local-defaults.js
 * @source https://zh.wikipedia.org/wiki/MediaWiki:Gadget-HotCat.js/local_defaults
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 * @dependency ext.gadget.HotCat
 */
'use strict';

/* global HotCat */
/* eslint-disable camelcase */
/* <nowiki> */
if (typeof HotCat !== 'undefined') {
	HotCat.messages.cat_removed = '已移除[[Category:$1]]';
	HotCat.messages.template_removed = '已移除{{[[Category:$1]]}}';
	HotCat.messages.cat_added = '已添加[[Category:$1]]';
	HotCat.messages.cat_keychange = '已设置[[Category:$1]]的新排序字：';
	HotCat.messages.cat_notFound = '分类“$1”没有找到';
	HotCat.messages.cat_exists = '分类“$1”已经存在，没有添加。';
	HotCat.messages.cat_resolved = '（重定向[[Category:$1]]已处理）';
	HotCat.messages.uncat_removed = '已移除{{uncategorized}}';
	HotCat.messages.prefix = '使用[[QW:HOTCAT|HotCat]]';
	HotCat.messages.using = '';
	HotCat.messages.multi_change = '$1个分类';
	HotCat.messages.commit = '保存';
	HotCat.messages.ok = '确定';
	HotCat.messages.cancel = '取消';
	HotCat.messages.multi_error = '无法从服务器取得页面文字。因此，您的分类变更无法保存。我们为此不便表示抱歉。';
	HotCat.categories = '分类';
	HotCat.engine_names.searchindex = '搜索索引';
	HotCat.engine_names.pagelist = '页面列表';
	HotCat.engine_names.combined = '合并搜索';
	HotCat.engine_names.subcat = '子分类';
	HotCat.engine_names.parentcat = '上层分类';
	HotCat.tooltips.change = '修改';
	HotCat.tooltips.remove = '移除';
	HotCat.tooltips.add = '增加一个新分类';
	HotCat.tooltips.restore = '撤销变更';
	HotCat.tooltips.undo = '撤销变更';
	HotCat.tooltips.down = '打开以修改并显示子分类';
	HotCat.tooltips.up = '打开以修改并显示上层分类';
	HotCat.multi_tooltip = '修改多个分类';
	HotCat.disambig_category = null;
	HotCat.redir_category = '已重定向的分类';
}

/* </nowiki> */
