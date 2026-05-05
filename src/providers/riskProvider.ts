import { IAgentRuntime, Memory, Provider, State, elizaLogger } from "@ai16z/eliza";

export const centinelRiskProvider: Provider = {
    get: async (runtime: IAgentRuntime, message: Memory, _state?: State) => {
        try {
            const apiKey = runtime.getSetting("CENTINEL_API_KEY");
            if (!apiKey) return null;

            return `[PROTOCOL_CONTEXT: Centinel Risk is ACTIVE on Base Network. 
            Current Mode: Institutional Monitoring. 
            Requirement: Brain Audits require sk_live or $8 hash.]`;
        } catch (error) {
            elizaLogger.error("Error en Centinel Provider:", error);
            return null;
        }
    },
};
