import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as CheckboxIndicator, p as require_jsx_runtime, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as supabase } from "./client-BmWsGYN7.mjs";
import { n as CardContent, t as Card } from "./card-DuklqRLf.mjs";
import { n as Label, t as Input } from "./label-CmIE8x5o.mjs";
import { t as useAuthSession } from "./use-auth-session-D5EPYD8M.mjs";
import { _ as ChevronDown, a as Sparkles, c as Radio, d as FlaskConical, f as FileText, g as ChevronUp, i as Trash2, l as LoaderCircle, n as TriangleAlert, o as Scale, r as TrendingUp, s as RotateCcw, t as Upload, v as Check } from "../_libs/lucide-react.mjs";
import { a as TSS_SERVER_FUNCTION, l as createServerFn } from "./createServerFn-BhqelEmK.mjs";
import { i as requireSupabaseAuth, n as CATEGORY_META, r as calculatorsByCategory, t as CALCULATORS } from "./registry-CdpUgCOQ.mjs";
import { a as objectType, c as unionType, i as numberType, n as enumType, o as recordType, r as nullType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
import { t as Route } from "./tools-BXuLHx-t.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-fMYAWVyI.mjs";
import { t as isTrendEligible } from "./trend-select-DWBSGD1m.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools-D1DtQo9K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var verdictStyles = {
	pass: "border-success/40 bg-success/10 text-foreground",
	fail: "border-destructive/40 bg-destructive/10 text-destructive",
	warn: "border-warning/50 bg-warning/15 text-warning-foreground",
	info: "border-border bg-muted/60 text-muted-foreground"
};
var verdictLabel = {
	pass: "Pass",
	fail: "Fail",
	warn: "Review",
	info: "Note"
};
function CalculatorCard({ def, initialValues, onChange }) {
	const defaults = (0, import_react.useMemo)(() => {
		const v = {};
		for (const field of def.fields) v[field.key] = field.defaultValue ?? "";
		return v;
	}, [def]);
	const base = (0, import_react.useMemo)(() => initialValues ?? defaults, [initialValues, defaults]);
	const [values, setValues] = (0, import_react.useState)(base);
	const result = (0, import_react.useMemo)(() => def.compute(values), [def, values]);
	const onChangeRef = (0, import_react.useRef)(onChange);
	(0, import_react.useEffect)(() => {
		onChangeRef.current = onChange;
	});
	(0, import_react.useEffect)(() => {
		onChangeRef.current?.({
			values,
			outputs: result.outputs,
			verdicts: result.verdicts
		});
	}, [values, result]);
	const setValue = (key, value) => setValues((prev) => ({
		...prev,
		[key]: value
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "overflow-hidden pt-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "brand-gradient h-1.5 w-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "flex flex-col gap-5 p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-semibold tracking-tight text-foreground",
							children: def.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: def.summary
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "border-emerald-500/30 bg-emerald-500/10 text-[11px] font-medium text-emerald-600 dark:text-emerald-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" }), " Live Calc"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "shrink-0 border-primary/30 text-primary",
							children: def.reference
						})]
					})]
				}),
				def.formula ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-lg bg-muted/60 px-3 py-2 font-mono text-xs leading-relaxed text-secondary-foreground",
					children: def.formula
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: def.fields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								htmlFor: `${def.id}-${field.key}`,
								className: "text-sm font-medium",
								children: [field.label, field.unit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-1 font-normal text-muted-foreground",
									children: [
										"(",
										field.unit,
										")"
									]
								}) : null]
							}),
							field.type === "select" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: values[field.key] ?? "",
								onValueChange: (value) => setValue(field.key, value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									id: `${def.id}-${field.key}`,
									className: "w-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select…" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (field.options ?? []).map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: option.value,
									children: option.label
								}, option.value)) })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: `${def.id}-${field.key}`,
								type: field.type === "number" ? "number" : "text",
								inputMode: field.type === "number" ? "decimal" : void 0,
								step: field.step,
								min: field.min,
								max: field.max,
								placeholder: field.placeholder,
								value: values[field.key] ?? "",
								onChange: (event) => setValue(field.key, event.target.value)
							}),
							field.help ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-snug text-muted-foreground",
								children: field.help
							}) : null
						]
					}, field.key))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-secondary/40 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold tracking-wider text-muted-foreground uppercase",
								children: "Result"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "sm",
								className: "h-7 gap-1.5 px-2 text-xs text-muted-foreground",
								onClick: () => setValues(base),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3 w-3" }), " Reset"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-x-8 gap-y-3",
							children: def.outputs.map((output) => {
								const raw = result.outputs[output.key];
								const display = typeof raw === "number" ? raw.toFixed(output.decimals ?? 2) : raw !== null && raw !== void 0 ? String(raw) : "—";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: output.multiline ? "min-w-full" : "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs text-muted-foreground",
										children: output.label
									}), output.multiline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
										className: "mt-1 whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground",
										children: display
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: output.primary ? "font-display text-3xl font-bold text-primary" : "font-display text-xl font-semibold text-foreground",
										children: [display, output.unit && display !== "—" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-1 text-sm font-normal text-muted-foreground",
											children: output.unit
										}) : null]
									})]
								}, output.key);
							})
						}),
						result.verdicts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 flex flex-col gap-2",
							children: result.verdicts.map((verdict, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: `flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${verdictStyles[verdict.status]}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "mt-0.5 h-5 shrink-0 border-current px-1.5 text-[10px] font-semibold uppercase",
									children: verdictLabel[verdict.status]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "leading-snug",
									children: verdict.message
								})]
							}, index))
						}) : null
					]
				})
			]
		})]
	});
}
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/**
* Server functions for the AI trend review over saved assay & potency runs.
* Reviewed results the analyst selects are summarised by the model: trends,
* unusual shifts and suggested follow-up checks — always for human review.
*/
/** Trends need a chronology: at least two reviewed runs. */
var MIN_RUNS = 2;
var MAX_RUNS = 20;
var generateInput = objectType({ ids: arrayType(stringType().uuid()).min(MIN_RUNS).max(MAX_RUNS) });
var deleteInput$1 = objectType({ id: stringType().uuid() });
var generateTrendReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => generateInput.parse(input)).handler(createSsrRpc("4a6a662f8a8260026c99d58d556301c54b561f796ed1f2a1f125d8e1b598a1a4"));
var listTrendReviews = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("3751ff1399ea96a718cdcbc4d6a5404ae18d7fd50e73152f6682c0a1fc667323"));
var deleteTrendReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => deleteInput$1.parse(input)).handler(createSsrRpc("5a8c7943bf582ce3700adf9fa8ae8393978a11ba46396586959087ed85686075"));
var TREND_LIMITS = {
	MIN_RUNS,
	MAX_RUNS
};
/**
* Server functions for the upload → extract → review → calculate workflow.
* Every function requires an authenticated session; RLS scopes rows to the
* caller's user_id.
*/
var analyzeInput = objectType({
	path: stringType().min(1),
	fileName: stringType().min(1).max(255),
	mimeType: stringType().max(190).optional()
});
var saveInput = objectType({
	id: stringType().uuid(),
	calculatorId: stringType().min(1),
	values: recordType(stringType(), stringType()),
	outputs: recordType(stringType(), unionType([
		numberType(),
		stringType(),
		nullType()
	])),
	verdicts: arrayType(objectType({
		status: enumType([
			"pass",
			"fail",
			"warn",
			"info"
		]),
		message: stringType()
	}))
});
var deleteInput = objectType({ id: stringType().uuid() });
var analyzeUpload = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => analyzeInput.parse(input)).handler(createSsrRpc("984f5df7a88930a89725dc816fc81ee67fdaa2bc6ab0fbca2e53f93b6fac29b6"));
var listAnalyses = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("e56797a5a12395b1b225188115b3b9de2cc18986f9caf41b48bd0281639eb719"));
var saveReviewedAnalysis = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => saveInput.parse(input)).handler(createSsrRpc("03bbd089d67c9b4420d326b00487041adfbedd43b97d803f2102c77333d79c36"));
var deleteAnalysis = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => deleteInput.parse(input)).handler(createSsrRpc("41435b2e381426ae03a4da2593ecc2ba58d3654c0d3b00b0c91e333d9d287ab4"));
/**
* AI trend review over reviewed assay & potency runs.
* The analyst selects saved runs; the model summarises the trend, flags
* unusual shifts and suggests follow-up checks — always for human review.
* Realtime synchronization keeps reviewed runs and trend reports updated live.
*/
var severityStyles = {
	normal: "border-success/40 bg-success/10 text-foreground",
	watch: "border-warning/50 bg-warning/15 text-warning-foreground",
	unusual: "border-destructive/40 bg-destructive/10 text-destructive"
};
var severityLabel = {
	normal: "Normal",
	watch: "Watch",
	unusual: "Unusual"
};
function TrendReviewPanel() {
	const queryClient = useQueryClient();
	const [selected, setSelected] = (0, import_react.useState)([]);
	const [active, setActive] = (0, import_react.useState)(null);
	const history = useQuery({
		queryKey: ["analyses"],
		queryFn: () => listAnalyses()
	});
	const reviews = useQuery({
		queryKey: ["trend-reviews"],
		queryFn: () => listTrendReviews()
	});
	const candidates = (history.data?.analyses ?? []).filter(isTrendEligible);
	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["trend-reviews"] });
	};
	(0, import_react.useEffect)(() => {
		const channel = supabase.channel("trend-reviews-realtime-feed").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "trend_reviews"
		}, () => {
			queryClient.invalidateQueries({ queryKey: ["trend-reviews"] });
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "analyses"
		}, () => {
			queryClient.invalidateQueries({ queryKey: ["analyses"] });
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [queryClient]);
	const generate = useMutation({
		mutationFn: (ids) => generateTrendReview({ data: { ids } }),
		onSuccess: (result) => {
			if (result.ok) {
				setActive(result.review);
				invalidate();
				toast.success("Trend review ready — please check it yourself before acting on it.");
			} else toast.error(result.error ?? "The trend review could not be generated.");
		},
		onError: () => toast.error("The trend review could not be generated. Please try again.")
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => deleteTrendReview({ data: { id } }),
		onSuccess: (result, id) => {
			if (result.ok) {
				setActive((current) => current?.id === id ? null : current);
				invalidate();
				toast.success("Trend review deleted.");
			} else toast.error(result.error ?? "Could not delete this trend review.");
		},
		onError: () => toast.error("Could not delete this trend review.")
	});
	function toggle(id) {
		setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
	}
	function generateReport() {
		generate.mutate(selected);
	}
	if (history.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col gap-4 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-2xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-semibold text-foreground",
								children: "Select reviewed assay & potency runs"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: [
									"Pick ",
									TREND_LIMITS.MIN_RUNS,
									"–",
									TREND_LIMITS.MAX_RUNS,
									" reviewed runs in chronological order. Dilution & preparation runs and unreviewed extractions are never included."
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "shrink-0 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "mr-1 h-3 w-3 animate-pulse" }), " Real-time active"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "shrink-0 border-primary/30 text-primary",
								children: [
									selected.length,
									"/",
									TREND_LIMITS.MAX_RUNS,
									" selected"
								]
							})]
						})]
					}),
					candidates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground",
						children: "No eligible runs yet. Review and save at least two assay & potency runs in the “Upload & analyse” tab, then come back here."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-2 sm:grid-cols-2",
						children: candidates.map((entry) => {
							const def = CALCULATORS.find((calc) => calc.id === entry.calculatorId);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								htmlFor: `run-${entry.id}`,
								className: "flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-secondary/40 p-3 transition-colors hover:bg-secondary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									id: `run-${entry.id}`,
									className: "mt-0.5",
									checked: selected.includes(entry.id),
									onCheckedChange: () => toggle(entry.id),
									disabled: !selected.includes(entry.id) && selected.length >= TREND_LIMITS.MAX_RUNS
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-sm font-medium text-foreground",
										children: entry.fileName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block text-xs text-muted-foreground",
										children: [
											def?.title ?? entry.calculatorId,
											" ·",
											" ",
											new Date(entry.createdAt).toLocaleDateString(void 0, {
												day: "numeric",
												month: "short",
												year: "numeric"
											})
										]
									})]
								})]
							}) }, entry.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: generateReport,
							disabled: selected.length < TREND_LIMITS.MIN_RUNS || generate.isPending,
							children: [generate.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "mr-2 h-4 w-4" }), generate.isPending ? "Reviewing trends…" : "Generate trend review"]
						}), selected.length > 0 && selected.length < TREND_LIMITS.MIN_RUNS ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [
								"Select at least ",
								TREND_LIMITS.MIN_RUNS,
								" runs for a trend."
							]
						}) : null]
					})
				]
			}) }),
			active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "overflow-hidden pt-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "brand-gradient h-1.5 w-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex flex-col gap-5 p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "mt-1 h-5 w-5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-semibold text-foreground",
								children: "Trend summary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-muted-foreground",
								children: active.report.summary
							})] })]
						}),
						active.report.flags.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "flex flex-col gap-2",
							children: active.report.flags.map((flag, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: `flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${severityStyles[flag.severity]}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "mt-0.5 h-5 shrink-0 border-current px-1.5 text-[10px] font-semibold uppercase",
									children: [flag.severity === "unusual" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mr-0.5 h-3 w-3" }) : null, severityLabel[flag.severity]]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "leading-snug",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: flag.metric
										}),
										" — ",
										flag.detail
									]
								})]
							}, index))
						}) : null,
						active.report.followUps.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs font-semibold tracking-wider text-muted-foreground uppercase",
							children: "Suggested follow-up checks"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 flex flex-col gap-2",
							children: active.report.followUps.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: item.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block leading-snug text-muted-foreground",
									children: item.detail
								})]
							}, index))
						})] }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs leading-snug text-muted-foreground",
							children: [
								"Generated ",
								new Date(active.createdAt).toLocaleString(void 0, {
									day: "numeric",
									month: "short",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit"
								}),
								" ",
								"· This summary is decision support only — verify every point against the raw data before acting on it."
							]
						})
					]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold text-foreground",
						children: "Past trend reviews"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative flex h-2 w-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-emerald-500" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium text-emerald-600 dark:text-emerald-400",
							children: "Real-time sync active"
						})]
					})]
				}), reviews.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center py-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" })
				}) : (reviews.data?.reviews.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground",
					children: "No trend reviews yet — generated summaries will be kept here and synced in real time."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-3 md:grid-cols-2",
					children: reviews.data?.reviews.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex flex-col gap-2 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed text-muted-foreground",
								children: entry.report.summary.length > 160 ? `${entry.report.summary.slice(0, 160)}…` : entry.report.summary
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								className: "h-8 w-8 shrink-0 p-0 text-muted-foreground hover:text-destructive",
								"aria-label": "Delete trend review",
								onClick: () => deleteMutation.mutate(entry.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								new Date(entry.createdAt).toLocaleDateString(void 0, {
									day: "numeric",
									month: "short",
									year: "numeric"
								}),
								" · ",
								entry.analysisIds.length,
								" runs ·",
								" ",
								entry.report.flags.filter((flag) => flag.severity === "unusual").length,
								" unusual"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "font-medium text-primary hover:underline",
								onClick: () => {
									setActive(entry);
									document.getElementById("trend-report-anchor")?.scrollIntoView({
										behavior: "smooth",
										block: "start"
									});
								},
								children: "Open"
							})]
						})]
					}) }) }, entry.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				id: "trend-report-anchor",
				className: "sr-only scroll-mt-24"
			})
		]
	});
}
var Table = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "relative w-full overflow-auto",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
		ref,
		className: cn("w-full caption-bottom text-sm", className),
		...props
	})
}));
Table.displayName = "Table";
var TableHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
	ref,
	className: cn("[&_tr]:border-b", className),
	...props
}));
TableHeader.displayName = "TableHeader";
var TableBody = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
	ref,
	className: cn("[&_tr:last-child]:border-0", className),
	...props
}));
TableBody.displayName = "TableBody";
var TableFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", {
	ref,
	className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
	...props
}));
TableFooter.displayName = "TableFooter";
var TableRow = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
	ref,
	className: cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
	...props
}));
TableRow.displayName = "TableRow";
var TableHead = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
	ref,
	className: cn("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableHead.displayName = "TableHead";
var TableCell = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
	ref,
	className: cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableCell.displayName = "TableCell";
var TableCaption = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
	ref,
	className: cn("mt-4 text-sm text-muted-foreground", className),
	...props
}));
TableCaption.displayName = "TableCaption";
var ACCEPTED_UPLOAD = ".pdf,.xlsx,.xls,.xlsm,.csv,.txt,.json,.md,.zip,.png,.jpg,.jpeg,.webp,.gif";
var ANALYSIS_BUCKET = "analysis-documents";
/**
* Upload → AI extract → human review → calculate → save workflow.
* The analyst uploads any supported document (PDF, Excel, CSV, TXT, JSON,
* ZIP or an image); matching calculators are proposed with extracted
* values, and results are calculated in real time as the analyst reviews the values.
* Realtime sync keeps history updated across all open analyst tabs.
*/
/** Fill the calculator's fields from a suggestion, keeping only valid values. */
function prepareValues(def, provided) {
	const v = {};
	for (const field of def.fields) {
		const raw = provided[field.key];
		if (field.type === "select") {
			const options = (field.options ?? []).map((option) => option.value);
			v[field.key] = raw && options.includes(raw) ? raw : field.defaultValue ?? options[0] ?? "";
		} else v[field.key] = typeof raw === "string" && raw.trim() !== "" ? raw : field.defaultValue ?? "";
	}
	return v;
}
function confidenceLabel(confidence) {
	if (confidence >= .8) return "High match";
	if (confidence >= .5) return "Likely match";
	return "Possible match";
}
function UploadAnalyzer() {
	const { user } = useAuthSession();
	const queryClient = useQueryClient();
	const fileInputRef = (0, import_react.useRef)(null);
	const [file, setFile] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [stepMessage, setStepMessage] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [analysis, setAnalysis] = (0, import_react.useState)(null);
	const [review, setReview] = (0, import_react.useState)(null);
	const [cardResult, setCardResult] = (0, import_react.useState)(null);
	const history = useQuery({
		queryKey: ["analyses"],
		queryFn: () => listAnalyses()
	});
	const invalidateHistory = () => {
		queryClient.invalidateQueries({ queryKey: ["analyses"] });
	};
	(0, import_react.useEffect)(() => {
		const channel = supabase.channel("analyses-realtime-feed").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "analyses"
		}, () => {
			queryClient.invalidateQueries({ queryKey: ["analyses"] });
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [queryClient]);
	function pickFile(next) {
		setError(null);
		setAnalysis(null);
		setReview(null);
		setCardResult(null);
		setStepMessage(null);
		if (next && next.size > 26214400) {
			setError("That file is larger than 25 MB — please upload a smaller file.");
			return;
		}
		setFile(next);
	}
	async function handleUpload() {
		if (!file || !user) return;
		setBusy(true);
		setError(null);
		setStepMessage("Uploading document to secure storage…");
		try {
			const path = `${user.id}/${crypto.randomUUID()}-${file.name}`;
			const { error: uploadError } = await supabase.storage.from(ANALYSIS_BUCKET).upload(path, file);
			if (uploadError) {
				setError("The file could not be uploaded. Please try again.");
				return;
			}
			setStepMessage("Parsing document & extracting laboratory parameters…");
			const result = await analyzeUpload({ data: {
				path,
				fileName: file.name,
				mimeType: file.type
			} });
			if (!result.ok) {
				setError(result.error);
				supabase.storage.from(ANALYSIS_BUCKET).remove([path]);
				return;
			}
			setAnalysis(result.analysis);
			toast.success("Extraction ready — review the values before calculating.");
			invalidateHistory();
		} finally {
			setBusy(false);
			setStepMessage(null);
		}
	}
	function openReview(entry, suggestion) {
		const calculatorId = suggestion?.calculatorId ?? entry.calculatorId;
		const def = CALCULATORS.find((calc) => calc.id === calculatorId);
		if (!def) return;
		const provided = suggestion ? suggestion.values : entry.values ?? {};
		setReview({
			analysisId: entry.id,
			calculatorId: def.id,
			baseValues: prepareValues(def, provided)
		});
		setCardResult(null);
		setAnalysis(entry);
		document.getElementById("review-anchor")?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}
	const saveMutation = useMutation({
		mutationFn: async () => {
			if (!review || !cardResult) throw new Error("Nothing to save yet.");
			return saveReviewedAnalysis({ data: {
				id: review.analysisId,
				calculatorId: review.calculatorId,
				values: cardResult.values,
				outputs: cardResult.outputs,
				verdicts: cardResult.verdicts
			} });
		},
		onSuccess: (result) => {
			if (result.ok) {
				toast.success("Saved to your history.");
				setAnalysis(null);
				setReview(null);
				setCardResult(null);
				setFile(null);
				if (fileInputRef.current) fileInputRef.current.value = "";
				invalidateHistory();
			} else toast.error(result.error ?? "Could not save to your history.");
		},
		onError: () => toast.error("Could not save to your history.")
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => deleteAnalysis({ data: { id } }),
		onSuccess: (result) => {
			if (result.ok) {
				toast.success("Removed from your history.");
				invalidateHistory();
			} else toast.error(result.error ?? "Could not delete this entry.");
		},
		onError: () => toast.error("Could not delete this entry.")
	});
	const reviewDef = review ? CALCULATORS.find((calc) => calc.id === review.calculatorId) : null;
	const hasOutputs = Boolean(cardResult && Object.keys(cardResult.outputs).length > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col gap-4 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-semibold text-foreground",
							children: "Upload a document"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Certificates of analysis, chromatography reports, weighing records, spreadsheets or archives. PDF, Excel, CSV, TXT, JSON, ZIP and images up to 25 MB."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "shrink-0 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "mr-1 h-3 w-3 animate-pulse" }), " Real-time active"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "shrink-0 border-primary/30 text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-1 h-3 w-3" }), " QC Extraction"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							ref: fileInputRef,
							type: "file",
							accept: ACCEPTED_UPLOAD,
							className: "max-w-sm cursor-pointer",
							onChange: (event) => pickFile(event.target.files?.[0] ?? null)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: handleUpload,
							disabled: !file || busy,
							children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-2 h-4 w-4" }), busy ? "Analyzing document…" : "Upload & analyse"]
						})]
					}),
					stepMessage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: stepMessage })]
					}) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
						children: error
					}) : null
				]
			}) }),
			analysis ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "review-anchor",
				className: "flex scroll-mt-24 flex-col gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mt-0.5 h-5 w-5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-lg font-semibold text-foreground",
							children: [
								"What was found in “",
								analysis.fileName,
								"”"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm leading-relaxed text-muted-foreground",
							children: analysis.summary
						})] })]
					})
				}) }), analysis.suggestions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4",
					children: analysis.suggestions.map((suggestion, index) => {
						const def = CALCULATORS.find((calc) => calc.id === suggestion.calculatorId);
						if (!def) return null;
						const missing = def.fields.filter((field) => !(field.key in suggestion.values)).map((field) => field.label);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "flex flex-col gap-3 p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-base font-semibold text-foreground",
											children: def.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: def.summary
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex shrink-0 items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "border-primary/30 text-primary",
											children: confidenceLabel(suggestion.confidence)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											onClick: () => openReview(analysis, suggestion),
											children: "Review & calculate"
										})]
									})]
								}),
								Object.keys(suggestion.values).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "flex flex-wrap gap-x-6 gap-y-1 text-sm",
									children: Object.entries(suggestion.values).map(([key, value]) => {
										const field = def.fields.find((f) => f.key === key);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "text-muted-foreground",
											children: [
												field?.label ?? key,
												":",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-medium text-foreground",
													children: [value, field?.unit ? ` ${field.unit}` : ""]
												})
											]
										}, key);
									})
								}) : null,
								missing.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs leading-snug text-muted-foreground",
									children: [
										"Not found in the document (you can fill these in during review):",
										" ",
										missing.join(", "),
										"."
									]
								}) : null,
								suggestion.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs italic leading-snug text-muted-foreground",
									children: suggestion.notes
								}) : null
							]
						}) }, `${suggestion.calculatorId}-${index}`);
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground",
					children: "No calculator matched this document. If it should match one, check that the values are readable and try again, or enter them manually in the calculator tabs."
				})]
			}) : null,
			review && reviewDef ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold tracking-wider text-muted-foreground uppercase",
							children: "Review the extracted values"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Correct anything the extraction got wrong — results are calculated live as you type."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: review.calculatorId,
							onValueChange: (value) => {
								const def = CALCULATORS.find((calc) => calc.id === value);
								if (def && analysis) openReview(analysis, {
									calculatorId: def.id,
									confidence: 1,
									values: {},
									notes: ""
								});
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-64",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Calculator" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CALCULATORS.map((calc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: calc.id,
								children: calc.title
							}, calc.id)) })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => saveMutation.mutate(),
							disabled: !hasOutputs || saveMutation.isPending,
							children: [saveMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Save to history"]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalculatorCard, {
					def: reviewDef,
					initialValues: review.baseValues,
					onChange: setCardResult
				}, `${review.analysisId}-${review.calculatorId}`)]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold text-foreground",
						children: "Your history"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative flex h-2 w-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-emerald-500" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium text-emerald-600 dark:text-emerald-400",
							children: "Real-time sync active"
						})]
					})]
				}), history.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center py-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" })
				}) : (history.data?.analyses.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground",
					children: "Nothing saved yet — uploaded documents and reviewed runs will appear here automatically."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-xl border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Document" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Calculator" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Saved" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Actions"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: history.data?.analyses.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "max-w-48 truncate font-medium",
							title: entry.fileName,
							children: entry.fileName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-muted-foreground",
							children: CALCULATORS.find((calc) => calc.id === entry.calculatorId)?.title ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: entry.status === "reviewed" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "border-border text-muted-foreground",
							children: entry.status === "reviewed" ? "Reviewed" : "Extracted"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "whitespace-nowrap text-muted-foreground",
							children: new Date(entry.createdAt).toLocaleDateString(void 0, {
								day: "numeric",
								month: "short",
								year: "numeric"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-1",
								children: [(entry.suggestions.length > 0 || entry.status === "reviewed" && entry.values) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									className: "h-8 text-xs",
									onClick: () => openReview(entry, entry.suggestions[0] ?? null),
									children: "Review"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									className: "h-8 w-8 p-0 text-muted-foreground hover:text-destructive",
									"aria-label": `Delete ${entry.fileName}`,
									onClick: () => deleteMutation.mutate(entry.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})]
							})
						})
					] }, entry.id)) })] })
				})]
			})
		]
	});
}
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
var TABS = [
	{
		value: "assay-potency",
		icon: FlaskConical,
		label: CATEGORY_META["assay-potency"].label
	},
	{
		value: "dilution-preparation",
		icon: Scale,
		label: CATEGORY_META["dilution-preparation"].label
	},
	{
		value: "upload",
		icon: Upload,
		label: "Upload & analyse"
	},
	{
		value: "trend",
		icon: TrendingUp,
		label: "Trend review"
	}
];
function ToolsPage() {
	const { workflow } = Route.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-6xl px-4 py-12 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
				children: "Lab calculator"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-lg leading-relaxed text-muted-foreground",
				children: "Every formula runs live from a single, extensible registry — add a new method and the tool picks it up. Results are checked against the IPC acceptance limits as you type, and everything you save stays in your private history."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: workflow,
			className: "mt-8 gap-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
					className: "h-auto w-full flex-wrap justify-start gap-1 bg-secondary/60 p-1.5",
					children: TABS.map((tab) => {
						const Icon = tab.icon;
						const count = tab.value === "assay-potency" || tab.value === "dilution-preparation" ? calculatorsByCategory(tab.value).length : null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: tab.value,
							className: "flex items-center gap-2 px-4 py-2 text-sm data-[state=active]:bg-card data-[state=active]:text-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }),
								tab.label,
								count ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-primary/10 px-1.5 text-xs font-semibold text-primary",
									children: count
								}) : null
							]
						}, tab.value);
					})
				}),
				["assay-potency", "dilution-preparation"].map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: category,
					className: "mt-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-5 max-w-2xl text-sm leading-relaxed text-muted-foreground",
						children: CATEGORY_META[category].blurb
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-6 xl:grid-cols-2",
						children: calculatorsByCategory(category).map((def) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalculatorCard, { def }, def.id))
					})]
				}, category)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "upload",
					className: "mt-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UploadAnalyzer, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "trend",
					className: "mt-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendReviewPanel, {})
				})
			]
		})]
	});
}
//#endregion
export { ToolsPage as component };
