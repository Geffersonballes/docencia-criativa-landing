#!/usr/bin/env bash
# Confere se o site publicado já serve o index.html local, e testa a prévia e o certificado.
# Uso: bash conferir-publicado.sh [pasta-do-repositório] [tentativas]
# Cada tentativa espera 15 s; o GitHub Pages costuma publicar em cerca de 45 s depois do push.
set -u
REPO="${1:-.}"
TENTATIVAS="${2:-12}"
DOMINIO=$(tr -d ' \r\n' < "$REPO/CNAME")
URL="https://$DOMINIO/"
LOCAL=$(sha256sum < "$REPO/index.html")

for i in $(seq 1 "$TENTATIVAS"); do
  # o parâmetro muda a cada tentativa para não pegar uma cópia antiga em cache
  REMOTO=$(curl -sS --max-time 20 "${URL}?conferencia=$i$RANDOM" | sha256sum)
  if [ "$REMOTO" = "$LOCAL" ]; then
    echo "no ar: $URL é igual ao index.html local (tentativa $i)"
    break
  fi
  if [ "$i" = "$TENTATIVAS" ]; then
    echo "AINDA NÃO: depois de $TENTATIVAS tentativas, $URL não serve o index.html local"
    exit 1
  fi
  sleep 15
done

curl -sS --max-time 20 -o /dev/null -w "previa.jpg: HTTP %{http_code}, %{content_type}, %{size_download} bytes\n" "${URL}previa.jpg"
curl -sv --max-time 20 -o /dev/null "$URL" 2>&1 | grep -iE 'subject:|expire date' | sed 's/^\* */certificado: /'
