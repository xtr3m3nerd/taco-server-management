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

cat <<'EOT' > /home/ubuntu/install-cron.sh
#!/bin/bash

# Define the cron job entry
CRON_JOB="42 3 */14 * * certbot renew --quiet --post-hook \"systemctl reload nginx\""
CRON_JOB_TEMP_FILE="temp_cron"

# Check if the cron job entry already exists
if ! crontab -l | grep -F "$CRON_JOB"; then
  echo "Cron job not found. Adding the cron job."
  
  # Backup existing crontab content
  crontab -l > $CRON_JOB_TEMP_FILE

  # Append the new cron job entry
  echo "$CRON_JOB" >> $CRON_JOB_TEMP_FILE

  # Install the updated crontab
  crontab $CRON_JOB_TEMP_FILE

  # Remove the temporary cron job file
  rm $CRON_JOB_TEMP_FILE

  echo "Cron job added successfully."
else
  echo "Cron job already exists. No action taken."
fi
EOT

chmod +x /home/ubuntu/install-cron.sh
chown ubuntu:ubuntu /home/ubuntu/install-cron.sh
/home/ubuntu/install-cron.sh

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

