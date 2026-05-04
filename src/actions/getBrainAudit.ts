import { Action, IAgentRuntime, Memory, State, HandlerCallback } from "@ai16z/eliza";

export const getBrainAuditAction: Action = {
    name: "GET_BRAIN_AUDIT",
    similes: ["DEEP_AUDIT", "STRESS_TEST", "GET_TRIGGER_PRICE", "FULL_RISK_ANALYSIS"],
    description: "Run an in-depth analysis with 10% and 20% crash simulations to obtain the Tactical Trigger Price.",
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        return !!runtime.getSetting("CENTINEL_API_KEY");
    },
    handler: async (runtime: IAgentRuntime, message: Memory, state: State, _options: any, callback: HandlerCallback) => {
        const wallet = message.content.text.match(/0x[a-fA-F0-9]{40}/)?.[0];
        
        if (!wallet) {
            callback({ text: "I need a wallet address to perform the Brain Audit." });
            return false;
        }

        // --- Payment logic (Conceptual) --

        try {
            const response = await fetch(`${runtime.getSetting("CENTINEL_WEBHOOK_URL")}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${runtime.getSetting("CENTINEL_API_KEY")}` },
                body: JSON.stringify({ 
                    wallet, 
                    type: 'brain',
                    service: 'premium_audit'
                })
            });

            const data = await response.json();
            const brain = data[0];

            const responseText = `🧠 *Centinel BRAIN Audit* (Premium)
    
📊 **Risk Engine:**
- Score LT: ${brain.risk_engine.score_lt} (${brain.risk_engine.color_lt})
- Vulnerability Index: ${brain.stress_test.vulnerability_index}

📉 **Stress Test Results:**
- 10% Flash Crash: ${brain.stress_test.crash_test_10pct}
- 20% Volatility: ${brain.stress_test.volatility_test_20pct}

🎯 **Tactical Execution:**
- **Trigger Price: $${brain.execution.trigger_price}** ⚠️
- Liquidation Price: $${brain.execution.liquidation_price}
- Suggested Action: ${brain.execution.order_type} ($${brain.execution.amount_usd})

📝 **Compliance:** ${brain.compliance_note}`;

            callback({ 
                text: responseText, 
                content: { ...brain, success: true } 
            });
            return true;

        } catch (error) {
            callback({ text: "Error connecting to the Centinel brain. Please check your API key or balance." });
            return false;
        }
    },
    examples: [
        [
            { user: "{{user1}}", content: { text: "Run a brain audit on 0x8ea6..." } },
            { user: "{{agentName}}", content: { text: "Simulating market shocks and calculating trigger prices...", action: "GET_BRAIN_AUDIT" } }
        ]
    ]
};
