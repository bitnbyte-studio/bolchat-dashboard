# Deployment Guide: BolChat Dashboard (Next.js)

Follow these steps to deploy the Dashboard in a production environment.

## 1. Environment Configuration

Create a `.env.production` file at the root:

```env
NEXT_BASE_URL=https://your-rag-api.com
JWT_SECRET=the-same-long-secret-from-fastapi
LOGOUT_REDIRECT_URL=/login
NODE_ENV=production
```

## 2. Infrastructure Requirements
- **Next.js (Vercel, AWS, or Dockerized VPS)**.
- **Access to the FastAPI RAG service** (defined in `NEXT_BASE_URL`).

## 3. Production Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start server
npm start
```

## 4. Security Measures Implemented
- **HTTP-Only Cookies**: JWT tokens are never accessible to client-side JavaScript.
- **Secure Cookie Flags**: `secure`, `sameSite: "lax"`, and `httpOnly` are enforced in production.
- **Server Actions**: All database communication happens securely on the server-side via Server Actions.
- **Middleware Protection**: All dashboard routes require valid sessions.

## 5. Deployment with Vercel
1.  Connect your repository to Vercel.
2.  Set the environment variables in the Vercel Dashboard.
3.  Deploy.
