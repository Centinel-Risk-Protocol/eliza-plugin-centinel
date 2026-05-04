import { Action, IAgentRuntime, Memory, State, HandlerCallback, elizaLogger } from "@ai16z/eliza";

export const getPulseReportAction: Action = {
    name: "GET_PULSE_REPORT",
    similes: ["CHECK_RISK", "HEALTH_FACTOR", "PULSE_CHECK", "CHECK_SOLVENCY"],
    description: "Consulta el estado de salud (Pulse) de una wallet. Requiere transferencia previa de $2.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        return /0x[a-fA-F0-9]{40}/.test(message.content.text);
    },
    handler: async (runtime: IAgentRuntime, message: Memory, state: State, _options: any, callback: HandlerCallback) => {
        const text = message.content.text;
        const wallet = text.match(/0x[a-fA-F0-9]{40}/)?.[0];
        const hash = text.match(/0x[a-fA-F0-9]{64}/)?.[0]; // Buscamos el Hash de pago

        // BLOQUEO DE SEGURIDAD: Si no hay hash, pedimos el pago
        if (!hash) {
            callback({
                text: `🛡️ **CENTINEL PROTOCOL: PAGO REQUERIDO**\nPara auditar la wallet ${wallet?.slice(0,6)}... se requiere un fee de **$2 USD**. \n\nPor favor, envía el pago a \`0xTuWalletTesoreria\` y pega el TX Hash aquí.`,
                content: { status: "PAYMENT_REQUIRED", amount: 2 }
            });
            return true;
        }

       try {
    const response = await fetch(`${runtime.getSetting("CENTINEL_WEBHOOK_URL")}/crp2026`, {
    method: 'POST',
    headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${runtime.getSetting("CENTINEL_API_KEY")}` // <-- Añade esto
    },
    body: JSON.stringify({ wallet, tx_hash: hash, type: 'pulse' })
});
    
    const result = await response.json();
    const payload = result.plugin_report[0]; // Accedemos a tu estructura de n8n

    // Construimos la respuesta final combinando el reporte y el link de Bloomberg
    const finalResponse = `${payload.eliza_report}\n\n📊 **Institutional Terminal View:** ${payload.access_url}`;

    callback({ 
        text: finalResponse, 
        content: payload.full_data // El agente guarda la data técnica en su memoria
    });
    return true;

        } catch (error) {
            elizaLogger.error("Error en Centinel Pulse:", error);
            callback({ text: "⚠️ Error conectando con el motor de riesgo CRP." });
            return false;
        }
    },
    examples: [
        [
            { user: "{{user1}}", content: { text: "Audit my wallet 0x561d... hash 0xabc123..." } },
            { user: "{{agentName}}", content: { text: "Analyzing your solvency with Centinel...", action: "GET_PULSE_REPORT" } }
        ]
    ]
};
