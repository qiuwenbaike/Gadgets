/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-window.wikiCache.js
 * @source https://zh.wikipedia.org/wiki/User:PhiLiP/wikicache/window.wikiCache.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0>
 */
'use strict';

/* eslint-disable no-console */
/* eslint-disable no-jquery/no-sizzle */
/* eslint-disable no-jquery/no-parse-html-literal */

// <nowiki>
(function ($, mw) {
window.wikiCache = {
	version: '0.1.2',
	_msgs: {
		'no-reminder': '不再提醒',
		'more': '更多信息',
		'ok': '确定',
		'delete': '删除',
		'load': '载入',
		'ignore': '忽略',
		'bracket-left': '（',
		'bracket-right': '）',
		'manage-storage': '管理内容',
		'not-support': '抱歉，您的浏览器无法支持WikiCache，如果您打算使用WikiCache，请更新您的浏览器。',
		'not-support-title': '浏览器过旧',
		'not-support-more-link': 'Help:WikiCache/浏览器支持',
		'no-permission': '抱歉，我们检测到您的浏览器禁用了WikiCache需要的功能，如果您要使用WikiCache，请进行相关设置。',
		'no-permission-title': '权限不足',
		'no-permission-more-link': 'Help:WikiCache/浏览器配置',
		'pendding-delete': '确认提交',
		'pendding-delete-message': '由于您启用了网络访问受阻模式，请确认内容是否提交成功。<ul>\
			<li>点击“<b>删除</b>”删除先前的自动保存结果；</li>\
			<li>点击“<b>载入</b>”将转向上次编辑时的页面，并自动载入已保存内容；</li>\
			<li>点击“<b>忽略</b>”会关闭本窗口，下次打开本页面时不再提醒，但不会删除先前的自动保存结果。</li></ul>',
		'notice-init': '自动保存已启用。',
		'notice-more': '配置',
		'notice-load': '载入上次存档',
		'notice-autosave-success': '自动保存成功。',
		'notice-autosave-failed': '自动保存失败，可能是由于已超出浏览器所允许空间上限',
		'notice-autosave-failed-clear': '清理',
		'notice-load-available': '发现自动保存结果，请选择是否载入。',
		'notice-load-available-confirm': '载入',
		'notice-load-available-ignore': '忽略',
		'settings-title': 'WikiCache配置',
		'settings-autosave-interval': '自动保存间隔：',
		'settings-autosave-interval-suffix': '秒',
		'settings-autosave-interval-too-small': '错误：“自动保存间隔”所设间隔过小（<10秒），请重新设置',
		'settings-autosave-interval-invalid': '错误：请在“自动保存间隔”输入框中输入数字',
		'settings-gfw-mode': '启用网络访问受阻模式'
	},
	_settings: {
		'autosave-interval': 60,
		'gfw-mode': false
	},
	_style: '\
			.wikicache-dialog {\
				font-size: 1em;\
			}\
			.wikicache-notice {\
				position: fixed;\
				left: 0;\
				top: 0;\
				height: 1.6em;\
				font-size: .8em;\
				line-height: 1.6em;\
				white-space: nowrap;\
				border-bottom: 1px solid #a7d7f9;\
				border-right: 1px solid #a7d7f9;\
				display: none;\
			}\
			.wikicache-notice .ui-dialog-titlebar-close {\
				float: right;\
				display: inline-block;\
			}\
			.wikicache-dialog a, .wikicache-notice a {\
				color: #0645AD;\
			}\
			.wikicache-dialog a:visited, .wikicache-notice a:visited {\
				color: #0B0080;\
			}\
			.wikicache-error-message {\
				background: url("https://upload.qiuwenbaike.cn/images/thumb/0/09/Cross_Mark_%28Red%29.svg/48px-Cross_Mark_%28Red%29.svg.png") no-repeat left center;\
				padding-left: 60px;\
				min-height: 48px;\
			}\
		',
	_autoSaveArea: {
		'#wpTextbox1': function wpTextbox1(el, val) {
			if (val) {
				el.val(val);
			} else {
				return el.val();
			}
		},
		'#wpSummary': function wpSummary(el, val) {
			if (val) {
				el.val(val);
			} else {
				return el.val();
			}
		}
	},
	init: function init() {
		var action = mw.config.get('wgAction');
		if (action === 'edit' || action === 'submit') {
			window.wikiCache._initEdit();
		} else if (action === 'view') {
			window.wikiCache._initView();
		}
	},
	_initView: function _initView() {
		mw.loader.using('jquery.ui', function () {
			if (typeof $.storage !== 'undefined' && !$.storage.notsupport && !$.storage.nopermission) {
				window.wikiCache._loadStyle();
				window.wikiCache._loadSettings();
				window.wikiCache._onComplete();
			}
		});
	},
	_initEdit: function _initEdit() {
		mw.loader.using('jquery.ui', function () {
			window.wikiCache._loadStyle();
			var errdlg = window.wikiCache._errorDialog;
			var msgs = window.wikiCache._msgs;
			if ($.storage.notsupport) {
				errdlg(0, msgs['not-support-title'], msgs['not-support'], mw.util.getUrl(msgs['not-support-more-link']));
				return;
			} else if ($.storage.nopermission) {
				errdlg(1, msgs['no-permission-title'], msgs['no-permission'], mw.util.getUrl(msgs['no-permission-more-link']));
				return;
			}
			// eslint-disable-next-line no-jquery/no-bind
			$('#editform').bind('wikiCacheSettingsUpdate', window.wikiCache._autoSave).on('submit', window.wikiCache._onSubmit);
			window.wikiCache._loadSettings();
			window.wikiCache._defaultNotice();
			if (window.location.hash.indexOf('wikicache=autoload') > -1) {
				window.wikiCache._load();
			} else {
				window.wikiCache._initLoad();
			}
		});
	},
	_manageStorage: function _manageStorage() {
		console.log('under construction...');
	},
	_loadStyle: function _loadStyle() {
		$('head').append('<style type="text/css">' + window.wikiCache._style + '</style>');
	},
	_loadSettings: function _loadSettings() {
		var settings = $.storage('wiki-cache-settings');
		if (settings instanceof Object) {
			$.extend(window.wikiCache._settings, settings);
		}
		$('#editform').trigger('wikiCacheSettingsUpdate');
	},
	_saveSettings: function _saveSettings() {
		$.storage('wiki-cache-settings', window.wikiCache._settings);
		$('#editform').trigger('wikiCacheSettingsUpdate');
	},
	_errorDialog: function _errorDialog(code, title, msg, more) {
		var noreminderid = 'no-reminder-' + code;
		if ($.cookie(noreminderid)) {
			return;
		}
		var msgs = window.wikiCache._msgs;
		var buttons = {};
		buttons[msgs.ok] = function () {
			$(this).dialog('close').remove();
		};
		$('<div class="wikicache-dialog wikicache-error">').attr('title', title).append($('<div class="wikicache-error-message" />').html(msg + '&nbsp;' + msgs['bracket-left']).append($('<a href="' + more + '"/>').html(msgs.more)).append(msgs['bracket-right'])).append($('<p>').append($('<input type="checkbox" name="noreminder">').attr('id', noreminderid)).append($('<label>').attr('for', noreminderid).html(msgs['no-reminder']))).appendTo($('body')).dialog({
			buttons: buttons,
			draggable: false,
			modal: true,
			width: 450,
			beforeClose: function beforeClose() {
				if ($('#' + noreminderid, this).attr('checked')) {
					$.cookie(noreminderid, true);
				}
			}
		});
	},
	_defaultNotice: function _defaultNotice() {
		var msgs = window.wikiCache._msgs;
		var more = {};
		more[msgs['notice-more']] = window.wikiCache._settingsDialog;
		more[msgs['notice-load']] = function () {
			window.wikiCache._load();
		};
		more[msgs['manage-storage']] = window.wikiCache._manageStorage;
		window.wikiCache._notice(msgs['notice-init'], more);
	},
	_notice: function _notice(msg, more) {
		var notice = $('#wikicache-notice');
		if (notice.length === 0) {
			notice = $('<div id="wikicache-notice" class="ui-widget-content wikicache-notice"/>');
		}
		notice.empty().unbind('mouseenter').unbind('mouseleave').append(msg).appendTo($('body')).fadeIn();
		if (more instanceof Object) {
			notice.hover(function () {
				var msgs = window.wikiCache._msgs;
				var el = $('<span class="wikicache-more"/>').appendTo(notice).append(msgs['bracket-left']);
				var first = true;
				el.appendTo(notice);
				// eslint-disable-next-line no-shadow
				for (var msg in more) {
					if (Object.prototype.hasOwnProperty.call(more, msg)) {
						if (!first) {
							el.append('&nbsp;|&nbsp;');
						} else {
							first = false;
						}
						el.append($('<a href="#"/>').html(msg).on('click', more[msg]));
					}
				}
				el.append(msgs['bracket-right']);
			}, function () {
				$('.wikicache-more', this).remove();
			});
		}
	},
	_settingsDialog: function _settingsDialog() {
		var msgs = window.wikiCache._msgs;
		var settings = window.wikiCache._settings;
		var buttons = {};
		buttons[msgs.ok] = function () {
			$(this).dialog('close');
		};
		var dia = $('<div class="wikicache-dialog"/>').attr('title', msgs['settings-title']).append($('<p>').append($('<label for="autosave-interval"/>').html(msgs['settings-autosave-interval'])).append($('<input id="autosave-interval" type="text"/>').attr('size', 5).val(settings['autosave-interval'])).append('&nbsp;' + msgs['settings-autosave-interval-suffix'])).append($('<p>').append($('<input id="gfw-mode" name="gfw-mode" type="checkbox"/>').attr('checked', settings['gfw-mode'])).append($('<label for="gfw-mode"/>').html(msgs['settings-gfw-mode'])));
		dia.appendTo($('body')).dialog({
			buttons: buttons,
			draggable: false,
			modal: true,
			width: 400,
			beforeClose: function beforeClose() {
				var interval = $('#autosave-interval', dia).val();
				if (!isNaN(interval)) {
					interval = parseInt(interval);
					if (interval < 10) {
						console.log(msgs['settings-autosave-interval-too-small']);
						return false;
					}
					settings['autosave-interval'] = interval;
				} else {
					console.log(msgs['settings-autosave-interval-invalid']);
					return false;
				}
				settings['gfw-mode'] = $('#gfw-mode', dia).attr('checked');
				window.wikiCache._saveSettings();
			}
		});
		return false;
	},
	_autoSaveId: null,
	_autoSave: function _autoSave() {
		clearTimeout(window.wikiCache._autoSaveId);
		window.wikiCache._autoSaveId = setTimeout(function () {
			window.wikiCache._save();
			window.wikiCache._autoSave();
		}, window.wikiCache._settings['autosave-interval'] * 1000);
	},
	_save: function _save() {
		var msgs = window.wikiCache._msgs;
		var asarea = window.wikiCache._autoSaveArea;
		var autosave = {
			_path: window.location.pathname + window.location.search,
			_date: new Date()
		};
		for (var sele in asarea) {
			if (Object.prototype.hasOwnProperty.call(asarea, sele)) {
				autosave[sele] = asarea[sele]($(sele));
			}
		}
		var thekey = 'autosave-' + mw.config.get('wgPageName');
		var section = $('input[name="wpSection"]:first').val();
		if (section) {
			thekey += '_' + section;
		}
		$.storage(thekey, autosave);
		if ($.storage.success) {
			window.wikiCache._notice(msgs['notice-autosave-success']);
		} else {
			var more = {};
			more[msgs['notice-autosave-failed-clear']] = window.wikiCache._manageStorage;
			window.wikiCache._notice(msgs['notice-autosave-failed'], more);
		}
		setTimeout(window.wikiCache._defaultNotice, 1000);
	},
	_initLoad: function _initLoad() {
		var msgs = window.wikiCache._msgs;
		var thekey = 'autosave-' + mw.config.get('wgPageName');
		var section = $('input[name="wpSection"]:first').val();
		if (section) {
			thekey += '_' + section;
		}
		var autosave = $.storage(thekey);
		if (autosave instanceof Object) {
			var more = {};
			more[msgs['notice-load-available-confirm']] = function () {
				window.wikiCache._load(autosave);
				return false;
			};
			more[msgs['notice-load-available-ignore']] = function () {
				window.wikiCache._defaultNotice();
				window.wikiCache._autoSave();
				return false;
			};
			window.wikiCache._notice(msgs['notice-load-available'], more);
			clearTimeout(window.wikiCache._autoSaveId);
		}
	},
	_load: function _load(autosave) {
		// eslint-disable-next-line block-scoped-var
		if (!(autosave instanceof Object)) {
			var thekey = 'autosave-' + mw.config.get('wgPageName');
			var section = $('input[name="wpSection"]:first').val();
			if (section) {
				thekey += '_' + section;
			}
			// eslint-disable-next-line no-redeclare
			var autosave = $.storage(thekey);
		}
		// eslint-disable-next-line no-unused-vars
		var msgs = window.wikiCache._msgs;
		var asarea = window.wikiCache._autoSaveArea;
		for (var sele in asarea) {
			if (Object.prototype.hasOwnProperty.call(asarea, sele)) {
				// eslint-disable-next-line block-scoped-var
				asarea[sele]($(sele), autosave[sele]);
			}
		}
		window.wikiCache._defaultNotice();
		window.wikiCache._autoSave();
	},
	_onSubmit: function _onSubmit() {
		window.wikiCache._save();
		var thekey = 'autosave-' + mw.config.get('wgPageName');
		var section = $('input[name="wpSection"]:first').val();
		if (section) {
			thekey += '_' + section;
		}
		if (window.wikiCache._settings['gfw-mode']) {
			$.storage('autosave-' + mw.config.get('wgPageName') + '-pendding-delete', thekey);
		} else {
			$.storage(thekey, null);
		}
	},
	_onComplete: function _onComplete() {
		if (window.wikiCache._settings['gfw-mode']) {
			var thekeykey = 'autosave-' + mw.config.get('wgPageName') + '-pendding-delete';
			var thekey = jQuery.storage(thekeykey);
			if (thekey) {
				var msgs = window.wikiCache._msgs;
				var buttons = {};
				buttons[msgs.delete] = function () {
					$.storage(thekey, null);
					$.storage(thekeykey, null);
					$(this).dialog('close');
				};
				buttons[msgs.ignore] = function () {
					$.storage(thekeykey, null);
					$(this).dialog('close');
				};
				buttons[msgs.load] = function () {
					$.storage(thekeykey, null);
					$(this).dialog('close');
					var autosave = $.storage(thekey);
					window.location = autosave._path + '#wikicache=autoload';
				};
				$('<div class="wikicache-dialog"></div>').attr('title', msgs['pendding-delete']).append($('<p>').html(msgs['pendding-delete-message'])).dialog({
					buttons: buttons,
					draggable: false,
					modal: true,
					width: 450
				});
			}
		}
	},
	// eslint-disable-next-line no-unused-vars
	_saveFailed: function _saveFailed(_silence) {}
};
if ([ 'zh-hant', 'zh-tw', 'zh-hk' ].indexOf(mw.config.get('wgUserVariant')) > -1) {
	$.extend(window.wikiCache._msgs, {
		'no-reminder': '不再提醒',
		'more': '更多資訊',
		'ok': '確認',
		'bracket-left': '（',
		'bracket-right': '）',
		'manage-storage': '管理存檔',
		'not-support': '抱歉，您的瀏覽器無法支援WikiCache，如果您打算使用WikiCache，請升級您的瀏覽器。',
		'not-support-title': '瀏覽器過舊',
		'no-permission': '抱歉，我們檢測到您的瀏覽器禁用了WikiCache所需的功能，如果您要使用WikiCache，請進行相關設置。',
		'no-permission-title': '權限不足',
		'notice-init': '自動存檔已啟用。',
		'notice-more': '設定',
		'notice-autosave-success': '自動存檔成功。',
		'notice-autosave-failed': '自動存檔失敗，可能是由於已超過瀏覽器所許可空間上限',
		'notice-autosave-failed-clear': '清理',
		'notice-load-available': '發現自動存檔，是否載入？',
		'notice-load-available-confirm': '載入',
		'notice-load-available-ignore': '忽略',
		'settings-title': 'WikiCache設定',
		'settings-autosave-interval': '自動保存間隔：',
		'settings-autosave-interval-suffix': '秒',
		'settings-autosave-interval-too-small': '錯誤：「自動保存間隔」所設間隔過小（<10秒），請重新設定',
		'settings-autosave-interval-invalid': '錯誤：請在「自動保存間隔」輸入框輸入數字',
		'settings-gfw-mode': '啟用網路訪問受阻模式'
	});
}
$(window.wikiCache.init);
}(jQuery, mediaWiki));
// </nowiki>
