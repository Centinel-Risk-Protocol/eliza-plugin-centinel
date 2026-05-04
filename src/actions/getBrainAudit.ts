import { Action, IAgentRuntime, Memory, State, HandlerCallback, elizaLogger } from "@ai16z/eliza";

export const getBrainAuditAction: Action = {
    name: "GET_BRAIN_AUDIT",
    similes: ["BRAIN_SCAN", "STRESS_TEST", "FULL_AUDIT", "GET_TRIGGER_PRICE"],
    description: "Análisis profundo de riesgo con simulación de shocks y precios tácticos de ejecución.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        return /0x[a-fA-F0-9]{40}/.test(message.content.text);
    },
    handler: async (runtime: IAgentRuntime, message: Memory, state?: State, _options?: any, callback?: HandlerCallback): Promise<boolean> => {
        const text = message.content.text;
        const wallet = text.match(/0x[a-fA-F0-9]{40}/)?.[0];
        const hash = text.match(/0x[a-fA-F0-9]{64}/)?.[0];

        // --- LÓGICA DE PAGO INTERNA ---
        if (!hash) {
            if (callback) {
                callback({
                    text: `⚠️ **PAYMENT_REQUIRED:** El análisis BRAIN requiere una verificación de seguridad ($8 USDC). 
                    \nPor favor, realiza la transferencia a: \`0xTuWalletDeTesoreria\` y envíame el Hash de la transacción.`,
                    content: { 
                        status: "PAYMENT_REQUIRED", 
                        amount: 8, 
                        currency: "USDC", 
                        address: "0xTuWalletDeTesoreria" 
                    }
                });
            }
            return true;
        }

        try {
            const response = await fetch("https://api.centinelrisk.tech/v1/eliza/plugin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wallet, tx_hash: hash, type: 'brain' })
            });

            const data = await response.json();
            const brain = data[0]; // Tu estructura de n8n

            const report = `🧠 **CENTINEL BRAIN REPORT**
            
📈 **Risk Engine (Short Term):**
- Score ST: ${brain.risk_engine.score_st}
- Status: ${brain.risk_engine.color_st}

🛡️ **Stress Test:**
- 10% Crash: ${brain.stress_test.crash_test_10pct}
- 20% Volatility: ${brain.stress_test.volatility_test_20pct}
- Vulnerability: ${brain.stress_test.vulnerability_index}

⚡ **Tactical Execution:**
- **Trigger Price: $${brain.execution.trigger_price}**
- Order Type: ${brain.execution.order_type}
- Amount Suggested: $${brain.execution.amount_usd}
- Liq Price: $${brain.execution.liquidation_price}

⚖️ **Compliance:** ${brain.compliance_note}`;

            if (callback) {
                callback({
                    text: report,
                    content: brain // Pasamos el JSON puro para que el agente pueda usar los números
                });
            }
            return true;
        } catch (error) {
            elizaLogger.error("Error en Centinel Plugin:", error);
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
