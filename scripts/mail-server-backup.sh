#!/usr/bin/env bash
set -euo pipefail

MAILCOW_DIR="${MAILCOW_DIR:-/opt/mailcow-dockerized}"
BACKUP_LOCATION="${MAILCOW_BACKUP_LOCATION:-/srv/mailcow-backups}"
RETENTION_DAYS="${MAILCOW_BACKUP_RETENTION_DAYS:-30}"

if [[ ! -x "${MAILCOW_DIR}/helper-scripts/backup_and_restore.sh" ]]; then
  echo "Mailcow backup script not found in ${MAILCOW_DIR}."
  exit 1
fi

install -d -m 700 "${BACKUP_LOCATION}"
export MAILCOW_BACKUP_LOCATION="${BACKUP_LOCATION}"
"${MAILCOW_DIR}/helper-scripts/backup_and_restore.sh" backup all --delete-days "${RETENTION_DAYS}"

