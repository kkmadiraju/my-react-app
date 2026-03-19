#!/bin/sh
set -eu

cat <<EOF >/usr/share/nginx/html/config.js
window.__APP_CONFIG__ = {
  apiBaseUrl: "${CALC_API_BASE_URL:-http://localhost:8080}"
};
EOF
