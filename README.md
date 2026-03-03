# Secure Auth Shield

A authentication gateway built with **Next.js**, designed for a high-end patisserie membership system. This project demonstrates a **Defense-in-Depth** security architecture.

---

## Key Security Features

### 1. Identity & Access Management (IAM)
* **Google OAuth 2.0 (OIDC)**: Integrated Google Identity Services to offload credential management, significantly reducing the risk of Credential Theft.
* **Server-Side Token Verification**: Uses **Firebase Admin SDK** to cryptographically verify ID Tokens on the backend, preventing Token Spoofing attacks.

### 2. Session Security
* **Encrypted HttpOnly Cookies**: Utilizes `iron-session` to store encrypted user payloads.
* **XSS Mitigation**: Cookies are marked as `HttpOnly`, making them inaccessible to client-side scripts.
* **CSRF Protection**: Enforced via `SameSite=Strict` and `Secure` flags, ensuring cookies are only sent in first-party contexts over HTTPS.

### 3. Network Defense
* **Edge-Side Rate Limiting**: Implemented a sliding-window rate limiter using **Upstash Redis**.
* **Brute-Force Protection**: Automatically throttles IPs after 5 failed login attempts per minute, protecting against automated attacks.

### 4. Observability & Forensics
* **Audit Logging**: Every authentication event is recorded in **Cloud Firestore** with metadata (IP Address, Timestamp, User-Agent).
* **Security Center**: A dedicated member dashboard area for users to monitor their own login history, increasing transparency and trust.

---

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Database**: Firestore
- **Auth**: Firebase Auth + Google OAuth
- **Rate Limiting**: Upstash Redis (Serverless)
- **Session**: Iron-Session (Encrypted)
- **Styling**: Tailwind CSS

---

## Project Structure

```text
├── app/
│   ├── api/auth/         # Secure Backend API Routes
│   ├── dashboard/        # Protected Member Area (SSR)
│   ├── login/            # Minimalist Login UI
│   └── signup/           # Multi-provider Registration UI
├── lib/
│   ├── firebase-admin.ts # Server-side Firebase (God Mode)
│   └── firebase-client.ts # Client-side Firebase
├── middleware.ts         # Global Authentication Guard (Bouncer)
└── .env.local            # Environment Secrets
```

---

## Project Structure
```
# Firebase Admin SDK (From Service Account JSON)
FIREBASE_PROJECT_ID="..."
FIREBASE_CLIENT_EMAIL="..."
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Upstash Redis (From Upstash Console)
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."

# Security Secrets
SESSION_PASSWORD="your-32-character-long-secure-password"
```
