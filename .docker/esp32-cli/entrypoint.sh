#!/bin/bash

. /opt/esp/entrypoint.sh

if [ -z "$AGENT_PROJ" ]; then
    printf "AGENT_PROJ variable is not set. Please set AGENT_PROJ variable.\e[m\n"
    exit 1
fi

if [ -z "$HOST_SSH_KEY" ]; then
    printf "HOST_SSH_KEY variable is not set. Please set HOST_SSH_KEY variable.\e[m\n"
    exit 1
fi

echo "AGENT_PROJ=$AGENT_PROJ" > /etc/profile
echo "HOST_SSH_KEY=$HOST_SSH_KEY" >> /etc/profile
echo "PATH=$PATH" >> /etc/profile
echo "export AGENT_PROJ" >> /etc/profile
echo "export HOST_SSH_KEY" >> /etc/profile
echo "export PATH" >> /etc/profile

echo "Initializing SSH..."
mkdir -p /root/.ssh 2>/dev/null || true

echo "> Copying SSH key..."
touch /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
cat $HOST_SSH_KEY > /root/.ssh/authorized_keys

echo "Copying Scripts..."
mkdir /opt/esp-cli 2>/dev/null || true
echo "> gdb-agent.sh"
cp /tmp/gdb-agent.sh /opt/esp-cli/gdb-agent.sh
chmod +x /opt/esp-cli/gdb-agent.sh


echo "Starting sshd..."
exec /usr/sbin/sshd -D