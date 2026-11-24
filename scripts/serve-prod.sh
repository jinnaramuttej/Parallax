#!/usr/bin/env bash
# Rebuild and (re)start a local production server on port 3100.
PID=$(netstat -ano | grep -E "[:.]3100 .*LISTENING" | awk '{print $NF}' | head -1)
[ -n "$PID" ] && taskkill //PID "$PID" //F >/dev/null 2>&1
npm run build >/dev/null 2>&1 || { echo "build failed"; exit 1; }
(npx next start -p 3100 >/dev/null 2>&1 &)
for i in $(seq 1 30); do curl -s -o /dev/null http://localhost:3100 && break; sleep 1; done
echo "serving production build on http://localhost:3100"
