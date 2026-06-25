#!/bin/sh
set -eu

: "${DATABASE_URL:=file:/data/preorder.db}"
export DATABASE_URL

./node_modules/.bin/prisma db push --schema=./prisma/schema.prisma --skip-generate

exec "$@"
