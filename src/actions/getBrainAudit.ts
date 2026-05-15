// @ts-nocheck
import { Action, IAgentRuntime, Memory, State, HandlerCallback, elizaLogger } from "@ai16z/eliza";

const BRAIN_COOLDOWN_MS = 5 * 60 * 1000; 

export const getBrainAuditAction: Action = {
    name: "GET_BRAIN_AUDIT",
    similes: ["BRAIN_SCAN", "DEEP_AUDIT", "VERIFY_PAYMENT", "AUDIT_HASH"],
    description: "Triggers deep brain audit. Requires Wallet and TX Hash.",
    
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const text = message.content.text.toLowerCase();
        return /0x[a-fA-F0-9]{64}/.test(text) || /0x[a-fA-F0-9]{40}/.test(text);
    },

    handler: async (runtime: IAgentRuntime, message: Memory, state?: State, _options?: any, callback?: HandlerCallback): Promise<boolean> => {
        const text = message.content.text;
        const userId = message.userId;
        
        const hash = text.match(/0x[a-fA-F0-9]{64}/)?.[0];
        let wallet = text.match(/0x[a-fA-F0-9]{40}/)?.[0];

        const cache = runtime?.cacheManager;
        const cacheKey = `centinel:cooldown:${userId}`;
        const draftKey = `centinel:draft:${userId}`;

        try {
            if (cache && typeof cache.get === 'function') {
                // Check Cooldown
                const lastRun = await cache.get(cacheKey);
                if (lastRun && Date.now() - Number(lastRun) < BRAIN_COOLDOWN_MS) {
                    const remaining = Math.ceil((BRAIN_COOLDOWN_MS - (Date.now() - Number(lastRun))) / 60000);
                    callback?.({ text: `⏳ **COOLDOWN:** **${remaining} min** remaining.` });
                    return true;
                }
                if (!wallet) {
                    const draft = await cache.get(draftKey);
                    if (draft?.wallet) wallet = draft.wallet;
                }
            }
        } catch (e) {
            elizaLogger.warn("[CENTINEL_BRAIN] Cache bypass due to error:", e.message);
        }

        if (!hash || !wallet) {
            if (wallet && !hash) {
                // Intentar guardar borrador
                if (cache?.set) await cache.set(draftKey, { wallet }, { expires: Date.now() + 600000 }).catch(()=>{});
                callback?.({ text: "🧠 **Registered wallet. Now paste the **TX Hash** for auditing." });
            } else if (hash && !wallet) {
                callback?.({ text: "❌ HASH DETECTED, BUT **Wallet address** is required." });
            } else {
                callback?.({ text: "❌ Provide Wallet & Hash to do the CENTINEL Audit." });
            }
            return false;
        }

        try {
            callback?.({ text: "**CENTINEL_ENGINE:** Running deep audit..." });

            const centinelService = runtime.getService("centinel"); 
            if (!centinelService || typeof centinelService.callCentinel !== 'function') {
                throw new Error("CENTINEL_SERVICE_NOT_READY");
            }

            const responseData = await centinelService.callCentinel({
                tx_hash: hash,
                wallet: wallet,
                mode: "brain",
                discord_id: userId
            });

            if (cache?.set) {
                await cache.set(cacheKey, Date.now().toString()).catch(()=>{});
                await cache.delete(draftKey).catch(()=>{});
            }

            const data = Array.isArray(responseData) ? responseData[0] : responseData;
            const report = data?.eliza_report || data?.message || "✅ Send audit.";
            
            callback?.({ text: report });
            return true;

        } catch (error) {
            elizaLogger.error("[CENTINEL_BRAIN] Handler Error:", error.message);
            callback?.({ text: "⚠️ **SYSTEM_FAILURE:** Error connecting to the risk motor. Verify that agents are active" });
            return false;
        }
    },
    examples: [] 
};
