#!/bin/bash

declare -r GREEN='\033[0;32m'
declare -r RED='\033[0;31m'
declare -r NC='\033[0m'

podfileSha=$(openssl sha1 ios/Podfile | awk '{print $2}')
podfileLockSha=$(awk '/PODFILE CHECKSUM: /{print $3}' ios/Podfile.lock)

echo "Podfile: $podfileSha"
echo "Podfile.lock: $podfileLockSha"

if [ "$podfileSha" == "$podfileLockSha" ]; then
    echo -e "${GREEN}Podfile verified!${NC}"
else
    echo -e "${RED}Error: Podfile.lock out of date with Podfile. Did you forget to run \`npx pod-install\`?${NC}"
    exit 1
fi

# Make sure Podfile.lock is synced with podspecs from npm packages

PODSPECS=$( \
  jq --raw-output --slurp 'map((.name + " (" + .version + ")")) | .[]' <<< "$( \
    npx react-native config | \
    jq '.dependencies[].platforms.ios.podspecPath | select( . != null )' | \
    xargs -L 1 pod ipc spec --silent
  )"
)

while read -r SPEC; do
  if ! grep -q "$SPEC" ./ios/Podfile.lock; then
    echo -e "${RED}ERROR: Podspec $SPEC not found in Podfile.lock. Did you forget to run \`pod install\`?"
    exit 1
  fi
done <<< "$PODSPECS"

echo -e "${GREEN} Podfile.lock is synced with podspecs."
exit 0
