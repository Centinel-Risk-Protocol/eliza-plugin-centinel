import { z } from "zod";

export const RiskReportSchema = z.object({
    score: z.number().min(0).max(100),
    status: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    tacticalTriggerPrice: z.string().optional(),
    lastAudit: z.string(),
    recommendation: z.string()

    export interface CentinelData {
    score_st: string;
    color_st: string;
    action_required: string;
    action_suggested: string;
    trigger_price?: string;
    liquidation_price: string;
    compliance_note: string;
}
});

export type RiskReport = z.infer<typeof RiskReportSchema>;
