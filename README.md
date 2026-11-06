# Invoice System

Invoice management app. Next.js frontend, Django REST API, PostgreSQL.

```
web/   Next.js app
api/   Django project
```

## Requirements

- Node.js 20+
- Python 3.12
- PostgreSQL

## Run locally

### 1. Database

Create a Postgres database and user:

```sql
CREATE DATABASE invoice_system;
CREATE USER invoice_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE invoice_system TO invoice_user;
```

### 2. API

```bash
cd api
python -m venv venv
source venv/bin/activate       
pip install -r requirements.txt
```

Create `api/.env`:

```
DJANGO_SECRET_KEY="key to pass"
DJANGO_DEBUG=1
DB_NAME=invoice_system
DB_USER=invoice_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

Then:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API runs at http://localhost:8000.

### 3. Web

```bash
cd web
npm install
```

Create `web/.env.local`:

```
API_URL=http://localhost:8000/api
```

```bash
npm run dev
```

App runs at http://localhost:3000.

## Deployment

The frontend is on Vercel (root directory `web`), the API on Render (root directory `api`) and the database on Neon.

Render environment variables: `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=0`, `DJANGO_ALLOWED_HOSTS`, `DJANGO_CSRF_TRUSTED_ORIGINS`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_SSLMODE=require`

Vercel environment variables: `API_URL`, `COOKIE_SECURE=true`

Render build command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`

Render start command: `gunicorn config.wsgi:application`
