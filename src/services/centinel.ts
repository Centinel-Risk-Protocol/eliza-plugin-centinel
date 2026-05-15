// @ts-nocheck
import { Service, IAgentRuntime, ServiceType } from "@ai16z/eliza";

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

            const pulseUrl = this.runtime.getSetting("CENTINEL_PULSE_URL");
            const brainUrl = this.runtime.getSetting("CENTINEL_BRAIN_URL");
            const publicApiKey = this.runtime.getSetting("CENTINEL_PUBLIC_API_KEY"); 
            const privateApiKey = this.runtime.getSetting("CENTINEL_PRIVATE_API_KEY");

            const targetUrl = mode === "brain" ? brainUrl : pulseUrl;
            const targetKey = mode === "brain" ? privateApiKey : publicApiKey;

            if (!targetUrl) {
                console.error(`🚨 URL for mode ${mode} not configured.`);
                return { message: "Incomplete server configuration" };
            }

            const response = await fetch(targetUrl, {
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
        } catch (error) {
            console.error("🚨 CentinelService connection failure:", error.message);
            return { message: "Connection error" };
        }
    }
}
