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

/* <nowiki> */
(function ($, mw) {
/* 跟[[Module:Special wikitext]]保持一致的段落。 */

var wikiTextKey = '_addText';
function luaCheck(inputString, contentModel) {
	// 使用頁面內容模型來判斷格式
	var contentModelToLowerCase = (contentModel || mw.config.get('wgPageContentModel')).toString().toLowerCase();
	// 根據文檔格式選用適當的解析模式
	switch (contentModelToLowerCase) {
		case 'json':
			return luaGetJSONwikitext(inputString);
		case 'js':
		case 'javascript':
		case 'text':
			return luaGetJSwikitext(inputString);
		case 'css':
		case 'sanitized-css':
			return luaGetCSSwikitext(inputString);
		default:
			// 若不是json、js、css則返回空字串
			return '';
	}
}
// 合併多個wikitext字串，並以換行分隔
function luaAddText(inputStr, newStr, _escape) {
	var inputString = inputStr;
	if (newStr !== '') {
		if (inputString !== '') {
			inputString += '\n';
		}
		var text = newStr;
		if (_escape) {
			var escapeStr = JSON.parse('[' + JSON.stringify(
				// Lua不支援\u、\x的跳脫符號；排除相關轉換
				newStr.toString().replace(/\\([ux])/ig, '$1')).replace(/\\\\/g, '\\') + ']')[0];
			text = escapeStr;
		}
		inputString += text;
	}
	return inputString;
}
// 讀取wikitext字串，並忽略註解尾部
function luaGetString(str) {
	var testStr = /[^\n]*\*\//.exec(str);
	if (testStr) {
		testStr = testStr[0] || '';
		testStr = testStr.slice(0, Math.max(0, testStr.length - 2));
	} else {
		testStr = str;
	}
	var trimCheck = testStr.trim();
	var firstChar = trimCheck.charAt(0);
	if (firstChar === trimCheck.charAt(trimCheck.length - 1) && (firstChar === "'" || firstChar === '"')) {
		return trimCheck.slice(1, 1 + trimCheck.length - 2);
	}
	return testStr;
}
// 讀取CSS之 ＿addText  { content："XXX" } 模式的字串
function luaGetContentText(str) {
	var wikitext = '';
	try {
		str.replace(new RegExp(wikiTextKey + '\\s*\\{[^c\\}]*content\\s*:\\s*[^\n]*', 'g'), function (text) {
			var tempText = (/content\s*:\s*[^\n]*/.exec(text) || [ 'content:' ])[0].replace(/^[\s\uFEFF\xA0\t\r\n\f ;}]+|[\s\uFEFF\xA0\t\r\n\f ;}]+$/g, '').replace(/\s*content\s*:\s*/, '');
			if (wikitext !== '') {
				wikitext += '\n';
			}
			wikitext += luaGetString(tempText);
			return text;
		});
	} catch (ex) {
		return '';
	}
	return wikitext;
}
// 讀取物件定義模式為 ＿addText＝XXX 或 ＿addText：XXX 模式的字串 (註解全形避免被抓取)
function luaGetObjText(str) {
	var wikitext = '';
	try {
		str.replace(new RegExp(wikiTextKey + '\\s*[\\=:]\\s*[^\n]*', 'g'), function (text) {
			var tempText = text.replace(/^[\s\uFEFF\xA0\t\r\n\f ;}]+|[\s\uFEFF\xA0\t\r\n\f ;}]+$/g, '').replace(new RegExp(wikiTextKey + '\\s*[\\=:]\\s*'), '');
			if (wikitext !== '') {
				wikitext += '\n';
			}
			wikitext += luaGetString(tempText);
			return text;
		});
	} catch (ex) {
		return '';
	}
	return wikitext;
}
// 分析CSS中符合條件的wikitext
function luaGetCSSwikitext(inputString) {
	var wikitext = '';
	var cssText = inputString || $('#wpTextbox1').val() || '';
	if (cssText.trim() === '') {
		return '';
	}
	// 匹配 ＿addText { content："XXX" } 模式
	wikitext = luaAddText(wikitext, luaGetContentText(cssText), true);
	// 同時亦匹配 /* ＿addText：XXX */ 模式
	wikitext = luaAddText(wikitext, luaGetObjText(cssText), true);
	return wikitext;
}
// 分析JavaScript中符合條件的wikitext
function luaGetJSwikitext(inputString) {
	var wikitext = '';
	var jsText = inputString || $('#wpTextbox1').val() || '';
	if (jsText.trim() === '') {
		return '';
	}
	wikitext = luaAddText(wikitext, luaGetObjText(jsText), true);
	return wikitext;
}
// 分析JSON中符合條件的wikitext
function luaGetJSONwikitext(inputString) {
	var wikitext = '';
	var jsonText = inputString || $('#wpTextbox1').val() || '';
	if (jsonText.trim() === '') {
		return '';
	}
	try {
		var jsonData = JSON.parse(jsonText);
		// eslint-disable-next-line es-x/no-array-prototype-keys
		Object.keys(jsonData).forEach(function (key) {
			var k = key,
				v = jsonData[key];
			if (new RegExp(wikiTextKey).exec(k) && _typeof(v) === _typeof('')) {
				wikitext = luaAddText(wikitext, v);
			}
			// 如果是陣列物件會多包一層
			if (_typeof(v) !== _typeof('')) {
				for (var prop in v) {
					if (Object.hasOwnProperty.call(v, prop)) {
						var testArrK = prop,
							testArrV = v[prop];
						if (new RegExp(wikiTextKey).exec(testArrK) && _typeof(testArrV) === _typeof('')) {
							wikitext = luaAddText(wikitext, testArrV);
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
	var $noticeAddText = '{{Special_wikitext/notice}}';
	// {{Quote box |quote  = -{zh-hans:预览加载中;zh-hant:預覽載入中;}-... |width  = 50% |align  = center}}
	var $noticeLoading = '<div id="mw-_addText-preview-loading"><div class="quotebox" style="margin: auto; width: 50%; padding: 6px; border: 1px solid #aaa; font-size: 88%; background-color: #F9F9F9;"><div id="mw-_addText-preview-loading-content" style="background-color: #F9F9F9; color: black; text-align: center; font-size: larger;"><img src="//upload-mirror.qiuwenbaike.cn/wikipedia/commons/d/de/Ajax-loader.gif" decoding="async" data-file-width="32" data-file-height="32" width="32" height="32"> ' + wgULS('预览加载中...', '預覽載入中...') + ' </div></div></div>';
	// [[File:Gnome-dialog-warning2.svg|32px]] -{zh-hans:预览加载失败;zh-hant:預覽載入失敗;}-
	var $noticeFail = '<img src="https://upload.qiuwenbaike.cn/images/thumb/8/8f/Alert_Mark_%28Orange%29.svg/32px-Alert_Mark_%28Orange%29.svg.png" decoding="async" srcset="https://upload.qiuwenbaike.cn/images/thumb/8/8f/Alert_Mark_%28Orange%29.svg/48px-Alert_Mark_%28Orange%29.svg.png 1.5x, https://upload.qiuwenbaike.cn/images/thumb/8/8f/Alert_Mark_%28Orange%29.svg/64px-Alert_Mark_%28Orange%29.svg.png 2x" data-file-width="48" data-file-height="48" width="32" height="32">' + wgULS('预览加载失败', '預覽載入失敗');
	// 檢查對應selector的網頁物件是否存在
	function $elementExist(selectors) {
		var selectorArray = Array.isArray(selectors) ? selectors : selectors ? [ selectors ] : [];
		var eleCount = 0;
		for (var i in selectorArray) {
			if (Object.hasOwnProperty.call(selectorArray, i)) {
				eleCount += ($(selectorArray[i]) || []).length;
			}
		}
		return eleCount > 0;
	}
	// 檢查mediaWiki的設置
	function checkMwConfig(checkTarget, mwConfigs) {
		var mwConfigData = mw.config.get(checkTarget);
		if (!mwConfigData || mwConfigData.toString().trim() === '') {
			return false;
		}
		mwConfigData = mwConfigData.toString().toLowerCase();
		var mwConfigArray = Array.isArray(mwConfigs) ? mwConfigs : mwConfigs ? [ mwConfigs ] : [];
		return mwConfigArray.indexOf(mwConfigData) > -1;
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
		var $htmlObj = $(parsedWikitext);
		if ($elementExist('#mw-_addText-preview-loading')) {
			$('#mw-_addText-preview-loading').html(parsedWikitext);
		} else if ($elementExist('.diff-currentversion-title')) {
			$htmlObj.insertAfter('.diff-currentversion-title');
		} else if ($elementExist('.previewnote')) {
			$htmlObj.insertAfter('.previewnote');
		} else if ($elementExist('#mw-undelete-revision')) {
			$htmlObj.insertAfter('#mw-undelete-revision');
		} else if ($elementExist('#mw-content-text')) {
			$htmlObj.insertBefore('#mw-content-text');
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
		if ($noticeAddText && $noticeLoading) {
			$addParsedWikitext($noticeLoading);
		}
	}
	// 載入錯誤的提示
	function $loadingFailNotice() {
		$setHtml('#mw-_addText-preview-loading-content', $noticeFail);
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
	function mwAddWikiText(wikiText, pagename, isPreview) {
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
			if (isPreview) {
				params.preview = 1;
				params.disableeditsection = 1;
			}
			mwapi.post(params).done(function (data) {
				if (!data || !data.parse || !data.parse.text || !data.parse.text['*']) {
					return;
				}
				var parsedWiki = (data.parse.text['*'] || '').toString().trim();
				if (parsedWiki !== '') {
					$addParsedWikitext(parsedWiki);
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
	function mwAddLuaText(wikiText, pagename, isPreview, callBack) {
		var tempModuleName = 'AddText/Temp/Module/Data.lua';
		var moduleCall = {
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
				text: '{{' + moduleCall.wikitext + tempModuleName + '|main}}',
				prop: 'text',
				contentmodel: 'wikitext',
				templatesandboxtitle: moduleCall.pagename + tempModuleName,
				// 產生臨時Lua Module
				templatesandboxtext: 'return {main=function()\nxpcall(function()\n' + wikiText + "\nend,function()end)\nlocal moduleWikitext = package.loaded[\"Module:Module wikitext\"]\nif moduleWikitext then\nlocal wikitext = moduleWikitext.main()\nif mw.text.trim(wikitext)~=''then\nreturn mw.getCurrentFrame():preprocess(moduleWikitext.main())\nend\nend\nreturn ''\nend}",
				templatesandboxcontentmodel: 'Scribunto',
				templatesandboxcontentformat: 'text/plain'
			};
			if (isPreview) {
				params.preview = 1;
				params.disableeditsection = 1;
			}
			mwapi.post(params).done(function (data) {
				if (!data || !data.parse || !data.parse.text || !data.parse.text['*']) {
					return;
				}
				var parsedWiki = (data.parse.text['*'] || '').toString().trim();
				if (parsedWiki !== '') {
					// 若出錯在這個臨時模組中則取消
					if ($(parsedWiki).find('.scribunto-error').text().search(tempModuleName) < 0) {
						if (_typeof(callBack) === _typeof(function () {})) {
							callBack(parsedWiki);
						} else {
							$addParsedWikitext(parsedWiki);
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
	function mwApplyRevision(revisionId, currentPageName) {
		mwapi.get({
			// 本請求URL不太可能有長度超長的風險
			action: 'parse',
			// get the original wikitext content of a page
			oldid: mw.config.get('wgRevisionId'),
			prop: 'wikitext',
			format: 'json'
		}).done(function (data) {
			// 若取得 _addText 則顯示預覽
			if (!data || !data.parse || !data.parse.wikitext || !data.parse.wikitext['*']) {
				return;
			}
			var pageContent = luaCheck((data.parse.wikitext['*'] || '').toString().trim());
			pageContent = ($elementExist('#mw-clearyourcache') ? '{{#invoke:Special wikitext/Template|int|clearyourcache}}' : '') + pageContent.toString();
			if (pageContent.toString().trim() !== '') {
				mwAddWikiText(pageContent, currentPageName, true);
			} else {
				$removeLoadingNotice();
			}
		}).fail(function () {
			$removeLoadingNotice();
		});
	}
	// 加入編輯提示 (如果存在)
	function mwApplyNotice(currentPageName, pageSubName) {
		mwapi.post({
			action: 'parse',
			// get the original wikitext content of a page
			uselang: getLanguage(),
			useskin: mw.config.get('skin'),
			title: currentPageName + pageSubName,
			text: '{{#invoke:Special wikitext/Template|getNotices|' + currentPageName + '|' + pageSubName + '}}',
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
	function wikitextPreviewTestcase(isPreview) {
		if (!$needPreview()) {
			return;
		} // 沒有可預覽元素，退出。
		var $testcaseList = $('.special-wikitext-preview-testcase');
		// 若頁面中沒有Testcase，退出。
		if ($testcaseList.length < 0) {
			return;
		}
		// 收集位於頁面中的Testcase預覽元素
		var testcaseDataList = [],
			i,
			testcaseit;
		for (i = 0; i < $testcaseList.length; ++i) {
			testcaseit = $testcaseList[i];
			var codeIt = $(testcaseit).find('.mw-highlight');
			if (codeIt.length > 0) {
				var codeId = (/(?:mw-highlight-lang-)([^\s]+)/.exec($(codeIt[0]).attr('class')) || [])[1];
				var loadIndex = testcaseDataList.length;
				$(testcaseit).attr('preview-id', loadIndex);
				testcaseDataList.push({
					element: testcaseit,
					lang: codeId,
					code: codeIt.text().toString()
				});
			}
		}
		// 整理頁面中的Testcase預覽元素，並放置[載入中]訊息
		var packageWikitext = '';
		for (i in testcaseDataList) {
			if (Object.hasOwnProperty.call(testcaseDataList, i)) {
				testcaseit = testcaseDataList[i];
				if (testcaseit.code.trim() !== '') {
					if ([ 'javascript', 'js', 'css', 'json', 'text' ].indexOf(testcaseit.lang.toLowerCase()) > -1) {
						var addWiki = luaCheck(testcaseit.code, testcaseit.lang);
						if (addWiki.toString().trim() !== '') {
							// 如果解析結果非空才放置預覽
							$(testcaseit.element).prepend($noticeLoading);
							packageWikitext += '<div class="special-wikitext-preview-testcase-' + i + '">\n' + addWiki + '\n</div>';
						}
					} else if ([ 'lua', 'scribunto' ].indexOf(testcaseit.lang.toLowerCase()) > -1) {
						mwAddLuaText(testcaseit.code, mw.config.get('wgPageName'), isPreview, (function (index) {
							return function (wikitext) {
								$(testcaseDataList[index].element).prepend(wikitext);
							};
						}(i)));
					}
				}
			}
		}
		// 將整理完的Testcase預覽元素統一發送API請求，並將返回結果分發到各Testcase
		if (packageWikitext.trim() !== '') {
			packageWikitext = '<div class="special-wikitext-preview-testcase-undefined">' + packageWikitext + '</div>';
			var params = {
				action: 'parse',
				text: packageWikitext,
				contentmodel: 'wikitext',
				prop: 'text',
				format: 'json'
			};
			if (isPreview) {
				params.preview = 1;
				params.disableeditsection = 1;
			}
			mwapi.post(params).done(function (data) {
				if (!data || !data.parse || !data.parse.text || !data.parse.text['*']) {
					return;
				}
				var parsedWiki = (data.parse.text['*'] || '').toString().trim();
				if (parsedWiki !== '') {
					var $parsedElement = $(parsedWiki);
					// eslint-disable-next-line no-shadow
					for (var i in testcaseDataList) {
						if (Object.hasOwnProperty.call(testcaseDataList, i)) {
							// eslint-disable-next-line no-shadow
							var testcaseit = testcaseDataList[i];
							if ([ 'javascript', 'js', 'text', 'css', 'json' ].indexOf(testcaseit.lang.toLowerCase()) > -1) {
								var checkParseElement = $parsedElement.find('.special-wikitext-preview-testcase-undefined > .special-wikitext-preview-testcase-' + i);
								if (checkParseElement.length > 0) {
									$(testcaseit.element).find('#mw-_addText-preview-loading').html(checkParseElement);
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
		var currentPageName = mw.config.get('wgPageName');
		// 預覽模式只適用於以下頁面內容模型
		if (checkMwConfig('wgPageContentModel', [ 'javascript', 'js', 'json', 'text', 'css', 'sanitized-css' ])) {
			// 模式1 : 頁面預覽
			if ($elementExist('.previewnote')) {
				// 檢查是否為預覽模式
				// 預覽有可能是在預覽其他條目
				var $previewSelector = $('.previewnote .warningbox > p > b a');
				if ($previewSelector.length > 0) {
					var pathPath = decodeURI($previewSelector.attr('href') || '/wiki/' + currentPageName).replace(/^\/?wiki\//, '');
					// 如果預覽的頁面並非本身，則不顯示預覽
					if (pathPath !== currentPageName) {
						return;
					}
				}
				var addWiki = luaCheck();
				if (addWiki.toString().trim() !== '') {
					// 如果解析結果非空才放置預覽
					$addLoadingNotice(); // 放置提示，提示使用者等待AJAX
					mwAddWikiText(addWiki, currentPageName, true); // 若取得 _addText 則顯示預覽
				}
			} else if (!$elementExist('.mw-_addText-content') && checkMwConfig('wgAction', 'view')) {
				// 模式2 : 不支援顯示的特殊頁面
				// 經查，不止是模板樣式，所有未嵌入'#mw-clearyourcache'的頁面皆無法正常顯示
				if (!$needPreview()) {
					return; // 沒有預覽必要時，直接停止程式，不繼續判斷，以節省效能
				}

				if ($elementExist('#mw-clearyourcache')) {
					// 如果已有#mw-clearyourcache則先清掉，否則會出現兩個MediaWiki:Clearyourcache
					$('#mw-clearyourcache').html('');
				}
				if (!$elementExist('#wpTextbox1')) {
					// 非編輯模式才執行 (預覽使用上方的if區塊)
					$addLoadingNotice(); // 放置提示，提示使用者等待AJAX
					mwApplyRevision(mw.config.get('wgRevisionId'), currentPageName); // 為了讓歷史版本正常顯示，使用wgRevisionId取得內容
				}
			} else if ($elementExist('#mw-revision-info') && checkMwConfig('wgAction', 'view')) {
				// 模式3 : 頁面歷史版本檢視 : 如需複查的項目為頁面歷史版本，本工具提供頁面歷史版本內容顯示支援
				// 有嵌入'#mw-clearyourcache'的頁面的歷史版本會只能顯示最新版的 _addText 因此執行修正
				if (!$elementExist('#wpTextbox1')) {
					// 非編輯模式才執行 (預覽使用上方的if區塊)
					$('#mw-clearyourcache').html($noticeLoading); // 差異模式(含檢閱修訂版本刪除)的插入點不同
					mwApplyRevision(mw.config.get('wgRevisionId'), currentPageName); // 為了讓特定版本正常顯示，使用wgRevisionId取得內容
				}
			} else {
				$removeLoadingNotice();
			}
		} else if (checkMwConfig('wgPageContentModel', [ 'scribunto', 'lua' ])) {
			// 模組預覽功能
			if (!$needPreview()) {
				return;
			} // 沒有預覽必要時，直接停止程式，不繼續判斷，以節省效能
			if ($elementExist('#wpTextbox1') && $elementExist('table.diff') && !$elementExist('.previewnote') && !checkMwConfig('wgAction', 'view')) {
				$($noticeLoading).insertAfter('#wikiDiff');
				mwAddLuaText($('#wpTextbox1').val(), currentPageName, true);
			}
		} else if ($elementExist('#mw-undelete-revision')) {
			// 模式4 : 已刪頁面預覽
			// 已刪內容頁面是特殊頁面，無法用常規方式判斷頁面內容模型
			if (!$needPreview()) {
				return;
			} // 沒有預覽必要時，直接停止程式，不繼續判斷，以節省效能
			if ($elementExist([ '.mw-highlight', 'pre', '.mw-json' ])) {
				// 確認正在預覽已刪內容
				var $tryGetWiki = $('textarea').val(); // 嘗試取得已刪內容原始碼
				var tryAddWiki = luaGetJSONwikitext($tryGetWiki);
				if (tryAddWiki.trim() === '') {
					tryAddWiki = luaGetCSSwikitext($tryGetWiki);
				}
				if (tryAddWiki.trim() !== '') {
					// 若取得 _addText 則顯示預覽
					$addLoadingNotice();
					mwAddWikiText(tryAddWiki, mw.config.get('wgRelevantPageName'), true);
				} else if (/Module[_ ]wikitext.*_addText/i.exec($('.mw-parser-output').text())) { // 嘗試Lua解析
					// 本功能目前測試正常運作
					// 若哪天預覽又失效，請取消註解下方那行
					// mwAddLuaText($tryGetWiki, mw.config.get("wgRelevantPageName"), true);
				}
			}
		} else if (!$elementExist('.mw-editnotice') && checkMwConfig('wgCanonicalNamespace', 'special')) {
			// 如果特殊頁面缺乏編輯提示，則補上編輯提示 (如果存在)
			var pagename = mw.config.get('wgCanonicalSpecialPageName');
			var pageSubName = mw.config.get('wgPageName').replace(/special:[^/]+/i, '');
			if (pagename !== false && pagename !== null && pagename.toString().trim() !== '') {
				var fullpagename = mw.config.get('wgCanonicalNamespace') + ':' + pagename;
				mwApplyNotice(fullpagename, pageSubName);
			}
		} else {
			$removeLoadingNotice(); // 都不是的情況則不顯示預覽
		}
	}

	if (mw.config.get('wgIsSpecialWikitextPreview') !== true) {
		// 一頁只跑一次預覽
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
}(jQuery, mediaWiki));
/* </nowiki> */
