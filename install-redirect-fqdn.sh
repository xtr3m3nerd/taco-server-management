#!/bin/bash

cat <<'EOT' > /home/ubuntu/redirect-fqdn.sh
#!/bin/bash
RECORD_ID=""
SUBDOMAIN=""
NAME_TOKEN=""
PUBLIC_IP=$(dig +short myip.opendns.com @resolver1.opendns.com)
#echo "The public IP is ${PUBLIC_IP}"
curl -u "${NAME_TOKEN}" "https://api.name.com/v4/domains/frenpier.com/records/${RECORD_ID}" -X PUT -H 'Content-Type: application/json' --data '{"host":"'"${SUBDOMAIN}"'","type":"A","answer":"'"${PUBLIC_IP}"'","ttl":300}'
EOT

chmod +x /home/ubuntu/redirect-fqdn.sh
chown ubuntu:ubuntu /home/ubuntu/redirect-fqdn.sh

cat <<'EOT' > /etc/systemd/system/redirect-fqdn.service
[Unit]
Description=Run once fix ip
After=local-fs.target
After=network.target

[Service]
ExecStart=/home/ubuntu/redirect-fqdn.sh
RemainAfterExit=true
Type=oneshot

[Install]
WantedBy=multi-user.target
EOT

