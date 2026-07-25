"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, X, MessageSquare, Bot } from "lucide-react";

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
      intent: "location",
      keys: [/\b(from|based|location|live|living|bangalore|rajasthan|where)\b/i],
      response:
        "Hasir is based in **Bangalore, India**, but he is originally from **Rajasthan** and collaborates with global/remote teams!",
    },
    {
      intent: "identity",
      keys: [/\b(who is he|who are you|who is hasir|who is hashir|tell me about yourself|your name|bio|profile|who is this|he|him|his)\b/i],
      response:
        "I am Hasir's custom-built portfolio assistant, running client-side to serve fast context about his research and engineering projects.\n\nHasir himself is an Applied AI engineer focusing on LLM safety, custom data pipelines, and agentic workflows. He is also a Data Science student at **IIT Madras**.",
    },
    {
      intent: "name",
      keys: [/\b(hasir|hashir|haseer)\b/i],
      response:
        "Yep, that's me! (Spelled **Hasir**, but I answer to both Hasir and Hashir!). Spelled with an 'h' is super common, so no worries!\n\nI'm a Data Science student at IIT Madras and an Applied AI engineer focusing on LLM safety and agentic systems.",
    },
    {
      intent: "education",
      keys: [/\b(iit|iitm|madras|education|degree|studies|study|mathematics|math|mdsu)\b/i],
      response:
        "My academic foundation includes:\n\n- **BS in Data Science & Applications** from **IIT Madras** (Online program).\n- **B.Sc. in Mathematics (Honours)** from **MDSU** (expected 2027).\n\nThis dual focus grounds my applied AI engineering in solid statistical methods and data science theory.",
    },
    {
      intent: "resume",
      keys: [/\b(resume|cv|biodata|pdf|document)\b/i],
      response:
        "You can view and download my official resume here: [**HASIR_SAYED.pdf ↗**](/HASIR_SAYED.pdf).\n\nIt contains a comprehensive overview of my AI Safety engineering at Janitor AI, Data Science BS at IIT Madras, and applied AI systems projects.",
    },
    {
      intent: "experience",
      keys: [/\b(experience|job|work|janitor|safety|guardrails|jailbreak|pipeline)\b/i],
      response:
        "I currently work as an **AI Safety & Data Pipeline Engineer at Janitor AI**.\n\nMy core work is designing autonomous three-agent sanitization pipelines, implementing real-time prompt-injection shields, and optimizing structural consistencies through multi-agent adversarial simulations.",
    },
    {
      intent: "projects",
      keys: [/\b(project|projects|code|portfolio|tool|autonomous)\b/i],
      response:
        "Here are some of my key engineering projects:\n\n1. **Personal SLM Fine-Tuning:** Fine-tuned Qwen 2.5 on custom domain datasets with local quantized inference.\n2. **Autonomous Data Science Tool:** A multi-agent preprocessing pipeline deployed on Vercel.\n3. **Agentic MIS Portfolio:** An executive portfolio featuring a custom RAG-based assistant.\n\nWhich project would you like to explore in detail?",
    },
    {
      intent: "publications",
      keys: [/\b(publication|publications|research|paper|doi|zenodo|benchmark)\b/i],
      response:
        "I authored and published DOI-registered research on Zenodo: [**Benchmarking SLM Performance & Integration (Zenodo Record 21396947) ↗**](https://zenodo.org/records/21396947).\n\nThe research systematically benchmarks lightweight local language models across capability, speed, memory, and edge deployment trade-offs to aid model-selection decisions.",
    },
    {
      intent: "mcp",
      keys: [/\b(mcp|agent|context|server|protocol|systems)\b/i],
      response:
        "I design custom servers using the **Model Context Protocol (MCP)**.\n\nThis allows localized LLMs to safely inspect workspace directories, read file contexts, and execute developer commands, turning static models into active workspace agents.",
    },
    {
      intent: "contact",
      keys: [/\b(contact|email|phone|linkedin|github|reach|number|mail)\b/i],
      response:
        "You can reach me directly through these channels:\n\n- **Email:** hasir160807@gmail.com\n- **Phone:** +91 8955270513\n- **GitHub:** [github.com/Sayyedhash888](https://github.com/Sayyedhash888)\n- **LinkedIn:** [linkedin.com/in/hasir-sayed](https://www.linkedin.com/in/hasir-sayed-365447413/)",
    },
  ];

  const getAgentResponse = (message: string): string => {
    const msg = message.toLowerCase().trim();

    // Contextual follow-up elaboration
    const isRequestingMore =
      msg.includes("more") ||
      msg.includes("detail") ||
      msg.includes("elaborate") ||
      msg.includes("tell me");

    if (isRequestingMore && lastIntent) {
      if (lastIntent === "experience") {
        return "At **Janitor AI**, my safety pipelines process millions of requests. I leverage LLM-in-the-loop evaluators to detect prompt injection risks and automatically format outputs, reducing safety escapes by 35%.";
      }
      if (lastIntent === "projects") {
        return "For the **SLM Fine-Tuning** project, I utilized Qlora to fine-tune Qwen 2.5-0.5B on mathematical reasoning data, achieving comparable performance to larger models on domain-specific benchmarks.";
      }
      if (lastIntent === "education") {
        return "The BS in Data Science from **IIT Madras** covers programming in Python/Java, database management, machine learning models, and big data tools. It is highly hands-on and rigorous.";
      }
      if (lastIntent === "publications") {
        return "My paper benchmarks models like Llama 3.2 1B and Qwen 2.5 1.5B on edge tasks, analyzing memory scaling and throughput bottlenecks in resource-constrained web containers.";
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

    // Default fallback response
    return "I am Hasir's custom-built portfolio assistant, designed to serve lightweight, lightning-fast context about his research and engineering projects directly in your browser without burning API costs.\n\nFeel free to select a quick-reply chip below or email Hasir directly at **hasir160807@gmail.com**!";
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Append user message
    const userMsgId = Date.now().toString();
    setMessages((prev) => [...prev, { id: userMsgId, sender: "user", text }]);
    setInputValue("");
    setIsTyping(true);

    // Simulated typing delay
    setTimeout(() => {
      setIsTyping(false);
      const agentReply = getAgentResponse(text);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "agent", text: agentReply },
      ]);
    }, 800);
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
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-color)] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-color)]"></span>
        </span>
        ✦ ASK AI AGENT
      </button>

      {/* Slide-out Chat Panel */}
      <div
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
          {["experience", "projects", "publications", "contact", "resume"].map((query) => (
            <button
              key={query}
              onClick={() => handleSendMessage(query)}
              className="text-[10px] font-mono px-3 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:bg-[var(--accent-color)] hover:text-slate-950 hover:border-[var(--accent-color)] transition-all"
            >
              {query === "experience" && "💼 Experience"}
              {query === "projects" && "🚀 Projects"}
              {query === "publications" && "🎓 Publications"}
              {query === "contact" && "✉️ Contact"}
              {query === "resume" && "📄 Resume"}
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
