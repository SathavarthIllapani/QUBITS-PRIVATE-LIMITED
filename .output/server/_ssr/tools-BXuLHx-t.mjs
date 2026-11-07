import { _ as createFileRoute, g as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools-BXuLHx-t.js
var $$splitComponentImporter = () => import("./tools-D1DtQo9K.mjs");
var TOOL_WORKFLOWS = [
	"assay-potency",
	"dilution-preparation",
	"upload",
	"trend"
];
function validateWorkflow(value) {
	return TOOL_WORKFLOWS.find((workflow) => workflow === value) ?? "assay-potency";
}
var Route = createFileRoute("/_authenticated/tools")({
	validateSearch: (search) => ({ workflow: validateWorkflow(search["workflow"]) }),
	head: () => ({ meta: [
		{ title: "Lab Calculator & Trend Review | Assay, Potency, Dilution | Qubits Private Limited" },
		{
			name: "description",
			content: "Upload certificates and reports, review AI-extracted values, calculate against IPC limits and review trends across your saved assay & potency runs."
		},
		{
			property: "og:title",
			content: "Lab Calculator & Trend Review | Qubits Private Limited"
		},
		{
			property: "og:description",
			content: "Assay & potency and dilution & preparation calculators with document upload, saved runs and AI trend review."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
