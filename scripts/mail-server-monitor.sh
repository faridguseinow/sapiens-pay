#!/usr/bin/env bash
set -euo pipefail

STATE_DIR=/var/lib/sapiens-mail-monitor
STATE_FILE="$STATE_DIR/last-state"
BACKUP_DIR=/srv/mailcow-backups
MAILCOW_DIR=/opt/mailcow-dockerized
install -d -m 700 "$STATE_DIR"

issues=()
disk_used=$(df --output=pcent / | tail -1 | tr -dc '0-9')
(( disk_used < 80 )) || issues+=("Disk istifadəsi ${disk_used}%")

if ! find "$BACKUP_DIR" -mindepth 1 -maxdepth 1 -type d -mmin -2160 -print -quit | grep -q .; then
  issues+=("Son 36 saatda backup tapılmadı")
fi

cd "$MAILCOW_DIR"
bad_containers=$(docker compose ps --format json | jq -r 'select(.State != "running" or (.Health != "" and .Health != "healthy")) | .Service' | paste -sd, -)
[[ -z "$bad_containers" ]] || issues+=("Problemli konteynerlər: ${bad_containers}")

queue_size=$(docker compose exec -T postfix-mailcow postqueue -p 2>/dev/null | awk '/-- [0-9]+ Kbytes in [0-9]+ Request/ {print $(NF-1)} END {if (NR==0) print 0}' | tail -1)
[[ "$queue_size" =~ ^[0-9]+$ ]] || queue_size=0
(( queue_size < 50 )) || issues+=("Mail növbəsində ${queue_size} məktub var")

cert_end=$(openssl s_client -connect mail.sapiens-pay.com:443 -servername mail.sapiens-pay.com </dev/null 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
cert_epoch=$(date -d "$cert_end" +%s)
(( cert_epoch - $(date +%s) > 1209600 )) || issues+=("TLS sertifikatının bitməsinə 14 gündən az qalıb")

state="ok"
if ((${#issues[@]})); then state=$(printf '%s;' "${issues[@]}"); fi
previous=$(cat "$STATE_FILE" 2>/dev/null || true)
printf '%s' "$state" > "$STATE_FILE"

send_telegram() {
  [[ -n "${TELEGRAM_BOT_TOKEN:-}" && -n "${TELEGRAM_CHAT_ID:-}" ]] || return 0
  curl -fsS --max-time 10 "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" \
    --data-urlencode "parse_mode=HTML" \
    --data-urlencode "text=$1" >/dev/null
}

if [[ "$state" != "$previous" ]]; then
  if [[ "$state" == ok ]]; then
    [[ -z "$previous" || "$previous" == ok ]] || send_telegram "🟢 <b>Sapiens Mail bərpa olundu</b>\nBütün server yoxlamaları normaldır."
  else
    message=$(printf '• %s\n' "${issues[@]}")
    send_telegram "🔴 <b>Sapiens Mail server xəbərdarlığı</b>\n\n${message}"
  fi
fi
