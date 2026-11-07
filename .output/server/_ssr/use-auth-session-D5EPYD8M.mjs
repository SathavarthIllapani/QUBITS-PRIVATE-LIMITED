import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as supabase } from "./client-BmWsGYN7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-auth-session-D5EPYD8M.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* Session-aware user state for header/UI use. Only identity transitions
* (SIGNED_IN / SIGNED_OUT / USER_UPDATED) are observed — the router-level
* subscription in __root.tsx owns cache invalidation.
*/
function useAuthSession() {
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let active = true;
		supabase.auth.getUser().then(({ data }) => {
			if (!active) return;
			setUser(data.user ?? null);
			setLoading(false);
		}).catch(() => {
			if (!active) return;
			setUser(null);
			setLoading(false);
		});
		const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			setUser(session?.user ?? null);
			setLoading(false);
		});
		return () => {
			active = false;
			subscription.subscription.unsubscribe();
		};
	}, []);
	return {
		user,
		loading
	};
}
//#endregion
export { useAuthSession as t };
