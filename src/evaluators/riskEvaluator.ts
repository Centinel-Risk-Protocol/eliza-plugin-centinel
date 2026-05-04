import { Evaluator, IAgentRuntime, Memory } from "@ai16z/eliza";

export const riskEvaluator: Evaluator = {
    name: "RISK_ADVISOR",
    description: "Analyze whether the conversation involves financial risks that require a Brain Audit.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const keywords = ["borrow", "lend", "debt", "leverage", "liquidated", "FUD"];
        return keywords.some(word => message.content.text.toLowerCase().includes(word));
    },
    handler: async (runtime: IAgentRuntime, message: Memory) => {
        return "SUGGEST_BRAIN_AUDIT";
    }
};
