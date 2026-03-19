# Backend

Spring Boot API for calculator operations and history persistence.

## Commands

```bash
./gradlew bootRun
./gradlew test
./gradlew bootJar
```

## Environment

```env
SQLSERVER_USE_WINDOWS_AUTH=false
SQLSERVER_URL=jdbc:sqlserver://HOST:1433;databaseName=calculator_db;trustServerCertificate=true;encrypt=true
SQLSERVER_USERNAME=sa
SQLSERVER_PASSWORD=your_password
```
