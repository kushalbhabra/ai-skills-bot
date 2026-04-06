"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";

export default function Chat() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const isLoading = status === "submitted" || status === "streaming";

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", maxWidth: 800, margin: "0 auto", padding: "0 16px" }}>
      <div style={{ padding: "16px 0", borderBottom: "1px solid #e0e0e0" }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>🛠️ AI Skills Bot</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#666" }}>
          Powered by just-bash InMemoryFs · Skills: csv, text
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 0" }}>
        {messages.length === 0 && (
          <div style={{ color: "#888", fontSize: 14, marginTop: 32, textAlign: "center" }}>
            <p>Try asking:</p>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>&quot;Analyze this CSV: date,product,qty\n2024-01,Widget,100&quot;</li>
              <li>&quot;What skills do you have?&quot;</li>
              <li>&quot;Count words in: The quick brown fox jumps&quot;</li>
            </ul>
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "75%",
                padding: "10px 14px",
                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: m.role === "user" ? "#0070f3" : "#fff",
                color: m.role === "user" ? "#fff" : "#000",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                fontSize: 14,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {m.parts.map((part, i) => {
                if (part.type === "text") {
                  return <span key={i}>{part.text}</span>;
                }
                // Tool invocation parts have type like "tool-skill", "tool-bash", or "dynamic-tool"
                if (part.type.startsWith("tool-") || part.type === "dynamic-tool") {
                  const toolPart = part as { type: string; toolName?: string; toolCallId?: string; state?: string; output?: unknown };
                  const toolName = toolPart.toolName ?? part.type.replace(/^tool-/, "");
                  const output = toolPart.output;
                  return (
                    <div key={i} style={{ background: "#f0f0f0", borderRadius: 6, padding: "6px 10px", margin: "6px 0", fontSize: 12, color: "#555" }}>
                      <strong>🔧 {toolName}</strong>
                      {output !== undefined && (
                        <div style={{ marginTop: 4, whiteSpace: "pre-wrap", maxHeight: 200, overflowY: "auto" }}>
                          {typeof output === "object" && output !== null && "stdout" in output
                            ? (output as { stdout: string }).stdout
                            : JSON.stringify(output, null, 2)}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ color: "#888", fontSize: 13, padding: "4px 0" }}>Thinking…</div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "12px 0", borderTop: "1px solid #e0e0e0", display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the agent to process data..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 24,
            border: "1px solid #ddd",
            fontSize: 14,
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          style={{
            padding: "10px 20px",
            borderRadius: 24,
            border: "none",
            background: "#0070f3",
            color: "#fff",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

