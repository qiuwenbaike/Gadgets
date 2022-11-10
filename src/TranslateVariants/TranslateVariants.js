/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-TranslateVariants.js
 * @source https://zh.wikipedia.org/wiki/User:Xiplus/js/TranslateVariants
 * @license <https://creativecommons.org/licenses/by-sa/4.0>
 */
/* globals TranslateVariants:true */

/* eslint-disable no-jquery/no-parse-html-literal */

// <nowiki>
(function () {
if (mw.config.get('wgPageName').match(/^MediaWiki:[^/]+(\/zh)?$/)) {
	mw.loader.using([ 'mediawiki.api', 'mediawiki.diff.styles' ]).then(function () {
		var link = mw.util.addPortletLink('p-cactions', '#', wgULS('转换变体', '轉換變體'));
		$(link).on('click', function () {
			this.remove();
			main();
		});
	});
} else {
	return;
}
if (typeof TranslateVariants === 'undefined') {
	TranslateVariants = {};
}
if (typeof TranslateVariants.summary !== 'string') {
	TranslateVariants.summary = '自动转换变体自[[$1]] via [[MediaWiki:Gadget-TranslateVariants.js|TranslateVariants]]';
}
function main() {
	var langs = [ 'zh', 'zh-hans', 'zh-cn', 'zh-my', 'zh-sg', 'zh-hant', 'zh-hk', 'zh-mo', 'zh-tw' ];
	var langname = {
		'zh': '原始',
		'zh-hans': '简体',
		'zh-cn': '中国大陆简体',
		'zh-my': '马来西亚简体',
		'zh-sg': '新加坡简体',
		'zh-hant': '繁體',
		'zh-hk': '中國香港繁體',
		'zh-mo': '中國澳門繁體',
		'zh-tw': '中國臺灣繁體'
	};
	var result = {};
	var api = new mw.Api();
	var basepagetext = '';
	var table = $('<div id="TranslateVariants">').prependTo('#bodyContent');
	$('<div style="color:red">提醒：TranslateVariants工具使用IT及MediaWiki兩個轉換組進行自動轉換，請確認轉換結果是否正確！</div>').appendTo(table);
	var defaultlangs = 'zh,zh-hans,zh-cn,zh-my,zh-sg,zh-hant,zh-hk,zh-mo,zh-tw';
	// eslint-disable-next-line no-alert
	var runlangs = prompt(wgULS('转换以下语言（以逗号隔开）：', '轉換以下語言（以逗號隔開）：'), defaultlangs);
	if (runlangs === null) {
		runlangs = defaultlangs;
	}
	var langqueue = runlangs.split(',').map(function (lang) {
		return lang.trim();
	}).filter(function (lang) {
		return langs.indexOf(lang) !== -1;
	});
	api.get({
		action: 'query',
		prop: 'revisions',
		rvprop: [ 'content', 'timestamp' ],
		titles: [ mw.config.get('wgPageName') ],
		formatversion: '2',
		curtimestamp: true
	}).then(function (data) {
		var page, revision;
		if (!data.query || !data.query.pages) {
			return $.Deferred().reject('unknown');
		}
		page = data.query.pages[0];
		if (!page || page.invalid) {
			return $.Deferred().reject('invalidtitle');
		}
		if (page.missing) {
			return $.Deferred().reject('nocreate-missing');
		}
		revision = page.revisions[0];
		return {
			content: revision.content
		};
	}).then(function (data) {
		var text = data.content;
		result.zh = text;
		text = text.replace(/[[\]{}<>|:*'_#&\s]/gim, function (s) {
			return '&#' + s.charCodeAt(0) + ';';
		});
		text = text.replace(/(&#91;&#91;)((?:(?!&#124;)(?!&#93;).)+?)(&#124;(?:(?!&#93;).)+?&#93;&#93;)/g, '$1-{$2}-$3');
		text = text.replace(/-&#123;(.+?)&#125;-/g, function (s) {
			return s.replace('-&#123;', '-{').replace('&#125;-', '}-').replace(/&#124;/g, '|').replace(/&#32;/g, ' ').replace(/&#61;/g, '=').replace(/&#62;/g, '>').replace(/&#58;/g, ':');
		});
		basepagetext = text;
		process();
	});
	function process() {
		if (langqueue.length === 0) {
			return;
		}
		var lang = langqueue.shift();
		var diffTable = $('<div id="TranslateVariants-diff-' + lang + '">').appendTo(table);
		$('<hr>').appendTo(table);
		var basename = mw.config.get('wgPageName').replace(/\/zh$/, '');
		var targetTitle;
		if (lang === 'zh') {
			targetTitle = String(basename);
		} else {
			targetTitle = basename + '/' + lang;
		}
		var newtext;
		api.parse('{{NoteTA|G1=IT|G2=MediaWiki}}<div id="TVcontent">' + basepagetext + '</div>', {
			uselang: lang,
			prop: 'text'
		}).then(function (data) {
			newtext = $('<div>').html(data).find('#TVcontent').text();
			return api.post({
				action: 'query',
				prop: 'revisions',
				titles: [ targetTitle ],
				rvdifftotext: newtext,
				formatversion: '2'
			});
		}, function (err) {
			mw.notify('解析' + lang + wgULS('时发生错误：', '時發生錯誤：') + err);
		}).then(function (data) {
			var tool = $('<div><a href="' + mw.util.getUrl(targetTitle) + '">' + lang + '（' + langname[lang] + '）</a>（<a href="' + mw.util.getUrl(targetTitle, {
				action: 'edit'
			}) + '">' + wgULS('编', '編') + '</a>）</div>').appendTo(diffTable);
			var page = data.query.pages[0];
			if (page.missing) {
				var submit = $('<button style="float: right;">' + wgULS('发布页面', '發佈頁面') + '</button>').appendTo(tool);
				submit.on('click', function () {
					this.remove();
					api.create(targetTitle, {
						summary: TranslateVariants.summary.replace(/\$1/g, mw.config.get('wgPageName'))
					}, newtext).then(function () {
						mw.notify(wgULS('已编辑 ', '已編輯 ') + targetTitle);
					}, function (e) {
						mw.notify(wgULS('编辑', '編輯 ') + targetTitle + wgULS(' 发生错误：', ' 發生錯誤：') + e);
					});
				});
				$('<pre>').html(newtext.replace(/[<>&]/gim, function (s) {
					return '&#' + s.charCodeAt(0) + ';';
				})).appendTo(diffTable);
				return;
			}
			var diff = page.revisions[0].diff.body;
			if (diff === '') {
				$('<span style="float: right;">' + wgULS('无变更', '無變更') + '</span>').appendTo(tool);
			} else {
				var _submit = $('<button style="float: right;">' + wgULS('发布变更', '發佈變更') + '</button>').appendTo(tool);
				_submit.on('click', function () {
					this.remove();
					api.edit(targetTitle, function () {
						return {
							text: newtext,
							summary: TranslateVariants.summary.replace(/\$1/g, mw.config.get('wgPageName')),
							nocreate: false
						};
					}).then(function () {
						mw.notify(wgULS('已编辑', '已編輯 ') + targetTitle);
					}, function (e) {
						mw.notify(wgULS('编辑', '編輯 ') + targetTitle + wgULS(' 发生错误：', ' 發生錯誤：') + e);
					});
				});
				$('<table class="diff">').html(diff).prepend('<colgroup><col class="diff-marker"><col class="diff-content"><col class="diff-marker"><col class="diff-content"></colgroup>').appendTo(diffTable);
			}
		}, function (err) {
			mw.notify(wgULS('获取', '取得') + lang + wgULS('差异时发生错误：', '差異時發生錯誤：') + err);
		}).always(function () {
			process();
		});
	}
}
}());
// </nowiki>
