/* !
 * SPDX-License-Identifier: MIT
 * SPDX-License-Identifier: GPLv2+
 * addText: '{{Gadget Header|license=MIT}}'
 * addText: '{{GPLv2+}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-jQuery.storage.js
 * @source zh.wikipedia.org/w/index.php?oldid=62520995
 * @license MIT or GPLv2+
 */
/* ! jQuery.storage
 *
 * Support browsers: IE6+, Firefox2+, Safari4+, Chrome4+ and Opera 10.5+
 *
 * Usage:
 *   set: $.storage( foo, bar )
 *      or $.storage( { foo1 : bar1, foo2 : bar2, ... } )
 *
 *   get: $.storage( foo )
 *
 *   remove: $.storage( foo, null )
 *
 *   get keys index: $.storageIndex( foo )
 *                 or all: $.storageIndex()
 *
 *   used space: $.storageUsedSpace()
 *
 * Don't worry about IE's single file limit, the script will
 * split data and store them into multiple files automatically.
 *
 * Released under the MIT, BSD, and GPL Licenses.
 */
'use strict';

jQuery.storage = function (key, val) {
	if (key instanceof Object) {
		for (var k in key) {
			if (Object.prototype.hasOwnProperty.call(key, k)) {
				jQuery.storage.success = jQuery.storage.set(k, key[k]);
			}
		}
		return jQuery;
	} else if (val === null) {
		jQuery.storage.remove(key);
		return jQuery;
	} else if (val !== undefined) {
		jQuery.storage.success = jQuery.storage.set(key, val);
		return jQuery;
	}
	return jQuery.storage.get(key);
};
jQuery.storageIndex = function (key) {
	if (key) {
		return jQuery.storage.getIndex()[key];
	}
	return jQuery.storage.getIndex();
};
jQuery.storageUsedSpace = function () {
	var index = jQuery.storage.getIndex();
	var size = 0;
	for (var key in index) {
		if (Object.prototype.hasOwnProperty.call(index, key)) {
			size += index[key];
		}
	}
	return size;
};
jQuery.storage.notsupport = false;
jQuery.storage.nopermission = false;
jQuery.storage.success = false;
if (window.localStorage || window.globalStorage) {
	// use localStorage or globalStorage
	try {
		if (window.localStorage) {
			jQuery.storage._storage = window.localStorage;
		} else {
			jQuery.storage._storage = window.globalStorage[window.location.hostname];
		}
	} catch (e) {
		jQuery.storage.nopermission = true;
	}
	jQuery.storage.getIndex = function getIndex() {
		var st = jQuery.storage._storage;
		var index = st.jQueryStorageIndex;
		return index ? JSON.parse(index) : {};
	};
	jQuery.storage.setIndex = function setIndex(index) {
		var st = jQuery.storage._storage;
		index = JSON.stringify(index);
		st.jQueryStorageIndex = index;
		return true;
	};
	jQuery.storage.set = function set(key, val) {
		var st = jQuery.storage._storage;
		val = JSON.stringify(val);
		try {
			st['jQueryStorage_' + key] = val;
			var index = jQuery.storage.getIndex();
			index[key] = val.length;
			jQuery.storage.setIndex(index);
			return true;
		} catch (e) {
			return false;
		}
	};
	jQuery.storage.get = function get(key) {
		var st = jQuery.storage._storage;
		var val = st['jQueryStorage_' + key];
		return val ? JSON.parse(val) : null;
	};
	jQuery.storage.remove = function remove(key) {
		var st = jQuery.storage._storage;
		delete st['jQueryStorage_' + key];
		var index = jQuery.storage.getIndex();
		delete index[key];
		jQuery.storage.setIndex(index);
	};
	// eslint-disable-next-line no-jquery/no-browser
} else if (jQuery.browser.msie && parseFloat(jQuery.browser.version) < 8) {
	// use userData
	jQuery.storage._userData = jQuery('<input>').attr({
		type: 'hidden',
		id: 'jquery-user-data'
	}).css('behavior', "url('#default#userData')").appendTo(jQuery('body')).get(0);
	try {
		// eslint-disable-next-line no-undef
		ud.load('jQueryStorageIndex');
		// eslint-disable-next-line no-undef
		ud.getAttribute('_uindex');
	} catch (e) {
		jQuery.storage.nopermission = true;
	}
	jQuery.storage.setIndex = function setIndex(index) {
		var ud = jQuery.storage._userData;
		index = JSON.stringify(index);
		ud.load('jQueryStorageIndex');
		ud.setAttribute('_uindex', index);
		ud.save('jQueryStorageIndex');
		return true;
	};
	jQuery.storage.getIndex = function getIndex() {
		var ud = jQuery.storage._userData;
		ud.load('jQueryStorageIndex');
		var index = ud.getAttribute('_uindex');
		return index ? JSON.parse(index) : {};
	};
	jQuery.storage.set = function set(key, val) {
		val = JSON.stringify(val);
		var count = 0;
		var ud = jQuery.storage._userData;
		var vallen = val.length;
		try {
			var keyenc = encodeURIComponent(key);
			var part = val.slice(0, 64000);
			var xml = 'jQueryStorage_' + keyenc + '_' + count++;
			while (val) {
				val = val.slice(64000);
				ud.load(xml);
				ud.setAttribute('_udata', part);
				ud.save(xml);
			}
			ud.expires = new Date(315532799000).toUTCString();
			do {
				// remove the ramain part
				xml = 'jQueryStorage_' + keyenc + '_' + count++;
				ud.load(xml);
				part = ud.getAttribute('_udata');
				if (part) {
					ud.setAttribute('_udata', '');
				}
				ud.save(xml);
			} while (part !== null);
			ud.expires = new Date(0xFFFFFFFFFFF).toUTCString();
			var index = jQuery.storage.getIndex();
			index[key] = vallen;
			jQuery.storage.setIndex(index);
			return true;
		} catch (e) {
			jQuery.storage.remove(key);
			return false;
		}
	};
	jQuery.storage.get = function get(key) {
		var val = [];
		var count = 0;
		var ud = jQuery.storage._userData;
		var keyenc = encodeURIComponent(key);
		do {
			var xml = 'jQueryStorage_' + keyenc + '_' + count++;
			ud.load(xml);
			var part = ud.getAttribute('_udata');
			val.push(part);
			// eslint-disable-next-line block-scoped-var
		} while (part !== null);
		val.pop();
		return val.length ? JSON.parse(val.join('')) : null;
	};
	jQuery.storage.remove = function remove(key) {
		var ud = jQuery.storage._userData;
		var count = 0;
		ud.expires = new Date(315532799000).toUTCString();
		var keyenc = encodeURIComponent(key);
		do {
			var xml = 'jQueryStorage_' + keyenc + '_' + count++;
			ud.load(xml);
			var part = ud.getAttribute('_udata');
			if (part) {
				ud.setAttribute('_udata', '');
			}
			ud.save(xml);
			// eslint-disable-next-line block-scoped-var
		} while (part !== null);
		ud.expires = new Date(0xFFFFFFFFFFF).toUTCString();
		var index = jQuery.storage.getIndex();
		delete index[key];
		jQuery.storage.setIndex(index);
	};
} else {
	jQuery.storage.notsupport = true;
}
