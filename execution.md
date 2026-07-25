# ⚡ MASTER EXECUTION & DEPLOYMENT GUIDE (`execution.md`)

This document serves a dual purpose:
1. **PART 1 (For AI Agents)**: Autonomous execution rules, visual guardrails, and quality verification protocols for AntiGravity, Cursor, Windsurf, or Codex.
2. **PART 2 (For Humans / Users)**: A step-by-step terminal command reference and web deployment guide for non-technical users.

---

# 🤖 PART 1: AI AGENT EXECUTION PROTOCOL

> **Instructions for AI Agent**: Follow these steps sequentially to generate, verify, and prepare the custom portfolio website.

## 1. Objective & Role
Act as an expert Full-Stack Lead Engineer and UI/UX Designer. Read the user context provided in **Section 6 (Personal Context & User Data)** and update all portfolio components (`src/components/HeroSection.tsx`, `src/components/AIChatAgent.tsx`, `src/components/Navbar.tsx`, etc.) to match the user's background.

## 2. Component Mapping & v.2 Visual Guardrails
- **Browser Mockup Framing for Projects**: Wrap all project video demos or preview images inside a custom macOS-style browser window container (`bg-[#16181c] border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden`) with three colored window dot controls (`#ef4444`, `#eab308`, `#22c55e`) and a mock URL bar (e.g., `project-demo.vercel.app`), rather than raw embedded media elements.
- **Smooth Theme Crossfade**: Ensure `transition-colors duration-300` is applied across root layout, cards, and text elements to prevent jarring flashes when toggling between dark and light themes.
- **Preloader Timing & Border Contrast**: The initial curtain loader ("INITIALIZING SYSTEM") must remain visible for a minimum of 800–1000ms before unmounting. Enforce distinct card borders (`border-white/10` in dark mode) so grid tiles do not melt into dark backgrounds.
- **Hero & Branding**: Update name, headline, subtitle paragraph, and status badge (`AVAILABLE FOR WORK`).
- **Profile / Field Notes**: Update education, location, current role, and engineering highlights.
- **Featured Work & Projects**: Update project titles, metric chips (e.g., `3-agent architecture`, `35% cost savings`), descriptions, stack tags, and live/repo links.
- **AI Architecture Diagram**: Verify `ArchitectureSection.tsx` SVG flow with animated fork and merge lines.
- **Toolkit & Skills**: Update the 6 categorized skill blocks.
- **Interactive AI Chat Agent (`AIChatAgent.tsx`)**: Update system prompt context and quick prompt pills to reflect the user's background.
- **Contact & Footer**: Update email, phone, GitHub, LinkedIn, and sign-off text.

## 3. Quality Verification & Hydration Guardrails
- **Hydration Protection**: Ensure `suppressHydrationWarning` is present on the root `<html>` tag in `src/app/layout.tsx` to prevent server/client theme mismatches.
- **Build Verification**: Run local type-check and compilation before presenting to the user:
  ```bash
  npm run build
  ```

## 4. Human Review Checkpoint (MANDATORY BEFORE DEPLOYMENT)
> ⚠️ **CRITICAL RULE**: Do **NOT** automatically run production deployment commands (`npx vercel --prod` or `npx netlify-cli deploy --prod`) without human approval.
1. Start the local server using `npm run dev`.
2. Present `http://localhost:3000` to the user to inspect the live preview.
3. **STOP and WAIT** for the user's explicit approval before proceeding to git push or production deployment steps (detailed in **Part 2, §2–3**).

---

## 5. Personal Context & User Data (Input Section)

> **Instructions for User**: Replace the template below with your resume text, LinkedIn profile, or project highlights before running this prompt in your AI agent.

```text
- Full Name: Jane Doe
- Target Role / Title: Senior AI / ML Engineer & Systems Architect
- Value Proposition / Headline: Building intelligent language systems & agentic workflows.
- Location & Languages: San Francisco, CA · English / Hindi
- Education: BS in Data Science & Computer Science

- Key Skills Matrix:
  - Analysis: Python, NumPy, Pandas, SQL, Data Visualization
  - Machine Learning: Deep Learning, Predictive Modeling, Data Pipelines
  - Language AI: LLMs, RAG, Ollama, SLM Fine-Tuning, Prompt Engineering
  - Responsible Systems: Guardrails, PII Redaction, Human-in-the-Loop, Injection Defenses
  - Engineering: Git, VS Code, Next.js, TypeScript, Vercel, API Integration, MCP
  - Research: AI Benchmarking, Technical Writing, Experiment Tracking

- Work Experience:
  1. Autonomous AI Labs (2025 — Present) | Lead AI Safety Engineer
     - Built autonomous data science tool deployed on cloud infrastructure.
     - Designed BYOK API-key handling, real-time PII redaction, prompt injection shields.
     - Collaborative 3-agent workflow (Evaluation, Validation, Task Execution).

  2. Personal Systems Platform (2024 — Present) | AI & Agentic Systems Developer
     - Agentic portfolio platform with Model Context Protocol (MCP) integrations.
     - 3-agent workflow for autonomous execution and 35% API cost reduction.

- Featured Projects:
  - SLM Fine-Tuning (H-Ai): Quantized language model fine-tuning and edge deployment.
  - Business MIS Platform: RAG AI assistant integration.
  - Interactive Portfolio Platform: Modern responsive technical showcase.

- Publications & DOIs:
  - Small Language Model (SLM) Integration and Performance Analysis (Zenodo DOI: 10.5281/zenodo.00000000)

- Contact Details:
  - Email: your.email@example.com
  - Phone: +1 (555) 000-0000
  - GitHub: https://github.com/your-username
  - LinkedIn: https://linkedin.com/in/your-username
```

---

# 👤 PART 2: USER STEP-BY-STEP GUIDE & TERMINAL REFERENCE

> **For Non-Technical Users**: Follow this simple guide to test locally, push to GitHub, and deploy your custom portfolio to the web for free.

## 📥 1. Local Setup & Testing

Open your terminal in the project directory and run:

```bash
# Step 1: Install project dependencies
npm install

# Step 2: Launch local dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view your live portfolio prototype!

---

## 🐙 2. Push to GitHub (Step-by-Step)

If you haven't pushed your code to GitHub yet, run these commands in order:

```bash
# Step 1: Initialize Git
git init

# Step 2: Add all files
git add .

# Step 3: Commit changes
git commit -m "Initial portfolio release"

# Step 4: Set branch name to main
git branch -M main

# Step 5: Link remote repository (Replace YOUR_GITHUB_USERNAME and YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git

# Step 6: Push repository to GitHub
git push -u origin main
```

---

## 🚀 3. Web Deployment Guides

### 🅰️ Option 1: Deploy to Vercel (Recommended — 1-Click)

**GUI Method (Easiest)**:
1. Push your repository to **GitHub**.
2. Visit **[Vercel.com](https://vercel.com)** and sign in with GitHub.
3. Click **"Add New"** → **"Project"**.
4. Import your **`open-portfolio`** repository.
5. Click **Deploy**. Vercel will build and assign a free domain (e.g., `https://yourname.vercel.app`).

**CLI Method (Terminal)**:
```bash
npx vercel --prod
```

---

### 🅱️ Option 2: Deploy to Netlify

**GUI Method**:
1. Push your repository to **GitHub**.
2. Visit **[Netlify.com](https://netlify.com)** and sign in.
3. Click **"Add new site"** → **"Import an existing project"**.
4. Select **GitHub** and choose your repository.
5. Set Build Command: `npm run build` and Publish Directory: `.next`
6. Click **Deploy Site**.

**CLI Method (Terminal)**:
```bash
# Step 1: Build production bundle
npm run build

# Step 2: Deploy to Netlify production
npx netlify-cli deploy --prod
```

---

## 🛠️ Summary of Key Terminal Commands

| Task | Command |
| :--- | :--- |
| **Start Dev Server** | `npm run dev` |
| **Build Project** | `npm run build` |
| **Stage & Commit** | `git add . && git commit -m "update portfolio"` |
| **Push to GitHub** | `git push origin main` |
| **Deploy to Vercel** | `npx vercel --prod` |
| **Deploy to Netlify** | `npx netlify-cli deploy --prod` |