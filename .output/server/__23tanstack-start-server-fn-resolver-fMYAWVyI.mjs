//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-fMYAWVyI.js
var manifest = {
	"03bbd089d67c9b4420d326b00487041adfbedd43b97d803f2102c77333d79c36": {
		functionName: "saveReviewedAnalysis_createServerFn_handler",
		importer: () => import("./_ssr/functions-BMoqkB_O.mjs")
	},
	"3751ff1399ea96a718cdcbc4d6a5404ae18d7fd50e73152f6682c0a1fc667323": {
		functionName: "listTrendReviews_createServerFn_handler",
		importer: () => import("./_ssr/trend.functions-CUhVjM5U.mjs")
	},
	"41435b2e381426ae03a4da2593ecc2ba58d3654c0d3b00b0c91e333d9d287ab4": {
		functionName: "deleteAnalysis_createServerFn_handler",
		importer: () => import("./_ssr/functions-BMoqkB_O.mjs")
	},
	"4a6a662f8a8260026c99d58d556301c54b561f796ed1f2a1f125d8e1b598a1a4": {
		functionName: "generateTrendReview_createServerFn_handler",
		importer: () => import("./_ssr/trend.functions-CUhVjM5U.mjs")
	},
	"5a8c7943bf582ce3700adf9fa8ae8393978a11ba46396586959087ed85686075": {
		functionName: "deleteTrendReview_createServerFn_handler",
		importer: () => import("./_ssr/trend.functions-CUhVjM5U.mjs")
	},
	"984f5df7a88930a89725dc816fc81ee67fdaa2bc6ab0fbca2e53f93b6fac29b6": {
		functionName: "analyzeUpload_createServerFn_handler",
		importer: () => import("./_ssr/functions-BMoqkB_O.mjs")
	},
	"e56797a5a12395b1b225188115b3b9de2cc18986f9caf41b48bd0281639eb719": {
		functionName: "listAnalyses_createServerFn_handler",
		importer: () => import("./_ssr/functions-BMoqkB_O.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ??= await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
