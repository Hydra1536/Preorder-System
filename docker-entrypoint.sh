#!/bin/sh
set -eu

: "${DATABASE_URL:=file:/data/preorder.db}"
export DATABASE_URL

./node_modules/.bin/prisma db push --schema=./prisma/schema.prisma --skip-generate

if [ "${SEED_DATABASE}" = "true" ]; then
  preorder_count="$(
    node <<'NODE'
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

prisma.preorder
  .count()
  .then((count) => {
    console.log(count);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
NODE
  )"

  if [ "${preorder_count}" = "0" ]; then
    node prisma/seed.js
  fi
fi

exec "$@"
