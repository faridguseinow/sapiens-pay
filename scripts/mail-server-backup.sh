#!/usr/bin/env bash
set -euo pipefail

MAILCOW_DIR="${MAILCOW_DIR:-/opt/mailcow-dockerized}"
BACKUP_LOCATION="${MAILCOW_BACKUP_LOCATION:-/srv/mailcow-backups}"
RETENTION_DAYS="${MAILCOW_BACKUP_RETENTION_DAYS:-14}"

if [[ ! -x "${MAILCOW_DIR}/helper-scripts/backup_and_restore.sh" ]]; then
  echo "Mailcow backup script not found in ${MAILCOW_DIR}."
  exit 1
fi

# Mailcow's backup helper deliberately verifies that the target directory is
# traversable and writable by the container process it starts. 0755 satisfies
# that check while files created inside remain owned by root.
install -d -m 755 "${BACKUP_LOCATION}"
export MAILCOW_BACKUP_LOCATION="${BACKUP_LOCATION}"
"${MAILCOW_DIR}/helper-scripts/backup_and_restore.sh" backup all --delete-days "${RETENTION_DAYS}"
