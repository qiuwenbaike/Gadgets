/**
 * SPDX-License-Identifier: CC-BY-SA-3.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-Cat-a-lot.js
 * @source https://zh.wikipedia.org/wiki/MediaWiki:Gadget-Cat-a-lot.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0>
 */
/* eslint-disable camelcase */
'use strict';

/**
 * Cat-A-Lot
 * Changes category of multiple files
 *
 * Originally by Magnus Manske
 * RegExes by Ilmari Karonen
 * Completely rewritten by DieBuche
 *
 * READ THIS PAGE IF YOU WANT TO TRANSLATE OR USE THIS ON ANOTHER SITE:
 * http://commons.wikimedia.org/wiki/MediaWiki:Gadget-Cat-a-lot.js/translating
 */
/* <nowiki> */
(function ($, mw) {
'use strict';

var nsNumber = mw.config.get('wgNamespaceNumber'),
	nsCat = 14,
	currentCat = mw.config.get('wgTitle'),
	formattedNS = mw.config.get('wgFormattedNamespaces'),
	nsIDs = mw.config.get('wgNamespaceIds'),
	catALot;
var msgs = {
	// Preferences
	// new: added 2012-09-19. Please translate.
	// Use user language for i18n
	'cat-a-lot-watchlistpref': 'Watchlist preference concerning files edited with Cat-A-Lot',
	'cat-a-lot-watch_pref': 'According to your general preferences',
	'cat-a-lot-watch_nochange': 'Do not change watchstatus',
	'cat-a-lot-watch_watch': 'Watch pages edited with Cat-A-Lot',
	'cat-a-lot-watch_unwatch': 'Remove pages while editing with Cat-A-Lot from your watchlist',
	'cat-a-lot-minorpref': "Mark edits as minor (if you generally mark your edits as minor, this won't change anything)",
	'cat-a-lot-editpagespref': 'Allow categorising pages (including categories) that are not files',
	'cat-a-lot-docleanuppref': 'Remove {{Check categories}} and other minor cleanup',
	'cat-a-lot-subcatcountpref': 'Sub-categories to show at most',
	'cat-a-lot-config-settings': 'Preferences',
	// Use site language for i18n
	'cat-a-lot-pref-save-summary': '[[Help:Gadget-Cat-a-lot|Cat-a-lot]] is updating user preferences',
	// Progress
	'cat-a-lot-loading': 'Loading...',
	'cat-a-lot-editing': 'Editing page',
	'cat-a-lot-of': 'of ',
	'cat-a-lot-skipped-already': 'The following {{PLURAL:$1|page was|$1 pages were}} skipped, because the page was already in the category:',
	'cat-a-lot-skipped-not-found': 'The following {{PLURAL:$1|page was|$1 pages were}} skipped, because the old category could not be found:',
	'cat-a-lot-skipped-server': 'The following {{PLURAL:$1|page|$1 pages}} couldn\'t be changed, since there were problems connecting to the server:',
	'cat-a-lot-all-done': 'All pages are processed.',
	'cat-a-lot-done': 'Done!',
	'cat-a-lot-added-cat': 'Added category $1',
	'cat-a-lot-copied-cat': 'Copied to category $1',
	'cat-a-lot-moved-cat': 'Moved to category $1',
	'cat-a-lot-removed-cat': 'Removed from category $1',
	'cat-a-lot-return-to-page': 'Return to page',
	'cat-a-lot-cat-not-found': 'Category not found.',
	// as in 17 files selected
	'cat-a-lot-files-selected': '{{PLURAL:$1|One file|$1 files}} selected.',
	// Actions
	'cat-a-lot-copy': 'Copy',
	'cat-a-lot-move': 'Move',
	'cat-a-lot-add': 'Add',
	'cat-a-lot-remove-from-cat': 'Remove from this category',
	'cat-a-lot-enter-name': 'Enter category name',
	'cat-a-lot-select': 'Select',
	'cat-a-lot-all': 'all',
	'cat-a-lot-none': 'none',
	'cat-a-lot-none-selected': 'No files selected!',
	// Summaries:
	'cat-a-lot-summary-add': '[[Help:Cat-a-lot|Cat-a-lot]]: Adding [[Category:$1]]',
	'cat-a-lot-summary-copy': '[[Help:Cat-a-lot|Cat-a-lot]]: Copying from [[Category:$1]] to [[Category:$2]]',
	'cat-a-lot-summary-move': '[[Help:Cat-a-lot|Cat-a-lot]]: Moving from [[Category:$1]] to [[Category:$2]]',
	'cat-a-lot-summary-remove': '[[Help:Cat-a-lot|Cat-a-lot]]: Removing from [[Category:$1]]'
};
mw.messages.set(msgs);
function msg() /* params */{
	var args = Array.prototype.slice.call(arguments, 0);
	args[0] = 'cat-a-lot-' + args[0];
	return mw.message.apply(mw.message, args).parse();
}
function msgPlain(key) {
	// eslint-disable-next-line mediawiki/msg-doc
	return mw.message('cat-a-lot-' + key).plain();
}

// There is only one cat-a-lot on one page
// eslint-disable-next-line no-unused-vars
var $removeLink, $body, $container, $dataContainer, $searchInputContainer, $searchInput, $resultList, $markCounter, $selections, $selectAll, $selectNone, $settingsWrapper, $settingsLink, $head, $link;
catALot = window.catALot = {
	apiUrl: mw.util.wikiScript('api'),
	searchmode: false,
	version: 3.5,
	setHeight: 450,
	settings: {},
	_variantCache: {},
	init: function init() {
		this._initSettings();
		$body = $(document.body);
		$container = $('<div id="cat_a_lot"></div>').appendTo($body);
		$dataContainer = $('<div id="cat_a_lot_data"></div>').appendTo($container);
		$searchInputContainer = $('<div>').appendTo($dataContainer);
		$searchInput = $('<input type="text" id="cat_a_lot_searchcatname" />').attr('placeholder', msgPlain('enter-name')).appendTo($searchInputContainer);
		$resultList = $('<div id="cat_a_lot_category_list"></div>').appendTo($dataContainer);
		$markCounter = $('<div id="cat_a_lot_mark_counter"> </div>').appendTo($dataContainer);
		$selections = $('<div id="cat_a_lot_selections"></div>').text(msgPlain('select')).appendTo($dataContainer);
		$selectAll = $('<a id="cat_a_lot_select_all"></a>').text(msgPlain('all')).appendTo($selections.append(' '));
		$selectNone = $('<a id="cat_a_lot_select_none"></a>').text(msgPlain('none')).appendTo($selections.append(' ??? '));
		$settingsWrapper = $('<div id="cat_a_lot_settings"></div>').appendTo($dataContainer);
		$settingsLink = $('<a id="cat_a_lot_config_settings"></a>').text(msgPlain('config-settings')).appendTo($settingsWrapper);
		$head = $('<div id="cat_a_lot_head"></div>').appendTo($container);
		$link = $('<a id="cat_a_lot_toggle"></a>').text('Cat-a-lot').appendTo($head);
		if (!this.searchmode) {
			$removeLink = $('<a id="cat_a_lot_remove"></a>').html(msg('remove-from-cat')).appendTo($selections).on('click', function () {
				catALot.remove();
			});
		}
		if (mw.util.getParamValue('withJS') === 'MediaWiki:Gadget-Cat-a-lot.js' && !mw.util.getParamValue('withCSS') || mw.loader.getState('ext.gadget.Cat-a-lot') === 'registered') {
			mw.loader.load('/index.php?title=MediaWiki:Gadget-Cat-a-lot.css&action=raw&ctype=text/css&smaxage=3600&maxage=3600', 'text/css');
		}
		var reCat = new RegExp('^\\s*' + catALot.localizedRegex(nsCat, 'Category') + ':', '');
		$searchInput.on('keypress', function (e) {
			if (e.which === 13) {
				// eslint-disable-next-line no-jquery/no-trim
				catALot.updateCats($.trim($(this).val()));
			}
		}).on('input keyup', function () {
			var oldVal = this.value,
				newVal = oldVal.replace(reCat, '');
			if (newVal !== oldVal) {
				this.value = newVal;
			}
		});
		if (this.searchmode) {
			$searchInput.val(mw.util.getParamValue('search'));
		}
		function initAutocomplete() {
			if (catALot.autoCompleteIsEnabled) {
				return;
			}
			catALot.autoCompleteIsEnabled = true;
			$searchInput.autocomplete({
				source: function source(request, response) {
					catALot.doAPICall({
						action: 'opensearch',
						search: request.term,
						namespace: nsCat
					}, function (data) {
						if (data[1]) {
							response($(data[1]).map(function (_index, item) {
								return item.replace(reCat, '');
							}));
						}
					});
				},
				open: function open() {
					$('.ui-autocomplete').position({
						my: $('body').is('.rtl') ? 'left bottom' : 'right bottom',
						at: $('body').is('.rtl') ? 'left top' : 'right top',
						of: $searchInput
					});
				},
				appendTo: '#cat_a_lot'
			});
		}
		$selectAll.on('click', function () {
			catALot.toggleAll(true);
		});
		$selectNone.on('click', function () {
			catALot.toggleAll(false);
		});
		$link.on('click', function () {
			$(this).toggleClass('cat_a_lot_enabled');
			// Load autocomplete on demand
			mw.loader.using([ 'jquery.ui' ], initAutocomplete);
			catALot.run();
		});
		$settingsLink.on('click', function () {
			catALot.manageSettings();
		});
		this.localCatName = formattedNS[nsCat];
	},
	findAllLabels: function findAllLabels() {
		// It's possible to allow any kind of pages as well but what happens if you click on "select all" and don't expect it
		if (this.searchmode) {
			this.labels = $('table.searchResultImage').find('tr>td:eq(1)');
			if (this.settings.editpages) {
				this.labels = this.labels.add('div.mw-search-result-heading');
			}
		} else {
			this.labels = $('div.gallerytext').add($('div#mw-category-media').find('li[class!="gallerybox"]'));
			if (this.settings.editpages) {
				var $pgs = $('div#mw-pages, div#mw-subcategories').find('li');
				this.labels = this.labels.add($pgs);
			}
		}
	},
	getTitleFromLink: function getTitleFromLink(href) {
		try {
			return decodeURIComponent(href).match(/wiki\/(.+?)(?:#.+)?$/)[1].replace(/_/g, ' ');
		} catch (ex) {
			return '';
		}
	},
	getMarkedLabels: function getMarkedLabels() {
		var marked = [];
		this.selectedLabels = this.labels.filter('.cat_a_lot_selected');
		this.selectedLabels.each(function () {
			var file = $(this).find('a[title]'),
				title = file.attr('title') || catALot.getTitleFromLink(file.attr('href')) || catALot.getTitleFromLink($(this).find('a').attr('href'));
			marked.push([ title, $(this) ]);
		});
		return marked;
	},
	updateSelectionCounter: function updateSelectionCounter() {
		this.selectedLabels = this.labels.filter('.cat_a_lot_selected');
		$markCounter.show().html(msg('files-selected', this.selectedLabels.length));
	},
	makeClickable: function makeClickable() {
		this.findAllLabels();
		this.labels.catALotShiftClick(function () {
			catALot.updateSelectionCounter();
		}).addClass('cat_a_lot_label');
	},
	toggleAll: function toggleAll(select) {
		this.labels.toggleClass('cat_a_lot_selected', select);
		this.updateSelectionCounter();
	},
	getSubCats: function getSubCats() {
		var data = {
			action: 'query',
			list: 'categorymembers',
			cmtype: 'subcat',
			cmlimit: this.settings.subcatcount,
			cmtitle: 'Category:' + this.currentCategory
		};
		this.doAPICall(data, function (result) {
			var cats = result.query.categorymembers;
			catALot.subCats = [];
			for (var i = 0; i < cats.length; i++) {
				catALot.subCats.push(cats[i].title.replace(/^[^:]+:/, ''));
			}
			catALot.catCounter++;
			if (catALot.catCounter === 2) {
				catALot.showCategoryList();
			}
		});
	},
	getParentCats: function getParentCats() {
		var data = {
			action: 'query',
			prop: 'categories',
			titles: 'Category:' + this.currentCategory
		};
		this.doAPICall(data, function (result) {
			catALot.parentCats = [];
			var cats,
				pages = result.query.pages;
			if (pages[-1] && pages[-1].missing === '') {
				$resultList.html('<span id="cat_a_lot_no_found">' + msg('cat-not-found') + '</span>');
				document.body.style.cursor = 'auto';
				$resultList.append('<table></table>');
				catALot.createCatLinks('???', [ catALot.currentCategory ]);
				return;
			}
			// there should be only one, but we don't know its ID
			// eslint-disable-next-line guard-for-in
			for (var id in pages) {
				cats = pages[id].categories;
			}
			for (var i = 0; i < cats.length; i++) {
				catALot.parentCats.push(cats[i].title.replace(/^[^:]+:/, ''));
			}
			catALot.catCounter++;
			if (catALot.catCounter === 2) {
				catALot.showCategoryList();
			}
		});
	},
	localizedRegex: function localizedRegex(namespaceNumber, fallback) {
		// Copied from HotCat. Thanks Lupo.
		var wikiTextBlank = '[\\t _\\xA0\\u1680\\u180E\\u2000-\\u200A\\u2028\\u2029\\u202F\\u205F\\u3000]+';
		var wikiTextBlankRE = new RegExp(wikiTextBlank, 'g');
		var createRegexStr = function createRegexStr(name) {
			if (!name || name.length === 0) {
				return '';
			}
			var regex_name = '';
			for (var i = 0; i < name.length; i++) {
				var initial = name.slice(i, i + 1);
				var ll = initial.toLowerCase();
				var ul = initial.toUpperCase();
				if (ll === ul) {
					regex_name += initial;
				} else {
					regex_name += '[' + ll + ul + ']';
				}
			}
			return regex_name.replace(/([\\^$.?*+()])/g, '\\$1').replace(wikiTextBlankRE, wikiTextBlank);
		};
		fallback = fallback.toLowerCase();
		var canonical = formattedNS[namespaceNumber].toLowerCase();
		var RegexString = createRegexStr(canonical);
		if (fallback && canonical !== fallback) {
			RegexString += '|' + createRegexStr(fallback);
		}
		for (var catName in nsIDs) {
			if (typeof catName === 'string' && catName.toLowerCase() !== canonical && catName.toLowerCase() !== fallback && nsIDs[catName] === namespaceNumber) {
				RegexString += '|' + createRegexStr(catName);
			}
		}
		return '(?:' + RegexString + ')';
	},
	findAllVariants: function findAllVariants(category) {
		var result = [],
			baseUrl = '/api.php?action=parse&text=' + encodeURIComponent(category) + '&title=temp&format=json&variant=';
		if (this._variantCache[category] !== undefined) {
			return this._variantCache[category];
		}
		[ 'zh-hans', 'zh-hant', 'zh-cn', 'zh-tw', 'zh-hg', 'zh-mo' ].forEach(function (_idx, variant) {
			var r = $($.ajax({
				url: baseUrl + variant,
				async: false
			}).responseJSON.parse.text['*']).get(0).textContent.trim();
			if (result.indexOf(r) === -1) {
				result.push(r);
			}
		});
		this._variantCache[category] = result;
		return result;
	},
	regexBuilder: function regexBuilder(category) {
		var variants,
			catname = this.localizedRegex(nsCat, 'Category');

		// Build a regexp string for matching the given category:
		// trim leading/trailing whitespace and underscores
		category = category.replace(/^[\s_]+/, '').replace(/[\s_]+$/, '');

		// Find all variants
		variants = this.findAllVariants(category);

		// escape regexp metacharacters (= any ASCII punctuation except _)
		category = [];
		// eslint-disable-next-line no-jquery/no-each-util
		$.each(variants, function (_idx, variant) {
			variant = mw.RegExp.escape(variant);
			// any sequence of spaces and underscores should match any other
			variant = variant.replace(/[\s_]+/g, '[\\s_]+');

			// Make the first character case-insensitive:
			var first = variant.slice(0, 1);
			if (first.toUpperCase() !== first.toLowerCase()) {
				variant = '[' + first.toUpperCase() + first.toLowerCase() + ']' + variant.slice(1);
			}
			category.push(variant);
		});
		// Compile it into a RegExp that matches MediaWiki category syntax (yeah, it looks ugly):
		// XXX: the first capturing parens are assumed to match the sortkey, if present, including the | but excluding the ]]
		return new RegExp('\\[\\[[\\s_]*' + catname + '[\\s_]*:[\\s_]*(?:' + category.join('|') + ')[\\s_]*(\\|[^\\]]*(?:\\][^\\]]+)*)?\\]\\]', 'g');
	},
	getContent: function getContent(file, targetcat, mode) {
		var data = {
			action: 'query',
			prop: 'info|revisions',
			rvprop: 'content|timestamp',
			meta: 'tokens',
			titles: file[0]
		};
		this.doAPICall(data, function (result) {
			catALot.editCategories(result, file, targetcat, mode);
		});
	},
	// Remove {{Uncategorized}}. No need to replace it with anything.
	removeUncat: function removeUncat(text) {
		return text.replace(/\{\{\s*[Uu]ncategorized\s*(\|?.*?)\}\}/, '');
	},
	doCleanup: function doCleanup(text) {
		if (this.settings.docleanup) {
			return text.replace(/\{\{\s*[Ch]eck categories\s*(\|?.*?)\}\}/, '');
		}
		return text;
	},
	editCategories: function editCategories(result, file, targetcat, mode) {
		var otext, starttimestamp, timestamp;
		if (!result) {
			// Happens on unstable wifi connections..
			this.connectionError.push(file[0]);
			this.updateCounter();
			return;
		}
		this.edittoken = result.query.tokens.csrftoken;
		var pages = result.query.pages;

		// there should be only one, but we don't know its ID
		// eslint-disable-next-line guard-for-in
		for (var id in pages) {
			otext = pages[id].revisions[0]['*'];
			starttimestamp = pages[id].starttimestamp;
			timestamp = pages[id].revisions[0].timestamp;
		}
		var sourcecat = currentCat;
		// Check if that file is already in that category
		if (mode !== 'remove' && this.regexBuilder(targetcat).test(otext)) {
			// If the new cat is already there, just remove the old one.
			if (mode === 'move') {
				mode = 'remove';
			} else {
				this.alreadyThere.push(file[0]);
				this.updateCounter();
				return;
			}
		}
		var text = otext;
		var comment;

		// Fix text
		// eslint-disable-next-line default-case
		switch (mode) {
			case 'add':
				text += '\n[[' + this.localCatName + ':' + targetcat + ']]\n';
				comment = msgPlain('summary-add').replace('$1', targetcat);
				break;
			case 'copy':
				text = text.replace(this.regexBuilder(sourcecat), '[[' + this.localCatName + ':' + sourcecat + '$1]]\n[[' + this.localCatName + ':' + targetcat + '$1]]');
				comment = msgPlain('summary-copy').replace('$1', sourcecat).replace('$2', targetcat);
				// If category is added through template:
				if (otext === text) {
					text += '\n[[' + this.localCatName + ':' + targetcat + ']]';
				}
				break;
			case 'move':
				text = text.replace(this.regexBuilder(sourcecat), '[[' + this.localCatName + ':' + targetcat + '$1]]');
				comment = msgPlain('summary-move').replace('$1', sourcecat).replace('$2', targetcat);
				break;
			case 'remove':
				text = text.replace(this.regexBuilder(sourcecat), '');
				comment = msgPlain('summary-remove').replace('$1', sourcecat);
				break;
		}
		if (text === otext) {
			this.notFound.push(file[0]);
			this.updateCounter();
			return;
		}

		// Remove uncat after we checked whether we changed the text successfully.
		// Otherwise we might fail to do the changes, but still replace {{uncat}}
		if (mode !== 'remove') {
			text = this.doCleanup(this.removeUncat(text));
		}
		var data = {
			action: 'edit',
			summary: comment,
			title: file[0],
			text: text,
			bot: true,
			starttimestamp: starttimestamp,
			basetimestamp: timestamp,
			watchlist: this.settings.watchlist,
			token: this.edittoken
		};
		if (this.settings.minor) {
			data.minor = true;
		}
		this.doAPICall(data, function () {
			catALot.updateCounter();
		});
		this.markAsDone(file[1], mode, targetcat);
	},
	markAsDone: function markAsDone(label, mode, targetcat) {
		label.addClass('cat_a_lot_markAsDone');
		// eslint-disable-next-line default-case
		switch (mode) {
			case 'add':
				label.append('<br>' + msg('added-cat', targetcat));
				break;
			case 'copy':
				label.append('<br>' + msg('copied-cat', targetcat));
				break;
			case 'move':
				label.append('<br>' + msg('moved-cat', targetcat));
				break;
			case 'remove':
				label.append('<br>' + msg('removed-cat'));
				break;
		}
	},
	updateCounter: function updateCounter() {
		this.counterCurrent++;
		if (this.counterCurrent > this.counterNeeded) {
			this.displayResult();
		} else {
			this.domCounter.text(this.counterCurrent);
		}
	},
	displayResult: function displayResult() {
		document.body.style.cursor = 'auto';
		$('.cat_a_lot_feedback').addClass('cat_a_lot_done');
		$('.ui-dialog-content').height('auto');
		var rep = this.domCounter.parent();
		rep.html('<h3>' + msg('done') + '</h3>');
		rep.append(msg('all-done') + '<br />');
		var close = $('<a>').text(msgPlain('return-to-page'));
		close.click(function () {
			catALot.progressDialog.remove();
			catALot.toggleAll(false);
		});
		rep.append(close);
		if (this.alreadyThere.length) {
			rep.append('<h5>' + msg('skipped-already', this.alreadyThere.length) + '</h5>');
			rep.append(this.alreadyThere.join('<br>'));
		}
		if (this.notFound.length) {
			rep.append('<h5>' + msg('skipped-not-found', this.notFound.length) + '</h5>');
			rep.append(this.notFound.join('<br>'));
		}
		if (this.connectionError.length) {
			rep.append('<h5>' + msg('skipped-server', this.connectionError.length) + '</h5>');
			rep.append(this.connectionError.join('<br>'));
		}
	},
	moveHere: function moveHere(targetcat) {
		this.doSomething(targetcat, 'move');
	},
	copyHere: function copyHere(targetcat) {
		this.doSomething(targetcat, 'copy');
	},
	addHere: function addHere(targetcat) {
		this.doSomething(targetcat, 'add');
	},
	remove: function remove() {
		this.doSomething('', 'remove');
	},
	doSomething: function doSomething(targetcat, mode) {
		var files = this.getMarkedLabels();
		if (files.length === 0) {
			// eslint-disable-next-line no-alert
			alert(msgPlain('none-selected'));
			return;
		}
		this.notFound = [];
		this.alreadyThere = [];
		this.connectionError = [];
		this.counterCurrent = 1;
		this.counterNeeded = files.length;
		mw.loader.using([ 'jquery.ui', 'mediawiki.util' ], function () {
			catALot.showProgress();
			for (var i = 0; i < files.length; i++) {
				catALot.getContent(files[i], targetcat, mode);
			}
		});
	},
	doAPICall: function doAPICall(params, callback) {
		params.format = 'json';
		var i = 0;
		var apiUrl = this.apiUrl;
		var version = this.version;
		var handleError = function handleError(jqXHR, textStatus, errorThrown) {
			if (window.console && typeof window.console.log === 'function') {
				window.console.log('Error: ', jqXHR, textStatus, errorThrown);
			}
			if (i < 4) {
				// eslint-disable-next-line no-use-before-define
				window.setTimeout(doCall, 300);
				i++;
			} else if (params.title) {
				this.connectionError.push(params.title);
				this.updateCounter();
			}
		};
		var doCall = function doCall() {
			$.ajax({
				headers: {
					'Api-User-Agent': 'Cat-a-lot/' + version + ' (' + mw.config.get('wgWikiID') + ')'
				},
				url: apiUrl,
				cache: false,
				dataType: 'json',
				data: params,
				type: 'POST',
				success: callback,
				error: handleError
			});
		};
		doCall();
	},
	createCatLinks: function createCatLinks(symbol, list) {
		list.sort();
		var domlist = $resultList.find('table');
		for (var i = 0; i < list.length; i++) {
			var $tr = $('<tr>');

			// eslint-disable-next-line no-shadow
			var $link = $('<a>'),
				$add,
				$move,
				$copy;
			$link.text(list[i]);
			$tr.data('cat', list[i]);
			$link.on('click', function () {
				catALot.updateCats($(this).closest('tr').data('cat'));
			});
			if (this.searchmode) {
				$add = $('<a class="cat_a_lot_action"></a>').text(msgPlain('add')).on('click', function () {
					catALot.addHere($(this).closest('tr').data('cat'));
				});
			} else {
				$move = $('<a class="cat_a_lot_move"></a>').text(msgPlain('move')).on('click', function () {
					catALot.moveHere($(this).closest('tr').data('cat'));
				});
				$copy = $('<a class="cat_a_lot_action"></a>').text(msgPlain('copy')).on('click', function () {
					catALot.copyHere($(this).closest('tr').data('cat'));
				});
			}
			$tr.append($('<td>').text(symbol)).append($('<td>').append($link));

			// Can't move to source category
			if (list[i] !== currentCat && this.searchmode) {
				$tr.append($('<td>').append($add));
			} else if (list[i] !== currentCat && !this.searchmode) {
				$tr.append($('<td>').append($move), $('<td>').append($copy));
			}
			domlist.append($tr);
		}
	},
	getCategoryList: function getCategoryList() {
		this.catCounter = 0;
		this.getParentCats();
		this.getSubCats();
	},
	showCategoryList: function showCategoryList() {
		var thiscat = [ this.currentCategory ];
		$resultList.empty();
		$resultList.append('<table></table>');
		this.createCatLinks('???', this.parentCats);
		this.createCatLinks('???', thiscat);
		this.createCatLinks('???', this.subCats);
		document.body.style.cursor = 'auto';
		// Reset width
		$container.width('');
		$container.height('');
		$container.width(Math.min($container.width() * 1.1 + 15, $(window).width() - 10));
		$resultList.css({
			maxHeight: this.setHeight + 'px',
			height: ''
		});
	},
	updateCats: function updateCats(newcat) {
		document.body.style.cursor = 'wait';
		this.currentCategory = newcat;
		$resultList.html('<div class="cat_a_lot_loading"></div>').text(msgPlain('loading'));
		this.getCategoryList();
	},
	showProgress: function showProgress() {
		document.body.style.cursor = 'wait';
		this.progressDialog = $('<div></div>').html(msg('editing') + ' <span id="cat_a_lot_current">' + this.counterCurrent + '</span> ' + msg('of') + this.counterNeeded).dialog({
			width: 450,
			height: 90,
			minHeight: 90,
			modal: true,
			resizable: false,
			draggable: false,
			closeOnEscape: false,
			dialogClass: 'cat_a_lot_feedback'
		});
		$('.ui-dialog-titlebar').hide();
		this.domCounter = $('#cat_a_lot_current');
	},
	run: function run() {
		if ($('.cat_a_lot_enabled').length) {
			this.makeClickable();
			$dataContainer.show();
			$container.resizable({
				handles: 'n',
				alsoResize: '#cat_a_lot_category_list',
				resize: function resize() {
					$(this).css({
						left: '',
						top: ''
					});
					catALot.setHeight = $(this).height();
					$resultList.css({
						maxHeight: '',
						width: ''
					});
				}
			});
			$resultList.css({
				maxHeight: '450px'
			});
			if (this.searchmode) {
				this.updateCats('Pictures and images');
			} else {
				this.updateCats(currentCat);
			}
		} else {
			$dataContainer.hide();
			$container.resizable('destroy');
			// Unbind click handlers
			this.labels.off('click.catALot');
		}
	},
	manageSettings: function manageSettings() {
		mw.loader.using([ 'ext.gadget.SettingsManager', 'ext.gadget.SettingsUI', 'jquery.ui' ], function () {
			catALot._manageSettings();
		});
	},
	_manageSettings: function _manageSettings() {
		window.mw.libs.SettingsUI(this.defaults, 'Cat-A-Lot').show().done(function (_s, _verbose, loc, settingsOut, $dlg) {
			var mustRestart = false,
				_restart = function _restart() {
					if (!mustRestart) {
						return;
					}
					$container.remove();
					catALot.labels.off('click.catALot');
					catALot.init();
				},
				_saveToJS = function _saveToJS() {
					var opt = mw.libs.settingsManager.option({
							optionName: 'catALotPrefs',
							value: catALot.settings,
							encloseSignature: 'catALot',
							encloseBlock: '////////// Cat-A-Lot user preferences //////////\n',
							triggerSaveAt: /Cat.?A.?Lot/i,
							editSummary: msgPlain('pref-save-summary')
						}),
						oldHeight = $dlg.height(),
						$prog = $('<div>');
					$dlg.css('height', oldHeight).html('');
					$prog.css({
						'height': Math.round(oldHeight / 8),
						'margin-top': Math.round(7 * oldHeight / 16)
					}).appendTo($dlg);
					$dlg.parent().find('.ui-dialog-buttonpane button').button('option', 'disabled', true);
					opt.save().done(function (_text, progress) {
						$prog.progressbar({
							value: progress
						});
						$prog.fadeOut(function () {
							$dlg.dialog('close');
							_restart();
						});
					}).progress(function (_text, progress) {
						$prog.progressbar({
							value: progress
						});
						// TODO: Add "details" to progressbar
					}).fail(function (text) {
						$prog.addClass('ui-state-error');
						$dlg.prepend($('<p>').text(text));
					});
				};
			// eslint-disable-next-line no-jquery/no-each-util
			$.each(settingsOut, function (_n, v) {
				if (v.forcerestart && catALot.settings[v.name] !== v.value) {
					mustRestart = true;
				}
				catALot.settings[v.name] = v.value;
				window.catALotPrefs[v.name] = v.value;
			});
			// eslint-disable-next-line default-case
			switch (loc) {
				case 'page':
					$dlg.dialog('close');
					_restart();
					break;
				case 'account-publicly':
					_saveToJS();
					break;
			}
		});
	},
	_initSettings: function _initSettings() {
		if (this.settings.watchlist) {
			return;
		}
		if (!window.catALotPrefs) {
			window.catALotPrefs = {};
		}
		// eslint-disable-next-line no-jquery/no-each-util
		$.each(this.defaults, function (_n, v) {
			v.value = catALot.settings[v.name] = window.catALotPrefs[v.name] || v.default;
			v.label = msgPlain(v.label_i18n);
			if (v.select_i18n) {
				v.select = {};
				// eslint-disable-next-line no-jquery/no-each-util
				$.each(v.select_i18n, function (i18nk, val) {
					v.select[msgPlain(i18nk)] = val;
				});
			}
		});
	},
	defaults: [ {
		name: 'watchlist',
		default: 'preferences',
		label_i18n: 'watchlistpref',
		select_i18n: {
			watch_pref: 'preferences',
			watch_nochange: 'nochange',
			watch_watch: 'watch',
			watch_unwatch: 'unwatch'
		}
	}, {
		name: 'minor',
		default: false,
		label_i18n: 'minorpref'
	}, {
		name: 'editpages',
		default: true,
		label_i18n: 'editpagespref',
		forcerestart: true
	}, {
		name: 'docleanup',
		default: false,
		label_i18n: 'docleanuppref'
	}, {
		name: 'subcatcount',
		default: 50,
		min: 5,
		max: 500,
		label_i18n: 'subcatcountpref',
		forcerestart: true
	} ]
};
if (nsNumber === -1 && mw.config.get('wgCanonicalSpecialPageName') === 'Search' || nsNumber === nsCat) {
	if (nsNumber === -1) {
		catALot.searchmode = true;
	}
	var loadingLocalizations = 1;
	var loadLocalization = function loadLocalization(lang, cb) {
		loadingLocalizations++;
		// eslint-disable-next-line default-case
		switch (lang) {
			case 'zh-hk':
			case 'zh-mo':
			case 'zh-tw':
				lang = 'zh-hant';
				break;
			case 'zh':
			case 'zh-cn':
			case 'zh-my':
			case 'zh-sg':
				lang = 'zh-hans';
				break;
		}
		$.ajax({
			url: '/index.php',
			dataType: 'script',
			data: {
				title: 'MediaWiki:Gadget-Cat-a-lot.js/' + lang,
				action: 'raw',
				ctype: 'text/javascript',
				// Allow caching for 28 days
				maxage: 2419200,
				smaxage: 2419200
			},
			cache: true,
			success: cb,
			error: cb
		});
	};
	var maybeLaunch = function maybeLaunch() {
		loadingLocalizations--;
		function init() {
			$(function () {
				catALot.init();
			});
		}
		if (loadingLocalizations === 0) {
			mw.loader.using([ 'user' ], init, init);
		}
	};
	if (mw.config.get('wgUserLanguage') !== 'en') {
		loadLocalization(mw.config.get('wgUserLanguage'), maybeLaunch);
	}
	maybeLaunch();
}
}(jQuery, mediaWiki));

/**
 *  Derivative work of
 *  (replace "checkboxes" with cat-a-lot labels in your mind)
 */
/**
 * jQuery checkboxShiftClick
 *
 * This will enable checkboxes to be checked or unchecked in a row by clicking one, holding shift and clicking another one
 *
 * @author Krinkle <krinklemail@gmail.com>
 * @license GPL v2
 */
(function ($) {
$.fn.catALotShiftClick = function (cb) {
	var prevCheckbox = null,
		$box = this;
	// When our boxes are clicked..
	$box.on('click.catALot', function (e) {
		// Highlight last selected
		$('#cat_a_lot_last_selected').removeAttr('id');
		var $thisControl = $(e.target),
			method;
		if (!$thisControl.hasClass('cat_a_lot_label')) {
			$thisControl = $thisControl.parents('.cat_a_lot_label');
		}
		$thisControl.attr('id', 'cat_a_lot_last_selected').toggleClass('cat_a_lot_selected');

		// And one has been clicked before...
		if (prevCheckbox !== null && e.shiftKey) {
			// Prevent selection
			e.preventDefault();
			method = $thisControl.hasClass('cat_a_lot_selected') ? 'addClass' : 'removeClass';

			// Check or uncheck this one and all in-between checkboxes
			$box.slice(Math.min($box.index(prevCheckbox), $box.index($thisControl)), Math.max($box.index(prevCheckbox), $box.index($thisControl)) + 1)[method]('cat_a_lot_selected');
		}
		// Either way, update the prevCheckbox variable to the one clicked now
		prevCheckbox = $thisControl;
		if (typeof cb === 'function') {
			cb();
		}
	});
	return $box;
};
}(jQuery));

/* </nowiki> */
