#!/usr/bin/env bash
# Executa a migração e os testes de RLS num PostgreSQL temporário.
# Requer os binários do PostgreSQL (initdb, pg_ctl, psql) no PATH ou em PG_BIN.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
PG_BIN="${PG_BIN:-$(dirname "$(command -v initdb 2>/dev/null || echo /usr/lib/postgresql/16/bin/initdb)")}"
TMP="$(mktemp -d)"
PORT="${PGTEST_PORT:-54329}"
cleanup() { "$PG_BIN/pg_ctl" -D "$TMP/data" -m immediate stop >/dev/null 2>&1 || true; rm -rf "$TMP"; }
trap cleanup EXIT
if [ "$(id -u)" = "0" ]; then RUNAS=(runuser -u postgres --); chown -R postgres "$TMP" 2>/dev/null || { useradd -r postgres; chown -R postgres "$TMP"; }; else RUNAS=(); fi
"${RUNAS[@]}" "$PG_BIN/initdb" -D "$TMP/data" -U postgres >/dev/null
"${RUNAS[@]}" "$PG_BIN/pg_ctl" -D "$TMP/data" -o "-p $PORT -k $TMP -c listen_addresses=''" -l "$TMP/log" start >/dev/null
PSQL=("${RUNAS[@]}" "$PG_BIN/psql" -h "$TMP" -p "$PORT" -U postgres -d postgres -v ON_ERROR_STOP=1 -q)
export PGOPTIONS='-c client_min_messages=warning'
"${PSQL[@]}" -f "$HERE/stub_supabase.sql"
"${PSQL[@]}" -f "$HERE/../migrations/0001_init.sql"
# rodar a migração duas vezes garante que ela é idempotente
"${PSQL[@]}" -f "$HERE/../migrations/0001_init.sql"
export PGOPTIONS='-c client_min_messages=notice'
"${PSQL[@]}" -f "$HERE/rls_test.sql"
