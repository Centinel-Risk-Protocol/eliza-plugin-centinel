# 🛡️ @centinel-risk-protocol/eliza-plugin-centinel
---

> **The "Safety Switch" for Autonomous Agents on Base Network.**

Prevent your agent from going to zero. Integrate the **Centinel Risk Protocol (CRP)**: a high-fidelity risk oracle that provides real-time solvency auditing, solvency simulations(Stress-Test), and tactical liquidation triggers (Dynamic Risk Threshold) for the A2A (Agent-to-Agent) economy.


🧠 Why your Agent needs this
---

Standard DeFi agents follow static rules. **Centinel Agents follow market physics.**

*   **Adaptive Health Factor:** Real-time monitoring of borrowing positions.
*   **Tactical Trigger Price:** Know the exact price point where your agent must de-leverage before it's too late.
*   **Stress-Test Simulations:** Real-time impact analysis of -10% flash crashes and -20% volatility shocks.
*   **Institutional Reports:** Bloomberg-style terminal reports (PDF) for compliance and auditing.


 🚀 Installation
 ---

bash
pnpm add @centinel-risk-protocol/eliza-plugin-centinel


🛠️ Configuration
---
To activate the protocol, add the following variables to your .env file. You can obtain your CENTINEL_API_KEY at dev.centinelrisk.tech.


CENTINEL_API_KEY=cent_pending
CENTINEL_WEBHOOK_URL=https://api.centinelrisk.tech/v..

📦 Core Actions

1.🛡️ GET_PULSE_REPORT (Routine Check)
Cost: 1 Free/day or $2 USD.
Output: Immediate solvency score, HF check, and maintenance recommendations.
Context: Used for periodic health monitoring.
Compliance: Generates a private URL with an institutional terminal view.
 JSON

 
  {
    "status": "SUCCESS",
    "eliza_report": "🛡️ [CENTINEL PULSE CHECK]\nscore_st: 3.86 [YELLOW (Optimal Peak)] \nhealth_factor: 1.7644 |\naction_required: Yes \nrecommendation: MONITOR_CYCLE_24H.\ncompliance_note: [Vulnerability:NO], [Volatility_risk:No], [Safe Operating Solvency]\naccess_url: https://centinelrisk.tech/report?id=....0",
    "full_data": {
      "audit_id": "AUD-Pulse-324995",
      "timestamp": "2026-05-13T00:24:19.627Z",
      "plan": "Pulse",
      "status": "SUCCESS",
      "wallet": "0x0d...34",
      "transaction_hash": "FREE_TRIAL",
      "system_status": "Operational",
      "data": {
        "health_factor": "1.7644",
        "equity": "10009.09",
        "btc_price": 80571
      },
      "risk_engine": {
        "score_st": "3.86",
        "color_st": "YELLOW (Optimal Peak)"
      },
      "execution": {
        "liquidation_price": "45664.82"
      },
      "pulse": {
        "action_required": "Yes",
        "Action": "MONITOR_CYCLE_24H.",
        "Compliance_note": "[Vulnerability:NO], [Volatility_risk:No], [Safe Operating Solvency]"
      },
      "access_url": "https://centinelrisk.tech/report?id=28...960",
      "UUID": "28bd2.....60",
      "expires_at": "2026-05-14T00:24:19.650Z",
      "is_active": true
    }
  }


2. 🧠 GET_BRAIN_AUDIT (Strategic Deep-Dive)
Cost: $8 USD.
Output: Full Stress-Test (-10% crash simulation), Long-Term (LT) risk score, and Tactical Trigger Price for de-leveraging.
Compliance: Generates a private URL with an institutional terminal view.

{
  "audit_id": "AUD-Brain-548092",
  "simulations": {
    "crash_test_10pct": "HF Post-Crash: 2.99 | Impact: Low",
    "volatility_test_20pct": "Score Proj: 1.57 | Impact: Low",
    "vulnerability_index": "LOW (0.00%)"
  },
  "tactical_intel": {
    "trigger_price": "30195.92",
    "liquidation_price": "24484.27",
    "order_justification": "Consolidation phase. Under-allocation risk."
  },
  "score_lt": "1.91",
  "zone": "GREEN (Growth Zone)"
}

💻 Usage
---
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
---
Non-Custodial: Centinel never asks for private keys. Only public wallet addresses.
Encrypted Payloads: All communication is secured via HTTPS and Bearer Token Auth.
Ephemeral Data: Audit links can be configured to expire after a specific timeframe.

🔗 Resources
---
Official Website: centinelrisk.tech
Developer Portal: dev.centinelrisk.tech
Network: Built exclusively for Base.
