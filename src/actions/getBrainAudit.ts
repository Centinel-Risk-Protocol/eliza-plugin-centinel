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
            // Updated URL to your crp2026 route
            const response = await fetch(`${runtime.getSetting("CENTINEL_WEBHOOK_URL")}/crp2026`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wallet, tx_hash: hash, type: 'brain' })
            });

            const data = await response.json();
            const b = data[0]; 

            const report = `🧠 **CENTINEL BRAIN AUDIT**
            
📊 **Solvency Metrics:**
- HF (Health Factor): ${b.data.health_factor}
-maximum_drop_support: ${b.risk_engine.maximum_drop_support}
- LT Score (Long-Term): ${b.risk_engine.score_lt} [${b.risk_engine.color_lt}]
- ST Score (Short-Term): ${b.risk_engine.score_st} [${b.risk_engine.color_st}]

📉 **Stress Test Simulations:**
- 10% Flash Crash: ${b.stress_test.crash_test_10pct}
- 20% Volatility: ${b.stress_test.volatility_test_20pct}
- Vulnerability Index: ${b.stress_test.vulnerability_index}

⚡ **Tactical Execution:**
- **Trigger Price: $${b.execution.trigger_price}** ⚠️
- Liq. Price: $${b.execution.liquidation_price}
- Order: ${b.execution.order_type} ($${b.execution.amount_usd})

⚖️ **Compliance:** ${b.compliance_note}`;

            if (callback) {
                callback({ text: report, content: b });
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
