/**
 * SPDX-License-Identifier: CC BY-SA-4.0
 * addText: '{{Gadget Header|license=CC-BY-4.0}}'
 *
 * @urlhttps://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-Gadget-MediaWiki:Gadget-MarkRights.js
 * @source https://zh.wikipedia.org/w/index.php?oldid=52825311
 * @license <https://creativecommons.org/licenses/by-sa/4.0>
 */
/* eslint-disable no-shadow */
'use strict';

/* 在最近修改、监视列表、条目历史记录等位置以特殊格式显示有特殊权限的用户 */
$(function () {
	var groups = {
		// 全站管理型权限
		'qiuwen': {
			list: [],
			class: 'markrights-qiuwen'
		},
		'steward': {
			list: [],
			class: 'markrights-steward'
		},
		'checkuser': {
			list: [],
			class: 'markrights-checkuser'
		},
		'suppress': {
			list: [],
			class: 'markrights-suppress'
		},
		'sysop': {
			list: [],
			class: 'markrights-sysop'
		},
		'interface-admin': {
			list: [],
			class: 'markrights-interface-admin'
		},
		'templateeditor': {
			list: [],
			class: 'markrights-templateeditor'
		},
		'transwiki': {
			list: [],
			class: 'markrights-transwiki'
		},
		// 页面管理型权限
		'patroller': {
			list: [],
			class: 'markrights-patroller'
		},
		'rollbacker': {
			list: [],
			class: 'markrights-rollbacker'
		},
		'autoreviewer': {
			list: [],
			class: 'markrights-autoreviewer'
		},
		'senioreditor': {
			list: [],
			class: 'markrights-senioreditor'
		},
		// 大量操作型权限
		'eventsponsor': {
			list: [],
			class: 'markrights-eventsponsor'
		},
		'massmessage-sender': {
			list: [],
			class: 'markrights-massmessage-sender'
		},
		// 确认权限
		'confirmed': {
			list: [],
			class: 'markrights-confirmed'
		},
		'autoconfirmed': {
			list: [],
			class: 'markrights-autoconfirmed'
		},
		// 机器权限
		'bot': {
			list: [],
			class: 'markrights-bot'
		},
		'flood': {
			list: [],
			class: 'markrights-flood'
		}
		// IPBE
		// 'ipblock-exempt': {list: [], class: "markrights-ipblock-exempt"},
	};

	var markUG = function markUG() {
		var $users = $('a.mw-userlink:not(.mw-anonuserlink)');
		var users = {};
		$users.each(function (index, link) {
			users[link.textContent] = true;
		});
		var queue1 = [];
		var queue2 = [];
		var i = 0,
			n = 0;
		for (var user in users) {
			if (Object.prototype.hasOwnProperty.call(users, user)) {
				queue1.push(user);
				i++;
				if (i === 50) {
					queue2.push(queue1);
					queue1 = [];
					n++;
					i = 0;
				}
			}
		}
		if (queue1.length > 0) {
			queue2.push(queue1);
			n++;
		}
		var getUsername = function getUsername(url) {
			var username = mw.util.getParamValue('title', url);
			var decode1 = function decode1(a) {
				return decodeURIComponent(function (u) {
					try {
						return decodeURIComponent(u.replace('User:', '').replace(/_/g, ' '));
					} catch (e) {
						return u.replace('User:', '').replace(/_/g, ' ').replace(/%(?!\d+)/g, '%25');
					}
				}(a));
			};
			if (username) {
				return decode1(username);
			}
			username = url.match(/\/wiki\/User:(.+?)$/);
			var decode2 = function decode2(a) {
				return decodeURIComponent(function (u) {
					try {
						return decodeURIComponent(u.replace(/_/g, ' '));
					} catch (e) {
						return u.replace(/_/g, ' ').replace(/%(?!\d+)/g, '%25');
					}
				}(a));
			};
			if (username) {
				return decode2(username[1]);
			}
			return null;
		};
		var done = function done() {
			var group;
			$('a.mw-userlink:not(.mw-anonuserlink)').each(function (_i, el) {
				var username = getUsername($(el).attr('href'));
				if (username) {
					for (group in groups) {
						if (Object.prototype.hasOwnProperty.call(groups, 'group')) {
							if (groups[group].list.indexOf(username) > -1) {
								$(el).append('<sup class="' + groups[group].class + '"></sup>');
							}
						}
					}
				}
			});
		};
		var process = function process(data) {
			var users, group;
			if (data.query && data.query.users) {
				users = data.query.users;
			} else {
				users = [];
			}
			for (var i = 0; i < users.length; i++) {
				var user = users[i];
				if (user.groups) {
					for (group in groups) {
						if (Object.prototype.hasOwnProperty.call(groups, 'group') && user.groups.indexOf(group) > -1) {
							groups[group].list.push(user.name);
						}
					}
				}
			}
			n--;
			if (n <= 0) {
				done();
			}
		};
		var api = new mw.Api();
		for (var j = 0; j < queue2.length; j++) {
			api.get({
				format: 'json',
				action: 'query',
				list: 'users',
				usprop: 'groups',
				ususers: queue2[j].join('|')
			}).done(process);
		}
	};
	mw.hook('wikipage.content').add(function (e) {
		if (e.attr('id') === 'mw-content-text') {
			markUG();
			return;
		}
		if (e.hasClass('mw-changeslist')) {
			markUG();
		}
	});
});
