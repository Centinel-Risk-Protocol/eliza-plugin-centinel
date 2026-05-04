import { Action, IAgentRuntime, Memory, State, HandlerCallback, elizaLogger } from "@ai16z/eliza";

export const getBrainAuditAction: Action = {
    name: "GET_BRAIN_AUDIT",
    similes: ["BRAIN_SCAN", "STRESS_TEST", "FULL_AUDIT", "GET_TRIGGER_PRICE"],
    description: "Deep solvency analysis. Requires sk_live or $8 verification.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        return /0x[a-fA-F0-9]{40}/.test(message.content.text);
    },
    handler: async (runtime: IAgentRuntime, message: Memory, state?: State, _options?: any, callback?: HandlerCallback): Promise<boolean> => {
        const text = message.content.text;
        const wallet = text.match(/0x[a-fA-F0-9]{40}/)?.[0];
        const hash = text.match(/0x[a-fA-F0-9]{64}/)?.[0];
        const apiKey = runtime.getSetting("CENTINEL_API_KEY") || "sk_trial_base_free_2026";

        // Si es Trial y no hay Hash, avisamos que Brain requiere Upgrade
        if (apiKey.startsWith("sk_trial") && !hash) {
            if (callback) {
                callback({
                    text: `🧠 **CENTINEL BRAIN:** Deep audit requires an upgrade. 
                    \n1. Register at dev.centinelrisk.tech for an **sk_live** key.
                    \n2. Or pay $8 to \`0xTuWallet\` and provide the hash for a one-time report.`,
                    content: { status: "UPGRADE_REQUIRED" }
                });
            }
            return true;
        }

        try {
            const response = await fetch(`${runtime.getSetting("CENTINEL_WEBHOOK_URL")}/crp2026`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({ wallet, tx_hash: hash, type: 'brain' })
            });

            const result = await response.json();
            const payload = result.plugin_report[0];

            const finalResponse = `${payload.eliza_report}\n\n🏛️ **Bloomberg Terminal Audit:** ${payload.access_url}`;

            if (callback) {
                callback({ text: finalResponse, content: payload.full_data });
            }
            return true;
        } catch (error) {
            elizaLogger.error("Centinel Brain Error:", error);
            return false;
        }
    },
    examples: [[
        { user: "{{user1}}", content: { text: "Run a deep brain audit on 0x8ea6..." } },
        { user: "{{agentName}}", content: { text: "Deep risk analysis requires sk_live. Checking trial limits...", action: "GET_BRAIN_AUDIT" } }
    ]]
};
