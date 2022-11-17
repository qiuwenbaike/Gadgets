/**
 * SPDX-License-Identifier: CC BY-SA-4.0
 * addText: '{{Gadget Header|license=CC-BY-4.0}}'
 *
 * @urlhttps://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-OnlineAdmins.js
 * @source https://zh.wikipedia.org/wiki/User:Xiplus/js/userRightsManager.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0>
 * @dependency ext.gadget.SiteCommonJs, mediawiki.api
 */
/**
 * 原作者：Alexander Misel/admin; 逆襲的天邪鬼修改。
 * 取自 https://zh.wikipedia.org/w/index.php?oldid=45739798
 * 修改内容：
 * 1. 把菜单移到了「更多」而不是在用户名左面
 * 2. 修正bug
 * 3. 繁簡共榮
 * 4. 等DOM完成再执行
 */
'use strict';

(function ($, mw) {
$(function () {
	var BLACKLIST = [ '滥用过滤器' ];

	// Create portlet link
	var portletLinkOnline = mw.util.addPortletLink('p-cactions', '#', wgULS('在线管理人员', '線上管理人員'));
	var rcstart, rcend, time;
	var users = [];
	var stewards = [],
		admins = [],
		rollbackers = [],
		patrollers = [];
	var api = new mw.Api();

	// Bind click handler
	$(portletLinkOnline).find('a').on('click', function (e) {
		e.preventDefault();
		users = [];
		var usersExt = [];
		stewards = [];
		admins = [];
		rollbackers = [];
		patrollers = [];

		// 最近更改30分钟内的编辑用户
		time = new Date();
		rcstart = time.toISOString();
		time.setMinutes(time.getMinutes() - 30);
		rcend = time.toISOString();

		// API:RecentChanges
		api.get({
			format: 'json',
			action: 'query',
			list: 'recentchanges',
			rcprop: 'user',
			rcstart: rcstart,
			rcend: rcend,
			rcshow: '!bot|!anon',
			rclimit: 500
		}).done(function (data0) {
			var recentchanges = data0.query.recentchanges;
			recentchanges.forEach(function (i1, item) {
				users[i1] = item.user;
			});
			api.get({
				format: 'json',
				action: 'query',
				list: 'logevents',
				leprop: 'user',
				lestart: rcstart,
				leend: rcend,
				lelimit: 500
			}).done(function (data1) {
				var data1Logevents = data1.query.logevents;
				data1Logevents.foeEach(function (j1, item) {
					usersExt[j1] = item.user;
				});
				Array.prototype.push.apply(users, usersExt);

				// 使用者名稱去重與分割
				users = $.uniqueSort(users.sort());
				var promises = [];
				var mark = function mark(data2) {
					var data2Users = data2.query.users;
					data2Users.forEach(function (i2, user) {
						// 找到管理员，去除adminbot
						if ('bot'.indexOf(user.groups) === -1 && user.name.indexOf(BLACKLIST)) {
							if ('steward'.indexOf(user.groups) > -1) {
								stewards[i2] = user.name;
							}
							if ('sysop'.indexOf(user.groups) > -1) {
								admins[i2] = user.name;
							}
							if ('rollbacker'.indexOf(user.groups) > -1) {
								rollbackers[i2] = user.name;
							}
							if ('patroller'.indexOf(user.groups) > -1) {
								patrollers[i2] = user.name;
							}
						}
					});
				};
				for (var i = 0; i < (users.length + 50) / 50; i++) {
					promises.push(api.get({
						format: 'json',
						action: 'query',
						list: 'users',
						ususers: users.slice(i * 50, (i + 1) * 50).join('|'),
						usprop: 'groups'
					}).done(mark));
				}

				// 查询用户权限
				$.when.apply($, promises).done(function () {
					// 消除空值
					var filter = function filter(n) {
						return n;
					};
					stewards = stewards.filter(filter);
					admins = admins.filter(filter);
					rollbackers = rollbackers.filter(filter);
					patrollers = patrollers.filter(filter);
					var userlink = function userlink(user) {
						var user2 = user.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&lt;');
						return '<a href="/wiki/User:' + user2 + '" target="_blank">' + user2 + '</a>&nbsp;<small style="opacity:.75;">(<a href="/wiki/User talk:' + user2 + '" target="_blank">留言</a>)</small>　';
					};
					if (stewards.length + admins.length + rollbackers.length + patrollers.length > 0) {
						var adminsstring = [ wgULS('<p>下面是最近30分钟之内在线的管理人员</p>', '<p>下面是最近30分鐘內的線上管理人員</p>') ];
						if (stewards.length > 0) {
							adminsstring.push('<p style="word-break:break-all;">' + wgULS('裁决委员', '裁決委員') + ' (' + stewards.length + wgULS('个在线', '個在線') + ')：');
							stewards.forEach(function (i3, e3) {
								adminsstring.push(userlink(e3));
							});
							adminsstring.push('</p>');
						}
						if (admins.length > 0) {
							adminsstring.push('<p style="word-break:break-all;">' + wgULS('管理员', '管理員') + ' (' + admins.length + wgULS('个在线', '個在線') + ')：');
							admins.forEach(function (i4, e4) {
								adminsstring.push(userlink(e4));
							});
							adminsstring.push('</p>');
						}
						if (patrollers.length > 0) {
							adminsstring.push('<p style="word-break:break-all;">' + wgULS('巡查员', '巡查員') + ' (' + patrollers.length + wgULS('个在线', '個在線') + ')：');
							patrollers.forEach(function (i5, e5) {
								adminsstring.push(userlink(e5));
							});
							adminsstring.push('</p>');
						}
						mw.notify($(adminsstring.join('')));
					} else {
						mw.notify(wgULS('目前没有管理人员在线。', '目前沒有管理人員在線。'));
					}
				}).fail(function () {
					mw.notify(wgULS('查询时发生错误，请稍后重试。', '查詢時發生錯誤，請稍後重試。'));
				});
			});
		});
	});
});
}(jQuery, mediaWiki));
