import { z } from "zod";

// Para validar la respuesta de tu n8n
export const CentinelDataSchema = z.object({
    wallet: z.string(),
    risk_engine: z.object({
        score_st: z.string(),
        color_st: z.string(),
    }),
    data: z.object({
        health_factor: z.string(),
    }),
    execution: z.object({
        liquidation_price: z.string(),
    }),
    pulse: z.object({
        action_required: z.string(),
        Action: z.string(),
        Compliance_note: z.string(),
    })
});

export type CentinelData = z.infer<typeof CentinelDataSchema>;
