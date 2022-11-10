/* eslint-disable camelcase */
/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-SpecialWikitext.js
 * @source https://zh.wikipedia.org/wiki/MediaWiki:Gadget-SpecialWikitext.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 * @dependency ext.gadget.SiteCommonJs, mediawiki.api
 */
'use strict';

// Polyfill
// eslint-disable-next-line no-implicit-globals
function _typeof(obj) {
	'@babel/helpers - typeof';

	// eslint-disable-next-line no-return-assign, no-func-assign, no-undef, no-shadow
	return _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) {
		return typeof obj;
		// eslint-disable-next-line no-shadow
	} : function (obj) {
		// eslint-disable-next-line no-undef
		return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
		// eslint-disable-next-line no-sequences
	}, _typeof(obj);
}

// <nowiki>
(function ($, mw) {
/* 跟[[Module:Special wikitext]]保持一致的段落。 */

var wikiTextKey = '_addText';
function lua_check(input_string, content_model) {
	// 使用頁面內容模型來判斷格式
	var contentModel = (content_model || mw.config.get('wgPageContentModel')).toString().toLowerCase();
	// 根據文檔格式選用適當的解析模式
	switch (contentModel) {
		case 'json':
			return lua_getJSONwikitext(input_string);
		case 'js':
		case 'javascript':
		case 'text':
			return lua_getJSwikitext(input_string);
		case 'css':
		case 'sanitized-css':
			return lua_getCSSwikitext(input_string);
		default:
			// 若不是json、js、css則返回空字串
			return '';
	}
}
// 合併多個wikitext字串，並以換行分隔
function lua_addText(input_str, new_str, _escape) {
	var input_string = input_str;
	if (new_str !== '') {
		if (input_string !== '') {
			input_string += '\n';
		}
		var text = new_str;
		if (_escape) {
			var escape_str = JSON.parse('[' + JSON.stringify(
				// Lua不支援\u、\x的跳脫符號；排除相關轉換
				new_str.toString().replace(/\\([ux])/ig, '$1')).replace(/\\\\/g, '\\') + ']')[0];
			text = escape_str;
		}
		input_string += text;
	}
	return input_string;
}
// 讀取wikitext字串，並忽略註解尾部
function lua_getString(str) {
	var test_str = /[^\n]*\*\//.exec(str);
	if (test_str) {
		test_str = test_str[0] || '';
		test_str = test_str.slice(0, Math.max(0, test_str.length - 2));
	} else {
		test_str = str;
	}
	var trim_check = test_str.trim();
	var first_char = trim_check.charAt(0);
	if (first_char === trim_check.charAt(trim_check.length - 1) && (first_char === "'" || first_char === '"')) {
		return trim_check.slice(1, 1 + trim_check.length - 2);
	}
	return test_str;
}
// 讀取CSS之 ＿addText  { content："XXX" } 模式的字串
function lua_getContentText(str) {
	var wikitext = '';
	try {
		str.replace(new RegExp(wikiTextKey + '\\s*\\{[^c\\}]*content\\s*:\\s*[^\n]*', 'g'), function (text) {
			var temp_text = (/content\s*:\s*[^\n]*/.exec(text) || [ 'content:' ])[0].replace(/^[\s\uFEFF\xA0\t\r\n\f ;}]+|[\s\uFEFF\xA0\t\r\n\f ;}]+$/g, '').replace(/\s*content\s*:\s*/, '');
			if (wikitext !== '') {
				wikitext += '\n';
			}
			wikitext += lua_getString(temp_text);
			return text;
		});
	} catch (ex) {
		return '';
	}
	return wikitext;
}
// 讀取物件定義模式為 ＿addText＝XXX 或 ＿addText：XXX 模式的字串 (註解全形避免被抓取)
function lua_getObjText(str) {
	var wikitext = '';
	try {
		str.replace(new RegExp(wikiTextKey + '\\s*[\\=:]\\s*[^\n]*', 'g'), function (text) {
			var temp_text = text.replace(/^[\s\uFEFF\xA0\t\r\n\f ;}]+|[\s\uFEFF\xA0\t\r\n\f ;}]+$/g, '').replace(new RegExp(wikiTextKey + '\\s*[\\=:]\\s*'), '');
			if (wikitext !== '') {
				wikitext += '\n';
			}
			wikitext += lua_getString(temp_text);
			return text;
		});
	} catch (ex) {
		return '';
	}
	return wikitext;
}
// 分析CSS中符合條件的wikitext
function lua_getCSSwikitext(input_string) {
	var wikitext = '';
	var css_text = input_string || $('#wpTextbox1').val() || '';
	if (css_text.trim() === '') {
		return '';
	}
	// 匹配 ＿addText { content："XXX" } 模式
	wikitext = lua_addText(wikitext, lua_getContentText(css_text), true);
	// 同時亦匹配 /* ＿addText：XXX */ 模式
	wikitext = lua_addText(wikitext, lua_getObjText(css_text), true);
	return wikitext;
}
// 分析JavaScript中符合條件的wikitext
function lua_getJSwikitext(input_string) {
	var wikitext = '';
	var js_text = input_string || $('#wpTextbox1').val() || '';
	if (js_text.trim() === '') {
		return '';
	}
	wikitext = lua_addText(wikitext, lua_getObjText(js_text), true);
	return wikitext;
}
// 分析JSON中符合條件的wikitext
function lua_getJSONwikitext(input_string) {
	var wikitext = '';
	var json_text = input_string || $('#wpTextbox1').val() || '';
	if (json_text.trim() === '') {
		return '';
	}
	try {
		var json_data = JSON.parse(json_text);
		// for (var key in json_data) {
		// 	if (Object.prototype.hasOwnProperty.call(json_data, key)) {
		// 		var k = key,
		// 			v = json_data[key];
		// 		if (new RegExp(wikiTextKey).exec(k) && _typeof(v) === _typeof('')) {
		// 			wikitext = lua_addText(wikitext, v);
		// 		}
		// 		// 如果是陣列物件會多包一層
		// 		if (_typeof(v) !== _typeof('')) {
		// 			for (var prop in v) {
		// 				if (Object.hasOwnProperty.call(v, prop)) {
		// 					var testArr_k = prop,
		// 						testArr_v = v[prop];
		// 					if (new RegExp(wikiTextKey).exec(testArr_k) && _typeof(testArr_v) === _typeof('')) {
		// 						wikitext = lua_addText(wikitext, testArr_v);
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// }
		Object.keys(json_data).forEach(function (key) {
			var k = key, v = json_data[key];
			if (new RegExp(wikiTextKey).exec(k) && typeof v === typeof '')	{
				wikitext = lua_addText(wikitext, v);
			}
			// 如果是陣列物件會多包一層
			if (typeof v !== typeof '') {
				for (var prop in v) {
					if (Object.hasOwnProperty.call(v, prop)) {
						var testArr_k = prop, testArr_v = v[prop];
						if (new RegExp(wikiTextKey).exec(testArr_k) && typeof testArr_v === typeof '') {
							wikitext = lua_addText(wikitext, testArr_v);
						}
					}
				}
			}
		});
	} catch (ex) {
		return '';
	}
	return wikitext;
}
// 本行以上的算法請跟[[Module:Special wikitext]]保持一致。

/* 程式主要部分 */
function previewTool() {
	// 各類提示文字
	var mwapi = new mw.Api({
		ajax: {
			headers: {
				'Api-User-Agent': 'SpecialWikitext/1.0 (' + mw.config.get('wgWikiID') + ')'
			}
		}
	});
	var $notice_addText = '{{Special_wikitext/notice}}';
	// {{Quote box |quote  = -{zh-hans:预览加载中;zh-hant:預覽載入中;}-... |width  = 50% |align  = center}}
	var $notice_loading = '<div id="mw-_addText-preview-loading"><div class="quotebox" style="margin: auto; width: 50%; padding: 6px; border: 1px solid #aaa; font-size: 88%; background-color: #F9F9F9;"><div id="mw-_addText-preview-loading-content" style="background-color: #F9F9F9; color: black; text-align: center; font-size: larger;"><img src="//upload-mirror.qiuwenbaike.cn/wikipedia/commons/d/de/Ajax-loader.gif" decoding="async" data-file-width="32" data-file-height="32" width="32" height="32"> ' + wgULS('预览加载中...', '預覽載入中...') + ' </div></div></div>';
	// [[File:Gnome-dialog-warning2.svg|32px]] -{zh-hans:预览加载失败;zh-hant:預覽載入失敗;}-
	var $notice_fail = '<img src="https://upload.qiuwenbaike.cn/images/thumb/8/8f/Alert_Mark_%28Orange%29.svg/32px-Alert_Mark_%28Orange%29.svg.png" decoding="async" srcset="https://upload.qiuwenbaike.cn/images/thumb/8/8f/Alert_Mark_%28Orange%29.svg/48px-Alert_Mark_%28Orange%29.svg.png 1.5x, https://upload.qiuwenbaike.cn/images/thumb/8/8f/Alert_Mark_%28Orange%29.svg/64px-Alert_Mark_%28Orange%29.svg.png 2x" data-file-width="48" data-file-height="48" width="32" height="32">' + wgULS('预览加载失败', '預覽載入失敗');
	// 檢查對應selector的網頁物件是否存在
	function $elementExist(selectors) {
		var selector_array = Array.isArray(selectors) ? selectors : selectors ? [ selectors ] : [];
		var ele_count = 0;
		for (var i in selector_array) {
			if (Object.hasOwnProperty.call(selector_array, i)) {
				ele_count += ($(selector_array[i]) || []).length;
			}
		}
		return ele_count > 0;
	}
	// 檢查mediaWiki的設置
	function checkMwConfig(checkTarget, mwConfigs) {
		var mwConfigData = mw.config.get(checkTarget);
		if (!mwConfigData || mwConfigData.toString().trim() === '') {
			return false;
		}
		mwConfigData = mwConfigData.toString().toLowerCase();
		var mwConfig_array = Array.isArray(mwConfigs) ? mwConfigs : mwConfigs ? [ mwConfigs ] : [];
		return mwConfig_array.indexOf(mwConfigData) > -1;
	}
	function getLanguage() {
		var lang = mw.config.get('wgUserLanguage');
		if (lang.indexOf('zh') > -1) {
			return mw.config.get('wgUserVariant');
		}
		return lang;
	}
	// 將解析後的wikitext加入頁面中
	function $addParsedWikitext(parsedWikitext) {
		var $html_obj = $(parsedWikitext);
		if ($elementExist('#mw-_addText-preview-loading')) {
			$('#mw-_addText-preview-loading').html(parsedWikitext);
		} else if ($elementExist('.diff-currentversion-title')) {
			$html_obj.insertAfter('.diff-currentversion-title');
		} else if ($elementExist('.previewnote')) {
			$html_obj.insertAfter('.previewnote');
		} else if ($elementExist('#mw-undelete-revision')) {
			$html_obj.insertAfter('#mw-undelete-revision');
		} else if ($elementExist('#mw-content-text')) {
			$html_obj.insertBefore('#mw-content-text');
		}
	}
	// 如果網頁物件存在，則改動其html內容
	function $setHtml(selector, $htmlContent) {
		if ($elementExist(selector)) {
			$(selector).html($htmlContent);
		}
	}
	// 加入[載入中]的提示
	function $addLoadingNotice() {
		if ($notice_addText && $notice_loading) {
			$addParsedWikitext($notice_loading);
		}
	}
	// 載入錯誤的提示
	function $loadingFailNotice() {
		$setHtml('#mw-_addText-preview-loading-content', $notice_fail);
	}
	// 移除[載入中]的提示
	function $removeLoadingNotice() {
		$setHtml('#mw-_addText-preview-loading', '');
	}
	// 檢查是否有預覽的必要性
	function $needPreview() {
		return document.body.innerHTML.search('_addText') > -1;
	}
	// 加入預覽內容
	function mwAddWikiText(wikiText, pagename, is_preview) {
		if (wikiText.toString().trim() !== '') {
			var params = {
				action: 'parse',
				uselang: getLanguage(),
				useskin: mw.config.get('skin'),
				// 避免內容重複
				title: pagename,
				text: wikiText,
				contentmodel: 'wikitext',
				prop: 'text',
				format: 'json'
			};
			if (is_preview) {
				params.preview = 1;
				params.disableeditsection = 1;
			}
			mwapi.post(params).done(function (data) {
				if (!data || !data.parse || !data.parse.text || !data.parse.text['*']) {
					return;
				}
				var parsed_wiki = (data.parse.text['*'] || '').toString().trim();
				if (parsed_wiki !== '') {
					$addParsedWikitext(parsed_wiki);
				} else {
					$removeLoadingNotice();
				}
			}).fail(function () {
				$loadingFailNotice();
			});
		} else {
			$removeLoadingNotice();
		}
	}
	// 加入預覽的Lua內容
	function mwAddLuaText(wikiText, pagename, is_preview, call_back) {
		var temp_module_name = 'AddText/Temp/Module/Data.lua';
		var module_call = {
			wikitext: '#invoke:',
			// 分開來，避免被分到[[:Category:有脚本错误的页面]]
			pagename: 'Module:'
		};
		if (wikiText.toString().trim() !== '') {
			var params = {
				action: 'parse',
				uselang: getLanguage(),
				useskin: mw.config.get('skin'),
				format: 'json',
				title: pagename,
				text: '{{' + module_call.wikitext + temp_module_name + '|main}}',
				prop: 'text',
				contentmodel: 'wikitext',
				templatesandboxtitle: module_call.pagename + temp_module_name,
				// 產生臨時Lua Module
				templatesandboxtext: 'return {main=function()\nxpcall(function()\n' + wikiText + "\nend,function()end)\nlocal moduleWikitext = package.loaded[\"Module:Module wikitext\"]\nif moduleWikitext then\nlocal wikitext = moduleWikitext.main()\nif mw.text.trim(wikitext)~=''then\nreturn mw.getCurrentFrame():preprocess(moduleWikitext.main())\nend\nend\nreturn ''\nend}",
				templatesandboxcontentmodel: 'Scribunto',
				templatesandboxcontentformat: 'text/plain'
			};
			if (is_preview) {
				params.preview = 1;
				params.disableeditsection = 1;
			}
			mwapi.post(params).done(function (data) {
				if (!data || !data.parse || !data.parse.text || !data.parse.text['*']) {
					return;
				}
				var parsed_wiki = (data.parse.text['*'] || '').toString().trim();
				if (parsed_wiki !== '') {
					// 若出錯在這個臨時模組中則取消
					if ($(parsed_wiki).find('.scribunto-error').text().search(temp_module_name) < 0) {
						if (_typeof(call_back) === _typeof(function () {})) {
							call_back(parsed_wiki);
						} else {
							$addParsedWikitext(parsed_wiki);
						}
					} else {
						$removeLoadingNotice();
					}
				} else {
					$removeLoadingNotice();
				}
			}).fail(function () {
				$loadingFailNotice();
			});
		} else {
			$removeLoadingNotice();
		}
	}
	// 從頁面當前歷史版本取出 _addText
	function mwApplyRevision(revisionId, current_page_name) {
		mwapi.get({
			// 本請求URL不太可能有長度超長的風險
			action: 'parse',
			// get the original wikitext content of a page
			oldid: mw.config.get('wgRevisionId'),
			prop: 'wikitext',
			format: 'json'
		}).done(function (data) { // 若取得 _addText 則顯示預覽
			if (!data || !data.parse || !data.parse.wikitext || !data.parse.wikitext['*']) {
				return;
			}
			var page_content = lua_check((data.parse.wikitext['*'] || '').toString().trim());
			page_content = ($elementExist('#mw-clearyourcache') ? '{{#invoke:Special wikitext/Template|int|clearyourcache}}' : '') + page_content.toString();
			if (page_content.toString().trim() !== '') {
				mwAddWikiText(page_content, current_page_name, true);
			} else {
				$removeLoadingNotice();
			}
		}).fail(function () {
			$removeLoadingNotice();
		});
	}
	// 加入編輯提示 (如果存在)
	function mwApplyNotice(current_page_name, pagesubname) {
		mwapi.post({
			action: 'parse',
			// get the original wikitext content of a page
			uselang: getLanguage(),
			useskin: mw.config.get('skin'),
			title: current_page_name + pagesubname,
			text: '{{#invoke:Special wikitext/Template|getNotices|' + current_page_name + '|' + pagesubname + '}}',
			prop: 'text',
			format: 'json'
		}).done(function (data) {
			if (!data || !data.parse || !data.parse.text || !data.parse.text['*']) {
				return;
			}
			var html = data.parse.text['*'];
			if ($(html.toString()).text().trim() !== '') {
				$addParsedWikitext(html);
			}
		});
	}

	/* 測試樣例 */
	// 本腳本的Testcase模式
	function wikitextPreviewTestcase(is_preview) {
		if (!$needPreview()) {
			return;
		} // 沒有可預覽元素，退出。
		var $testcase_list = $('.special-wikitext-preview-testcase');
		// 若頁面中沒有Testcase，退出。
		if ($testcase_list.length < 0) {
			return;
		}
		// 收集位於頁面中的Testcase預覽元素
		var testcase_data_list = [],
			i,
			testcase_it;
		for (i = 0; i < $testcase_list.length; ++i) {
			testcase_it = $testcase_list[i];
			var code_it = $(testcase_it).find('.mw-highlight');
			if (code_it.length > 0) {
				var code_id = (/(?:mw-highlight-lang-)([^\s]+)/.exec($(code_it[0]).attr('class')) || [])[1];
				var load_index = testcase_data_list.length;
				$(testcase_it).attr('preview-id', load_index);
				testcase_data_list.push({
					element: testcase_it,
					lang: code_id,
					code: code_it.text().toString()
				});
			}
		}
		// 整理頁面中的Testcase預覽元素，並放置[載入中]訊息
		var package_wikitext = '';
		for (i in testcase_data_list) {
			if (Object.hasOwnProperty.call(testcase_data_list, i)) {
				testcase_it = testcase_data_list[i];
				if (testcase_it.code.trim() !== '') {
					if ([ 'javascript', 'js', 'css', 'json', 'text' ].indexOf(testcase_it.lang.toLowerCase()) > -1) {
						var addWiki = lua_check(testcase_it.code, testcase_it.lang);
						if (addWiki.toString().trim() !== '') { // 如果解析結果非空才放置預覽
							$(testcase_it.element).prepend($notice_loading);
							package_wikitext += '<div class="special-wikitext-preview-testcase-' + i + '">\n' + addWiki + '\n</div>';
						}
					} else if ([ 'lua', 'scribunto' ].indexOf(testcase_it.lang.toLowerCase()) > -1) {
						mwAddLuaText(testcase_it.code, mw.config.get('wgPageName'), is_preview, (function (index) {
							return function (wikitext) {
								$(testcase_data_list[index].element).prepend(wikitext);
							};
						}(i)));
					}
				}
			}
		}
		// 將整理完的Testcase預覽元素統一發送API請求，並將返回結果分發到各Testcase
		if (package_wikitext.trim() !== '') {
			package_wikitext = '<div class="special-wikitext-preview-testcase-undefined">' + package_wikitext + '</div>';
			var params = {
				action: 'parse',
				text: package_wikitext,
				contentmodel: 'wikitext',
				prop: 'text',
				format: 'json'
			};
			if (is_preview) {
				params.preview = 1;
				params.disableeditsection = 1;
			}
			mwapi.post(params).done(function (data) {
				if (!data || !data.parse || !data.parse.text || !data.parse.text['*']) {
					return;
				}
				var parsed_wiki = (data.parse.text['*'] || '').toString().trim();
				if (parsed_wiki !== '') {
					var $parsed_element = $(parsed_wiki);
					// eslint-disable-next-line no-shadow
					for (var i in testcase_data_list) {
						if (Object.hasOwnProperty.call(testcase_data_list, i)) {
							// eslint-disable-next-line no-shadow
							var testcase_it = testcase_data_list[i];
							if ([ 'javascript', 'js', 'text', 'css', 'json' ].indexOf(testcase_it.lang.toLowerCase()) > -1) {
								var check_parse_result = $parsed_element.find('.special-wikitext-preview-testcase-undefined > .special-wikitext-preview-testcase-' + i);
								if (check_parse_result.length > 0) {
									$(testcase_it.element).find('#mw-_addText-preview-loading').html(check_parse_result);
								}
							}
						}
					}
				}
			});
		}
	}

	/* 程式進入點 */
	// 給頁面添加預覽
	function mwAddPreview() {
		var current_page_name = mw.config.get('wgPageName');
		// 預覽模式只適用於以下頁面內容模型
		if (checkMwConfig('wgPageContentModel', [ 'javascript', 'js', 'json', 'text', 'css', 'sanitized-css' ])) {
			// 模式1 : 頁面預覽
			if ($elementExist('.previewnote')) { // 檢查是否為預覽模式
				// 預覽有可能是在預覽其他條目
				var $preview_selector = $('.previewnote .warningbox > p > b a');
				if ($preview_selector.length > 0) {
					var path_path = decodeURI($preview_selector.attr('href') || '/wiki/' + current_page_name).replace(/^\/?wiki\//, '');
					// 如果預覽的頁面並非本身，則不顯示預覽
					if (path_path !== current_page_name) {
						return;
					}
				}
				var addWiki = lua_check();
				if (addWiki.toString().trim() !== '') { // 如果解析結果非空才放置預覽
					$addLoadingNotice(); // 放置提示，提示使用者等待AJAX
					mwAddWikiText(addWiki, current_page_name, true); // 若取得 _addText 則顯示預覽
				}
			} else if (!$elementExist('.mw-_addText-content') && checkMwConfig('wgAction', 'view')) { // 模式2 : 不支援顯示的特殊頁面
				// 經查，不止是模板樣式，所有未嵌入'#mw-clearyourcache'的頁面皆無法正常顯示
				if (!$needPreview()) {
					return; // 沒有預覽必要時，直接停止程式，不繼續判斷，以節省效能
				}
				if ($elementExist('#mw-clearyourcache')) { // 如果已有#mw-clearyourcache則先清掉，否則會出現兩個MediaWiki:Clearyourcache
					$('#mw-clearyourcache').html('');
				}
				if (!$elementExist('#wpTextbox1')) { // 非編輯模式才執行 (預覽使用上方的if區塊)
					$addLoadingNotice(); // 放置提示，提示使用者等待AJAX
					mwApplyRevision(mw.config.get('wgRevisionId'), current_page_name); // 為了讓歷史版本正常顯示，使用wgRevisionId取得內容
				}
			} else if ($elementExist('#mw-revision-info') && checkMwConfig('wgAction', 'view')) { // 模式3 : 頁面歷史版本檢視 : 如需複查的項目為頁面歷史版本，本工具提供頁面歷史版本內容顯示支援
				// 有嵌入'#mw-clearyourcache'的頁面的歷史版本會只能顯示最新版的 _addText 因此執行修正
				if (!$elementExist('#wpTextbox1')) { // 非編輯模式才執行 (預覽使用上方的if區塊)
					$('#mw-clearyourcache').html($notice_loading); // 差異模式(含檢閱修訂版本刪除)的插入點不同
					mwApplyRevision(mw.config.get('wgRevisionId'), current_page_name); // 為了讓特定版本正常顯示，使用wgRevisionId取得內容
				}
			} else {
				$removeLoadingNotice();
			}
		} else if (checkMwConfig('wgPageContentModel', [ 'scribunto', 'lua' ])) { // 模組預覽功能
			if (!$needPreview()) {
				return;
			} // 沒有預覽必要時，直接停止程式，不繼續判斷，以節省效能
			if ($elementExist('#wpTextbox1') && $elementExist('table.diff') && !$elementExist('.previewnote') && !checkMwConfig('wgAction', 'view')) {
				$($notice_loading).insertAfter('#wikiDiff');
				mwAddLuaText($('#wpTextbox1').val(), current_page_name, true);
			}
		} else if ($elementExist('#mw-undelete-revision')) { // 模式4 : 已刪頁面預覽
			// 已刪內容頁面是特殊頁面，無法用常規方式判斷頁面內容模型
			if (!$needPreview()) {
				return;
			} // 沒有預覽必要時，直接停止程式，不繼續判斷，以節省效能
			if ($elementExist([ '.mw-highlight', 'pre', '.mw-json' ])) { // 確認正在預覽已刪內容
				var $tryGetWiki = $('textarea').val(); // 嘗試取得已刪內容原始碼
				var tryAddWiki = lua_getJSONwikitext($tryGetWiki);
				if (tryAddWiki.trim() === '') {
					tryAddWiki = lua_getCSSwikitext($tryGetWiki);
				}
				if (tryAddWiki.trim() !== '') { // 若取得 _addText 則顯示預覽
					$addLoadingNotice();
					mwAddWikiText(tryAddWiki, mw.config.get('wgRelevantPageName'), true);
				} else if (/Module[_ ]wikitext.*_addText/i.exec($('.mw-parser-output').text())) { // 嘗試Lua解析
					// 本功能目前測試正常運作
					// 若哪天預覽又失效，請取消註解下方那行
					// mwAddLuaText($tryGetWiki, mw.config.get("wgRelevantPageName"), true);
				}
			}
		} else if (!$elementExist('.mw-editnotice') && checkMwConfig('wgCanonicalNamespace', 'special')) { // 如果特殊頁面缺乏編輯提示，則補上編輯提示 (如果存在)
			var pagename = mw.config.get('wgCanonicalSpecialPageName');
			var pagesubname = mw.config.get('wgPageName').replace(/special:[^/]+/i, '');
			if (pagename !== false && pagename !== null && pagename.toString().trim() !== '') {
				var fullpagename = mw.config.get('wgCanonicalNamespace') + ':' + pagename;
				mwApplyNotice(fullpagename, pagesubname);
			}
		} else {
			$removeLoadingNotice(); // 都不是的情況則不顯示預覽
		}
	}
	if (mw.config.get('wgIsSpecialWikitextPreview') !== true) { // 一頁只跑一次預覽
		// 避免小工具重複安裝冒出一大堆預覽
		// 標記預覽已跑過
		mw.config.set('wgIsSpecialWikitextPreview', true);
		// 執行預覽
		mwAddPreview();
		// 檢查測試樣例
		wikitextPreviewTestcase(true);
	}
}
// oidid=65569634
$(previewTool);
}(jQuery, mw));
// </nowiki>
