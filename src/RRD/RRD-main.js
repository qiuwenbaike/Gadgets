/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://zh.wikipedia.org/w/index.php?title=User:WhitePhosphorus/js/rrd.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 * @dependency ext.gadget.SiteCommonJs
 */
// <nowiki>
function get(obj, attr, defret) {
	return obj.hasAttribute(attr) ? obj.getAttribute(attr) : defret;
}

mw.loader.using([ 'jquery.ui', 'mediawiki.util' ], function () {
	var RRDPage = 'Qiuwen:版本删除提报',
		ids = [],
		dl = null,
		config = { checkboxes: {}, others: {} },
		msg,
		log = false;

	function loadIDs() {
		boxes = document.getElementsByTagName('input');
		for (i = 0; i < boxes.length; ++i) {
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
		ids = [ ...new Set(ids) ];  // remove duplicate
		var rrdArr = [
			'{{Revdel',
			'|status = ',
			'|article = ' + mw.config.get('wgPageName'),
			'|set = ' + toHide,
			'|reason = ' + reason + otherReasons
		];
		for (i = 0; i < ids.length; ++i) {
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
				summary: msg.edit_summary,
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
			if (config.others.hasOwnProperty(k)) {
				$('#' + k).val(config.others[k]);
			}
		}
		for (k in config.checkboxes) {
			$('#' + k).prop('checked', config.checkboxes.hasOwnProperty(k));
		}
	}

	function showWindow() {
		loadIDs();
		if (ids.length === 0) {
			alert(msg.err_no_revision_provided);
			return null;
		}
		var html =
			'<div id="rrdConfig">' +
			msg.hide_items + '<br />' +
			'<div style="float:left;padding:0 5px;">' +
			'<input name="content" id="rrdHideContent" type="checkbox" value="content" checked>' +
			'<label for="rrdHideContent" id="rrd-content">' + (log ? msg.hide_log : msg.hide_content) + '</label>' +
			'</div><div style="float:left;padding:0 5px;">' +
			'<input name="username" id="rrdHideUsername" type="checkbox" value="username">' +
			'<label for="rrdHideUsername" id="rrd-username">' + msg.hide_username + '</label>' +
			'</div><div style="float:left;padding:0 5px;">' +
			'<input name="summary" id="rrdHideSummary" type="checkbox" value="summary">' +
			'<label for="rrdHideSummary" id="rrd-summary">' + msg.hide_summary + '</label>' +
			'</div><br /><br />' +
			msg.hide_reason + '<br />' +
			'<select name="rrdReason" id="rrdReason">' +
			'<option value=' + msg.hide_reason_rd1 + '>' + 'RD1：' + msg.hide_reason_rd1 + '</option>' +
			'<option value=' + msg.hide_reason_rd2 + '>' + 'RD2：' + msg.hide_reason_rd2 + '</option>' +
			'<option value=' + msg.hide_reason_rd3 + '>' + 'RD3：' + msg.hide_reason_rd3 + '</option>' +
			'<option value=' + msg.hide_reason_rd4 + '>' + 'RD4：' + msg.hide_reason_rd4 + '</option>' +
			'<option value=' + msg.hide_reason_rd5 + '>' + 'RD5：' + msg.hide_reason_rd5 + '</option>' +
			'<option value="">' + msg.hide_reason_other + '</option>' +
			'</select>' +
			'<br /><br />' +
			msg.other_reasons + '<br />' +
			'<textarea name="otherReasons" id="rrdOtherReasons" rows=4></textarea>' +
			'</div>';
		if (dl) {
			dl.html(html).dialog('open');
			loadConfig();
			return null;
		}
		dl = $(html).dialog({
			title: msg.dialog_title,
			minWidth: 515,
			minHeight: 150,
			close: updateConfig,
			buttons: [
				{
					text: msg.dialog_button_submit,
					click: function () {
						$(this).dialog('close');
						var reason = config.others.rrdReason;
						var otherReasons = config.others.rrdOtherReasons;
						if (otherReasons && reason) {
							otherReasons = '，' + otherReasons;
						}
						var toHide = [];
						if (config.checkboxes.hasOwnProperty('rrdHideContent')) {
							toHide.push(log ? msg.hide_log : msg.hide_content);
						}
						if (config.checkboxes.hasOwnProperty('rrdHideUsername')) {
							toHide.push(msg.hide_username);
						}
						if (config.checkboxes.hasOwnProperty('rrdHideSummary')) {
							toHide.push(msg.hide_summary);
						}
						var cont = true;
						if (toHide.length === 0) {
							alert(msg.err_no_item_provided);
							return null;
						}
						if (!reason && !otherReasons) {
							cont = confirm(msg.warn_no_reason_provided);
						}
						if (cont) {
							submit(toHide.join('、'), reason, otherReasons);
						}
					}
				},
				{
					text: msg.dialog_button_cancel,
					click: function () {
						$(this).dialog('close');
					}
				}
			]
		});
	}

	function main() {
		var $report = $('<button>', {
			name: 'reportRRD',
			type: 'button',
			class: 'historysubmit mw-history-rrd mw-ui-button',
			title: msg.report_button_title + RRDPage,
			text: log ? msg.report_button_log_text : msg.report_button_text
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
					edit_summary: '[[MediaWiki:Gadget-RRD-main.js|半自動提報]]修訂版本刪除',
					err_no_revision_provided: '您沒有選擇需隱藏的版本！',
					err_no_item_provided: '您沒有選擇需隱藏的項目！',
					warn_no_reason_provided: '您沒有輸入任何理由！確定要繼續嗎？',
					hide_items: '需隱藏的項目：',
					hide_content: '編輯內容',
					hide_log: '日誌目標與參數',
					hide_username: '編輯者用戶名',
					hide_summary: '編輯摘要',
					hide_reason: '理據：',
					hide_reason_rd1: '條目中明顯侵犯著作權的內容',
					hide_reason_rd2: '嚴重侮辱、貶低或攻擊性文本',
					hide_reason_rd3: '純粹擾亂性內容',
					hide_reason_rd4: '明顯違反法律法規或違背公序良俗的內容',
					hide_reason_rd5: '其他不宜公開的版本內容',
					hide_reason_other: '僅使用下方的附加理由',
					other_reasons: '附加理由（可選，不用簽名）',
					dialog_title: '提報修訂版本刪除',
					dialog_button_submit: '提報',
					dialog_button_cancel: '取消',
					report_button_title: '將選中的版本提報到',
					report_button_text: '請求刪除被選版本',
					report_button_log_text: '請求刪除被選日誌'
				};
				break;
			default:
				msg = {
					edit_summary: '[[MediaWiki:Gadget-RRD-main.js|半自动提报]]修订版本删除',
					err_no_revision_provided: '您没有选择需隐藏的版本！',
					err_no_item_provided: '您没有选择需隐藏的项目！',
					warn_no_reason_provided: '您没有输入任何理由！确定要继续吗？',
					hide_items: '需隐藏的项目：',
					hide_content: '编辑内容',
					hide_log: '日志目标与参数',
					hide_username: '编辑者用户名',
					hide_summary: '编辑摘要',
					hide_reason: '理据：',
					hide_reason_rd1: '条目中明显侵犯著作权的内容',
					hide_reason_rd2: '严重侮辱、贬低或攻击性文本',
					hide_reason_rd3: '纯粹扰乱性内容',
					hide_reason_rd4: '明显违反法律法规或违背公序良俗的内容',
					hide_reason_rd5: '其他不宜公开的版本内容',
					hide_reason_other: '仅使用下方的附加理由',
					other_reasons: '附加理由（可选，不用签名）',
					dialog_title: '提报修订版本删除',
					dialog_button_submit: '提报',
					dialog_button_cancel: '取消',
					report_button_title: '将选中的版本提报到',
					report_button_text: '请求删除被选版本',
					report_button_log_text: '请求删除被选日志'
				};
		}
	}
});
// </nowiki>
