/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-ImprovedUploadForm-main.js
 * @source commons.wikimedia.org/wiki/MediaWiki:UploadForm.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
'use strict';

/**
 * Upload form rewrite
 * Authors: Lupo, March 2008 - 2015
 * Multiple user script devloapers, 2015 -
 * License: Quadruple licensed GFDL, GPL, LGPL and Creative Commons Attribution 3.0 (CC-BY-3.0)
 * Choose whichever license of these you like best :-)
 */
/* eslint-disable camelcase, curly, max-statements-per-line, no-alert, no-bitwise, no-eval, no-new, no-useless-concat */
/* UFUtils, UFUI, UFHelp, UploadForm are made global (UFUI is used by HotCat) */
/* global Buttons, EditTools, LanguageHandler, Tooltip, TextCleaner, UIElements, FormRestorer */
/* global hotcat_set_state, hotcat_close_form, hotcat_get_state */ // by HotCat
/* global wgUploadLicenseObj, wgUploadWarningObj */

/* <nowiki> */
(function ($, mw) {
// Guard against multiple inclusions!
if (window.UploadForm) return;
mw.loader.load('/index.php?title=MediaWiki:Gadget-ImprovedUploadForm-LanguageHandler.js&action=raw&ctype=text/javascript&smaxage=3600&maxage=3600');
mw.loader.load('/index.php?title=MediaWiki:Gadget-ImprovedUploadForm-FormRestorer.js&action=raw&ctype=text/javascript&smaxage=3600&maxage=3600');
mw.loader.load('/index.php?title=MediaWiki:Gadget-ImprovedUploadForm-UIElements.js&action=raw&ctype=text/javascript&smaxage=3600&maxage=3600');
mw.loader.load('/index.php?title=MediaWiki:Gadget-ImprovedUploadForm-Tooltips.js&action=raw&ctype=text/javascript&smaxage=3600&maxage=3600');
var UFConfig = {
	// Configuration. These can be set by a user in their user js. The typeof checks
	// are not really needed when this script is globally enabled, but until then, we have to be
	// careful not to overwrite a user's settings if he defines these first.

	forcebasic: window.UploadForm_forcebasic !== undefined ? window.UploadForm_forcebasic :
	// eslint-disable-next-line es-x/no-array-prototype-keys
		!window.JSconfig || window.JSconfig.keys.UploadForm_newlayout ? null : true,
	// If non-null, use the basic form
	ownwork_author: window.UploadForm_ownwork_author !== undefined ? window.UploadForm_ownwork_author : '[[User:' + mw.config.get('wgUserName') + '|]]',
	// Change to use something else
	ownwork_date: window.UploadForm_ownwork_date !== undefined ? window.UploadForm_ownwork_date : null,
	// Set to define a pre-fill value for the date field
	own_language_first: window.UploadForm_own_language_first !== undefined ? window.UploadForm_own_language_first : false,
	// Set to true to have own language description on top
	additional_info_height: window.UploadForm_additional_info_height ? window.UploadForm_additional_info_height : 2,
	description_height: window.UploadForm_description_height ? window.UploadForm_description_height : 2,
	source_field_size: window.UploadForm_source_field_size ? window.UploadForm_source_field_size : 1,
	author_field_size: window.UploadForm_author_field_size ? window.UploadForm_author_field_size : 1,
	page_preview_in_tooltip: window.UploadForm_page_preview_in_tooltip !== undefined ? window.UploadForm_page_preview_in_tooltip : false,
	description_languages: window.UploadForm_description_languages ? window.UploadForm_description_languages : null,
	// If false, don't pre-fill description field in basic mode. May be useful
	// for people who have their own scripts pre-filling this field.
	autofill: window.UploadForm_autofill !== undefined ? window.UploadForm_autofill : true
};
var UFUtils = window.UFUtils = {
	makeLink: function makeLink(name, url) {
		var link = document.createElement('a');
		link.setAttribute('href', url);
		link.appendChild(document.createTextNode(name));
		return link;
	},
	convert_td_div: function convert_td_div(td) {
		// Replace the contents with a div, fixate the width, and give the div the id of the td
		var div = document.createElement('div');
		var w = UFUtils.getWidth(td);
		if (w) {
			td.setAttribute('width', String(w));
			td.style.maxWidth = String(w) + 'px';
		}
		div.setAttribute('width', 'auto');
		if (w) div.style.maxWidth = String(w) + 'px';

		// Clear the warningCell and add the div instead
		while (td.firstChild) {
			td.removeChild(td.firstChild);
		}
		td.appendChild(div);
		var id = td.id;
		td.id = '';
		div.id = id;
		return div;
	},
	getHeight: function getHeight(rows, minimum, maximum) {
		if (!rows || isNaN(rows / 2) || rows < minimum) return minimum; else if (rows > maximum) return maximum;
		return rows;
	},
	getWidth: function getWidth(element) {
		try {
			if (element.clientWidth) {
				// From IE, but Gecko has this, too.
				return element.clientWidth;
			} else if (window.getComputedStyle) {
				// Gecko, Opera
				return document.defaultView.getComputedStyle(element, null).getPropertyValue('width');
			}
		} catch (ex) {
			return null;
		}
	},
	isChildOf: function isChildOf(child, ancestor) {
		if (!ancestor) return false;
		while (child && child !== ancestor) {
			child = child.parentNode;
		}
		return child === ancestor;
	}
}; // end UFUtils

// Used by HotCat
var UFUI = window.UFUI = {
	// Encapsulate all UI stuff, with checks such that it works in degraded mode
	// (built-in defaults only) if UIElements doesn't exist.

	defaultLanguage: 'en',
	// Default.
	userLanguage: 'en',
	// Sanitized wgUserLanguage.
	internalLanguage: 'en',
	// Same, but with dashes replaced by underscores.
	isOwnWork: false,
	// True if uselang="*ownwork"
	isFromFlickr: false,
	// True if uselang="*fromflickr"
	isExperienced: false,
	// True if uselang="experienced"

	sanitizeUserLanguage: function sanitizeUserLanguage() {
		// Try to make sense of wgUserLanguage even if it has been hacked to have special
		// pages for particular upload sources. Also sets isOwnWork and isFromFlickr.
		var globalUserLanguage = mw.config.get('wgUserLanguage');
		if (!globalUserLanguage) return;
		UFUI.userLanguage = globalUserLanguage;
		if (globalUserLanguage.length > 3) {
			// Special "hacked" uselang parameters...
			var hacks = [ 'ownwork', 'fromflickr', 'experienced', 'fromwikimedia', 'fromgov' ];
			var found = false;
			for (var i = 0; i < hacks.length; i++) {
				var idx = globalUserLanguage.indexOf(hacks[i]);
				if (idx >= 0) {
					// ULS is not working correctly with hacked uselang parameters, thus hiding it.
					$('#pt-uls, .uls-tipsy').hide();
					found = true;
					if (idx) UFUI.userLanguage = globalUserLanguage.slice(0, Math.max(0, idx)); else UFUI.userLanguage = UFUI.defaultLanguage;
					if (!i) UFUI.isOwnWork = true; else if (i === 1) UFUI.isFromFlickr = true; else if (i === 2) UFUI.isExperienced = true;
					break;
				}
			}
			if (!found && typeof LanguageHandler !== 'undefined' && LanguageHandler.getPrefix instanceof Function) {
				// None of the "standard" hacks. Try an alternate approach.
				var lang_code_length = LanguageHandler.getPrefix(globalUserLanguage);
				if (lang_code_length && lang_code_length < globalUserLanguage.length) UFUI.userLanguage = globalUserLanguage.slice(0, Math.max(0, lang_code_length));
			}
		}
		if (UFUI.userLanguage === 'en-gb') UFUI.userLanguage = 'en';
		UFUI.internalLanguage = UFUI.userLanguage.replace(/-/g, '_');
	},
	defaultLabels: {
		wpSourceUploadLbl: '来源：',
		wpAuthorUploadLbl: '作者：',
		wpDateUploadLbl: '日期：',
		wpDescUploadLbl: '描述：',
		wpPermissionUploadLbl: '授权许可：',
		wpCategoriesUploadLbl: '分类：',
		wpOtherVersionsUploadLbl: '其他版本：',
		wpAdditionalInfoUploadLbl: '其他信息：',
		wpPreviewLicenseUploadLbl: '预览许可证信息',
		wpOwnWorkUploadLbl: '自己的作品',
		wpUnknownLanguageUploadLbl: '未知语言',
		wpPreviewUploadLbl: '预览',
		wpOkUploadLbl: '确定',
		wpCancelUploadLbl: '取消'
	},
	defaultErrorMsgs: {
		wpUploadWarningError: 'You must provide the original source of the image, the author of the work, and a license.',
		wpNoFilenameError: 'The target filename must not be empty.',
		wpHttpFilenameError: 'The target file name appears to be a URL.',
		wpNoSlashError: 'The target file name must not contain "/".',
		wpNondescriptFilenameError: 'Please use a more descriptive target file name.',
		wpNoExtensionError: 'The target file name must have a file type extension (like for example ".jpg").',
		wpIllegalExtensionError: 'Files of this type cannot be uploaded.',
		wpDoubleExtensionError: 'Please correct the double file type in the target file name.',
		wpFlickrURLError: 'The source must be a URL pointing to the image at Flickr.',
		wpNoDescriptionError: 'Please give a description of the contents of the file you want to upload.',
		wpNoHelpTextError: 'Help text not found.',
		wpPreviewOverwriteError: 'You will upload over an already existing file. Please choose a different filename,' + 'unless you are uploading a technically improved version of the same file.' + 'Don\'t overwrite a file with a different image of the same topic.' + 'If you overwrite, the information in this form will not appear on the description page.',
		wpReuploadNoSummaryError: 'Please describe the file changes in the text box.'
	},
	defaultHints: {
		wpUploadFormDestFileHint: '上传所使用的文件名。',
		wpUploadFormSourceHint: '文件的来源',
		wpUploadFormAuthorHint: '谁创建了这一文件（或文件所呈现的作品）？',
		wpUploadFormDateHint: '创建或首次发表本作品的日期。',
		wpUploadFormPermissionHint: '',
		wpUploadFormAdditionalInfoHint: '填写其他补充信息。',
		wpUploadFormCategoryHint: '点击“(+)”以增加分类。'
	},
	// Do *not* use "-" here (as in "be-tarask")!! Use "_" instead: "be_tarask".
	translate: {
		en: 'translate',
		af: 'vertaal',
		ar: 'ترجم',
		be: 'перакласці',
		be_tarask: 'перакласьці',
		br: 'treiñ',
		bg: 'превеждам',
		ca: 'traduïu',
		cs: 'přeložit',
		cy: 'cyfieithu',
		da: 'oversæt',
		de: 'übersetzen',
		el: 'μεταφράστε',
		eo: 'traduki',
		es: 'traducir',
		et: 'tõlkima',
		fa: '\u062A\u0631\u062C\u0645\u0647\u200C\u06A9\u0631\u062F\u0646',
		fi: 'suomenna',
		fo: 'umseta',
		fr: 'traduire',
		gl: 'traducir',
		he: 'לתרגם',
		hr: 'prevesti',
		hu: 'fordítás',
		hy: 'թարգմանել',
		id: 'terjemah',
		io: 'tradukar',
		is: 'þýða',
		it: 'tradurre',
		ja: '訳す',
		ko: '번역하기',
		la: 'traducere',
		mk: 'преведи',
		ml: '\u0D24\u0D30\u0D4D\u0D1C\u0D4D\u0D1C\u0D2E',
		mn: 'орчуулах',
		mt: 'traduci',
		nn: 'oversett',
		no: 'oversett',
		nl: 'vertalen',
		pap: 'tradusí',
		pl: 'przetłumacz',
		pt: 'traduzir',
		ro: 'a traduce',
		ru: 'перевести',
		sk: 'preložit',
		sl: 'perovodit',
		sq: 'përkthej',
		ss: 'kuhúmusha',
		sv: 'översätt',
		ta: 'மொழிபெயர்',
		tr: 'tercüme',
		ty: 'ʻauvaha',
		uk: 'перекласти',
		vi: 'dịch',
		zh: '翻譯',
		zh_min_nan: 'hoan-e̍k',
		nan: 'hoan-e̍k',
		minnan: 'hoan-e̍k'
	},
	labels: null,
	// Repository for form labels
	help: null,
	// Repository for help texts (and the help button)
	error_msgs: null,
	// Repository for error messages
	uiElements: null,
	// Repository for graphical UI elements
	hints: null,
	// Repository for brief hints

	setupRepositories: function setupRepositories() {
		if (!UFUI.labels) {
			if (window.UIElements) {
				var id;
				UFUI.labels = UIElements.emptyRepository();
				UFUI.help = UIElements.emptyRepository();
				UFUI.error_msgs = UIElements.emptyRepository();
				UFUI.uiElements = UIElements.emptyRepository();
				UFUI.hints = UIElements.emptyRepository();
				for (id in UFUI.defaultLabels) {
					if (id === 'wpDescUploadLbl') {
						UIElements.setEntry(id, UFUI.labels, document.createTextNode(UFUI.defaultLabels[id]));
					} else {
						UIElements.setEntry(id, UFUI.labels, document.createTextNode(UFUI.defaultLabels[id]));
					}
				}
				for (id in UFUI.defaultErrorMsgs) {
					if (Object.prototype.hasOwnProperty.call(UFUI.defaultErrorMsgs, id)) {
						UIElements.setEntry(id, UFUI.error_msgs, document.createTextNode(UFUI.defaultErrorMsgs[id]));
					}
				}
				for (id in UFUI.defaultHints) {
					if (Object.prototype.hasOwnProperty.call(UFUI.defaultHints, id)) {
						UIElements.setEntry(id, UFUI.hints, document.createTextNode(UFUI.defaultHints[id]));
					}
				}

				// Now try to read the localized stuff from the uploadfooter.
				UIElements.load('wpUploadFormLabels', null, 'span', UFUI.labels);
				UIElements.load('wpUploadFormErrorMessages', null, 'span', UFUI.error_msgs);
				UIElements.load('wpUploadFormHints', null, 'span', UFUI.hints);
				UIElements.load('wpUploadFormUIElements', null, 'div', UFUI.uiElements);
				UIElements.load('wpUploadFormHelp', null, 'div', UFUI.help);
				UFUI.basic = false;
			} else {
				UFUI.labels = UFUI.defaultLabels;
				UFUI.error_msgs = UFUI.defaultErrorMsgs;
				UFUI.hints = UFUI.defaultHints;
				UFUI.basic = true;
			}
		}
	},
	// eslint-disable-next-line no-unused-vars
	getUI: function getUI(id, repository, basic) {
		if (!UFUI.labels) {
			UFUI.sanitizeUserLanguage();
			UFUI.setupRepositories();
		}
		if (!UFUI[repository]) return null;
		var result = null;
		if (UFUI.basic) {
			result = document.createTextNode(UFUI[repository][id]);
		} else {
			result = UIElements.getEntry(id, UFUI[repository], UFUI.internalLanguage, null);
			if (!result) result = UIElements.getEntry(id, UFUI[repository]);
			if (!result) return null;
			// Hmmm... what happened here? We normally have defaults...
			result = result.cloneNode(true);
		}
		return result;
	},
	getLabel: function getLabel(id, basic) {
		return UFUI.getUI(id, 'labels', basic);
	},
	getErrorMsg: function getErrorMsg(id, basic) {
		return UFUI.getUI(id, 'error_msgs', basic);
	},
	getHint: function getHint(id, basic) {
		return UFUI.getUI(id, 'hints', basic);
	},
	getEntry: function getEntry(id, repository, lang, sel) {
		if (!UFUI.labels) {
			UFUI.sanitizeUserLanguage();
			UFUI.setupRepositories();
		}
		if (!UFUI.basic) return UIElements.getEntry(id, UFUI[repository], lang, sel);
		if (!UFUI[repository] || lang !== UFUI.defaultLanguage || !!sel && sel !== 'default') return null;
		return UFUI[repository][id];
	}
}; // end UFUI

var UFHelp = window.UFHelp = {
	// Collects all help-related stuff
	help_close_imgs: null,
	precreate_tooltip_closer: function precreate_tooltip_closer() {
		if (window.Tooltip && window.Buttons) {
			var closeImgs = UFUI.getEntry('wpUploadFormHelpCloseButton', 'uiElements', UFUI.internalLanguage);
			if (!closeImgs) closeImgs = UFUI.getEntry('wpUploadFormHelpCloseButton', 'uiElements');
			if (closeImgs) closeImgs = closeImgs.getElementsByTagName('img');
			if (!closeImgs || !closeImgs.length) closeImgs = null; else closeImgs = Buttons.createClass(closeImgs, 'wpUploadFormHelpCloseClass');
			UFHelp.help_close_imgs = closeImgs;
		}
	},
	tooltip_styles: {
		// The style for all our tooltips
		border: '1px solid #88A',
		backgroundColor: '#f7f8ff',
		padding: '0.3em',
		fontSize: 'auto'
		// Scale up to default text size
	},

	getHelp: function getHelp(help_id, with_ext) {
		// This is a Tooltip callback! Sets the help texts dynamically, depending of the file
		// type the user has chosen in wpDestFile.
		var fn = null;
		if (with_ext) {
			fn = document.getElementById('wpDestFile');
			if (fn) fn = fn.value;
			if (fn) {
				fn = fn.split('.');
				if (fn.length >= 2) fn = fn[fn.length - 1]; else fn = null;
			}
		}
		var extensions = [ fn, 'default' ];
		var helpMain = null;
		for (var i = 0; i < extensions.length && !helpMain; i++) {
			if (extensions[i] && extensions[i].length) {
				helpMain = UFUI.getEntry(help_id, 'help', UFUI.internalLanguage, extensions[i]);
				if (!helpMain) {
					helpMain = UFUI.getEntry(help_id, 'help', null, extensions[i]);
				}
			}
		}
		var help_base = UFUI.getEntry(help_id, 'help', UFUI.internalLanguage);
		if (!help_base) {
			help_base = UFUI.getEntry(help_id, 'help');
		}
		var help = document.createElement('div');
		if (help_base) help.appendChild(help_base);
		if (helpMain) help.appendChild(helpMain);
		if (!helpMain && !help_base) help.appendChild(UFUI.getErrorMsg('wpNoHelpTextError'));
		return help;
	},
	showHelp: function showHelp(e, id) {
		// Onclick handler for setup without tooltips
		e = e || window.event;
		var node = e.target || e.srcElement,
			error;
		if (!node) {
			error = UFUI.getErrorMsg('wpNoHelpTextError', true);
			// We need the text contents...
			while (error && error.nodeType !== Node.TEXT_NODE) {
				error = error.firstChild;
			}
			if (error) alert(error.data);

			// Otherwise what??
		} else if (!document.getElementById(id + '_Div')) {
			var help = UFHelp.getHelp(id, false);
			help.style.fontSize = 'small';
			help.style.color = '#666';
			// Now add a new table row after the current one
			var tr = node.parentNode;
			while (tr && tr.nodeName.toLowerCase() !== 'tr') {
				tr = tr.parentNode;
			}
			if (!tr) {
				error = UFUI.getErrorMsg('wpNoHelpTextError', true);
				while (error && error.nodeType !== 3) {
					error = error.firstChild;
				}
				if (error) alert(error.data);
			} else {
				var new_tr = document.createElement('tr');
				var cell = document.createElement('td');
				new_tr.appendChild(cell);
				cell = document.createElement('td');
				cell.id = id + '_Div';
				new_tr.appendChild(cell);
				tr.parentNode.insertBefore(new_tr, tr.nextSibling);
				cell = UFUtils.convert_td_div(cell);
				cell.appendChild(help);
			}
		}
		if (e.stopPropagation) {
			e.stopPropagation();
			e.preventDefault();
		} else {
			e.cancelBubble = true;
		}
		return false;
	},
	setupHelp: function setupHelp(is_reupload) {
		var fields = [ 'wpUploadFile', 'wpUploadFileURL', 'wpDestFile', 'wpSource', 'wpAuthor', 'wpDate', 'wpDesc', 'wpPermission', 'wpOtherVersions', 'wpAdditionalInfo', 'wpPatent', 'wpLicense', 'wpCategories', 'wpWatchthis', 'wpIgnoreWarning' ];
		if (!UFUI.help) return;
		// Help not loaded

		// eslint-disable-next-line no-shadow
		function setHelp(id, imgs, lk, maximum_width, is_reupload) {
			// Figure out where to place the help "button"
			var field = document.getElementById(id);
			var insert_in = null,
				before = null;
			var help_id = id + 'Help';
			if (!UFUI.help[help_id]) return;
			// Don't add if we have no help at all.
			var offset = -5; // Pixels.
			switch (id) {
				case 'wpWatchthis':
				case 'wpIgnoreWarning':
					// Right of the element
					if (!field) return;
					insert_in = field.parentNode;
					// Find the label.
					var lbls = insert_in.getElementsByTagName('label');
					if (!lbls) {
						before = field.nextSibling;
					} else {
						for (var i = 0; i < lbls.length; i++) {
							if (lbls[i].htmlFor && lbls[i].htmlFor === id) {
								before = lbls[i].nextSibling;
								break;
							}
						}
					}
					offset = Math.abs(offset);
					break;
				case 'wpCategories':
					field = document.getElementById('hotcatLabelTranslated');
					if (!field) return;
					insert_in = field;
					before = null;
					if (field.firstChild) {
						field = field.firstChild;
						offset = Math.abs(offset);
					}
					break;
				case 'wpAuthor':
				case 'wpSource':
					if (!field) return;
					field = field.parentNode; // Because the field itself may vanish.
					insert_in = field.parentNode.cells[0];
					before = null;
					break;
				case 'wpDestFile':
					if (!field) return;
					insert_in = field.parentNode.parentNode.cells[0];
					before = null;
					if (is_reupload) {
						help_id = 'wpReuploadDestHelp';
						field = null; // Field is hidden: attach the help text to the button instead
					}

					break;
				case 'wpDesc':
					if (!field) {
						field = document.getElementById('wpUploadDescription');
						if (field) {
							// Basic form
							help_id = is_reupload ? 'wpReuploadSummaryHelp' : 'wpUploadDescriptionHelp';
						} else {
							insert_in = document.getElementById('wpDescLabel');
							if (!insert_in) return;
							field = insert_in;
							offset = Math.abs(offset);
							before = insert_in.nextSibling;
							insert_in = insert_in.parentNode;
							break;
						}
					}
					/* falls through */

				case 'wpPatent':
					field = document.getElementsByName(id)[0];
					if (!field) return;
					insert_in = field.parentNode.parentNode.parentNode.cells[0];
					before = null;
					break;
				default:
					if (!field) return;

					// In the table cell to the left
					insert_in = field.parentNode.parentNode.cells[0];
					before = null;
			}
			// Create and insert the help "button"
			var button_construct = null,
				button = null;
			if (imgs && window.Buttons) {
				button = Buttons.makeButton(imgs, id + '_HelpButton', '#');
				button.style.position = 'relative';
				button.style.top = '-0.4em';
				button_construct = button;
			} else {
				button_construct = lk.cloneNode(true);
				button = button_construct.getElementsByTagName('a')[0];
			}
			insert_in.insertBefore(button_construct, before);
			if (window.Tooltip) {
				// Create the tooltip
				new Tooltip(button, function () {
					return UFHelp.getHelp(help_id, true);
				}, {
					activate: Tooltip.CLICK,
					deactivate: UFHelp.help_close_imgs ? Tooltip.CLICK_ELEM : Tooltip.CLICK_TIP | Tooltip.CLICK_ELEM | Tooltip.LOSE_FOCUS,
					close_button: UFHelp.help_close_imgs,
					mode: Tooltip.FIXED,
					fixed_offset: {
						x: 10,
						y: offset
					},
					max_pixels: maximum_width,
					target: field,
					open_delay: 0,
					hide_delay: 0
				}, UFHelp.tooltip_styles);
			} else {
				// Alternative setup without Tooltips: insert help text statically in a table field
				// below the button.
				button.onclick = function (evt) {
					return UFHelp.showHelp(evt, help_id);
				};
			}
		}
		var button_imgs = null,
			button_lk = null;
		if (window.Buttons) {
			button_imgs = UFUI.getEntry('wpUploadFormHelpOpenButton', 'uiElements', UFUI.internalLanguage);
			if (!button_imgs) button_imgs = UFUI.getEntry('wpUploadFormHelpOpenButton', 'uiElements');
			button_lk = null;
			if (button_imgs) button_imgs = button_imgs.getElementsByTagName('img');
		}
		if (!button_imgs || !button_imgs.length) {
			// Alternative text-based "button"
			button_lk = document.createElement('sup');
			button_lk.appendChild(document.createElement('b'));
			button_lk.firstChild.appendChild(document.createTextNode(' ['));
			button_lk.firstChild.appendChild(UFUtils.makeLink('?', '#'));
			button_lk.firstChild.appendChild(document.createTextNode(']'));
			button_imgs = null;
		} else {
			button_imgs = Buttons.createClass(button_imgs, 'wpUploadFormHelpOpenClass');
		}
		var widest_field = document.getElementById('wpAdditionalInfo');
		var max_width = 0;
		if (!widest_field) widest_field = document.getElementById('wpUploadDescription');
		if (widest_field) {
			var w = UFUtils.getWidth(widest_field);
			try {
				max_width = Math.round(w * 0.9);
			} catch (ex) {
				max_width = 0;
			}
		}
		fields.forEach(function (f) {
			setHelp(f, button_imgs, button_lk, max_width, is_reupload);
		});
	}
}; // end UFHelp

var UFFixes = {
	fixAutocompletion: function fixAutocompletion() {
		// Do the overwrite check also for selections from the browser's "previous entry list"
		var destFile = document.getElementById('wpDestFile');
		if (destFile && destFile.onkeyup) {
			// For some reason, onchange doesn't fire upon autocompletion in FF and IE6. Don't use
			// onblur (recommended as a workaround on some Internet sites), it cancels button clicks
			// that cause the focus change. Unfortunately, FF also doesn't fire the DOMAttrModified
			// event upon autocompletion. Thus we're stuck for FF. At least the FF people are about
			// to correct this bug (https://bugzilla.mozilla.org/show_bug.cgi?id=388558). On IE,
			// there is a workaround.
			if (window.ActiveXObject) {
				// We're on IE...
				// See http://msdn2.microsoft.com/en-us/library/ms533032.aspx and
				// http://msdn2.microsoft.com/en-us/library/ms536956.aspx
				if (!destFile.onpropertychange) {
					var previous_onkeyup_handler = destFile.onkeyup;
					var previous_onchange_handler = destFile.onchange;
					var handler = function handler(e) {
						e = e || window.event;
						if (e && e.propertyName && e.propertyName === 'value') {
							if (typeof previous_onkeyup_handler === 'string') eval(previous_onkeyup_handler); else if (previous_onkeyup_handler instanceof Function) previous_onkeyup_handler(e);
							if (typeof previous_onchange_handler === 'string') eval(previous_onchange_handler); else if (previous_onchange_handler instanceof Function) previous_onchange_handler(e);
						}
					};
					if (destFile.addEventListener) destFile.addEventListener('propertychange', handler); else if (destFile.attachEvent) destFile.attachEvent('onpropertychange', handler); else return;
					destFile.onkeyup = null; // Otherwise, both may fire...
					destFile.onchange = null;
				}
			} else {
				$(destFile).on('change', destFile.onkeyup);
				// addEvent (destFile, 'change', destFile.onkeyup);
			}
		}
	}
}; // end UFFixes

var UF = window.UploadForm = {
	isInstalled: false,
	// Set to true when the onload hook runs

	debug: false,
	// Can be set to true by adding "&debug=true" to the URL

	oldOnSubmit: null,
	// Possibly already existing onsubmit handler
	errorColor: 'lightpink',
	// The light red from Template:Copyvio
	formModified: false,
	isReupload: false,
	setup_hotcat_label: function setup_hotcat_label() {
		// If HotCat is present, translate its label if we can find it
		var hotcatLabelCell = document.getElementById('hotcatLabel');
		if (hotcatLabelCell) {
			// Change its ID, just to be sure
			hotcatLabelCell.setAttribute('id', 'hotcatLabelTranslated');
			// Assumes that the cell has only one child (which is normally the case)
			hotcatLabelCell.replaceChild(UFUI.getLabel('wpCategoriesUploadLbl'), hotcatLabelCell.firstChild);
		}
	},
	setup_error_display: function setup_error_display() {
		var warningCell = document.getElementById('wpDestFile-warning');
		if (!warningCell) return;
		var row = warningCell.parentNode;
		var new_cell = document.createElement('td');
		new_cell.style.padding = '0';
		// Remove the colspan, if any, and insert a new cell to the left
		warningCell.colspan = '';
		warningCell.padding = '0';
		row.insertBefore(new_cell, warningCell);
		UFUtils.convert_td_div(warningCell);
	},
	set_fields_enabled: function set_fields_enabled(enabled, except) {
		// Enables or disables all named fields in the form, except those whose ids are
		// listed in except
		var skip = except.join(' ');
		var elems = UF.the_form.elements;
		var changed = false;
		for (var i = 0; i < elems.length; i++) {
			if (elems[i].type === 'hidden') continue;
			// Don't fool around with hidden elements
			var id = elems[i].id;
			if (!id || !id.length) id = elems[i].name;
			if (id && id.length) {
				if (skip.indexOf(id) < 0) {
					if (elems[i].disabled === enabled) {
						changed = true;
						if (elems[i].type === 'text' || elems[i].type === 'textarea') {
							// Set the background. Actually, I'd like to just reset it to whatever the
							// default was, but setting it to null doesn't do anything in IE6... We
							// force a light gray for disabled fields since IE6 doesn't have a real
							// visual "disabled" indicator for input fields.
							try {
								elems[i].style.backgroundColor = enabled ? '#FFF' : '#EEE';
							} catch (some_error) {
								// Swallow
							}
						}
						elems[i].disabled = !enabled;
					}
				}
			}
		}
		if (changed) {
			// Clear warning messages. If we disabled fields, they're obsolete; if we enabled fields,
			// new warnings will be generated upon submit if necessary.
			var myWarning = document.getElementById('wpUploadVerifyWarning');
			if (myWarning) myWarning.style.display = 'none';
		}
	},
	previous_hotcat_state: null,
	getPrevValue: function getPrevValue(storedForm, element_id) {
		// Return a field's previous value, if known
		if (!storedForm || storedForm.length <= 1 || !element_id || !element_id.length) return null;
		for (var i = 1; i < storedForm.length; i++) {
			if (storedForm[i] && element_id === storedForm[i].id) return storedForm[i].val;
		}
		return null;
	},
	license_button: null,
	license_button_shown: false,
	current_license_preview: '&nbsp;',
	get_license_preview: function get_license_preview() {
		// Tooltip callback
		var div = document.createElement('div');
		div.style.display = 'none';
		document.body.appendChild(div);
		div.innerHTML = UF.current_license_preview;
		document.body.removeChild(div);
		div.style.fontSize = 'smaller';
		div.style.display = '';
		var wrapper = document.createElement('div');
		wrapper.appendChild(div);
		return wrapper;
	},
	create_license_button: function create_license_button() {
		// Will be called only from our rewritten wgUploadLicenseObj.showPreview, i.e.
		// we *know* that we *do* have Tooltips and Buttons here.
		var previewButton = UF.customFormButton('wpUploadFormPreviewLicenseButton',
			// Customization ID
			'wpUploadPreviewLicense',
			// ID of button
			null,
			// Default text
			null,
			// Event handler, will be set below
			'wpPreviewLicenseUploadLbl' // default label ID
		);

		new Tooltip(previewButton, UF.get_license_preview, {
			activate: Tooltip.CLICK,
			deactivate: UFHelp.help_close_imgs ? Tooltip.CLICK_ELEM : Tooltip.CLICK_TIP | Tooltip.CLICK_ELEM | Tooltip.LOSE_FOCUS,
			close_button: UFHelp.help_close_imgs,
			mode: Tooltip.FIXED,
			anchor: Tooltip.TOP_LEFT,
			fixed_offset: {
				x: 10,
				y: 5,
				dy: -1
			},
			open_delay: 0,
			hide_delay: 0
		}, UFHelp.tooltip_styles);
		UF.license_button = previewButton;
	},
	setup_license_preview: function setup_license_preview() {
		var preview_panel = document.getElementById('mw-license-preview');
		if (preview_panel) UFUtils.convert_td_div(preview_panel);

		// Change the license previewer to not overwrite our warning message, if any.
		if (window.wgUploadLicenseObj && wgUploadLicenseObj.showPreview && window.Tooltip) {
			wgUploadLicenseObj.showPreview = function (preview) {
				// eslint-disable-next-line no-shadow
				var preview_panel = document.getElementById('mw-license-preview');
				if (!preview_panel) return;
				if (preview === UF.current_license_preview) return;
				UF.current_license_preview = preview;
				var contents = null;
				var new_state = false;
				if (!preview || !preview.length || preview === '&nbsp;') {
					contents = document.createTextNode('\xa0'); // a single &nbsp;
					new_state = false;
				} else {
					if (!UF.license_button) UF.create_license_button();
					if (!UF.license_button_shown) contents = UF.license_button;
					new_state = true;
				}
				if (contents && new_state !== UF.license_button_shown) {
					if (preview_panel.firstChild) preview_panel.replaceChild(contents, preview_panel.firstChild); else preview_panel.appendChild(contents);
				}
				UF.license_button_shown = new_state;
			}; // end function
		}
	},

	preview_tooltip: null,
	// Tooltip, if preview so configured
	do_preview: null,
	// Function to call to actually generate the preview

	addPreviewButton: function addPreviewButton(handler) {
		// If we don't have Ajax, our preview won't work anyway.
		if (!window.XMLHttpRequest && !window.ActiveXObject) return;
		var uploadButton = document.getElementsByName('wpUpload')[0]; // Has no ID...
		// If we can't find the upload button, we don't know where to insert the preview button.
		if (!uploadButton) return;
		try {
			var previewButton = UF.customFormButton('wpUploadFormPreviewButton',
				// Customization ID
				'wpUploadPreview',
				// ID of button
				null,
				// Default text
				UF.generatePreview,
				// Event handler
				'wpPreviewUploadLbl' // default label ID
			);

			if (UFConfig.page_preview_in_tooltip && window.Tooltip) {
				UF.preview_tooltip = new Tooltip(previewButton, UF.getPreview, {
					activate: Tooltip.NONE,
					// We'll show it manually in generatePreview.
					deactivate: Tooltip.CLICK_TIP,
					close_button: UFHelp.help_close_imgs,
					mode: Tooltip.FIXED,
					target: uploadButton,
					anchor: Tooltip.TOP_LEFT,
					fixed_offset: {
						x: 0,
						y: 5,
						dy: -1
					},
					open_delay: 0,
					hide_delay: 0
				}, UFHelp.tooltip_styles);
			}
			UF.do_preview = handler;
			previewButton.setAttribute('style', 'margin-left:0.5em;');
			var hotKey = 'p';
			previewButton.setAttribute('accesskey', hotKey);
			if (!/\[\w+\]$/.test(previewButton.title)) previewButton.title += ' [' + hotKey + ']';
			if ($.fn.updateTooltipAccessKeys) {
				$('#t-print').remove(); // Not needed here and collides with same accesskey
				$(previewButton).updateTooltipAccessKeys();
			}
			uploadButton.parentNode.insertBefore(previewButton, uploadButton.nextSibling);
		} catch (ex) {}
	},
	getOwnWorkAuthor: function getOwnWorkAuthor() {
		if (typeof UFConfig.ownwork_author === 'string' && UFConfig.ownwork_author.search(/\S/) >= 0) {
			// It's a non-empty string
			return UFConfig.ownwork_author;
		}
		return '[[User:' + mw.config.get('wgUserName') + '|]]';
	},
	getOwnWorkSource: function getOwnWorkSource() {
		var text = UFUI.getLabel('wpOwnWorkUploadLbl', true);
		var result = null;
		try {
			// Must have a text node.
			while (text && text.nodeType !== Node.TEXT_NODE) {
				text = text.firstChild;
			}
			if (text) result = text.data.replace(/^\s+/, '').replace(/\s+$/, '');
		} catch (ex) {
			result = null;
		}
		if (!result) result = '{{own}} ' + UF.getOwnWorkAuthor();
		return result;
	},
	customFormButton: function customFormButton(ui_id, id, defaultText, handler, defaultId) {
		function getButtonSpan(container, idx) {
			if (!container) return null;
			var spans = container.getElementsByTagName('span');
			var span = null;
			if (!spans || spans.length <= idx) {
				// No spans... if idx is zero, try simply to take the first text node within container.
				if (!idx) span = container;
			} else {
				span = spans[idx];
			}
			// Ok, let's see if we have some text...
			while (span && span.nodeType !== Node.TEXT_NODE) {
				span = span.firstChild;
			}
			if (span) return span.data.replace(/^\s+/, '').replace(/\s+$/, '');
			return null;
		}

		// eslint-disable-next-line no-shadow
		function getDefault(defaultText, defaultId) {
			if (!defaultText) {
				if (defaultId) {
					defaultText = UFUI.getLabel(defaultId, true);
					// Must have a text node
					while (defaultText && defaultText.nodeType !== Node.TEXT_NODE) {
						defaultText = defaultText.firstChild;
					}
					if (defaultText) defaultText = defaultText.data.replace(/^\s+/, '').replace(/\s+$/, '');
				} else {
					defaultText = 'X';
				} // Hmmm... a serious misconfiguration
			}

			return defaultText;
		}
		var button = null,
			imgs = null;
		button = UFUI.getEntry(ui_id, 'uiElements', UFUI.internalLanguage);
		if (!button) button = UFUI.getEntry(ui_id, 'uiElements');
		if (button) imgs = button.getElementsByTagName('img');
		if (!imgs || !imgs.length || window.Buttons === undefined) {
			var buttonText = getButtonSpan(button, 0);
			if (!buttonText) buttonText = getDefault(defaultText, defaultId);
			var alternateText = getButtonSpan(button, 1);
			button = document.createElement('input');
			button.setAttribute('id', id);
			button.setAttribute('name', id);
			button.type = 'button';
			button.value = buttonText;
			if (alternateText) button.title = alternateText;
			button.onclick = handler;
		} else {
			button = Buttons.makeButton(imgs, id, handler);
		}
		return button;
	},
	the_form: null,
	// If a needed script that is included hasn't loaded yet, we try at most install_max_attempts
	// times install_delay. If it then still has not loaded, we install all the same, and the
	// setup routine will have to deal with it. (Note that script loading is asynchronous!)
	install_delay: 400,
	// Milliseconds
	installAttempts: 0,
	install_max_attempts: 6,
	// maximum delay 2.4s

	reallyInstall: function reallyInstall(force_basic) {
		if (this.installAttempts < this.install_max_attempts && (!window.LanguageHandler || !window.UIElements || !window.Tooltip)) {
			// Add needed scripts in the condition above.
			window.setTimeout(function () {
				UF.reallyInstall(force_basic);
			}, this.install_delay);
		} else {
			UFUI.sanitizeUserLanguage();
			var useBasic = force_basic || !!UFConfig.forcebasic || UFUI.isExperienced;
			if (useBasic && !force_basic) {
				// Only for autoconfirmed users!
				var is_auto = false;
				var userGroups = mw.config.get('wgUserGroups');
				if (userGroups) {
					for (var i = 0; i < userGroups.length && !is_auto; i++) {
						is_auto = userGroups[i] === 'autoconfirmed';
					}
				}
				if (!is_auto) useBasic = false;
			}
			try {
				UFHelp.precreate_tooltip_closer();
				this.setFileExtensions();
				if (useBasic || document.URL.indexOf('uploadformstyle=basic') > 0 || document.URL.search(/uselang=(\w|-)*fromwikimedia/) > 0) {
					// The fromwikimedia forms are special enough to warrant a special setup.
					// eslint-disable-next-line no-use-before-define
					UploadFormBasic.setup(!force_basic);
				} else {
					// eslint-disable-next-line no-use-before-define
					UploadFormFull.setup();
				}
				this.setup_error_display();
				UFHelp.setupHelp(this.isReupload);
				if (!this.isReupload) UFFixes.fixAutocompletion();
				this.setupOverwriteMsg();
				// Handle the "Upload new version" links, these have &wpDestFile=... in the URL, which
				// defeats overwrite detection. Because someone might construct such a URL manually
				// *not* actually overwriting an existing file, we still do the check:
				if (!this.isReupload) this.check_initial_dest_file();
			} catch (ex) {
				if (console && console.warn) console.warn(ex); else mw.log.warn(ex);

				// Not good at all. Something went badly wrong. If we have already modified the form,
				// the best thing is probably to reload and make sure we don't try again:
				if (this.formModified) {
					var reloadURL = document.URL;
					reloadURL += reloadURL.indexOf('?') > 0 ? '&' : '?';
					window.location.href = reloadURL + 'uploadformstyle=plain';
				}
			}
			// not needed at beginning
			mw.loader.load('/index.php?title=MediaWiki:TextCleaner.js&action=raw&ctype=text/javascript');
			$.when(mw.loader.using('ext.gadget.HotCat'), $.ready).then(this.setup_hotcat_label);
			this.removeSpinner();
		}
		this.installAttempts++;
	},
	removeSpinner: function removeSpinner() {
		// Installed on ImprovedUploadForm.js
		if ($.removeSpinner) $.removeSpinner('UploadLoadingSpinner');
	},
	install: function install() {
		if (UF.isInstalled ||
      // Do this only once per page!
      document.URL.indexOf('uploadformstyle=plain') > 0 ||
      // We're disabled
      // Also don't do anything if we're not on an upload form.
      mw.config.get('wgCanonicalNamespace') !== 'Special' || mw.config.get('wgCanonicalSpecialPageName') !== 'Upload') return UF.removeSpinner();
		var form = document.getElementById('upload') || document.getElementById('mw-upload-form');
		var originalDesc = document.getElementById('wpUploadDescription');
		if (!form || !originalDesc) return; // Oops. Not good: bail out; don't do anything. (then there should be also no spinner)

		var reupload = document.getElementById('wpForReUpload');
		var destFile = document.getElementById('wpDestFile');
		if (reupload) {
			UF.isReupload = !!reupload.value;
		} else {
			UF.isReupload = destFile && (destFile.disabled || destFile.readOnly);
			$(form).append($('<input>').attr({
				type: 'hidden',
				name: 'wpChangeTags',
				value: 'OUploadForm'
			}));
		}
		if (destFile && !!destFile.disabled) {
			destFile.readOnly = true;
			destFile.disabled = false;
		}
		if (destFile && UF.isReupload) {
			destFile.onkeyup = function /* e */ () {};
			destFile.onchange = function /* e */ () {};
		}
		// Use the basic form if the description was set *initially*, or if it's a re-upload, or if it's a special
		// form
		var useBasic = originalDesc.defaultValue && originalDesc.defaultValue.length || UF.isReupload || document.URL.indexOf('uselang=nlwikilovesmonuments') > 0;
		UF.the_form = form;
		if (document.URL.indexOf('debug=true') > 0) UF.debug = true;
		UF.reallyInstall(useBasic);
	},
	check_initial_dest_file: function check_initial_dest_file() {
		var destFile = document.getElementById('wpDestFile');
		if (destFile && destFile.value && destFile.value.length && wgUploadWarningObj && wgUploadWarningObj.keypress instanceof Function) wgUploadWarningObj.keypress();
	},
	errorMsgs: null,
	warning_pushed: false,
	display_errors: function display_errors() {
		// Give user feedback about what is not ok.
		var myWarning = document.getElementById('wpUploadVerifyWarning');
		if (!myWarning) {
			// Find the upload button
			var uploadButton = document.getElementsByName('wpUpload');
			var warningBox = null;
			if (uploadButton) uploadButton = uploadButton[0];
			if (!uploadButton) {
				warningBox = document.getElementById('wpDestFile-warning');
				if (!warningBox) return;
				// We just have the field colors to indicate errors...
			}

			myWarning = document.createElement('div');
			myWarning.style.border = '1px #F00 solid';
			myWarning.style.backgroundColor = UF.errorColor;
			myWarning.style.padding = '0.5em';
			myWarning.style.marginTop = '0.5em';
			myWarning.style.marginBottom = '0.5em';
			myWarning.setAttribute('id', 'wpUploadVerifyWarning');
			myWarning.setAttribute('width', 'auto');
			myWarning.style.display = 'none';
			if (uploadButton) uploadButton.parentNode.insertBefore(myWarning, uploadButton); else warningBox.parentNode.insertBefore(myWarning, warningBox.nextSibling);
		}
		// Now collect all the error messages into one div.
		var msgs = document.createElement('ul');
		msgs.style.paddingLeft = '1.0em';
		msgs.style.marginLeft = '0';
		for (var i = 0; i < UF.errorMsgs.length; i++) {
			var msg = UFUI.getErrorMsg(UF.errorMsgs[i]);
			if (msg) {
				var li = document.createElement('li');
				li.appendChild(msg);
				msgs.appendChild(li);
			}
		}
		UF.errorMsgs = null;
		// And then display the messages
		if (myWarning.firstChild) myWarning.replaceChild(msgs, myWarning.firstChild); else myWarning.appendChild(msgs);
		myWarning.style.display = 'block';
	},
	call_onsubmit: function call_onsubmit(evt) {
		var doSubmit = true;
		if (UF.oldOnSubmit) {
			if (typeof UF.oldOnSubmit === 'string') doSubmit = eval(UF.oldOnSubmit); else if (UF.oldOnSubmit instanceof Function) doSubmit = UF.oldOnSubmit(evt);
		}
		return doSubmit;
	},
	templates: [ {
		name: 'information',
		fields: [ 'description', 'date', 'source', 'author', 'permission', 'other versions' ],
		extract: [ 3, 1, 0 ],
		desc_mandatory: true,
		regexp: null
	}, {
		name: 'painting',
		fields: [ 'Artist', 'Title', 'Year', 'Technique', 'Dimensions', 'Gallery', 'Location', 'Notes', 'Source', 'Permission', 'other_versions', 'Other versions' ],
		extract: [ 0, 8, 7 ],
		desc_mandatory: false,
		regexp: null
	}, {
		name: 'flickr',
		fields: [ 'description', 'flickr_url', 'title', 'taken', 'photographer_url', 'photographer', 'photographer_location', 'reviewer', 'permission' ],
		extract: [ [ 5, 4 ], 1, 0 ],
		desc_mandatory: true,
		regexp: null
	} ],
	empty_template: function empty_template(name) {
		if (!name) return null;
		var test_name = name.toLowerCase();
		for (var i = 0; i < UF.templates.length; i++) {
			if (UF.templates[i].name === test_name) {
				var result = '{{' + name;
				for (var j = 0; j < UF.templates[i].fields.length; j++) {
					result += '\n|' + UF.templates[i].fields[j] + '=';
					if (UFUI.isOwnWork && !i) {
						// Pre-fill some fields if we're on an own-work form and it's an
						// information-template
						// eslint-disable-next-line default-case
						switch (j) {
							case 1:
								// Date
								if (typeof UFConfig.ownwork_date === 'string' && UFConfig.ownwork_date.search(/\S/) >= 0) result += UF.clean(UFConfig.ownwork_date);
								break;
							case 2:
								// Source-field
								result += UF.clean(UF.getOwnWorkSource());
								break;
							case 3:
								// Author
								result += UF.clean(UF.getOwnWorkAuthor());
								break;
                // default: break;
						} // end switch
					} // end if information for ownWork
				}

				return result + '\n}}';
			}
		}
		return null;
	},
	extract_fields: function extract_fields(desc, template_idx, list) {
		// eslint-disable-next-line no-shadow
		function get(desc, field, regexp) {
			var match_start = new RegExp('\\n\\s*\\| *' + field + ' *\\=', 'i');
			var start = desc.match(match_start);
			if (!start) return null;
			var rest = desc.slice(Math.max(0, start.index + start[0].length));
			var end = rest.search(regexp);
			if (end < 0) return rest;
			return rest.slice(0, Math.max(0, end));
		}
		var result = list;
		var names = UF.templates[template_idx].fields;
		var extract = UF.templates[template_idx].extract;
		if (!UF.templates[template_idx].regexp) {
			// Build the regexp
			var regexp_str = '\\n\\s*(\\| *(' + names.join('|') + ') *\\=|\\}\\})';
			UF.templates[template_idx].regexp = new RegExp(regexp_str);
		}
		for (var i = 0; i < extract.length; i++) {
			var txt = null;
			if (extract[i] instanceof Array) {
				// It's an array giving alternatives...
				var alternatives = extract[i];
				for (var j = 0; j < alternatives.length; j++) {
					txt = get(desc, names[alternatives[j]], UF.templates[template_idx].regexp);
					if (txt && txt.search(/\S/) >= 0) break;
					// Non-empty: don't look further
					txt = null;
				}
			} else {
				txt = get(desc, names[extract[i]], UF.templates[template_idx].regexp);
			}
			if (txt) result[result.length] = txt;
			// Push one.
			// Don't use "if (txt)", it's false if the string is, but empty!
		}

		return result;
	},
	split_description: function split_description(desc) {
		if (!desc || !desc.length) return null;

		// Returns an array containing (in that order):
		// index of template, author, source, description
		for (var i = 0; i < UF.templates.length; i++) {
			var regexp = new RegExp('\\{\\{' + UF.templates[i].name + '\\s*(\\||\\n)');
			var start = desc.toLowerCase().search(regexp);
			if (start >= 0) {
				var result = [ i ];
				// Now try to extract the fields:
				return UF.extract_fields(desc.slice(Math.max(0, start)), i, result);
			}
		}
		return null;
	},
	generatePreview: function generatePreview(evt) {
		if (UF.preview_tooltip && UF.preview_tooltip.popup.style.display !== 'none' && UF.preview_tooltip.popup.style.display) UF.preview_tooltip.hide_now(null); else UF.do_preview(evt || window.event);
	},
	outerHTML: function outerHTML(node) {
		if (!node) return '';
		if (node.nodeType === 3) return node.nodeValue;
		// Text node
		if (node.outerHTML) return node.outerHTML;
		var div = document.createElement('div');
		div.style.display = 'none';
		div.style.position = 'absolute';
		div.appendChild(node);
		document.body.appendChild(div);
		var txt = div.innerHTML;
		document.body.removeChild(div);
		return txt;
	},
	makePreview: function makePreview(description, is_overwrite) {
		if (is_overwrite) {
			UF.showPreview('<div style="border:1px solid red; padding:0.5em;"><div class="previewnote">' + UF.outerHTML(UFUI.getErrorMsg('wpPreviewOverwriteError')) + '</div></div>');
		} else {
			var text = '<div style="border:1px solid red;padding:0.5em;"><div class="previewnote">\n' + '{{MediaWiki:Previewnote/' + UFUI.userLanguage + '}}\n' + '</div>\n';
			var license = document.getElementById('wpLicense');
			var licenseText = null;
			if (license && license.selectedIndex > 0 && license.options[license.selectedIndex].value.length) licenseText = '{{' + license.options[license.selectedIndex].value + '}}';
			if (licenseText) {
				text += '<h2>{{int:filedesc}}</h2>\n' + description + '\n' + '<h2>{{int:license-header}}</h2>\n' + licenseText;
			} else {
				text += description + '\n';
			}
			// Add categories
			if (hotcat_get_state instanceof Function) {
				if ($('#catlinks').find('.hotcatlink').is(':hidden')) hotcat_close_form();
				var hotcat_categories = hotcat_get_state();
				if (hotcat_categories && hotcat_categories.length) {
					hotcat_categories = hotcat_categories.split('\n');
					for (var i = 0; i < hotcat_categories.length; i++) {
						if (hotcat_categories[i] && hotcat_categories[i].length) text += '[[Category:' + hotcat_categories[i] + ']]';
					}
				}
			}
			text += '</div>';

			// Make the Ajax call
			var req;
			if (window.XMLHttpRequest) req = new window.XMLHttpRequest();
			if (!req && window.ActiveXObject) {
				try {
					req = new window.ActiveXObject('Microsoft.XMLHTTP');
				} catch (any) {}
			}
			if (!req) return;
			var button = document.getElementById('wpUploadPreview');
			var page = document.getElementById('wpDestFile');
			if (page) page = page.value;
			if ($.fn.injectSpinner) $(button).injectSpinner('wpUploadPreviewSpinner');
			var uri = mw.config.get('wgServer') + (mw.util ? mw.util.wikiScript('api') : mw.config.get('wgScriptPath') + '/api.php');
			var args = 'action=parse&pst&text=' + encodeURIComponent(text) + (page ? '&title=File:' + encodeURIComponent(page.replace(/ /g, '_')) : '') + '&prop=text|categories&format=json';
			// "&pst" is "Pre-save transform": tilde replacement, pipe magic for links like [[foo|]].
			// Don't use a callback directly, add the function call ourselves *after* the call, since
			// the API somehow resolves tildes to an IP number instead of the username if a callback
			// is used. C.f. https://bugzilla.wikimedia.org/show_bug.cgi?id=16616
			// Apparently, that's a feature, not a bug...
			var request_length = uri.length + args.length + 1;
			if (request_length > 2000) {
				// Long URLs are problematic for GET requests
				req.open('POST', uri, true);
				req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			} else {
				uri += '?' + args;
				args = null;
				req.open('GET', uri, true);
			}
			req.setRequestHeader('Pragma', 'cache=no');
			req.setRequestHeader('Cache-Control', 'no-transform');
			req.onreadystatechange = function () {
				if ($.removeSpinner) $.removeSpinner('wpUploadPreviewSpinner');
				if (req.readyState !== 4 || req.status !== 200) return;

				// Add the "callback"...
				if (req.responseText) UF.jsonPreview(JSON.parse(req.responseText));
			};
			req.send(args);
		}
	},
	jsonPreview: function jsonPreview(result) {
		if (result && result.parse && result.parse.text && result.parse.text['*']) {
			var txt = result.parse.text['*'];
			var categories = result.parse.categories;
			if (categories && categories.length) {
				// Add a mock-up of a category bar. We don't care about non-existing categories, and we
				// can't identify hidden categories.
				var catbar = '<div class="catlinks"><div id="mw-normal-catlinks">' + UF.outerHTML(UFUI.getLabel('wpCategoriesUploadLbl'));
				categories.sort(function (a, b) {
					var key_a = a['*'].toLowerCase(),
						key_b = b['*'].toLowerCase();
					if (key_a < key_b) return -1;
					if (key_a > key_b) return 1;
					return 0;
				});
				for (var i = 0; i < categories.length; i++) {
					var catname = categories[i]['*'];
					if (catname && catname.length) {
						if (i > 0) catbar += ' |';
						catbar += ' <a href="/wiki/Category:' + encodeURI(catname) + '">' + catname.replace(/_/g, ' ') + '</a>';
					}
				}
				catbar += '</div></div>';
				// Now insert it into text.
				var end = txt.lastIndexOf('</div>');
				txt = txt.slice(0, Math.max(0, end)) + catbar + '</div>';
			}
			UF.showPreview(txt);
		}
	},
	showPreview: function showPreview(result) {
		if (UF.preview_tooltip) {
			UF.preview_content = result;
			UF.preview_tooltip.show_tip(null, false);
		} else {
			var preview = document.getElementById('wpUploadPreviewDisplay');
			if (!preview) {
				var before = document.getElementById('mw-upload-permitted');
				if (!before || UFUtils.isChildOf(before, UF.the_form)) before = UF.the_form;
				if (!before) return;
				// Don't know where to insert preview display. Error message here?
				preview = document.createElement('div');
				preview.setAttribute('id', 'wpUploadPreviewDisplay');
				before.parentNode.insertBefore(preview, before);
			}
			try {
				preview.innerHTML = result;
			} catch (ex) {
				preview.innerHTML = ''; // Error message here instead?
			}

			preview.style.display = ''; // Show it
		}
	},

	hidePreview: function hidePreview() {
		if (UF.preview_tooltip) {
			UF.preview_tooltip.hide_now(null);
		} else {
			var preview = document.getElementById('wpUploadPreviewDisplay');
			if (preview) preview.style.display = 'none';
		}
	},
	getPreview: function getPreview() {
		// Callback for the tooltip
		var div = document.createElement('div');
		div.style.display = 'none';
		document.body.appendChild(div);
		div.innerHTML = UF.preview_content;
		document.body.removeChild(div);
		div.style.fontSize = 'smaller';
		div.style.display = '';
		var wrapper = document.createElement('div');
		wrapper.appendChild(div);
		return wrapper;
	},
	licenses_regexp: /\{\{(self|pd|gfdl|cc|l?gpl|fal|cecill|attribution|copyrighted free use|SOlicence|geograph|UN map|BArch-License|Apache)/i,
	user_license_regexp: new RegExp('\\{\\{[Ss]ubst:[Uu]ser:' + (mw.config.get('wgUserName') || 'null').replace(/([\\^$.?*+()[\]|{}])/g, '\\$1') + '/'),
	has_license: function has_license(fields) {
		if (!fields || !fields.length) return false;
		for (var i = 0; i < fields.length; i++) {
			if (fields[i]) {
				if (typeof fields[i] === 'string') {
					if (fields[i].search(UF.licenses_regexp) >= 0) return true;
				} else {
					if (fields[i].value.search(UF.licenses_regexp) >= 0) return true;
				}
			}
		}
		for (var j = 0; j < fields.length; j++) {
			if (fields[j]) {
				if (typeof fields[j] === 'string') {
					if (fields[j].search(UF.user_license_regexp) >= 0) return true;
				} else {
					if (fields[j].value.search(UF.user_license_regexp) >= 0) return true;
				}
			}
		}
		return false;
	},
	addAfterField: function addAfterField(elem_id, element) {
		if (!element) return;
		var elem = document.getElementById(elem_id);
		if (!elem) return;

		// Find enclosing table cell.
		while (elem && elem.nodeName.toLowerCase() !== 'td') {
			elem = elem.parentNode;
		}
		if (!elem) return;
		var container = document.createElement('div');
		container.style.fontSize = 'smaller';
		container.appendChild(element);
		elem.appendChild(container);
	},
	old_overwrite_warning: null,
	setupOverwriteMsg: function setupOverwriteMsg() {
		if (!window.wgUploadWarningObj || !wgUploadWarningObj.setWarning) return;
		var msg = document.createElement('div');
		msg.id = 'wpUploadFormScriptOverwriteWarning';
		msg.style.display = 'none';
		msg.style.color = 'red';
		msg.appendChild(UFUI.getErrorMsg('wpPreviewOverwriteError'));
		UF.addAfterField('wpDestFile', msg);
		UF.old_overwrite_warning = wgUploadWarningObj.setWarning;
		wgUploadWarningObj.setWarning = UF.overwriteMsg;
	},
	overwriteMsg: function overwriteMsg(warning) {
		if (!UF.old_overwrite_warning || UF.isReupload) return;

		// Make sure that 'this' is set to 'wgUploadWarningObj' in the call below!
		UF.old_overwrite_warning.apply(wgUploadWarningObj, [ warning ]);
		var is_overwrite = UF.isOverwrite();
		var my_overwrite_warning = document.getElementById('wpUploadFormScriptOverwriteWarning');
		if (my_overwrite_warning) my_overwrite_warning.style.display = is_overwrite ? '' : 'none';
		UF.set_fields_enabled(!is_overwrite, [ 'wpUploadFile', 'wpUploadFileURL', 'wpDestFile', 'wpUploadDescription', 'wpAdditionalInfo', 'wpLicense', 'wpWatchthis', 'wpIgnoreWarning', 'wpUpload' ]);
	},
	isOverwrite: function isOverwrite() {
		if (document.getElementById('wpUploadWarningFileexists')) return true;
		var destfileWarning = document.getElementById('wpDestFile-warning');
		if (!destfileWarning) return false;
		var destFile = document.getElementById('wpDestFile');
		if (!destFile || !destFile.value) return false;
		var lks = destfileWarning.getElementsByTagName('a');
		if (!lks || !lks.length) return false;

		// Trimmed, blanks replaced by underscores, first character capitalized
		var fn1 = destFile.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/ /g, '_');
		fn1 = fn1.slice(0, 1).toUpperCase() + fn1.slice(1);
		var fn0 = 'Image:' + fn1;
		fn1 = 'File:' + fn1;
		var script = mw.config.get('wgScript');
		var server = mw.config.get('wgServer');
		for (var i = 0; i < lks.length; i++) {
			var href = lks[i].getAttribute('href');
			if (!href || lks[i].className === 'new') continue;
			if (!href.indexOf(script) || !href.indexOf(server + script)) {
				var m = /[&?]title=([^&]*)/.exec(href);
				if (m && m.length > 1) href = m[1]; else href = null;
			} else {
				var prefix = mw.config.get('wgArticlePath').replace('$1', '');
				if (href.indexOf(prefix)) prefix = server + prefix;
				// Fully expanded URL?
				if (!href.indexOf(prefix)) href = href.slice(prefix.length); else href = null;
			}
			if (!href) continue;
			href = decodeURIComponent(href).replace(/ /g, '_');
			if (href === fn1 || href === fn0) return true;
		}
		return false;
	},
	allowedFileTypes: null,
	forbiddenFileTypes: null,
	badFileNames: /^(test|image|img|bild|example|(dsc|img)?(\s|_|-)*|\d{10}(\s|_|-)[0123456789abcdef]{10}(\s|_|-)[a-z])$/i,
	// Filenames that have only components (separated by periods) that fully match this regexp
	// are considered illegal. The second-but-last one catches DSC01234, or DSC_01234, or
	// DSC_012_34 or also filenames conatining only digits and non-alphanumeric characters.
	// The last catches Flickr's raw filenames. How to relax that last expression without catching
	// too many legit file names?
	// Matching is case-insensitive.

	extractFileExtensions: function extractFileExtensions(div) {
		var list = null;
		// Get a mw-upload-permitted or mw-upload-prohibited div, extracts all extensions listed
		var txt = div;
		while (txt && txt.nodeType !== 3) {
			txt = txt.lastChild;
		}
		if (!txt) return null;

		// Try to figure out which comma to use (localizeable through MediaWiki:Comma-separator!)
		if (txt.data.indexOf(',') >= 0) {
			// Standard
			txt = txt.data.split(',');
		} else if (txt.data.indexOf('،') >= 0) {
			// Arabic etc.
			txt = txt.data.split('،');
		} else if (txt.data.indexOf('、') >= 0) {
			// Chinese
			txt = txt.data.split('、');
		} else {
			return null;
		}
		if (!txt || !txt.length) return null;
		for (var i = 0; i < txt.length; i++) {
			var match = /(\w+)\W*$/.exec(txt[i]);
			if (match) {
				match = match[1].toLowerCase(); // The extension
				if (!list) list = {};
				list[match] = true;
			}
		}
		return list;
	},
	setFileExtensions: function setFileExtensions() {
		var fileExts = mw.config.get('wgFileExtensions');
		if (fileExts) {
			// New as of 2009-09-17
			UF.allowedFileTypes = {};
			for (var i = 0; i < fileExts.length; i++) {
				UF.allowedFileTypes[fileExts[i]] = true;
			}
			UF.forbiddenFileTypes = null;
			return;
		}
		UF.allowedFileTypes = UF.extractFileExtensions(document.getElementById('mw-upload-permitted'));
		UF.forbiddenFileTypes = UF.extractFileExtensions(document.getElementById('mw-upload-prohibited'));
		if (UF.allowedFileTypes) {
			// Alternate OGG extensions
			if (UF.allowedFileTypes.ogg) {
				if (!UF.forbiddenFileTypes || !UF.forbiddenFileTypes.ogv) UF.allowedFileTypes.ogv = true;
				if (!UF.forbiddenFileTypes || !UF.forbiddenFileTypes.oga) UF.allowedFileTypes.oga = true;
				if (!UF.forbiddenFileTypes || !UF.forbiddenFileTypes.ogx) UF.allowedFileTypes.ogx = true;
			}
			// OpenDoc extensions (are these needed?)
			if (!UF.forbiddenFileTypes || !UF.forbiddenFileTypes.sxi) UF.allowedFileTypes.sxi = true;
			if (!UF.forbiddenFileTypes || !UF.forbiddenFileTypes.sxc) UF.allowedFileTypes.sxc = true;
			if (!UF.forbiddenFileTypes || !UF.forbiddenFileTypes.sxd) UF.allowedFileTypes.sxd = true;
			if (!UF.forbiddenFileTypes || !UF.forbiddenFileTypes.sxw) UF.allowedFileTypes.sxw = true;

			// PDF (allowed, but may be hidden in the interface)
			if (!UF.forbiddenFileTypes || !UF.forbiddenFileTypes.pdf) UF.allowedFileTypes.pdf = true;
		}
	},
	checkFileExtension: function checkFileExtension(ext, presence_only) {
		if (presence_only) {
			return UF.allowedFileTypes && UF.allowedFileTypes[ext] === true || UF.forbiddenFileTypes && UF.forbiddenFileTypes[ext] === true;
		}
		return (!UF.allowedFileTypes || UF.allowedFileTypes[ext] === true) && (!UF.forbiddenFileTypes || UF.forbiddenFileTypes[ext] !== true);
	},
	verifyFileName: function verifyFileName(filename) {
		if (!filename) {
			UF.errorMsgs.push('wpNoFilenameError');
			return false;
		}
		if (filename.search(/(https?|file|ftp):\/\//i) >= 0) {
			UF.errorMsgs.push('wpHttpFilenameError');
			return false;
		}
		var ok = true;

		// Don't allow slashes
		if (filename.indexOf('/') >= 0) {
			UF.errorMsgs.push('wpNoSlashError');
			ok = false;
		}
		// Check for double extensions
		var fn = filename.split('.');
		if (fn.length < 2 || !fn[fn.length - 1].length) {
			UF.errorMsgs.push('wpNoExtensionError');
			ok = false;
		}
		// Check extension
		var nof_extensions = 0;
		if (fn.length >= 2) {
			nof_extensions++;
			if (UF.checkFileExtension(fn[fn.length - 1].toLowerCase())) {
				// It's ok, check for double extension
				if (fn.length > 2) {
					if (UF.checkFileExtension(fn[fn.length - 2].toLowerCase(), true)) {
						nof_extensions++;
						UF.errorMsgs.push('wpDoubleExtensionError');
						ok = false;
					}
				}
			} else {
				UF.errorMsgs.push('wpIllegalExtensionError');
				ok = false;
			}
		}
		// Check for allowed file name
		var one_ok = false;
		for (var i = 0; i < fn.length - nof_extensions && !one_ok; i++) {
			if (fn[i].length && fn[i].search(UF.badFileNames) < 0) one_ok = true;
		}
		if (!one_ok) {
			UF.errorMsgs.push('wpNondescriptFilenameError');
			ok = false;
		}
		return ok;
	},
	cleaner: null,
	clean: function clean(input) {
		if (!UF.cleaner) {
			// Because of asynchronous script loading, we need to check whether the TextCleaner is
			// already defined. If not, just return the input.
			if (window.TextCleaner && TextCleaner.sanitizeWikiText instanceof Function) UF.cleaner = TextCleaner.sanitizeWikiText;
		}
		if (UF.cleaner && input && typeof input === 'string') return UF.cleaner(input, true);
		return input;
	},
	resetBg: function resetBg(e) {
		e = e || window.event; // W3C, IE
		return UF.verifyMandatoryField(e.target || e.srcElement);
	},
	verifyMandatoryField: function verifyMandatoryField(node, handler) {
		if (!node) return true;
		try {
			if (!node.value || node.value.search(/\S/) < 0 || handler && handler instanceof Function && handler.length === 1 && !handler(node.value)) {
				// No value set, or a handler was given and it is a function taking one parameter, and
				// it returned false
				var isError = node.id !== 'wpPermission';
				if (!isError) {
					var licenseField = document.getElementById('wpLicense');
					// Careful here. The fromwikimedia forms appear not to have a license selector!
					isError = !licenseField || !licenseField.selectedIndex;
				}
				if (isError) {
					node.style.backgroundColor = UF.errorColor;
					if (!UF.warning_pushed) {
						if (UF.errorMsgs) UF.errorMsgs.push('wpUploadWarningError');
						UF.warning_pushed = true;
					}
					return false;
				}
			}
		} catch (ex) {
			// Swallow the exception
		}
		try {
			node.style.backgroundColor = '#FFF';
		} catch (some_error) {
			// Swallow.
		}
		return true;
	},
	fixCategoryTransclusion: function fixCategoryTransclusion(str) {
		return str.replace(/(\{\{)\s*(:?\s*[Cc]ategory\s*:[^|}]*(\|[^}]*)?)(\}\})/g, '[[$2]]');
	}
}; // end UF

var UploadFormBasic = {
	onErrorForm: false,
	// True iff we're on a re-sent form (error case).

	setup: function setup(auto_fill) {
		// Special setup: don't use separate input fields; just verify the filename and that the
		// description isn't empty.
		var desc = document.getElementById('wpUploadDescription');
		var previousForm = null;
		UF.previous_hotcat_state = null;
		if (!UF.isReupload && FormRestorer) {
			var currentDestFile = document.getElementById('wpDestFile');
			var originalDestFile = null;
			if (currentDestFile) {
				currentDestFile = currentDestFile.value;
				originalDestFile = currentDestFile.defaultValue;
			}
			if (originalDestFile && originalDestFile.length) {
				// If originalDestFile was set to something, we're not on the original upload form but
				// on the re-sent form in error cases.
				UploadFormBasic.onErrorForm = true;
			} else if (currentDestFile && currentDestFile.length) {
				previousForm = FormRestorer.readForm('UploadFormBasic');
				if (!previousForm && desc && desc.value && desc.value.length) {
					// Hmmm... IE sometimes cannot read the cookie (because it wasn't stored, due to some
					// strange security settings on some computers that I've been unable to track down).
					// If we're here, we have a target file name *and* a description: assume the description
					// comes from the browser's field value cache and make sure we don't overwrite it.
					auto_fill = false;
				}
			}
			if (previousForm) {
				var additionalData = previousForm[0].val;
				if (additionalData) {
					additionalData = additionalData.split('\t');
					var previousFile = additionalData[0];
					if (previousFile === currentDestFile) {
						if (additionalData.length >= 2) UF.previous_hotcat_state = additionalData[1];
					} else {
						previousForm = null;
					}
				}
			}
		}
		UF.formModified = true;
		if (document.getElementById('wpLicense')) UF.setup_license_preview();
		UF.oldOnSubmit = UF.the_form.onsubmit;
		UF.the_form.onsubmit = UploadFormBasic.submit;
		if (!UF.isReupload) UF.addPreviewButton(UploadFormBasic.preview);
		if (previousForm) {
			// Restore form values.
			if (desc) {
				var prev = UF.getPrevValue(previousForm, desc.id);
				if (prev) desc.value = prev;
			}
			if (UF.previous_hotcat_state && hotcat_set_state instanceof Function) {
				if ($('#catlinks').find('.hotcatlink').is(':hidden')) hotcat_close_form();
				UF.previous_hotcat_state = hotcat_set_state(UF.previous_hotcat_state);
			}
		} else {
			if (!!UFConfig.autofill && auto_fill && !UF.isReupload) {
				if (desc) desc.value = UF.empty_template('Information');
			}
		}
		if (desc && desc.value && desc.value.indexOf('{{Information') >= 0) {
			// Only hide the box in the Uploadtext if there is really an inormation-template in the
			// summary!
			var infobox = document.getElementById('Uploadtext-template-box');
			if (infobox) infobox.style.display = 'none';
		}
	},
	submit: function submit(evt) {
		var overwrite = false;
		if (!UF.isReupload) overwrite = UF.isOverwrite();
		if (!UploadFormBasic.verify(overwrite)) return false;
		if (!UF.isReupload) {
			var targetName = document.getElementById('wpDestFile');
			if (targetName && targetName.value) {
				// Strip whitespace
				targetName.value = targetName.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
			}
			if (!UploadFormBasic.onErrorForm && FormRestorer && targetName && targetName.value) {
				var hotcat_state = null;
				if (hotcat_get_state instanceof Function) {
					if ($('#catlinks').find('.hotcatlink').is(':hidden')) hotcat_close_form();
					hotcat_state = hotcat_get_state();
				}
				// We already know that targetName.value is set!
				FormRestorer.saveForm('UploadFormBasic', UF.the_form.id, targetName.value + (hotcat_state ? '\t' + hotcat_state : ''), ';path=' + document.location.pathname + ';max-age=1800');
				// Expire after half an hour.
			}
		} // end if (UF.isReupload)

		var desc = document.getElementById('wpUploadDescription');
		var old_desc_value = desc.value;
		var doSubmit = UF.call_onsubmit(evt || window.event);
		if (!doSubmit) {
			desc.value = old_desc_value;
		} else {
			desc.value = UF.fixCategoryTransclusion(UF.clean(desc.value));
			UF.hidePreview();
			document.getElementById('wpDestFile').disabled = false;
		}
		return doSubmit;
	},
	preview: function preview(/* e */
	) {
		var overwrite = UF.isOverwrite();
		if (!UploadFormBasic.verify(overwrite)) return false;
		var desc = document.getElementById('wpUploadDescription');
		UF.makePreview(UF.clean(desc.value), overwrite);
		return true;
	},
	verify: function verify(overwrite) {
		var desc = document.getElementById('wpUploadDescription');
		var ok = true;
		if (UF.isReupload) {
			// Only check that the description isn't empty
			if (UF.errorMsgs) delete UF.errorMsgs;
			UF.errorMsgs = [];
			UF.warning_pushed = false;
			if (!desc.value || desc.value.search(/\S/) < 0) {
				desc.style.backgroundColor = UF.errorColor;
				desc.onkeyup = UF.resetBg;
				UF.errorMsgs.push('wpReuploadNoSummaryError');
				ok = false;
			}
		} else {
			if (!overwrite) {
				if (UF.errorMsgs) delete UF.errorMsgs;
				UF.errorMsgs = [];
				UF.warning_pushed = false;
				if (!UF.verifyMandatoryField(desc)) {
					desc.onkeyup = UF.resetBg;
					ok = false;
				} else {
					// We do have a non-empty description. Try to split it up and check that the fields for
					// author, source, and description are filled in.
					var fields = UF.split_description(desc.value);
					if (fields && fields.length === 4) {
						if (!fields[1] || fields[1].search(/\S/) < 0 ||
              // Author
              !fields[2] || fields[2].search(/\S/) < 0 // Source
						) {
							desc.style.backgroundColor = UF.errorColor;
							desc.onkeyup = UF.resetBg;
							if (!UF.warning_pushed) {
								if (UF.errorMsgs) UF.errorMsgs.push('wpUploadWarningError');
								UF.warning_pushed = true;
							}
							ok = false;
						}
						if (UF.templates[fields[0]].desc_mandatory && (!fields[3] || fields[3].search(/\S/) < 0) // Description
						) {
							desc.style.backgroundColor = UF.errorColor;
							desc.onkeyup = UF.resetBg;
							UF.errorMsgs.push('wpNoDescriptionError');
							ok = false;
						}
					}
				}
				// Try a license check
				var license = document.getElementById('wpLicense');
				if (!license || !license.selectedIndex) {
					// There must be a license somewhere in the description.
					if (!UF.has_license([ desc ])) {
						var d = desc.value.replace(/\{\{\s*([Ii]nformation|[Pp]ainting|[Ff]lickr)\s*\n/g, '');
						if (d.indexOf('{{') < 0) {
							// No transcludion that could provide a license either
							desc.style.backgroundColor = UF.errorColor;
							desc.onkeyup = UF.resetBg;
							if (!UF.warning_pushed) {
								if (UF.errorMsgs) UF.errorMsgs.push('wpUploadWarningError');
								UF.warning_pushed = true;
							}
							ok = false;
						}
						// else assume it's ok.
					}
				} // end license check
				var targetName = document.getElementById('wpDestFile');
				if (targetName) {
					// Trim leading and trailing whitespace
					targetName.value = targetName.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
					if (!UF.verifyFileName(targetName.value)) {
						targetName.style.backgroundColor = UF.errorColor;
						targetName.onkeyup = function (evt) {
							UF.resetBg(evt);
							if (wgUploadWarningObj && wgUploadWarningObj.keypress instanceof Function && !UF.isReupload) wgUploadWarningObj.keypress();
						};
						ok = false;
					}
				}
			}
		} // end if (reupload or not)
		if (!ok) {
			UF.hidePreview();
			UF.display_errors();
		} else {
			// It's ok: hide our warning box
			var myWarning = document.getElementById('wpUploadVerifyWarning');
			if (myWarning) myWarning.style.display = 'none';
		}
		return ok;
	} // end verify
}; // end UploadFormBasic

var UploadFormFull = {
	form_type: 0,
	// 0 - single desc field; 1 - one desc field per language
	field_state: null,
	// Will be initialized in setup below.

	multi_inputs: null,
	// If we're using several description fields, this is an array of objects

	pushMultiInput: function pushMultiInput(sel, text) {
		if (!UploadFormFull.multi_inputs) {
			UploadFormFull.multi_inputs = [ {
				selector: sel,
				textfield: text
			} ];
		} else {
			UploadFormFull.multi_inputs[UploadFormFull.multi_inputs.length] = {
				selector: sel,
				textfield: text
			};
		}
		var idx = UploadFormFull.multi_inputs.length;
		sel.id = 'wpLangSel' + idx;
		sel.name = sel.id;
		text.id = 'wpDescText' + idx;
		text.name = text.id;
	},
	addDescField: function addDescField(content, lang, idx, storedForm) {
		var selector = LanguageHandler.getSelect(null, lang, UFUI.getLabel('wpUnknownLanguageUploadLbl', true));
		// These style definitions are needed for IE, which otherwise creates excessively wide
		// selectors, pushing the main form to the right.
		selector.style.maxWidth = 'auto';
		selector.style.width = 'auto';
		selector.style.overflow = 'hidden';
		var textfield = document.createElement('textarea');
		textfield.setAttribute('rows', UFUtils.getHeight(UFConfig.description_height, 2, 6));
		textfield.style.width = 'auto';
		UploadFormFull.pushMultiInput(selector, textfield);
		var newRow = content.insertRow(idx === null ? content.rows.length : idx);
		var firstCell = document.createElement('td');
		firstCell.classList.add('mw-label');
		firstCell.setAttribute('vAlign', 'top');
		firstCell.appendChild(selector);
		var secondCell = document.createElement('td');
		secondCell.classList.add('mw-input');
		secondCell.setAttribute('vAlign', 'top');
		secondCell.appendChild(textfield);
		newRow.appendChild(firstCell);
		newRow.appendChild(secondCell);
		if (storedForm) {
			var prev_idx = UF.getPrevValue(storedForm, selector.id);
			var prev_val = UF.getPrevValue(storedForm, textfield.id);
			if (prev_val !== null) textfield.value = prev_val;
			if (prev_idx !== null) {
				selector.options[selector.selectedIndex].selected = false;
				selector.options[prev_idx].selected = true;
			}
		}
		UploadFormFull.enableEdittools(textfield);
	},
	addOneDescField: function addOneDescField(/* e */
	) {
		// onclick handler for the button
		var button = document.getElementById('wpUploadAddDescription');
		var table_row = button.parentNode.parentNode;
		var idx = table_row.rowIndex;
		UploadFormFull.addDescField(table_row.parentNode, null, idx, null);
	},
	addMultiDesc: function addMultiDesc(table, idx, storedForm) {
		var i;

		// Add en and user language, if different
		var userLang = LanguageHandler.closestLanguage(UFUI.userLanguage);
		if (userLang === 'pt-br') userLang = 'pt';
		// Per request from Portuguese and Brazilians
		var firstCell = document.createElement('td');
		firstCell.classList.add('mw-label');
		var secondCell = document.createElement('td');
		var new_label = document.createElement('label');
		new_label.id = 'wpDescLabel';
		new_label.appendChild(UFUI.getLabel('wpDescUploadLbl'));
		firstCell.appendChild(new_label);
		var newRow = table.insertRow(idx);
		newRow.appendChild(firstCell);
		newRow.appendChild(secondCell);
		idx++;
		var added = false;
		if (storedForm) {
			// Maybe we had more... find 'wpLangSel1'
			var curr = 0;
			for (i = 1; i < storedForm.length; i++) {
				if (storedForm[i].id === 'wpLangSel1') {
					curr = i;
					break;
				}
			}
			if (curr > 0) {
				while (curr < storedForm.length && !storedForm[curr].id.indexOf('wpLangSel')) {
					UploadFormFull.addDescField(table, null, idx++, storedForm);
					added = true;
					curr++;
					if (curr < storedForm.length && !storedForm[curr].id.indexOf('wpDescText')) curr++;
				}
			}
		} // end if
		if (!added) {
			if (UFConfig.description_languages && UFConfig.description_languages instanceof Array && UFConfig.description_languages.length) {
				for (i = 0; i < UFConfig.description_languages.length; i++) {
					var lang = LanguageHandler.closestLanguage(UFConfig.description_languages[i]);
					UploadFormFull.addDescField(table, lang, idx++, storedForm);
				}
			} else {
				if (UFConfig.own_language_first) {
					if (userLang && userLang !== UFUI.defaultLanguage) UploadFormFull.addDescField(table, userLang, idx++, storedForm);
					UploadFormFull.addDescField(table, UFUI.defaultLanguage, idx++, storedForm);
				} else {
					UploadFormFull.addDescField(table, UFUI.defaultLanguage, idx++, storedForm);
					if (userLang && userLang !== UFUI.defaultLanguage) UploadFormFull.addDescField(table, userLang, idx++, storedForm);
				}
			}
		}
		// Now add a "+" button
		var additional = UF.customFormButton('wpUploadFormAddDescButton',
			// Customization ID
			'wpUploadAddDescription',
			// ID of button
			'+',
			// Default text
			UploadFormFull.addOneDescField // Event handler
		);

		newRow = table.insertRow(idx++);
		firstCell = document.createElement('td');
		secondCell = document.createElement('td');
		secondCell.classList.add('mw-input');
		secondCell.appendChild(additional);
		newRow.appendChild(firstCell);
		newRow.appendChild(secondCell);
		return idx;
	},
	changeField: function changeField(field_id) {
		// Callback for changeable field button
		function get_selection(field) {
			// Based on code from Jonas Raoni Soares Silva at http://jsfromhell.com/forms/selection
			// License: {{tl|attribution}}
			// Warning: simplified because we apply it only to an INPUT field. For TEXTAREAs, see the
			// URL given.
			if (field.selectionStart !== undefined) {
				return {
					start: field.selectionStart,
					end: field.selectionEnd
				};
			} else if (field.createTextRange) {
				field.focus();
				var s = document.selection.createRange();
				if (s.parentNode() !== field) {
					return {
						start: 0,
						end: 0
					};
				}
				var r = field.createTextRange();
				r.setEndPoint('EndToStart', s);
				return {
					start: r.text.length,
					end: r.text.length + s.text.length
				};
			}
			return {
				start: 0,
				end: 0
			};
		}
		var field = document.getElementById(field_id);
		if (field.disabled) return;
		// Don't do anything if the field isn't enabled.

		var button = document.getElementById(field_id + '_Button');
		var cell = field.parentNode;
		if (!field || !button || !cell) return;
		// Error message here?
		var newField = document.createElement('textarea');
		var height = UFUtils.getHeight(UploadFormFull.field_state[field_id].height, 2, 4);
		newField.setAttribute('rows', height);
		newField.style.maxWidth = 'auto';
		newField.value = field.value;
		var sel = get_selection(field);
		var tab_idx = field.getAttribute('tabindex');
		cell.removeChild(button);
		cell.replaceChild(newField, field);
		field.id = '';
		field.onfocus = null;
		newField.id = field_id;
		newField.setAttribute('tabindex', tab_idx);
		UploadFormFull.enableEdittools(newField);
		// Restore the selection
		if (newField.setSelectionRange) {
			// e.g. khtml
			newField.setSelectionRange(sel.start, sel.end);
		} else if (newField.selectionStart !== undefined) {
			newField.selectionStart = sel.start;
			newField.selectionEnd = sel.end;
		} else if (newField.createTextRange) {
			// IE
			var new_selection = newField.createTextRange();
			new_selection.move('character', sel.start);
			new_selection.moveEnd('character', sel.end - sel.start);
			new_selection.select();
		}
		newField.focus();
		UploadFormFull.field_state[field_id].height = height;
	},
	enableEdittools: function enableEdittools(textfield) {
		// To be called on each dynamically added field to ensure the edit toolbar works there
		if (window.EditTools && EditTools.registerTextField instanceof Function) {
			// We have EditTools
			var buttons = document.getElementById('specialchars');
			if (buttons && buttons.firstChild && buttons.firstChild.nodeName.toLowerCase() === 'select') {
				// EditTools is already set up: we have to add an onfocus handler ourselves
				$(textfield).on('focus', EditTools.registerTextField);
			}
			// Otherwise, EditTools will be set up later, and will catch this field, so we don't have
			// to do anything.
		}
	},

	switch_intro_text: function switch_intro_text() {
		// Set up the display of [[MediaWiki:Uploadtext]]
		var long_text = document.getElementById('wpUploadFormLongText');
		var short_text = document.getElementById('wpUploadFormShortText');
		if (long_text && short_text) {
			long_text.style.display = 'none';
			if (UFUtils.isChildOf(long_text, short_text)) {
				// If long_text is a child of short_text, then short_text is already shown, and
				// long_text is just a part that isn't needed for the new upload form. Hence
				// we're done.
				return;
			}
			if (UFUtils.isChildOf(short_text, long_text)) {
				// If the short_text is within the long_text, we need to take it out; otherwise
				// it won't be shown.
				short_text.parentNode.removeChild(short_text);
				long_text.parentNode.insertBefore(short_text, long_text.nextSibling);
			}
			short_text.style.display = '';
		} else {
			// Remove the redundant infobox in the uploadtext explanation. People should *not*
			// insert this template into description.
			var infobox = document.getElementById('Uploadtext-template-box');
			if (infobox) infobox.style.display = 'none';
		}
	},
	set_hints: function set_hints() {
		UF.addAfterField('wpDestFile', UFUI.getHint('wpUploadFormDestFileHint'));
		UF.addAfterField('wpSource', UFUI.getHint('wpUploadFormSourceHint'));
		UF.addAfterField('wpAuthor', UFUI.getHint('wpUploadFormAuthorHint'));
		UF.addAfterField('wpDate', UFUI.getHint('wpUploadFormDateHint'));
		UF.addAfterField('wpPermission', UFUI.getHint('wpUploadFormPermissionHint'));
		UF.addAfterField('wpAdditionalInfo', UFUI.getHint('wpUploadFormAdditionalInfoHint'));
		UF.addAfterField('catlinks', UFUI.getHint('wpUploadFormCategoryHint'));
	},
	setup: function setup() {
		function addField(table, idx, id, label, field, storedForm) {
			if (!label) label = UFUI.getLabel(id + 'UploadLbl');
			var newRow = table.insertRow(idx);
			var firstCell = document.createElement('td');
			firstCell.classList.add('mw-label');
			var new_label = document.createElement('label');
			new_label.htmlFor = id;
			new_label.appendChild(label);
			firstCell.appendChild(new_label);
			var secondCell = document.createElement('td');
			secondCell.classList.add('mw-input');
			field.setAttribute('name', id);
			field.setAttribute('id', id);
			secondCell.appendChild(field);
			newRow.appendChild(firstCell);
			newRow.appendChild(secondCell);
			var prev_value = UF.getPrevValue(storedForm, id);
			if (prev_value) field.value = prev_value;
			UploadFormFull.enableEdittools(field);
		}
		function addInput(table, idx, id, label, storedForm) {
			var newField = document.createElement('input');
			newField.setAttribute('type', 'text');
			addField(table, idx, id, label, newField, storedForm);
			UploadFormFull.enableEdittools(newField);
			return newField;
		}
		function addChangeableField(height, table, idx, id, label, storedForm) {
			var newField = null;
			var field_id = 'wp' + id;
			if (!height) height = UFUtils.getHeight(UploadFormFull.field_state[field_id].height, 1, 4);
			if (height > 1) {
				newField = document.createElement('textarea');
				newField.setAttribute('rows', height);
				newField.style.maxWidth = 'auto';
				addField(table, idx, 'wp' + id, null, newField, storedForm);
			} else {
				newField = addInput(table, idx, field_id, null, storedForm);
				var button = UF.customFormButton('wpUploadForm' + id + 'Button', field_id + '_Button', '...', function () {
					UploadFormFull.changeField(field_id);
				});
				newField.parentNode.insertBefore(button, newField.nextSibling);
			}
			UploadFormFull.field_state[field_id].height = height;
			UploadFormFull.enableEdittools(newField);
		}
		function setCheckBoxes(previousForm, boxes) {
			if (!boxes || !boxes.length || !previousForm) return;
			for (var i = 0; i < boxes.length; i++) {
				if (boxes[i]) {
					var prev_val = UF.getPrevValue(previousForm, boxes[i].id);
					if (prev_val) boxes[i].checked = prev_val;
				}
			}
		}

		// Init the field states. Cannot be done earlier, otherwise definitions in user's JS won't be taken aboard.
		UploadFormFull.field_state = {
			wpSource: {
				height: UFConfig.source_field_size
			},
			wpAuthor: {
				height: UFConfig.author_field_size
			}
		};
		var previousForm = null;
		var previous_type = -1; // unknown
		var previous_fields = [ 0, 0 ];
		UF.previous_hotcat_state = null;
		if (FormRestorer) {
			// We know that when we arrive here originally, wpDestFile.value is empty, as is
			// wpDestFile.defaultValue. If we entered something, submitted, and then come back,
			// modern browsers restore form entries, at least for the fields in the static XHTML.
			// wpDestFile is such a static field (it isn't added by Javascript), so if we have a
			// non-empty value here, we know that the form needs to restored. (But see the caveat
			// about IE and onload handling at the bottom of the file!)
			var currentDestFile = document.getElementById('wpDestFile');
			if (currentDestFile) currentDestFile = currentDestFile.value;
			if (currentDestFile && currentDestFile.length) previousForm = FormRestorer.readForm('UploadForm');
			if (previousForm) {
				var additionalData = previousForm[0].val;
				if (additionalData) {
					additionalData = additionalData.split('\t');
					var previousFile = additionalData[1];
					if (previousFile === currentDestFile) {
						previous_type = parseInt(additionalData[0], 10);
						previous_fields[0] = parseInt(additionalData[2], 10);
						previous_fields[1] = parseInt(additionalData[3], 10);
						if (additionalData.length >= 5) UF.previous_hotcat_state = additionalData[4];
					} else {
						previousForm = null;
					}
				}
			}
		}
		var originalDesc = document.getElementById('wpUploadDescription');
		var original_row = originalDesc.parentNode.parentNode;
		var table = original_row.parentNode;
		var original_idx = original_row.rowIndex;
		UF.formModified = true;
		originalDesc.setAttribute('id', '');
		UF.oldOnSubmit = UF.the_form.onsubmit;
		UF.the_form.onsubmit = UploadFormFull.submit;
		table.deleteRow(original_idx);
		var idx = original_idx;
		// Insert source field
		var newField = null;
		addChangeableField(previous_fields[0], table, idx++, 'Source', null, previousForm);
		addChangeableField(previous_fields[1], table, idx++, 'Author', null, previousForm);
		addInput(table, idx++, 'wpDate', null, previousForm);
		// Insert description field
		if (window.LanguageHandler === undefined || !previous_type) {
			// Basic setup
			newField = document.createElement('textarea');
			newField.setAttribute('rows', UFUtils.getHeight(UFConfig.description_height, 6, 12));
			newField.style.maxWidth = 'auto';
			// Do not name the new field 'wpUploadDescription', otherwise previous form
			// might prefill it with an information template!
			addField(table, idx++, 'wpDesc', null, newField, previousForm);
			UploadFormFull.form_type = 0;
		} else {
			idx = UploadFormFull.addMultiDesc(table, idx, previousForm);
			UploadFormFull.form_type = 1;
		}
		addInput(table, idx++, 'wpOtherVersions', null, previousForm);
		addInput(table, idx++, 'wpPermission', null, previousForm);
		newField = document.createElement('textarea');
		newField.setAttribute('rows', UFUtils.getHeight(UFConfig.additional_info_height, 2, 10));
		newField.style.maxWidth = 'auto';
		// Work-around Firefox's "one additional line" bug
		addField(table, idx++, 'wpAdditionalInfo', null, newField, previousForm);
		// Add a preview button.
		UF.addPreviewButton(UploadFormFull.preview);
		// Correct tab indices.
		for (var i = 0; i < UF.the_form.length; i++) {
			UF.the_form.elements[i].setAttribute('tabindex', String(i));
		}
		var license = document.getElementById('wpLicense');
		// Change the license previewer to not cause a table re-layout
		if (license) {
			// These style definitions are because long option labels result in excessively wide
			// selectors, causing also the description fields to go beyond the right border of the
			// page.
			license.style.width = 'auto';
			license.style.maxWidth = '100%';
			license.style.overflow = 'hidden';
		}
		UF.setup_license_preview();
		if (license) {
			var prev = UF.getPrevValue(previousForm, 'wpLicense');
			if (prev) {
				try {
					license.options[license.selectedIndex].selected = false;
					license.options[prev].selected = true;
				} catch (ex) {}
			}
		}
		// Pre-fill in some cases
		if (UFUI.isOwnWork) {
			var src = document.getElementById('wpSource');
			var author = document.getElementById('wpAuthor');
			if (src && !src.value) src.value = UF.getOwnWorkSource();
			if (author && !author.value) author.value = UF.getOwnWorkAuthor();
			if (typeof UFConfig.ownwork_date === 'string' && UFConfig.ownwork_date.search(/\S/) >= 0) {
				var date = document.getElementById('wpDate');
				if (date && !date.value) date.value = UFConfig.ownwork_date;
			}
		}
		if (previousForm) {
			setCheckBoxes(previousForm, [ document.getElementById('wpWatchthis'), document.getElementById('wpIgnoreWarning') ]);
		}
		UploadFormFull.switch_intro_text();
		// If HotCat is present, restore its state, too.
		if (UF.previous_hotcat_state && hotcat_set_state instanceof Function) {
			if ($('#catlinks').find('.hotcatlink').is(':hidden')) hotcat_close_form();
			UF.previous_hotcat_state = hotcat_set_state(UF.previous_hotcat_state);
		}
		UploadFormFull.set_hints();
	},
	// end setup

	getDescText: function getDescText(basic) {
		var descText = '';
		if (!UploadFormFull.multi_inputs) {
			var desc = document.getElementById('wpDesc');
			if (desc && !desc.disabled) descText = UF.clean(desc.value);
		} else {
			for (var i = 0; i < UploadFormFull.multi_inputs.length; i++) {
				if (!UploadFormFull.multi_inputs[i].textfield.disabled) {
					var text = UploadFormFull.multi_inputs[i].textfield.value;
					var selector = UploadFormFull.multi_inputs[i].selector;
					var lang = selector.options[selector.selectedIndex].value;
					if (text) {
						text = UF.clean(text);
						if (descText.length) descText += '\n';
						if (!basic && lang && lang !== 'unknown') {
							// This is Commons-specific! The tl-template is already used, the template for
							// Tagalog is tgl!
							if (lang === 'tl') lang = 'tgl';
							descText += '{{' + lang + '|1=' + text + '}}';
						} else {
							descText += text;
						}
					}
				} // end if !disabled
			}
		}

		var more_info = document.getElementById('wpAdditionalInfo');
		if (!basic) {
			var date = document.getElementById('wpDate');
			var src = document.getElementById('wpSource');
			var author = document.getElementById('wpAuthor');
			var other = document.getElementById('wpPermission');
			var othervers = document.getElementById('wpOtherVersions');
			descText = '{{Information\n' + '|description   =' + descText + '\n' + '|date          =' + (!date.disabled ? UF.clean(date.value) : '') + '\n' + '|source        =' + (!src.disabled ? UF.clean(src.value) : '') + '\n' + '|author        =' + (!author.disabled ? UF.clean(author.value) : '') + '\n' + (other && !other.disabled && other.value ? '|permission    =' + UF.clean(other.value) + '\n' : '') + (othervers && !othervers.disabled && othervers.value ? '|other versions=' + UF.clean(othervers.value) + '\n' : '') + '}}\n';
		} else {
			descText += '\n';
		}
		// Append the additional info, if any
		if (more_info && !more_info.disabled && more_info.value) descText += UF.clean(more_info.value);
		return descText;
	},
	submit: function submit(evt) {
		var overwrite = UF.isOverwrite();
		if (!UploadFormFull.verify(overwrite)) return false;

		// Now put together an information-template
		var descText = UploadFormFull.getDescText(overwrite);
		var doSubmit = true;
		var targetName = document.getElementById('wpDestFile');
		if (targetName && targetName.value) {
			// Strip whitespace
			targetName.value = targetName.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		}
		var dummyDesc = document.getElementById('wpUploadDescription');
		// Sometimes, we do restore from scratch, and sometimes, the browser manages to keep everything.
		// If so, we may have a wpUploadDescription from an earlier submission. Remove it.
		if (dummyDesc) dummyDesc.parentNode.removeChild(dummyDesc);
		if (FormRestorer && targetName && targetName.value) {
			var hotcat_state = null;
			if (hotcat_get_state instanceof Function) {
				if ($('#catlinks').find('.hotcatlink').is(':hidden')) hotcat_close_form();
				hotcat_state = hotcat_get_state();
			}
			// We already know that targetName.value is set!
			FormRestorer.saveForm('UploadForm', UF.the_form.id, String(UploadFormFull.form_type) + '\t' + targetName.value + '\t' + UploadFormFull.field_state.wpSource.height + '\t' + UploadFormFull.field_state.wpAuthor.height + (hotcat_state ? '\t' + hotcat_state : ''), ';path=' + document.location.pathname + ';max-age=1800');
			// Expire after half an hour.
		}

		dummyDesc = document.createElement('textarea');
		dummyDesc.setAttribute('rows', '6');
		dummyDesc.setAttribute('cols', '80');
		dummyDesc.style.display = 'none';
		dummyDesc.setAttribute('name', 'wpUploadDescription');
		dummyDesc.setAttribute('id', 'wpUploadDescription');
		UF.the_form.appendChild(dummyDesc);
		dummyDesc.value = UF.fixCategoryTransclusion(descText);
		doSubmit = UF.call_onsubmit(evt || window.event);
		if (!doSubmit) {
			// Oops. We actually don't submit. Remove the hidden field
			UF.the_form.removeChild(dummyDesc);
		} else {
			UF.hidePreview();
			document.getElementById('wpDestFile').disabled = false;
			document.getElementById('wpEditToken').disabled = false;
		}
		return doSubmit;
	},
	preview: function preview(/* e */
	) {
		var overwrite = UF.isOverwrite();
		if (!UploadFormFull.verify(overwrite)) return false;
		UF.makePreview(UploadFormFull.getDescText(overwrite), overwrite);
		return true;
	},
	verify: function verify(overwrite) {
		var src = document.getElementById('wpSource');
		var author = document.getElementById('wpAuthor');
		// var date = document.getElementById( 'wpDate' );
		var other = document.getElementById('wpPermission');
		// var othervers = document.getElementById( 'wpOtherVersions' );
		var moreInfo = document.getElementById('wpAdditionalInfo');
		var desc;
		var ok = true;
		if (!overwrite) {
			if (UF.errorMsgs) delete UF.errorMsgs;
			UF.errorMsgs = [];
			UF.warning_pushed = false;

			// eslint-disable-next-line no-shadow
			if (!UF.verifyMandatoryField(src, function (src) {
				var flickr_ok = !UFUI.isFromFlickr || src.search(/https?:\/\/([^./]+\.)*flickr\.com/) >= 0;
				if (!flickr_ok) UF.errorMsgs.push('wpFlickrURLError');
				return flickr_ok;
			})) {
				src.onkeyup = UF.resetBg;
				ok = false;
			}
			if (!UF.verifyMandatoryField(author)) {
				author.onkeyup = UF.resetBg;
				ok = false;
			}
			// Piece the description(s) together
			var all_descs = '';
			if (!UploadFormFull.multi_inputs) {
				desc = document.getElementById('wpDesc');
				if (desc) all_descs = desc.value;
			} else {
				for (var input_idx = 0; input_idx < UploadFormFull.multi_inputs.length; input_idx++) {
					all_descs += UploadFormFull.multi_inputs[input_idx].textfield.value;
				}
			}
			// License check
			var licenseField = document.getElementById('wpLicense');
			if (!(!licenseField || licenseField.selectedIndex > 0) && !UF.has_license([ all_descs, other, moreInfo ])) {
				if (!UF.warning_pushed) {
					UF.errorMsgs.push('wpUploadWarningError');
					UF.warning_pushed = true;
				}
				ok = false;
			}
			var targetName = document.getElementById('wpDestFile');
			if (targetName) {
				// Trim leading and trailing whitespace
				targetName.value = targetName.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
				if (!UF.verifyFileName(targetName.value)) {
					targetName.style.backgroundColor = UF.errorColor;
					targetName.onkeyup = function (evt) {
						UF.resetBg(evt);
						if (wgUploadWarningObj && wgUploadWarningObj.keypress instanceof Function && !UF.isReupload) wgUploadWarningObj.keypress();
					};
					ok = false;
				}
			}
			if (UF.templates[0].desc_mandatory) {
				if (all_descs.search(/\S/) < 0) {
					if (!UploadFormFull.multi_inputs) {
						desc = document.getElementById('wpDesc');
						if (desc) {
							desc.style.backgroundColor = UF.errorColor;
							desc.onkeyup = UF.resetBg;
						}
					} else {
						UploadFormFull.setMultiBg(UF.errorColor, UploadFormFull.resetMultiBg);
					}
					UF.errorMsgs.push('wpNoDescriptionError');
					ok = false;
				}
			} // end description check
		} // end overwrite
		if (!ok) {
			UF.hidePreview();
			UF.display_errors();
		} else {
			// It's ok: hide our warning box
			var myWarning = document.getElementById('wpUploadVerifyWarning');
			if (myWarning) myWarning.style.display = 'none';
		}
		return ok;
	},
	setMultiBg: function setMultiBg(color, handler) {
		if (!UploadFormFull.multi_inputs) return;
		for (var i = 0; i < UploadFormFull.multi_inputs.length; i++) {
			var field = UploadFormFull.multi_inputs[i].textfield;
			field.style.backgroundColor = color;
			field.onkeyup = handler;
		}
	},
	resetMultiBg: function resetMultiBg(evt) {
		if (UF.resetBg(evt)) {
			// Reset the backgrounds of all description fields
			UploadFormFull.setMultiBg('#FFF', null);
		}
	}
}; // end UploadFormFull

UF.install();
}(jQuery, mediaWiki));
/* </nowiki> */
