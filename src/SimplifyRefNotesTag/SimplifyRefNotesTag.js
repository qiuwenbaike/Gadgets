/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-SimplifyRefNotesTag.js
 * @source https://zh.wikipedia.org/wiki/MediaWiki:Gadget-SimplifyRefNotesTag.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
'use strict';

$(function () {
	var i, j;
	function num2alp(n) {
		// 本功能將數字按順序轉為英文字母;
		var chk = parseInt(n);
		if (isNaN(chk)) {
			return null;
		}
		var digit = [];
		var result = '';
		while (chk > 0) {
			digit.unshift(chk % 26);
			chk = Math.floor(chk / 26);
		}
		for (j = digit.length; j-- > 0;) {
			if (digit[j] <= 0) {
				if (j > 0) {
					digit[j] += 26;
					digit[j - 1] -= 1;
				} else {
					break;
				}
			}
			result = String.fromCharCode('a'.charCodeAt(0) + (digit[j] - 1)) + result;
		}
		return result;
	} // 功能結束;

	// 將各上標簡化開始;
	var sups = document.getElementsByTagName('sup');
	var supTextNode;
	var temp, num;
	for (i = sups.length; i-- > 0;) {
		if (sups[i].className === 'reference' && String(sups[i].id).indexOf('cite_ref') === 0) {
			if (sups[i].childNodes.length === 1) {
				if (String(sups[i].childNodes[0].tagName).toLowerCase() === 'a') {
					if (sups[i].childNodes[0].childNodes.length === 1) {
						if (String(sups[i].childNodes[0].childNodes[0].nodeName) === '#text') {
							if (sups[i].childNodes[0].childNodes[0].nodeValue.indexOf('[') === 0 || !isNaN(sups[i].childNodes[0].childNodes[0].nodeValue.charAt(0))) {
								if ((sups[i].childNodes[0].childNodes[0].nodeValue + sups[i].group_name).match(/[參参註注]/g)) {
									supTextNode = sups[i].childNodes[0].childNodes[0];
									if (sups[i].parentNode.id === 'refTag-cite_ref-sup') {
										temp = supTextNode.nodeValue.split(/[參参] /g);
										supTextNode.nodeValue = temp.join('');
									} else if (sups[i].parentNode.id === 'noteTag-cite_ref-sup') {
										temp = supTextNode.nodeValue.split(/[註注] /g);
										for (j = temp[temp.length - 1].length; j-- > 0;) {
											if (!isNaN(temp[temp.length - 1].charAt(j))) {
												break;
											}
										}
										num = parseInt(temp[temp.length - 1].slice(0, Math.max(0, j + 1)));
										temp[temp.length - 1] = num2alp(num) + temp[temp.length - 1].slice(Math.max(0, j + 1));
										supTextNode.nodeValue = temp.join('');
									}
								}
							}
						}
					}
				}
			}
		}
	}
	// 將各上標簡化結束;

	// 將備註列表項目用英文字母排序;
	if (document.getElementById('references-NoteFoot')) {
		var ol = document.getElementById('references-NoteFoot').getElementsByTagName('ol');
		for (i = ol.length; i-- > 0;) {
			if (ol[i].className === 'references') {
				ol[i].type = 'a';
			}
		}
	}
});
