import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as company } from "./company-D2SG7UID.mjs";
import { n as CardContent, t as Card } from "./card-DuklqRLf.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as ArrowRight, a as Sparkles, b as Building2, d as FlaskConical, h as CircleCheck, m as ClipboardCheck, o as Scale, p as FileSearch, r as TrendingUp, t as Upload, u as House, v as Check, x as BadgeCheck, y as ChartColumn } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CQljPrZA.js
var import_jsx_runtime = require_jsx_runtime();
var RESULT_ROWS = [
	{
		id: "AS-2411-082",
		method: "Assay · HPLC",
		result: "99.5%",
		verdict: "Pass"
	},
	{
		id: "AS-2411-083",
		method: "Assay · HPLC",
		result: "98.1%",
		verdict: "Pass"
	},
	{
		id: "PT-2411-014",
		method: "Potency · UV",
		result: "101.9%",
		verdict: "Watch"
	},
	{
		id: "AS-2411-084",
		method: "Assay · HPLC",
		result: "97.2%",
		verdict: "Pass"
	},
	{
		id: "DP-2411-006",
		method: "Dilution prep",
		result: "0.5 mg/mL",
		verdict: "Pass"
	},
	{
		id: "AS-2411-085",
		method: "Assay · HPLC",
		result: "94.3%",
		verdict: "OOS"
	}
];
var VERDICT_STYLES = {
	Pass: "bg-emerald-100 text-emerald-700",
	Watch: "bg-amber-100 text-amber-700",
	OOS: "bg-red-100 text-red-700"
};
var TREND_POINTS = "0,34 14,30 28,33 42,26 56,28 70,22 84,24 98,16 112,19 126,12";
function Sparkline() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 126 40",
		className: "h-16 w-full",
		preserveAspectRatio: "none",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
				id: "trend-fill",
				x1: "0",
				y1: "0",
				x2: "0",
				y2: "1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					stopColor: "oklch(0.66 0.16 148)",
					stopOpacity: "0.35"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: "oklch(0.66 0.16 148)",
					stopOpacity: "0"
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: `${TREND_POINTS} 126,40 0,40`,
				fill: "url(#trend-fill)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
				points: TREND_POINTS,
				fill: "none",
				stroke: "oklch(0.50 0.155 252)",
				strokeWidth: "2",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "0",
				y1: "10",
				x2: "126",
				y2: "10",
				stroke: "oklch(0.577 0.245 27.325)",
				strokeWidth: "1",
				strokeDasharray: "3 3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "0",
				y1: "34",
				x2: "126",
				y2: "34",
				stroke: "oklch(0.63 0.16 150)",
				strokeWidth: "1",
				strokeDasharray: "3 3"
			})
		]
	});
}
var SIDEBAR_ICONS = [
	House,
	Upload,
	FileSearch,
	FlaskConical,
	ChartColumn,
	TrendingUp
];
/**
* Static, presentational mock of the Qubits lab console used in the hero.
* Deliberately not interactive — the real product lives at /tools.
*/
function DashboardMockup() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-xl overflow-hidden rounded-2xl border border-white/20 bg-card text-card-foreground shadow-2xl shadow-black/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3 border-b border-border/80 bg-secondary/60 px-4 py-2.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-brand-green" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xs font-bold tracking-wide text-foreground",
						children: "QUBITS LAB CONSOLE"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden flex-1 items-center sm:flex",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-full rounded-md border border-border/70 bg-background px-3 py-1 text-[11px] text-muted-foreground",
						children: "Search samples, methods, runs…"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary",
					children: "AN"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden flex-col items-center gap-1 border-r border-border/70 bg-secondary/40 px-2 py-3 sm:flex",
				children: SIDEBAR_ICONS.map((Icon, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `grid h-8 w-8 place-items-center rounded-lg ${i === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
				}, i))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1 space-y-3 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2",
						children: [
							["Samples today", "24"],
							["Pass rate", "96%"],
							["Review queue", "3"]
						].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border/70 bg-background px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-medium tracking-wide text-muted-foreground uppercase",
								children: label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-lg font-bold text-foreground",
								children: value
							})]
						}, label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-lg border border-border/70",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border/70 bg-secondary/50 px-3 py-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-semibold text-foreground",
								children: "Recent results"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground",
								children: "IPC limits applied"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-border/60",
							children: RESULT_ROWS.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 px-3 py-1.5 text-[11px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-24 shrink-0 font-medium text-foreground",
										children: row.id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden min-w-0 flex-1 truncate text-muted-foreground sm:block",
										children: row.method
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto font-semibold text-foreground",
										children: row.result
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${VERDICT_STYLES[row.verdict]}`,
										children: row.verdict
									})
								]
							}, row.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border/70 bg-background px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-semibold text-foreground",
								children: "Trend · Assay % label claim"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-[10px] font-medium text-brand-green-deep",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " AI reviewed"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {})]
					})
				]
			})]
		})]
	});
}
var PAGE_LINKS = [
	{
		hash: "about",
		label: "About"
	},
	{
		hash: "capabilities",
		label: "Capabilities"
	},
	{
		hash: "workflow",
		label: "How it works"
	},
	{
		hash: "company",
		label: "Company"
	},
	{
		hash: "intelligence",
		label: "AI trend review"
	}
];
var CAPABILITIES = [
	{
		icon: FlaskConical,
		title: "Assay & potency",
		body: "Run structured calculations with outputs and configured compliance verdicts ready for analyst review.",
		tag: "IPC-guided calculations",
		workflow: "assay-potency",
		action: "Open assay calculator"
	},
	{
		icon: Scale,
		title: "Dilution & preparation",
		body: "Work through preparation calculations with clear inputs and live results in the same calculator workspace.",
		tag: "Preparation workflows",
		workflow: "dilution-preparation",
		action: "Open dilution calculator"
	},
	{
		icon: FileSearch,
		title: "Document-assisted review",
		body: "Upload supported lab documents, inspect extracted values and suggested calculations, then confirm before calculating.",
		tag: "Analyst-confirmed",
		workflow: "upload",
		action: "Upload & analyse"
	}
];
var WORKFLOW_STEPS = [
	{
		icon: Upload,
		title: "Add source data",
		body: "Upload a PDF, spreadsheet, ZIP archive, text file or supported image."
	},
	{
		icon: FileSearch,
		title: "Review suggestions",
		body: "Inspect extracted values and the proposed calculation before anything is run."
	},
	{
		icon: ClipboardCheck,
		title: "Calculate & save",
		body: "Confirm the fields, review the result and its verdict, then save the run to your history."
	},
	{
		icon: TrendingUp,
		title: "Review trends",
		body: "Select saved assay and potency runs for an AI summary and follow-up checks."
	}
];
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "bg-hero-background text-hero-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] md:py-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-5 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-2 w-2 shrink-0 rounded-full bg-brand-green",
									"aria-hidden": "true"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium text-hero-muted",
									children: company.tagline
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "max-w-xl font-display text-4xl font-bold leading-tight sm:text-5xl",
								children: "Pharmaceutical QC calculations, in one analyst-led workspace."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 max-w-xl text-base leading-relaxed text-hero-muted sm:text-lg",
								children: "Qubits Lab Calculator brings assay and potency, dilution and preparation, document review and trend checks into a single workflow. Review every extracted value before calculating."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									className: "gap-2 bg-brand-green text-brand-blue-deep hover:bg-brand-green/90",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/auth",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlaskConical, { className: "h-4 w-4" }), " Sign in to calculator"]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									variant: "outline",
									className: "gap-2 border-hero-foreground/30 bg-transparent text-hero-foreground hover:bg-hero-panel hover:text-hero-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/auth",
										search: { mode: "signup" },
										children: ["Create an account ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-xs text-hero-muted",
								children: "Calculator access requires a personal account. Uploads and saved runs stay private to the signed-in user."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-0 md:justify-self-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardMockup, {})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "Homepage sections",
				className: "border-b border-border bg-background",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-7 gap-y-2 px-4 py-4 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mr-1 text-xs font-semibold uppercase text-muted-foreground",
						children: "Explore"
					}), PAGE_LINKS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						hash: item.hash,
						className: "text-sm font-medium text-foreground transition-colors hover:text-primary",
						children: item.label
					}, item.hash))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "about",
				className: "scroll-mt-24 py-16 sm:py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] md:items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "mb-4 border-brand-green/40 text-brand-green-deep",
								children: "About Qubits"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl",
								children: "Software support for pharmaceutical analysis."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-base leading-relaxed text-muted-foreground",
								children: "Qubits Private Limited builds software support and maintenance tools for computer programming and related activities. The Lab Calculator is a focused workspace for pharmaceutical QC analysts—not a replacement for a laboratory information management system, validated equipment or approved procedures."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 border-l border-border pl-5 sm:grid-cols-2 md:pl-7",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase text-muted-foreground",
								children: "The workspace"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-foreground",
								children: "Guided calculation, document-assisted value review, personal run history and trend summaries."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase text-muted-foreground",
								children: "The analyst"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-foreground",
								children: "You confirm source data and calculation choices; AI trend observations remain decision support for human review."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold uppercase text-muted-foreground",
									children: "Account privacy"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-foreground",
									children: "Calculator workflows require sign-in. Uploaded documents, calculations and saved trends are scoped to the individual account."
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "capabilities",
				className: "scroll-mt-24 border-y border-border bg-secondary/30 py-16 sm:py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto w-full max-w-6xl px-4 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-2xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "mb-4 border-brand-green/40 text-brand-green-deep",
									children: "Lab workflows"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl",
									children: "The calculations your QC work starts with"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-base leading-relaxed text-muted-foreground",
									children: "Choose a workflow, review the inputs and results, and keep confirmed runs together."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-9 grid gap-4 md:grid-cols-3",
							children: CAPABILITIES.map((capability) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								className: "h-full border-border/80 shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "flex h-full flex-col items-start gap-4 p-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(capability.icon, {
												className: "h-5 w-5",
												"aria-hidden": "true"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-xl font-semibold text-foreground",
											children: capability.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm leading-relaxed text-muted-foreground",
											children: capability.body
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-auto flex items-center gap-2 pt-2 text-xs font-semibold text-brand-green-deep",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
													className: "h-4 w-4",
													"aria-hidden": "true"
												}),
												" ",
												capability.tag
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/auth",
											search: { workflow: capability.workflow },
											className: "inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80",
											children: [
												"Sign in to ",
												capability.action.toLowerCase(),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
													className: "h-4 w-4",
													"aria-hidden": "true"
												})
											]
										})
									]
								})
							}, capability.title))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-3xl text-xs leading-relaxed text-muted-foreground",
							children: "Document analysis supports PDF, Excel, CSV, TXT, JSON, ZIP and common image files up to 25 MB. Extracted values are suggestions for analyst review."
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "workflow",
				className: "scroll-mt-24 py-16 sm:py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto w-full max-w-6xl px-4 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-2xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "mb-4",
							children: "How it works"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl",
							children: "From source data to a reviewed run"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-10 grid gap-x-7 gap-y-8 sm:grid-cols-2 lg:grid-cols-4",
						children: WORKFLOW_STEPS.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "border-l border-border pl-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-display text-sm font-bold text-primary",
										children: ["0", index + 1]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(step.icon, {
										className: "h-4 w-4 text-brand-green-deep",
										"aria-hidden": "true"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-4 font-display text-lg font-semibold text-foreground",
									children: step.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-muted-foreground",
									children: step.body
								})
							]
						}, step.title))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "company",
				className: "scroll-mt-24 border-y border-border bg-secondary/30 py-16 sm:py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto w-full max-w-6xl px-4 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
								className: "h-5 w-5",
								"aria-hidden": "true"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "mb-3",
								children: "Company information"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl",
								children: company.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-base text-muted-foreground",
								children: company.tagline
							})
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-9 grid gap-x-8 gap-y-6 border-t border-border pt-7 sm:grid-cols-2 lg:grid-cols-3",
						children: [
							["Corporate identification number", company.cin],
							["Incorporated", company.incorporationDate],
							["Registrar of Companies", company.roc],
							["Authorized and paid-up capital", company.capital],
							["Business classification", company.nicClassification],
							["Directors", company.directors.join(" and ")],
							["Registered office", company.registeredAddress]
						].map(([term, detail]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs font-semibold uppercase text-muted-foreground",
								children: term
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-2 text-sm leading-relaxed text-foreground",
								children: detail
							})]
						}, term))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "intelligence",
				className: "scroll-mt-24 border-b border-border bg-accent/35 py-16 sm:py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid w-full max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "mb-4 border-brand-green/40 text-brand-green-deep",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
									className: "mr-1 h-3 w-3",
									"aria-hidden": "true"
								}), " AI-assisted review"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl",
								children: "Trend signals for human review"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-base leading-relaxed text-muted-foreground",
								children: "Select reviewed assay and potency runs to get a concise trend summary, unusual-shift flags and suggested follow-up checks. The analyst reviews every suggestion against the source data before acting."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								className: "mt-7 gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/auth",
									search: { workflow: "trend" },
									children: ["Sign in to review trends ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3 border-b border-border pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold uppercase text-muted-foreground",
									children: "Trend review"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-1 font-display text-lg font-semibold text-foreground",
									children: "Analyst review output"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, {
										className: "h-5 w-5",
										"aria-hidden": "true"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border",
								children: [
									["Trend summary", "A concise read across selected reviewed runs"],
									["Shift flags", "Normal, watch or unusual signals to inspect"],
									["Follow-up checks", "Suggested checks to consider against raw data"]
								].map(([title, detail]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-3 py-4 last:pb-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, {
										className: "mt-0.5 h-4 w-4 shrink-0 text-brand-green-deep",
										"aria-hidden": "true"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-sm font-semibold text-foreground",
										children: title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-sm leading-relaxed text-muted-foreground",
										children: detail
									})] })]
								}, title))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground",
								children: "Decision support only. Verify findings with the original records and approved procedures."
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { Index as component };
