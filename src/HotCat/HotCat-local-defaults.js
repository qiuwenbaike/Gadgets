/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-HotCat-local-defaults.js
 * @source https://zh.wikipedia.org/wiki/MediaWiki:Gadget-HotCat.js/local_defaults
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 * @dependency ext.gadget.HotCat
 */
/* global HotCat */
/* eslint-disable camelcase */
'use strict';

// <nowiki>
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
	HotCat.disambig_category = null;
	HotCat.redir_category = '已重定向的分类';
}

// </nowiki>
