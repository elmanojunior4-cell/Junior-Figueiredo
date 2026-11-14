---
name: "edicao-reels-estilo-junior"
description: "Edita vídeo vertical já gravado (Reels/Stories) no estilo do Júnior: melhores takes, J-cuts, legendas animadas na cor da marca, card animado, trilha suave, whoosh e card final, entregando o MP4 pronto. Use sempre que ele mandar um arquivo de vídeo para editar; prefira esta à capcut e à descript. Roteiro de vídeo ainda não gravado é com a ig-reel."
---

# Edição de Reels no estilo do Júnior Figueiredo

Use sempre que o Júnior mandar um vídeo bruto (ou já pré-editado por ele) pedindo edição, legendas, trilha, efeitos ou card final. Faça o trabalho inteiro por código (ffmpeg + Python) e entregue o MP4 pronto. Responda em português.

## O estilo que ele aprovou (padrão — siga sem perguntar)

1. **Formato:** vertical 1080x1920, H.264, AAC 192k, faststart. Vídeo de iPhone vem em 4K HEVC rotacionado — gere antes um proxy 1512x2688 (crf 12) para não estourar memória.
2. **Seleção de takes:** manter só os melhores momentos. Remover erros, repetições, "vamos de novo", "segura, peraí" e **toda fala do próprio Júnior orientando o apresentador fora de cena** (ex.: "vai, só finaliza", "contamos com você" dito por ele, "não é isso?", "mas, ó"). Na dúvida se uma voz é dele, pergunte.
3. **Nunca cortar palavra:** medir energia em janelas de 20 ms com limiar baixo (~-45 dB) em volta de cada corte; dar folga de 0,1–0,2 s. Palavras finais ditas baixinho (ex.: "Cultura") são as que mais somem — conferir.
4. **J-cuts:** em todo corte, o áudio do trecho seguinte entra ~0,4 s antes da imagem (vídeo do trecho anterior estende 0,4 s; vídeo do próximo começa 0,4 s depois).
5. **Enquadramento:** variar com punch-in (zoom 1,15–1,4) nos planos abertos para dar ritmo, sem cortar rostos.
6. **Correção de cor (ele gostou):** `eq=contrast=1.05:saturation=1.12`.
7. **Legendas animadas** (palavra por palavra, 2–3 palavras por bloco, MAIÚSCULAS, Poppins Bold ~96 px, MarginV 560):
   - Caixa sólida na cor escura da marca do cliente (BorderStyle 3, Outline 16, sem sombra).
   - Palavra falada na cor de destaque da marca, com "pop" (escala 100→122→112% em 180 ms); bloco entra com escala 70→104→100%.
   - Palavras-chave (marca, datas, local, tema) 110% maiores.
   - Sicoob/Sicoob Copersul: verde escuro #003641 (caixa), verde claro #C9D200 (destaque), turquesa #00AE9D (detalhes). Grafia correta: "Sicoob Copersul".
8. **Card animado para informação-chave** (datas, horário, local): caixa arredondada na cor escura da marca, número grande no destaque, linha fina turquesa; entra com zoom-pop + "pop" sonoro e sininho; posicionado na altura do corpo, nunca sobre rostos; some quando a fala termina.
9. **Trilha de fundo bem suave:** compor original em numpy (sem problema de direitos): pad + arpejo de piano/pluck + baixo leve + shaker discreto, ~92 bpm, progressão I–V–vi–IV. Volume ~-16 dB, sidechain ducking pela voz (threshold 0.04, ratio 6), aecho leve. Fica ~14 dB abaixo da voz.
10. **Transições:** whoosh (ruído com filtro varrendo, pico no corte, pan L→R) + punch-zoom rápido de 7% que decai em ~0,15 s em cada corte (`scale=...:eval=frame` + `crop=1080:1920`).
11. **Card/arte final:** quando houver arte do evento, entrar no final com crossfade de 0,5 s + whoosh, 5 s na tela com zoom lento (zoompan 1→1,04) e fade out. **A música continua até o fim — o final nunca pode ficar mudo.**
12. **Áudio:** voz com highpass 80 Hz, compressor leve, loudnorm I=-14 a -15 LUFS, TP -1,5; alimiter no mix.

## Fluxo de trabalho

1. `ffprobe` (duração, rotação, áudio). Contact sheet com timestamps (1 fps) para ver quem fala e onde estão os takes.
2. **Transcrição:** HuggingFace é bloqueado. Baixar o Whisper Turbo do GitHub: `https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-turbo.tar.bz2` e `pip install --break-system-packages sherpa-onnx soundfile`. Segmentar por silêncio (`silencedetect=n=-32dB:d=0.25`) e transcrever cada frase; janelas maiores dão texto mais correto. Tempo das palavras: distribuir proporcional ao tamanho dentro de cada frase (frases curtas = boa sincronia).
3. Corrigir nomes com contexto (crachás no vídeo, memória do cliente). Na dúvida sobre um nome/cargo, usar o mais provável e avisar o Júnior.
4. Montar lista de clipes (in/out de áudio, zoom, centro). Usar **uma entrada ffmpeg por clipe com -ss/-t** (trim de um único input estoura memória).
5. Gerar ASS (legendas + card), música e SFX em WAV, renderizar tudo num filter_complex.
6. **Conferir sempre:** re-transcrever o MP4 final (nenhuma palavra cortada, nenhuma fala do Júnior vazando), ver frames dos cortes e do card, medir LUFS e o nível da música nas pausas.
7. Entregar com SendUserFile (limite 30 MB por arquivo — dividir se precisar). Resumo curto do que mudou.

## Quando ele quiser editar sozinho

CapCut não aceita projeto gerado externamente. Entregar: vídeo limpo sem legenda, trechos separados na ordem, `legendas.srt`, card em PNG transparente, camada de legendas transparente em ProRes 4444 (qscale ~24, dividida em partes <30 MB) e um LEIA-ME com o passo a passo e as cores. Para Premiere: XML FCP7 com cortes, J-cuts e escala.

## Quando ele mandar um vídeo já editado por ele

Respeitar os cortes dele. Detectar os cortes por diferença de frames (baixa resolução, pico >> mediana) e aplicar só o acabamento: legendas, card, trilha, whoosh + punch-zoom nos cortes e card final se houver arte.