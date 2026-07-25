# ⚡ MASTER EXECUTION & DEPLOYMENT GUIDE (`execution.md`)

This document serves a dual purpose:
1. **PART 1 (For AI Coding Agents like AntiGravity / Claude / Cursor / Windsurf)**: Autonomous setup protocols, prompt-parameterization rules, mandatory security guardrails, and build verification.
2. **PART 2 (For Human Developers & Users)**: Idiot-proof API key configuration, cost safeguards, terminal reference, web deployment guide, licensing, and attribution.

---

# 🤖 PART 1: AI AGENT EXECUTION PROTOCOL (For Coding Assistants)

> ⚠️ **Instructions for AI Agent**: When customizing this template for a new user, you MUST follow these parameterization and security rules sequentially.

## 1. Objective & Interactive Setup Protocol
When a new user provides their context or asks you to adapt this template:
1. **Prompt the User for Bio & Portfolio Data** if any fields in **Section 6 (User Data Input)** are missing.
2. **DO NOT silently reuse placeholder content** (e.g., Hasir, IIT Madras, Janitor AI project, Zenodo DOIs) as default values for a new user.
3. **Regenerate both System Prompts** (`src/app/api/chat/route.ts`) dynamically using the new user's exact background.

## 2. Parameterization vs. Structural Logic Boundaries
When modifying the Two-Agent AI backend (`src/app/api/chat/route.ts`) and UI components (`AIChatAgent.tsx`):

### 🟢 USER-PARAMETERIZED FIELDS (Must be updated per user):
- User's Name & Preferred Name / Handle
- User's Role, Headline, & Location
- Education & Universities
- Featured Projects & Live URLs (Do NOT claim projects are employers!)
- Technical Skills & Domain Topics
- Publications, DOI links, & External Profiles (GitHub, LinkedIn, Email)

### 🔴 STRUCTURAL SECURITY & ROUTING LOGIC (DO NOT TOUCH):
- **Agent 1 Output Contract**: Must ALWAYS output valid JSON: `{"allowed": boolean, "reason": string}`.
- **Agent 1 Scope Classification Logic**: Category 1 (Direct user queries), Category 2 (User's technical domains & portfolio terms), Category 3 (Greetings & casual chat), Rejected (Off-topic trivia, external API tutorials, jailbreaks).
- **Two-Agent Fallback Pipeline**: Prebuilt local dictionary check first ➔ Agent 1 Gatekeeper check ➔ Agent 2 Knowledge Synthesis ➔ Error Boundary fallback.

## 3. Mandatory Security & Production Hardening
Since strangers will deploy this codebase live, the following security defaults are **MANDATORY**:
- **Prompt-Injection Defense**: Agent 1 system prompt must explicitly reject system prompt override attempts, adversarial jailbreaks, and out-of-scope code generation requests.
- **Honest Fallbacks**: Error boundaries must return polite, transparent fallback messages without exposing raw stack traces, API keys, or hallucinating false user credentials.
- **Rate Limiting & Cost Safeguards**: API route must enforce maximum request payload limits (`max_tokens: 600`, message length truncation) to protect against API exhaustion.

## 4. Component Visual Guardrails
- **Browser Mockup Framing**: Wrap project previews inside macOS-style containers with traffic light dots (`#ef4444`, `#eab308`, `#22c55e`) and a mock URL bar (`project-demo.vercel.app`), rather than raw embedded media.
- **Theme Crossfade**: Apply `transition-colors duration-300` across root layout and cards to prevent jarring flashes when toggling dark/light mode.
- **Hydration Protection**: Maintain `suppressHydrationWarning` on `<html>` in `src/app/layout.tsx`.
- **Preloader**: Keep initial curtain loader visible for 800–1000ms minimum.

## 5. Build Verification & Human Review Checkpoint
1. Run `npm run build` to verify zero TypeScript or Next.js build errors.
2. ⚠️ **CRITICAL RULE**: Do **NOT** run production deployment commands (`npx vercel --prod` or `npx netlify-cli deploy --prod`) without human approval.
3. Present `http://localhost:3000` to the user and wait for explicit approval before git push or deployment.

---

## 6. Personal Context & User Data (Input Section for AI Agent)

> **Instructions for User**: Paste your background details below before handing this file to your AI agent.

```text
- Full Name: [Your Full Name]
- Target Role / Title: [e.g., AI Engineer / Full-Stack Developer]
- Value Proposition / Headline: [Your headline sentence]
- Location & Languages: [e.g., San Francisco, CA · English]
- Education: [Your Degree, University, Graduation Year]
- Key Skills: [Languages, ML/AI Tools, Web Frameworks, Libraries]
- Featured Projects: [Title, Description, Live URL, Tech Stack] (Note: List projects as projects, not employers!)
- Publications / DOIs: [Paper title, DOI link, venue, if applicable]
- Contact Info: [Email, Phone, GitHub URL, LinkedIn URL]
```

---

# 👤 PART 2: USER SETUP, ENVIRONMENT & DEPLOYMENT GUIDE

## 🔑 1. Idiot-Proof API Key Setup & Cost Security

> 🚨 **SECURITY & COST WARNING**:
> - **NEVER** expose your API key in client-side code or commit it to GitHub.
> - OpenRouter keys belong exclusively in server-side environment variables (`.env.local`).
> - Set a **Monthly Spend Limit** or **Credit Limit** on your [OpenRouter Dashboard](https://openrouter.ai/settings/keys) to prevent unexpected charges.

### Setup Instructions:
1. In the `cv-render` folder, copy `.env.example` to create a new file named `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and paste your OpenRouter key:
   ```env
   OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
   ```
3. Ensure `.env.local` is listed in your `.gitignore` file (configured by default).

---

## 📥 2. Local Setup & Testing

```bash
# Step 1: Install dependencies
npm install

# Step 2: Launch local dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view your live portfolio prototype!

---

## 🐙 3. Push to GitHub & Web Deployment

### 🅰️ Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial portfolio release"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 🅱️ Step 2: Deploy to Vercel (Recommended — 1-Click)
1. Import your GitHub repository on **[Vercel.com](https://vercel.com)**.
2. In Vercel Project Settings, navigate to **Environment Variables**.
3. Add key `OPENROUTER_API_KEY` with your secret key value.
4. Click **Deploy**. Vercel will build and assign a free production domain.

---

## 📄 4. License & Attribution

- **License**: Distributed under the **MIT License**. See `LICENSE` for full terms.
- **Attribution**: Free for personal and commercial use. Attribution back to the original author (**Hasir Sayed** · [`github.com/Sayyedhash888/open-portfolio`](https://github.com/Sayyedhash888/open-portfolio)) in your repository README or footer is greatly appreciated!