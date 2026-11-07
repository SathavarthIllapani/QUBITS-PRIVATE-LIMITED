globalThis.__nitro_main__ = import.meta.url;
import { i as serve, r as NodeResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
import { a as toEventHandler, i as defineLazyEventHandler, n as HTTPError, r as defineHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"11f3-pMkDswXhvsSS9uL+cI0rfwNRIH0\"",
		"mtime": "2026-11-07T06:43:16.816Z",
		"size": 4595,
		"path": "../public/favicon.png"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-11-07T06:43:16.817Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/auth-DGwSmaCd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11bc-+Pd1/LLPSR0Pwl097MYYWG40laI\"",
		"mtime": "2026-11-07T06:43:16.641Z",
		"size": 4540,
		"path": "../public/assets/auth-DGwSmaCd.js"
	},
	"/assets/badge-CqlsiSgS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"737-nYO9g/FZ2NtSc6LuxYLb9RHppwM\"",
		"mtime": "2026-11-07T06:43:16.641Z",
		"size": 1847,
		"path": "../public/assets/badge-CqlsiSgS.js"
	},
	"/qubits-logo.png": {
		"type": "image/png",
		"etag": "\"7d057-CQAPL7vDvdvWOKzb2EyjdKmaSWY\"",
		"mtime": "2026-11-07T06:43:16.816Z",
		"size": 512087,
		"path": "../public/qubits-logo.png"
	},
	"/assets/card-Cu5oLXA1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"40d-E5PamLIND6Okwmqcei1UrljF2D8\"",
		"mtime": "2026-11-07T06:43:16.641Z",
		"size": 1037,
		"path": "../public/assets/card-Cu5oLXA1.js"
	},
	"/assets/client-DJTq9SSi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"35ecb-BOnFipqCsinWeTUyq52xU4Cx2tk\"",
		"mtime": "2026-11-07T06:43:16.641Z",
		"size": 220875,
		"path": "../public/assets/client-DJTq9SSi.js"
	},
	"/assets/label-DHSK_Qlo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"713-CMYRQuLN41xq6gH3argSTNxpFiI\"",
		"mtime": "2026-11-07T06:43:16.641Z",
		"size": 1811,
		"path": "../public/assets/label-DHSK_Qlo.js"
	},
	"/assets/button-G4KZWZkO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"814c-L0vsGD19aLgmgz493uz6x2g5P2Y\"",
		"mtime": "2026-11-07T06:43:16.641Z",
		"size": 33100,
		"path": "../public/assets/button-G4KZWZkO.js"
	},
	"/assets/link-DmIVlRKu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"241d-X6lZUo5i8JT8YYyA3vzybXx1pcY\"",
		"mtime": "2026-11-07T06:43:16.641Z",
		"size": 9245,
		"path": "../public/assets/link-DmIVlRKu.js"
	},
	"/assets/matchContext-BsQrCWl_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ca-CTOwsLK8lNfhP9+J86j6zTg9JSE\"",
		"mtime": "2026-11-07T06:43:16.641Z",
		"size": 202,
		"path": "../public/assets/matchContext-BsQrCWl_.js"
	},
	"/assets/reset-password-BDnbtsc0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"abc-T7m1iKtibZ/0Aqk2+bhOiuO3hnM\"",
		"mtime": "2026-11-07T06:43:16.642Z",
		"size": 2748,
		"path": "../public/assets/reset-password-BDnbtsc0.js"
	},
	"/assets/route-Dqdsks6Z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8b-RB8ZOVD9YujWy91aHRXUpkmoHk4\"",
		"mtime": "2026-11-07T06:43:16.642Z",
		"size": 139,
		"path": "../public/assets/route-Dqdsks6Z.js"
	},
	"/assets/tools-DW_X0j37.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25ee0-gDiRI0/qomTziiAfkY7R01Paghc\"",
		"mtime": "2026-11-07T06:43:16.642Z",
		"size": 155360,
		"path": "../public/assets/tools-DW_X0j37.js"
	},
	"/assets/index-D--I05iV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"40f4e-6wlcpdWP6onvZkqncs87Zf6hp04\"",
		"mtime": "2026-11-07T06:43:16.641Z",
		"size": 266062,
		"path": "../public/assets/index-D--I05iV.js"
	},
	"/assets/use-auth-session-ChlzO3Y5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"209-r9rEa9J0hFPj9JFiDNn4Byzlic8\"",
		"mtime": "2026-11-07T06:43:16.642Z",
		"size": 521,
		"path": "../public/assets/use-auth-session-ChlzO3Y5.js"
	},
	"/assets/tools-bAejdkjo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16697-odPS/7pw6Hu31kQJ6O5vvAUJe5I\"",
		"mtime": "2026-11-07T06:43:16.642Z",
		"size": 91799,
		"path": "../public/assets/tools-bAejdkjo.js"
	},
	"/assets/useSelector-wdOmz881.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"832-ofXjKmPCRrR0TM+KmAc7MKZ51A8\"",
		"mtime": "2026-11-07T06:43:16.642Z",
		"size": 2098,
		"path": "../public/assets/useSelector-wdOmz881.js"
	},
	"/assets/useRouter-Dpb7RwMI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2144-OAWOWZt+i/sSs5fMTIk74KvSiew\"",
		"mtime": "2026-11-07T06:43:16.642Z",
		"size": 8516,
		"path": "../public/assets/useRouter-Dpb7RwMI.js"
	},
	"/assets/styles-Bh4d2z12.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"14a41-d203PiGUr/5wf6W/wH3aLIMA25U\"",
		"mtime": "2026-11-07T06:43:16.642Z",
		"size": 84545,
		"path": "../public/assets/styles-Bh4d2z12.css"
	},
	"/assets/routes-oRz35ZEE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4e78-dRU9EyNh7zBbignLVjkA2YjTKS4\"",
		"mtime": "2026-11-07T06:43:16.642Z",
		"size": 20088,
		"path": "../public/assets/routes-oRz35ZEE.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_h5sFar = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_h5sFar
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
