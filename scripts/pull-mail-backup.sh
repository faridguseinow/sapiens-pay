#!/usr/bin/env bash
set -euo pipefail

SERVER="root@169.58.47.239"
REMOTE_DIR="/srv/mailcow-backups"
LOCAL_DIR="${HOME}/Sapiens-Mail-Backups"
KEYCHAIN_SERVICE="Sapiens Mail Offsite Backup"

install -d -m 700 "$LOCAL_DIR"
password=$(security find-generic-password -a "$USER" -s "$KEYCHAIN_SERVICE" -w)
latest=$(ssh -o BatchMode=yes "$SERVER" "find '$REMOTE_DIR' -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort | tail -1")
[[ -n "$latest" ]] || { echo "Remote backup tapılmadı"; exit 1; }
target="$LOCAL_DIR/${latest}.tar.enc"
[[ -f "$target" ]] && exit 0
temporary="${target}.partial"
export SAPIENS_BACKUP_PASSWORD="$password"
ssh -o BatchMode=yes "$SERVER" "tar -C '$REMOTE_DIR' -cf - '$latest'" \
  | openssl enc -aes-256-cbc -salt -pbkdf2 -iter 200000 -pass env:SAPIENS_BACKUP_PASSWORD -out "$temporary"
mv "$temporary" "$target"
chmod 600 "$target"
openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 -pass env:SAPIENS_BACKUP_PASSWORD -in "$target" 2>/dev/null \
  | tar -tf - >/dev/null
echo "Encrypted offsite backup verified: $target"
