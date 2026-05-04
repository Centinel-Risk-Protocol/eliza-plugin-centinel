import { Plugin } from "@ai16z/eliza";
import { getPulseReportAction } from "./actions/getPulseReport";
// Importar la de Brain también 

export const centinelPlugin: Plugin = {
    name: "centinel-risk-protocol",
    description: "Risk Intelligence & Solvency Layer for Eliza agents on Base Network",
    actions: [getPulseReportAction], // Añade aquí GET_BRAIN_AUDIT
    providers: [],
    evaluators: [], // Añade aquí el riskEvaluator
};
