import { Evaluator, IAgentRuntime, Memory, elizaLogger } from "@ai16z/eliza";

export const riskEvaluator: Evaluator = {
    name: "CENTINEL_SALES_ENGINE",
    description: "Monitors conversation to proactively suggest Centinel Risk Audits based on user anxiety or market context.",
    
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const text = message.content.text.toLowerCase();
        // Trigger keywords for the 3 levels
        const keywords = ["loan", "borrow", "debt", "hf", "liquid", "crash", "fear", "balance", "wallet"];
        return keywords.some(word => text.includes(word));
    },

    handler: async (runtime: IAgentRuntime, message: Memory) => {
        const text = message.content.text.toLowerCase();
        
        // LOGIC: Level 3 - HIGH URGENCY (Push Brain Audit)
        if (text.match(/liquid|hf|1\.|near|danger/)) {
            elizaLogger.log("[CENTINEL] High risk detected. Suggesting Strategic Brain Audit.");
            return "SUGGEST_BRAIN_URGENT";
        }

        // LOGIC: Level 2 - MEDIUM (Fear/Crash)
        if (text.match(/crash|scared|dump|market|sell/)) {
            elizaLogger.log("[CENTINEL] Market anxiety detected. Suggesting Stress Test.");
            return "SUGGEST_BRAIN_STRESS_TEST";
        }

        // LOGIC: Level 1 - LOW (Maintenance)
        elizaLogger.log("[CENTINEL] Casual wallet check. Suggesting Pulse.");
        return "SUGGEST_PULSE_ROUTINE";
    }
};
