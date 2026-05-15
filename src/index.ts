// @ts-nocheck
import { Plugin } from "@ai16z/eliza";
import { getPulseReportAction } from "./actions/getPulseReport.js";
import { getBrainAuditAction } from "./actions/getBrainAudit.js";
import { centinelRiskProvider } from "./providers/centinelRiskProvider.js";
import { stateFixerProvider } from "./providers/stateFixer.js";
import { riskEvaluator } from "./evaluators/riskEvaluator.js"; // Nuevo import
import { CentinelService } from "./services/centinel.js";

export const centinelPlugin: Plugin = {
    name: "centinel-risk-protocol",
    description: "Centinel Executor: Solvency auditing and risk prevention tool.",
    actions: [
        getPulseReportAction, 
        getBrainAuditAction
    ],
    evaluators: [
        riskEvaluator
    ],
    providers: [
        centinelRiskProvider,
        stateFixerProvider 
    ],
    services: [
        new CentinelService()
    ],
};
