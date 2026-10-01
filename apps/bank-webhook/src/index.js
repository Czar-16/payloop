import crypto from "crypto";
import axios from "axios";
import express from "express";
import { z } from "zod";
const app = express();
app.use(express.json());
app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    if (_req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "bank_webhook_secret_key";
const WEBHOOK_URL = process.env.WEBHOOK_URL || "http://localhost:3000/api/webhook";
const simulatePaymentSchema = z.object({
    token: z.string().min(1, "Token is required"),
    status: z.enum(["Success", "Failed"], {
        errorMap: () => ({ message: "Status must be 'Success' or 'Failed'" }),
    }),
});
app.get("/health", (_req, res) => {
    return res.json({ status: "ok", service: "bank-webhook" });
});
const htmlPage = `
<!DOCTYPE html>
<html>
<head>
  <title>Mock Bank Payment Simulator</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 500px; margin: 50px auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    h2 { margin-top: 0; font-size: 1.5rem; }
    p { color: #4a5568; font-size: 0.9rem; }
    label { display: block; margin-top: 14px; font-weight: 600; font-size: 0.85rem; }
    input, select, button { width: 100%; padding: 10px; margin-top: 6px; box-sizing: border-box; border-radius: 6px; border: 1px solid #cbd5e0; font-size: 0.95rem; }
    button { background: #000; color: #fff; border: none; cursor: pointer; font-weight: 600; margin-top: 18px; }
    button:hover { background: #2d3748; }
    .msg { margin-top: 16px; padding: 12px; border-radius: 6px; display: none; font-size: 0.875rem; word-break: break-all; }
  </style>
</head>
<body>
  <h2>🏦 Mock Bank Simulator</h2>
  <p>Paste your transaction token from Payloop to trigger the bank payment webhook.</p>
  <form id="simForm">
    <label>Transaction Token:</label>
    <input type="text" id="token" placeholder="Paste token here" required />
    <label>Payment Outcome:</label>
    <select id="status">
      <option value="Success">Success (Approve Payment)</option>
      <option value="Failed">Failed (Decline Payment)</option>
    </select>
    <button type="submit">Simulate Payment Webhook</button>
  </form>
  <div id="result" class="msg"></div>
  <script>
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    if (tokenParam) { document.getElementById('token').value = tokenParam; }

    document.getElementById('simForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = document.getElementById('token').value.trim();
      const status = document.getElementById('status').value;
      const resDiv = document.getElementById('result');
      resDiv.style.display = 'block';
      resDiv.innerText = 'Sending signed webhook to Payloop...';
      resDiv.style.background = '#edf2f7';
      resDiv.style.color = '#2d3748';
      try {
        const res = await fetch('/simulate-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, status })
        });
        const data = await res.json();
        if (res.ok) {
          resDiv.style.background = '#c6f6d5';
          resDiv.style.color = '#22543d';
          resDiv.innerText = '✅ Success: ' + JSON.stringify(data.bankResponse || data.message);
        } else {
          resDiv.style.background = '#fed7d7';
          resDiv.style.color = '#742a2a';
          resDiv.innerText = '❌ Error: ' + (data.error || JSON.stringify(data));
        }
      } catch (err) {
        resDiv.style.background = '#fed7d7';
        resDiv.style.color = '#742a2a';
        resDiv.innerText = '❌ Connection failed: ' + err.message;
      }
    });
  </script>
</body>
</html>
`;
app.get("/", (_req, res) => {
    res.setHeader("Content-Type", "text/html");
    return res.send(htmlPage);
});
app.get("/simulate-payment", (_req, res) => {
    res.setHeader("Content-Type", "text/html");
    return res.send(htmlPage);
});
app.post("/simulate-payment", async (req, res) => {
    const parsed = simulatePaymentSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            error: "Invalid input",
            details: parsed.error.format(),
        });
    }
    const { token, status } = parsed.data;
    const payload = { token, status };
    const payloadString = JSON.stringify(payload);
    const signature = crypto
        .createHmac("sha256", WEBHOOK_SECRET)
        .update(payloadString)
        .digest("hex");
    try {
        const response = await axios.post(WEBHOOK_URL, payload, {
            headers: {
                "Content-Type": "application/json",
                "x-webhook-signature": signature,
            },
        });
        return res.json({
            message: "Payment simulated successfully",
            bankResponse: response.data,
        });
    }
    catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return res.status(error.response.status).json({
                error: "Webhook rejected by Payloop",
                bankResponse: error.response.data,
            });
        }
        console.error("Bank webhook simulation error:", error);
        return res.status(500).json({
            error: "Failed to connect to Payloop webhook",
        });
    }
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Bank webhook server is running on port ${PORT}`);
});
