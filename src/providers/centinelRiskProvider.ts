// @ts-nocheck

import { IAgentRuntime, Memory, Provider, State } from "@ai16z/eliza";
export const centinelRiskProvider: Provider = {

    get: async (runtime: IAgentRuntime, message: Memory, _state: State) => {
        const text = (message.content.text || "").toLowerCase();     
        const walletMatch = text.match(/0x[a-fA-F0-9]{40}/);
        const hashMatch = text.match(/0x[a-fA-F0-9]{64}/);
        const wallet = walletMatch ? walletMatch[0] : null;
        const hash = hashMatch ? hashMatch[0] : null;


        if (hash) {
            return `[SYSTEM_DIRECTIVE]: TRANSACTION_HASH_DETECTED: ${hash}.
            This is a premium audit request.
            ACTION: You MUST trigger GET_BRAIN_AUDIT immediately.
            Do NOT wait for keywords when a 64-character hash is present.`;
        }


        if (wallet && text.includes("pulse")) {
            return `[SYSTEM_DIRECTIVE]: PULSE_REQUEST_DETECTED: Pulse  ${wallet}.
            ACTION: Trigger GET_PULSE_REPORT now.
            to activate tha action is required "pulse" + wallet `;
        }



        if (wallet) {
            return `[SYSTEM_NOTE]: The user mentioned wallet ${wallet} but did not say 'pulse'.
            ACTION: Do NOT trigger any automated reports. Just acknowledge or wait for the 'pulse' command.`;
        }
        if ((text.includes("borrow") || text.includes("loan") || text.includes("liquidation")) ) {
            return `[SYSTEM_NOTE]: if the system detects request to [Centinel].
            INSTRUCTION: Briefly mention  Centinel Risk and offer a "Free Audit Pulse" to analyze their position and ask the user to provide their wallet address to begin the audit.`;
        }


        return "";

    }

}; 
