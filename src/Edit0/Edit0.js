/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-Edit0.js
 * @source https://zh.wikipedia.org/wiki/MediaWiki:Gadget-edit0.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */

'use strict';

if ([ 'view', 'purge' ].indexOf(mw.config.get('wgAction')) !== -1 && mw.config.get('wgNamespaceNumber') >= 0) {
	$(function edittopHook() {
		var localtitles = {
			en: 'Edit lead section'
		};
		localtitles.zh = localtitles['zh-hans'] = localtitles['zh-cn'] = localtitles['zh-sg'] = localtitles['zh-my'] = '编辑首段';
		localtitles['zh-hant'] = localtitles['zh-hk'] = localtitles['zh-mo'] = localtitles['zh-tw'] = '編輯首段';

		var $ourContent = $('#content, #mw_content').first();
		var $span1 = $ourContent.find('span.mw-editsection:not(.plainlinks)').first();
		if (!$span1.length) {
			return;
		}
		var $span0 = $span1.clone();

		$('#mw_header h1, #content h1').first().append($span0);
		$span0.find('a').each(function () {
			var a = $(this);
			var href = a.attr('href') || '';
			a.attr('title', localtitles[mw.config.get('wgUserLanguage')] || localtitles.zh);
			if (!/&(ve|)section=T/.test(href)) {
				// not transcluded
				a.attr('href', href.replace(/&(ve|)section=\d+/, '&$1section=0&summary=/*%20top%20*/%20'));
			} else if (/&vesection=/.test(href)) {
				// transcluded, VE
				a.attr('href', mw.util.getUrl(mw.config.get('wgPageName')) + '?veaction=edit&vesection=0&summary=/*%20top%20*/%20');
			} else {
				// transcluded, not VE
				a.attr('href', mw.util.getUrl(mw.config.get('wgPageName')) + '?action=edit&section=0&summary=/*%20top%20*/%20');
			}
		});
	});
}
