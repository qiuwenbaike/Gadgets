/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-DisamAssist.js
 * @source zh.wikipedia.org/wiki/User:Peacearth/DisamAssist.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0>
 */
/**
 * DisamAssist
 * 由Qwertyytrewqqwerty最初设计：CC BY-SA 3.0
 * 由GZWDer本地化：2020-08-19 CC BY-SA 3.0
 * 由和平奋斗救地球稍作翻译 2021-05-15 CC BY-SA 3.0
 * 求闻百科Njzjz简体化 2022-2-14 CC BY-SA 4.0
 */
'use strict';

// <nowiki>
window.DisamAssist = jQuery.extend(true, {
	cfg: {
		/* Categories where disambiguation pages are added (usually by a template like {{Disambiguation}} */
		disamCategories: [ '全部消歧義頁面' ],
		/* "Canonical names" of the templates that may appear after ambiguous links and which should be removed when fixing those links */
		disamLinkTemplates: [ 'Disambiguation needed', 'Ambiguous link', 'Amblink', 'Dab needed', 'Disamb-link', 'Disambig needed', 'Disambiguate', 'Dn', 'Needdab' ],
		/* "Canonical names" of the templates that designate intentional links to disambiguation pages */
		disamLinkIgnoreTemplates: [ 'R from ambiguous page', 'R to disambiguation page', 'R from incomplete disambiguation' ],
		/* Format string for "Foo (disambiguation)"-style pages */
		disamFormat: '$1 (消歧义)',
		/* Regular expression matching the titles of disambiguation pages (when they are different from the titles of the primary topics) */
		disamRegExp: '^(.*) \\((消歧义|消歧義)\\)$',
		/* Text that will be inserted after the link if the user requests help. If the value is null, the option to request help won't be offered */
		disamNeededText: '{{dn|date=February 2022}}',
		/* Content of the "Foo (disambiguation)" pages that will be created automatically when using DisamAssist from a "Foo" page */
		redirectToDisam: '#REDIRECT [[$1]] {{R to disambiguation page}}',
		/* Whether intentional links to disambiguation pages can be explicitly marked by adding " (disambiguation)" */
		intentionalLinkOption: false,
		/* Namespaces that will be searched for incoming links to the disambiguation page (pages in other namespaces will be ignored) */
		targetNamespaces: [ 6, 10, 14, 100, 108, 0 ],
		/* Number of backlinks that will be downloaded at once When using blredirect, the maximum limit is supposedly halved (see http://www.mediawiki.org/wiki/API:Backlinks) */
		backlinkLimit: 250,
		/* Number of titles we can query for at once */
		queryTitleLimit: 50,
		/* Number of characters before and after the incoming link that will be displayed */
		radius: 300,
		/* Height of the context box, in lines */
		numContextLines: 4,
		/* Number of pages that will be stored before saving, so that changes to them can be undone if need be */
		historySize: 2,
		/* Minimum time in seconds since the last change was saved before a new edit can be made. A negative value or 0 disables the cooldown. Users with the "bot" right won't be affected by the cooldown */
		editCooldown: 0,
		/* Specify how the watchlist is affected by DisamAssist edits. Possible values: "watch", "unwatch", "preferences", "nochange" */
		watch: 'nochange'
	},
	txt: {
		start: '为链接消歧义',
		startMain: '为链至主条目的链接消歧义',
		startSame: '为链至消歧义页的链接消歧义',
		close: '关闭',
		undo: '复原',
		omit: '跳过',
		refresh: '重新整理',
		titleAsText: '其它目标',
		disamNeeded: '标示{{dn}}',
		intentionalLink: '有意链到消歧义页的链接',
		titleAsTextPrompt: '请输入新的链接目标：',
		removeLink: '去除链接',
		optionMarker: ' [链接到这里]',
		targetOptionMarker: ' [当前目标]',
		redirectOptionMarker: ' [当前目标（重定向）]',
		pageTitleLine: '<a href="$1">$2</a>：',
		noMoreLinks: '没有需要消歧义的链接了。',
		pendingEditCounter: '已保存$1个，已编辑$2个',
		pendingEditBox: 'DisamAssist正在储存您的编辑（$1）。',
		pendingEditBoxTimeEstimation: '$1；剩余时间：$2',
		pendingEditBoxLimited: '在所有更改保存前，请不要关闭页面；你可以在另一个页面编辑求闻百科，但是请勿同时使用多个DisamAssist。',
		error: '错误：$1',
		fetchRedirectsError: '获取重定向失败："$1".',
		getBacklinksError: '下载反向链接失败："$1".',
		fetchRightsError: '获取用户权限失败："$1",',
		loadPageError: '加载$1失败："$2".',
		savePageError: '保存至$1失败："$2".',
		dismissError: 'Dismiss',
		pending: 'DisamAssist尚有未储存的编辑。如欲储存之，请按“关闭”。',
		editInProgress: 'DisamAssist正在进行编辑。如果您将本分页关闭，可能会丧失您的编辑。',
		ellipsis: '……',
		notifyCharacter: '✔',
		summary: '使用[[MediaWiki:Gadget-DisamAssist.js|DisamAssist]]清理[[QW:DAB|消歧义]]链接：[[$1]]（$2）。',
		summaryChanged: '改链接至[[$1]]',
		summaryOmitted: '链接已跳过',
		summaryRemoved: '链接已移除',
		summaryIntentional: '刻意链接至消歧义页面',
		summaryHelpNeeded: '需要帮助',
		summarySeparator: '; ',
		redirectSummary: '使用[[MediaWiki:Gadget-DisamAssist.js|DisamAssist]]创建目标为[[$1]]的重定向。'
	}
}, window.DisamAssist || {});
mw.loader.load('/index.php?title=MediaWiki:Gadget-DisamAssist-core.js&action=raw&ctype=text/javascript&smaxage=600&maxage=600');
// </nowiki>
