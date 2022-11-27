/**
 * SPDX-License-Identifier: GPL-3.0
 * _addText: '{{Gadget Header|license=GPL-3.0}}'
 *
 * @url https://fastly.jsdelivr.net/npm/mediawiki-inpageedit
 * @license GPL-3.0
 */
(() => {
	var e = {
		192: (e) => {
			const t = ((e = "") =>
			(e = e.split("?")[0]).endsWith(".js")
				? e.includes("/dist/")
				? e.split("/dist/")[0]
				: e.split("/").slice(0, -1).join("/")
				: e.replace(/\/$/, ""))(document?.currentScript?.src);
			e.exports = t;
		},
		855: (e, t, i) => {
			const a = i(192),
			{ loadScript: n } = i(410),
			{ initQueryData: o } = i(561),
			{ loadStyles: s } = i(770),
			{ updateNotice: r } = i(340),
			{ syncI18nData: l } = i(874),
			c = i(626),
			{ pluginCDN: d } = i(550);
			e.exports = async function () {
			mw.hook("InPageEdit.init.before").fire(),
				await mw.loader.using([
				"mediawiki.api",
				"mediawiki.util",
				"mediawiki.user"
				]);
			const e = !(
				!mw.util.getParamValue("ipedev", location.href) &&
				c === localStorage.getItem("InPageEditVersion")
			);
			s(e),
				await Promise.all([
				l(e),
				n(`${d}/lib/ssi-modal/ssi-modal.js`),
				o()
				]),
				mw.hook("InPageEdit.init.i18n").fire({ _msg: i(658)._msg }),
				mw
				.hook("InPageEdit.init.modal")
				.fire({ ssi_modal: window.ssi_modal });
			const { _analytics: t } = i(955),
				{ _msg: p } = i(658),
				{ about: f } = i(175),
				m = i(550),
				{ articleLink: g } = i(901),
				{ linksHere: u } = i(15),
				{ loadQuickDiff: h } = i(501),
				{ preference: w } = i(525),
				{ pluginStore: b } = i(937),
				{ progress: v } = i(763),
				{ quickDelete: k } = i(174),
				{ quickDiff: y } = i(812),
				{ quickEdit: x } = i(588),
				{ quickPreview: _ } = i(597),
				{ quickRedirect: P } = i(977),
				{ quickRename: N } = i(79),
				{ specialNotice: I } = i(5),
				{ versionInfo: q } = i(776);
			w.set(),
				mw.hook("wikipage.content").add(h),
				await $.ready,
				g(),
				r(),
				b.initUserPlugin();
			var E = {
				_dir: a,
				about: f,
				api: m,
				articleLink: g,
				linksHere: u,
				loadQuickDiff: h,
				preference: w,
				progress: v,
				quickDelete: k,
				quickDiff: y,
				quickEdit: x,
				quickPreview: _,
				quickRedirect: P,
				quickRename: N,
				specialNotice: I,
				version: c,
				versionInfo: q,
				delete: k,
				diff: y,
				edit: x,
				preview: _,
				redirect: P,
				quickMove: N,
				rename: N
			};
			return (
				["_dir", "api", "version"].forEach((e) => {
				try {
					Object.freeze(E[e]);
				} catch (e) {}
				}),
				mw
				.hook("InPageEdit")
				.fire({ _analysis: t, _msg: p, InPageEdit: E }),
				console.info(
				"		____			____									 ______		___ __ \n	 /	_/___	/ __ \\____ _____ ____	/ ____/___/ (_) /_\n	 / // __ \\/ /_/ / __ `/ __ `/ _ \\/ __/ / __	/ / __/\n _/ // / / / ____/ /_/ / /_/ /	__/ /___/ /_/ / / /_	\n/___/_/ /_/_/		\\__,_/\\__, /\\___/_____/\\__,_/_/\\__/	\n											/____/								v" +
					c
				),
				E
			);
			};
		},
		561: (e) => {
			const t = new mw.Api({
			parameters: { format: "json", formatversion: 2 }
			});
			e.exports = {
			initQueryData: async function () {
				mw.config.set("wgUserRights", []),
				mw.config.set("wgUserIsBlocked", !1),
				mw.config.set("wgSpecialPageAliases", []);
				const {
				query: { users: e, userinfo: i, specialpagealiases: a }
				} = await t.get({
				action: "query",
				ususers: mw.config.get("wgUserName"),
				meta: ["userinfo", "siteinfo"],
				list: ["users"],
				uiprop: ["rights"],
				siprop: ["specialpagealiases"],
				usprop: ["blockinfo"]
				});
				return (
				e?.[0].blockid && mw.config.set("wgUserIsBlocked", !0),
				mw.config.set("wgUserRights", i?.rights || []),
				mw.config.set("wgSpecialPageAliases", a),
				{ users: e, userinfo: i, specialpagealiases: a }
				);
			}
			};
		},
		410: (e) => {
			e.exports = {
			loadScript: function (e, t) {
				return $.ajax({
				url: e,
				dataType: "script",
				crossDomain: !0,
				cache: !t
				});
			}
			};
		},
		770: (e, t, i) => {
			const { pluginCDN: a } = i(550),
			n = i(192);
			e.exports = {
			loadStyles: function (e) {
				[
				`${a}/skins/ipe-default.css`,
				`${a}/lib/ssi-modal/ssi-modal.css`,
				"https://fastly.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css"
				].forEach((t) => {
				!0 !== /^https?:\/\//.test(t) && (t = n + t),
					e && (t += "?timestamp" + new Date().getTime()),
					$("head").prepend(
					$("<link>", {
						href: t,
						rel: "stylesheet",
						"data-ipe": "style"
					})
					);
				});
			}
			};
		},
		874: (e, t, i) => {
			var a = mw.config.get();
			const n = i(192) + "/i18n/languages.json",
			o = "i18n-cache-InPageEdit-content",
			s = "i18n-cache-InPageEdit-timestamp";
			async function r() {
			console.time("[InPageEdit] 从远程获取 i18n 数据");
			var e = await $.getJSON(n, {
				cache: !1,
				timestamp: new Date().getTime()
			});
			return (
				"object" != typeof e && (e = {}),
				(function (e) {
				const t = new Date().getTime();
				(e = JSON.stringify(e)),
					localStorage.setItem(o, e),
					localStorage.setItem(s, t);
				})(e),
				console.timeEnd("[InPageEdit] 从远程获取 i18n 数据"),
				e
			);
			}
			e.exports = {
			syncI18nData: async function (e) {
				const t = new Date().getTime();
				if ("qqx" === a.wgUserLanguage)
				return console.warn("[InPageEdit] User language is qqx"), !0;
				if (
				localStorage.getItem(o) &&
				t - localStorage.getItem(s) < 72e5 &&
				!e
				) {
				var i = {};
				try {
					i = JSON.parse(localStorage.getItem(o));
				} catch (e) {
					return (
					console.warn("[InPageEdit] i18n 数据不合法"), await r(), !0
					);
				}
				return (
					i.en ||
					(console.warn("[InPageEdit] i18n 数据可能已损坏"), await r()),
					!0
				);
				}
				return await r(), !0;
			}
			};
		},
		340: (e, t, i) => {
			const a = i(626),
			{ _msg: n } = i(658),
			{ versionInfo: o } = i(776),
			{ specialNotice: s } = i(5);
			e.exports = {
			updateNotice: function () {
				localStorage.getItem("InPageEditVersion") !== a &&
				ssi_modal.notify("", {
					title: n("updatelog-update-success-title"),
					content: n("updatelog-update-success", a),
					className: "in-page-edit",
					buttons: [
					{
						className: "btn btn-primary",
						label: n("updatelog-button-versioninfo"),
						method(e, t) {
						localStorage.setItem("InPageEditVersion", a),
							o(),
							t.close();
						}
					}
					],
					closeAfter: { time: 10, resetOnHover: !0 },
					onClose() {
					localStorage.setItem("InPageEditVersion", a);
					}
				}),
				localStorage.getItem("InPageEditNoticeId") !== n("noticeid") &&
					s();
			}
			};
		},
		955: (e, t, i) => {
			const { analyticsApi: a } = i(550),
			{ preference: n } = i(525),
			{ config: o } = i(663),
			s = i(626);
			function r(e) {
			n.get("doNotCollectMyInfo");
			const t = {
				siteUrl: l(),
				siteName: o.wgSiteName,
				userName: o.wgUserName,
				featureID: e,
				ipeVersion: s
			};
			$.ajax({
				url: `${a}/submit`,
				data: t,
				type: "post",
				dataType: "json"
			}).done(function (e) {
				console.log("[InPageEdit] Analytics response", e);
			});
			}
			function l() {
			return `${o.wgServer}${o.wgArticlePath.replace("$1", "")}`;
			}
			e.exports = { _analytics: r, _analysis: r, getSiteID: l };
		},
		494: (e) => {
			var { getUrl: t } = mw.util,
			i = "<br>",
			a = "<hr>",
			n =
				'<div class="ipe-progress" style="width: 100%"><div class="ipe-progress-bar"></div></div>';
			e.exports = {
			$br: i,
			br: i,
			$button: ({ type: e, text: t, html: i, href: a, link: n }) => {
				(i = i || t), (a = a || n);
				var o = $("<button>", {
				class: e ? "btn btn-" + e : "btn",
				html: i
				});
				if (a || n) {
				var s = "";
				/^https?:\/\//.test(a) && (s = "_blank");
				var r = $("<a>", { target: s, href: a });
				o.appendTo(r);
				}
				return o;
			},
			$hr: a,
			hr: a,
			$link: ({ page: e, link: i, href: a, text: n, html: o }) => {
				(a = a || i || "javascript:void(0);"),
				e && (a = t(e)),
				(o = o || n),
				e && !o && (o = e),
				o || (o = a);
				var s = "";
				return (
				/^https?:\/\//.test(a) && (s = "_blank"),
				$("<a>", { href: a, target: s, html: o })
				);
			},
			$progress: n,
			progress: n,
			$checkbox: ({ label: e, checked: t, id: i, className: a }) =>
				$("<label>", { class: a })
				.append(
					$("<input>", { type: "checkbox", checked: t, id: i }),
					$("<span>", { class: "ipe-checkbox-box" }),
					$("<span>", { html: e })
				)
				.css({ display: "block" })
			};
		},
		697: (e) => {
			var t = mw.config.get();
			e.exports = {
			_hasRight: function (e) {
				return (
				!0 !== t.wgUserIsBlocked &&
				mw.config.get("wgUserRights").indexOf(e) > -1
				);
			}
			};
		},
		658: (e) => {
			const t = mw.config.get("wgUserLanguage"),
			i = {
				ab: "ru",
				ace: "id",
				aln: "sq",
				als: "gsw",
				an: "es",
				anp: "hi",
				arn: "es",
				arz: "ar",
				av: "ru",
				ay: "es",
				ba: "ru",
				bar: "de",
				"bat-smg": "sgs",
				bcc: "fa",
				"be-x-old": "be-tarask",
				bh: "bho",
				bjn: "id",
				bm: "fr",
				bpy: "bn",
				bqi: "fa",
				bug: "id",
				"cbk-zam": "es",
				ce: "ru",
				ckb: "ckb-arab",
				crh: "crh-latn",
				"crh-cyrl": "ru",
				csb: "pl",
				cv: "ru",
				"de-at": "de",
				"de-ch": "de",
				"de-formal": "de",
				dsb: "de",
				dtp: "ms",
				eml: "it",
				ff: "fr",
				"fiu-vro": "vro",
				frc: "fr",
				frp: "fr",
				frr: "de",
				fur: "it",
				gag: "tr",
				gan: "gan-hant",
				"gan-hans": "zh-hans",
				"gan-hant": "zh-hant",
				gl: "pt",
				glk: "fa",
				gn: "es",
				gsw: "de",
				hif: "hif-latn",
				hsb: "de",
				ht: "fr",
				ii: "zh-cn",
				inh: "ru",
				iu: "ike-cans",
				jut: "da",
				jv: "id",
				kaa: "kk-latn",
				kbd: "kbd-cyrl",
				"kbd-cyrl": "ru",
				khw: "ur",
				kiu: "tr",
				kk: "kk-cyrl",
				"kk-arab": "kk-cyrl",
				"kk-cn": "kk-arab",
				"kk-kz": "kk-cyrl",
				"kk-latn": "kk-cyrl",
				"kk-tr": "kk-latn",
				kl: "da",
				koi: "ru",
				"ko-kp": "ko",
				krc: "ru",
				ks: "ks-arab",
				ksh: "de",
				ku: "ku-latn",
				"ku-arab": "ckb",
				kv: "ru",
				lad: "es",
				lb: "de",
				lbe: "ru",
				lez: "ru",
				li: "nl",
				lij: "it",
				liv: "et",
				lmo: "it",
				ln: "fr",
				ltg: "lv",
				lzz: "tr",
				mai: "hi",
				"map-bms": "jv",
				mg: "fr",
				mhr: "ru",
				min: "id",
				mo: "ro",
				mrj: "ru",
				mwl: "pt",
				myv: "ru",
				mzn: "fa",
				nah: "es",
				nap: "it",
				nds: "de",
				"nds-nl": "nl",
				"nl-informal": "nl",
				no: "nb",
				os: "ru",
				pcd: "fr",
				pdc: "de",
				pdt: "de",
				pfl: "de",
				pms: "it",
				"pt-br": "pt",
				qu: "es",
				qug: "qu",
				rgn: "it",
				rmy: "ro",
				rue: "uk",
				ruq: "ruq-latn",
				"ruq-cyrl": "mk",
				"ruq-latn": "ro",
				sa: "hi",
				sah: "ru",
				scn: "it",
				sg: "fr",
				sgs: "lt",
				shi: "ar",
				simple: "en",
				sli: "de",
				sr: "sr-ec",
				srn: "nl",
				stq: "de",
				su: "id",
				szl: "pl",
				tcy: "kn",
				tg: "tg-cyrl",
				tt: "tt-cyrl",
				"tt-cyrl": "ru",
				ty: "fr",
				udm: "ru",
				ug: "ug-arab",
				uk: "ru",
				vec: "it",
				vep: "et",
				vls: "nl",
				vmf: "de",
				vot: "fi",
				vro: "et",
				wa: "fr",
				wo: "fr",
				wuu: "zh-hans",
				xal: "ru",
				xmf: "ka",
				yi: "he",
				za: "zh-hans",
				zea: "nl",
				zh: "zh-hans",
				"zh-classical": "lzh",
				"zh-cn": "zh-hans",
				"zh-hant": "zh-hans",
				"zh-hk": "zh-hant",
				"zh-min-nan": "nan",
				"zh-mo": "zh-hk",
				"zh-my": "zh-sg",
				"zh-sg": "zh-hans",
				"zh-tw": "zh-hant",
				"zh-yue": "yue"
			};
			function a(e, t, i, a) {
			return (
				(t = t || e),
				(e = i ? e : mw.util.getUrl(e)),
				(t = mw.html.escape(t)),
				'<a href="' +
				(e = mw.html.escape(e)) +
				'" title="' +
				t +
				'"' +
				(a = a ? 'target="_blank"' : "") +
				">" +
				t +
				"</a>"
			);
			}
			function n(e, ...t) {
			return (
				(i = e =
				(function (e, ...t) {
					return (
					t.forEach(function (t, i) {
						var a = new RegExp("\\$" + (i + 1), "g");
						e = e.replace(a, t);
					}),
					e
					);
				})(e, ...t)).indexOf("<") > -1 &&
				((n = i),
				(o = document.implementation.createHTMLDocument("")),
				(s = $.parseHTML(n, o, !1)),
				(r = $("<div>", o).append(s)),
				(l = ["title", "style", "class"]),
				(c = [
					"b",
					"br",
					"code",
					"del",
					"em",
					"i",
					"s",
					"strong",
					"span",
					"u"
				]),
				r.find("*").each(function () {
					var e,
					t,
					i = $(this),
					a = i.prop("tagName").toLowerCase();
					if (-1 === c.indexOf(a))
					return (
						mw.log("[I18n-js] Disallowed tag in message: " + a),
						void i.remove()
					);
					(e = i.prop("attributes")),
					Array.prototype.slice.call(e).forEach(function (e) {
						if (-1 === l.indexOf(e.name))
						return (
							mw.log(
							"[I18n-js] Disallowed attribute in message: " +
								e.name +
								", tag: " +
								a
							),
							void i.removeAttr(e.name)
						);
						"style" === e.name &&
						((t = i.attr("style")).indexOf("url(") > -1
							? (mw.log(
								"[I18n-js] Disallowed url() in style attribute"
							),
							i.removeAttr("style"))
							: t.indexOf("var(") > -1 &&
							(mw.log(
								"[I18n-js] Disallowed var() in style attribute"
							),
							i.removeAttr("style")));
					});
				}),
				(i = r.prop("innerHTML"))),
				i
				.replace(/\[((?:https?:)?\/\/.+?) (.+?)\]/g, function (e, t, i) {
					return a(t, i, !0, !0);
				})
				.replace(/\[\[([^|]*?)\]\]/g, function (e, t) {
					return a(t);
				})
				.replace(/\[\[(.+?)\|(.+?)\]\]/g, function (e, t, i) {
					return a(t, i);
				})
				.replace(/\{\{PLURAL:(\d+)\|(.+?)\}\}/gi, function (e, t, i) {
					return mw.language.convertPlural(Number(t), i.split("|"));
				})
				.replace(/\{\{GENDER:([^|]+)\|(.+?)\}\}/gi, function (e, t, i) {
					return mw.language.gender(t, i.split("|"));
				})
			);
			var i, n, o, s, r, l, c;
			}
			function o(e, t, ...a) {
			const s =
				localStorage.getItem("i18n-cache-InPageEdit-content") || "{}";
			if ("qqx" === e) {
				var r = "";
				return (
				a.length > 0 && (r = ": " + a.join(", ")),
				`(${"InPageEdit".toLowerCase()}-${t}${r})`
				);
			}
			var l = (function (e) {
				try {
					return JSON.parse(e);
				} catch (e) {
					return {};
				}
				})(s),
				c = (window.InPageEdit || {}).i18n || {};
			return c[e] && c[e][t]
				? n(c[e][t], ...a)
				: c[t]
				? n(c[t], ...a)
				: l[e] && l[e][t]
				? n(l[e][t], ...a)
				: "en" === e
				? `(InPageEdit-${t})`
				: o((e = i[e] || "en"), t, ...a);
			}
			e.exports = {
			_msg: function (e, ...i) {
				return o(t, e, ...i);
			}
			};
		},
		976: (e, t, i) => {
			const { _msg: a } = i(658),
			{ _hasRight: n } = i(697),
			{ quickDelete: o } = i(174),
			{ quickEdit: s } = i(588);
			e.exports = {
			_resolveExists: function (e, t = {}) {
				var i = n("delete");
				"string" == typeof t && (t = { delete: t, edit: t }),
				ssi_modal.show({
					className: "in-page-edit resovle-exists",
					sizeClass: "dialog",
					center: !0,
					outSideClose: !1,
					title: a("target-exists-title"),
					content: a(
					i ? "target-exists-can-delete" : "target-exists-no-delete",
					e
					),
					buttons: [
					{
						className: "btn btn-danger btn-exists-delete-target",
						label: a("quick-delete"),
						method(i, a) {
						a.close(), o(e, t.delete || null);
						}
					},
					{
						className: "btn btn-primary",
						label: a("quick-edit"),
						method() {
						s({
							page: e,
							summary: t.edit ? "[InPageEdit] " + t : null,
							reload: !1
						});
						}
					},
					{
						className: "btn btn-secondary" + (i ? " btn-single" : ""),
						label: a("cancel"),
						method: (e, t) => {
						t.close();
						}
					}
					],
					onShow: () => {
					i || $(".btn-exists-delete-target").hide();
					}
				});
			}
			};
		},
		175: (e, t, i) => {
			const { _msg: a } = i(658),
			{ aboutUrl: n } = i(550);
			e.exports = {
			about: function () {
				ssi_modal.show({
				title: a("preference-about-label"),
				className: "in-page-edit in-page-edit-about",
				content: $("<section>").append(
					$("<iframe>", {
					style:
						"margin: 0;padding: 0;width: 100%;height: 80vh;border: 0;",
					src: n
					})
				)
				});
			}
			};
		},
		550: (e) => {
			e.exports = {
			aboutUrl: "https://www.ipe.wiki/",
			analyticsApi: "https://analytics.ipe.wiki/api",
			analyticsDash: "https://analytics.ipe.wiki",
			githubLink: "https://github.com/inpageedit/inpageedit-v2",
			pluginCDN: "https://ipe-plugins.js.org",
			pluginGithub: "https://github.com/inpageedit/Plugins",
			specialNotice: "https://ipe-plugins.js.org/specialNotice.json",
			updatelogsUrl: "https://www.ipe.wiki/update/"
			};
		},
		901: (e, t, i) => {
			var a = mw.config.get();
			const { _msg: n } = i(658),
			{ preference: o } = i(525),
			{ quickEdit: s } = i(588),
			{ getParamValue: r } = mw.util;
			e.exports = {
			articleLink: function (e) {
				e ||
				(e =
					!0 === o.get("redLinkQuickEdit")
					? $("#mw-content-text a")
					: $("#mw-content-text a:not(.new)")),
				$(e).each(function (e, t) {
					const i = $(t);
					if (void 0 === i.attr("href") || i.attr("href").startsWith("#"))
					return;
					let o = i.get(0).href,
					l = r("action", o) || r("veaction", o),
					c = r("title", o),
					d = r("section", o)
						? r("section", o).replace(/T-/, "")
						: null,
					p = r("oldid", o),
					f = `${location.protocol}//${a.wgServer.split("//").pop()}`;
					if (o.startsWith(f) && !r("undo", o) && !r("preload", o)) {
					if (null === c && ["edit", "editsource"].includes(l)) {
						let e = a.wgArticlePath.replace("$1", "");
						(c = o.slice(f.length).split("?")[0]),
						(c = c.split(e).slice(1).join(e));
					}
					(c = decodeURIComponent(c)),
						["edit", "editsource"].includes(l) &&
						void 0 !== c &&
						i.addClass("ipe-articleLink-resolved").after(
							$("<span>", {
							class: "in-page-edit-article-link-group"
							}).append(
							$("<a>", {
								href: "javascript:void(0)",
								class: "in-page-edit-article-link",
								text: n("quick-edit")
							}).on("click", function () {
								var e = {};
								(e.page = c),
								null !== p
									? (e.revision = p)
									: null !== d && (e.section = d),
								a.wgIsArticle || (e.reload = !1),
								s(e);
							})
							)
						);
					}
				});
			}
			};
		},
		15: (e, t, i) => {
			const { _analytics: a } = i(955),
			{ $progress: n, $link: o } = i(494),
			{ _msg: s } = i(658),
			{ mwApi: r, config: l } = i(663),
			c = (e) =>
				new RegExp(`^(File|${l.wgFormattedNamespaces[6]}):`).test(e);
			e.exports = {
			linksHere: async function e(t = l.wgPageName) {
				a("linkshere"), (t && "string" == typeof t) || (t = l.wgPageName);
				var d = $(n),
				p = $("<div>").append(d),
				f = ssi_modal
					.createObject({
					className: "in-page-edit ipe-links-here",
					center: !0,
					sizeClass: "dialog",
					onShow(e) {
						mw.hook("InPageEdit.linksHere").fire({
						modal: e,
						$modal: $("#" + e.modalId)
						});
					}
					})
					.init();
				f.setTitle(s("links-here-title", t, 2)), f.setContent(p), f.show();
				try {
				console.info("[InPageEdit] linksHere", "开始获取页面信息");
				const a = await ((e) => {
					var t = {
						format: "json",
						action: "query",
						prop: c(e) ? "fileusage" : "linkshere",
						titles: e
					};
					return (
						c(e) ? (t.fulimit = "max") : (t.lhlimit = "max"), r.get(t)
					);
					})(t),
					{ pages: n } = a.query;
				console.info("[InPageEdit] linksHere", "成功获取页面信息");
				var m,
					g = Object.keys(n)[0];
				if (
					((m = c(t) ? n[g].fileusage || [] : n[g].linkshere || []),
					d.hide(),
					m.length > 0)
				) {
					var u = ((t) => {
					var a = $("<ol>", { class: "ipe-links-here-list" });
					return (
						$.each(t, (t, { title: n, redirect: r }) => {
						a.append(
							$("<li>").append(
							o({ page: n }).attr("target", "_blank"),
							void 0 !== r
								? " (<i>" + s("links-here-isRedirect") + "</i>)"
								: "",
							" (",
							o({ text: "← " + s("links-here") }).on(
								"click",
								function () {
								e(n);
								}
							),
							" | ",
							o({ text: s("quick-edit") }).on("click", function () {
								i(588).quickEdit({ page: n, reload: !1 });
							}),
							")"
							)
						);
						}),
						a
					);
					})(m);
					p.append(u);
				} else
					p.append(
					$("<div>", {
						class: "ipe-links-here-no-page",
						html: s("links-here-no-page", t)
					})
					);
				return (
					m.length < 2 && f.setTitle(s("links-here-title", t, 1)),
					"-1" === g &&
					p.append(
						$("<div>", {
						html: s("links-here-not-exist", t),
						class: "ipe-links-here-not-exist"
						})
					),
					mw.hook("InPageEdit.linksHere.pageList").fire(m),
					m
				);
				} catch (e) {
				return (
					d.hide(),
					p.append($("<p>", { class: "error", html: e })),
					console.error(
					"[InPageEdit] linksHere",
					"获取页面信息时出现问题",
					e
					),
					e
				);
				}
			}
			};
		},
		501: (e, t, i) => {
			const a = mw.config.get(),
			{ _msg: n } = i(658),
			{ _analytics: o } = i(955),
			{ getParamValue: s } = mw.util,
			{ quickDiff: r } = i(812),
			{ quickEdit: l } = i(588);
			e.exports = {
			loadQuickDiff: function (e) {
				!(function (e) {
				$(e || "#mw-content-text")
					.find("a[href]:not(.ipe-diff-mounted)")
					.toArray()
					.forEach((e) => {
					const t = $(e),
						i = t.attr("href");
					let n = s("diff", i),
						l = s("curid", i),
						c = s("oldid", i),
						d = s("timestamp", i);
					const p = ["prev", "next", "cur"],
						f = (
						mw.config
							.get("wgSpecialPageAliases", [])
							.find(({ realname: e }) => "Diff" === e)
							?.aliases.map((e) => [e, encodeURI(e)])
							.flat() || ["Diff"]
						).join("|"),
						m = a.wgArticlePath.replace("$1", ""),
						g = `Special|${a.wgFormattedNamespaces[-1]}`,
						u = new RegExp(
						`^${m}(?:${g}):(?:${f})/(\\d+|${p.join(
							"|"
						)})(?:/(\\d+|${p.join("|")}))?$`
						),
						h = i.match(u);
					if (
						(h && ((n = h[2] || h[1]), (c = h[2] ? h[1] : "prev")),
						null === n || null !== d)
					)
						return;
					c || l || (c = "prev"),
						p.includes(c) && ([n, c] = [c, n]),
						t.addClass("ipe-diff-mounted");
					const w = {},
						b = (e) =>
						p.includes(e) || null === e
							? "relative"
							: "0" === e
							? "id"
							: "rev";
					(w[`from${b(c)}`] = c),
						(w[`to${b(n)}`] = "0" !== n ? n : l),
						t.attr("ipe-diff-params", JSON.stringify(w)),
						t.on("click", function (e) {
						return (
							e.preventDefault(), o("quick_diff_recentchanges"), r(w)
						);
						});
					});
				})(e),
				"history" === a.wgAction &&
					($(
					".historysubmit.mw-history-compareselectedversions-button"
					).after(
					$("<button>")
						.text(n("quick-diff"))
						.on("click", function (e) {
						if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey)
							return;
						e.preventDefault(), o("quick_diff_history_page");
						const t = $(".selected.before").attr("data-mw-revid"),
							i = $(".selected.after").attr("data-mw-revid");
						r({ fromrev: i, torev: t });
						})
					),
					$("[data-mw-revid]").each(function () {
					var e = $(this),
						t = e.attr("data-mw-revid");
					e.find(".mw-history-undo").after(
						$("<span>").append(
						" | ",
						$("<a>", {
							href: "javascript:;",
							class: "in-page-edit-article-link",
							text: n("quick-edit")
						}).on("click", function () {
							l({ page: a.wgPageName, revision: t });
						})
						)
					);
					}));
			}
			};
		},
		937: (e, t, i) => {
			const { pluginCDN: a } = i(550);
			var n = {
			get: () =>
				$.ajax({
				url: a + "/index.json",
				dataType: "json",
				crossDomain: !0,
				cache: !1
				}),
			saveCache(e) {
				var t = window.InPageEdit || {};
				(t.cache = t.cache || {}),
				(t.cache.pluginList = e),
				(window.InPageEdit = t);
			},
			loadCache() {
				var e = window.InPageEdit || {};
				return (e.cache = e.cache || {}), e.cache.pluginList;
			},
			load(e) {
				if (/^https?:\/\//.test(e))
				mw.loader.load(e),
					console.info("[InPageEdit] 从远程加载非官方插件", e);
				else {
				const { loadScript: t } = i(410);
				t(a + "/plugins/" + e).then(
					() => console.info("[InPageEdit] 插件 " + e + " 加载成功"),
					(t) => console.warn("[InPageEdit] 插件 " + e + " 加载失败", t)
				),
					console.info("[InPageEdit] 从官方插件商店加载插件", e);
				}
			},
			initUserPlugin() {
				const { preference: e } = i(525);
				var t = e.get("plugins");
				"object" == typeof t &&
				t.length > 0 &&
				$.each(t, (e, t) => {
					n.load(t);
				});
			}
			};
			e.exports = { pluginStore: n };
		},
		525: (e, t, i) => {
			var a = window.InPageEdit || {},
			n = mw.config.get();
			const { _msg: o } = i(658),
			{ $br: s, $hr: r, $progress: l, $link: c } = i(494),
			{
				githubLink: d,
				pluginGithub: p,
				analyticsApi: f,
				analyticsDash: m,
				pluginCDN: g
			} = i(550),
			u = i(626),
			{ pluginStore: h } = i(937),
			w = {
				_defaults: {
				doNotCollectMyInfo: !1,
				editMinor: !1,
				editSummary: o("preference-summary-default"),
				lockToolBox: !1,
				redLinkQuickEdit: !0,
				outSideClose: !0,
				watchList: "preferences",
				noConfirmEdit: !1,
				plugins: ["toolbox.js", "wiki-editor.js"]
				},
				get(e) {
				var t = localStorage.getItem("InPageEditPreference") || "{}";
				try {
					t = JSON.parse(t);
				} catch (e) {
					t = {};
				}
				"object" == typeof a.myPreference &&
					Object.assign(t, a.myPreference);
				var i = $.extend({}, w._defaults, t);
				return (
					["watch", "unwatch", "preferences", "nochange"].includes(
					i.watchList
					) || (i.watchList = "preferences"),
					"string" == typeof e && "" !== e ? (i[e] ? i[e] : null) : i
				);
				},
				set(e = {}, t) {
				var i = {};
				if ("string" == typeof e && void 0 !== t) i[e] = t;
				else {
					if ("object" != typeof e) return;
					i = e;
				}
				(i = $.extend({}, w.get(), i)),
					(i = JSON.stringify(i)),
					localStorage.setItem("InPageEditPreference", i);
				},
				modal() {
				if (!($("#ipe-preference-form").length > 0)) {
					mw.hook("pluginPreference").fire(), w.set();
					var e = w.get();
					i(955)._analytics("plugin_setting");
					var t = $("<ul>", { class: "tab-list" }).append(
						$("<li>").append(
						$("<a>", {
							text: o("preference-tab-editor"),
							href: "#editor"
						})
						),
						$("<li>").append(
						$("<a>", {
							text: o("preference-tab-plugin"),
							href: "#plugin"
						})
						),
						$("<li>").append(
						$("<a>", {
							text: o("preference-tab-analysis"),
							href: "#analysis"
						})
						),
						$("<li>").append(
						$("<a>", {
							text: o("preference-tab-another"),
							href: "#another"
						})
						),
						$("<li>").append(
						$("<a>", {
							text: o("preference-tab-about"),
							href: "#about"
						})
						)
					),
					b = $("<div>", {
						class: "tab-content",
						style: "position: relative;"
					}).append(
						$("<section>", { id: "editor" }).append(
						$("<h3>", { text: o("preference-editor-title") }),
						$("<h4>", { text: o("preference-editHobits-label") }),
						$("<label>").append(
							$("<input>", { type: "checkbox", id: "editMinor" }),
							$("<span>", { text: o("preference-setMinor") })
						),
						$("<label>").append(
							$("<input>", { type: "checkbox", id: "outSideClose" }),
							$("<span>", { text: o("preference-outSideClose") })
						),
						$("<label>").append(
							$("<input>", { type: "checkbox", id: "noConfirmEdit" }),
							$("<span>", { text: o("preference-noConfirmEdit") })
						),
						$("<h4>", { text: o("preference-watchList-label") }),
						$("<label>").append(
							$("<input>", {
							type: "radio",
							name: "watchList",
							value: "nochange"
							}),
							$("<span>", {
							text: o("preference-watchList-nochange")
							})
						),
						$("<label>").append(
							$("<input>", {
							type: "radio",
							name: "watchList",
							value: "preferences"
							}),
							$("<span>", {
							html: o("preference-watchList-preferences")
							})
						),
						$("<label>").append(
							$("<input>", {
							type: "radio",
							name: "watchList",
							value: "unwatch"
							}),
							$("<span>", { text: o("preference-watchList-unwatch") })
						),
						$("<label>").append(
							$("<input>", {
							type: "radio",
							name: "watchList",
							value: "watch"
							}),
							$("<span>", { text: o("preference-watchList-watch") })
						),
						$("<h4>", { text: o("preference-summary-label") }),
						$("<label>", {
							for: "editSummary",
							style: "padding-left: 0; font-size: small",
							html: o("preference-editSummary")
						}),
						$("<input>", {
							id: "editSummary",
							style: "width: 96%",
							placeholder: "Edit via InPageEdit, yeah~"
						})
						),
						$("<section>", { id: "plugin" }).append(
						$("<h3>", { text: o("preference-plugin-title") }),
						$("<div>", {
							id: "plugin-container",
							html: $(l).css({
							width: "96%",
							position: "absolute",
							top: "50%",
							transform: "translateY(-50%)"
							})
						}),
						$("<div>", { class: "plugin-footer" }).html(
							o("preference-plugin-footer", p)
						)
						),
						$("<section>", { id: "analysis" }).append(
						$("<h3>", { text: o("preference-analysis-title") }),
						$("<div>", {
							id: "analysis-container",
							html: $(l).css({
							width: "96%",
							position: "absolute",
							top: "50%",
							transform: "translateY(-50%)"
							})
						})
						),
						$("<section>", { id: "another" }).append(
						$("<h3>", { text: o("preference-another-title") }),
						$("<h4>", { text: o("preference-display-label") }),
						$("<label>").append(
							$("<input>", {
							type: "checkbox",
							id: "redLinkQuickEdit"
							}),
							$("<span>", { text: o("preference-redLinkQuickEdit") })
						),
						$("<div>").append(
							$("<h4>", { text: "Custom skin (Not available yet)" }),
							$("<label>", { class: "choose-skin" }).append(
							$("<input>", {
								type: "checkbox",
								id: "customSkinEnable",
								disabled: !0
							}),
							$("<span>"),
							$("<input>", {
								id: "customSkinUrl",
								disabled: !0,
								style: "width: calc(96% - 30px)",
								value: `${g}/skins/ipe-default.css`
							})
							)
						),
						$("<h4>", {
							text: o("preference-savelocal-popup-title")
						}),
						$("<button>", {
							class: "btn btn-secondary",
							id: "ipeSaveLocalShow",
							text: o("preference-savelocal-btn")
						}).on("click", k)
						),
						$("<section>", { id: "about" }).append(
						$("<h3>", { text: o("preference-about-label") }),
						$("<div>", {
							style: "font-size: 12px; font-style: italic;"
						}).html(function () {
							return u.includes("-")
							? `v${u} (Canary)<br>${o("version-notice-canary")}`
							: `v${u}`;
						}),
						$("<h4>", { text: "Portal" }),
						$("<button>", {
							class: "btn btn-secondary btn-single",
							onclick: "InPageEdit.about()",
							text: o("preference-aboutAndHelp")
						}),
						$("<button>", {
							class: "btn btn-secondary btn-single",
							style: "margin-top: .5em;",
							onclick: "InPageEdit.versionInfo()",
							text: o("preference-updatelog")
						}),
						$("<h4>", { text: "Join us" }),
						$("<p>").append(
							$("<strong>", { text: "GitHub" }),
							": ",
							$("<a>", { href: d, text: d, target: "_blank" })
						),
						$("<p>").append(
							$("<strong>", { text: "QQ Group" }),
							": ",
							"1026023666"
						),
						r,
						$("<p>", {
							text: "InPageEdit is a useful MediaWiki JavaScript Plugin written with jQuery"
						}),
						$("<p>").append(
							"© InPageEdit Copyright (C)",
							" 2019 - " + new Date().getFullYear(),
							" Wjghj Project (机智的小鱼君), ",
							$("<a>", {
							href: "https://www.gnu.org/licenses/gpl-3.0-standalone.html",
							text: "GNU General Public License 3.0"
							})
						)
						)
					),
					v = $("<div>", { class: "preference-tabber" }).append(t, b);
					t.find("a").on("click", function (e) {
					e.preventDefault();
					var i = $(this),
						a = i.attr("href");
					a &&
						(t.find("a").removeClass("active"),
						b.find("section").removeClass("active"),
						i.addClass("active"),
						b.find("" + a).addClass("active"));
					}),
					b.find("input").on("change", function () {
						var e,
						t = $(this),
						i = t.attr("id") || t.prop("name");
						(e =
						"checkbox" === t.prop("type")
							? t.prop("checked")
							: t.val()),
						v.data(i, e),
						console.log("[InPageEdit] Preset preference", v.data());
					}),
					t.find("a:first").addClass("active"),
					b.find("section:first").addClass("active"),
					ssi_modal.show({
						sizeClass: "dialog",
						className: "in-page-edit ipe-preference",
						outSideClose: !1,
						title: o("preference-title") + " - " + u,
						content: v,
						buttons: [
						{
							label: o("preference-reset"),
							className: "btn btn-danger",
							method: function (e, t) {
							ssi_modal.confirm(
								{
								title: o("preference-reset-confirm-title"),
								content: o("preference-reset-confirm"),
								className: "in-page-edit",
								center: !0,
								okBtn: {
									label: o("ok"),
									className: "btn btn-danger"
								},
								cancelBtn: {
									label: o("cancel"),
									className: "btn"
								}
								},
								(e) => {
								if (!e) return !1;
								void 0 !== a.myPreference
									? y(w._defaults)
									: (w.set(w._defaults), t.close());
								}
							);
							}
						},
						{
							label: o("preference-save"),
							className: "btn btn-primary",
							method: function (e, t) {
							void 0 !== a.myPreference
								? k()
								: (w.set(v.data()), t.close());
							}
						}
						],
						onShow(s) {
						var r = $("#" + s.modalId);
						mw
							.hook("InPageEdit.preference.modal")
							.fire({ $modal: s, $modalWindow: r }),
							void 0 !== a.myPreference &&
							t.before(
								$("<div>", {
								class: "has-local-warn",
								style:
									"padding-left: 8px; border-left: 6px solid orange; font-size: small;",
								html: o("preference-savelocal-popup-haslocal")
								})
							),
							y(e);
						var l = w.get("plugins"),
							d = h.loadCache();
						function p(e) {
							b.find("#plugin-container").html($("<ul>")),
							$.each(e, (e, t) => {
								var i = t.name || "Unknown",
								a = t.description || "",
								n = t.author
									? $("<a>", {
										href: "https://github.com/" + t.author,
										target: "_balnk",
										text: "@" + t.author
									})
									: "-";
								b.find("#plugin-container > ul").append(
								$("<li>").append(
									$("<label>").append(
									$("<input>", {
										class: "plugin-checkbox",
										id: e,
										type: "checkbox",
										checked: Boolean(
										l.indexOf(e) >= 0 || !0 === t._force
										),
										disabled: !0 === t._force
									}).on("change", function () {
										var t = $(this).prop("checked"),
										i = v.data("plugins"),
										a = i.indexOf(e);
										t && a < 0 && i.push(e),
										!t && a >= 0 && i.splice(a, 1);
									}),
									$("<span>"),
									$("<div>", { class: "plugin-name", text: i }),
									$("<div>", {
										class: "plugin-author",
										html: n
									}),
									$("<div>", {
										class: "plugin-description",
										text: a
									})
									)
								)
								);
							});
						}
						d
							? p(d)
							: h.get().then((e) => {
								h.saveCache(e), p(e);
							});
						const g = n.wgUserName;
						$.get(`${f}/query/user`, {
							userName: g,
							siteUrl: i(955).getSiteID(),
							prop: "*"
						}).then((e) => {
							b.find("#analysis-container").html("");
							const t = e.body.query[0],
							i = t._total,
							a = `${m}/user?${$.param({
								userName: g,
								siteUrl: t.siteUrl
							})}`;
							let n = t.features;
							n = n.sort((e, t) => t.count - e.count);
							const s = $("<table>", {
							class: "wikitable",
							style: "width: 96%"
							}).append(
							$("<tr>").append(
								$("<th>", { text: "ID" }),
								$("<th>", { text: "Count" }),
								$("<th>", { text: "%" })
							)
							);
							n.forEach(({ count: e, featureID: t }) => {
							s.append(
								$("<tr>").append(
								$("<th>", { text: t }),
								$("<td>", { text: e }),
								$("<td>", {
									text: ((e / i) * 100).toFixed(2) + "%"
								})
								)
							);
							}),
							b
								.find("#analysis-container")
								.append(
								$("<h4>", {
									text: `${t.userName}@${t.siteName}`
								}),
								$("<p>").append(
									c({ href: a, text: "Analytics Dashboard →" })
								),
								$("<p>").append(
									o("preference-analysis-totaluse", i)
								),
								s
								);
						});
						}
					});
				}
				function k() {
					const e = $("<section>").append(
					o("preference-savelocal-popup"),
					s,
					$("<textarea>", {
						style:
						"font-size: 12px; resize: none; width: 100%; height: 10em;",
						readonly: !0
					})
						.on("click", function () {
						this.select();
						})
						.val(
						`/** InPageEdit Preferences */\n;(window.InPageEdit = window.InPageEdit || {}).myPreference = ${JSON.stringify(
							v.data(),
							null,
							2
						)}`
						)
					);
					ssi_modal.dialog({
					className: "in-page-edit",
					center: !0,
					title: o("preference-savelocal-popup-title"),
					content: e,
					okBtn: {
						className: "btn btn-primary btn-single",
						label: o("ok")
					}
					});
				}
				function y(e) {
					$.each(e, (e, t) => {
					if ("plugins" === e)
						return (
						v.data(e, t.concat([])),
						void b.find(".plugin-checkbox").each(function () {
							this.checked = t.includes(this.id);
						})
						);
					v.data(e, t);
					const i = b.find("#" + e);
					i.length > 0
						? "string" == typeof t
						? i.val(t)
						: "boolean" == typeof t && i.prop("checked", t)
						: b.find("input[name=" + e + "]").each(function () {
							this.checked = this.value === t;
						});
					});
				}
				}
			};
			e.exports = { preference: w };
		},
		763: (e, t, i) => {
			const { _msg: a } = i(658),
			{ $progress: n } = i(494);
			e.exports = {
			progress: function (e) {
				if (!0 === e)
				$(".in-page-edit.loadingbox .ssi-modalTitle").html(a("done")),
					$(".in-page-edit.loadingbox .ipe-progress").addClass("done");
				else if (!1 === e)
				$(".in-page-edit.loadingbox").length > 0 &&
					($(".in-page-edit.loadingbox").appendTo("body"),
					ssi_modal.close());
				else {
				if ($(".in-page-edit.loadingbox").length > 0) return;
				void 0 === e && (e = "Loading..."),
					ssi_modal.show({
					title: e,
					content: n,
					className: "in-page-edit loadingbox",
					center: !0,
					sizeClass: "dialog",
					closeIcon: !1,
					outSideClose: !1
					});
				}
			}
			};
		},
		174: (e, t, i) => {
			var a = new mw.Api(),
			n = mw.config.get();
			const { _analytics: o } = i(955),
			{ _msg: s } = i(658),
			{ _hasRight: r } = i(697),
			{ $br: l } = i(494);
			e.exports = {
			quickDelete: function (e, t = "") {
				var i;
				mw.hook("InPageEdit.quickDelete").fire(),
				console.log("Quick delete", e, t),
				(e = e || n.wgPageName),
				ssi_modal.show({
					outSideClose: !1,
					className: "in-page-edit quick-delete",
					center: !0,
					sizeClass: "dialog",
					title: s("delete-title"),
					content: $("<div>").append(
					$("<section>", { id: "InPageEditDeletepage" }).append(
						$("<span>", {
						html: s(
							"delete-reason",
							"<b>" + e.replace(/_/g, " ") + "</b>"
						)
						}),
						l,
						$("<label>", {
						for: "delete-reason",
						text: s("editSummary")
						}),
						$("<input>", {
						id: "delete-reason",
						style: "width:96%",
						onclick: "$(this).css('box-shadow', '')",
						value: t
						})
					)
					),
					beforeShow: function () {
					if (!r("delete"))
						return (
						ssi_modal.dialog({
							title: s("notify-no-right"),
							content: s("delete-no-right"),
							className: "in-page-edit quick-deletepage",
							center: !0,
							okBtn: { className: "btn btn-primary btn-single" }
						}),
						!1
						);
					},
					buttons: [
					{
						label: s("cancel"),
						className: "btn btn-primary",
						method: function (e, t) {
						t.close();
						}
					},
					{
						label: s("confirm"),
						className: "btn btn-danger",
						method: function (t, n) {
						"" !==
						(i = $("#InPageEditDeletepage #delete-reason").val())
							? (o("quick_delete"),
							ssi_modal.confirm(
								{
								center: !0,
								className: "in-page-edit",
								title: s("delete-confirm-title"),
								content: s("delete-confirm-content"),
								okBtn: {
									label: s("confirm"),
									className: "btn btn-danger"
								},
								cancelBtn: {
									label: s("cancel"),
									className: "btn"
								}
								},
								function (t) {
								if (!t) return !1;
								(i = s("delete-title") + " (" + i + ")"),
									a
									.postWithToken("csrf", {
										action: "delete",
										title: e,
										reason: i,
										format: "json"
									})
									.then(() => {
										ssi_modal.notify("success", {
										className: "in-page-edit",
										title: s("notify-success"),
										content: s("notify-delete-success", e)
										});
									})
									.fail(function (e, t, i) {
										ssi_modal.notify("error", {
										className: "in-page-edit",
										title: s("notify-error"),
										content:
											s("notify-delete-error") +
											': <br/><span style="font-size:amall">' +
											i.error["*"] +
											"(<code>" +
											i.error.code +
											"</code>)</span>"
										});
									}),
									n.close();
								}
							))
							: $("#InPageEditDeletepage #delete-reason").css(
								"box-shadow",
								"0 0 4px #f00"
							);
						}
					}
					]
				});
			}
			};
		},
		812: (e, t, i) => {
			var a = new mw.Api();
			const { _analytics: n } = i(955),
			{ _msg: o } = i(658),
			{ $br: s, $progress: r } = i(494);
			var l = function (e) {
			var t, c, d;
			mw.hook("InPageEdit.quickDiff").fire(),
				n("quick_diff"),
				mw.loader.load([
				"mediawiki.legacy.shared",
				"mediawiki.diff.styles"
				]);
			var p = $(".quick-diff");
			p.length > 0
				? (console.info("[InPageEdit] Quick diff 正在加载新内容"),
				(t = p.find(".pageName")),
				(c = p.find(".diffArea")),
				(d = p.find(".ipe-progress")),
				t.text(o("diff-loading")),
				c.hide(),
				p.appendTo(document.body))
				: ((t = $("<span>", {
					class: "pageName",
					text: o("diff-loading")
				})),
				(c = $("<div>", { class: "diffArea", style: "display: none" })),
				(d = $(r)),
				ssi_modal.show({
					className: "in-page-edit quick-diff",
					sizeClass: "large",
					fixedHeight: !0,
					fitScreen: !0,
					title: t,
					content: $("<div>").append(d, c),
					buttons: [
					{
						label: o("diff-button-todiffpage"),
						className: "btn btn-secondary toDiffPage"
					}
					]
				}),
				(p = $(".quick-diff"))),
				d
				.show()
				.css("margin-top", p.find(".ssi-modalContent").height() / 2),
				p.find(".toDiffPage").off("click"),
				(e.action = "compare"),
				(e.prop = "diff|rel|ids|title|user|parsedcomment|size"),
				(e.format = "json"),
				e.totext ? (e.topst = !0) : e.fromtext && (e.frompst = !0),
				a
				.post(e)
				.done(function (a) {
					var r,
					f = a.compare["*"];
					function m(e) {
					return (
						'<a class="diff-user" href="' +
						mw.util.getUrl("User:" + e) +
						'">' +
						e +
						'</a> (<a href="' +
						mw.util.getUrl("User_talk:" + e) +
						'">' +
						o("diff-usertalk") +
						'</a> | <a href="' +
						mw.util.getUrl("Special:Contributions/" + e) +
						'">' +
						o("diff-usercontrib") +
						'</a> | <a href="' +
						mw.util.getUrl("Special:Block/" + e) +
						'">' +
						o("diff-userblock") +
						"</a>)"
					);
					}
					d.hide(),
					(r = void 0 === e.pageName ? a.compare.totitle : e.pageName),
					t.html(o("diff-title") + ": <u>" + r + "</u>"),
					c
						.show()
						.empty()
						.append(
						$("<table>", { class: "diff difftable" }).append(
							$("<colgroup>").append(
							$("<col>", { class: "diff-marker" }),
							$("<col>", { class: "diff-content" }),
							$("<col>", { class: "diff-marker" }),
							$("<col>", { class: "diff-content" })
							),
							$("<tbody>").append(
							$("<tr>").append(
								$("<td>", {
								colspan: 2,
								class: "diff-otitle"
								}).append(
								$("<a>", {
									href: mw.util.getUrl("", {
									oldid: a.compare.fromrevid
									}),
									text: a.compare.fromtitle
								}),
								" (",
								$("<span>", {
									class: "diff-version",
									text: o("diff-version") + a.compare.fromrevid
								}),
								") (",
								$("<a>", {
									class: "editLink",
									href: mw.util.getUrl(a.compare.fromtitle, {
									action: "edit",
									oldid: a.compare.fromrevid
									}),
									text: o("diff-edit")
								}),
								")",
								s,
								m(a.compare.fromuser),
								s,
								" (",
								$("<span>", {
									class: "diff-comment",
									html: a.compare.fromparsedcomment
								}),
								") ",
								s,
								$("<a>", {
									class:
									"prevVersion ipe-analysis-quick_diff_modalclick",
									href: "javascript:void(0);",
									text: "←" + o("diff-prev")
								})
									.toggle(!!a.compare.prev)
									.on("click", () => {
									l({
										fromrev: a.compare.prev,
										torev: a.compare.fromrevid
									});
									})
								),
								$("<td>", {
								colspan: 2,
								class: "diff-ntitle"
								}).append(
								$("<a>", {
									href: mw.util.getUrl("", {
									oldid: a.compare.torevid
									}),
									text: a.compare.totitle
								}),
								" (",
								$("<span>", {
									class: "diff-version",
									text: o("diff-version") + a.compare.torevid
								}),
								") (",
								$("<a>", {
									class: "editLink",
									href: mw.util.getUrl(a.compare.totitle, {
									action: "edit",
									oldid: a.compare.torevid
									}),
									text: o("diff-edit")
								}),
								")",
								s,
								m(a.compare.touser),
								s,
								" (",
								$("<span>", {
									class: "diff-comment",
									html: a.compare.toparsedcomment
								}),
								") ",
								s,
								$("<a>", {
									class:
									"nextVersion ipe-analysis-quick_diff_modalclick",
									href: "javascript:void(0);",
									text: o("diff-nextv") + "→"
								})
									.toggle(!!a.compare.next)
									.on("click", () => {
									n("quick_diff_modalclick"),
										l({
										fromrev: a.compare.torevid,
										torev: a.compare.next
										});
									})
								)
							),
							f,
							$("<tr>", {
								class: "diffSize",
								style: "text-align: center"
							}).append(
								$("<td>", {
								colspan: "2",
								text: a.compare.fromsize + o("diff-bytes")
								}),
								$("<td>", {
								colspan: "2",
								text: a.compare.tosize + o("diff-bytes")
								})
							)
							)
						)
						),
					p.find("button.toDiffPage").on("click", function () {
						location.href = mw.util.getUrl("", {
						oldid: a.compare.fromrevid,
						diff: a.compare.torevid
						});
					}),
					i(901).articleLink(p.find(".editLink")),
					!0 === e.isPreview &&
						(p.find("button.toDiffPage").hide(),
						c
						.find(".diff-otitle")
						.html("<b>" + o("diff-title-original-content") + "</b>"),
						c
						.find(".diff-ntitle")
						.html("<b>" + o("diff-title-your-content") + "</b>")),
					(void 0 !== a.compare.fromsize &&
						void 0 !== a.compare.tosize) ||
						c.find(".diffSize").hide(),
					a.compare?.fromrevid ||
						e.isPreview ||
						c
						.find(".diff-otitle")
						.empty()
						.append(
							$("<span>", {
							class: "noPrevVerson",
							text:
								a?.warnings?.compare?.["*"] ||
								"Previous version not exist"
							})
						),
					a.compare?.torevid ||
						e.isPreview ||
						c
						.find(".diff-otitle")
						.empty()
						.append(
							$("<span>", {
							class: "noNextVerson",
							text:
								a?.warnings?.compare?.["*"] ||
								"Next version not exist"
							})
						),
					void 0 !== a.compare.fromtexthidden &&
						c
						.find(".diff-otitle .diff-version")
						.addClass("diff-hidden-history"),
					void 0 !== a.compare.totexthidden &&
						c
						.find(".diff-ntitle .diff-version")
						.addClass("diff-hidden-history"),
					void 0 !== a.compare.fromuserhidden &&
						c
						.find(".diff-otitle .diff-user")
						.addClass("diff-hidden-history"),
					void 0 !== a.compare.touserhidden &&
						c
						.find(".diff-ntitle .diff-user")
						.addClass("diff-hidden-history"),
					void 0 !== a.compare.fromcommenthidden &&
						c.find(".diff-comment").addClass("diff-hidden-history"),
					void 0 !== a.compare.tocommenthidden &&
						c
						.find(".diff-ntitle .diff-comment")
						.addClass("diff-hidden-history");
				})
				.fail(function (e, t) {
					console.warn("[InPageEdit] 快速差异获取失败"),
					d.hide(),
					t.error && t.error.info && t.error.code
						? c
							.show()
							.html(
							o("diff-error") +
								": " +
								t.error.info +
								"(<code>" +
								t.error.code +
								"</code>)"
							)
						: c.show().html(o("diff-error"));
				});
			};
			e.exports = { quickDiff: l };
		},
		588: (e, t, i) => {
			const { mwApi: a, config: n } = i(663),
			{ _analytics: o } = i(955),
			{ _msg: s } = i(658),
			{ _hasRight: r } = i(697),
			{ $br: l, $progress: c } = i(494),
			{ preference: d } = i(525),
			{ progress: p } = i(763),
			{ quickPreview: f } = i(597),
			{ quickDiff: m } = i(812),
			{ linksHere: g } = i(15);
			var u = function (e) {
			"string" == typeof (e = e || {}) && (e = { page: e || n.wgPageName });
			var t = {
				page: n.wgPageName,
				pageId: -1,
				revision: null,
				summaryRevision: "",
				section: null,
				editText: "",
				editMinor: !1,
				editSummary: s("preference-summary-default"),
				editNotice: "",
				outSideClose: !0,
				jsonGet: {
					action: "parse",
					page: e.page || n.wgPageName,
					prop: "wikitext|langlinks|categories|templates|images|sections",
					format: "json"
				},
				jsonPost: {},
				pageDetail: {},
				jumpTo: "",
				reload: !0,
				watchList: "preferences"
				},
				i = d.get(),
				h = new Date(),
				w = h.getTime(),
				b = h.toISOString();
			(e = $.extend({}, t, e, i)),
				o("quick_edit"),
				e.revision &&
				e.revision !== n.wgCurRevisionId &&
				(ssi_modal.notify("warning", {
					className: "in-page-edit",
					content: s("notify-editing-history"),
					title: s("notify-info")
				}),
				delete e.jsonGet.page,
				(e.jsonGet.oldid = e.revision),
				(e.summaryRevision = `(${s(
					"editor-summary-rivision"
				)} [[Special:Diff/${e.revision}]])`)),
				e.section && "new" !== e.section && (e.jsonGet.section = e.section),
				"new" === e.section && delete e.revision;
			var v = $("<span>").append(
				s("editor-title-editing") +
					': <u class="editPage">' +
					e.page.replace(/_/g, " ") +
					"</u>"
				),
				k = $("<textarea>", { class: "editArea", style: "margin-top: 0;" }),
				y = $("<div>", {
				class: "editOptionsLabel hideBeforeLoaded"
				}).append(
				$("<section>", { class: "detailArea" }).append(
					$("<label>", {
					class: "detailToggle",
					text: s("editor-detail-button-toggle")
					}),
					$("<div>", { class: "detailBtnGroup" }).append(
					$("<a>", {
						href: "javascript:;",
						class: "detailBtn",
						id: "showTemplates",
						text: s("editor-detail-button-templates")
					}),
					" | ",
					$("<a>", {
						href: "javascript:;",
						class: "detailBtn",
						id: "showImages",
						text: s("editor-detail-button-images")
					}),
					" | ",
					$("<a>", {
						href: "javascript:;",
						class: "detailBtn",
						id: "linksHereBtn",
						text: s("links-here"),
						"data-page-name": e.page
					}).on("click", function () {
						g(e.page);
					})
					)
				),
				$("<label>", { for: "editSummary", text: s("editSummary") }),
				l,
				$("<input>", {
					class: "editSummary",
					id: "editSummary",
					placeholder: "Edit via InPageEdit~",
					value: e.editSummary.replace(/\$oldid/gi, e.summaryRevision)
				}),
				l,
				$("<label>").append(
					$("<input>", {
					type: "checkbox",
					class: "editMinor",
					id: "editMinor",
					checked: e.editMinor
					}),
					$("<span>", { text: s("markAsMinor") })
				),
				" ",
				$("<label>").append(
					$("<input>", {
					type: "checkbox",
					class: "watchList",
					id: "watchList",
					checked: "watch" === e.watchList,
					disabled: ["nochange", "preferences"].includes(e.watchList)
					}),
					$("<span>", { text: s("watchThisPage") })
				),
				" ",
				l,
				$("<label>").append(
					$("<input>", {
					type: "checkbox",
					class: "reloadPage",
					id: "reloadPage",
					checked: e.reload
					}),
					$("<span>", { text: s("editor-reload-page") })
				)
				);
			["nochange", "preferences"].includes(e.watchList) &&
				y
				.find(".watchList")
				.parent()
				.one("click", function (e) {
					e.preventDefault(),
					$(this)
						.removeAttr("title")
						.children("input")
						.prop("disabled", !1);
				})
				.attr("title", s("unlockWatchList"));
			var x = $("<input>", {
				type: "text",
				class: "newSectionTitleInput",
				placeholder: s("editor-new-section")
				}),
				_ = $("<div>").append(
				c,
				$("<section>", { class: "hideBeforeLoaded" }).append(k)
				);
			"new" === e.section &&
				_.prepend(
				$("<label>", { class: "newSectionTitleArea" }).append(
					s("editor-new-section"),
					"<br>",
					x
				)
				),
				console.time("[InPageEdit] 获取页面源代码"),
				console.info("[InPageEdit] QuickEdit options", e),
				ssi_modal.show({
				title: v,
				content: _,
				outSideClose: e.outSideClose,
				className: "in-page-edit ipe-editor timestamp-" + w,
				sizeClass: "large",
				buttons: [
					{
					side: "left",
					label: s("editor-button-save"),
					className:
						"btn btn-primary leftBtn hideBeforeLoaded save-btn",
					method(t, i) {
						function r(t) {
						if (t) {
							let t = y.find(".editSummary").val();
							const r = "new" === e.section ? x.val() : void 0;
							"new" === e.section &&
							(t = t.replace(/\$section/gi, `/* ${r} */`));
							const l = k.val(),
							c = y.find(".editMinor").prop("checked"),
							d = e.section,
							f = t,
							m = y.find(".watchList").prop("checked")
								? "watch"
								: "unwatch",
							g = y.find(".watchList").prop("disabled")
								? e.watchList
								: m;
							!(function (
							{
								text: t,
								page: i,
								minor: r,
								summary: l,
								section: c,
								sectiontitle: d,
								watchlist: f
							},
							m
							) {
							function g(e, t, i) {
								p(!1);
								var a,
								n = i || e,
								o = "";
								void 0 !== n.errors
								? ((e = n.errors[0].code),
									(a = n.errors[0]["*"]),
									(o = ""))
								: "Success" !== n.edit.result
								? ((e = n.edit.code || "Unknown"),
									(a = n.edit.info || "Reason unknown."),
									(o = n.edit.warning || ""))
								: ((e = "unknown"),
									(a = "Reason unknown."),
									(o =
									"Please contact plug-in author or try again.")),
								ssi_modal.show({
									className: "in-page-edit",
									sizeClass: "dialog",
									center: !0,
									title: s("editor-save-error"),
									content: a + '<hr style="clear: both" />' + o
								}),
								ssi_modal.notify("error", {
									className: "in-page-edit",
									position: "right top",
									closeAfter: { time: 15 },
									title: s("notify-error"),
									content:
									s("editor-save-error") +
									"：<code>" +
									e +
									"</code>"
								}),
								console.error(
									"[InPageEdit] Submit failed: \nCode: " + e
								);
							}
							o("quick_edit_save"),
								p(s("editor-title-saving")),
								(e.jsonPost = {
								action: "edit",
								starttimestamp: _.data("starttimestamp"),
								basetimestamp: _.data("basetimestamp"),
								text: t,
								title: i,
								watchlist: f,
								summary: l,
								errorformat: "plaintext",
								...(r ? { minor: !0 } : { notminor: !0 })
								}),
								void 0 !== c &&
								"" !== c &&
								null !== c &&
								(e.jsonPost.section = c),
								void 0 !== d &&
								"" !== d &&
								((e.jsonPost.sectiontitle = d),
								(e.jumpTo = "#" + d)),
								a
								.postWithToken("csrf", e.jsonPost)
								.done(function (t, a, o) {
									var r;
									"Success" === t.edit.result
									? (p(!0),
										y.find(".reloadPage").prop("checked")
										? ($(window).unbind("beforeunload"),
											(r = s("notify-save-success")),
											setTimeout(function () {
											i === n.wgPageName
												? ((window.location =
													mw.util.getUrl(i) + e.jumpTo),
												window.location.reload())
												: window.location.reload();
											}, 500))
										: (console.info(
											"[InPageEdit] 将不会重载页面！"
											),
											(r = s("notify-save-success-noreload")),
											setTimeout(function () {
											p(!1),
												k.attr("data-confirmclose", "true"),
												m.close();
											}, 1500)),
										ssi_modal.notify("success", {
										className: "in-page-edit",
										position: "right top",
										title: s("notify-success"),
										content: r
										}))
									: g(t, 0, o);
								})
								.fail(g);
							})(
							{
								text: l,
								page: e.page,
								minor: c,
								section: d,
								sectiontitle: r,
								summary: f,
								watchlist: g
							},
							i
							);
						}
						}
						console.log({ title: x.val(), content: k.val() }),
						"new" !== e.section || (x.val().trim() && k.val().trim())
							? e.noConfirmEdit
							? r(!0)
							: ssi_modal.confirm(
								{
									className: "in-page-edit",
									center: !0,
									content: s("editor-confirm-save"),
									okBtn: {
									className: "btn btn-primary",
									label: s("confirm")
									},
									cancelBtn: {
									className: "btn btn-secondary",
									label: s("cancel")
									}
								},
								r
								)
							: ssi_modal.notify("error", {
								className: "in-page-edit",
								position: "right top",
								closeAfter: { time: 15 },
								title: s("notify-error"),
								content: s("editor-new-section-missing-content")
							});
					}
					},
					{
					side: "left",
					label: s("editor-button-preview"),
					className: "btn btn-secondary leftBtn hideBeforeLoaded",
					method() {
						o("preview_edit");
						var t = k.val();
						f({
						title: e.page,
						text: t,
						pst: !0,
						section: "new" === e.section ? "new" : void 0,
						sectiontitle: "new" === e.section ? x.val() : void 0
						});
					}
					},
					{
					side: "left",
					label: s("editor-button-diff"),
					className:
						"btn btn-secondary leftBtn hideBeforeLoaded diff-btn"
					},
					{
					label: s("cancel"),
					className: "btn btn-danger",
					method(e, t) {
						t.close();
					}
					}
				],
				beforeShow(e) {
					var t = $("#" + e.modalId);
					t.find(".hideBeforeLoaded").hide(),
					_.find(".ipe-progress").css(
						"margin",
						Number($(window).height() / 3 - 50) + "px 0"
					),
					k.css("height", ($(window).height() / 3) * 2 - 100),
					t.find(".ssi-buttons").prepend(y),
					t.find(".ssi-modalTitle").append(
						$("<a>", {
						class: "showEditNotice",
						href: "javascript:void(0);",
						html:
							'<i class="fa fa-info-circle"></i> ' +
							s("editor-has-editNotice"),
						style: "display: none;"
						}).on("click", function () {
						ssi_modal.show({
							className: "in-page-edit",
							center: !0,
							title: s("editor-title-editNotice"),
							content:
							'<section class="editNotice">' +
							_.data("editNotice") +
							"</section>"
						});
						})
					);
				},
				onShow(t) {
					var i = $("#" + t.modalId);
					function l(t) {
					var l;
					(e.pageDetail = t),
						t.error
						? (console.warn("[InPageEdit]警告：无法获取页面内容"),
							(e.editText = "\x3c!-- " + t.error.info + " --\x3e"),
							(e.pageId = -1),
							y.find(".detailArea").hide())
						: ((e.editText =
							"new" === e.section ? "" : t.parse.wikitext["*"]),
							(e.pageId = t.parse.pageid)),
						_.find(".ipe-progress").hide(),
						i.find(".hideBeforeLoaded").fadeIn(500),
						k.val(e.editText + "\n"),
						null !== e.section && "new" !== e.section
						? ((l = (l = y.find(".editSummary").val()).replace(
							/\$section/gi,
							`/* ${t.parse.sections[0].anchor} */`
							)),
							y.find(".editSummary").val(l),
							v
							.find(".editPage")
							.after(
								'<span class="editSection"> → ' +
								t.parse.sections[0].line +
								"</span>"
							),
							(e.jumpTo = "#" + t.parse.sections[0].anchor))
						: "new" !== e.section &&
							((l = (l = y.find(".editSummary").val()).replace(
							/\$section/gi,
							""
							)),
							y.find(".editSummary").val(l),
							(e.jumpTo = "")),
						null !== e.revision &&
						"" !== e.revision &&
						e.revision !== n.wgCurRevisionId &&
						"new" !== e.section
						? (v
							.find(".editPage")
							.after(
								'<span class="editRevision">(' +
								s("editor-title-editRevision") +
								"：" +
								e.revision +
								")</span>"
							),
							i.find(".diff-btn").on("click", function () {
							o("quick_diff_edit");
							var t = k.val(),
								i = {
								fromrev: e.revision,
								totext: t,
								hideBtn: !0,
								pageName: e.page,
								isPreview: !0
								};
							e.section && (i.fromsection = e.section), m(i);
							}))
						: i.find(".diff-btn").attr("disabled", !0),
						console.time("[InPageEdit] 获取页面基础信息");
					var c = {
						action: "query",
						prop: "revisions|info",
						inprop: "protection|watched",
						format: "json"
					};
					function d(t) {
						const l = t.query.pages[e.pageId];
						var c;
						(e.namespace = l?.ns ?? 0),
						(e.protection = l?.protection || []),
						(e.revision = l?.revisions?.[0]?.revid),
						(e.page = l.title),
						v.find(".editPage").text(e.page),
						"nochange" === e.watchList &&
							y
							.find(".watchList")
							.prop("disabled", !1)
							.prop("checked", "watched" in l)
							.off("click")
							.removeAttr("title"),
						e.revision &&
							"new" !== e.section &&
							i
							.find(".diff-btn")
							.removeAttr("disabled")
							.on("click", function () {
								o("quick_diff_edit");
								var t = k.val(),
								i = {
									fromrev: e.revision,
									totext: t,
									hideBtn: !0,
									pageName: e.page,
									isPreview: !0
								};
								e.section && (i.fromsection = e.section), m(i);
							}),
						e.protection.length > 0 &&
							(((!(c = e.protection.find(
							({ type: e }) => "edit" === e
							)?.level) ||
							r(
								c
								.replace("sysop", "editprotected")
								.replace("autoconfirmed", "editsemiprotected")
							)) &&
							(8 !== e.namespace || r("editinterface"))) ||
							i
								.find(".save-btn")
								.addClass("btn-danger")
								.attr("title", s("editor-no-right")));
						var d = "Editnotice-" + e.namespace,
						p =
							d +
							"-" +
							e.page
							.replace(/_/g, " ")
							.replace(
								n.wgFormattedNamespaces[e.namespace] + ":",
								""
							);
						a.get({
						action: "query",
						meta: "allmessages",
						ammessages: d + "|" + p
						}).done(function (t) {
						var n = t.query.allmessages[0]["*"] || "",
							o = t.query.allmessages[1]["*"] || "";
						("" === n && "" === o) ||
							a
							.post({
								action: "parse",
								title: e.page,
								contentmodel: "wikitext",
								preview: !0,
								text: o + "\n" + n,
								disablelimitreport: !0
							})
							.done(function (t) {
								e.editNotice = t.parse.text["*"];
								var a = _.data("editNotice") || "";
								(a += "\n" + e.editNotice),
								$.parseHTML(a)
									.map((e) => e.innerText)
									.join("")
									.trim() &&
									(_.data("editNotice", a),
									i.find(".showEditNotice").show());
							});
						});
					}
					-1 !== e.pageId
						? (c.pageids = e.pageId)
						: (c.titles = e.page),
						a
						.get(c)
						.done(function (t) {
							console.info("[InPageEdit] 获取页面基础信息成功"),
							console.timeEnd("[InPageEdit] 获取页面基础信息"),
							_.data(
								"basetimestamp",
								t.query.pages?.[e.pageId]?.revisions?.[0]
								?.timestamp ?? b
							),
							_.data(
								"starttimestamp",
								t.query.pages?.[e.pageId]?.touched,
								b
							),
							d(t);
						})
						.fail(function (e, t, i) {
							var a = i;
							console.timeEnd("[InPageEdit] 获取页面基础信息"),
							console.warn("[InPageEdit] 获取页面基础信息失败"),
							_.data("basetimestamp", b),
							_.data("starttimestamp", b),
							d(a);
						});
					}
					mw
					.hook("InPageEdit.quickEdit")
					.fire({
						$modal: t,
						$modalWindow: i,
						$modalTitle: v,
						$modalContent: _,
						$editArea: k,
						$optionsLabel: y
					}),
					k.change(function () {
						$(this).attr("data-modifiled", "true"),
						$(window).bind("beforeunload", function () {
							return s("window-leave-confirm");
						});
					}),
					r("edit") ||
						(ssi_modal.notify("dialog", {
						className: "in-page-edit",
						position: "center bottom",
						title: s("notify-no-right"),
						content: s("editor-no-right"),
						okBtn: {
							label: s("ok"),
							className: "btn btn-primary",
							method(e, t) {
							t.close();
							}
						}
						}),
						i.find(".save-btn").addClass("btn-danger")),
					a
						.get(e.jsonGet)
						.done(function (e) {
						console.timeEnd("[InPageEdit] 获取页面源代码"), l(e);
						})
						.fail(function (e, t, i) {
						console.timeEnd("[InPageEdit] 获取页面源代码"),
							console.warn("[InPageEdit]警告：无法获取页面内容"),
							l(i);
						});
				},
				beforeClose(e) {
					if ("true" === k.attr("data-modifiled"))
					return "true" === k.attr("data-confirmclose")
						? ($(window).off("beforeunload"),
						(e.options.keepContent = !1),
						(e.options.beforeClose = ""),
						void e.close())
						: (ssi_modal.confirm(
							{
							className: "in-page-edit",
							center: !0,
							content: s("editor-leave-confirm"),
							okBtn: {
								className: "btn btn-danger",
								label: s("confirm")
							},
							cancelBtn: {
								className: "btn btn-secondary",
								label: s("cancel")
							}
							},
							function (e) {
							!0 === e && t();
							}
						),
						!1);
					function t() {
					$(window).off("beforeunload"),
						(e.options.keepContent = !1),
						(e.options.beforeClose = ""),
						e.close(),
						ssi_modal.notify("info", {
						className: "in-page-edit",
						position: "right top",
						title: s("cancel"),
						content: s("notify-no-change")
						});
					}
					t();
				}
				}),
				y.find(".detailBtnGroup .detailBtn").on("click", function () {
				o("quick_edit_pagedetail");
				var t = $(this).attr("id"),
					i = $("<ul>");
				switch (t) {
					case "showTemplates": {
					const t = e.pageDetail.parse.templates;
					for (let e = 0; e < t.length; e++) {
						let a = t[e]["*"];
						$("<li>")
						.append(
							$("<a>", {
							href: mw.util.getUrl(a),
							target: "_blank",
							text: a
							}),
							" (",
							$("<a>", {
							href: "javascript:;",
							text: s("quick-edit"),
							class: "quickEditTemplate",
							"data-template-name": a
							}),
							" | ",
							$("<a>", {
							href: "javascript:;",
							text: s("links-here"),
							class: "quickEditLinksHere"
							}).on("click", function () {
							g(a);
							}),
							")"
						)
						.appendTo(i);
					}
					ssi_modal.show({
						className: "in-page-edit quick-edit-detail",
						sizeClass: "dialog",
						title: s("editor-detail-title-templates"),
						content: i
					});
					break;
					}
					case "showImages": {
					const t = e.pageDetail.parse.images;
					for (let e = 0; e < t.length; e++) {
						const a = t[e];
						$("<li>")
						.append(
							$("<a>", {
							href: mw.util.getUrl("File:" + a),
							target: "_balnk",
							text: a
							}),
							" (",
							$("<a>", {
							href: "javascript:;",
							class: "quickViewImage",
							text: s("editor-detail-images-quickview"),
							"data-image-name": a
							}),
							" | ",
							$("<a>", {
							href:
								n.wgScript +
								"?title=Special:Upload&wpDestFile=" +
								a +
								"&wpForReUpload=1",
							target: "_balnk",
							text: s("editor-detail-images-upload")
							}),
							"|",
							$("<a>", {
							href: "javascript:;",
							text: s("links-here"),
							class: "quickEditLinksHere"
							}).on("click", function () {
							g(`File:${a}`);
							}),
							")"
						)
						.appendTo(i);
					}
					ssi_modal.show({
						className: "in-page-edit quick-edit-detail",
						sizeClass: "dialog",
						title: s("editor-detail-title-images"),
						content: i
					});
					break;
					}
				}
				$(".in-page-edit.quick-edit-detail .quickEditTemplate").on(
					"click",
					function () {
					o("quick_edit_pagedetail_edit_template");
					var e = $(this).attr("data-template-name");
					u({ page: e });
					}
				),
					$(".in-page-edit.quick-edit-detail .quickViewImage").on(
					"click",
					function () {
						o("quick_edit_pagedetail_view_image");
						var e = $(this).attr("data-image-name");
						ssi_modal.show({
						className: "in-page-edit quick-view-image",
						center: !0,
						title: e.replace(/_/g, " "),
						content: $("<center>", { id: "imageLayer" }).append(c),
						buttons: [
							{
							label: s("editor-detail-images-upload"),
							className: "btn btn-primary",
							method() {
								window.open(
								mw.util.getUrl("Special:Upload", {
									wpDestFile: e,
									wpForReUpload: 1
								})
								);
							}
							},
							{
							label: s("close"),
							className: "btn btn-secondary",
							method(e, t) {
								t.close();
							}
							}
						],
						onShow() {
							a.get({
							action: "query",
							format: "json",
							prop: "imageinfo",
							titles: `File:${e.replace(/file:/g, "")}`,
							iiprop: "url"
							}).done(function (e) {
							$(".quick-view-image .ipe-progress").hide(),
								$(".quick-view-image #imageLayer").append(
								$("<img>", {
									src: e.query.pages[-1].imageinfo[0].url,
									class: "loading",
									style: "max-width: 80%; max-height: 60vh"
								})
								),
								$(".quick-view-image #imageLayer img").load(
								function () {
									$(this).removeClass("loading");
								}
								);
							});
						}
						});
					}
					);
				});
			};
			e.exports = { quickEdit: u };
		},
		597: (e, t, i) => {
			const { _msg: a } = i(658),
			{ $progress: n } = i(494);
			var o = new mw.Api();
			e.exports = {
			quickPreview: function (e, t = "large", i = !1) {
				var s = $.extend(
				{},
				{
					action: "parse",
					preview: !0,
					disableeditsection: !0,
					prop: "text",
					format: "json"
				},
				e
				);
				mw.hook("InPageEdit.quickPreview").fire();
				var r = new Date().getTime();
				console.time("[InPageEdit] Request preview"),
				ssi_modal.show({
					sizeClass: new RegExp(
					/dialog|small|smallToMedium|medium|mediumToLarge|large|full|auto/
					).test(t)
					? t
					: "large",
					center: Boolean(i),
					className: "in-page-edit previewbox",
					title: a("preview-title"),
					content: $("<section>").append(
					n,
					$("<div>", {
						class: "InPageEditPreview",
						"data-timestamp": r,
						style: "display:none",
						text: a("preview-placeholder")
					})
					),
					fixedHeight: !0,
					fitScreen: !0,
					buttons: [{ label: "", className: "hideThisBtn" }],
					onShow() {
					$(".previewbox .ipe-progress").css(
						"margin-top",
						$(".previewbox .ipe-progress").parent().height() / 2
					),
						$(".previewbox .hideThisBtn").hide(),
						o
						.post(s)
						.then(function (e) {
							console.timeEnd("[InPageEdit] Request preview");
							var t = e.parse.text["*"];
							$(".previewbox .ipe-progress").hide(150),
							$('.InPageEditPreview[data-timestamp="' + r + '"]')
								.fadeIn(500)
								.html(t);
						})
						.fail(function () {
							console.timeEnd("[InPageEdit] Request preview"),
							console.warn("[InPageEdit] 预览失败"),
							$(".previewbox .ipe-progress").hide(150),
							$('.InPageEditPreview[data-timestamp="' + r + '"]')
								.fadeIn(500)
								.html(a("preview-error"));
						});
					}
				});
			}
			};
		},
		977: (e, t, i) => {
			var a = new mw.Api(),
			n = mw.config.get();
			const { _analytics: o } = i(955),
			{ _msg: s } = i(658),
			{ $br: r, $progress: l } = i(494),
			{ _resolveExists: c } = i(976),
			{ preference: d } = i(525);
			e.exports = {
			quickRedirect: function (e = "to") {
				mw.hook("InPageEdit.quickRedirect").fire();
				var t,
				i,
				p,
				f = "#REDIRECT [[:$1]]",
				m = {
					action: "edit",
					createonly: 1,
					minor: d.get("editMinor"),
					format: "json",
					errorformat: "plaintext"
				};
				if ("to" === e)
				(m.title = n.wgPageName),
					(t = s(
					"redirect-question-to",
					"<b>" + n.wgPageName.replace(/_/g, " ") + "</b>"
					));
				else {
				if ("from" !== e)
					return void console.error(
					'[InPageEdit] quickRedirect only accept "from" or "to"'
					);
				(t = s(
					"redirect-question-from",
					"<b>" + n.wgPageName.replace(/_/g, " ") + "</b>"
				)),
					(p = s("redirect-summary") + " → [[:" + n.wgPageName + "]]");
				}
				ssi_modal.show({
				outSideClose: !1,
				className: "in-page-edit quick-redirect",
				center: !0,
				sizeClass: "dialog",
				title: s("redirect-title"),
				content: $("<div>").append(
					$("<section>").append(
					$("<span>", { html: t }),
					r,
					$("<input>", { id: "redirect-page", style: "width:96%" }).on(
						"click",
						function () {
						$(this).css("box-shadow", "");
						}
					),
					...("from" === e
						? [
							r,
							$("<label>", {
							for: "redirect-fragment",
							text: s("redirect-question-fragment")
							}),
							$("<input>", {
							id: "redirect-fragment",
							style: "width:96%"
							})
						]
						: []),
					r,
					$("<label>", {
						for: "redirect-reason",
						text: s("editSummary")
					}),
					$("<input>", { id: "redirect-reason", style: "width:96%" })
					),
					$(l).css("display", "none")
				),
				buttons: [
					{
					label: s("confirm"),
					className: "btn btn-primary btn-single okBtn",
					method: function (t, r) {
						if (
						"" ===
							(i = $(
							".in-page-edit.quick-redirect #redirect-page"
							).val()) ||
						i.replace(/_/g, " ") === n.wgPageName.replace(/_/g, " ")
						)
						return void $(
							".in-page-edit.quick-redirect #redirect-page"
						).css("box-shadow", "0 0 4px #f00");
						if ((o("quick_redirect"), "to" === e))
						(p = s("redirect-summary") + " → [[:" + i + "]]"),
							(m.text = f.replace("$1", i));
						else if ("from" === e) {
						let e = $(
							".in-page-edit.quick-redirect #redirect-fragment"
						)
							.val()
							.trim();
						e && !e.startsWith("#") && (e = `#${e}`),
							(m.title = i),
							(m.text = f.replace("$1", `${n.wgPageName}${e}`));
						}
						"" !==
						$(
							".in-page-edit.quick-redirect #redirect-reason"
						).val() &&
						(p =
							p +
							" (" +
							$(
							".in-page-edit.quick-redirect #redirect-reason"
							).val() +
							")"),
						(m.summary = p),
						$(".in-page-edit.quick-redirect .ipe-progress").show(),
						$(".in-page-edit.quick-redirect section").hide(),
						$(".in-page-edit.quick-redirect .okBtn").attr(
							"disabled",
							"disabled"
						);
						let l = Promise.resolve();
						function g(t) {
						t.errors
							? u(t.errors[0].code, t)
							: ($(
								".in-page-edit.quick-redirect .ipe-progress"
							).addClass("done"),
							ssi_modal.notify("success", {
								className: "in-page-edit",
								content: s("notify-redirect-success"),
								title: s("notify-success")
							}),
							"to" === e
								? window.location.reload()
								: ($(
									".in-page-edit.quick-redirect .ipe-progress"
								).addClass("done"),
								setTimeout(function () {
									r.close();
								}, 2e3)));
						}
						function u(t, a) {
						var o, r;
						$(".in-page-edit.quick-redirect .ipe-progress").hide(),
							$(".in-page-edit.quick-redirect section").show(),
							$(".in-page-edit.quick-redirect .okBtn").attr(
							"disabled",
							!1
							),
							$(
							".in-page-edit.quick-redirect .ipe-progress"
							).addClass("done"),
							ssi_modal.notify("error", {
							className: "in-page-edit",
							content:
								s("notify-redirect-error") +
								"<br>" +
								a.errors[0]["*"] +
								" (<code>" +
								t +
								"</code>)",
							title: s("notify-error")
							}),
							"articleexists" === t &&
							("from" === e
								? ((o = a.fromPage ?? i), (r = n.wgPageName))
								: "to" === e &&
								((o = a.fromPage ?? n.wgPageName), (r = i)),
							c(o, {
								delete: "Delete for redirect to [[" + r + "]]",
								edit: "Modify for redirect"
							}));
						}
						d.get("noRedirectIfConvertedTitleExists") &&
						(l = a
							.get({
							titles: m.title,
							converttitles: 1,
							formatversion: 2
							})
							.done((e) => {
							const t = e.query.pages[0];
							if (!0 !== t?.missing)
								throw (
								(u("articleexists", {
									fromPage: t.title,
									errors: [
									{ "*": s("notify-redirect-converted-error") }
									]
								}),
								null)
								);
							})
							.fail((e, t) => {
							throw (u(e, t), null);
							})),
						l.then(
							() => {
							a.postWithToken("csrf", m).done(g).fail(u);
							},
							() => {}
						);
					}
					}
				]
				});
			}
			};
		},
		79: (e, t, i) => {
			var a = new mw.Api(),
			n = mw.config.get();
			const { _analytics: o } = i(955),
			{ _msg: s } = i(658),
			{ _hasRight: r } = i(697),
			{ _resolveExists: l } = i(976),
			{ $br: c } = i(494),
			{ progress: d } = i(763);
			e.exports = {
			quickRename: function (e, t) {
				var i, p, f, m;
				mw.hook("InPageEdit.quickRename").fire(),
				(e = e || n.wgPageName),
				(t = t || ""),
				ssi_modal.show({
					outSideClose: !1,
					className: "in-page-edit quick-rename",
					center: !0,
					sizeClass: "dialog",
					title: s("rename-title"),
					content: $("<section>").append(
					$("<label>", {
						for: "move-to",
						html: s(
						"rename-moveTo",
						"<b>" + e.replace(/_/g, " ") + "</b>"
						)
					}),
					c,
					$("<input>", {
						id: "move-to",
						style: "width:96%",
						onclick: "$(this).css('box-shadow','')"
					}),
					c,
					$("<label>", { for: "move-reason", text: s("editSummary") }),
					c,
					$("<input>", { id: "move-reason", style: "width:96%" }),
					c,
					$("<label>").append(
						$("<input>", {
						type: "checkbox",
						id: "movetalk",
						checked: "checked"
						}),
						$("<span>", { text: s("rename-movetalk") })
					),
					c,
					$("<label>").append(
						$("<input>", {
						type: "checkbox",
						id: "movesubpages",
						checked: "checked"
						}),
						$("<span>", { text: s("rename-movesubpages") })
					),
					c,
					$("<label>").append(
						$("<input>", {
						type: "checkbox",
						id: "noredirect",
						disabled: !r("suppressredirect")
						}),
						$("<span>", { text: s("rename-noredirect") })
					)
					),
					buttons: [
					{
						label: s("cancel"),
						className: "btn btn-secondary",
						method: function (e, t) {
						t.close();
						}
					},
					{
						label: s("confirm"),
						className: "btn btn-primary",
						method: function () {
						"" !==
							(t = $(".in-page-edit.quick-rename #move-to").val()) &&
						t !== n.wgPageName &&
						t !== n.wgPageName.replace(/_/g, " ")
							? (o("quick_move"),
							d(s("editor-title-saving")),
							(p = $(".in-page-edit.quick-rename #movetalk").prop(
								"checked"
							)),
							(f = $(
								".in-page-edit.quick-rename #movesubpages"
							).prop("checked")),
							(m = $(".in-page-edit.quick-rename #noredirect").prop(
								"checked"
							)),
							(i =
								"" ===
								(i = $(
								".in-page-edit.quick-rename #move-reason"
								).val())
								? s("rename-summary") + " → [[:" + t + "]]"
								: s("rename-summary") +
									" → [[:" +
									t +
									"]] (" +
									i +
									")"),
							a
								.postWithToken("csrf", {
								action: "move",
								from: e,
								to: t,
								reason: i,
								movetalk: p,
								movesubpages: f,
								noredirect: m
								})
								.done(function () {
								d(!0),
									ssi_modal.notify("success", {
									className: "in-page-edit",
									content: s("notify-rename-success"),
									title: s("notify-success")
									}),
									(location.href = n.wgArticlePath.replace(
									"$1",
									t
									));
								})
								.fail(function (i, a, n) {
								d(!1),
									ssi_modal.notify("error", {
									className: "in-page-edit",
									content:
										s("notify-rename-error") +
										": " +
										n.error.info +
										"<code>" +
										n.error.code +
										"</code>",
									title: s("notify-error")
									}),
									"articleexists" === n.error.code &&
									l(t, "For move page [[" + e + "]] to here.");
								}))
							: $(".in-page-edit.quick-rename #move-to").css(
								"box-shadow",
								"0 0 4px #f00"
							);
						}
					}
					],
					beforeShow: function () {
					if (!r("move"))
						return (
						ssi_modal.dialog({
							title: s("notify-no-right"),
							content: s("rename-no-right"),
							className: "in-page-edit quick-deletepage",
							center: !0,
							okBtn: { className: "btn btn-primary btn-single" }
						}),
						!1
						);
					}
				});
			}
			};
		},
		5: (e, t, i) => {
			const { _msg: a } = i(658);
			e.exports = {
			specialNotice: function () {
				ssi_modal.notify(
				"dialog",
				{
					className: "in-page-edit ipe-special-notice",
					title: a("version-notice-title"),
					content: a("version-notice"),
					okBtn: {
					label: a("updatelog-dismiss"),
					className: "btn btn-primary"
					}
				},
				function (e, t) {
					localStorage.setItem("InPageEditNoticeId", a("noticeid")),
					t.close();
				}
				);
			}
			};
		},
		663: (e) => {
			e.exports = { config: mw.config.get(), mwApi: new mw.Api() };
		},
		626: (e, t, i) => {
			const a = i(147).i8;
			e.exports = a;
		},
		776: (e, t, i) => {
			const { _msg: a } = i(658),
			n = i(626),
			{ updatelogsUrl: o, githubLink: s, aboutUrl: r } = i(550);
			e.exports = {
			versionInfo: function () {
				ssi_modal.show({
				className: "in-page-edit update-logs-modal",
				title:
					a("updatelog-title") +
					' - <span id="yourVersion">' +
					n +
					"</span>",
				content: $("<section>").append(
					$("<iframe>", {
					style:
						"margin: 0;padding: 0;width: 100%;height: 80vh;border: 0;",
					src: o
					})
				),
				buttons: [
					{
					label: "GitHub",
					className: "btn btn-secondary",
					method: function () {
						window.open(s);
					}
					},
					{
					label: a("updatelog-about"),
					className: "btn btn-secondary",
					method: function () {
						window.open(r);
					}
					},
					{
					label: a("close"),
					className: "btn btn-primary",
					method: function (e, t) {
						t.close();
					}
					}
				]
				});
			}
			};
		},
		147: (e) => {
			"use strict";
			e.exports = { i8: "14.3.1" };
		}
		},
		t = {};
	function i(a) {
		var n = t[a];
		if (void 0 !== n) return n.exports;
		var o = (t[a] = { exports: {} });
		return e[a](o, o.exports, i), o.exports;
	}
	!(async function () {
		const e = window.InPageEdit || {};
		if (e.loaded) throw "[InPageEdit] InPageEdit 被多次加载。";
		e.loaded = !0;
		const t = i(855);
		window.InPageEdit = { ...e, ...(await t()) };
	})();
})();
