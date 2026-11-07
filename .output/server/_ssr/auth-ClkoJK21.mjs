import { i as __toESM } from "../_runtime.mjs";
import { t as qubits_logo_png_asset_default } from "./qubits-logo.png.asset-CoEPcc8o.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as company } from "./company-D2SG7UID.mjs";
import { t as supabase } from "./client-BmWsGYN7.mjs";
import { n as CardContent, t as Card } from "./card-DuklqRLf.mjs";
import { n as Label, t as Input } from "./label-CmIE8x5o.mjs";
import { t as useAuthSession } from "./use-auth-session-D5EPYD8M.mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as LoaderCircle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-ClkoJK21.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MODE_LABELS = {
	signin: "Sign in",
	signup: "Create account",
	forgot: "Forgot password"
};
function AuthPage() {
	const navigate = useNavigate();
	const { user, loading } = useAuthSession();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [notice, setNotice] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!loading && user) navigate({
			to: "/tools",
			search: { workflow: "assay-potency" }
		});
	}, [loading, user]);
	function friendlyError(error) {
		const message = error instanceof Error ? error.message : String(error ?? "");
		if (/invalid login credentials/i.test(message)) return "Email or password is incorrect.";
		if (/email not confirmed/i.test(message)) return "Please confirm your email first — check your inbox for the confirmation link.";
		if (/user already registered/i.test(message)) return "An account with this email already exists — try signing in instead.";
		if (/password should be at least/i.test(message)) return "Choose a password with at least 6 characters.";
		if (/rate limit/i.test(message)) return "Too many attempts — please wait a moment and try again.";
		return "That didn't work. Please check your details and try again.";
	}
	async function handleSubmit(event) {
		event.preventDefault();
		setBusy(true);
		setNotice(null);
		try {
			if (mode === "signin") {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
				await navigate({
					to: "/tools",
					search: { workflow: "assay-potency" }
				});
			} else if (mode === "signup") {
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
					options: { emailRedirectTo: window.location.origin }
				});
				if (error) throw error;
				if (data.session) await navigate({
					to: "/tools",
					search: { workflow: "assay-potency" }
				});
				else {
					setNotice("Account created. Check your email to confirm it, then sign in here.");
					setMode("signin");
				}
			} else {
				const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
				if (error) throw error;
				setNotice("If that email is registered, a password-reset link is on its way. Check your inbox.");
			}
		} catch (error) {
			setNotice(friendlyError(error));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "w-full max-w-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col items-center gap-6 p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: qubits_logo_png_asset_default.url,
						alt: `${company.name} logo`,
						className: "h-20 w-20 rounded-2xl border border-border/60 bg-card p-2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl font-bold tracking-tight text-foreground",
							children: MODE_LABELS[mode]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: mode === "forgot" ? "Enter your email and we'll send a reset link." : "Sign in to upload documents, save runs and follow trends."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex w-full flex-col gap-4",
						onSubmit: handleSubmit,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									autoComplete: "email",
									required: true,
									value: email,
									onChange: (event) => setEmail(event.target.value),
									placeholder: "analyst@company.com"
								})]
							}),
							mode !== "forgot" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "password",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "password",
									type: "password",
									autoComplete: mode === "signup" ? "new-password" : "current-password",
									required: true,
									minLength: 6,
									value: password,
									onChange: (event) => setPassword(event.target.value),
									placeholder: "••••••••"
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								className: "w-full",
								disabled: busy,
								children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : null, MODE_LABELS[mode]]
							})
						]
					}),
					notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-center text-sm leading-snug text-foreground",
						children: notice
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-full flex-col items-center gap-2 text-sm",
						children: [mode === "signin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-primary hover:underline",
							onClick: () => {
								setMode("forgot");
								setNotice(null);
							},
							children: "Forgot your password?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [
								"New here?",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-primary hover:underline",
									onClick: () => {
										setMode("signup");
										setNotice(null);
									},
									children: "Create an account"
								})
							]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-primary hover:underline",
							onClick: () => {
								setMode("signin");
								setNotice(null);
							},
							children: "Back to sign in"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "text-muted-foreground hover:text-foreground hover:underline",
							children: "Back to home"
						})]
					})
				]
			})
		})
	});
}
//#endregion
export { AuthPage as component };
