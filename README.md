## MotelMate

A modern boarding house/tenant management system in a single repository with a Frontend (Angular 20 + Material + SSR) and a Backend (ASP.NET Core 9 + EF Core + SQL Server). This README provides professional, end-to-end setup and development guidance.

### Tech Stack
- Frontend: Angular 20, Angular Material, SSR (Express), RxJS, Chart.js, Bootstrap
- Backend: ASP.NET Core 9, Entity Framework Core (SQL Server), Identity, JWT Auth, SignalR, AutoMapper, QuestPDF
- Media: Cloudinary
- API shape: REST (default base http://localhost:5223/api)

### Repository Layout
- FRONTEND/ — Angular application (dev server on 4200; SSR on 4000)
- BACKEND/ — ASP.NET Core Web API (HTTP on 5223)

### Prerequisites
- Node.js 20+ and npm
- Angular CLI 20+ (npm install -g @angular/cli)
- .NET SDK 9.0+
- SQL Server (LocalDB/Azure SQL/on-prem)
- Git, VS Code or Visual Studio (recommended)

---

## Quick Start
1) Start the Backend
- Open a terminal in BACKEND/
- Run: dotnet run
- Verify: http://localhost:5223

2) Start the Frontend (Angular dev server)
- Open another terminal in FRONTEND/
- Install deps: npm install
- Run dev: npm start
- Visit: http://localhost:4200

3) Optional: Run Frontend with SSR
- Build: npm run build
- Serve SSR: npm run serve:ssr:FRONTEND
- Visit: http://localhost:4000

Tip: Keep both FRONTEND and BACKEND running in separate terminals during development.

---

## Configuration
### Frontend
- File: FRONTEND/src/environments/environment.ts
- Defaults use http://localhost:5223 as API base and /api for endpoints.
- Adjust these URLs when pointing to staging/production.

### Backend
- Config files: BACKEND/appsettings.json, appsettings.Development.json
- Environment variables are supported; DotNetEnv is enabled, so you can add a BACKEND/.env (do not commit) with keys:
  - ConnectionStrings__DefaultConnection=your-sqlserver-connection-string
  - JWT__Issuer=http://localhost:5223
  - JWT__Audience=http://localhost:5223
  - JWT__SigningKey=your-strong-secret
  - CloudinarySettingsAccount__CloudName=...
  - CloudinarySettingsAccount__ApiKey=...
  - CloudinarySettingsAccount__ApiSecret=...

Security note: Never commit real secrets to the repository. Replace any committed sensitive values and move them to environment variables immediately.

### Default Ports
- Backend API: http://localhost:5223
- Frontend Dev: http://localhost:4200
- Frontend SSR: http://localhost:4000
- Frontend REST base used: http://localhost:5223/api

---

## Common Commands
### Frontend (run inside FRONTEND/)
- Install dependencies: npm install
- Start dev server: npm start
- Build (SSR-configured): npm run build
- Run unit tests (Karma): npm test
- Serve SSR (after build): npm run serve:ssr:FRONTEND

### Backend (run inside BACKEND/)
- Run in Development: dotnet run
- Build: dotnet build
- Restore packages: dotnet restore
- Entity Framework Core (optional, if using migrations):
  - Create a migration: dotnet ef migrations add <Name>
  - Apply to database: dotnet ef database update

---

## API Documentation
- If Swagger/OpenAPI is enabled in Development, browse to http://localhost:5223/swagger for interactive docs.

---

## Troubleshooting
- CORS: If the frontend cannot call the API, ensure CORS allows http://localhost:4200.
- Port conflicts: Make sure nothing else is using ports 4200, 4000, or 5223.
- SQL Server: Verify the connection string and that the database is reachable.
- Cloudinary: Ensure CloudName/ApiKey/ApiSecret match your account and that the frontend upload preset is valid.

---

## Contributing
- Branch naming: feature/, fix/, chore/
- Pull Requests: Describe changes clearly and include screenshots for UI updates when relevant.
- Security: Do not commit secrets. Use environment variables and .env files excluded by .gitignore.