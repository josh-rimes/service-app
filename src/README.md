# Backend – Hotfix API
This is the backend REST API for the Hotfix application.
It is built with Spring Boot, uses JWT authentication, and connects to a relational database.


## Tech Stack
- Java 17+
- Spring Boot
- Spring Security (JWT)
- JPA / Hibernate
- PostgreSQL (or H2 for local testing)
- Maven

## Prerequisites
Make sure you have the following installed:
- Java JDK 17 or higher
- Maven
- PostgreSQL (if not using H2)
- An IDE such as IntelliJ IDEA or VS Code

## Setup Instructions
### 1. Clone the repo:
```shell
git clone https://github.com/josh-rimes/service-app.git

cd backend
```

### 2. Configure the Database:
**Option A: PostgreSQL (Recommended)**

Create a database:
```sql
CREATE DATABASE hotfix;
```
Update application.properties (or application.yml):
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/hotfix
spring.datasource.username=postgres
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**Option B: H2 (Quick Local Testing)**
```properties
spring.datasource.url=jdbc:h2:mem:hotfix
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
```

### 3. Configure JWT
JWT settings must use a secure key (minimum 256 bits).
```properties
jwt.secret=your_very_long_secure_secret_key_at_least_32_chars
jwt.expiration=86400000
```

If the key is too short, authentication will fail.

### 4. Build the Application
```shell
mvn clean install
```

### 5. Run the Application
```shell
mvn spring-boot:run
```
The API will start at:
```terminaloutput
http://localhost:8080
```

## API Overview
- `/auth/register` – Register a user
- `/auth/login` – Authenticate and receive JWT
- `/jobs` – Job CRUD operations
- `/quotes` – Quote submission and retrieval
- `/bookings` – Booking management

Most endpoints require a valid **Authorization header**:
```terminaloutput
Authorization: Bearer <JWT_TOKEN>
```

## Common Issues & Debugging
### JWT Key Error
**Error:**
```terminaloutput
The specified key byte array is not secure enough for any JWT HMAC-SHA algorithm
```
**Fix:**

- Ensure `jwt.secret` is at least 32 characters
- Restart the backend after changing it

### 403 Forbidden Errors
**Causes:**

- Missing `Authorization` header
- Incorrect role access (CUSTOMER vs TRADESMAN)
- Expired token

**Fix:**

- Log in again to get a fresh token
- Verify role-based annotations in controllers

### CORS Errors

If the frontend cannot access the backend:
- Ensure CORS configuration allows `http://localhost:5173`
- Check `SecurityConfig` for allowed origins and methods

### Entity Serialization Issues (Infinite Loops)
**Symptoms:**

- StackOverflowError
- Infinite JSON response

**Fix:**

- Use DTOs instead of returning entities
- Add @JsonIgnore on bidirectional relationships

### Tradesman / Customer IDs Missing in Responses
If fields like `tradesmanId` or `customerId` are `null`:
- Ensure DTO mapping explicitly extracts IDs

Example:
```java
quoteResponse.setTradesmanId(quote.getTradesman().getId());
```

## Useful Dev Tips

- Use Postman or Insomnia to test secured endpoints
- Enable SQL logging during development
- Prefer DTOs over exposing entities directly