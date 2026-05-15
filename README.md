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

🔑 Authentication & Endpoints
---
To ensure maximum security, Centinel uses dedicated endpoints for different service tiers.

| Service | Endpoint URL | API Key | Access |
| :--- | :--- | :--- | :--- |
| **Pulse (Free)** | `https://api.centinelrisk.tech/v1/eliza/plugin/crp2026` | `public-pulse-2026` | Public / Rate-limited |
| **Brain/Pulse (Premium)** | `Obtained after registration` | *Your Personal Key* | [Register here](https://dev.centinelrisk.tech) |

### 🛠️ How to configure your .env

Copy and paste the following variables into your agent's `.env` file. Replace `your_private_key_here` with the key obtained from our developer portal.

```bash
# ========================================================
# CENTINEL RISK PROTOCOL - CONFIGURATION
# ========================================================

bash
# Public Endpoint for Routine Pulse Checks (Free Tier)
CENTINEL_PULSE_URL=[https://api.centinelrisk.tech/v1/eliza/plugin/crp2026](https://api.centinelrisk.tech/v1/eliza/plugin/crp2026)
CENTINEL_PULSE_API_KEY=public-pulse-2026

# Private Endpoint for Strategic Brain Audits and second Pulse use per day (Premium Tier)
# Register at dev.centinelrisk.tech to get your private URL and Key
CENTINEL_BRAIN_URL=paste_url_here
CENTINEL_BRAIN_API_KEY=your_private_key_here
```


🛠️ Configuration
---
To activate the protocol, add the following variables to your .env file. You can obtain your CENTINEL_API_KEY at dev.centinelrisk.tech.

CENTINEL_API_KEY=cent_pending
CENTINEL_WEBHOOK_URL=https://api.centinelrisk.tech/v..

📦 Core Actions

1.🛡️ GET_PULSE_REPORT (Routine Check)
*  Cost: One Free/day or $2 USD.
*  Output: Immediate solvency score, Health Factor (HF) check, and maintenance recommendations.
*  Security Note: Generates a private URL with an institutional terminal view. The access_url is ephemeral and expires in 24h.
 
 <details>
<summary><b>Click  for all JSON details in GET_PULSE_REPORT</b></summary>
  
  ```json
  {
    
    "full_data": {
      "audit_id": "AUD-Pulse-32..5",
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
      "expires_at": "2026-05-14T00:24:19.650Z"
    }
  }
```

</details>

2. 🧠 GET_BRAIN_AUDIT (Strategic Deep-Dive)
* Cost: $8 USD.
* Output: Full Stress-Test (-10% crash simulation), Long-Term (LT) risk score, and Tactical Trigger Price for de-leveraging.
* Compliance: Generates a private URL with an institutional terminal view.

Strategic for automated de-leveraging Agents. Use 'trigger_price' to set safety stops.

<details>
<summary><b>Click for all JSON details in GET_BRAIN_AUDIT</b></summary>

```json
 {
    "audit_id": "AUD-Brain-18..60",
    "timestamp": "2026-05-13T12:41:05.745Z",
    "plan": "BRAIN",
    "status": "SUCCESS",
    "wallet": "0x0a776abba....bea4b99b",
    "system_status": "Operational",
    "data": {
      "health_factor": "2.1567",
      "equity": "256855.06",
      "btc_price": 79894
    },
    "risk_engine": {
      "score_lt": "3.15",
      "color_lt": "GREEN (Growth Zone)",
      "maximum_drop_support": "53.63%",
      "score_st": "2.98",
      "color_st": "GREEN (Growth Zone)"
    },
    "stress_test": {
      "crash_test_10pct": "HF Post-Crash: 1.94 | Impact: Low",
      "volatility_test_20pct": "Score Proj: 2.98 | Impact: Low",
      "vulnerability_index": "LOW (0.00%)"
    },
    "execution": {
      "order_type": "BORROW",
      "amount_usd": "27460.10",
      "trigger_price": "45529.33",
      "liquidation_price": "37044.56"
    },
    "compliance_note": "Order BORROW justified: Consolidation phase. Under-allocation risk. Quiet Market. Vulnerability: LOW (0.00%)."
  }
```

</details>

🕹️ How to Trigger (Usage Instructions)
---
To ensure the Agent correctly identifies the requested audit type, users should follow these patterns:
* For Pulse (Free/Routine):
Must include the word "Pulse" + the Wallet Address (0x...).
Example: "Can you run a pulse check on 0x123...?"

* For Brain/Pulse (2nd Pulse day/Deep-Dive):
 Must include the Wallet addresss and Transaction Hash (64 characters).
Example: "Run an audit on 0x0...754 and hash 0x30....bf23"

🤖 Action Definitions
---
To ensure high accuracy, this plugin implements specific intent recognition:

GET_PULSE_REPORT 
* Triggers: "check pulse [address]",  "pulse check [address]"
* Requirements: Needs a valid EVM address on base network and AAVE open position.

GET_BRAIN_AUDIT
* Triggers: "brain audit [address] hash [hash]"
* Requirements: Needs a valid EVM address on base network and AAVE open position + Transaction Hash (as Proof of Payment).

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
* Official Website: centinelrisk.tech
* Developer Portal: dev.centinelrisk.tech
* Network: Built exclusively for Base/AAVE.
