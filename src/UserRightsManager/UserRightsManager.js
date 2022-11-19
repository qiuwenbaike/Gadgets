/**
 * SPDX-License-Identifier: CC BY-SA-4.0
 * addText: '{{Gadget Header|license=CC-BY-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/mediawiki:gadget-UserRightsManager.js
 * @source https://zh.wikipedia.org/wiki/User:Xiplus/js/userRightsManager.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0>
 * @dependency ext.gadget.SiteCommonJs, ext.gadget.morebits, mediawiki.api, oojs-ui
 */
/* global Morebits */
/* eslint-disable no-extra-boolean-cast */
/* <nowiki> */
// Some UI code adapted from [[User:Mr. Stradivarius/gadgets/Draftify.js]]
// Adapted from https://en.wikipedia.org/wiki/User:MusikAnimal/userRightsManager.js
'use strict';

(function () {
var pagePermissions = {
	'Qiuwen:权限申请/申请巡查回退权': 'patroller',
	'Qiuwen:权限申请/申请巡查豁免权': 'autoreviewer',
	'Qiuwen:权限申请/申请确认用户权': 'confirmed',
	'Qiuwen:权限申请/申请大量消息发送权': 'massmessage-sender',
	'Qiuwen:权限申请/申请活动组织权': 'eventsponsor',
	'Qiuwen:权限申请/申请导入权': 'transwiki',
	'Qiuwen:权限申请/申请模板编辑权': 'templateeditor',
	'Qiuwen:权限申请/申请机器人权限': 'bot'
};
var pageName = mw.config.get('wgPageName');
var permission = pagePermissions[pageName];
if (!permission) {
	return;
}
var permissionNames = {
	'patroller': '巡查员',
	'autoreviewer': '巡查豁免者',
	'confirmed': '确认用户',
	'massmessage-sender': '大量消息发送者',
	'eventsponsor': '活动组织者',
	'transwiki': '导入者',
	'templateeditor': '模板编辑员',
	'bot': '机器人'
};
var templates = {
	'patroller': 'Patrolgranted',
	'autoreviewer': 'Autopatrolgranted',
	'massmessage-sender': 'MMSgranted',
	'templateeditor': 'Template editor granted'
};
var api,
	tagLine = '（使用[[MediaWiki:Gadget-UserRightsManager.js|UserRightsManager]]）',
	permaLink,
	userName,
	dialog;
mw.loader.using([ 'oojs-ui', 'mediawiki.api', 'ext.gadget.morebits' ], function () {
	api = new mw.Api();
	$('.perm-assign-permissions a').on('click', function (e) {
		if (permission === 'AutoWikiBrowser') {
			return true;
		}
		e.preventDefault();
		userName = mw.util.getParamValue('user', $(this).attr('href'));
		showDialog();
	});
});
function showDialog() {
	var Dialog = function Dialog(config) {
		Dialog.super.call(this, config);
	};
	OO.inheritClass(Dialog, OO.ui.ProcessDialog);
	Dialog.static.name = 'user-rights-manager';
	Dialog.static.title = '授予' + permissionNames[permission] + wgULS('给', '給') + userName;
	Dialog.static.actions = [ {
		action: 'submit',
		label: wgULS('授权', '授權'),
		flags: [ 'primary', 'progressive' ]
	}, {
		label: '取消',
		flags: 'safe'
	} ];
	Dialog.prototype.getApiManager = function () {
		return this.apiManager;
	};
	Dialog.prototype.getBodyHeight = function () {
		return 255;
	};
	Dialog.prototype.initialize = function () {
		Dialog.super.prototype.initialize.call(this);
		this.editFieldset = new OO.ui.FieldsetLayout({
			classes: [ 'container' ]
		});
		this.editPanel = new OO.ui.PanelLayout({
			expanded: false
		});
		this.editPanel.$element.append(this.editFieldset.$element);
		var rightLogWapper = $('<span>');
		var url = mw.util.getUrl('Special:Log/rights', {
			type: 'rights',
			page: 'User:' + userName
		});
		$('<a>').text('最近权限日志').attr({
			href: url,
			target: '_blank'
		}).appendTo(rightLogWapper);
		rightLogWapper.append('：');
		var rightLogText = $('<span>').text('获取中').appendTo(rightLogWapper);
		this.rightLog = new OO.ui.LabelWidget({
			label: rightLogWapper
		});
		api.get({
			action: 'query',
			format: 'json',
			list: 'logevents',
			leaction: 'rights/rights',
			letitle: 'User:' + userName,
			lelimit: '1'
		}).done(function (data) {
			var logs = data.query.logevents;
			if (logs.length === 0) {
				rightLogText.text('没有任何日志');
			} else {
				var timestamp = new Morebits.date(logs[0].timestamp).calendar();
				var rights = logs[0].params.newgroups.join('、') || '（无）';
				rightLogText.text(timestamp + ' ' + logs[0].user + '将用户组改为' + rights);
			}
		});
		this.rightsChangeSummaryInput = new OO.ui.TextInputWidget({
			value: '',
			placeholder: '可留空'
		});
		this.expiryInput = new mw.widgets.ExpiryWidget({
			$overlay: $('.oo-ui-window'),
			RelativeInputClass: mw.widgets.SelectWithInputWidget,
			relativeInput: {
				or: true,
				dropdowninput: {
					options: [ {
						data: '1 day',
						label: '1天'
					}, {
						data: '1 week',
						label: '1周'
					}, {
						data: '1 month',
						label: '1个月'
					}, {
						data: '3 months',
						label: '3个月'
					}, {
						data: '6 months',
						label: '6个月'
					}, {
						data: '1 year',
						label: '1年'
					}, {
						data: 'infinite',
						label: '无限期'
					}, {
						data: 'other',
						label: '其他时间'
					} ],
					value: 'infinite'
				},
				textinput: {
					required: true
				}
			}
		});
		this.closingRemarksInput = new OO.ui.TextInputWidget({
			// eslint-disable-next-line no-useless-concat
			value: '{{done}}。~~' + '~~'
		});
		this.watchTalkPageCheckbox = new OO.ui.CheckboxInputWidget({
			selected: false
		});
		this.editFieldset.addItems(this.rightLog);
		var formElements = [ new OO.ui.FieldLayout(this.rightsChangeSummaryInput, {
			label: wgULS('授权原因', '授权原因')
		}), new OO.ui.FieldLayout(this.expiryInput, {
			label: wgULS('结束时间', '結束時間')
		}), new OO.ui.FieldLayout(this.closingRemarksInput, {
			label: wgULS('关闭请求留言', '關閉請求留言')
		}) ];
		if (!!templates[permission]) {
			formElements.push(new OO.ui.FieldLayout(this.watchTalkPageCheckbox, {
				label: wgULS('监视用户讨论页', '監視用戶討論頁')
			}));
		}
		this.editFieldset.addItems(formElements);
		this.submitPanel = new OO.ui.PanelLayout({
			$: this.$,
			expanded: false
		});
		this.submitFieldset = new OO.ui.FieldsetLayout({
			classes: [ 'container' ]
		});
		this.submitPanel.$element.append(this.submitFieldset.$element);
		this.changeRightsProgressLabel = new OO.ui.LabelWidget();
		this.changeRightsProgressField = new OO.ui.FieldLayout(this.changeRightsProgressLabel);
		this.markAsDoneProgressLabel = new OO.ui.LabelWidget();
		this.markAsDoneProgressField = new OO.ui.FieldLayout(this.markAsDoneProgressLabel);
		this.issueTemplateProgressLabel = new OO.ui.LabelWidget();
		this.issueTemplateProgressField = new OO.ui.FieldLayout(this.issueTemplateProgressLabel);
		this.stackLayout = new OO.ui.StackLayout({
			items: [ this.editPanel, this.submitPanel ],
			padded: true
		});
		this.$body.append(this.stackLayout.$element);
	};
	Dialog.prototype.onSubmit = function () {
		var self = this,
			promiseCount = !!templates[permission] ? 3 : 2;
		self.actions.setAbilities({
			submit: false
		});
		var addPromise = function addPromise(field, promise) {
			self.pushPending();
			promise.done(function () {
				field.$field.append($('<span>').text('完成！').css({
					'position': 'relative',
					'top': '0.5em',
					'color': '#009000',
					'font-weight': 'bold'
				}));
			}).fail(function (obj) {
				if (obj && obj.error && obj.error.info) {
					field.$field.append($('<span>').text('错误：' + obj.error.info).css({
						'position': 'relative',
						'top': '0.5em',
						'color': '#cc0000',
						'font-weight': 'bold'
					}));
				} else {
					field.$field.append($('<span>').text('发生未知错误。').css({
						'position': 'relative',
						'top': '0.5em',
						'color': '#cc0000',
						'font-weight': 'bold'
					}));
				}
			}).always(function () {
				promiseCount--; // FIXME: maybe we could use a self.isPending() or something
				self.popPending();
				if (promiseCount === 0) {
					setTimeout(function () {
						location.reload(true);
					}, 1000);
				}
			});
			return promise;
		};
		self.markAsDoneProgressField.setLabel('标记请求为已完成...');
		self.submitFieldset.addItems([ self.markAsDoneProgressField ]);
		self.changeRightsProgressField.setLabel('授予权限...');
		self.submitFieldset.addItems([ self.changeRightsProgressField ]);
		if (!!templates[permission]) {
			self.issueTemplateProgressField.setLabel('发送通知...');
			self.submitFieldset.addItems([ self.issueTemplateProgressField ]);
		}
		addPromise(self.markAsDoneProgressField, markAsDone('\n:' + this.closingRemarksInput.getValue())).then(function (data) {
			addPromise(self.changeRightsProgressField, assignPermission(this.rightsChangeSummaryInput.getValue(), data.edit.newrevid, this.expiryInput.getValue())).then(function () {
				if (!!templates[permission]) {
					addPromise(self.issueTemplateProgressField, issueTemplate(this.watchTalkPageCheckbox.isSelected()));
				}
			}.bind(this));
		}.bind(this));
		self.stackLayout.setItem(self.submitPanel);
	};
	Dialog.prototype.getActionProcess = function (action) {
		return Dialog.super.prototype.getActionProcess.call(this, action).next(function () {
			if (action === 'submit') {
				return this.onSubmit();
			}
			return Dialog.super.prototype.getActionProcess.call(this, action);
		}, this);
	};
	dialog = new Dialog({
		size: 'medium'
	});
	var windowManager = new OO.ui.WindowManager();
	$('body').append(windowManager.$element);
	windowManager.addWindows([ dialog ]);
	windowManager.openWindow(dialog);
}
function assignPermission(summary, revId, expiry) {
	permaLink = '[[Special:PermaLink/' + revId + '#User:' + userName + '|权限申请]]';
	var fullSummary = '+' + permissionNames[permission] + '；' + permaLink;
	if (summary !== '') {
		fullSummary += '；' + summary;
	}
	fullSummary += tagLine;
	return api.postWithToken('userrights', {
		action: 'userrights',
		format: 'json',
		user: userName.replace(/ /g, '_'),
		add: permission,
		reason: fullSummary,
		expiry: expiry === '' ? 'infinity' : expiry
	});
}
function markAsDone(closingRemarks) {
	var sectionNode = document.getElementById('User:' + userName.replace(/"/g, '.22').replace(/ /g, '_')),
		sectionNumber = $(sectionNode).siblings('.mw-editsection').find("a:not('.mw-editsection-visualeditor')").prop('href').match(/section=(\d+)/)[1];
	var basetimestamp, curtimestamp, page, revision, content;
	return api.get({
		action: 'query',
		prop: 'revisions',
		rvprop: [ 'content', 'timestamp' ],
		titles: [ pageName ],
		rvsection: sectionNumber,
		formatversion: '2',
		curtimestamp: true
	}).then(function (data) {
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
		basetimestamp = revision.timestamp;
		curtimestamp = data.curtimestamp;
		content = revision.content;
	}).then(function () {
		content = content.trim();
		content = content.replace(/:{{Status(\|.*?)?}}/i, ':{{Status|+}}');
		content += closingRemarks;
		return api.postWithEditToken({
			action: 'edit',
			title: pageName,
			section: sectionNumber,
			text: content,
			summary: '/* User:' + userName + ' */ 完成' + tagLine,
			formatversion: '2',
			assert: mw.config.get('wgUserName') ? 'user' : undefined,
			basetimestamp: basetimestamp,
			starttimestamp: curtimestamp,
			nocreate: true
		});
	});
}
function issueTemplate(watch) {
	var talkPage = 'User talk:' + userName.replace(/ /g, '_');
	return api.postWithEditToken({
		format: 'json',
		action: 'edit',
		title: talkPage,
		summary: '根据' + permaLink + '授予' + permissionNames[permission] + tagLine,
		appendtext: '\n\n{{subst:' + templates[permission] + '}}',
		watchlist: watch ? 'watch' : 'unwatch'
	});
}
}());
/* </nowiki> */
