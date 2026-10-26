# AUDITAR: o ofício do contador tributário

O contador tributário confere o que foi feito contra o que a norma manda, item
por item, e diz quanto custa cada diferença. A NBC TA 200 pede julgamento
profissional e ceticismo; a NBC TA 500 pede evidência suficiente e apropriada.
No Arc isso vira três regras: o declarado é afirmação a conferir, cada achado
leva dispositivo e trecho lido, e a fila se ordena pelo impacto fiscal. As
referências completas estão em `FONTES.md`.

## 1. Três fontes para cada item

| fonte | diz | no Ruditor |
|---|---|---|
| documento (XML da NF-e/NFC-e) | o que aconteceu na operação | `ler_arquivo` |
| escrituração (SPED, planilha do cliente) | o que foi declarado | `ler_arquivo`, `corrigir_sped_*`, `corrigir_planilha` |
| norma vigente na data do fato | o que deveria ter acontecido | `tributacao`, `consultar_lei`, `calcular` |

Documento e escrituração divergem: erro de escrituração. Os dois concordam e a
norma diz outra coisa: erro de tributação. A distinção importa porque o
conserto e a consequência são diferentes.

## 2. A ordem da conferência

1. **Identificação.** UF, regime (Normal ou Simples), atividade e período. Sem o
   regime não se sabe se o código certo é CST ou CSOSN (LC 123/2006, art. 13;
   tabelas do Convênio s/nº de 1970). Sem a apuração do PIS/COFINS (cumulativa
   ou não) não se sabe a alíquota.
2. **NCM.** `classificar_ncm` antes de tudo. NCM errado contamina CST,
   alíquota, CEST, ST e IBS/CBS ao mesmo tempo.
3. **Tributação por item.** `tributacao`: CST/CSOSN, alíquota, base, redução,
   ST, FECOP, CEST, IBS/CBS.
4. **CFOP.** `consultar_codigo`: coerente com a operação (interna × interestadual,
   com ou sem ST, devolução, remessa).
5. **Valores.** `calcular`: base, imposto, ST com MVA, DIFAL. Nunca conta de
   cabeça.
6. **Federais.** IPI (`consultar_ipi`), PIS/COFINS (monofásico × normal), IS
   quando cobrado.

## 3. A direção do erro

| erro | o que significa para o cliente | o que o Arc diz |
|---|---|---|
| subtributação (isenção sem condição, ST onde não há, alíquota menor) | imposto devido, com juros e multa | o valor certo, o dispositivo, desde quando, e que é passivo |
| sobretributação (tributou o isento, pagou duas vezes na ST) | crédito a recuperar: restituição em 5 anos contados da extinção do crédito (CTN arts. 165 e 168) | o valor e a base legal; no ICMS, que a restituição exige provar que o encargo foi assumido, ou autorização de quem o assumiu (CTN art. 166) |
| código errado com a mesma carga (NCM vizinho, CEST errado) | obrigação acessória; risco de multa formal | corrigir o cadastro |
| crédito tomado sobre entrada isenta | estorno (CF art. 155, § 2º, II) | o estorno e o dispositivo |

Ordene a fila pelo impacto: diferença de carga × valor da operação. Um item de
alto giro com 5 pontos de diferença vem antes de cem itens com erro de CEST.

## 4. Auditar por afirmação

Cada item de documento vira afirmações independentes: "NCM é X", "CST é 060",
"alíquota é 18%", "CEST é Y", "CFOP é 5405". Cada uma recebe seu veredito
(VERDADEIRO, FALSO, PARCIAL, NÃO VERIFICÁVEL, DIVERGÊNCIA NA FONTE; SKILL §4).
Um item com NCM verdadeiro e CST falso é um achado, não dois itens "meio
certos".

## 5. Auditar a própria legislação

A tabela que o motor usa foi tirada de textos que mudam, se acumulam e às
vezes se contradizem. Auditar a lei é conferir se o texto que sustenta a
resposta vale de fato na data do fato. A lista abaixo saiu de casos reais.

| o que procurar | como aparece | o que fazer |
|---|---|---|
| lei × regulamento | o RICMS diz uma alíquota e a lei da UF diz outra (AM: 18% × 20%) | vale a lei (CTN art. 99); registrar a divergência |
| texto × tabela curada | a tabela tem o item e o texto não, ou o contrário | vale o texto; `exame acao=propor` |
| oficial × agregador | o agregador traz redação antiga, sem a nota de revogação | vale o oficial; agregador só para achar. Quando o portal oficial não publica, ler a cópia marcada como não oficial e buscar o diário oficial |
| revogado ainda impresso | o rótulo "(REVOGADA)" vem antes do texto (PR, Anexo IX) ou a nota vem depois do texto que ela mata (GO, RCTE) | ler a nota de cada item; ler de cima para baixo ressuscita item morto |
| redações acumuladas | o regulamento guarda todas as redações desde a edição (GO desde 1998) | escolher a redação vigente na data do fato |
| sustação | decreto legislativo suspende ato do Executivo que exorbita o poder regulamentar (CF art. 49, V, e o equivalente estadual); em RR os anexos de ST de 2016 foram sustados e seguem impressos | o ato sustado não vale; usar a redação anterior |
| inaplicabilidade dentro do rol | MG imprime itens com CEST e MVA sob o título "Inaplicabilidade do regime de Substituição Tributária" | estar no anexo não basta; ler o âmbito de aplicação do item |
| revogação em bloco | o SC revogou 15 dos 26 segmentos de ST; o MA revogou um anexo e catorze subanexos seis meses depois; os PDFs seguem publicados | conferir cada segmento contra a norma revogadora antes de usar o rol |
| remissão a lista morta | o artigo segue mandando aplicar a ST "às mercadorias do Apêndice X", e o Apêndice X foi revogado (GO) | a remissão não ressuscita a lista |
| convênio autorizativo | "ficam os Estados autorizados" | só vale na UF que o internalizou (CF art. 150, § 6º; LC 24/1975) |
| condição no caput | a lista de produtos é a mesma da UF vizinha, mas o caput restringe o sujeito ou o local (MA, hortifrutícolas) | aplicar a condição; o rol sozinho não basta |
| benefício opcional | "opcionalmente" no texto (PR, cesta) | só para quem optou; perguntar |
| vigência futura ou efeitos diferidos | "produzindo efeitos a partir de..." | não aplicar a fato anterior |
| errata e republicação | o texto foi republicado por incorreção | vale o republicado, a partir da data da republicação |

O veredito de cada dispositivo auditado é um destes: VIGENTE (com a data da
leitura), REVOGADO (por qual norma, desde quando), SUSTADO, NÃO INTERNALIZADO
ou CONFLITO. Conflito vai a exame com os dois lados. A auditoria nunca promove
nada sozinha para a tabela.

### A lei da ausência

Só se afirma que uma UF não tem um instituto (não tem cesta básica, não tem
FECOP, não tem ST para um segmento) quando há dispositivo dizendo isso, ou a
norma revogadora. Não ter achado é "não pesquisado", nunca "não existe".

## 6. O que cada achado leva

- o dispositivo e o trecho lido, com a data da leitura e a URL oficial;
- o valor declarado, o valor certo e a diferença, calculada por ferramenta;
- a direção (passivo ou crédito) e a consequência;
- o que mudaria o achado (uma condição não provada, uma data incerta).

Na distribuição do ônus (Tomé), quem alega o fato constitutivo do seu direito
prova. Para o auditor, isso quer dizer que o achado se prova com documento e
norma, e que a condição de um benefício se prova por quem o usa (CTN art. 179).
Sem prova da condição, o achado sai pelo lado seguro e o ramo mostra o que
mudaria com a prova.
