#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root."
  exit 1
fi

if ! grep -qi ubuntu /etc/os-release; then
  echo "This bootstrap supports Ubuntu only."
  exit 1
fi

HOSTNAME_FQDN="${MAIL_HOSTNAME:-mail.sapiens-pay.com}"
export DEBIAN_FRONTEND=noninteractive

hostnamectl set-hostname "${HOSTNAME_FQDN}"
apt-get update
apt-get -y upgrade
apt-get install -y ca-certificates curl git jq openssl chrony unattended-upgrades

cat >/etc/sysctl.d/99-mailcow.conf <<'EOF'
fs.inotify.max_user_watches=524288
fs.inotify.max_user_instances=512
vm.swappiness=10
EOF
sysctl --system >/dev/null

timedatectl set-timezone UTC
systemctl enable --now chrony
systemctl enable --now unattended-upgrades

install -d -m 700 /root/.ssh
chmod 600 /root/.ssh/authorized_keys 2>/dev/null || true

echo "Preflight complete for ${HOSTNAME_FQDN}."
echo "Next: verify PTR, ports, IP reputation and install Mailcow."

