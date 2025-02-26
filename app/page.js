"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"


// 🔹 Componente para renderizar mensajes con soporte HTML
function ChatMessage({ message }) {
  return <p dangerouslySetInnerHTML={{ __html: message }} />
}

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content: `¡Bienvenido a la Universidad Don Bosco! Soy tu asistente virtual y estoy aquí para ayudarte con:

📚 Información académica (calendario, horarios, inscripciones)
📖 Biblioteca y recursos del campus
🎓 Servicios estudiantiles
🤝 Apoyo y bienestar estudiantil
💼 Desarrollo profesional
🎮 Vida estudiantil y eventos

¿En qué puedo ayudarte?`,
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }, [])

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus()
      }, 100)
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
    focusInput()
  }, [scrollToBottom, focusInput])

  useEffect(() => {
    focusInput()
  }, [focusInput])

  useEffect(() => {
    const handleFocusLoss = () => {
      if (document.activeElement !== inputRef.current) {
        focusInput()
      }
    }

    document.addEventListener("click", handleFocusLoss)
    return () => document.removeEventListener("click", handleFocusLoss)
  }, [focusInput])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    scrollToBottom()

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: data.content,
        },
      ])
      scrollToBottom()
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.",
        },
      ])
    } finally {
      setIsLoading(false)
      focusInput()
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
      <Card className="w-full max-w-xl shadow-lg bg-secondary text-secondary-foreground">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-center text-2xl">Universidad Don Bosco - Asistente Virtual</CardTitle>
        </CardHeader>

        <CardContent className="p-4">
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-line ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <ChatMessage message={message.content} />
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} className="h-px" />
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="border-t border-border p-4">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              className="flex-1 bg-input text-foreground border-border"
              disabled={isLoading}
              autoFocus
            />
            <Button type="submit" size="icon" className="rounded-full bg-primary hover:bg-primary/80" disabled={isLoading}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Enviar mensaje</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}