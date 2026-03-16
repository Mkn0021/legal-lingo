"use client";

import { X, Send } from "lucide-react"
import { useState, useEffect, useRef } from "react"

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
}

export function ChatHandler({ onClose, prefill }: ChatHandlerProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const prefillSentRef = useRef<string | null>(null)

    function handleSend(message: string) {
        if (!message.trim()) return
        setMessages(prev => [...prev, { role: "user", content: message }])
        setInput("")
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Mock response — Chat API coming in Phase 2."
            }])
        }, 800)
    }

    useEffect(() => {
        if (prefill && prefillSentRef.current !== prefill) {
            handleSend(prefill)
            prefillSentRef.current = prefill
        }
    }, [prefill])

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
                    </div>
                )}
            </ChatMessages>

            <ChatToolbar>
                <ChatToolbarTextarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onSubmit={() => handleSend(input)}
                    placeholder="Ask about your document..."
                />
                <ChatToolbarAddon align="inline-end">
                    <ChatToolbarButton disabled={!input.trim()} size="icon">
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