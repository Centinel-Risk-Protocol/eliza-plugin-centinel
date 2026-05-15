// @ts-nocheck
import { Action, elizaLogger, IAgentRuntime, Memory, State, HandlerCallback } from "@ai16z/eliza";

const activeWallets = new Set<string>();

export const getPulseReportAction: Action = {
    name: "GET_PULSE_REPORT",
    similes: ["PULSE", "CRP", "CENTINEL", "AUDIT", "CHECK_WALLET"],
    description: "Analyze a crypto wallet risk using Pulse Protocol (Free Tier).",
    
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const text = message.content.text.toLowerCase();

        return /0x[a-fA-F0-9]{40}/.test(text);
    },

    handler: async (runtime: IAgentRuntime, message: Memory, state: State, _options: any, callback: HandlerCallback) => {
        const wallet = message.content.text.match(/0x[a-fA-F0-9]{40}/)?.[0];
        if (!wallet) return false;

        if (activeWallets.has(wallet)) {
            elizaLogger.log(`🚫 Wallet ${wallet} in progress. Ignoring.`);
            return false;
        }

        activeWallets.add(wallet);

        try {
            if (callback) {
                callback({ 
                    text: `🛡️ **Centinel Pulse**\nInitiating audit for: \`${wallet}\`...` 
                });
            }

            const centinelService = runtime.getService("centinel");
            if (!centinelService) {
                elizaLogger.error("Centinel Service not found");
                return false;
            }

            const responseData = await centinelService.callCentinel({ 
                wallet, 
                userId: message.userId,
                mode: "pulse"
            });

            const data = Array.isArray(responseData) ? responseData[0] : responseData;

            if (callback && (data?.eliza_report || data?.message)) {
                callback({ text: data.eliza_report || data.message });
            } else {
                callback({ text: "⚠️ Audit completed, but no readable report was received." });
            }

            return true;
        } catch (error) {
            elizaLogger.error("❌ Error in Pulse Action:", error.message);
            if (callback) {
                callback({ text: "❌ Error: Could not connect to Centinel engine." });
            }
            return false;
        } finally {
            setTimeout(() => activeWallets.delete(wallet), 10000);
        }
    },
    examples: [
        [
            { user: "{{user1}}", content: { text: "Pulse 0x...." } },
            { user: "Centinel", content: { text: "🛡️ Generating report...", action: "GET_PULSE_REPORT" } }
        ]
    ]
};
