#!/usr/bin/env bash
# Gera as falas da narração com a voz Letícia-F123 (RHVoice, CC BY-SA 4.0).
# Requer: apt install rhvoice rhvoice-brazilian-portuguese
# Cada linha de vo/roteiro.tsv vira vo/<id>.wav (o instante de cada fala está em motion.html, lista VO).
set -euo pipefail
cd "$(dirname "$0")"
while IFS=$'\t' read -r id texto; do
  [ -z "$id" ] && continue
  echo "$texto" | RHVoice-test -p Leticia-F123 -r 92 -o "vo/$id.wav" >/dev/null
  echo "vo/$id.wav  <- $texto"
done < vo/roteiro.tsv
