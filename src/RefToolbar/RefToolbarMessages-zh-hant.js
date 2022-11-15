/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-RefToolbarMessages-zh-hant.js
 * @source https://zh.wikipedia.org/wiki/MediaWiki:RefToolbarMessages-zh-hant.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
'use strict';

// All user-facing messages
// TODO: Document usage
mw.usability.addMessages({
	'cite-section-label': '引用',
	'cite-template-list': '模板',
	'cite-named-refs-label': '同名文獻',
	'cite-named-refs-title': '插入同名文獻',
	'cite-named-refs-button': '已命名參考文獻',
	'cite-named-refs-dropdown': '同名文獻',
	// Used on the top of the named refs list dropsown
	'cite-errorcheck-label': '錯誤檢查',
	'cite-errorcheck-button': '檢查錯誤',
	'cite-dialog-base': '引用',
	'cite-form-submit': '插入',
	'cite-form-showhide': '顯示/隱藏額外區域',
	'cite-no-namedrefs': '在本頁找不到任何同名文獻',
	'cite-namedrefs-intro': '從列出的參考文獻目錄中選擇一個名字。點擊"插入"插入一個參考文獻到文本中。',
	'cite-raw-preview': 'Wikitext:',
	'cite-parsed-label': '解析後的wikitext:',
	'cite-form-parse': '顯示解析後的預覽',
	'cite-refpreview': '預覽',
	'cite-name-label': 'ref名',
	'cite-group-label': 'ref組',
	'cite-errorcheck-submit': '檢查',
	'cite-errorcheck-heading': '檢查下列錯誤：',
	'cite-error-unclosed': "未關閉<span style='font-family:monospace'>&lt;ref&gt;</span>標記",
	'cite-error-samecontent': '有相同內容的參考文獻',
	'cite-error-templates': "參考文獻未使用<a href='//en.wikipedia.org/wiki/Wikipedia:Citation_templates'>引用模板</a>",
	'cite-error-repeated': '多個參考文獻有相同名稱',
	'cite-error-undef': '有未定義的同名參考文獻在使用',
	'cite-error-samecontent-msg': '多個文獻含有相同內容: $1',
	'cite-error-repeated-msg': '給多個參考文獻命名: "$1"',
	'cite-error-templates-msg': '沒有使用模板: $1',
	'cite-form-reset': '重設表單',
	'cite-loading': '載入數據',
	// Shown while pagetext is being downloaded from the API
	'cite-insert-date': '插入當前日期',
	// Alt/title text for "insert date" icon
	'cite-err-report-heading': '引用錯誤報告',
	// Heading for error report table
	'cite-err-report-close': '關閉',
	// Alt/title text for "close" icon on error report
	'cite-err-report-empty': '未找到錯誤',
	// Message displayed in the error report list if there are no errors
	'cite-autofill-alt': '自動填充',
	// Alt text for autofill button image
	'cite-dialog-web': '網頁引用',
	'cite-dialog-news': '新聞引用',
	'cite-dialog-book': '書籍引用',
	'cite-dialog-journal': '期刊引用',
	'cite-dialog-conference': '會議引用',
	'cite-dialog-encyclopedia': '百科全書引用',
	'cite-author-label': '作者',
	'cite-title-label': '標題',
	'cite-url-label': '網址',
	'cite-website-label': '網站名稱',
	'cite-work-label': '報紙或雜誌',
	'cite-agency-label': '通訊社',
	'cite-publisher-label': '出版者',
	'cite-accessdate-label': '存取日期',
	'cite-last-label': '姓',
	'cite-first-label': '名',
	'cite-authorlink-label': '作者條目',
	'cite-coauthors-label': '其他作者',
	'cite-location-label': '出版地',
	'cite-page-label': '所在頁',
	'cite-pages-label': '頁範圍',
	'cite-language-label': '語言',
	'cite-format-label': '文件格式',
	'cite-doi-label': 'DOI',
	'cite-date-label': '日期',
	'cite-month-label': '月份',
	'cite-year-label': '年份',
	'cite-quote-label': '摘錄',
	'cite-newspaper-label': '新聞媒體',
	'cite-author2-label': '第2作者',
	'cite-author3-label': '第3作者',
	'cite-author4-label': '第4作者',
	'cite-author5-label': '第5作者',
	'cite-agency': '通訊社',
	'cite-issn-label': 'ISSN',
	'cite-oclc-label': 'OCLC',
	'cite-isbn-label': 'ISBN',
	'cite-others-label': '譯者',
	'cite-edition-label': '版本',
	'cite-series-label': '系列',
	'cite-volume-label': '卷',
	'cite-unified-label': '統一書號',
	'cite-chapter-label': '章節',
	'cite-journal-label': '雜誌/期刊',
	'cite-issue-label': '期',
	'cite-pmid-label': 'PMID',
	'cite-editor-label': '編輯',
	'cite-pmc-label': 'PMC',
	'cite-id-label': 'ID',
	'cite-laysummary-label': '簡明摘要',
	'cite-laysource-label': '簡明摘要來源',
	'cite-laydate-label': '簡明摘要日期',
	'cite-conference-label': '會議名稱',
	'cite-conferenceurl-label': '會議網址',
	'cite-booktitle-label': '論文集',
	'cite-encyclopedia-label': '百科全書名',
	'cite-authorlink-tooltip': '如果該作者有條目，填寫條目名稱',
	'cite-accessdate-tooltip': '訪問這個引用來源時的日期',
	'cite-id-tooltip': '其他的文章編號',
	'cite-samecontent-desc': '檢查含有相同內容的多個參考文獻',
	'cite-samecontent-error': '多個參考文獻包含有相同內容',
	'cite-repeated-desc': '使用相同名字的多個參考文獻',
	'cite-repeated-error': '多個參考文獻使用了相同名字',
	'cite-undefined-desc': '未定義的參考文獻',
	'cite-undefined-error': '一個已命名的參考文獻已經使用但是沒有定義',
	'cite-work-tooltip': '刊登該作品的出版物的名稱。請不要使用斜體',
	'cite-newspaper-tooltip': '刊登該新聞的出版物名稱',
	'cite-series-tooltip': '當書籍是一系列出版品中的其中一部份時使用',
	'cite-unified-tooltip': '中國大陸1980年代之前一段時期所使用的書籍編號',
	'cite-laysummary-tooltip': '該文獻相關的新聞報道的URL',
	'cite-laysource-tooltip': '該文獻相關的新聞報道的出處'
});

// Load configuration for site
// eslint-disable-next-line no-implicit-globals, no-unused-vars
var RefToolbarLocal = mw.loader.load('/index.php?title=MediaWiki:Gadget-RefToolbarConfig.js&action=raw&ctype=text/javascript&smaxage=21600&maxage=86400');
