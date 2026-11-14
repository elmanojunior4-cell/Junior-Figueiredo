---
name: "edicao-premiere"
description: "Monta edições longas no Premiere Pro (filme de casamento, aftermovie, aniversário, palestra, vídeo de drone para imóvel) com XML primeiro e a ponte MCP do Premiere só para ajustes. Use quando o Júnior pedir uma edição dentro do Premiere ou uma sequência editável. Reels vertical entregue como MP4 pronto é com a edicao-reels-estilo-junior."
---

# Edição no Premiere Pro (estilo do Júnior)

O Júnior quer sempre uma sequência editável no Premiere ao lado do render, porque o acabamento criativo final é dele. A ponte MCP do Premiere é instável; os casamentos que deram certo foram montados por XML.

## Etapa 1 — Lista de takes aprovada ANTES de montar

Analise o material e entregue uma lista com timestamps:
- momentos-chave: entrada, votos, alianças, beijo, primeira dança, discursos (ou o equivalente do evento);
- o take escolhido para cada um, com nota de estabilidade (estável / leve tremida / tremido);
- duração planejada de cada plano.

**Espere o ok do Júnior antes de montar.** Primeiros cortes recusados por take tremido, beijo cortado ou ritmo picado custam uma rodada inteira de retrabalho.

## Etapa 2 — Montagem por XML (FCP7)

- Gere um XML FCP7 validado com a estrutura inteira: trilhas separadas para câmera A, câmera B, B-roll, música e voz.
- Subclips extensíveis, com 3 a 5 frames de sobra em cada ponta. Nunca corte palavra.
- O fps da sequência é o mesmo do material bruto. Confira depois de importar.
- Crie o bin de destino antes do import; sem ele o XML não entra.

## Etapa 3 — Ajustes pela ponte MCP

- **Uma chamada de escrita por vez.** Nunca dispare chamadas em paralelo: a ponte aceita uma escrita por salvamento.
- Antes de começar, verifique se outra sessão do Claude está usando a ponte. Se estiver, avise o Júnior.
- **Nunca mate o processo prpr** nem o Premiere para "consertar" conexão. Peça ao Júnior para reabrir o painel.
- Erro "script object is no longer valid" ou a mesma ferramenta falhando 2 vezes seguidas: pare de insistir. Gere um XML para o trecho ou diga exatamente o passo que o Júnior precisa fazer à mão.
- **Nunca copie nem duplique o .prproj.** Trabalhe no projeto aberto e duplique sequências.

## Gosto de edição (casamentos e eventos)

- Um casamento tem quatro entregas: cerimônia completa, making of completo, recepção completa e um wedding film de 3 a 5 minutos. Cerimônia, making of e recepção são documentais e completas; não as transforme em trailer.
- Planos longos, que respiram. Evite sequências de cortes rápidos fora de montagem.
- **Emoção vem antes da nota técnica.** Se dois takes têm a mesma emoção, use o estável. Se o take tremido ou imperfeito tem uma emoção que o estável não tem, use o tremido e marque na lista de takes ("tremido, mas é o único com o choro da mãe") para o Júnior decidir.
- Momentos-chave inteiros, com pelo menos 1,5 s de folga antes e depois.
- Tire respirações e pausas longas da fala. Música com ducking sob a voz.
- Correção de cor sem estourar: confira tom de pele e altas luzes.
- Nomes com acento exatamente como o Júnior escreveu (Ísis, não Isis) em qualquer texto na tela.

## Etapa 4 — Conferência final

Antes de dizer que terminou:
1. `ffprobe` no render: resolução, fps, duração e trilha de áudio presente.
2. Loudness em torno de -14 LUFS; música pelo menos 10 dB abaixo da voz.
3. Re-transcrever o render e conferir que nenhum corte pegou palavra no meio.
4. Confirmar que os arquivos estão no caminho final.
5. Entregar uma tabela curta: FEITO / PENDENTE / O QUE O JÚNIOR PRECISA FAZER À MÃO.
