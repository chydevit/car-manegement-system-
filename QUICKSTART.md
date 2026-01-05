# 🚀 Quick Start - Database Integration

## Prerequisites Checklist
- [ ] PostgreSQL installed
- [ ] PostgreSQL service running
- [ ] Database `cms` created
- [ ] Dependencies installed (`npm install`)

## Setup Commands (Run in Order)

```bash
# 1. Navigate to server directory
cd server

# 2. Install dependencies (if not done)
npm install

# 3. Run database migrations
npm run db:migrate

# 4. Seed initial data
npm run db:seed

# 5. Start the server
npm run dev
```

## Verify Setup

```bash
# Check health endpoint
curl http://localhost:4000/ping

# Expected: {"status":"alive","database":"connected",...}
```

## Default Login Credentials

```
Admin:  admin@example.com  / admin123
Seller: seller@example.com / seller123
User:   user@example.com   / user123
```

## Common Issues

### ❌ "ECONNREFUSED" Error
**Fix**: Start PostgreSQL service
```bash
# Windows: Services → PostgreSQL
# Mac: brew services start postgresql
# Linux: sudo service postgresql start
```

### ❌ "Database does not exist"
**Fix**: Create database
```bash
psql -U postgres
CREATE DATABASE cms;
\q
```

### ❌ "Migration failed"
**Fix**: Check DATABASE_URL in `.env`
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/cms
```

## Useful Commands

```bash
# View database in GUI
npm run db:studio

# Re-seed database (after clearing)
npm run db:seed

# Check migration status
npm run db:migrate

# View logs
npm run dev
```

## Need Help?

📖 See `DATABASE_SETUP.md` for detailed instructions  
📋 See `IMPLEMENTATION_SUMMARY.md` for complete overview
