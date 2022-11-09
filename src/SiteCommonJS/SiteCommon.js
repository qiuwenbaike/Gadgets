/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-SiteCommon.js
 * @source https://zh.wikipedia.org/wiki/MediaWiki:Common.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 * @dependency mediawiki.util
 */

'use strict';

(function ($, mw) {
if (mw.SiteCommonJS) {
	return;
}
mw.SiteCommonJS = true;
window.wgUXS = function (wg, hans, hant, cn, tw, hk, sg, zh, mo, my, en) {
	var ref, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref18, ref19, ref20, ref21, ref22, ref23, ref24, ref25, ref26, ref27, ref28, ref29, ref30, ref31, ref32, ref33, ref34, ref35, ref36, ref37, ref38, ref39, ret$wg;
	var ret = {
		'zh': (ref = (ref2 = (ref3 = (ref4 = (ref5 = (ref6 = (ref7 = (ref8 = zh !== null && zh !== undefined ? zh : hans) !== null && ref8 !== undefined ? ref8 : hant) !== null && ref7 !== undefined ? ref7 : cn) !== null && ref6 !== undefined ? ref6 : tw) !== null && ref5 !== undefined ? ref5 : hk) !== null && ref4 !== undefined ? ref4 : sg) !== null && ref3 !== undefined ? ref3 : mo) !== null && ref2 !== undefined ? ref2 : my) !== null && ref !== undefined ? ref : '',
		'zh-hans': (ref9 = (ref10 = (ref11 = hans !== null && hans !== undefined ? hans : cn) !== null && ref11 !== undefined ? ref11 : sg) !== null && ref10 !== undefined ? ref10 : my) !== null && ref9 !== undefined ? ref9 : '',
		'zh-hant': (ref12 = (ref13 = (ref14 = hant !== null && hant !== undefined ? hant : tw) !== null && ref14 !== undefined ? ref14 : hk) !== null && ref13 !== undefined ? ref13 : mo) !== null && ref12 !== undefined ? ref12 : '',
		'zh-cn': (ref15 = (ref16 = (ref17 = cn !== null && cn !== undefined ? cn : hans) !== null && ref17 !== undefined ? ref17 : sg) !== null && ref16 !== undefined ? ref16 : my) !== null && ref15 !== undefined ? ref15 : '',
		'zh-sg': (ref18 = (ref19 = (ref20 = sg !== null && sg !== undefined ? sg : hans) !== null && ref20 !== undefined ? ref20 : cn) !== null && ref19 !== undefined ? ref19 : my) !== null && ref18 !== undefined ? ref18 : '',
		'zh-tw': (ref21 = (ref22 = (ref23 = tw !== null && tw !== undefined ? tw : hant) !== null && ref23 !== undefined ? ref23 : hk) !== null && ref22 !== undefined ? ref22 : mo) !== null && ref21 !== undefined ? ref21 : '',
		'zh-hk': (ref24 = (ref25 = (ref26 = hk !== null && hk !== undefined ? hk : hant) !== null && ref26 !== undefined ? ref26 : mo) !== null && ref25 !== undefined ? ref25 : tw) !== null && ref24 !== undefined ? ref24 : '',
		'zh-mo': (ref27 = (ref28 = (ref29 = mo !== null && mo !== undefined ? mo : hant) !== null && ref29 !== undefined ? ref29 : hk) !== null && ref28 !== undefined ? ref28 : tw) !== null && ref27 !== undefined ? ref27 : ''
	};
	return (ref30 = (ref31 = (ref32 = (ref33 = (ref34 = (ref35 = (ref36 = (ref37 = (ref38 = (ref39 = (ret$wg = ret[wg]) !== null && ret$wg !== undefined ? ret$wg : en) !== null && ref39 !== undefined ? ref39 : zh) !== null && ref38 !== undefined ? ref38 : hans) !== null && ref37 !== undefined ? ref37 : hant) !== null && ref36 !== undefined ? ref36 : cn) !== null && ref35 !== undefined ? ref35 : tw) !== null && ref34 !== undefined ? ref34 : hk) !== null && ref33 !== undefined ? ref33 : sg) !== null && ref32 !== undefined ? ref32 : mo) !== null && ref31 !== undefined ? ref31 : my) !== null && ref30 !== undefined ? ref30 : '';
};
window.wgULS = function (hans, hant, cn, tw, hk, sg, zh, mo, my, en) {
	return window.wgUXS(mw.config.get('wgUserLanguage'), hans, hant, cn, tw, hk, sg, zh, mo, my, en);
};
window.wgUVS = function (hans, hant, cn, tw, hk, sg, zh, mo, my, en) {
	return window.wgUXS(mw.config.get('wgUserVariant'), hans, hant, cn, tw, hk, sg, zh, mo, my, en);
};

/**
 * Map addPortletLink to mw.util
 *
 * @deprecated: Use mw.util.addPortletLink instead.
 */
mw.log.deprecate(window, 'addPortletLink', function () {
	return mw.util.addPortletLink.apply(mw.util, arguments);
}, 'Use mw.util.addPortletLink() instead');
/**
 * Extract a URL parameter from the current URL
 *
 * @deprecated: Use mw.util.getParamValue with proper escaping
 */
mw.log.deprecate(window, 'getURLParamValue', function () {
	return mw.util.getParamValue.apply(mw.util, arguments);
}, 'Use mw.util.getParamValue() instead');
/**
 * Test if an element has a certain class
 *
 * @deprecated:  Use $(element).hasClass() instead.
 */
mw.log.deprecate(window, 'hasClass', function (element, className) {
	// eslint-disable-next-line no-jquery/no-class-state
	return $(element).hasClass(className);
}, 'Use jQuery.hasClass() instead');
$(function () {
	$('a.external').filter(function () {
		var h = String($(this).attr('href')).split('/');
		if (h.length < 3 || h[2] === location.host) {
			return false;
		}
		return true;
	}).attr('target', '_blank');
});

// maintenance: Some user scripts may be using the following deprecated functions on mobile.
// These functions are no longer supported and should be updated to use mw.loader.getScript.
window.importScript = function (page) {
	mw.loader.load(mw.config.get('wgServer') + mw.config.get('wgScript') + '?title=' + mw.util.wikiUrlencode(page) + '&action=raw&ctype=text/javascript');
};
window.importStylesheet = function (page) {
	mw.loader.load(mw.config.get('wgServer') + mw.config.get('wgScript') + '?title=' + mw.util.wikiUrlencode(page) + '&action=raw&ctype=text/css', 'text/css');
};
window.importScriptURI = function (URL) {
	mw.loader.load(mw.util.wikiUrlencode(URL));
};
window.importStylesheetURI = function (URL) {
	mw.loader.load(mw.util.wikiUrlencode(URL), 'text/css');
};
window.importScriptCallback = function (page, ready) {
	window.importScriptURICallback(mw.config.get('wgServer') + mw.config.get('wgScript') + '?title=' + mw.util.wikiUrlencode(page) + '&action=raw&ctype=text/javascript', ready);
};
window.importScriptURICallback = mw.loader.getScript;
}(jQuery, mediaWiki));
