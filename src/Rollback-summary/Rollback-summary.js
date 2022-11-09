/**
 * SPDX-License-Identifier: CC-BY-SA-3.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-3.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-Rollback-summary.js
 * @source https://zh.wikipedia.org/w/index.php?title=MediaWiki:Gadget-rollback-summary.js
 * @license <https://creativecommons.org/licenses/by-sa/3.0/>
 * @dependency ext.gadget.SiteCommonJs, mediawiki.util, oojs-ui, oojs-ui.styles.icons-interactions
 */
'use strict';

(function ($, mw) {
mw.loader.using([ 'ext.gadget.SiteCommonJs', 'mediawiki.util' ]).then(function () {
	mw.messages.set({
		'rollback-summary-custom': '回退[[Special:Contributions/$1|$1]]（[[User talk:$1|' + wgULS('对话', '對話') + ']]）' + wgULS('的编辑：', '的編輯：'),
		'rollback-summary-nouser': wgULS('回退已隐藏用户的编辑：', '回退已隱藏使用者的編輯：')
	});
	var updateLinks = function () {
		$('.mw-rollback-link a').off('click');
		$('.mw-rollback-link a').on('click', function (e) {
			e.preventDefault();
			var href = this.href;
			mw.loader.using([ 'oojs-ui', 'oojs-ui.styles.icons-interactions' ]).then(function () {
				OO.ui.prompt($('<b>' + wgULS('请输入回退摘要', '請輸入回退摘要') + '</b>'), {
					textInput: {
						icon: 'editUndo',
						placeholder: wgULS('留空使用系统默认摘要', '留空使用系統預設摘要')
					}
				}).then(function (summary) {
					if (summary === '') {
						location.assign(href);
					} else if (summary !== null) {
						var username = mw.util.getParamValue('from', href);
						if (username) {
							summary = mw.message('rollback-summary-custom', username).plain() + summary;
						} else {
							summary = mw.message('rollback-summary-nouser').plain() + summary;
						}
						href += '&summary=' + encodeURIComponent(summary);
						location.assign(href);
					}
				});
			});
		}).css('color', '#009999');
	};
	mw.hook('wikipage.content').add(function () {
		updateLinks();
	});
});
}(jQuery, mw));
