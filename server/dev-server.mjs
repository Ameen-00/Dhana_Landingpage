// Tiny zero-dependency dev server for the "call me" endpoint.
// Run:  node --env-file=.env server/dev-server.mjs   (Node 20+; loads .env)
// Vite proxies /api/call-me here (see vite.config.js). Deploy the handler as a
// serverless function in production instead of running this.

import http from "node:http";
import { placeCall } from "./call-me.mjs";

const PORT = process.env.CALL_ME_PORT || 3001;

http
  .createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    if (req.method === "OPTIONS") return res.writeHead(204).end();

    if (req.method === "POST" && req.url === "/api/call-me") {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", async () => {
        let payload = {};
        try {
          payload = JSON.parse(body || "{}");
        } catch {
          /* ignore */
        }
        const result = await placeCall(payload);
        res.writeHead(result.ok ? 200 : 400, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      });
      return;
    }
    res.writeHead(404, { "Content-Type": "application/json" }).end('{"error":"not_found"}');
  })
  .listen(PORT, () => console.log(`[call-me] dev server on http://127.0.0.1:${PORT}`));
