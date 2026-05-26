"use client"

import { useEffect, useRef, useState } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface Props {
  propertyCode: string
}

export function AssistantChat({ propertyCode }: Props) {
  const [messages, setMessages] = useState<Message[]>([])

  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])

    const currentInput = input

    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: currentInput,
          propertyCode,
        }),
      })

      if (!response.body) {
        throw new Error("No response body")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      let assistantText = ""

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
        },
      ])

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        const chunk = decoder.decode(value)

        assistantText += chunk

        setMessages((prev) => {
          const updated = [...prev]

          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantText,
          }

          return updated
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="rounded-3xl border border-cyan-500/20 bg-zinc-900 p-6 shadow-2xl">
        <div className="mb-6">
          <p className="text-sm font-medium uppercase tracking-widest text-cyan-300">
            Assistente Virtual
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Tire dúvidas sobre sua estadia
          </h2>

          <p className="mt-2 text-zinc-400">
            Pergunte sobre WiFi, check-in, regras da casa e recomendações da região.
          </p>
        </div>

        <div className="mb-4 h-[400px] overflow-y-auto rounded-2xl bg-black/30 p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="rounded-2xl border border-dashed border-zinc-700 p-5 text-zinc-500">
                Experimente perguntar:
                <ul className="mt-3 space-y-2">
                  <li>• Qual a senha do WiFi?</li>
                  <li>• Posso levar meu cachorro?</li>
                  <li>• Que restaurantes tem perto?</li>
                  <li>• A que horas é o check-in?</li>
                </ul>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-2xl p-4 ${message.role === "user"
                    ? "ml-auto bg-cyan-400 text-zinc-950"
                    : "bg-zinc-800 text-zinc-100"
                  }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}

                  {loading &&
                    index === messages.length - 1 &&
                    message.role === "assistant" && (
                      <span className="ml-1 animate-pulse">
                        ▋
                      </span>
                    )}
                </p>
              </div>
            ))}

            <div ref={bottomRef} />
          </div>
        </div>

        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage()
              }
            }}
            placeholder="Digite sua pergunta..."
            className="flex-1 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />

          <button
            type="button"
            onClick={sendMessage}
            disabled={loading}
            className="rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-300 disabled:opacity-50"
          >
            {loading ? "..." : "Enviar"}
          </button>
        </div>
      </div>
    </section>
  )
}