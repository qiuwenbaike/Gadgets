/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://zh.wikipedia.org/w/index.php?title=User:WhitePhosphorus/js/rrd.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 * @dependency ext.gadget.SiteCommonJs
 */
/* eslint-disable no-useless-concat */
/* eslint-disable no-console */
/* eslint-disable no-alert */

'use strict';

// Polyfill
// eslint-disable-next-line no-implicit-globals
function _toConsumableArray(arr) {
	return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
// eslint-disable-next-line no-implicit-globals
function _nonIterableSpread() {
	throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.');
}
// eslint-disable-next-line no-implicit-globals
function _unsupportedIterableToArray(o, minLen) {
	if (!o) {
		return;
	}
	if (typeof o === 'string') {
		return _arrayLikeToArray(o, minLen);
	}
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === 'Object' && o.constructor) {
		n = o.constructor.name;
	}
	if (n === 'Map' || n === 'Set') {
		// eslint-disable-next-line es-x/no-array-from
		return Array.from(o);
	}
	if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) {
		return _arrayLikeToArray(o, minLen);
	}
}
// eslint-disable-next-line no-implicit-globals
function _iterableToArray(iter) {
	// eslint-disable-next-line no-undef, eqeqeq, no-mixed-operators
	if (typeof Symbol !== 'undefined' && iter[Symbol.iterator] != null || iter['@@iterator'] != null) {
		// eslint-disable-next-line es-x/no-array-from
		return Array.from(iter);
	}
}
// eslint-disable-next-line no-implicit-globals
function _arrayWithoutHoles(arr) {
	if (Array.isArray(arr)) {
		return _arrayLikeToArray(arr);
	}
}
// eslint-disable-next-line no-implicit-globals
function _arrayLikeToArray(arr, len) {
	// eslint-disable-next-line eqeqeq
	if (len == null || len > arr.length) {
		len = arr.length;
	}
	for (var i = 0, arr2 = new Array(len); i < len; i++) {
		arr2[i] = arr[i];
	}
	// eslint-disable-next-line block-scoped-var
	return arr2;
}

// <nowiki>
mw.loader.using([ 'jquery.ui', 'mediawiki.util' ], function () {
	var RRDPage = 'Qiuwen:版本删除提报',
		ids = [],
		dl = null,
		config = {
			checkboxes: {},
			others: {}
		},
		msg,
		log = false;
	function get(obj, attr, defret) {
		return obj.hasAttribute(attr) ? obj.getAttribute(attr) : defret;
	}
	function loadIDs() {
		var boxes = document.getElementsByTagName('input');
		for (var i = 0; i < boxes.length; ++i) {
			if (get(boxes[i], 'type') === 'checkbox' && boxes[i].checked) {
				var idRe = /ids\[(\d+)\]/,
					idArr = idRe.exec(get(boxes[i], 'name', ''));
				if (idArr !== null) {
					ids.push(idArr[1]);
				}
			}
		}
	}
	function submit(toHide, reason, otherReasons) {
		// eslint-disable-next-line no-undef
		ids = _toConsumableArray(new Set(ids)); // remove duplicate
		var rrdArr = [ '{{Revdel', '|status = ', '|article = ' + mw.config.get('wgPageName'), '|set = ' + toHide, '|reason = ' + reason + otherReasons ];
		for (var i = 0; i < ids.length; ++i) {
			rrdArr.push('|id' + (i + 1) + ' = ' + ids[i]);
		}
		rrdArr.push('}}\n--~~' + '~~');
		$.ajax({
			url: mw.util.wikiScript('api'),
			dataType: 'json',
			type: 'POST',
			data: {
				action: 'edit',
				title: RRDPage,
				section: 'new',
				sectiontitle: '版本删除提报（{{' + 'subst:#time:Y-m-d H:i:s|+8 hours}}）',
				summary: msg.editSummary,
				text: rrdArr.join('\n'),
				token: mw.user.tokens.get('csrfToken'),
				format: 'json'
			}
		}).done(function (data) {
			if (data && data.edit && data.edit.result === 'Success') {
				window.location = mw.config.get('wgServer') + mw.config.get('wgArticlePath').replace('$1', RRDPage);
			} else {
				alert('Some errors occured while saving page: ' + data.error.code ? data.error.code : 'unknown');
			}
		}).fail(function (jqXHR, textStatus, errorThrown) {
			console.log('Error when editing page ' + RRDPage + ': ' + errorThrown);
		});
	}
	function updateConfig() {
		if ($('#rrdHideContent').prop('checked')) {
			config.checkboxes.rrdHideContent = 1;
		}
		if ($('#rrdHideUsername').prop('checked')) {
			config.checkboxes.rrdHideUsername = 1;
		}
		if ($('#rrdHideSummary').prop('checked')) {
			config.checkboxes.rrdHideSummary = 1;
		}
		config.others.rrdReason = $('#rrdReason').val();
		config.others.rrdOtherReasons = $('#rrdOtherReasons').val();
	}
	function loadConfig() {
		for (var k in config.others) {
			if (Object.prototype.hasOwnProperty.call(config.others, k)) {
				$('#' + k).val(config.others[k]);
			}
		}
		for (var j in config.checkboxes) {
			if (Object.prototype.hasOwnProperty.call(config.checkboxes, j)) {
				$('#' + j).prop('checked', Object.prototype.hasOwnProperty.call(config.checkboxes, j));
			}
		}
	}
	function showWindow() {
		loadIDs();
		if (ids.length === 0) {
			alert(msg.errNoRevisionProvided);
			return null;
		}
		var html = '<div id="rrdConfig">' + msg.hideItems + '<br />' + '<div style="float:left;padding:0 5px;">' + '<input name="content" id="rrdHideContent" type="checkbox" value="content" checked>' + '<label for="rrdHideContent" id="rrd-content">' + (log ? msg.hideLog : msg.hideContent) + '</label>' + '</div><div style="float:left;padding:0 5px;">' + '<input name="username" id="rrdHideUsername" type="checkbox" value="username">' + '<label for="rrdHideUsername" id="rrd-username">' + msg.hideUsername + '</label>' + '</div><div style="float:left;padding:0 5px;">' + '<input name="summary" id="rrdHideSummary" type="checkbox" value="summary">' + '<label for="rrdHideSummary" id="rrd-summary">' + msg.hideSummary + '</label>' + '</div><br /><br />' + msg.hideReason + '<br />' + '<select name="rrdReason" id="rrdReason">' + '<option value=' + msg.hideReasonRD1 + '>' + 'RD1：' + msg.hideReasonRD1 + '</option>' + '<option value=' + msg.hideReasonRD2 + '>' + 'RD2：' + msg.hideReasonRD2 + '</option>' + '<option value=' + msg.hideReasonRD3 + '>' + 'RD3：' + msg.hideReasonRD3 + '</option>' + '<option value=' + msg.hideReasonRD4 + '>' + 'RD4：' + msg.hideReasonRD4 + '</option>' + '<option value=' + msg.hideReasonRD5 + '>' + 'RD5：' + msg.hideReasonRD5 + '</option>' + '<option value="">' + msg.hideReasonOther + '</option>' + '</select>' + '<br /><br />' + msg.otherReasons + '<br />' + '<textarea name="otherReasons" id="rrdOtherReasons" rows=4></textarea>' + '</div>';
		if (dl) {
			dl.html(html).dialog('open');
			loadConfig();
			return null;
		}
		dl = $(html).dialog({
			title: msg.dialogTitle,
			minWidth: 515,
			minHeight: 150,
			close: updateConfig,
			buttons: [ {
				text: msg.dialogButtonSubmit,
				click: function click() {
					$(this).dialog('close');
					var reason = config.others.rrdReason;
					var otherReasons = config.others.rrdOtherReasons;
					if (otherReasons && reason) {
						otherReasons = '，' + otherReasons;
					}
					var toHide = [];
					if (Object.prototype.hasOwnProperty.call(config.checkboxes, 'rrdHideContent')) {
						toHide.push(log ? msg.hideLog : msg.hideContent);
					}
					if (Object.prototype.hasOwnProperty.call(config.checkboxes, 'rrdHideUsername')) {
						toHide.push(msg.hideUsername);
					}
					if (Object.prototype.hasOwnProperty.call(config.checkboxes, 'rrdHideSummary')) {
						toHide.push(msg.hideSummary);
					}
					var cont = true;
					if (toHide.length === 0) {
						alert(msg.errNo_item_provided);
						return null;
					}
					if (!reason && !otherReasons) {
						cont = confirm(msg.warnNoReasonProvided);
					}
					if (cont) {
						submit(toHide.join('、'), reason, otherReasons);
					}
				}
			}, {
				text: msg.dialogButtonCancel,
				click: function click() {
					$(this).dialog('close');
				}
			} ]
		});
	}
	function main() {
		var $report = $('<button>').attr({
			name: 'reportRRD',
			type: 'button',
			class: 'historysubmit mw-history-rrd mw-ui-button',
			title: msg.reportButtonTitle + RRDPage,
			text: log ? msg.reportButtonLogText : msg.reportButtonText
		});
		$report.on('click', showWindow);
		// For action=history
		$('.historysubmit.mw-history-compareselectedversions-button').after($report);
		// For Special:Log
		$('.editchangetags-log-submit.mw-log-editchangetags-button').after($report);
	}
	function init() {
		loadMessages();
		if (mw.config.get('wgAction') === 'history' || mw.config.get('wgCanonicalSpecialPageName') === 'Log') {
			log = mw.config.get('wgCanonicalSpecialPageName') === 'Log';
			main();
		}
	}
	$(init);
	function loadMessages() {
		switch (mw.config.get('wgUserLanguage')) {
			case 'zh-hant':
			case 'zh-hk':
			case 'zh-mo':
			case 'zh-tw':
				msg = {
					editSummary: '[[MediaWiki:Gadget-RRD-main.js|半自動提報]]修訂版本刪除',
					errNoRevisionProvided: '您沒有選擇需隱藏的版本！',
					errNoItemProvided: '您沒有選擇需隱藏的項目！',
					warnNoReasonProvided: '您沒有輸入任何理由！確定要繼續嗎？',
					hideItems: '需隱藏的項目：',
					hideContent: '編輯內容',
					hideLog: '日誌目標與參數',
					hideUsername: '編輯者用戶名',
					hideSummary: '編輯摘要',
					hideReason: '理據：',
					hideReasonRD1: '條目中明顯侵犯著作權的內容',
					hideReasonRD2: '嚴重侮辱、貶低或攻擊性文本',
					hideReasonRD3: '純粹擾亂性內容',
					hideReasonRD4: '明顯違反法律法規或違背公序良俗的內容',
					hideReasonRD5: '其他不宜公開的版本內容',
					hideReasonOther: '僅使用下方的附加理由',
					otherReasons: '附加理由（可選，不用簽名）',
					dialogTitle: '提報修訂版本刪除',
					dialogButtonSubmit: '提報',
					dialogButtonCancel: '取消',
					reportButtonTitle: '將選中的版本提報到',
					reportButtonText: '請求刪除被選版本',
					reportButtonLogText: '請求刪除被選日誌'
				};
				break;
			default:
				msg = {
					editSummary: '[[MediaWiki:Gadget-RRD-main.js|半自动提报]]修订版本删除',
					errNoRevisionProvided: '您没有选择需隐藏的版本！',
					errNoItemProvided: '您没有选择需隐藏的项目！',
					warnNoReasonProvided: '您没有输入任何理由！确定要继续吗？',
					hideItems: '需隐藏的项目：',
					hideContent: '编辑内容',
					hideLog: '日志目标与参数',
					hideUsername: '编辑者用户名',
					hideSummary: '编辑摘要',
					hideReason: '理据：',
					hideReasonRD1: '条目中明显侵犯著作权的内容',
					hideReasonRD2: '严重侮辱、贬低或攻击性文本',
					hideReasonRD3: '纯粹扰乱性内容',
					hideReasonRD4: '明显违反法律法规或违背公序良俗的内容',
					hideReasonRD5: '其他不宜公开的版本内容',
					hideReasonOther: '仅使用下方的附加理由',
					otherReasons: '附加理由（可选，不用签名）',
					dialogTitle: '提报修订版本删除',
					dialogButtonSubmit: '提报',
					dialogButtonCancel: '取消',
					reportButtonTitle: '将选中的版本提报到',
					reportButtonText: '请求删除被选版本',
					reportButtonLogText: '请求删除被选日志'
				};
		}
	}
});
// </nowiki>
