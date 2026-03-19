# Calculator App

The repository is now split into two standalone projects:

- `frontend/`: React + Vite single-page app
- `backend/`: Spring Boot REST API for calculation history

## Frontend

From `frontend/`:

```bash
npm install
npm run dev
```

Optional environment file:

```env
VITE_CALC_API_URL=http://localhost:8080
```

## Backend

From `backend/`:

```bash
./gradlew bootRun
```

Environment variables:

```env
SQLSERVER_USE_WINDOWS_AUTH=false
SQLSERVER_URL=jdbc:sqlserver://HOST:1433;databaseName=calculator_db;trustServerCertificate=true;encrypt=true
SQLSERVER_USERNAME=sa
SQLSERVER_PASSWORD=your_password
```

## Docker

Build each project from its own directory:

```bash
docker build -t calculator-frontend ./frontend
docker build -t calculator-backend ./backend
```
