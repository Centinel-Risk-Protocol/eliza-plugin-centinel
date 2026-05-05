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
        const hash = text.match(/0x[a-fA-F0-9]{64}/)?.[0] || "NO_HASH";
        const apiKey = runtime.getSetting("CENTINEL_API_KEY") || "sk_trial_base_free_2026";

        // --- 1. COOLDOWN DE SEGURIDAD (60s para simulaciones Brain) ---
        const cacheKey = `last_brain_${wallet}`;
        const lastCall = await runtime.cacheManager.get<number>(cacheKey);
        const NOW = Date.now();
        if (lastCall && (NOW - lastCall) < 60000) {
            if (callback) callback({ text: "🧠 Brain Engine is recalibrating. Please wait 60s between deep audits." });
            return true;
        }

        // --- 2. TRIAL GATE ---
        if (apiKey.startsWith("sk_trial") && hash === "NO_HASH") {
            if (callback) {
                callback({
                    text: `🧠 **BRAIN UPGRADE REQUIRED:** Deep audit requires an sk_live key.
                    \n1. Get yours at dev.centinelrisk.tech
                    \n2. Or provide a $8 Tx Hash for a single report.`,
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

            // Manejo de respuesta de bloqueo de n8n
            if (result.access_granted === false) {
                if (callback) callback({ text: `🚫 **CENTINEL ERROR:** ${result.error_message}` });
                return true;
            }

            const payload = result.plugin_report[0];
            const finalResponse = `${payload.eliza_report}\n\n🏛️ **Bloomberg Terminal Audit:** ${payload.access_url}`;

            await runtime.cacheManager.set(cacheKey, NOW);

            if (callback) {
                callback({ text: finalResponse, content: payload.full_data });
            }
            return true;
        } catch (error) {
            elizaLogger.error("Centinel Brain Error:", error);
            if (callback) callback({ text: "⚠️ Simulation engine offline. Try again later." });
            return false;
        }
    },
    examples: [[
        { user: "{{user1}}", content: { text: "Run a deep brain audit on 0x8ea6..." } },
        { user: "{{agentName}}", content: { text: "Simulating market shocks and trigger prices...", action: "GET_BRAIN_AUDIT" } }
    ]]
};
