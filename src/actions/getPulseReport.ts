import { Action, IAgentRuntime, Memory, State, HandlerCallback } from "@ai16z/eliza";

export const getPulseReportAction: Action = {
    name: "GET_PULSE_REPORT",
    similes: ["CHECK_RISK", "HEALTH_FACTOR", "PULSE_CHECK", "CHECK_SOLVENCY"],
    description: "Get a quick (Pulse) report on the financial health and risk of a wallet in Base.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        return !!message.content.text?.includes("0x");
    },
    handler: async (runtime: IAgentRuntime, message: Memory, state: State, _options: any, callback: HandlerCallback) => {
        const wallet = message.content.text.match(/0x[a-fA-F0-9]{40}/)?.[0];
        
        try {
            const response = await fetch(`${runtime.getSetting("CENTINEL_WEBHOOK_URL")}`, {
                method: 'POST',
                body: JSON.stringify({ wallet, type: 'pulse' })
            });
            const data = await response.json();
            const pulse = data[0]; 

            const responseText = `🛡️ *Centinel Pulse Report*
Wallet: ${pulse.wallet}
HF: ${pulse.data.health_factor} | Status: ${pulse.risk_engine.color_st}
Liq. Price: $${pulse.execution.liquidation_price}
Note: ${pulse.pulse.Compliance_note}`;

            callback({ text: responseText, content: pulse });
            return true;
        } catch (error) {
            callback({ text: "Sorry, I couldn't connect to the Centinel risk engine." });
            return false;
        }
    },
    examples: [
        [{ user: "{{user1}}", content: { text: "Check my pulse 0x561d..." } }, { user: "{{agentName}}", content: { text: "Checking your solvency on Base...", action: "GET_PULSE_REPORT" } }]
    ]
};
