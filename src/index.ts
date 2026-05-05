import { Plugin } from "@ai16z/eliza";
import { getPulseReportAction } from "./actions/getPulseReport";
import { getBrainAuditAction } from "./actions/getBrainAudit";
import { riskEvaluator } from "./evaluators/riskEvaluator";

export const centinelPlugin: Plugin = {
    name: "centinel-risk-protocol",
    description: "Centinel Risk Intelligence & Solvency Layer for Base Network.",
    actions: [
        getPulseReportAction, 
        getBrainAuditAction
    ],
    evaluators: [
        riskEvaluator
    ],
    providers: []
};

export default centinelPlugin;
