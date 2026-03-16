"use client";

import { X, Send } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { ScanResult } from "@/lib/types"
import { Chat } from "../chat/chat"
import { ChatMessages } from "../chat/chat-messages"
import { ChatHeader, ChatHeaderAddon, ChatHeaderButton, ChatHeaderMain } from "../chat/chat-header"
import { ChatToolbar, ChatToolbarTextarea, ChatToolbarAddon, ChatToolbarButton } from "../chat/chat-toolbar"

interface Message {
    role: "user" | "assistant"
    content: string
    isStreaming?: boolean
}

interface ChatHandlerProps {
    onClose: () => void
    prefill?: string | null
    documentContext: ScanResult
    language: "es" | "de"
    messages: Message[]
    setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void
}

export function ChatHandler({ onClose, prefill, documentContext, language, messages, setMessages }: ChatHandlerProps) {
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    async function handleSend(message: string) {
        if (!message.trim() || isLoading) return

        const userMessage: Message = { role: "user", content: message }
        const updatedMessages = [...messages, userMessage]

        setMessages(updatedMessages)
        setInput("")
        setIsLoading(true)

        setMessages(prev => [...prev, {
            role: "assistant",
            content: "",
            isStreaming: true,
        }])

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: updatedMessages.map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                    documentContext,
                    language,
                }),
            })

            if (!res.ok || !res.body) throw new Error("Failed to connect")

            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            let accumulated = ""

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                accumulated += decoder.decode(value, { stream: true })

                setMessages(prev => {
                    const updated = [...prev]
                    updated[updated.length - 1] = {
                        role: "assistant",
                        content: accumulated,
                        isStreaming: true,
                    }
                    return updated
                })
            }

            // Mark streaming done
            setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = {
                    role: "assistant",
                    content: accumulated,
                    isStreaming: false,
                }
                return updated
            })

        } catch (err) {
            setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = {
                    role: "assistant",
                    content: "Something went wrong. Please try again.",
                    isStreaming: false,
                }
                return updated
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (prefill && prefill.trim()) {
            // Check if this exact message already exists in the chat
            const messageExists = messages.some(msg => msg.content === prefill && msg.role === "user")
            if (!messageExists) {
                handleSend(prefill)
            }
        }
    }, [prefill, messages])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
        <Chat>
            <ChatHeader className="border-b border-black/8 px-4 py-5">
                <ChatHeaderMain>
                    <span className="text-gray-700">
                        Ask your document
                    </span>
                </ChatHeaderMain>
                <ChatHeaderAddon>
                    <ChatHeaderButton onClick={onClose}>
                        <X size={16} />
                    </ChatHeaderButton>
                </ChatHeaderAddon>
            </ChatHeader>

            <ChatMessages>
                {messages.length === 0 ? (
                    <Suggestions handleSend={handleSend} />
                ) : (
                    <div className="flex flex-col gap-4 p-4">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                            ? "bg-gray-950 text-white rounded-br-none"
                                            : "bg-gray-100 text-gray-950 rounded-bl-none"
                                        }`}
                                >
                                    <p className="wrap-break-word">
                                        {msg.content}
                                        {msg.isStreaming && (
                                            <span className="animate-pulse">▌</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </ChatMessages>

            <ChatToolbar>
                <ChatToolbarTextarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSend(input)
                        }
                    }}
                    onSubmit={() => handleSend(input)}
                    placeholder="Ask about your document..."
                />
                <ChatToolbarAddon align="inline-end">
                    <ChatToolbarButton
                        disabled={!input.trim() || isLoading}
                        size="icon"
                        onClick={() => handleSend(input)}
                    >
                        <Send size={16} />
                    </ChatToolbarButton>
                </ChatToolbarAddon>
            </ChatToolbar>
        </Chat>
    )
}

const Suggestions = ({ handleSend }: { handleSend: (message: string) => void }) => {
    const suggestions = [
        "What are my main obligations?",
        "Are there any red flags?",
        "Explain the termination clause",
        "What happens if I miss a payment?",
    ]

    return (
        <div className="flex flex-col gap-2 p-4">
            {suggestions.map(q => (
                <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="text-left text-xs text-gray-600 border border-black/8 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors"
                >
                    {q}
                </button>
            ))}
        </div>
    )
}