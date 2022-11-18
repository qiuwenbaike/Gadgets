/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-Ding.js
 * @source https://zh.wikipedia.org/wiki/Special:Permalink/59753812
 * @license CC-BY-SA-4.0
 */
/* eslint-disable camelcase */
'use strict';

/* ding ("message here should be safe html, beacuse you can write <button>Buttons</button>", "info" | "warning" | "success" | "default", "long" | 10000 <-- expiry time in ms ) */
window.bldkDingExposedInterface = (function () {
/**
 *
 * @param {string} message message here should be safe html, beacuse you can write <button>Buttons</button> in this
 * @param {string} type "info": dark blue/black, "warning": red/white, "success": green/white, "default": light blue/black (background/text)
 * @param {number|"long"} ttl number of microseconds before ding element disappears, "long" if the ding should not disappear after a timeout
 * @param {boolean} history does nothing currently
 * @param {boolean} persist If the element should go away when user clicks anywhere on it. If persist= true && ttl= long, make sure to include a button to allow the user to remove the banner
 */
function ding(message, type, ttl, history, persist) {
	if (type === undefined) {
		type = 'info';
	}
	if (ttl === undefined) {
		ttl = 3500;
	}
	if (history === undefined) {
		history = true;
	}
	if (persist === undefined) {
		persist = false;
	}
	if (!document.getElementById('bluedeck_ding')) {
		document.body.insertAdjacentHTML('afterbegin', '<style>#bluedeck_ding button{margin: 0 0.2em; background:transparent; border:0.2em solid white; border-radius: 9em; padding: 0 0.7em; box-sizing: border-box; color: inherit; font-weight: inherit;}#bluedeck_ding button:active{background:rgba(255,255,255,0.6)}</style>');
		document.body.insertAdjacentHTML('afterbegin', "<div id='bluedeck_ding'></div>");
	}
	if (!document.getElementById('bluedeck_ding_history')) {
		document.body.insertAdjacentHTML('afterbegin', "<div id='bluedeck_ding_history'></div>");
	}
	var dingEle = document.getElementById('bluedeck_ding');
	// eslint-disable-next-line no-unused-vars
	var dingHistEle = document.getElementById('bluedeck_ding_history');
	var previousMessage = dingEle.lastChild;
	if (previousMessage) {
		previousMessage.style.transform = 'translateY(-130%)';
		setTimeout(function () {
			previousMessage.remove();
		}, 500);
	}
	var color_sets = {
		warning: { text: 'rgba(255, 255, 255, 1)', background: 'rgba(221, 51,  51,  1)' },
		info: { text: 'rgba(255, 255, 255, 1)', background: 'rgba(51,  102, 204, 1)' },
		success: { text: 'rgba(255, 255, 255, 1)', background: 'rgba(0, 175, 137, 1)' },
		confusion: { text: 'rgba(0, 0, 0, 1)', background: 'rgba(234, 236, 240, 1)' },
		default: { text: 'rgba(0, 0, 0, 1)', background: 'rgba(234, 236, 240, 1)' }
	};
	var retractant = persist ? '' : "onclick='this.style.transform = \"translateY(-130%)\";setTimeout(function(){this.remove()}.bind(this), 500);' ";
	dingEle.insertAdjacentHTML('beforeend', '<div ' +
		retractant +
		"style='" +
		'position:fixed; bottom:0; left:0; right:0; margin: 0 0 auto 0; height: auto; line-height: 1.4em; ' +
		'padding: 0.6em 2em; opacity: 1; text-align: center; z-index: 9999; font-size: 86%; box-shadow: 0 2px 5px rgba(0,0,0,0.2); ' +
		'font-weight: bold; transform: translateY(-130%); transition: all 0.2s;' +
		'background: ' + color_sets[type].background + '; color:' + color_sets[type].text + "; ' " +
		'>' +
		message +
		'</div>');
	var noticeEle = dingEle.lastChild;
	setTimeout(function () {
		noticeEle.style.transform = 'translateY(0%)';
	}, 10);
	if (ttl !== 'long') {
		setTimeout(function () {
			noticeEle.style.transform = 'translateY(-130%)';
		}, ttl + 10);
		setTimeout(function () {
			noticeEle.remove();
		}, ttl + 510);
	}
}
return ding;
}());
