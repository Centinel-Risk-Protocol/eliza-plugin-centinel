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
            const apiKey = this.runtime.getSetting("CENTINEL_API_KEY");
            const webhookUrl = this.runtime.getSetting("CENTINEL_WEBHOOK_URL");

            if (!webhookUrl) {
                console.error("🚨 CENTINEL_WEBHOOK_URL is missing from the environment variables.");
                return { message: "Incomplete configuration" };
            }

            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    "x-api-key": apiKey || "" 
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                return { message: `Error de servidor (${response.status})` };
            }

            return await response.json();
        } catch (error) {
            // Solo dejamos este log porque es un error de red real
            console.error("🚨 CentinelService connection failure:", error.message);
            return { message: "Connection error" };
        }
    }
}
