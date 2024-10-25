"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

export default function AIChat() {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    // Add user message to chat history
    setChatHistory((prev) => [...prev, { role: "user", content: message }])

    // TODO: Send message to AI service and get response
    // This is a placeholder, replace with actual API call
    const aiResponse = "This is a placeholder AI response."

    // Add AI response to chat history
    setChatHistory((prev) => [...prev, { role: "ai", content: aiResponse }])

    // Clear input
    setMessage("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {msg.content}
              </span>
            </div>
          ))}
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a question..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
