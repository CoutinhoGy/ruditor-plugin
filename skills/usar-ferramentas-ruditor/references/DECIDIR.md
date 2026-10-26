# DECIDIR: responder, perguntar ou "depende", e com quanto cuidado

Decide a IA que chama. O usuário entra quando a resposta depende de um fato que
só ele sabe (quem vende, a quem, se optou, se cumpre a condição). As
referências completas estão em `FONTES.md`.

## 1. Perguntar só o que muda a resposta

Uma pergunta vale pelo que a resposta dela muda (valor esperado da informação
perfeita; Rao e Daumé, 2018). Perguntar quando há ambiguidade de verdade melhora
a resposta sem piorar as perguntas claras (Kuhn, Gal e Farquhar, 2022).

| a variável que falta... | e o usuário... | você faz |
|---|---|---|
| muda o número | está na conversa | pergunta antes, com as opções e o que cada uma dá |
| muda o número | não está (lote, relatório) | responde pelo lado seguro com `depende` e os ramos |
| não muda o número | qualquer | assume, declara a suposição e segue |
| você mesmo sabe a resposta (está nos ramos, no documento, na sessão) | qualquer | responde você; não devolve ao usuário o que já sabe |

A lista de perguntas legítimas é fechada: UF, regime, tipo de quem vende,
condição do catálogo da UF, origem da mercadoria, destinatário e finalidade no
DIFAL, Ex da TIPI. A chave de condição que não está no catálogo é erro de uso.

## 2. O lado seguro

O lado seguro é aquele cujo erro aparece e se corrige.

- Benefício (isenção, redução, crédito presumido) sem condição provada fica de
  fora (CTN arts. 111 e 179). Benefício indevido vira passivo com multa e só
  aparece na fiscalização. Tributo a mais aparece na nota e se recupera
  (CTN arts. 165 e 168).
- Infração e penalidade, na dúvida, pela leitura mais favorável ao acusado
  (CTN art. 112). Isso vale para a multa, não para o tributo.
- Quem seguiu norma complementar não responde por penalidade, juros e
  atualização (CTN art. 100, parágrafo único). Se o cliente seguiu um ato
  normativo que depois mudou, diga isso.
- Mudança de critério da administração só alcança fato posterior (CTN art. 146).

O lado seguro escolhe o número a mostrar primeiro. O outro ramo sai junto, com
o dispositivo e o que precisaria ser provado para valer.

## 3. "Depende" bem dito

```
<veredito pelo lado seguro>, porque <dispositivo>.
Se <condição>, então <outro resultado> (<dispositivo>).
O que decide: <a pergunta>, com as opções.
```

Exemplo de forma, para o arroz no CE: "Sai CST 20, com a redução de base da cesta
(<dispositivo>). Se a loja for de carga líquida, sai CST 60 (<dispositivo>). O que decide: a loja recolhe
na entrada pelo CNAE?". Os dispositivos vêm da ferramenta, nunca da memória.

## 4. Quanto verificar: o risco de 1 a 5

Antes do primeiro passo, estime quanto custa errar.

| risco | exemplo | verificação |
|---|---|---|
| 1 | conceito ("o que é DIFAL?") | resposta direta; ferramenta se houver índice |
| 2 | código (o que é o CFOP 5405) | 1 ferramenta |
| 3 | tributação de um item | ferramenta com dispositivo; conferir a vigência |
| 4 | número que muda a carga do cliente, fato passado, benefício | ferramenta + trecho lido + busca contrária (`DUVIDA-E-CERTEZA.md`, §3) |
| 5 | lote, SPED corrigido, valor alto, contingência | tudo do 4 + escada da certeza por afirmação + exame se houver conflito |

## 5. Pensar só quando há bifurcação

Pergunta fácil: 1 ferramenta, resposta curta, nada à mostra. Raciocínio
estruturado só quando há bifurcação (várias afirmações ou várias
ferramentas); em escolha simples ele piora (arXiv 2603.25944: +8,5 pp em
entailment, −16 pp em múltipla escolha). Use esquema fixo e curto, com campos,
e confira que cada afirmação recebeu veredito.

### Esquema de auditoria

```
afirmações:  A1 "..."   A2 "..."
campos:      UF=.. (dito) · regime=? (suposição: ..) · data=..
conferir:    A1 -> ferramenta(args)   A2 -> ferramenta(args)
```

### Esquema de cálculo

```
cálculo:         <fórmula e direção>
valores ditos:   ...
a obter:         <parâmetros de ferramenta, cada um com dispositivo>
faltam:          <o que muda a base> → pergunta de volta ou suposição declarada
```

### Esquema de pesquisa profunda

```
plano:   as perguntas que a resposta tem de fechar (lista)
rodadas: busca → leitura → nova busca a partir do que leu
entrega: relatório com seções e fontes; progresso por etapa
```

## 6. As cabeças

Antes do primeiro passo, decida o conjunto: as intenções (conceito, fato,
cálculo, auditoria, pesquisa, arquivo, classificar, fora do domínio, social;
mais de uma acesa vai pelo caminho deliberado), a ferramenta ou "nenhuma", o
campo que falta (só da lista do §1), se precisa pesquisar (a base basta?), se
precisa pensar (há bifurcação?) e o risco de 1 a 5. Depois da resposta, a
confiança final: baixa vira "não tenho certeza" e o que faltaria. As cabeças
decidem o caminho, nunca o fato.

## 7. Registrar o que se decidiu

Roberts (1998) propôs um modelo de como o contador tributário decide, que a
literatura seguinte usou para organizar os estudos da área; nessa pesquisa, o
ambiente (o cliente, a preferência dele) entra no julgamento (ver também
Cloyd e Spilker, 1999). Por isso o Arc separa quem pergunta do que a lei diz e
deixa rastro: a decisão com o fundamento vai à trilha; o conflito vai ao
`exame`, e a decisão do exame nunca promove sozinha para a tabela.

Decisão com valores abstratos considera as consequências práticas (LINDB
art. 20). Cada ramo da resposta diz o que acontece com o cliente: multa,
crédito, passivo ou nada.
