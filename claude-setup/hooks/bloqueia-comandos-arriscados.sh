#!/bin/bash
# Hook PreToolUse (Bash): bloqueia comandos que já causaram estrago nas sessões do Júnior.
# - matar o servidor prpr / Premiere (forçou reinício do app)
# - apagar ou formatar disco (HDs de casamento são insubstituíveis)
# - ffmpeg com apad sem limite (gerou arquivo infinito e encheu o disco)
# Sem dependências: lê o JSON do hook como texto, não precisa de jq nem python.

input="$(cat)"

bloquear() {
  echo "Bloqueado pelo hook de segurança: $1 Explique ao Júnior o que pretende fazer e peça autorização." >&2
  exit 2
}

if printf '%s' "$input" | grep -Eiq '(pkill|killall|kill)[^|;&]{0,80}(prpr|premiere)'; then
  bloquear "matar o Premiere ou o servidor prpr derruba a ponte e obriga a reiniciar o app. Peça para reabrir o painel."
fi

if printf '%s' "$input" | grep -Eiq 'diskutil[^|;&]{0,40}(erase|reformat|partitionDisk|zeroDisk|randomDisk)|newfs_|rm -[a-z]*r[a-z]* [^|;&]{0,10}/Volumes/'; then
  bloquear "apagar ou formatar disco/volume externo."
fi

if printf '%s' "$input" | grep -q 'apad' && ! printf '%s' "$input" | grep -Eq 'shortest|whole_dur|pad_dur|whole_len|pad_len'; then
  bloquear "apad sem limite gera áudio infinito e enche o disco. Use -shortest ou whole_dur/pad_dur."
fi

exit 0
