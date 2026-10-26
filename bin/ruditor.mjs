#!/usr/bin/env node
// Ponte do plugin Ruditor: MCP stdio <-> POST /api/mcp na VPS.
// Zero dependência (Node 18+). TLS contra a CA do Ruditor que vai junto
// (ca/ruditor-malha-ca.crt): só aceita o servidor assinado por ela.
// Acesso pelo token (RUDITOR_TOKEN), que só o dono do Ruditor emite.
//
// Uso:
//   ruditor.mjs mcp                         servidor MCP stdio (o plugin chama assim)
//   ruditor.mjs saude                       testa TLS, token e protocolo
//   ruditor.mjs listar [--json]             as ferramentas
//   ruditor.mjs chamar <ferramenta> k=v ... [--consentimento] [--sessao S] [--modelo M] [--json]
import { request } from "node:https";
import { readFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const BASE = (process.env.RUDITOR_URL || "https://srv1920751.hstgr.cloud:8444").replace(/\/+$/, "");
const TOKEN = (process.env.RUDITOR_TOKEN || "").trim();
const CA = readFileSync(fileURLToPath(new URL("../ca/ruditor-malha-ca.crt", import.meta.url)));
const SESSAO = process.env.RUDITOR_SESSAO || `plugin-${randomUUID()}`;
const MODELO = process.env.RUDITOR_MODELO || "plugin";

// O servidor exige _sessao em toda chamada e lê os argumentos como texto.
function prepararChamada(msg) {
  if (msg?.method !== "tools/call" || !msg.params) return msg;
  const a = { ...(msg.params.arguments || {}) };
  for (const [k, v] of Object.entries(a)) {
    if (typeof v !== "string") a[k] = typeof v === "object" && v !== null ? JSON.stringify(v) : String(v);
  }
  a._sessao ||= SESSAO;
  a._modelo ||= MODELO;
  return { ...msg, params: { ...msg.params, arguments: a } };
}

function postar(msg) {
  if (!TOKEN) return Promise.reject(new Error("sem token: configure o token do plugin (ou RUDITOR_TOKEN); quem emite é o dono do Ruditor"));
  const corpo = JSON.stringify(msg);
  return new Promise((ok, falha) => {
    const req = request(new URL("/api/mcp", BASE), {
      method: "POST",
      ca: CA,
      timeout: 15 * 60 * 1000, // lote leva minutos
      headers: {
        "content-type": "application/json",
        "content-length": Buffer.byteLength(corpo),
        authorization: `Bearer ${TOKEN}`,
      },
    }, (res) => {
      let txt = "";
      res.setEncoding("utf8");
      res.on("data", (c) => (txt += c));
      res.on("end", () => {
        if (res.statusCode === 202) return ok(null);
        if (res.statusCode !== 200) return falha(new Error(`HTTP ${res.statusCode}: ${txt.trim().slice(0, 300) || "sem corpo"}${dica(res.statusCode)}`));
        try { ok(JSON.parse(txt)); } catch { falha(new Error("resposta não é JSON")); }
      });
    });
    req.on("timeout", () => req.destroy(new Error("tempo esgotado")));
    req.on("error", falha);
    req.end(corpo);
  });
}

function dica(status) {
  return { 401: " (falta o token)", 403: " (token recusado ou vencido: peça outro ao dono do Ruditor)", 429: " (muitas chamadas por minuto; espere)", 503: " (servidor sem token configurado)" }[status] || "";
}

function servirMcp() {
  const pendentes = new Set();
  const escrever = (m) => process.stdout.write(JSON.stringify(m) + "\n");
  createInterface({ input: process.stdin }).on("line", (linha) => {
    if (!linha.trim()) return;
    let msg;
    try { msg = JSON.parse(linha); } catch {
      return escrever({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "JSON inválido" } });
    }
    const p = postar(prepararChamada(msg))
      .then((r) => { if (r && msg.id !== undefined) escrever(r); })
      .catch((e) => { if (msg.id !== undefined) escrever({ jsonrpc: "2.0", id: msg.id, error: { code: -32001, message: `ruditor: ${e.message}` } }); })
      .finally(() => pendentes.delete(p));
    pendentes.add(p);
  }).on("close", () => Promise.allSettled([...pendentes]).then(() => process.exit(0)));
}

async function chamarRpc(method, params) {
  const r = await postar(prepararChamada({ jsonrpc: "2.0", id: 1, method, params }));
  if (r.error) throw new Error(r.error.message);
  return r.result;
}

async function cli(argv) {
  const flags = {}, pos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json" || a === "--consentimento") flags[a.slice(2)] = true;
    else if (a === "--sessao" || a === "--modelo") flags[a.slice(2)] = argv[++i];
    else pos.push(a);
  }
  const [cmd, nome, ...kv] = pos;
  if (cmd === "saude") {
    const ini = await chamarRpc("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "ruditor-plugin-cli", version: "1" } });
    const { tools } = await chamarRpc("tools/list", {});
    console.log(`ok: ${ini.serverInfo?.name} ${ini.serverInfo?.version}, protocolo ${ini.protocolVersion}, ${tools.length} ferramentas em ${BASE}`);
    return 0;
  }
  if (cmd === "listar") {
    const { tools } = await chamarRpc("tools/list", {});
    if (flags.json) console.log(JSON.stringify(tools, null, 2));
    else for (const t of tools) console.log(`${t.name.padEnd(24)} ${t.description.split("\n")[0].slice(0, 110)}`);
    return 0;
  }
  if (cmd === "chamar" && nome) {
    const args = Object.fromEntries(kv.map((s) => [s.slice(0, s.indexOf("=")), s.slice(s.indexOf("=") + 1)]).filter(([k]) => k));
    if (flags.consentimento) args._consentimento = "1";
    if (flags.sessao) args._sessao = flags.sessao;
    if (flags.modelo) args._modelo = flags.modelo;
    const r = await chamarRpc("tools/call", { name: nome, arguments: args });
    const txt = (r.content || []).map((c) => c.text).join("\n");
    if (flags.json && r.structuredContent) console.log(JSON.stringify(r.structuredContent, null, 2));
    else { try { console.log(JSON.stringify(JSON.parse(txt), null, 2)); } catch { console.log(txt); } }
    return r.isError ? 1 : 0;
  }
  console.error("uso: ruditor.mjs mcp | saude | listar [--json] | chamar <ferramenta> k=v ... [--consentimento] [--sessao S] [--modelo M] [--json]");
  return 2;
}

if (process.argv[2] === "mcp") servirMcp();
else cli(process.argv.slice(2)).then((c) => process.exit(c), (e) => { console.error(`ruditor: ${e.message}`); process.exit(2); });
