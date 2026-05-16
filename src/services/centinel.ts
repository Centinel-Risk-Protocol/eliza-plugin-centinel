// @ts-nocheck
import { Service, IAgentRuntime, ServiceType, elizaLogger } from "@ai16z/eliza";

export class CentinelService extends Service {
    static serviceType: ServiceType = "centinel" as unknown as ServiceType;
    private runtime: IAgentRuntime | null = null;

    async initialize(runtime: IAgentRuntime): Promise<void> {
        this.runtime = runtime;
    }

    async callCentinel(payload: any) {
        if (!this.runtime) return { message: "Error: No runtime" };

        try {
            const mode = payload.mode || "pulse";

            const apiUrl = this.runtime.getSetting("CENTINEL_API_URL");
            const publicApiKey = this.runtime.getSetting("CENTINEL_PUBLIC_API_KEY"); 
            const privateApiKey = this.runtime.getSetting("CENTINEL_PRIVATE_API_KEY");

            const targetKey = mode === "brain" ? (privateApiKey || publicApiKey) : publicApiKey;

            if (!apiUrl) {
                console.error(`🚨 CENTINEL_API_URL is not configured in .env`);
                return { message: "Incomplete server configuration" };
            }

            const response = await globalThis.fetch(apiUrl, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    "x-api-key": targetKey || "" 
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                return { message: `Server error (${response.status})` };
            }

            return await response.json();
        } catch (error: any) {
           elizaLogger.error("🚨 CentinelService connection failure:", error?.message || error);
            return { message: "Connection error" };
        }
    }
}
