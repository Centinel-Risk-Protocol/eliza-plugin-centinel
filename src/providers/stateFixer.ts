import { IAgentRuntime, Memory, Provider, State } from "@ai16z/eliza";

export const stateFixerProvider: Provider = {
    get: async (runtime: IAgentRuntime, message: Memory, state?: State): Promise<string> => {
        if (!state) return "";

        state.actions = typeof state.actions === 'string' ? state.actions : "";
        state.providers = typeof state.providers === 'string' ? state.providers : "";
        state.evaluators = typeof state.evaluators === 'string' ? state.evaluators : "";


        if (!state.recentMessages) {
            state.recentMessages = ""; 
        }
        
        if (!state.recentMessagesData) {
            (state as any).recentMessagesData = [];
        }

        if (state.action === "JOIN_VOICE" || state.action === "LEAVE_VOICE") {
            state.action = "NONE";
        }

        return ""; 
    }
};
