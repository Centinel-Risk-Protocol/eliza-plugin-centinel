import { z } from "zod";

export const RiskReportSchema = z.object({
    score: z.number().min(0).max(100),
    status: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    tacticalTriggerPrice: z.string().optional(),
    lastAudit: z.string(),
    recommendation: z.string()
});

export type RiskReport = z.infer<typeof RiskReportSchema>;
