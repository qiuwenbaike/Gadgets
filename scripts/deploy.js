/**
 * @source https://github.com/wikimedia-gadgets/xfdcloser/blob/master/bin/deploy.js
 * @license MIT
 */
// Adapted from https://github.com/wikimedia-gadgets/xfdcloser/blob/master/bin/deploy.js
// (MIT License)
/**
 * This script is used to deploy files to the wiki.
 * You must have interface-admin rights to deploy as gadget.
 *
 * ----------------------------------------------------------------------------
 *    Set up:
 * ----------------------------------------------------------------------------
 * 1) Use [[Special:BotPasswords]] to get credentials. Make sure you enable
 *    sufficient permissions.
 * 2) Create a JSON file to store the username and password. This should be
 *    a plain JSON object with keys "username" and "password", see README
 *    file for an example. Save it here in the "scripts" directory with file
 *    name "credentials.json".
 *
 * ---------------------------------------------------------------------------
 *    Pre-deployment checklist:
 * ---------------------------------------------------------------------------
 * 1) Changes committed and merged to master branch on GitHub repo
 * 2) Currently on master branch, and synced with GitHub repo
 * 3) Run a full build using "grunt build"
 * When all of the above are done ==> you are ready to proceed with deployment
 *
 * --------------------------------------------------------------------------
 *    Usage:
 * --------------------------------------------------------------------------
 * Ensure the pre-deployment steps above are completed, unless you are only
 * deploying to the testwiki (www.qiuwen.wiki). Then, run this script:
 * In the terminal, enter
 *     node deploy.js
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
		file: 'src/Wikiplus/Wikiplus.js',
		target: 'MediaWiki:Gadget-Wikiplus.js'
	},
	{
		file: 'src/Wikiplus/Wikiplus-load.js',
		target: 'MediaWiki:Gadget-Wikiplus-load.js'
	},
	{
		file: 'src/Wikiplus/Wikiplus-highlight.js',
		target: 'MediaWiki:Gadget-Wikiplus-highlight.js'
	},
	{
		file: 'src/Wikicache/Wikicache.js',
		target: 'MediaWiki:Gadget-Wikicache.js'
	},
	{
		file: 'src/Wikicache/Wikicache-load.js',
		target: 'MediaWiki:Gadget-Wikicache-load.js'
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
		file: 'src/Wordcount/Wordcount.js',
		target: 'MediaWiki:Gadget-Wordcount.js'
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
		file: 'src/Edit0/Edit0.css',
		target: 'MediaWiki:Gadget-Edit0.css'
	},
	{
		file: 'src/Edit0/Edit0.js',
		target: 'MediaWiki:Gadget-Edit0.js'
	},
	{
		file: 'src/Banimage/Banimage.js',
		target: 'MediaWiki:Gadget-Banimage.js'
	},
	/* sysop */
	{
		file: 'src/OnlineAdmins/OnlineAdmins.js',
		target: 'MediaWiki:Gadget-OnlineAdmins.js'
	},
	{
		file: 'src/UserRightsManager/UserRightsManager.js',
		target: 'MediaWiki:Gadget-UserRightsManager.js'
	},
	{
		file: 'src/TranslateVariants/TranslateVariants.js',
		target: 'MediaWiki:Gadget-TranslateVariants.js'
	},
	{
		file: 'src/RRD/RRD.js',
		target: 'MediaWiki:Gadget-RRD.js'
	},
	{
		file: 'src/RRD/RRD-main.js',
		target: 'MediaWiki:Gadget-RRD-main.js'
	},
	/* browser */
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
