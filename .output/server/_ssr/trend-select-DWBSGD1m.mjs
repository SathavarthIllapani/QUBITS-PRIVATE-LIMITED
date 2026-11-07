import { t as CALCULATORS } from "./registry-CdpUgCOQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trend-select-DWBSGD1m.js
function isTrendEligible(entry) {
	if (entry.status !== "reviewed") return false;
	const def = CALCULATORS.find((calc) => calc.id === entry.calculatorId);
	if (!def || def.category !== "assay-potency") return false;
	if (!entry.values || !entry.outputs) return false;
	return Object.keys(entry.outputs).length > 0;
}
//#endregion
export { isTrendEligible as t };
