#!/usr/bin/env bash
set -e

echo ""
echo "NutriCoach — dev setup"
echo "======================"
echo ""

# 1. Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "ERROR: Node.js 20+ is required. Current: $(node -v)"
  exit 1
fi

# 2. Copy env file if it doesn't exist
if [ ! -f .env ]; then
  cp .env.example .env
  echo "-> .env aangemaakt vanuit .env.example"
  echo "   Vul je API keys in voordat je verder gaat!"
  echo ""
fi

# 3. Install dependencies
echo "-> npm install..."
npm install

# 4. Start Docker services
echo "-> Docker services starten (postgres + redis)..."
docker-compose up -d postgres redis

# 5. Wait for postgres to be ready
echo "-> Wachten op PostgreSQL..."
RETRIES=15
until docker-compose exec -T postgres pg_isready -U nutricoach > /dev/null 2>&1 || [ $RETRIES -eq 0 ]; do
  echo "   ...nog even wachten ($RETRIES)"
  RETRIES=$((RETRIES - 1))
  sleep 2
done

if [ $RETRIES -eq 0 ]; then
  echo "ERROR: PostgreSQL is niet bereikbaar. Controleer docker-compose logs."
  exit 1
fi

# 6. Run Prisma migrations
echo "-> Database migraties uitvoeren..."
npm run db:migrate

# 7. Generate Prisma client
echo "-> Prisma client genereren..."
npm run db:generate --workspace=apps/api

echo ""
echo "Setup klaar!"
echo ""
echo "Start de API:    npm run dev:api"
echo "Start de app:    npm run dev:mobile"
echo "DB studio:       npm run db:studio"
echo ""
echo "WhatsApp webhooks testen? Start ngrok:"
echo "  ngrok http 3000"
echo "  Webhook URL instellen in Meta developer console"
echo ""
