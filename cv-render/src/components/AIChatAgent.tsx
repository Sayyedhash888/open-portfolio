"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, X, MessageSquare, Bot, Briefcase, Rocket, GraduationCap, Mail, FileText } from "lucide-react";

interface Message {
  id: string;
  sender: "agent" | "user";
  text: string;
}

export default function AIChatAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "agent",
      text: "Hi! I'm Hasir's AI assistant. Ask me anything about his experience, studies at IIT Madras, math research, or skills! Or select a prompt below:",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastIntent, setLastIntent] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle body scroll lock when chat panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Conversational response lookup dictionary
  const responseDictionary = [
    {
      intent: "identity",
      keys: [
        /\b(who is hasir|who is hashir|kon hai hasir|hasir kaun hai|tell me about hasir|about hasir|who are you|bio|profile|kon ho aap|hasir ke bare me|introduce hasir|who is he|who is this)\b/i,
      ],
      response:
        "Hasir Sayed is a Data Science student at **IIT Madras** and an Applied AI Engineer specializing in **AI Safety**, **SLM Fine-Tuning**, and **Data Pipelines**.\n\nHe built the **Janitor AI Safety Pipeline** (an autonomous 3-agent data sanitization & PII redaction tool), published SLM benchmark research on Zenodo (DOI Record 21396947), and designs custom Model Context Protocol (MCP) servers.\n\nOriginally from Rajasthan, he is currently based in Bangalore, India.",
    },
    {
      intent: "janitor",
      keys: [
        /\b(janitor|janitor ai|janitor project|janitorai|janitor ai kya hai|janitor kya hai)\b/i,
      ],
      response:
        "**Janitor AI** is one of Hasir's key engineering projects (live at [janitorai-beta.vercel.app](https://janitorai-beta.vercel.app)).\n\nIn this project, Hasir engineered an autonomous 3-agent pipeline for high-throughput data cleaning, real-time PII redaction, prompt-injection shields, and BYOK (Bring Your Own Key) architecture.",
    },
    {
      intent: "education",
      keys: [
        /\b(education|studies|study|iit|iit madras|degree|college|mdsu|padhai|education kya hai|kahan padhta hai|study background)\b/i,
      ],
      response:
        "Hasir's academic foundation includes:\n\n- **BS in Data Science & Applications** from **IIT Madras** (Expected 2027)\n- **B.Sc. in Mathematics (Honours)** from **MDSU, Ajmer** (Expected 2027)\n\nThis dual background combines strong mathematical & statistical theory with applied AI & machine learning.",
    },
    {
      intent: "projects",
      keys: [
        /\b(project|projects|work|built|build|projects kya hai|kya banaya hai|portfolio projects)\b/i,
      ],
      response:
        "Hasir's featured engineering projects include:\n\n1. **Janitor AI Tool:** Autonomous 3-agent data sanitization & PII redaction pipeline ([janitorai-beta.vercel.app](https://janitorai-beta.vercel.app))\n2. **SLM Fine-Tuning:** Fine-tuned Qwen 2.5 (0.5B) on custom datasets using QLoRA for local quantized inference ([GitHub Repo](https://github.com/Sayyedhash888/H-Ai))\n3. **Agentic MIS Portfolio & MCP Servers:** Custom Model Context Protocol servers for LLM workspace automation.",
    },
    {
      intent: "skills",
      keys: [
        /\b(skills|skill|tech stack|technologies|python|ai safety|skills kya hai|what are your skills)\b/i,
      ],
      response:
        "Hasir's core technical toolkit includes:\n\n- **AI & Data Science:** Python, NumPy, Pandas, Scikit-Learn, PyTorch, SQL\n- **Applied AI & Safety:** SLM Fine-Tuning (Qwen 2.5 / QLoRA), RAG, Prompt Engineering, PII Redaction, Prompt Injection Defenses\n- **Systems & Dev:** Model Context Protocol (MCP), Git, Next.js, Vercel",
    },
    {
      intent: "publications",
      keys: [
        /\b(publication|publications|paper|research|doi|zenodo|research paper)\b/i,
      ],
      response:
        "Hasir is a published researcher! He authored DOI-registered research on Zenodo:\n\n📄 [**Benchmarking SLM Performance & Integration (Zenodo Record 21396947) ↗**](https://zenodo.org/records/21396947)\n\nThe paper systematically benchmarks lightweight local language models across throughput, memory, and edge deployment trade-offs.",
    },
    {
      intent: "location",
      keys: [
        /\b(location|where is hasir|kahan ka hai|kahan rehta hai|city|bangalore|rajasthan|where do you live)\b/i,
      ],
      response:
        "Hasir is currently based in **Bangalore, India**, and is originally from **Rajasthan**. He collaborates with remote and global engineering teams.",
    },
    {
      intent: "contact",
      keys: [
        /\b(contact|email|phone|linkedin|github|resume|cv|pdf|contact kaise kare|reach)\b/i,
      ],
      response:
        "You can connect with Hasir directly:\n\n- **Email:** hasir160807@gmail.com\n- **Phone:** +91 8955270513\n- **Resume:** [**HASIR_SAYED.pdf ↗**](/HASIR_SAYED.pdf)\n- **GitHub:** [github.com/Sayyedhash888](https://github.com/Sayyedhash888)\n- **LinkedIn:** [linkedin.com/in/hasir-sayed](https://www.linkedin.com/in/hasir-sayed-365447413/)",
    },
    {
      intent: "greetings",
      keys: [
        /\b(hi|hello|hey|kaise ho|namaste|good morning|good evening|thanks|thank you)\b/i,
      ],
      response:
        "Hello! 👋 I'm Hasir's AI assistant. Ask me anything about Hasir's background, Data Science at IIT Madras, his Janitor AI project, research paper, or technical skills!",
    },
  ];

  const getPrebuiltResponse = (message: string): string | null => {
    const msg = message.toLowerCase().trim();

    // Explanatory, technical, or clarification queries ALWAYS require live AI assistance!
    const isExplanatoryQuery =
      /\b(what is|what does|how does|how to|why|explain|i mean|meaning|tell me about the|details|elaborate)\b/i.test(
        msg
      );

    if (isExplanatoryQuery) {
      return null;
    }

    // Contextual follow-up elaboration
    const isRequestingMore =
      msg.includes("more") ||
      msg.includes("detail") ||
      msg.includes("elaborate") ||
      msg.includes("tell me");

    if (isRequestingMore && lastIntent) {
      if (lastIntent === "experience") {
        return "In the **Janitor AI** project, Hasir built an autonomous 3-agent safety pipeline that processes high-throughput data cleaning, detects prompt injection risks, and redacts PII automatically.";
      }
      if (lastIntent === "projects") {
        return "For the **SLM Fine-Tuning** project, Hasir fine-tuned Qwen 2.5 (0.5B) on domain datasets using QLoRA for quantized local inference.";
      }
      if (lastIntent === "education") {
        return "The BS in Data Science from **IIT Madras** covers statistical analysis, machine learning models, and big data tools. It is highly hands-on and rigorous.";
      }
      if (lastIntent === "publications") {
        return "Hasir's Zenodo paper benchmarks models like Llama and Qwen on edge tasks, analyzing memory scaling and throughput bottlenecks in resource-constrained environments.";
      }
    }

    // Match keywords using regex
    for (const entry of responseDictionary) {
      const matches = entry.keys.some((regex) => regex.test(msg));
      if (matches) {
        setLastIntent(entry.intent);
        return entry.response;
      }
    }

    // Return null if query is outside prebuilt questions
    return null;
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Append user message
    const userMsgId = Date.now().toString();
    setMessages((prev) => [...prev, { id: userMsgId, sender: "user", text }]);
    setInputValue("");
    setIsTyping(true);

    // 0. Prompt Injection Defense Shield
    const PROMPT_INJECTION_PATTERNS = [
      /ignore (all )?(previous|prior) (instructions|directions|prompts)/i,
      /disregard (your|all) (system|prior) (instructions|prompt)/i,
      /you are now in (developer|dan|unfiltered) mode/i,
      /jailbreak/i,
      /forget (all|your) (rules|instructions)/i,
      /reveal (your|the) (system|initial|full) prompt/i,
      /print (your|the) (system|initial) prompt/i,
      /bypass (security|filters|guardrails)/i,
      /act as an (unrestricted|unfiltered) (ai|model|bot)/i,
    ];

    if (PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(text))) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "agent",
            text:
              "🛡️ **Security Shield Blocked**: Prompt injection, system override, or jailbreak attempt detected and blocked to protect system safety.",
          },
        ]);
      }, 300);
      return;
    }

    // 1. Check local prebuilt response dictionary first
    const prebuiltReply = getPrebuiltResponse(text);

    if (prebuiltReply) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "agent", text: prebuiltReply },
        ]);
      }, 400);
      return;
    }

    // 2. Outside prebuilt questions -> Trigger Two-Agent AI Bot via OpenRouter with context history
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages.slice(-6) }),
      });

      const data = await res.json();
      setIsTyping(false);

      const agentReply =
        data.reply ||
        "I am Hasir's AI assistant. Please ask me about Hasir's background, AI safety work at Janitor AI, Data Science at IIT Madras, or his projects!";

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "agent", text: agentReply },
      ]);
    } catch (err) {
      console.error("Error contacting AI agent endpoint:", err);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "agent",
          text:
            "I am Hasir's portfolio AI assistant! Feel free to ask about his background, projects, or reach him directly at **hasir160807@gmail.com**.",
        },
      ]);
    }
  };

  // Convert markdown links e.g. [text](url) to HTML links
  const formatText = (text: string) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;

    let formatted = text
      .replace(boldRegex, "<strong>$1</strong>")
      .replace(
        linkRegex,
        '<a href="$2" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; color: var(--accent-color);">$1</a>'
      );

    // Convert newlines to breaks
    return formatted.split("\n").map((line, i) => (
      <p key={i} className="mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: line }} />
    ));
  };

  return (
    <>
      {/* Floating Trigger Bubble */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 px-5 py-3 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--accent-color)] text-[var(--foreground)] hover:text-[var(--accent-color)] shadow-2xl z-50 flex items-center gap-2 text-xs font-mono font-bold tracking-widest transition-all duration-300 ${
          isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        }`}
        aria-label="Open AI Assistant"
      >
        ✦ ASK AI AGENT
      </button>

      {/* Slide-out Chat Panel */}
      <div
        data-modal-container="true"
        className={`fixed right-0 bottom-0 md:bottom-6 md:right-6 w-full md:w-[380px] h-full md:h-[550px] bg-[var(--card-bg)]/95 backdrop-blur-xl border-t md:border border-[var(--border-color)] md:rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 z-50 ${
          isOpen ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Panel Header */}
        <div className="px-5 py-4 border-b border-[var(--border-color)] bg-black/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--accent-color)] text-slate-950 flex items-center justify-center font-bold font-mono text-sm">
              AI
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--foreground)] leading-tight">Hasir's Agent</h4>
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-[var(--accent-color)] uppercase tracking-widest mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-color)]"></span>
                Online
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors rounded-full hover:bg-[var(--border-color)]"
            aria-label="Close Assistant"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed font-sans ${
                msg.sender === "user"
                  ? "self-end bg-[var(--accent-color)] text-slate-950 font-medium rounded-tr-sm"
                  : "self-start bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--border-color)] rounded-tl-sm"
              }`}
            >
              {msg.sender === "user" ? <p>{msg.text}</p> : formatText(msg.text)}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="self-start bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions chips */}
        <div className="px-5 pb-3 flex flex-wrap gap-2">
          {[
            { id: "experience", label: "Experience", icon: <Briefcase size={12} /> },
            { id: "projects", label: "Projects", icon: <Rocket size={12} /> },
            { id: "publications", label: "Publications", icon: <GraduationCap size={12} /> },
            { id: "contact", label: "Contact", icon: <Mail size={12} /> },
            { id: "resume", label: "Resume", icon: <FileText size={12} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleSendMessage(item.id)}
              className="inline-flex items-center gap-1.5 text-[10px] font-mono px-3 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:bg-[var(--accent-color)] hover:text-slate-950 hover:border-[var(--accent-color)] transition-all cursor-pointer"
            >
              <span className="shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="px-5 py-4 border-t border-[var(--border-color)] bg-black/5 flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-xs text-[var(--foreground)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-color)] transition-colors"
          />
          <button
            type="submit"
            className="w-9 h-9 rounded-lg bg-[var(--accent-color)] text-slate-950 flex items-center justify-center hover:opacity-90 transition-all"
            aria-label="Send Message"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </>
  );
}
