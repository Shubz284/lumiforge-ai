# ✨ LumiForge AI

A pay-as-you-go AI image generation platform. Turn your imagination into stunning images — buy credits once, generate whenever inspiration strikes, no subscriptions.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-1.x-000000?logo=bun&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-336791?logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-Payments-0C2451?logo=razorpay&logoColor=white)
![Cloudflare R2](https://img.shields.io/badge/Cloudflare_R2-Storage-F38020?logo=cloudflare&logoColor=white)

## Live Demo

- **Frontend:** [lumiforge-ai.vercel.app](https://lumiforge-ai.vercel.app/)
- **Backend API:** [lumiforge-ai.onrender.com](https://lumiforge-ai.onrender.com)

## Features

- 🎨 **Multi-model image generation** — choose from several AI image models (Riverflow, Seedream, Recraft, Grok Imagine, Gemini, and more) via OpenRouter, each with transparent per-model credit pricing
- 💳 **Pay-as-you-go credits** — one-time credit packs (Starter / Pro / Studio) via Razorpay, credits never expire
- 🔐 **OAuth authentication** — email/password and Google sign-in via Better Auth
- 🎁 **Free trial** — new users get free credits on signup, restricted to a single trial-eligible model
- 🖼️ **Image gallery** — view, preview, download, and delete generated images
- 📊 **Transaction history** — full log of credit purchases and spend/refund activity
- 🔄 **Automatic refunds** — failed generations automatically refund the credits that were deducted
- 📱 **Fully responsive** — works cleanly across mobile, tablet, and desktop

## Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Bun](https://img.shields.io/badge/Bun-Runtime-000000?logo=bun&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=reactrouter&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?logo=shadcnui&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)

### Backend
![Bun](https://img.shields.io/badge/Bun-Runtime-000000?logo=bun&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1?logo=zod&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better_Auth-Authentication-000000)
![OpenRouter](https://img.shields.io/badge/OpenRouter-Image_Generation-6E56CF)
![Razorpay](https://img.shields.io/badge/Razorpay-Payments-0C2451?logo=razorpay&logoColor=white)
![Cloudflare R2](https://img.shields.io/badge/Cloudflare_R2-Storage-F38020?logo=cloudflare&logoColor=white)

## Architecture Highlights

- **Per-model credit pricing** — each AI model's credit cost is derived from its real generation cost rather than a flat rate, so pricing stays fair whether a model is cheap or expensive to run.
- **Atomic credit deduction** — credits are checked and decremented in a single database operation to prevent race conditions on concurrent requests.
- **Dual-path payment fulfillment** — `payments/verify` is the primary path for instant confirmation after checkout; a Razorpay webhook acts as a fallback in case the client loses connection or crashes mid-flow, so credits are never lost even if the browser never gets a response.
- **Trial guardrails** — trial users are restricted server-side to a single low-cost model until their free credits are used, preventing abuse of premium models via the free tier.

## API Routes

### User
| Method | Route | Description |
|---|---|---|
| `GET` | `/me` | Get current user's trial status and credit balance |

### Image Generation
| Method | Route | Description |
|---|---|---|
| `POST` | `/generate-image` | Generate a new image (deducts credits based on selected model) |
| `GET` | `/images` | List the authenticated user's generated images |
| `GET` | `/images/:imageId` | Get a single image by ID |
| `GET` | `/images/:imageId/download` | Download the original image file |
| `DELETE` | `/images/:imageId` | Delete an image |

### Models
| Method | Route | Description |
|---|---|---|
| `GET` | `/image/models` | List available AI image models (via OpenRouter) |

### Credits & Billing
| Method | Route | Description |
|---|---|---|
| `GET` | `/credits` | Get the authenticated user's current credit balance |
| `GET` | `/checkout/pricing` | Get available credit packs and pricing |

### Payments
| Method | Route | Description |
|---|---|---|
| `POST` | `/payments/create-order` | Create a Razorpay order for a selected credit pack |
| `POST` | `/payments/verify` | Verify payment signature and fulfill credits |
| `GET` | `/payments/transactions` | Get the authenticated user's purchase history |
| — | *(webhook)* | Razorpay webhook — fallback fulfillment path for `payment.captured` events |

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) installed
- PostgreSQL database
- Razorpay account (test/live keys)
- Cloudflare R2 bucket + credentials
- OpenRouter API key
- Google OAuth credentials (for social login)

### Backend Setup

```bash
cd backend
bun install
```

Create a `.env` file with the required environment variables (database URL, Razorpay keys, R2 credentials, OpenRouter API key, Better Auth secret, etc.).

```bash
bunx prisma migrate dev
bun run dev
```

### Frontend Setup

```bash
cd frontend
bun install
bun run dev
```

## License

© 2026 LumiForge AI. All rights reserved.

---

Built with ❤️ by [Shubham](https://github.com/Shubz284)
