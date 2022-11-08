/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{CC-BY-SA-4.0}}'
 * _addText: '{{Gadget Header}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-Report.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 * @dependency ext.gadget.SiteCommonJs
 */
'use strict';

/* 报告不良信息 */

(function ($, mw) {
var url = mw.config.get('wgServer') + '/wiki/Special:联系/Report?report_title=' + mw.util.rawurlencode(mw.config.get('wgPageName')) + '&report_revision=' + mw.util.rawurlencode(mw.config.get('wgRevisionId')),
	getURLParameter = function getURLParameter(name) {
		/* From <https://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript>, CC BY-SA 3.0 */
		return decodeURIComponent((new RegExp('[?|&]' + name + '=([^&;]+?)(&|#|;|$)').exec(location.search) || [ null, '' ])[1].replace(/\+/g, '%20')) || null;
	},
	reportDesc = wgULS('报告不良信息', '報告不良資訊'),
	reportTitle = '';

if (getURLParameter('report_title')) {
	reportTitle = getURLParameter('report_title');
}

if (getURLParameter('report_revision')) {
	reportTitle += '（版本' + getURLParameter('report_revision') + '）';
}

if (mw.config.get('wgNamespaceNumber') !== -1) {
	mw.util.addPortletLink($('#p-pagemisc').length !== 0 ? 'p-pagemisc' : 'p-tb', url, reportDesc, 't-report', reportDesc);
}

if (mw.config.get('wgPageName') === 'Special:联系/Report' && reportTitle !== '') {
	$('#ooui-php-4').val(reportDesc + '：' + reportTitle);
	$('#ooui-php-18').val(reportTitle);
}
}(jQuery, mediaWiki));
