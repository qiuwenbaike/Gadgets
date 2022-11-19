/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-Popups.js
 * @source https://zh.wikipedia.org/w/index.php?title=MediaWiki:Gadget-popups.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0>
 */
'use strict';

(function ($, mw) {
// The following translated strings is based on https://en.wikipedia.org/w/index.php?title=User:Lupin/strings-draft&oldid=579996170
// This can help sysops to manage this Gadget, so please update this every fetch from [[en:User:Lupin/strings-draft]]

// <pre><nowiki>
// ////////////////////////////////////////////////
// Translatable strings
// ////////////////////////////////////////////////
//
// See instructions at
// http://en.wikipedia.org/wiki/Wikipedia:Tools/Navigation_popups/Translation
window.popupStrings = {
	// ///////////////////////////////////
	// summary data, searching etc.
	// ///////////////////////////////////
	'article': wgULS('条目', '條目'),
	'category': wgULS('个分类', '个分類'),
	'categories': wgULS('个分类', '个分類'),
	'image': wgULS('个文件', '个檔案'),
	'images': wgULS('个文件', '个檔案'),
	'stub': wgULS('小作品', '小作品'),
	'section stub': wgULS('小章节', '小章節'),
	'Empty page': wgULS('空页面', '空頁面'),
	'kB': wgULS('千字节<sub>（以1000为一进）</sub>', '千位元組<sub>（以1000為一進）</sub>'),
	'bytes': wgULS('字节', '位元組'),
	'day': wgULS('天', '天'),
	'days': wgULS('天', '天'),
	'hour': wgULS('小时', '小時'),
	'hours': wgULS('小时', '小時'),
	'minute': wgULS('分', '分'),
	'minutes': wgULS('分', '分'),
	'second': wgULS('秒', '秒'),
	'seconds': wgULS('秒', '秒'),
	'week': wgULS('周', '周'),
	'weeks': wgULS('周', '周'),
	'month': wgULS('月', '月'),
	'months': wgULS('月', '月'),
	'year': wgULS('年', '年'),
	'years': wgULS('年', '年'),
	'search': wgULS('搜索', '搜尋'),
	'SearchHint': wgULS('搜索包含 %s 的页面', '搜尋包含 %s 的頁面'),
	'web': 'Google',
	'global': wgULS('全域', '全域'),
	'more...': wgULS('更多……', '更多……'),
	// ///////////////////////////////////
	// article-related actions and info
	// (some actions also apply to user pages)
	// ///////////////////////////////////
	'actions': wgULS('操作', '動作'),
	// /// view articles and view talk
	'popupsMenu': wgULS('Popups', 'Popups'),
	'disable previews': wgULS('禁用预览', '禁用預覽'),
	'togglePreviewsHint': wgULS('切换本页 Popups 的预览开关', '切換本頁 Popups 的預覽開關'),
	'toggle previews': wgULS('切换预览开关', '切換預覽開關'),
	'reset': wgULS('复位', '複位'),
	'disable': wgULS('禁用 Popups', '禁用 Popups'),
	'disablePopupsHint': wgULS('在本页禁用 Popups，刷新页面以重新启用。', '在本頁禁用 Popups，重新整理頁面以重新啟用。'),
	'purgePopupsHint': wgULS('复位 Popups，清除所有缓存数据。', '複位 Popups，清除所有快取資料。'),
	'PopupsHint': wgULS('复位 Popups，清除所有缓存数据。', '複位 Popups，清除所有快取資料。'),
	'spacebar': wgULS('空格', '空格'),
	'view': wgULS('查看', '檢視'),
	'view article': wgULS('查看条目', '檢視條目'),
	'viewHint': wgULS('前往 %s', '前往 %s'),
	'talk': wgULS('讨论', '討論'),
	'talk page': wgULS('讨论页', '討論頁'),
	'this&nbsp;revision': wgULS('此修订版本', '此修訂版本'),
	'revision %s of %s': wgULS('页面 $2 的修订版本 $1', '頁面 $2 的修訂版本 $1'),
	'Revision %s of %s': wgULS('页面 $2 的修订版本 $1', '頁面 $2 的修訂版本 $1'),
	'the revision prior to revision %s of %s': wgULS('页面 $2 的修订版本 $1 之前的修订版本', '頁面 $2 的修訂版本 $1 之前的修訂版本'),
	'Toggle image size': wgULS('点击切换图片大小', '點擊切換圖片大小'),
	'del': wgULS('删除', '删除'),
	// /// delete, protect, move
	'delete': wgULS('删除', '删除'),
	'deleteHint': wgULS('删除 %s', '删除 %s'),
	'undeleteShort': wgULS('恢复', '恢復'),
	'UndeleteHint': wgULS('恢复 %s', '恢復 %s'),
	'protect': wgULS('保护', '保護'),
	'protectHint': wgULS('保护 %s', '保護 %s'),
	'unprotectShort': wgULS('解除', '解除'),
	'unprotectHint': wgULS('解除对 %s 的保护', '解除對 %s 的保護'),
	'move': wgULS('移动', '移動'),
	'move page': wgULS('移动页面', '移動頁面'),
	'MovepageHint': wgULS('修改 %s 的标题', '修改 %s 的標題'),
	'edit': wgULS('编辑', '編輯'),
	// /// edit articles and talk
	'edit article': wgULS('编辑条目', '編輯條目'),
	'editHint': wgULS('修改 %s 的内容', '修改 %s 的內容'),
	'edit talk': wgULS('编辑讨论页', '編輯對話頁', null, null, '編輯討論頁'),
	'new': wgULS('新', '新'),
	'new topic': wgULS('新话题', '新話題'),
	'newSectionHint': wgULS('在 %s 增加新的讨论话题', '在 %s 增加新的討論話題'),
	'null edit': wgULS('空编辑', '空編輯'),
	'nullEditHint': wgULS('进行一次对 %s 的空编辑', '製造一次對 %s 的空編輯'),
	'hist': wgULS('历史', '歷史'),
	// /// history, diffs, editors, related
	'history': wgULS('历史', '歷史'),
	'historyHint': wgULS('%s 的修订历史', '%s 的修訂歷史'),
	'last': wgULS('之前', '之前'),
	// [[MediaWiki:Last]]
	'lastEdit': wgULS('最近更改', '最近更改'),
	'show last edit': wgULS('最近一次更改', '最新一次修訂'),
	'Show the last edit': wgULS('显示最近一次更改的差异', '顯示最新一次修訂的差異'),
	'lastContrib': wgULS('最近编辑', '最近編輯'),
	'last set of edits': wgULS('最近编辑', '最近編輯'),
	'lastContribHint': wgULS('显示由最后一位编辑者造成的差异', '顯示由最後一位編輯者製造的差異'),
	'cur': wgULS('当前', '當前'),
	'diffCur': wgULS('与当前版本的差异', '與目前版本的差異'),
	'Show changes since revision %s': wgULS('显示自修订版本 %s 的差异', '顯示自修訂版本 %s 的差異'),
	'%s old': wgULS('%s 前的最后版本', '%s 前的最后版本'),
	// as in 4 weeks old
	'oldEdit': wgULS('旧编辑', '舊編輯'),
	'purge': wgULS('清除缓存', '清除快取'),
	'purgeHint': wgULS('清除服务器中 %s 的缓存', '清除伺服器中 %s 的快取'),
	'raw': wgULS('源代码', '原始碼'),
	'rawHint': wgULS('查看 %s 的源代码', '檢視 %s 的原始碼'),
	'render': wgULS('仅正文', '僅正文'),
	'renderHint': wgULS('显示 %s 的纯HTML解析（仅正文内容）', '顯示 %s 的純HTML解析（僅正文內容）'),
	'Show the edit made to get revision': wgULS('显示编辑以得到修订版本', '顯示編輯以得到修訂版本'),
	'sinceMe': wgULS('自我', '自我'),
	'changes since mine': wgULS('自我修订的差异', '自我修訂的差異'),
	'sinceMeHint': wgULS('显示自我上次修改以来的差异', '顯示自我上次修改以來的差異'),
	"Couldn't find an edit by %s\nin the last %s edits to\n%s": wgULS('在 $3 最近 $2 次编辑中找不到 $1 做出的修改', '在 $3 最近 $2 次編輯中找不到 $1 做出的修改'),
	'eds': wgULS('编辑', '編輯'),
	'editors': wgULS('编辑者', '編輯者'),
	'editorListHint': wgULS('列出编辑过 %s 的用户', '列出編輯過 %s 的使用者', null, null, '列出編輯過 %s 的用戶'),
	'related': wgULS('相关', '相關'),
	'relatedChanges': wgULS('相关更改', '相關更改'),
	'related changes': wgULS('相关更改', '相關更改'),
	'RecentchangeslinkedHint': wgULS('显示相关 %s 的修改', '顯示相關 %s 的修改'),
	'editOld': wgULS('编辑旧版', '編輯舊版'),
	// /// edit old version, or revert
	'rv': wgULS('回退', '恢復'),
	'revert': wgULS('回退', '恢復'),
	'revertHint': wgULS('回退到 %s', '恢復到 %s'),
	'undo': wgULS('撤销', '撤銷'),
	'undoHint': wgULS('撤销这次编辑', '撤銷這次編輯'),
	'defaultpopupRedlinkSummary': wgULS('移除到空页面[[%s]]的链接 —— Popups', '移除到空頁面[[%s]]的連結 —— Popups'),
	'defaultpopupFixDabsSummary': wgULS('消歧义[[%s]]到[[%s]] —— Popups', '消歧義[[%s]]到[[%s]] —— Popups'),
	'defaultpopupFixRedirsSummary': wgULS('忽略从[[%s]]到[[%s]]的重定向 —— Popups', '忽略從[[%s]]到[[%s]]的重新導向 —— Popups'),
	'defaultpopupExtendedRevertSummary': wgULS('回退到$2在$1时编辑的修订版本$3 —— Popups', '還原到$2在$1時製作的修訂版本$3 —— Popups'),
	'defaultpopupRevertToPreviousSummary': wgULS('回退到修订版本%s的上一个版本 —— Popups', '還原到修訂版本%s的上一個版本 —— Popups'),
	'defaultpopupRevertSummary': wgULS('回退到修订版本%s —— Popups', '還原到修訂版本%s —— Popups'),
	'defaultpopupQueriedRevertToPreviousSummary': wgULS('回退到修订版本$1的上一个版本，由$3在$2时编辑 —— Popups', '還原到修訂版本$1的上一個版本，由$3在$2時製作 —— Popups'),
	'defaultpopupQueriedRevertSummary': wgULS('回退到$3在$2时编辑的修订版本$1 —— Popups', '還原到$3在$2時製作的修訂版本$1 —— Popups'),
	'defaultpopupRmDabLinkSummary': wgULS('移除到消歧义页[[%s]]的链接 —— Popups', '移除到消歧義頁[[%s]]的連結 —— Popups'),
	'Redirects': wgULS('重定向', '重定向'),
	// as in Redirects to ...
	// " to ": wgULS("到", "到"),
	// as in Redirects to ...
	'Bypass redirect': wgULS('忽略重定向', '忽略重新導向'),
	'Fix this redirect': wgULS('修复重定向', '修復重新導向'),
	'disambig': wgULS('消歧义', '消歧義'),
	// /// add or remove dab etc.
	'disambigHint': wgULS('消歧义这个链接到 [[%s]]', '消歧義這個連結到 [[%s]]'),
	'Click to disambiguate this link to:': wgULS('点击以消歧义这个链接到：', '點擊以消歧義這個連結到：'),
	'remove this link': wgULS('移除链接', '移除連結'),
	'remove all links to this page from this article': wgULS('移除此条目到这页的所有链接', '移除此條目到這頁的所有連結'),
	'remove all links to this disambig page from this article': wgULS('移除此条目到这消歧义的所有链接', '移除此條目到這消歧義的所有連結'),
	'mainlink': wgULS('主链接', '主連結'),
	// /// links, watch, unwatch
	'wikiLink': wgULS('个内部链接', '个內部連結'),
	'wikiLinks': wgULS('个内部链接', '个內部連結'),
	'links here': wgULS('链入', '鏈入'),
	'whatLinksHere': wgULS('链入页面', '鏈入頁面'),
	'what links here': wgULS('链入页面', '鏈入頁面'),
	'WhatlinkshereHint': wgULS('显示链接到 %s 的页面', '顯示連結到 %s 的頁面'),
	'unwatchShort': wgULS('取消', '取消'),
	'watchThingy': wgULS('监视', '監視'),
	// called watchThingy because {}.watch is a function
	'watchHint': wgULS('加入 %s 到我的监视列表', '加入 %s 到我的監視列表'),
	'unwatchHint': wgULS('从我的监视列表移除 %s', '從我的監視列表移除 %s'),
	'Only found one editor: %s made %s edits': wgULS('仅找到一位编者：%s 制造了 %s 次编辑', '僅找到一位編者：%s 製造了 %s 次編輯'),
	'%s seems to be the last editor to the page %s': wgULS('%s 看上去是 %s 这页的最后一位编者', '%s 看上去是 %s 這頁的最後一位編者'),
	'rss': wgULS('RSS', 'RSS'),
	// ///////////////////////////////////
	// diff previews
	// ///////////////////////////////////
	'Diff truncated for performance reasons': wgULS('出于性能考虑，差异已被截断', '出於效能考慮，差異已被截斷'),
	'Old revision': wgULS('旧版本', '舊版本'),
	'New revision': wgULS('新版本', '新版本'),
	'Something went wrong :-(': wgULS('出问题了 :-(', '出問題了 :-('),
	'Empty revision, maybe non-existent': wgULS('空的修订，可能并不存在', '空的修訂，可能並不存在'),
	'Unknown date': wgULS('未知日期', '未知日期'),
	// ///////////////////////////////////
	// other special previews
	// ///////////////////////////////////
	'Empty category': wgULS('空的分类', '空的分類'),
	'Category members (%s shown)': wgULS('分类成员（%s 显示）', '分類成員（%s 顯示）'),
	'No image links found': wgULS('未找到文件链接', '未找到檔案連結'),
	'File links': wgULS('文件链接', '檔案連結'),
	'not commons': wgULS('维基共享中无此名称的文件。', '維基共享中無此名稱的檔案。'),
	'commons only': wgULS('此文件来自维基共享。', '此檔案來自維基共享。'),
	'No image found': wgULS('找不到文件', '找不到檔案'),
	'commons dupe': wgULS('维基共享中存在此文件的副本。', '維基共享中存在此檔案的副本。'),
	'commons conflict': wgULS('维基共享中存在此文件名称不同的副本。', '維基共享中存在此檔名稱不同的副本。'),
	// ///////////////////////////////////
	// user-related actions and info
	// ///////////////////////////////////
	'user': wgULS('用户', '使用者', null, null, '用戶'),
	// /// user page, talk, email, space
	'user&nbsp;page': wgULS('用户页', '使用者頁', null, null, '用戶頁'),
	'user talk': wgULS('用户讨论', '使用者對話', null, null, '用戶討論'),
	'edit user talk': wgULS('编辑用户讨论', '編輯使用者對話', null, null, '編輯用戶討論'),
	'leave comment': wgULS('留言', '留言'),
	'email': wgULS('电邮', '電郵'),
	'email user': wgULS('电邮用户', '電郵使用者'),
	'EmailuserHint': wgULS('给 %s 发送电子邮件', '給 %s 發送電子郵件'),
	'space': wgULS('子页面', '子頁面'),
	// short form for userSpace link
	'PrefixindexHint': wgULS('显示 %s 的用户页子页面', '顯示 %s 的使用者頁子頁面', null, null, '顯示 %s 的用戶頁子頁面'),
	'count': wgULS('统计', '統計'),
	// /// contributions, tree, log
	'edit counter': wgULS('编辑次数', '編輯次數'),
	'katelinkHint': wgULS('%s 的编辑次数', '%s 的編輯次數'),
	'contribs': wgULS('贡献', '貢獻'),
	'contributions': wgULS('贡献', '貢獻'),
	'deletedContribs': wgULS('已删除的贡献', '已刪除的貢獻'),
	'ContributionsHint': wgULS('%s 的用户贡献', '%s 的使用者貢獻', null, null, '%s 的用戶貢獻'),
	'tree': wgULS('树', '樹'),
	'contribsTreeHint': wgULS('根据名字空间查看 %s 的贡献', '根據命名空間檢視 %s 的貢獻'),
	'log': wgULS('日志', '日誌'),
	'user log': wgULS('用户日志', '使用者日誌', null, null, '用戶日誌'),
	'userLogHint': wgULS('显示 %s 的用户日志', '顯示 %s 的使用者日誌', null, null, '顯示 %s 的用戶日誌'),
	'arin': wgULS('ARIN 查询', 'ARIN 查詢'),
	// /// ARIN lookup, block user or IP
	'Look up %s in ARIN whois database': wgULS('在 ARIN Whois 数据库中查询 %s', '在 ARIN Whois 數據庫中查詢 %s'),
	'unblockShort': wgULS('解除', '解除'),
	'block': wgULS('封禁', '封鎖'),
	'block user': wgULS('封禁用户', '封鎖使用者', null, null, '封鎖用戶'),
	'IpblocklistHint': wgULS('解封 %s', '解封 %s'),
	'BlockipHint': wgULS('封禁 %s', '封鎖 %s'),
	'block log': wgULS('封禁日志', '封鎖日誌'),
	'blockLogHint': wgULS('显示 %s 的封禁日志', '顯示 %s 的封鎖日誌'),
	'protectLogHint': wgULS('显示 %s 的保护日志', '顯示 %s 的保護日誌'),
	'pageLogHint': wgULS('显示 %s 的日志', '顯示 %s 的日誌'),
	'deleteLogHint': wgULS('显示 %s 的删除日志', '顯示 %s 的刪除日誌'),
	'Invalid %s %s': wgULS('选项 %s 不可用：%s', '選項 %s 不可用：%s'),
	'm': wgULS('小', '小'),
	// ///////////////////////////////////
	// Autoediting
	// ///////////////////////////////////
	'Enter a non-empty edit summary or press cancel to abort': wgULS('输入编辑摘要，或按取消中止操作', '輸入編輯摘要，或按取消中止操作'),
	'Failed to get revision information, please edit manually.\n\n': wgULS('获取修订版本信息失败，请手动修改。\n\n', '獲取修訂版本資訊失敗，請手動修改。\n\n'),
	'The %s button has been automatically clicked. Please wait for the next page to load.': wgULS('按钮 %s 已被自动点击，请等待下一个页面加载。', '按鈕 %s 已被自動點擊，請等待下一個頁面載入。'),
	'Could not find button %s. Please check the settings in your javascript file.': wgULS('找不到按钮 %s，请检查您 JavaScript 文件中的设置。', '找不到按鈕 %s，請檢查您 JavaScript 檔案中的設定。'),
	// ///////////////////////////////////
	// Popups setup
	// ///////////////////////////////////
	'Open full-size image': wgULS('查看全尺寸图像', '檢視全尺寸影像'),
	'zxy': wgULS('zxy', 'zxy'),
	// ///////////////////////////////////
	// 以下内容由 [[User:AnnAngela]] 补正
	// ///////////////////////////////////
	'globalSearchHint': wgULS('在维基百科其他语言搜索“%s”', '在維基百科其他語言搜尋「%s」'),
	'googleSearchHint': wgULS('在 Google 上搜索“%s”', '在 Google 上搜尋「%s」'),
	'enable previews': wgULS('启用预览', '啟用預覽'),
	'show preview': wgULS('禁用预览', '禁用預覽'),
	'historyfeedHint': wgULS('该页面的近期更改 RSS feed', '該頁面的近期更改 RSS feed'),
	'send thanks': wgULS('发送感谢', '傳送感謝'),
	'ThanksHint': wgULS('向该用户发送一封感谢消息', '向該使用者傳送一封感謝訊息'),
	'mark patrolled': wgULS('标记为已巡查', '標記為已巡查'),
	'markpatrolledHint': wgULS('标记该编辑为已巡查', '標記該編輯為已巡查'),
	'Could not marked this edit as patrolled': wgULS('无法标记该编辑为已巡查', '無法標記該編輯為已巡查'),
	'defaultpopupReviewedSummary': wgULS('标记从版本%s到%s间的编辑为已巡查', '標記從版本%s到%s間的編輯為已巡查'),
	'Image from Commons': wgULS('来自维基共享的图片', '來自維基共用的圖片'),
	'Description page': wgULS('图片描述页', '圖片描述頁'),
	'Alt text:': wgULS('替换文本（Alt）：', '替換文字（Alt）：'),
	'revdel': wgULS('历史版本被隐藏', '歷史版本被隱藏'),
	'editCounterLinkHint': wgULS('用户%s的编辑次数', '使用者%s的編輯次數'),
	'DeletedcontributionsHint': wgULS('用户%s的被删除编辑次数', '使用者%s的被刪除編輯次數'),
	'No backlinks found': wgULS('找不到链入页面', '找不到鏈入頁面'),
	' and more': wgULS('以及其他页面', '以及其他頁面'),
	'Download preview data': wgULS('下载预览数据', '下載預覽資料'),
	'Invalid or IP user': wgULS('错误的用户名或IP用户', '錯誤的使用者名稱或IP使用者'),
	'Not a registered username': wgULS('非已注册的用户', '非已註冊的使用者'),
	'BLOCKED': wgULS('被封禁', '被封鎖'),
	'Has blocks': wgULS('被部分封禁', '被部分封鎖'),
	' edits since: ': wgULS('次编辑，注册日期为', '次編輯，註冊日期為'),
	'last edit on ': wgULS('最后一次编辑于', '最後一次編輯於'),
	'EmailUserHint': wgULS('给 %s 发送电子邮件', '給 %s 發送電子郵件'),
	'RANGEBLOCKED': wgULS('IP段被封禁', 'IP段被封鎖'),
	'IP user': wgULS('IP用户', 'IP使用者'),
	'♀': '♀',
	'♂': '♂',
	'HIDDEN': wgULS('全域隐藏', '全域隱藏'),
	'LOCKED': wgULS('全域锁定', '全域鎖定'),
	'Invalid user': wgULS('非法用户名', '非法使用者名稱'),
	'diff': wgULS('差异', '差異'),
	' to ': wgULS('至', '至'),
	'autoedit_version': 'np20140416',
	'PrefixIndexHint': wgULS('显示用户%s的子页面', '顯示使用者%s的子頁面', null, null, '顯示用戶%s的子頁面'),
	'nullEditSummary': wgULS('进行一次零编辑', '進行一次零編輯'),
	// 用户组名称从系统消息获取
	'group-no-autoconfirmed': wgULS('非自动确认用户', '非自動確認使用者', null, null, '非自動確認用戶'),
	'separator': '、',
	'comma': '，'
};
/* </nowiki> */</pre>

mw.loader.load('/index.php?title=MediaWiki:Gadget-popups-main.js&action=raw&ctype=text/javascript&smaxage=3600&maxage=3600');
}(jQuery, mediaWiki));
