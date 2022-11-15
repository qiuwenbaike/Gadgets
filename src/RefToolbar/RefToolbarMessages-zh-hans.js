/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-RefToolbarMessages-zh-hans.js
 * @source https://zh.wikipedia.org/wiki/MediaWiki:RefToolbarMessages-zh-hans.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
'use strict';

// All user-facing messages
// TODO: Document usage
mw.usability.addMessages({
	'cite-section-label': '引用',
	'cite-template-list': '模板',
	'cite-named-refs-label': '同名文献',
	'cite-named-refs-title': '插入同名文献',
	'cite-named-refs-button': '已命名参考文献',
	'cite-named-refs-dropdown': '同名文献', // Used on the top of the named refs list dropsown
	'cite-errorcheck-label': '错误检查',
	'cite-errorcheck-button': '检查错误',
	'cite-dialog-base': '引用',
	'cite-form-submit': '插入',
	'cite-form-showhide': '显示/隐藏额外区域',
	'cite-no-namedrefs': '在本页找不到任何同名文献',
	'cite-namedrefs-intro': '从列出的参考文献目录中选择一个名字。点击"插入"插入一个参考文献到文本中。',
	'cite-raw-preview': 'Wikitext:',
	'cite-parsed-label': '解析后的wikitext:',
	'cite-form-parse': '显示解析后的预览',
	'cite-refpreview': '预览',
	'cite-name-label': 'ref名',
	'cite-group-label': 'ref组',
	'cite-errorcheck-submit': '检查',
	'cite-errorcheck-heading': '检查下列错误：',
	'cite-error-unclosed': "未关闭<span style='font-family:monospace'>&lt;ref&gt;</span>标记",
	'cite-error-samecontent': '有相同内容的参考文献',
	'cite-error-templates': "参考文献未使用<a href='//en.wikipedia.org/wiki/Wikipedia:Citation_templates'>引用模板</a>",
	'cite-error-repeated': '多个参考文献有相同名称',
	'cite-error-undef': '有未定义的同名参考文献在使用',
	'cite-error-samecontent-msg': '多个文献含有相同内容: $1',
	'cite-error-repeated-msg': '给多个参考文献命名: "$1"',
	'cite-error-templates-msg': '没有使用模板: $1',
	'cite-form-reset': '重设表单',
	'cite-loading': '载入数据', // Shown while pagetext is being downloaded from the API
	'cite-insert-date': '插入当前日期', // Alt/title text for "insert date" icon
	'cite-err-report-heading': '引用错误报告', // Heading for error report table
	'cite-err-report-close': '关闭', // Alt/title text for "close" icon on error report
	'cite-err-report-empty': '未找到错误', // Message displayed in the error report list if there are no errors
	'cite-autofill-alt': '自动填充', // Alt text for autofill button image
	'cite-dialog-web': '网页引用',
	'cite-dialog-news': '新闻引用',
	'cite-dialog-book': '书籍引用',
	'cite-dialog-journal': '期刊引用',
	'cite-dialog-conference': '会议引用',
	'cite-dialog-encyclopedia': '百科全书引用',
	'cite-author-label': '作者',
	'cite-title-label': '标题',
	'cite-url-label': '网址',
	'cite-website-label': '网站名称',
	'cite-work-label': '报纸或杂志',
	'cite-agency-label': '通讯社',
	'cite-publisher-label': '出版者',
	'cite-accessdate-label': '访问日期',
	'cite-last-label': '姓',
	'cite-first-label': '名',
	'cite-authorlink-label': '作者条目',
	'cite-coauthors-label': '其他作者',
	'cite-location-label': '出版地',
	'cite-page-label': '所在页',
	'cite-pages-label': '页范围',
	'cite-language-label': '语言',
	'cite-format-label': '文档格式',
	'cite-doi-label': 'DOI',
	'cite-date-label': '日期',
	'cite-month-label': '月份',
	'cite-year-label': '年份',
	'cite-quote-label': '摘录',
	'cite-newspaper-label': '新闻媒体',
	'cite-author2-label': '第2作者',
	'cite-author3-label': '第3作者',
	'cite-author4-label': '第4作者',
	'cite-author5-label': '第5作者',
	'cite-agency': '通讯社',
	'cite-issn-label': 'ISSN',
	'cite-oclc-label': 'OCLC',
	'cite-isbn-label': 'ISBN',
	'cite-others-label': '译者',
	'cite-edition-label': '版本',
	'cite-series-label': '系列',
	'cite-volume-label': '卷',
	'cite-unified-label': '统一书号',
	'cite-chapter-label': '章节',
	'cite-journal-label': '杂志/期刊',
	'cite-issue-label': '期',
	'cite-pmid-label': 'PMID',
	'cite-editor-label': '编辑',
	'cite-pmc-label': 'PMC',
	'cite-id-label': 'ID',
	'cite-laysummary-label': '简明摘要',
	'cite-laysource-label': '简明摘要来源',
	'cite-laydate-label': '简明摘要日期',
	'cite-conference-label': '会议名称',
	'cite-conferenceurl-label': '会议网址',
	'cite-booktitle-label': '论文集',
	'cite-encyclopedia-label': '百科全书名',
	'cite-authorlink-tooltip': '如果该作者有条目，填写条目名称',
	'cite-accessdate-tooltip': '访问这个引用来源时的日期',
	'cite-id-tooltip': '其他的文章编号',
	'cite-samecontent-desc': '检查含有相同内容的多个参考文献',
	'cite-samecontent-error': '多个参考文献包含有相同内容',
	'cite-repeated-desc': '使用相同名字的多个参考文献',
	'cite-repeated-error': '多个参考文献使用了相同名字',
	'cite-undefined-desc': '未定义的参考文献',
	'cite-undefined-error': '一个已命名的参考文献已经使用但是没有定义',
	'cite-work-tooltip': '刊登该作品的出版物的名称。请不要使用斜体',
	'cite-newspaper-tooltip': '刊登該新聞的出版物名称',
	'cite-series-tooltip': '当书籍是一系列出版品中的其中一部份时使用',
	'cite-unified-tooltip': '中国大陆1980年代之前一段时期所使用的书籍编号',
	'cite-laysummary-tooltip': '该文献相关的新闻报道的URL',
	'cite-laysource-tooltip': '该文献相关的新闻报道的出处'
});

// Load configuration for site
// eslint-disable-next-line no-implicit-globals, no-unused-vars
var RefToolbarLocal = mw.loader.load('/index.php?title=MediaWiki:Gadget-RefToolbarConfig.js&action=raw&ctype=text/javascript&smaxage=21600&maxage=86400');
