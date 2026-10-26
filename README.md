# Ruditor para IAs

Plugin que liga qualquer agente de IA às 24 ferramentas fiscais do Ruditor:
ICMS das 27 UFs, IPI, PIS/COFINS, II, IBS/CBS, Imposto Seletivo e os códigos
NCM, CEST, CFOP e CST. Junto vem a skill que ensina o agente a agir como o
Ruditor Arc 1.0: interpretar a lei como advogado tributarista, auditar como
contador tributário, saber quando duvidar e decidir com fundamento citado.

O uso exige um token pessoal, que só o dono do Ruditor emite.

## Como funciona

- `bin/ruditor.mjs` é a ponte (Node 18 ou mais novo, sem dependências). Ela fala
  MCP por stdio com o seu agente e repassa cada mensagem para o servidor do
  Ruditor (`https://srv1920751.hstgr.cloud:8444/api/mcp`).
- A conexão é TLS contra a CA do Ruditor que está neste repositório
  (`ca/ruditor-malha-ca.crt`, só o certificado público). A ponte recusa
  qualquer servidor que essa CA não tenha assinado.
- O servidor só responde a quem manda um token válido. Sem token, ou com token
  errado ou vencido, a chamada volta 401 ou 403. Cada token vale até 15 dias.
- Na sua máquina roda só a ponte. Tabelas, legislação e cálculos ficam no
  servidor.

## Claude Code

```
/plugin marketplace add CoutinhoGy/ruditor-plugin
/plugin install ruditor@ruditor
```

Ao ativar o plugin, o Claude Code pede o token e o guarda no armazenamento
seguro (não vai para o `settings.json`). Depois, `/mcp` deve mostrar o servidor
`ruditor` conectado, e a skill `usar-ferramentas-ruditor` já vem junto.

## Outros agentes

Clone o repositório e ponha o token numa variável de ambiente do seu shell
(`RUDITOR_TOKEN`), fora de qualquer arquivo versionado.

```
git clone https://github.com/CoutinhoGy/ruditor-plugin
```

Codex (`~/.codex/config.toml`):

```toml
[mcp_servers.ruditor]
command = "node"
args = ["/caminho/ruditor-plugin/bin/ruditor.mjs", "mcp"]
env_vars = ["RUDITOR_TOKEN"]
```

Gemini CLI (`~/.gemini/settings.json`). O `timeout` maior é para os lotes, que
levam minutos:

```json
{
  "mcpServers": {
    "ruditor": {
      "command": "node",
      "args": ["/caminho/ruditor-plugin/bin/ruditor.mjs", "mcp"],
      "env": { "RUDITOR_TOKEN": "$RUDITOR_TOKEN" },
      "timeout": 900000
    }
  }
}
```

Cursor, Claude Desktop e outros clientes que leem `mcpServers` em JSON usam a
mesma forma. Onde o cliente não expande variáveis, o valor do `env` fica
literal no arquivo; nesse caso mantenha o arquivo fora do controle de versão.

A skill segue o padrão Agent Skills. Copie `skills/usar-ferramentas-ruditor`
para a pasta de skills do agente (`.agents/skills/` no Codex, `.gemini/skills/`
no Gemini CLI, `.opencode/skills/` no opencode).

## Linha de comando

A mesma ponte serve de CLI:

```
node bin/ruditor.mjs saude
node bin/ruditor.mjs listar
node bin/ruditor.mjs chamar consultar_codigo tipo=cfop codigo=5405
node bin/ruditor.mjs chamar tributacao ncm=07020000 uf=RS regime=Normal --consentimento
```

`saude` confere TLS, token e protocolo de uma vez. O código de saída é 0 quando
deu certo, 1 quando a ferramenta respondeu com erro e 2 em erro de uso ou de
conexão.

## Dado de cliente (LGPD)

Oito ferramentas recebem dado de cliente e só rodam com `_consentimento=1`
(na CLI, `--consentimento`): `corrigir_planilha`, `corrigir_sped_icms`,
`corrigir_sped_contrib`, `consultar_ccg`, `classificar_ncm`, `tributacao`,
`ler_arquivo` e `consultar`. Mande dado de cliente só com autorização dele.

## Token

- Peça ao dono do Ruditor. Ele vale até 15 dias; vencido, a chamada volta 403
  e é preciso pedir outro.
- Nunca cole o token em conversa, issue ou arquivo versionado. O `.gitignore`
  deste repositório já ignora `.env` e `*.token`.

## Conteúdo

```
.claude-plugin/plugin.json        manifesto do plugin (pede o token)
.claude-plugin/marketplace.json   marketplace de um plugin só
bin/ruditor.mjs                   a ponte MCP e a CLI
ca/ruditor-malha-ca.crt           certificado público da CA do servidor
skills/usar-ferramentas-ruditor/  a skill do Ruditor Arc 1.0 e as referências
```
