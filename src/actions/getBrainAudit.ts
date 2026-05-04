import { Action, IAgentRuntime, Memory, State, HandlerCallback, elizaLogger } from "@ai16z/eliza";

export const getBrainAuditAction: Action = {
    name: "GET_BRAIN_AUDIT",
    similes: ["BRAIN_SCAN", "STRESS_TEST", "FULL_AUDIT", "GET_TRIGGER_PRICE", "DEEP_RISK_ANALYSIS"],
    description: "Deep risk analysis including market shocks, LT/ST scores, and tactical trigger prices.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        return /0x[a-fA-F0-9]{40}/.test(message.content.text);
    },
    handler: async (runtime: IAgentRuntime, message: Memory, state?: State, _options?: any, callback?: HandlerCallback): Promise<boolean> => {
        const text = message.content.text;
        const wallet = text.match(/0x[a-fA-F0-9]{40}/)?.[0];
        const hash = text.match(/0x[a-fA-F0-9]{64}/)?.[0];

        if (!hash) {
            if (callback) {
                callback({
                    text: `⚠️ **PAYMENT_REQUIRED:** BRAIN analysis requires a security verification fee ($8 USDC).
                    \nPlease transfer to: \`0xTuWalletDeTesoreria\` and provide the Transaction Hash.`,
                    content: { 
                        status: "PAYMENT_REQUIRED", 
                        amount: 8, 
                        currency: "USDC"
                    }
                });
            }
            return true;
        }

        try {
            const response = await fetch(`${runtime.getSetting("CENTINEL_WEBHOOK_URL")}/crp2026`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${runtime.getSetting("CENTINEL_API_KEY")}`
                },
                body: JSON.stringify({ wallet, tx_hash: hash, type: 'brain' })
            });

            const result = await response.json();
            const payload = result.plugin_report[0]; // Usamos tu estructura de n8n

            const finalResponse = `${payload.eliza_report}\n\n🏛️ **Bloomberg Terminal Audit (PDF):** ${payload.access_url}\n*Expires at: ${payload.expires_at}*`;

            if (callback) {
                callback({ 
                    text: finalResponse, 
                    content: payload.full_data // Guardamos la data técnica completa en memoria
                });
            }
            return true;
        } catch (error) {
            elizaLogger.error("Centinel Brain Audit Error:", error);
            if (callback) callback({ text: "Protocol offline. Check connection." });
            return false;
        }
    },
    examples: [
        [
            { user: "{{user1}}", content: { text: "Run a brain audit on 0x8ea6... hash 0x123..." } },
            { user: "{{agentName}}", content: { text: "Calculating simulations and trigger prices...", action: "GET_BRAIN_AUDIT" } }
        ]
    ]
};
