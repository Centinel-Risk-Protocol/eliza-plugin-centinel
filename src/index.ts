import { Plugin } from "@ai16z/eliza";
import { getPulseReportAction } from "./actions/getPulseReport";
import { getBrainAuditAction } from "./actions/getBrainAudit";

export const centinelPlugin: Plugin = {
    name: "centinel-risk-protocol",
    description: "Risk Layer for Base",
    actions: [getPulseReportAction, getBrainAuditAction],
    providers: [],
    evaluators: [], // Añade aquí el riskEvaluator
};
