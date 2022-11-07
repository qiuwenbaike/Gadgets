/**
 * SPDX-License-Identifier: CC-BY-SA-4.0 
 * _addText: '{{CC-BY-SA-4.0}}'
 */
/**
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-NoteTAvector.js
 * @source: https://zh.wikipedia.org/wiki/MediaWiki:Gadget-noteTAvector.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
mw.hook('wikipage.content').add(function () {
	// Will blink duing load preview,
	// but this will avoid the icon won't removed
	// if the TA template is removed, and
	// avoid repeated click event listener from noteTAViewer.
	$('#p-variants').next().remove();
	setTimeout(function () {
		$(function () {
			$('body.skin-vector .mw-indicator[id^=mw-indicator-noteTA-]')
				.addClass('vector-menu')
				.addClass('vector-menu-tabs')
				.addClass('vectorTabs')
				.removeAttr('style')
				.css('float', 'left')
				.empty()
				.each(function () {
					$('<a href="#"><span style="padding:1px 3px; background: #d3e3f4; color:#000; height:85%;">汉</span><span style="padding:1px 3px; background: #e9e9e9; color:#434343; height:85%;">漢</span></a>')
						.on('click', function (e) {
							e.preventDefault();
						})
						.wrap('<ul><li><span></span></li></ul>')
						.parent().parent().parent().appendTo(this);
				})
				.insertAfter('#p-variants');
		});
	}, 1);
});
