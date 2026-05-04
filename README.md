🛡️ @centinel-risk/plugin-eliza
The Solvency Layer for Autonomous Agents on Base Network. Providing real-time audits, dynamic Risk Scores, and Tactical Trigger Prices.

Prevent your agent from unexpected liquidations. Centinel is a high-fidelity risk engine that provides real-time solvency auditing, stress-test simulations, and tactical execution triggers for the Agentic Economy.

🧠 Why Centinel?
Static rules aren't enough for volatile markets. Centinel Agents follow market physics.

Pulse Audit: Real-time Health Factor (HF) monitoring and solvency scoring.

Brain Audit: Deep-risk simulations (Flash Crashes) and Tactical Trigger Prices.

Bloomberg-Style Reports: Institutional-grade reports for compliance and auditing.

Safety Switch: Automated alerts before the market hits your liquidation price.

🚀 Installation
npm install @centinel-risk/plugin-eliza
# or
pnpm add @centinel-risk/plugin-eliza

🛠️ Configuration
To activate the plugin, add your credentials to the agent's .env file. Get your API Key at dev.centinelrisk.tech.

# Centinel Protocol Settings
CENTINEL_API_KEY=cent_pending
CENTINEL_WEBHOOK_URL=https://api.centinelrisk.tech/v1/el..

📦 Core Actions

1. GET_PULSE_REPORT (Routine Check)
Cost: 1 Free/day or $2 USD.
Output: Immediate solvency score, HF check, and maintenance recommendations.
Context: Used for periodic health monitoring.

2. GET_BRAIN_AUDIT (Strategic Deep-Dive)
Cost: $8 USD.
Output: Full Stress-Test (-10% crash simulation), Long-Term (LT) risk score, and Tactical Trigger Price for de-leveraging.
Compliance: Generates a private URL with an institutional terminal view.

💻 Usage
Register the plugin in your Eliza entry point:

TypeScript
import { centinelPlugin } from "@centinel-risk/plugin-eliza";
const runtime = new AgentRuntime({
    plugins: [centinelPlugin],
    // ... other config
});

The "Sales Engine" in Action
The plugin includes a built-in RiskEvaluator that detects user anxiety or high-leverage scenarios to proactively suggest audits.

User: "I'm worried about my Aave position, the market looks shaky."

Agent: "I detect market volatility. I can run a Brain Audit ($8) to simulate a flash crash and give you a precise Trigger Price to protect your collateral. Shall we proceed?"

🛡️ Security & Privacy
Non-Custodial: Centinel never asks for private keys. Only public wallet addresses.
Encrypted Payloads: All communication is secured via HTTPS and Bearer Token Auth.
Ephemeral Data: Audit links can be configured to expire after a specific timeframe.

🔗 Resources

Official Website: centinelrisk.tech
Developer Portal: dev.centinelrisk.tech
Network: Built exclusively for Base.
