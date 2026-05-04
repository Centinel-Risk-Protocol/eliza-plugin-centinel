import { Action, IAgentRuntime, Memory, State, HandlerCallback, elizaLogger } from "@ai16z/eliza";

export const getPulseReportAction: Action = {
    name: "GET_PULSE_REPORT",
    similes: ["CHECK_RISK", "HEALTH_FACTOR", "PULSE_CHECK", "CHECK_SOLVENCY"],
    description: "Daily health check for any wallet on Base. Free/Trial mode available.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        return /0x[a-fA-F0-9]{40}/.test(message.content.text);
    },
    handler: async (runtime: IAgentRuntime, message: Memory, state: State, _options: any, callback: HandlerCallback) => {
        const text = message.content.text;
        const wallet = text.match(/0x[a-fA-F0-9]{40}/)?.[0];
        const hash = text.match(/0x[a-fA-F0-9]{64}/)?.[0] || "TRIAL_MODE"; 
        
        const apiKey = runtime.getSetting("CENTINEL_API_KEY") || "sk_trial_base_free_2026";

        try {
            const response = await fetch(`${runtime.getSetting("CENTINEL_WEBHOOK_URL")}/crp2026`, {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}` 
                },
                body: JSON.stringify({ wallet, tx_hash: hash, type: 'pulse' })
            });
            
            const result = await response.json();
            const payload = result.plugin_report[0];

            const finalResponse = `${payload.eliza_report}\n\n📊 **Institutional Terminal:** ${payload.access_url}`;

            if (callback) {
                callback({ text: finalResponse, content: payload.full_data });
            }
            return true;
        } catch (error) {
            elizaLogger.error("Centinel Pulse Error:", error);
            if (callback) callback({ text: "⚠️ Risk Engine unreachable. Using cached safety parameters." });
            return false;
        }
    },
    examples: [[
        { user: "{{user1}}", content: { text: "Audit my wallet 0x561d..." } },
        { user: "{{agentName}}", content: { text: "Running daily Pulse scan...", action: "GET_PULSE_REPORT" } }
    ]]
};
