/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-RefToolbarLegacy.js
 * @source https://zh.wikipedia.org/wiki/MediaWiki:RefToolbarLegacy.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
/* eslint-disable block-scoped-var, camelcase, no-alert, no-implicit-globals, no-redeclare, no-undef, no-unused-vars */
'use strict';

// Polyfill
function _typeof(obj) {
	// eslint-disable-next-line no-return-assign, no-func-assign, no-shadow
	return _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) {
		return typeof obj;
		// eslint-disable-next-line no-shadow
	} : function (obj) {
		return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
		// eslint-disable-next-line no-sequences
	}, _typeof(obj);
}
// eslint-disable-next-line no-extend-native
String.prototype.trim = function () {
	return this.replace(/^\s+|\s+$/g, '');
};

/* <nowiki> */
var numforms = 0;
var wikEdAutoUpdateUrl;
var citeUserDateFormat;
var refTagURL;
var defaultRefTagURL = '';
var refToolDebug;
function easyCiteMain() {
	document.getElementById('citeselect').style.display = '';
	document.getElementById('citemore').style.display = 'none';
}
function refbuttons() {
	if (mw.toolbar) {
		mw.toolbar.addButton({
			imageFile: '//tu.zhongwen.wiki/images/e/ea/Button_easy_cite.png',
			speedTip: 'Insert citation',
			onClick: easyCiteMain,
			imageId: 'mw-toolbar-editbutton'
		});
		if (navigator.userAgent.indexOf('MSIE') === -1) {
			var citemain = document.createElement('div');
			citemain.style.display = 'none';
			citemain.style.margin = '0 0 6px';
			citemain.style.clear = 'both';
			citemain.style.height = 'auto';
			citemain.setAttribute('Id', 'citeselect');
			citemain.appendChild(addOption('citeWeb()', 'Web'));
			citemain.appendChild(addOption('citeNews()', 'News'));
			citemain.appendChild(addOption('citeBook()', 'Book'));
			citemain.appendChild(addOption('citeJournal()', 'Journal'));
			citemain.appendChild(addOption('citeNamedRef()', 'Named references'));
			citemain.appendChild(addOption('dispErrors()', 'Error check'));
			citemain.appendChild(addOption('showMore()', 'More'));
			citemain.appendChild(addOption('hideInitial()', 'Cancel'));
			var citemore = document.createElement('div');
			citemore.style.display = 'none';
			citemore.setAttribute('Id', 'citemore');
			citemore.appendChild(addOption('citeEncyclopedia()', 'Encyclopedia'));
			citemore.appendChild(addOption('citePressRelease()', 'Press release'));
			citemore.appendChild(addOption('citeMap()', 'Map'));
			citemore.appendChild(addOption('showRefSectionOptions()', 'Ref Section'));
			citemain.appendChild(citemore);
			$(citemain).insertAfter($('#toolbar'));
		} else {
			var citeselect = document.createElement('div');
			citeselect.id = 'citeselect';
			citeselect.style.display = 'none';
			citeselect.innerHTML = '<input type="button" value="Web" onclick="citeWeb()" /><input type="button" value="News" onclick="citeNews()" /><input type="button" value="Book" onclick="citeBook()" /><input type="button" value="Journal" onclick="citeJournal()" /><input type="button" value="Named references" onclick="citeNamedRef()" /><input type="button" value="Error check" onclick="dispErrors()" /><input type="button" value="More" onclick="showMore()" /><input type="button" value="Cancel" onclick="hideInitial()" /><div id="citemore" style="display:none">\
		<input type="button" value="Encyclopedia" onclick="citeEncyclopedia()" />\
		<input type="button" value="Press release" onclick="citePressRelease()" />\
		<input type="button" value="Map" onclick="citeMap()" />\
		<input type="button" value="Ref Section" onclick="showRefSectionOptions()" />\
		</div>';
			document.getElementById('editform').insertBefore(citeselect, document.getElementById('editform').firstChild);
		}
		var reftoolformarea = document.createElement('span');
		reftoolformarea.id = 'refToolFormArea';
		$('#citeselect').append(reftoolformarea);
	}
	if ((typeof EditTools === 'undefined' ? 'undefined' : _typeof(EditTools)) === 'object') {
		var placeholder = document.getElementById('editpage-specialchars');
		EditTools.createEditTools(placeholder);
	}
}
function addOption(script, text) {
	var option = document.createElement('input');
	option.setAttribute('type', 'button');
	option.setAttribute('onclick', script);
	option.setAttribute('value', text);
	return option;
}
function hideInitial() {
	document.getElementById('citeselect').style.display = 'none';
	oldFormHide();
}
function oldFormHide() {
	// if (numforms !== 0) {
	//  document.getElementById('citediv'+numforms).style.display = 'none';
	// }
	document.getElementById('refToolFormArea').innerHTML = '';
	if (document.getElementById('errorform') !== null) {
		document.getElementById('citeselect').removeChild(document.getElementById('errorform'));
	}
}
function showMore() {
	document.getElementById('citemore').style.display = '';
}
var months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
var citeGlobalDateFormat = '<date> <monthname> <year>';
function getTime() {
	var datestr = '';
	if (citeUserDateFormat) {
		datestr = citeUserDateFormat;
	} else {
		datestr = citeGlobalDateFormat;
	}
	var DT = new Date();
	var zmonth = '';
	var month = DT.getUTCMonth() + 1;
	if (month < 10) {
		zmonth = '0' + month.toString();
	} else {
		zmonth = month.toString();
	}
	month = month.toString();
	var zdate = '';
	var date = DT.getUTCDate();
	if (date < 10) {
		zdate = '0' + date.toString();
	} else {
		zdate = date.toString();
	}
	date = date.toString();
	datestr = datestr.replace('<date>', date);
	datestr = datestr.replace('<month>', month);
	datestr = datestr.replace('<zdate>', zdate);
	datestr = datestr.replace('<zmonth>', zmonth);
	datestr = datestr.replace('<monthname>', months[DT.getUTCMonth()]);
	datestr = datestr.replace('<year>', DT.getUTCFullYear().toString());
	return datestr;
}
function lastNameToRefname() {
	// Note: This only works if field 'refname' comes after field 'last', but it always does
	var lastName;
	var fields = document.getElementById('citediv' + numforms).getElementsByTagName('input');
	for (var i = 0; i < fields.length; i++) {
		if (fields[i].id === 'last') {
			lastName = fields[i].value;
		} else if (fields[i].id === 'refname') {
			fields[i].value = lastName.replace(/^\s*(.*?)\s*$/, '$1');
			return;
		}
	}
}
function setAccessDateToday() {
	document.getElementById('access-date').value = getTime();
}
function getLastName(authornum) {
	if (/\S/.test(document.getElementById('last' + authornum).value)) {
		return document.getElementById('last' + authornum).value;
	}
	var author = document.getElementById('author' + authornum).value;
	var match = /(\S+)\s*$/.exec(author);
	if (match) {
		return match[1];
	}
	return '';
}
function makeRefname() {
	var refname;
	if (document.getElementById('last1')) {
		refname = document.getElementById('last1').value + document.getElementById('last2').value;
	} else {
		refname = document.getElementById('last').value;
	}
	if (/\S/.test(refname)) {
		var date = document.getElementById('date').value;
		var match = /[0-9]{4}/.exec(date);
		if (match) {
			refname += match[0];
		}
	} else {
		refname = document.getElementById('title').value;
	}
	document.getElementById('refname').value = refname;
}
function citeWeb() {
	citeNewsWeb('cite web');
}
function citeNews() {
	citeNewsWeb('cite news');
}
function citeNewsWeb(templatename) {
	oldFormHide();
	var template = templatename;
	var legend;
	if (template === 'cite web') {
		legend = 'Cite web source';
	} else {
		legend = 'Cite news source';
	}
	var newtime = getTime();
	numforms++;
	var form = '<div id="citediv' + numforms + '"><fieldset><legend>' + legend + '</legend><table cellspacing="5"><input type="hidden" value="' + template + '" id="template"><tr><td width="120"><label for="url">URL: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="url"></td><td width="120"><label for="title">&nbsp;Title: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="title"></td></tr><tr><td width="120"><label for="last">Last name: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="last"></td><td width="120"><label for="first">&nbsp;First name: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="first"></td></tr><tr><td width="120"><!-- <label for="coauthors"><s>Coauthors: </s></label> --></td><td width="400"><span style="color:#696969;font-style:italic;">Co-author parameter no longer supported</span><!-- <input type="text" tabindex=1 style="width:100%" id="coauthors" placeholder="this parameter no longer supported"> --></td><td width="120"><label for="date">&nbsp;Publication date: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="date"></td></tr><tr><td width="120"><label for="work">' + (template === 'cite news' ? 'Newspaper or&nbsp;work' : 'Website or&nbsp;work') + ': </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="work"></td><td width="120"><label for="publisher">&nbsp;Publisher: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="publisher"></td></tr><tr><td width="120"><label for="pages">Pages: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="pages"></td><td width="120"><label for="language">&nbsp;Language: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="language"></td></tr><tr><td width="120"><label for="access-date">Access date: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="access-date" value="' + newtime + '"></td>';
	if (template === 'cite news') {
		form += '<td width="120"><label for="location">&nbsp;Location: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="location"></td></tr>';
	} else {
		form += '<td width="120"></td><td width="400"></td></tr>';
	}
	if (template === 'cite web') {
		form += '<tr><td width="120"><label for="archive-url">Archive URL: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="archive-url"></td><td width="120"><label for="archive-date">&nbsp;Archive date: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="archive-date"></td></tr>';
	}
	form += '<tr><td width="120"><label for="refname">Reference name: </label></td><td width="400"><input type="text" tabindex=1 style="width:60%" id="refname"><input type="button" value="<Last name" onClick="lastNameToRefname()"></td></tr></table> <input type="button" value="Add citation" onClick="addcites()"> <input type="button" value="Preview citation" onClick="previewCitationDefault()"> \
	<img id="progress" src="//tu.zhongwen.wiki/images/d/de/Ajax-loader.gif" style="visibility: hidden" /><input type="checkbox" tabindex=1 name="verbose" id="verbose" value="verbose"><label for="verbose">Vertical form</label><span style="float:right"><a href="//en.wikipedia.org/wiki/Template:' + template.replace(/ /g, '_') + '" target="_blank">[Template documentation]</a></span></fieldset><span id="previewSpan"></span></div>';
	document.getElementById('refToolFormArea').innerHTML = form;
}
function citeBook() {
	oldFormHide();
	var template = 'cite book';
	numforms++;
	var form = '<div id="citediv' + numforms + '"><fieldset><legend>Cite book source</legend>';
	form += '<table cellspacing="5" width="100%"> \
	<tr><td><label for="title">Title: </label></td> \
	<td colspan=5><input type="text" tabindex=1 style="width:100%" id="title"></td></tr>';
	for (var i = 1; i <= 3; i++) {
		var i_str = i === 1 ? '' : ' ' + i;
		form += '<tr> \
		<td width="130"><label for="last' + i + '">Author' + i_str + ' last&nbsp;name: </label></td> \
		<td><input type="text" tabindex=1 style="width:100%" id="last' + i + '"></td> \
		<td><label for="first' + i + '">&nbsp;first&nbsp;name: </label></td> \
		<td><input type="text" tabindex=1 style="width:100%" id="first' + i + '"></td> \
		<td><label for="author-link' + i + '">&nbsp;Author link: </label></td> \
		<td><input type="text" tabindex=1 style="width:100%" id="author-link' + i + '"> \
		<!--<a id="authorLinkAnchor' + i + '"><img id="authorLinkButton' + i + '" src="static/progress.gif" border="0" style="visibility: hidden" /></a> \
		<a href="//en.wikipedia.org/wiki/%s" target="_blank"><img id="authorTryLink' + i + '" src="static/external.png" border="0" style="visibility: hidden" /></a> --> \
		</td> \
		</tr>';
	}
	form += '<tr><td><!-- <label for="coauthors"><s>Coauthors: </s></label> --></td> \
	<td><span style="color:#696969;font-style:italic;">Co-author parameter no longer supported</span><!-- <input type="text" tabindex=1 style="width:100%" id="coauthors" placeholder="this parameter no longer supported"> --></td> \
	<td><label for="editor">&nbsp;Editor: </label></td> \
	<td><input type="text" tabindex=1 style="width:100%" id="editor"></td> \
	<td><label for="others">&nbsp;Others: </label></td> \
	<td><input type="text" tabindex=1 style="width:100%" id="others"></td></tr> \
	</table> \
	<table cellspacing="5" width="100%"> \
	<tr><td width="130"><label for="publisher">Publisher: </label></td> \
	<td><input type="text" tabindex=1 style="width:100%" id="publisher"></td> \
	<td><label for="location">&nbsp;Location: </label></td> \
	<td><input type="text" tabindex=1 style="width:100%" id="location"></td></tr> \
	\
	<tr><td><label for="date">Publication&nbsp;date or&nbsp;year: </label></td> \
	<td><input type="text" tabindex=1 style="width:140px" id="date"> \
	<input id="dmy" name="dateformat" value="dmy" type="radio" tabindex=1 onclick="reformatDates()"><label for="dmy">dmy</label> \
	<input id="mdy" name="dateformat" value="mdy" type="radio" tabindex=1 onclick="reformatDates()"><label for="mdy">md, y</label> \
	<input id="ymd" name="dateformat" value="ymd" type="radio" tabindex=1 onclick="reformatDates()"><label for="ymd">y-m-d</label> \
	</td> \
	<td><label for="edition">&nbsp;Edition: </label></td> \
	<td><input type="text" tabindex=1 style="width:100%" id="edition"></td></tr> \
	\
	<tr><td><label for="series">Series: </label></td> \
	<td><input type="text" tabindex=1 style="width:100%" id="series"></td> \
	<td><label for="volume">&nbsp;Volume: </label></td> \
	<td><input type="text" tabindex=1 style="width:100%" id="volume"></td></tr> \
	\
	<tr><td><label for="pages">Page number(s):</label></td> \
	<td><input type="text" tabindex=1 style="width:100%" id="pages" name="pages" onFocus="this.style.backgroundColor=\'\';"></td> \
	<td><label for="chapter">&nbsp;Chapter: </label></td> \
	<td><input type="text" tabindex=1 style="width:100%" id="chapter"></td></tr> \
	\
	<tr><td><label for="isbn">ISBN: </label></td> \
	<td><input type="text" tabindex=1 style="width:100%" id="isbn"></td> \
	<td><label for="language">&nbsp;Language: </label></td> \
	<td><input type="text" tabindex=1 style="width:100%" id="language"></td></tr> \
	\
	<tr><td><label for="url">URL: </label></td> \
	<td><input type="text" tabindex=1 style="width:100%" id="url"></td> \
	<td><label for="access-date">&nbsp;Access&nbsp;date:</label></td> \
	<td><input type="text" tabindex=1 style="width:100%" id="access-date"></td></tr> \
	\
	<tr><td><label for="otherfields">Other&nbsp;fields:</label></td> \
	<td><input type="text" tabindex=1 style="width:100%" id="otherfields"></td> \
	<td><label for="refname">&nbsp;Ref&nbsp;name: </label></td> \
	<td><input type="text" tabindex=1 style="width:100%" id="refname"></td> \
	</tr> \
	</table> \
	\
	<input type="radio" tabindex=1 name="template" id="cite_book" value="cite_book" checked="1"><label for="cite_book">{{cite book}}</label> <sup><a href="//en.wikipedia.org/wiki/Template:Cite_book" target="_blank">[doc]</a></sup> \
	<input type="radio" tabindex=1 name="template" id="citation" value="citation"><label for="citation">{{citation}}</label> <sup><a href="//en.wikipedia.org/wiki/Template:Citation" target="_blank">[doc]</a></sup> \
	<input type="radio" tabindex=1 name="template" id="plain" value="plain"><label for="plain">plain wikicode (experimental)</label> \
	<input type="checkbox" tabindex=1 name="verbose" id="verbose" value="verbose"><label for="verbose">Vertical form</label> \
	<input type="checkbox" tabindex=1 name="extraparams" id="extraparams" value="extraparams"><label for="extraparams">Extra parameters</label> \
	<br><input type="button" value="Add citation" onClick="makeCiteBook()"> \
	<input type="button" value="Preview citation" onClick="previewCitationBook()"> \
	<img id="progress" src="//tu.zhongwen.wiki/images/d/de/Ajax-loader.gif" style="visibility: hidden" /> \
	\
 	</fieldset><span id="previewSpan"></span></div>';
	document.getElementById('refToolFormArea').innerHTML = form;
}
function citeJournal() {
	oldFormHide();
	var template = 'cite journal';
	numforms++;
	var form = '<div id="citediv' + numforms + '"><fieldset><legend>Cite journal</legend><table cellspacing="5"><input type="hidden" value="' + template + '" id="template"><tr><td width="120"><label for="last">Last name: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="last"></td><td width="120"><label for="first">&nbsp;First name: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="first"></td></tr><tr><td width="120"><!-- <label for="coauthors"><s>Coauthors: </s></label> --></td><td width="400"><span style="color:#696969;font-style:italic;">Co-author parameter no longer supported</span><!-- <input type="text" tabindex=1 style="width:100%" id="coauthors" placeholder="this parameter no longer supported"> --></td><td width="120"><label for="date">&nbsp;Publication date: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="date"></td></tr><tr><td width="120"><label for="title">Title: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="title"></td><td width="120"><label for="journal">&nbsp;Journal: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="journal"></td></tr><tr><td width="120"><label for="publisher">Publisher: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="publisher"></td><td width="120"><label for="location">&nbsp;Location: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="location"></td></tr><tr><td width="120"><label for="volume">Volume: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="volume"></td><td width="120"><label for="issue">&nbsp;Issue: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="issue"></td></tr><tr><td width="120"><label for="pages">Pages: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="pages"></td><td width="120"><label for="issn">&nbsp;ISSN: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="issn"></td></tr><tr><td width="120"><label for="oclc">OCLC: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="oclc"></td><td width="120"><label for="doi">&nbsp;DOI: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="doi"></td></tr><tr><td width="120"><label for="pmid">PMID: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="pmid"></td><td width="120"><label for="quote">&nbsp;Quote: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="quote"></td></tr><tr><td width="120"><label for="url">URL: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="url"></td><td width="120"><label for="access-date">&nbsp;Access date: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="access-date"></td></tr><tr><td width="120"><label for="language">Language: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="language"></td><td width="120"><label for="refname">&nbsp;Reference name: </label></td><td width="400"><input type="text" tabindex=1 style="width:60%" id="refname"><input type="button" value="<Last name" onClick="lastNameToRefname()"></td></tr></table><input type="button" value="Add citation" onClick="addcites()"> <input type="button" value="Preview citation" onClick="previewCitationDefault()"> \
	<img id="progress" src="//tu.zhongwen.wiki/images/d/de/Ajax-loader.gif" style="visibility: hidden" /><input type="checkbox" tabindex=1 name="verbose" id="verbose" value="verbose"><label for="verbose">Vertical form</label><span style="float:right"><a href="//en.wikipedia.org/wiki/Template:' + template.replace(/ /g, '_') + '" target="_blank">[Template documentation]</a></span></fieldset><span id="previewSpan"></span></div>';
	document.getElementById('refToolFormArea').innerHTML = form;
}
function citeEncyclopedia() {
	oldFormHide();
	var template = 'cite encyclopedia';
	numforms++;
	var form = '<div id="citediv' + numforms + '"><fieldset><legend>Cite encyclopedia source</legend><table cellspacing="5"><input type="hidden" value="' + template + '" id="template"><tr><td width="120"><label for="last">Last name: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="last"></td><td width="120"><label for="first">&nbsp;First name: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="first"></td></tr><tr><td width="120"><!-- <label for="coauthors"><s>Coauthors: </s></label> --></td><td width="400"><span style="color:#696969;font-style:italic;">Co-author parameter no longer supported</span><!-- <input type="text" tabindex=1 style="width:100%" id="coauthors" placeholder="this parameter no longer supported"> --></td><td width="120"><label for="editor">&nbsp;Editor: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="editor"></td></tr><tr><td width="120"><label for="title">Entry title: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="title"></td><td width="120"><label for="encyclopedia">&nbsp;Encyclopedia: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="encyclopedia"></td></tr><tr><td width="120"><label for="publisher">Publisher: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="publisher"></td><td width="120"><label for="location">&nbsp;Location: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="location"></td></tr><tr><td width="120"><label for="year">Year: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="year"></td><td width="120"><label for="volume">&nbsp;Volume: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="volume"></td></tr><tr><td width="120"><label for="pages">Pages: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="pages"></td><td width="120"><label for="isbn">&nbsp;ISBN: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="isbn"></td></tr><tr><td width="120"><label for="url">URL: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="url"></td><td width="120"><label for="access-date">&nbsp;Access date: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="access-date"></td></tr><tr><td width="120"><label for="language">Language: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="language"></td><td width="120"><label for="refname">&nbsp;Reference name: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="refname"></td></tr></table><input type="button" value="Add citation" onClick="addcites()"> <input type="button" value="Preview citation" onClick="previewCitationDefault()"> \
	<img id="progress" src="//tu.zhongwen.wiki/images/d/de/Ajax-loader.gif" style="visibility: hidden" /><input type="checkbox" tabindex=1 name="verbose" id="verbose" value="verbose"><label for="verbose">Vertical form</label><span style="float:right"><a href="//en.wikipedia.org/wiki/Template:' + template.replace(/ /g, '_') + '" target="_blank">[Template documentation]</a></span></fieldset><span id="previewSpan"></span></div>';
	document.getElementById('refToolFormArea').innerHTML = form;
}
function citePressRelease() {
	oldFormHide();
	var template = 'cite press release';
	numforms++;
	var form = '<div id="citediv' + numforms + '"><fieldset><legend>Cite press release</legend><table cellspacing="5"><input type="hidden" value="' + template + '" id="template"><tr><td width="120"><label for="title">Title: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="title"></td><td width="120"><label for="publisher">&nbsp;Publisher: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="publisher"></td></tr><tr><td width="120"><label for="date">Date: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="date"></td><td width="120"><label for="language">&nbsp;Language: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="language"></td></tr><tr><td width="120"><label for="url">URL: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="url"></td><td width="120"><label for="access-date">&nbsp;Access date: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="access-date" value="' + getTime() + '"></td></tr><tr><td width="120"><label for="refname">Reference name: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="refname"></td></tr></table><input type="button" value="Add citation" onClick="addcites()"> <input type="button" value="Preview citation" onClick="previewCitationDefault()"> \
	<img id="progress" src="//tu.zhongwen.wiki/images/d/de/Ajax-loader.gif" style="visibility: hidden" /><input type="checkbox" tabindex=1 name="verbose" id="verbose" value="verbose"><label for="verbose">Vertical form</label><span style="float:right"><a href="//en.wikipedia.org/wiki/Template:' + template.replace(/ /g, '_') + '" target="_blank">[Template documentation]</a></span></fieldset><span id="previewSpan"></span></div>';
	document.getElementById('refToolFormArea').innerHTML = form;
}
function citeMap() {
	oldFormHide();
	var template = 'cite map';
	numforms++;
	var form = '<div id="citediv' + numforms + '"><fieldset><legend>Cite map</legend><table cellspacing="5"><input type="hidden" value="' + template + '" id="template"><tr><td width="120"><label for="publisher">Publisher: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="publisher"></td><td width="120"><label for="title">&nbsp;Title: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="title"></td></tr><tr><td width="120"><label for="url">URL: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="url"></td><td width="120"><label for="access-date">&nbsp;Access date: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="access-date"></td></tr><tr><td width="120"><label for="edition">Edition: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="edition"></td><td width="120"><label for="date">&nbsp;Date or year: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="date"></td></tr><tr><td width="120"><label for="cartography">Cartography: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="cartography"></td><td width="120"><label for="scale">&nbsp;Scale: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="scale"></td></tr><tr><td width="120"><label for="series">Series: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="series"></td><td width="120"><label for="page">&nbsp;Page: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="page"></td></tr><tr><td width="120"><label for="section">Section: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="section"></td><td width="120"><label for="inset">&nbsp;Inset: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="inset"></td></tr><tr><td width="120"><label for="isbn">ISBN: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="isbn"></td><td width="120"><label for="refname">&nbsp;Reference name: </label></td><td width="400"><input type="text" tabindex=1 style="width:100%" id="refname"></td></tr></table><input type="button" value="Add citation" onClick="addcites()"> <input type="button" value="Preview citation" onClick="previewCitationDefault()"> \
	<img id="progress" src="//tu.zhongwen.wiki/images/d/de/Ajax-loader.gif" style="visibility: hidden" /><input type="checkbox" tabindex=1 name="verbose" id="verbose" value="verbose"><label for="verbose">Vertical form</label><span style="float:right"><a href="//en.wikipedia.org/wiki/Template:' + template.replace(/ /g, '_') + '" target="_blank">[Template documentation]</a></span></fieldset><span id="previewSpan"></span></div>';
	document.getElementById('refToolFormArea').innerHTML = form;
}
function showRefSectionOptions() {
	oldFormHide();
	var template = 'cite encyclopedia';
	numforms++;
	var form = '<div id="citediv' + numforms + '"><fieldset><legend>Add references section</legend>\
	Headline:<br>\
	<input id="references" name="headline" type="radio" tabindex=1 checked="checked"><label for="references">== References ==</label><br> \
	<input id="notes" name="headline" type="radio" tabindex=1><label for="notes">== Notes ==</label><br> \
	Type:<br> \
	<input id="type-references" name="type" type="radio" tabindex=1><label for="type-references">&lt;references/&gt;</label><br> \
	<input id="type-reflist" name="type" type="radio" tabindex=1 checked="checked"><label for="type-reflist">{{Reflist}}</label><br> \
	<input type="checkbox" tabindex=1 id="ldr"><label for="ldr">List-defined references</label> (<a href="//en.wikipedia.org/wiki/Wikipedia:Footnotes#List-defined_references" target="_blank">Info 1</a>, <a href="//en.wikipedia.org/wiki/Help:Footnotes#List-defined_references" target="_blank">Info 2</a>)<br>\
	<input type="button" value="Add references section" onClick="addRefSection()"></fieldset></div>';
	document.getElementById('refToolFormArea').innerHTML = form;
}
function makeCiteCode() {
	var cites = document.getElementById('citediv' + numforms).getElementsByTagName('input');
	var template = '';
	var citebegin = '<ref';
	var citename = '';
	var citeinner = '';
	for (var i = 0; i < cites.length; i++) {
		var citeid = cites[i].id;
		var citevalue = cites[i].value;
		citevalue = citevalue.trim(); // Trim leading and trailing whitespace
		if (citeid === 'verbose') {
			if (cites[i].checked) {
				citeinner = citeinner.replace(/\|/g, '\n|');
			}
		} else if (citevalue !== '' && cites[i].type !== 'button' && cites[i].type !== 'image') {
			if (citeid === 'refname') {
				citebegin += ' name="' + citevalue + '"';
			} else if (citeid === 'template') {
				citename = '>{{' + citevalue;
				template = citevalue;
			} else {
				if (citeid === 'pages') {
					if (citevalue.match(/^\w+$/) && template !== 'cite encyclopedia') {
						citeid = 'page'; // Use page= instead of pages= if only one page. Makes p. 5 instead of pp. 5.
					} else {
						citevalue = citevalue.replace(/-/g, '???'); // Replace hyphens with en dashes [[WP:ENDASH]]
					}
				} else if (citeid === 'date' && citevalue.match(/^\d\d\d\d$/)) {
					citeid = 'year'; // Use year= instead of date= if only the year is specified
				}

				citeinner += '|' + citeid + '=' + citevalue;
			}
		}
	}
	var cite = citebegin + citename + citeinner + '}}</ref>';
	return cite;
}
function addcites(template) {
	var cite = makeCiteCode();
	$('#wpTextbox1').trigger('focus');
	mw.toolbar.insertTags(cite, '', '');
	// document.getElementById('citediv'+numforms).style.display = 'none';
	oldFormHide();
}
function addRefSection() {
	var wikicode = '\n';
	if (document.getElementById('references').checked) {
		wikicode += '== References ==\n';
	} else if (document.getElementById('notes').checked) {
		wikicode += '== Notes ==\n';
	} else {
		alert('No headline selected!');
	}
	if (document.getElementById('type-references').checked) {
		if (document.getElementById('ldr').checked) {
			wikicode += '<references>\n\n</references>\n';
		} else {
			wikicode += '<references />\n';
		}
	} else if (document.getElementById('type-reflist').checked) {
		if (document.getElementById('ldr').checked) {
			wikicode += '{{Reflist|refs=\n\n}}\n';
		} else {
			wikicode += '{{Reflist}}\n';
		}
	} else {
		alert('No type selected!');
	}
	$('#wpTextbox1').trigger('focus');
	mw.toolbar.insertTags(wikicode, '', '');
	document.getElementById('citediv' + numforms).innerHTML = '';
}
function getNamedRefs(calls) {
	if (typeof wikEdUseWikEd !== 'undefined') {
		if (wikEdUseWikEd === true) {
			WikEdUpdateTextarea();
		}
	}
	var text = document.getElementById('wpTextbox1').value;
	var regex;
	if (calls) {
		regex = /< *?ref +?name *?= *?(('([^']*?)')|("([^"]*?)")|([^'"\s]*?[^/]\b)) *?\/ *?>/gi; // '
	} else {
		regex = /< *?ref +?name *?= *?(('([^']*?)')|("([^"]*?)")|([^'"\s]*?[^/]\b)) *?>/gi; // '
	}

	var namedrefs = [];
	var i = 0;
	var nr = true;
	do {
		var ref = regex.exec(text);
		if (ref !== null) {
			if (ref[5]) {
				namedrefs[i] = ref[5];
			} else if (ref[3]) {
				namedrefs[i] = ref[3];
			} else {
				namedrefs[i] = ref[6];
			}
			i++;
		} else {
			nr = false;
		}
	} while (nr === true);
	return namedrefs;
}
function citeNamedRef() {
	var namedrefs = getNamedRefs(false);
	if (namedrefs === '') {
		oldFormHide();
		numforms++;
		var out = '<div id="citediv' + numforms + '"><fieldset><legend>References in text</legend>There are no named refs (<tt>&lt;ref name="Name"&gt;</tt>) in the text</fieldset></div>';
		document.getElementById('refToolFormArea').innerHTML = out;
	} else {
		oldFormHide();
		numforms++;
		var form = '<div id="citediv' + numforms + '"><fieldset><legend>References in article</legend><table cellspacing="5"><tr><td><label for="namedrefs">&nbsp;Named references in text</label></td><td><select name="namedrefs" id="namedrefs">';
		for (var i = 0; i < namedrefs.length; i++) {
			form += '<option value="' + namedrefs[i] + '">' + namedrefs[i] + '</option>';
		}
		form += '</select></td></tr></table><input type="button" value="Add citation" onClick="addnamedcite()"></fieldset></div>';
		document.getElementById('refToolFormArea').innerHTML = form;
	}
}
function addnamedcite() {
	var name = document.getElementById('citediv' + numforms).getElementsByTagName('select')[0].value;
	var ref = '<ref name="' + name + '" />';
	$('#wpTextbox1').trigger('focus');
	mw.toolbar.insertTags(ref, '', '');
	document.getElementById('citediv' + numforms).style.display = 'none';
}
function getAllRefs() {
	if (typeof wikEdUseWikEd !== 'undefined') {
		if (wikEdUseWikEd === true) {
			WikEdUpdateTextarea();
		}
	}
	var text = document.getElementById('wpTextbox1').value;
	var regex = /< *?ref( +?name *?= *?(('([^']*?)')|("([^"]*?)")|([^'"\s]*?[^/]\b)))? *?>((.|\n)*?)< *?\/? *?ref *?>/gim; // "
	var allrefs = [];
	var i = 0;
	var nr = true;
	do {
		var ref = regex.exec(text);
		if (ref !== null) {
			if (ref[0].search(/[^\s]{150}/) !== -1) {
				ref[0] = ref[0].replace(/\|([^\s])/g, '| $1');
			}
			ref[0] = ref[0].replace(/</g, '&lt;');
			ref[0] = ref[0].replace(/>/g, '&gt;');
			allrefs[i] = ref[0];
			i++;
		} else {
			nr = false;
		}
	} while (nr === true);
	return allrefs;
}
function NRcallError(namedrefs, refname) {
	for (var i = 0; i < namedrefs.length; i++) {
		if (namedrefs[i] === refname) {
			return true;
		}
	}
	return false;
}
function errorCheck() {
	var allrefs = getAllRefs();
	var allrefscontent = [];
	var samecontentexclude = [];
	var sx = 0;
	var templateexclude = [];
	var tx = 0;
	var skipcheck = false;
	var namedrefcalls = getNamedRefs(true);
	for (var i = 0; i < allrefs.length; i++) {
		allrefscontent[i] = allrefs[i].replace(/&lt; *?ref( +?name *?= *?(('([^']*?)')|("([^"]*?)")|([^'"\s]*?[^/]\b)))? *?&gt;((.|\n)*?)&lt; *?\/? *?ref *?&gt;/gim, '$8'); // "
	}

	var namedrefs = getNamedRefs(false);
	var errorlist = [];
	var q = 0;
	var unclosed = document.getElementById('unclosed').checked;
	var samecontent = document.getElementById('samecontent').checked;
	var templates = document.getElementById('templates').checked;
	var repeated = document.getElementById('repeated').checked;
	var undef = document.getElementById('undef').checked;
	for (var i = 0; i < allrefs.length; i++) {
		if (allrefs[i].search(/&lt; *?\/ *?ref *?&gt;/) === -1 && unclosed) {
			errorlist[q] = '<tr><td width="75%"><tt>' + allrefs[i] + '</tt></td>';
			errorlist[q] += '<td width="25%">Unclosed <tt>&lt;ref&gt;</tt> tag</td></tr>';
			q++;
		}
		if (samecontent) {
			for (var d = 0; d < samecontentexclude.length; d++) {
				if (allrefscontent[i] === samecontentexclude[d]) {
					skipcheck = true;
				}
			}
			var p = 0;
			// eslint-disable-next-line no-unmodified-loop-condition
			while (p < allrefs.length && !skipcheck) {
				if (allrefscontent[i] === allrefscontent[p] && i !== p) {
					errorlist[q] = '<tr><td width="75%"><tt>' + allrefscontent[i] + '</tt></td>';
					errorlist[q] += '<td width="25%">Multiple refs contain this content, a <a href="//en.wikipedia.org/wiki/Wikipedia:Footnotes#Naming_a_ref_tag_so_it_can_be_used_more_than_once">named reference</a> should be used instead</td></tr>';
					q++;
					samecontentexclude[sx] = allrefscontent[i];
					sx++;
					break;
				}
				p++;
			}
			skipcheck = false;
		}
		if (templates) {
			if (allrefscontent[i].search(/\{\{cite/i) === -1 && allrefscontent[i].search(/\{\{citation/i) === -1 && allrefscontent[i].search(/\{\{Comic (book|strip) reference/i) === -1 && allrefscontent[i].search(/\{\{Editorial cartoon reference/i) === -1 && allrefscontent[i].search(/\{\{harv/i) === -1) {
				for (var x = 0; x < templateexclude.length; x++) {
					if (allrefscontent[i] === templateexclude[x]) {
						skipcheck = true;
					}
				}
				if (!skipcheck) {
					errorlist[q] = '<tr><td width="75%"><tt>' + allrefs[i] + '</tt></td>';
					errorlist[q] += '<td width="25%">Does not use a <a href="//en.wikipedia.org/wiki/Wikipedia:Citation_templates">citation template</a></td></tr>';
					q++;
					templateexclude[tx] = allrefscontent[i];
					tx++;
				}
				skipcheck = false;
			}
		}
	}
	if (repeated) {
		var repeatnameexclude = [];
		var rx = 0;
		for (var k = 0; k < namedrefs.length; k++) {
			for (var d = 0; d < repeatnameexclude.length; d++) {
				if (namedrefs[k] === repeatnameexclude[d]) {
					skipcheck = true;
				}
			}
			var z = 0;
			// eslint-disable-next-line no-unmodified-loop-condition
			while (z < namedrefs.length && !skipcheck) {
				if (namedrefs[k] === namedrefs[z] && k !== z) {
					errorlist[q] = '<tr><td width="75%"><tt>' + namedrefs[k] + '</tt></td>';
					errorlist[q] += '<td width="25%">Multiple references are given the same <a href="//en.wikipedia.org/wiki/Wikipedia:Footnotes#Naming_a_ref_tag_so_it_can_be_used_more_than_once">name</a></td></tr>';
					q++;
					repeatnameexclude[rx] = namedrefs[z];
					rx++;
					break;
				}
				z++;
			}
			skipcheck = false;
		}
	}
	if (undef) {
		var undefexclude = [];
		var ux = 0;
		for (var p = 0; p < namedrefcalls.length; p++) {
			for (var d = 0; d < undefexclude.length; d++) {
				if (allrefscontent[i] === undefexclude[d]) {
					skipcheck = true;
				}
			}
			if (!skipcheck) {
				if (!NRcallError(namedrefs, namedrefcalls[p])) {
					errorlist[q] = '<tr><td width="75%"><tt>' + namedrefcalls[p] + '</tt></td>';
					errorlist[q] += '<td width="25%">A <a href="//en.wikipedia.org/wiki/Wikipedia:Footnotes#Naming_a_ref_tag_so_it_can_be_used_more_than_once">named reference</a> is used but not defined</td></tr>';
					q++;
					undefexclude[ux] = namedrefs[p];
					ux++;
				}
			}
			skipcheck = false;
		}
	}
	if (q > 0) {
		return errorlist;
	}
	return 0;
}
function dispErrors() {
	oldFormHide();
	var form = '<div id="errorform"><fieldset><legend>Error checking</legend><b>Check for:</b><br><input type="checkbox" id="unclosed" /> Unclosed <tt>&lt;ref&gt;</tt> tags<br><input type="checkbox" id="samecontent" /> References with the same content<br><input type="checkbox" id="templates" /> References not using a <a href="//en.wikipedia.org/wiki/Wikipedia:Citation_templates">citation template</a><br><input type="checkbox" id="repeated" /> Multiple references with the same name<br><input type="checkbox" id="undef" /> Usage of undefined named references<br><input type="button" id="errorchecksubmit" value="Check for selected errors" onclick="doErrorCheck()"/></fieldset></div>';
	document.getElementById('citeselect').innerHTML += form;
}
function doErrorCheck() {
	var errors = errorCheck();
	document.getElementById('citeselect').removeChild(document.getElementById('errorform'));
	if (errors === 0) {
		if (numforms !== 0) {
			document.getElementById('citediv' + numforms).style.display = 'none';
		}
		numforms++;
		out = '<div id="citediv' + numforms + '"><fieldset><legend>Error checking</legend>No errors found.</fieldset></div>';
		document.getElementById('citeselect').innerHTML += out;
	} else {
		if (numforms !== 0) {
			document.getElementById('citediv' + numforms).style.display = 'none';
		}
		numforms++;
		form = '<div id="citediv' + numforms + '"><fieldset><legend>Error checking</legend><table border="1px">';
		for (var i = 0; i < errors.length; i++) {
			form += errors[i];
		}
		form += '</table></fieldset></div>';
		document.getElementById('citeselect').innerHTML += form;
	}
}
function makeBookCitationCode(callback) {
	var cite = '<ref';
	var refname = document.getElementById('refname').value;
	if (/\S/.test(refname)) {
		cite += ' name="' + refname + '"';
	}
	cite += '>{{';
	if (document.getElementById('cite_book').checked || document.getElementById('plain').checked) {
		cite += 'cite book';
	} else if (document.getElementById('citation').checked) {
		cite += 'citation';
	} else {
		alert('No template selected.');
	}
	var authorcite = '';
	var prevauthor = 0;
	for (var i = 3; i >= 1; i--) {
		// var author = document.getElementById('author' + i).value;
		var last = document.getElementById('last' + i).value;
		var first = document.getElementById('first' + i).value;
		var authorlink = document.getElementById('author-link' + i).value;
		if (i === 1 && !prevauthor) {
			i = '';
		}
		if (/\S/.test(authorlink)) {
			authorcite = '|author-link' + i + '=' + authorlink + authorcite;
		}
		if (/\S/.test(last)) {
			authorcite = '|last' + i + '=' + last + '|first' + i + '=' + first + authorcite;
			prevauthor = 1;
		}
	}
	cite += authorcite;
	var simplefields = [ 'editor', 'others', 'title', 'url', 'access-date', 'edition', 'series', 'volume', 'date', 'publisher', 'location', 'language', 'isbn', 'pages', 'chapter' ];
	for (var i = 0; i < simplefields.length; i++) {
		var fieldname = simplefields[i];
		var value = document.getElementById(fieldname).value;
		if (/\S/.test(value) || fieldname === 'title') {
			if (fieldname === 'pages') {
				if (/^\w+$/.test(value)) {
					fieldname = 'page'; // Use page= instead of pages= if only one page. Makes p. 5 instead of pp. 5.
				} else {
					value = value.replace(/-/g, '???'); // Replace hyphens with en dashes [[WP:ENDASH]]
					value = value.replace(/,\s*\s?/g, ', '); // One space after each comma
				}
			} else if (fieldname === 'date' && /^\d\d\d\d$/.test(value)) {
				fieldname = 'year'; // Use year= instead of date= if only the year is specified
			}

			cite += '|' + fieldname + '=' + value;
		}
	}
	var otherfields = document.getElementById('otherfields').value;
	if (/\S/.test(otherfields)) {
		cite += '|' + otherfields;
	}
	if (document.getElementById('extraparams').checked) {
		cite += '|author-mask=';
		if (!document.getElementById('citation').checked) {
			cite += '|trans-title=';
		}
		cite += '|format=';
		cite += '|orig-date=';
		cite += '|oclc=';
		cite += '|doi=';
		cite += '|bibcode=';
		cite += '|id=';
		if (/\S/.test(document.getElementById('chapter').value)) {
			if (!document.getElementById('citation').checked) {
				cite += '|trans-chapter=';
			}
			cite += '|chapter-url=';
		}
		cite += '|quote=';
		cite += '|lay-url=';
		cite += '|lay-date=';
	}
	cite += '}}</ref>';
	if (document.getElementById('plain').checked) {
		var match = /^(.*?)(\{\{.*}})(.*?)$/.exec(cite);
		if (match) {
			var citebeg = match[1];
			var citemid = match[2];
			var citeend = match[3];
			citemid = citemid.replace(/cite book/, 'Vancite book');
			// alert(citebeg + ':::' + citemid + ':::' + citeend);
			// document.getElementById('fullcite').value = 'Updating...';
			var url = 'api.php?action=expandtemplates&format=xml&text=' + encodeURIComponent(citemid);
			document.getElementById('progress').style.visibility = 'visible';
			var xmlhttpExpand = new XMLHttpRequest();
			xmlhttpExpand.onreadystatechange = function () {
				if (xmlhttpExpand.readyState === 4) {
					if (xmlhttpExpand.status === 200) {
						document.getElementById('progress').style.visibility = 'hidden';
						var xmlDoc = xmlhttpExpand.responseXML.documentElement;
						var expanded = xmlDoc.getElementsByTagName('expandtemplates')[0].textContent;
						if (expanded === undefined) {
							expanded = xmlDoc.getElementsByTagName('expandtemplates')[0].childNodes[0].nodeValue;
						}
						expanded = expanded.replace(/<span.*?>/ig, '');
						expanded = expanded.replace(/<\/span>/ig, '');
						expanded = expanded.replace(/<nowiki\/?>/ig, '');
						expanded = expanded.replace(/&#32;/ig, ' ');
						expanded = expanded.replace(/&#59;/ig, ';');
						expanded = expanded.replace(/&#91;/ig, '[');
						expanded = expanded.replace(/&#93;/ig, ']');
						plaincite = citebeg + expanded + citeend;
						// alert(plaincite);
						callback(plaincite);
					} else {
						alert('The query returned an error.');
					}
				}
			};
			xmlhttpExpand.open('GET', url, true);
			xmlhttpExpand.send(null);
		} else {
			alert('Error A1');
		}
	} else {
		if (document.getElementById('verbose').checked) {
			cite = cite.replace(/\|/g, '\n|');
		}
		callback(cite);
	}
}
function makeCiteBook() {
	makeBookCitationCode(function (cite) {
		$('#wpTextbox1').trigger('focus');
		mw.toolbar.insertTags(cite, '', '');
		if (!refToolDebug) {
			oldFormHide();
		}
	});
}
function formatDate(datein, dateformat) {
	if (dateformat === '') {
		return datein;
	}
	datein = datein.replace(/^\s*(.*?)\s*$/, '$1'); // Trim whitespace
	var year = -1;
	var month = -1;
	var date = -1;
	var match = /^(\d\d\d\d)-(\d\d?)(-(\d\d?))?$/.exec(datein);
	if (match) {
		// alert(' match[1]=' + match[1] + ' match[2]=#' + match[2] + '# match[3]=' + match[3] + ' match[4]=' + match[4]  );
		year = parseInt(match[1], 10); // 10 forces decimal conversion
		month = parseInt(match[2], 10);
		if (match[4]) {
			date = parseInt(match[4], 10);
		}
	} else if (/^\d\d? \w+ \d\d\d\d$/.test(datein) || /^\w+ \d\d?, \d\d\d\d$/.test(datein)) {
		var DT = new Date(datein);
		year = DT.getFullYear();
		month = DT.getMonth() + 1;
		date = DT.getDate();
	} else if (datein === 'today') {
		var DT = new Date();
		year = DT.getUTCFullYear();
		month = DT.getUTCMonth() + 1;
		date = DT.getUTCDate();
	} else {
		return datein;
	}
	// alert('datein=' + datein + ', y=' + year + ', m=' + month + ', d=' + date);

	var zmonth = '';
	if (month < 10) {
		zmonth = '0' + month.toString();
	} else {
		zmonth = month.toString();
	}
	month = month.toString();
	var zdate = '';
	if (date > -1) {
		if (date < 10) {
			zdate = '0' + date.toString();
		} else {
			zdate = date.toString();
		}
		date = date.toString();
	} else {
		date = '';
	}
	var datestr = dateformat;
	datestr = datestr.replace('<date>', date);
	datestr = datestr.replace('<month>', month);
	datestr = datestr.replace('<zdate>', zdate);
	datestr = datestr.replace('<zmonth>', zmonth);
	datestr = datestr.replace('<monthname>', months[month - 1]);
	datestr = datestr.replace('<year>', year.toString());
	datestr = datestr.replace(/\s+/, ' ').replace(/^\s+/, '').replace(/(\D),/, '$1').replace(/-$/, '');
	return datestr;
}
function getDateFormat() {
	var dateformat = '';
	if (document.getElementById('dmy')) {
		if (document.getElementById('dmy').checked) {
			dateformat = '<date> <monthname> <year>';
		} else if (document.getElementById('mdy').checked) {
			dateformat = '<monthname> <date>, <year>';
		} else if (document.getElementById('ymd').checked) {
			dateformat = '<year>-<zmonth>-<zdate>';
		}
	} else if (citeUserDateFormat) {
		dateformat = citeUserDateFormat;
	} else {
		dateformat = citeGlobalDateFormat;
	}
	return dateformat;
}
function reformatDates() {
	var dateformat = getDateFormat();
	// alert(':' + dateformat + ':');
	document.getElementById('access-date').value = formatDate(document.getElementById('access-date').value, dateformat);
	document.getElementById('date').value = formatDate(document.getElementById('date').value, dateformat);
	// document.getElementById('dateformat_hidden').value = getDateFormatShort();
}

/* function updateGetButton() {
	document.getElementById('urlget').disabled = document.getElementById('url').value === '';
} */

function preview(wikitext) {
	document.getElementById('progress').style.visibility = 'visible';
	wikitext += '<references />';
	var url = 'api.php?action=parse&format=xml&prop=text&text=' + encodeURIComponent(wikitext);
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState === 4) {
			if (xmlhttp.status === 200) {
				document.getElementById('progress').style.visibility = 'hidden';
				var xmlDoc = xmlhttp.responseXML.documentElement;
				var previewHTML = xmlDoc.getElementsByTagName('text')[0].textContent;
				if (previewHTML === undefined) {
					previewHTML = xmlDoc.getElementsByTagName('text')[0].childNodes[0].nodeValue;
				}
				// alert(previewHTML);
				previewHTML = previewHTML.replace(/href="\//gi, 'href="//en.wikipedia.org/');
				document.getElementById('previewSpan').innerHTML = '<fieldset><legend>Citation preview</legend>' + previewHTML + '</fieldset>';
			} else {
				alert('The query returned an error.');
			}
		}
	};
	xmlhttp.open('GET', url, true);
	xmlhttp.send(null);
}
function previewCitationBook() {
	makeBookCitationCode(preview);
}
function previewCitationDefault() {
	var wikitext = makeCiteCode();
	preview(wikitext);
}
function pullJs() {
	var book_url = document.getElementById('url').value;
	if (book_url) {
		document.getElementById('progress').style.visibility = 'visible';
		var book_url_enc = encodeURIComponent(book_url);
		if (!refTagURL) {
			refTagURL = defaultRefTagURL;
		}
		var baseurl = refTagURL + 'googlebooksjs.py';
		var url = baseurl + '?book_url=' + book_url_enc + '&callback=setFormValues';
		JsonRequest(url);
	} else {
		alert('No URL.');
	}
}
function pullISBN() {
	var isbn = document.getElementById('isbn').value;
	isbn = isbn.replace(/[^0-9]/g, ''); // Digits only
	if (isbn) {
		document.getElementById('progress').style.visibility = 'visible';
		if (!refTagURL) {
			refTagURL = defaultRefTagURL;
		}
		var baseurl = refTagURL + 'getdiberri.py';
		var url = baseurl + '?isbn=' + isbn + '&callback=useDiberriData';
		JsonRequest(url);
	} else {
		alert('No ISBN.');
	}
}
function pullDOI() {
	var doi = document.getElementById('doi').value;
	if (doi) {
		document.getElementById('progress').style.visibility = 'visible';
		if (!refTagURL) {
			refTagURL = defaultRefTagURL;
		}
		var baseurl = refTagURL + 'doifetchjs.py';
		var url = baseurl + '?doi=' + encodeURIComponent(doi) + '&callback=useDoiData';
		JsonRequest(url);
	} else {
		alert('No DOI.');
	}
}
function pullPMID() {
	alert('Not implemented yet...');
}
function pullURL() {
	var url = document.getElementById('url').value;
	if (url) {
		document.getElementById('progress').style.visibility = 'visible';
		if (!refTagURL) {
			refTagURL = defaultRefTagURL;
		}
		var baseurl = refTagURL + 'urlfetchjs.py';
		url = baseurl + '?url=' + encodeURIComponent(url) + '&callback=useUrlData';
		JsonRequest(url);
	} else {
		alert('No URL.');
	}
}
function JsonRequest(url) {
	// importScriptURI(url)  //Bad: does not import the same script more than once
	var script = document.createElement('script');
	script.setAttribute('src', url);
	script.setAttribute('type', 'text/javascript');
	// document.body.appendChild(script);
	document.getElementsByTagName('head')[0].appendChild(script);
}
function setFormValues(bookdata) {
	document.getElementById('progress').style.visibility = 'hidden';
	// alert(bookdata);
	// alert(bookdata.page);
	if (bookdata.title.length !== 0) {
		document.getElementById('title').value = bookdata.title;
	}
	if (bookdata.isbn.length !== 0) {
		document.getElementById('isbn').value = bookdata.isbn;
	}
	if (bookdata.publisher.length !== 0) {
		document.getElementById('publisher').value = bookdata.publisher;
	}
	if (bookdata.pages.length !== 0) {
		document.getElementById('pages').value = bookdata.pages;
		document.getElementById('pages').style.backgroundColor = '#FFFF99';
	}
	if (bookdata.url.length !== 0) {
		document.getElementById('url').value = bookdata.url;
	}
	if (bookdata.date.length !== 0) {
		document.getElementById('date').value = bookdata.date;
	}
	for (var i = 0; i < bookdata.authors.length && i <= 2; i++) {
		authorn = i + 1;
		var author = bookdata.authors[i];
		var match = /(.+)\s+(.+)/.exec(author);
		if (match) {
			document.getElementById('first' + authorn).value = match[1];
			document.getElementById('last' + authorn).value = match[2];
		} else {
			document.getElementById('last' + authorn).value = author;
		}
	}
	document.getElementById('coauthors').value = bookdata.authors.splice(3).join(', ');
	setAccessDateToday();
	makeRefname();
}
function useDiberriData(bookdata) {
	document.getElementById('progress').style.visibility = 'hidden';
	if (bookdata.title.length !== 0) {
		document.getElementById('title').value = bookdata.title;
	}
	if (bookdata.isbn.length !== 0) {
		document.getElementById('isbn').value = bookdata.isbn;
	}
	if (bookdata.publisher.length !== 0) {
		document.getElementById('publisher').value = bookdata.publisher;
	}
	if (bookdata.location.length !== 0) {
		document.getElementById('location').value = bookdata.location;
	}
	if (bookdata.year.length !== 0) {
		document.getElementById('date').value = bookdata.year;
	}
	if (bookdata.authors.length !== 0) {
		authors = bookdata.authors.split(';', 4);
		for (var i = 0; i < authors.length && i <= 2; i++) {
			authorn = i + 1;
			nameparts = authors[i].split(',', 2);
			document.getElementById('last' + authorn).value = nameparts[0].trim();
			if (nameparts.length === 2) {
				document.getElementById('first' + authorn).value = nameparts[1].trim();
			}
		}
		if (authors[3]) {
			document.getElementById('coauthors').value = authors[3].trim();
		}
	}
	makeRefname();
}
function useDoiData(bookdata) {
	document.getElementById('progress').style.visibility = 'hidden';
	if (bookdata.title) {
		document.getElementById('title').value = bookdata.title;
	}
	// if (bookdata.isbn.length !== 0) { document.getElementById('isbn').value = bookdata.isbn; }
	// if (bookdata.publisher.length !== 0) { document.getElementById('publisher').value = bookdata.publisher; }
	// if (bookdata.location.length !== 0) { document.getElementById('location').value = bookdata.location; }
	if (bookdata.year) {
		document.getElementById('date').value = bookdata.year;
	}
	if (bookdata.issn) {
		document.getElementById('issn').value = bookdata.issn;
	}
	if (bookdata.journal) {
		document.getElementById('journal').value = bookdata.journal;
	}
	if (bookdata.volume) {
		document.getElementById('volume').value = bookdata.volume;
	}
	if (bookdata.issue) {
		document.getElementById('issue').value = bookdata.issue;
	}
	if (bookdata.pages) {
		document.getElementById('pages').value = bookdata.pages;
	}
	if (bookdata.authors) {
		var coauthors = [];
		for (var i = 0; i < bookdata.authors.length; i++) {
			var authorn = i + 1;
			var author = bookdata.authors[i];
			if (authorn === 1) {
				if (author.last) {
					document.getElementById('last').value = author.last.trim();
				}
				if (author.first) {
					document.getElementById('first').value = author.first.trim();
				}
			} else {
				var authorparts = [];
				if (author.first) {
					authorparts.push(author.first.trim());
				}
				if (author.last) {
					authorparts.push(author.last.trim());
				}
				coauthors.push(authorparts.join(' '));
			}
		}
		if (coauthors[0]) {
			document.getElementById('coauthors').value = coauthors.join(', ');
		}
	}
	makeRefname();
}
function useUrlData(data) {
	document.getElementById('progress').style.visibility = 'hidden';
	if (data.title) {
		document.getElementById('title').value = data.title;
	}
	if (data.work) {
		document.getElementById('work').value = data.work;
	}
	if (data.page) {
		document.getElementById('pages').value = data.page;
	}
	if (data.date) {
		document.getElementById('date').value = formatDate(data.date, getDateFormat());
	}
	if (data.authors) {
		var coauthors = [];
		for (var i = 0; i < data.authors.length; i++) {
			var authorn = i + 1;
			var author = data.authors[i];
			if (authorn === 1) {
				var match = /(.+)\s+(.+)/.exec(author);
				if (match) {
					document.getElementById('first').value = match[1].trim();
					document.getElementById('last').value = match[2].trim();
				} else {
					document.getElementById('last').value = author.trim();
				}
			} else {
				coauthors.push(author);
			}
		}
		if (coauthors[0]) {
			document.getElementById('coauthors').value = coauthors.join(', ');
		}
	}
}
mw.hook('mw.toolbar').add(function () {
	refbuttons();
});
/* </nowiki> */
