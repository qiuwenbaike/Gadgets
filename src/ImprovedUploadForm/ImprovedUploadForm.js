/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @url https://www.qiuwenbaike.cn/wiki/MediaWiki:Gadget-ImprovedUploadForm.js
 * @source commons.wikimedia.org/wiki/MediaWiki:Gadget-ImprovedUploadForm.js
 * @license <https://creativecommons.org/licenses/by-sa/4.0/>
 */
/* eslint one-var:0, vars-on-top:0, camelcase:0, curly:0, space-in-parens:0, indent:0 */
'use strict';

// <nowiki>
/**
 * Enhancements for Special:Upload
 * See also: [[MediaWiki:Gadget-ImprovedUploadForm-main.js]]
 */
(function ($, mw) {
  'use strict';

  if (mw.config.get('wgCanonicalSpecialPageName') === 'Upload' && mw.util.getParamValue('uploadformstyle') !== 'plain') {
    // (Un)comment the following line to globally enable/disable
    // new upload form. Leave the line *above* untouched;
    // that script provides useful default behavior if the new upload form is disabled or
    // redirects to the old form in case an error occurs.
    mw.loader.using([ 'jquery.spinner', 'mediawiki.util' ], function () {
      // Add loading spinner, as UploadForm will be first installed after document ready.
      if ($.createSpinner && !window.UploadForm) {
        $('#mw-upload-form').prepend($.createSpinner({
          id: 'UploadLoadingSpinner',
          size: 'large',
          type: 'block'
        }));
        // Max appearance
        window.setTimeout(function () {
          $.removeSpinner('UploadLoadingSpinner');
        }, 2800);
      }
      mw.loader.load('/index.php?title=MediaWiki:Gadget-ImprovedUploadForm-main.js&action=raw&ctype=text/javascript&smaxage=3600&maxage=3600');
    });
  }
}(jQuery, mediaWiki));
// </nowiki>
