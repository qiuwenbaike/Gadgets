/**
 * @source https://github.com/wikimedia-gadgets/xfdcloser/blob/master/bin/deploy.js
 * @license MIT + CC-BY-SA-3.0 + CC-BY-4.0
 */
// This software is published under the following licenses. You may select the license of your choice.
// - Note: Files published on Wikipedia, including previous versions of XFDcloser, are also available under
// Creative Commons Attribution-ShareAlike 3.0 Unported License (CC BY-SA 3.0)
// https://creativecommons.org/licenses/by-sa/3.0/ and GNU Free Documentation License (GFDL)
// http://www.gnu.org/copyleft/fdl.html
// ---------------------------------------------------------------------------------------------------
// MIT License
// Copyright (c) 2020 Evad37
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software
// and associated documentation files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom
// the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or
// substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
// BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// ---------------------------------------------------------------------------------------------------
// Creative Commons Attribution 4.0 International Public License
// For a human-readable summary, see https://creativecommons.org/licenses/by/4.0/

/**
 * This script is used to deploy files to the wiki.
 * You must have interface-admin rights to deploy as gadget.
 *
 * ----------------------------------------------------------------------------
 *  Set up:
 * ----------------------------------------------------------------------------
 * 1) Use [[Special:BotPasswords]] to get credentials. Make sure you enable
 *  sufficient permissions.
 * 2) Create a JSON file to store the username and password. This should be
 *  a plain JSON object with keys "username" and "password", see README
 *  file for an example. Save it here in the "scripts" directory with file
 *  name "credentials.json".
 *
 * ---------------------------------------------------------------------------
 *  Pre-deployment checklist:
 * ---------------------------------------------------------------------------
 * 1) Changes committed and merged to master branch on GitHub repo
 * 2) Currently on master branch, and synced with GitHub repo
 * 3) Run a full build using "grunt build"
 * When all of the above are done ==> you are ready to proceed with deployment
 *
 * --------------------------------------------------------------------------
 *  Usage:
 * --------------------------------------------------------------------------
 * Ensure the pre-deployment steps above are completed, unless you are only
 * deploying to the testwiki (www.qiuwen.wiki). Then, run this script:
 * In the terminal, enter
 *   node deploy.js
 * and supply the requested details.
 * Notes:
 * - The default summary if not specified is "Updated from repository"
 * - Edit summaries will be prepended with the version number from
 *   the package.json file
 * - Changes to gadget definitions need to be done manually
 *
 */
const fs = require('fs/promises');
const {
	mwn
} = require('mwn');
const {
	execSync
} = require('child_process');
const prompts = require('prompts');
const chalk = require('chalk');
const minimist = require('minimist');

// Adjust target file names if necessary
// All file paths are with respect to repository root
const deployTargets = [
	/* appear */
	{
		file: 'src/HanSect/HanSect.css',
		target: 'MediaWiki:Gadget-HanSect.css'
	},
	{
		file: 'src/SimplifyRefNotesTag/SimplifyRefNotesTag.css',
		target: 'MediaWiki:Gadget-SimplifyRefNotesTag.css'
	},
	{
		file: 'src/SimplifyRefNotesTag/SimplifyRefNotesTag.js',
		target: 'MediaWiki:Gadget-SimplifyRefNotesTag.js'
	},
	{
		file: 'src/NoteTA/NoteTA.css',
		target: 'MediaWiki:Gadget-NoteTA.css'
	},
	{
		file: 'src/NoteTA/NoteTA.js',
		target: 'MediaWiki:Gadget-NoteTA.js'
	},
	{
		file: 'src/NoteTA-Vector/NoteTA-Vector.css',
		target: 'MediaWiki:Gadget-NoteTA-Vector.css'
	},
	{
		file: 'src/NoteTA-Vector/NoteTA-Vector.js',
		target: 'MediaWiki:Gadget-NoteTA-Vector.js'
	},
	{
		file: 'src/CollapsibleSidebar/CollapsibleSidebar.js',
		target: 'MediaWiki:Gadget-CollapsibleSidebar.js'
	},
	{
		file: 'src/OneSideMenu/OneSideMenu.css',
		target: 'MediaWiki:Gadget-OneSideMenu.css'
	},
	{
		file: 'src/HideConversionTab/HideConversionTab.css',
		target: 'MediaWiki:Gadget-HideConversionTab.css'
	},
	{
		file: 'src/DisambigLinks/DisambigLinks.css',
		target: 'MediaWiki:Gadget-DisambigLinks.css'
	},
	{
		file: 'src/ScrollUpButton/ScrollUpButton.js',
		target: 'MediaWiki:Gadget-ScrollUpButton.js'
	},
	{
		file: 'src/Carousel/Carousel.js',
		target: 'MediaWiki:Gadget-Carousel.js'
	},
	{
		file: 'src/Carousel/Carousel-cfg.js',
		target: 'MediaWiki:Gadget-Carousel-cfg.js'
	},
	{
		file: 'src/Carousel/Carousel.css',
		target: 'MediaWiki:Gadget-Carousel.css'
	},
	/* edit */
	{
		file: 'src/Wikiplus/Wikiplus-load.js',
		target: 'MediaWiki:Gadget-Wikiplus-load.js'
	},
	{
		file: 'src/Wikiplus/Wikiplus.js',
		target: 'MediaWiki:Gadget-Wikiplus.js'
	},
	{
		file: 'src/Wikiplus/Wikiplus-highlight.js',
		target: 'MediaWiki:Gadget-Wikiplus-highlight.js'
	},
	{
		file: 'src/InPageEdit/InPageEdit-load.js',
		target: 'MediaWiki:Gadget-InPageEdit-load.js'
	},
	{
		file: 'src/InPageEdit/InPageEdit.css',
		target: 'MediaWiki:Gadget-InPageEdit.css'
	},
	{
		file: 'src/Wikicache/Wikicache-load.js',
		target: 'MediaWiki:Gadget-Wikicache-load.js'
	},
	{
		file: 'src/Wikicache/Wikicache.js',
		target: 'MediaWiki:Gadget-Wikicache.js'
	},
	{
		file: 'src/Wikicache/JSON2.js',
		target: 'MediaWiki:Gadget-JSON2.js'
	},
	{
		file: 'src/Wikicache/jQuery.storage.js',
		target: 'MediaWiki:Gadget-jQuery.storage.js'
	},
	{
		file: 'src/ToolsRedirect/ToolsRedirect.css',
		target: 'MediaWiki:Gadget-ToolsRedirect.css'
	},
	{
		file: 'src/ToolsRedirect/ToolsRedirect.js',
		target: 'MediaWiki:Gadget-ToolsRedirect.js'
	},
	{
		file: 'src/ToolsRedirect-opt-bolds/ToolsRedirect-opt-bolds.js',
		target: 'MediaWiki:Gadget-ToolsRedirect-opt-bolds.js'
	},
	{
		file: 'src/ToolsRedirect-bio-latin-names/ToolsRedirect-bio-latin-names.js',
		target: 'MediaWiki:Gadget-ToolsRedirect-bio-latin-names.js'
	},
	{
		file: 'src/ToolsRedirect-courtesy-and-art-names/ToolsRedirect-courtesy-and-art-names.js',
		target: 'MediaWiki:Gadget-ToolsRedirect-courtesy-and-art-names.js'
	},
	{
		file: 'src/RefToolbar/RefToolbar.js',
		target: 'MediaWiki:Gadget-RefToolbar.js'
	},
	{
		file: 'src/RefToolbar/RefToolbar2.0.js',
		target: 'MediaWiki:Gadget-RefToolbar2.0.js'
	},
	{
		file: 'src/RefToolbar/RefToolbarConfig.js',
		target: 'MediaWiki:Gadget-RefToolbarConfig.js'
	},
	{
		file: 'src/RefToolbar/RefToolbarLegacy.js',
		target: 'MediaWiki:Gadget-RefToolbarLegacy.js'
	},
	{
		file: 'src/RefToolbar/RefToolbarBase.js',
		target: 'MediaWiki:Gadget-RefToolbarBase.js'
	},
	{
		file: 'src/RefToolbar/RefToolbarMessages.js',
		target: 'MediaWiki:Gadget-RefToolbarMessages.js',
	},
	{
		file: 'src/RefToolbar/RefToolbarMessages-en.js',
		target: 'MediaWiki:Gadget-RefToolbarMessages-en.js',
	},
	{
		file: 'src/RefToolbar/RefToolbarMessages-zh-hans.js',
		target: 'MediaWiki:Gadget-RefToolbarMessages-zh-hans.js',
	},
	{
		file: 'src/RefToolbar/RefToolbarMessages-zh-hant.js',
		target: 'MediaWiki:Gadget-RefToolbarMessages-zh-hant.js',
	},
	{
		file: 'src/Edittools-vector/Edittools-vector.js',
		target: 'MediaWiki:Gadget-Edittools-vector.js'
	},
	{
		file: 'src/Edittools-vplus/Edittools-vplus.js',
		target: 'MediaWiki:Gadget-Edittools-vplus.js'
	},
	{
		file: 'src/Wordcount/Wordcount.js',
		target: 'MediaWiki:Gadget-Wordcount.js'
	},
	{
		file: 'src/Cat-a-lot/Cat-a-lot.css',
		target: 'MediaWiki:Gadget-Cat-a-lot.css'
	},
	{
		file: 'src/Cat-a-lot/Cat-a-lot.js',
		target: 'MediaWiki:Gadget-Cat-a-lot.js'
	},
	{
		file: 'src/HotCat/HotCat.js',
		target: 'MediaWiki:Gadget-HotCat.js'
	},
	{
		file: 'src/HotCat/Hotcatcheck.js',
		target: 'MediaWiki:Gadget-Hotcatcheck.js'
	},
	{
		file: 'src/HotCat/HotCat-zh-hans.js',
		target: 'MediaWiki:Gadget-HotCat-zh-hans.js'
	},
	{
		file: 'src/HotCat/HotCat-zh-hant.js',
		target: 'MediaWiki:Gadget-HotCat-zh-hant.js'
	},
	{
		file: 'src/HotCat/HotCat-local-defaults.js',
		target: 'MediaWiki:Gadget-HotCat-local-defaults.js'
	},
	{
		file: 'src/Edit0/Edit0.css',
		target: 'MediaWiki:Gadget-Edit0.css'
	},
	{
		file: 'src/Edit0/Edit0.js',
		target: 'MediaWiki:Gadget-Edit0.js'
	},
	{
		file: 'src/PreviewWithVariant/PreviewWithVariant.js',
		target: 'MediaWiki:Gadget-PreviewWithVariant.js'
	},
	{
		file: 'src/PreviewWithVariant2017/PreviewWithVariant2017.css',
		target: 'MediaWiki:Gadget-PreviewWithVariant2017.css'
	},
	{
		file: 'src/PreviewWithVariant2017/PreviewWithVariant2017.js',
		target: 'MediaWiki:Gadget-PreviewWithVariant2017.js'
	},
	{
		file: 'src/EasyArchive/EasyArchive.js',
		target: 'MediaWiki:Gadget-EasyArchive.js'
	},
	{
		file: 'src/EasyArchive/EasyArchive-main.js',
		target: 'MediaWiki:Gadget-EasyArchive-main.js'
	},
	{
		file: 'src/Edit-count/Edit-count.js',
		target: 'MediaWiki:Gadget-Edit-count.js'
	},
	{
		file: 'src/Rollback-summary/Rollback-summary.js',
		target: 'MediaWiki:Gadget-Rollback-summary.js'
	},
	{
		file: 'src/BanPage/BanPage.js',
		target: 'MediaWiki:Gadget-BanPage.js'
	},
	{
		file: 'src/DisamAssist/DisamAssist.css',
		target: 'MediaWiki:Gadget-DisamAssist.css'
	},
	{
		file: 'src/DisamAssist/DisamAssist.js',
		target: 'MediaWiki:Gadget-DisamAssist.js'
	},
	{
		file: 'src/DisamAssist/DisamAssist-core.js',
		target: 'MediaWiki:Gadget-DisamAssist-core.js'
	},
	/* sysop */
	{
		file: 'src/Twinkle/twinkle.js',
		target: 'MediaWiki:Gadget-Twinkle.js'
	},
	{
		file: 'src/Twinkle/twinkle.css',
		target: 'MediaWiki:Gadget-Twinkle.css'
	},
	{
		file: 'src/Twinkle/morebits.js',
		target: 'MediaWiki:Gadget-morebits.js'
	},
	{
		file: 'src/Twinkle/morebits.css',
		target: 'MediaWiki:Gadget-morebits.css'
	},
	{
		file: 'src/Twinkle/twinkle-pagestyles.css',
		target: 'MediaWiki:Gadget-Twinkle-pagestyles.css'
	},
	{
		file: 'src/Twinkle/modules/friendlytag.js',
		target: 'MediaWiki:Gadget-friendlytag.js'
	},
	{
		file: 'src/Twinkle/modules/friendlytalkback.js',
		target: 'MediaWiki:Gadget-friendlytalkback.js'
	},
	{
		file: 'src/Twinkle/modules/twinklearv.js',
		target: 'MediaWiki:Gadget-twinklearv.js'
	},
	{
		file: 'src/Twinkle/modules/twinklebatchprotect.js',
		target: 'MediaWiki:Gadget-twinklebatchprotect.js'
	},
	{
		file: 'src/Twinkle/modules/twinklebatchdelete.js',
		target: 'MediaWiki:Gadget-twinklebatchdelete.js'
	},
	{
		file: 'src/Twinkle/modules/twinklebatchundelete.js',
		target: 'MediaWiki:Gadget-twinklebatchundelete.js'
	},
	{
		file: 'src/Twinkle/modules/twinkleblock.js',
		target: 'MediaWiki:Gadget-twinkleblock.js'
	},
	{
		file: 'src/Twinkle/modules/twinkleclose.js',
		target: 'MediaWiki:Gadget-twinkleclose.js'
	},
	{
		file: 'src/Twinkle/modules/twinkleconfig.js',
		target: 'MediaWiki:Gadget-twinkleconfig.js'
	},
	{
		file: 'src/Twinkle/modules/twinklecopyvio.js',
		target: 'MediaWiki:Gadget-twinklecopyvio.js'
	},
	{
		file: 'src/Twinkle/modules/twinklediff.js',
		target: 'MediaWiki:Gadget-twinklediff.js'
	},
	{
		file: 'src/Twinkle/modules/twinklefluff.js',
		target: 'MediaWiki:Gadget-twinklefluff.js'
	},
	{
		file: 'src/Twinkle/modules/twinkleimage.js',
		target: 'MediaWiki:Gadget-twinkleimage.js'
	},
	{
		file: 'src/Twinkle/modules/twinkleprotect.js',
		target: 'MediaWiki:Gadget-twinkleprotect.js'
	},
	{
		file: 'src/Twinkle/modules/twinklespeedy.js',
		target: 'MediaWiki:Gadget-twinklespeedy.js'
	},
	{
		file: 'src/Twinkle/modules/twinklestub.js',
		target: 'MediaWiki:Gadget-twinklestub.js'
	},
	{
		file: 'src/Twinkle/modules/twinkleunlink.js',
		target: 'MediaWiki:Gadget-twinkleunlink.js'
	},
	{
		file: 'src/Twinkle/modules/twinklewarn.js',
		target: 'MediaWiki:Gadget-twinklewarn.js'
	},
	{
		file: 'src/Twinkle/modules/twinklexfd.js',
		target: 'MediaWiki:Gadget-twinklexfd.js'
	},
	{
		file: 'src/MarkRights/MarkRights.css',
		target: 'MediaWiki:Gadget-MarkRights.css'
	},
	{
		file: 'src/MarkRights/MarkRights.js',
		target: 'MediaWiki:Gadget-MarkRights.js'
	},
	{
		file: 'src/OnlineAdmins/OnlineAdmins.js',
		target: 'MediaWiki:Gadget-OnlineAdmins.js'
	},
	{
		file: 'src/UserRightsManager/UserRightsManager.js',
		target: 'MediaWiki:Gadget-UserRightsManager.js'
	},
	{
		file: 'src/Definitions/Definitions.css',
		target: 'MediaWiki:Gadget-Definitions.css'
	},
	{
		file: 'src/Definitions/Definitions.js',
		target: 'MediaWiki:Gadget-Definitions.js'
	},
	{
		file: 'src/TranslateVariants/TranslateVariants.js',
		target: 'MediaWiki:Gadget-TranslateVariants.js'
	},
	{
		file: 'src/RRD/RRD.js',
		target: 'MediaWiki:Gadget-RRD.js'
	},
	/* browser */
	{
		file: 'src/Popups/Popups.css',
		target: 'MediaWiki:Gadget-Popups.css'
	},
	{
		file: 'src/Popups/Popups.js',
		target: 'MediaWiki:Gadget-Popups.js'
	},
	{
		file: 'src/Popups/Popups-main.js',
		target: 'MediaWiki:Gadget-Popups-main.js'
	},
	{
		file: 'src/UTCLiveClock/UTCLiveClock.js',
		target: 'MediaWiki:Gadget-UTCLiveClock.js'
	},
	{
		file: 'src/ConfirmLogout/ConfirmLogout.js',
		target: 'MediaWiki:Gadget-ConfirmLogout.js'
	},
	{
		file: 'src/PurgePageCache/PurgePageCache.js',
		target: 'MediaWiki:Gadget-PurgePageCache.js'
	},
	{
		file: 'src/Difflink/Difflink.js',
		target: 'MediaWiki:Gadget-Difflink.js'
	},
	{
		file: 'src/ShortURL/ShortURL.js',
		target: 'MediaWiki:Gadget-ShortURL.js'
	},
	{
		file: 'src/Fullwidth-search-fix/Fullwidth-search-fix.js',
		target: 'MediaWiki:Gadget-Fullwidth-search-fix.js'
	},
	{
		file: 'src/Did-you-mean/Did-you-mean.js',
		target: 'MediaWiki:Gadget-Did-you-mean.js'
	},
	/* compatibility */
	{
		file: 'src/NavboxCSS/Navbox.css',
		target: 'MediaWiki:Gadget-Navbox.css'
	},
	{
		file: 'src/InfoboxCSS/Infobox.css',
		target: 'MediaWiki:Gadget-Infobox.css'
	},
	{
		file: 'src/MboxCSS/Mbox.css',
		target: 'MediaWiki:Gadget-Mbox.css'
	},
	{
		file: 'src/SiteCommonJS/SiteCommon.js',
		target: 'MediaWiki:Gadget-SiteCommon.js'
	},
	{
		file: 'src/SpecialWikitext/SpecialWikitext.js',
		target: 'MediaWiki:Gadget-SpecialWikitext.js'
	},
	{
		file: 'src/NavFrame/NavFrame.css',
		target: 'MediaWiki:Gadget-NavFrame.css'
	},
	{
		file: 'src/NavFrame/NavFrame.js',
		target: 'MediaWiki:Gadget-NavFrame.js'
	},
	{
		file: 'src/Collapsible/Collapsible.css',
		target: 'MediaWiki:Gadget-Collapsible.css'
	},
	{
		file: 'src/Collapsible/Collapsible.js',
		target: 'MediaWiki:Gadget-Collapsible.js'
	},
	{
		file: 'src/History-disclaimer/History-disclaimer.js',
		target: 'MediaWiki:Gadget-History-disclaimer.js'
	},
	{
		file: 'src/History-disclaimer/History-disclaimer.css',
		target: 'MediaWiki:Gadget-History-disclaimer.css'
	},
	{
		file: 'src/Report/Report.js',
		target: 'MediaWiki:Gadget-Report.js'
	},
	{
		file: 'src/SideTOC/SideTOC.js',
		target: 'MediaWiki:Gadget-SideTOC.js'
	},
	{
		file: 'src/EditFormJS/Editform.js',
		target: 'MediaWiki:Gadget-Editform.js'
	},
	{
		file: 'src/Ding/Ding.js',
		target: 'MediaWiki:Gadget-Ding.js'
	},
	/* Other stylesheets and scripts */
	{
		file: 'src/Common/Common.css',
		target: 'MediaWiki:Common.css'
	},
	{
		file: 'src/Common/Common.js',
		target: 'MediaWiki:Common.js'
	},
	{
		file: 'src/Common/Gongbi.css',
		target: 'MediaWiki:Gongbi.css'
	},
	{
		file: 'src/Common/Vector.css',
		target: 'MediaWiki:Vector.css'
	},
	{
		file: 'src/Common/Write.css',
		target: 'MediaWiki:Write.css'
	},
	{
		file: 'src/Common/Print.css',
		target: 'MediaWiki:Print.css',
	},
	{
		file: 'src/Common/Group-user.css',
		target: 'MediaWiki:Group-user.css',
	},
	{
		file: 'src/Common/Group-user.js',
		target: 'MediaWiki:Group-user.js',
	},
	{
		file: 'src/Common/Group-autoconfirmed.css',
		target: 'MediaWiki:Group-autoconfirmed.css',
	},
	{
		file: 'src/Common/Group-sysop.css',
		target: 'MediaWiki:Group-sysop.css',
	},
	{
		file: 'src/Common/Group-senioreditor.css',
		target: 'MediaWiki:Group-senioreditor.css',
	},
	{
		file: 'src/Common/Group-steward.css',
		target: 'MediaWiki:Group-steward.css',
	},
	{
		file: 'src/Common/Group-autoreviewer.css',
		target: 'MediaWiki:Group-autoreviewer.css',
	},
	{
		file: 'src/Common/Group-patroller.css',
		target: 'MediaWiki:Group-patroller.css',
	},
	{
		file: 'src/Common/Group-transwiki.css',
		target: 'MediaWiki:Group-transwiki.css',
	},
];

class Deploy {
	async deploy() {
		if (!isGitWorkDirClean()) {
			log('red', '[WARN] Git working directory is not clean.');
		}
		const config = this.loadConfig();
		await this.getApi(config);
		await this.login();
		await this.makeEditSummary();
		await this.savePages();
	}

	loadConfig() {
		try {
			return require(__dirname + '/credentials.json');
		} catch (e) {
			log('red', 'No credentials.json file found.');
			return {};
		}
	}

	async getApi(config) {
		this.api = new mwn(config);
		try {
			this.api.initOAuth();
			this.usingOAuth = true;
		} catch (e) {
			if (!config.username) {
				config.username = await input('> Enter username');
			}
			if (!config.password) {
				config.password = await input('> Enter bot password', 'password');
			}
		}
		if (args.testwiki) {
			config.apiUrl = `https://www.qiuwen.wiki/api.php`;
		} else {
			if (!config.apiUrl) {
				if (Object.keys(config).length) {
					log('yellow', 'Tip: you can avoid this prompt by setting the apiUrl as well in credentials.json');
				}
				const site = await input('> Enter sitename (eg. www.qiuwen.wiki)');
				config.apiUrl = `https://${site}/api.php`;
			}
		}
		this.api.setOptions(config);
	}

	async login() {
		this.siteName = this.api.options.apiUrl.replace(/^https:\/\//, '')
			.replace(/\/.*/, '');
		log('yellow', '--- Logging in ...');
		if (this.usingOAuth) {
			await this.api.getTokensAndSiteInfo();
		} else {
			await this.api.login();
		}
	}

	async makeEditSummary() {
		this.sha = execSync('git rev-parse --short HEAD').toString('utf8').trim();
		const message = await input('> Edit summary message (optional): ');
		this.editSummary = `Git 版本 ${this.sha}: ${message || '代码仓库同步更新'}`;
		console.log(`Edit summary is: "${this.editSummary}"`);
	}

	async readFile(filepath) {
		return (await fs.readFile(__dirname + '/../' + filepath)).toString();
	}

	async savePages() {
		await input(`> Press [Enter] to start deploying to ${this.siteName} or [ctrl + C] to cancel`);

		log('yellow', '--- starting deployment ---');

		for await (let {
			file,
			target
		} of deployTargets) {
			let fileText = await this.readFile(file);
			// fileText = `/* _addText: '{{Gadget Header|${this.sha}}}' */` + '\n' + fileText;
			try {
				const response = await this.api.save(target, fileText, this.editSummary);
				if (response && response.nochange) {
					log('yellow', `━ No change saving ${file} to ${target} on ${this.siteName}`);
				} else {
					log('green', `✔ Successfully saved ${file} to ${target} on ${this.siteName}`);
				}
			} catch (error) {
				log('red', `✘ Failed to save ${file} to ${target} on ${this.siteName}`);
				logError(error);
			}
		}
		log('yellow', '--- end of deployment ---');
	}
}

function isGitWorkDirClean() {
	try {
		execSync('git diff-index --quiet HEAD --');
		return true;
	} catch (e) {
		return false;
	}
}

async function input(message, type = 'text', initial = '') {
	let name = String(Math.random());
	return (await prompts({
		type,
		name,
		message,
		initial
	}))[name];
}

function logError(error) {
	error = error || {};
	console.log((error.info || 'Unknown error') + '\n', error.response || error);
}

function log(color, ...args) {
	console.log(chalk[color](...args));
}

const args = minimist(process.argv.slice(2));
new Deploy().deploy();
