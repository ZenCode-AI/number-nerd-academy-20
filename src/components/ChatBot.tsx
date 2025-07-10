
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, X, Send } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean; timestamp: Date }>>([
    { text: "Hi! I'm here to help you with Number Nerd Academy. How can I assist you today?", isBot: true, timestamp: new Date() }
  ]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log('Email submitted:', email);
      setIsEmailSubmitted(true);
      setMessages(prev => [...prev, 
        { text: `Thank you! I've recorded your email: ${email}`, isBot: true, timestamp: new Date() },
        { text: "Now, what questions do you have about our SAT, CBSE, GCSE & A-Level Math preparation services?", isBot: true, timestamp: new Date() }
      ]);
    }
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const userMessage = { text: message, isBot: false, timestamp: new Date() };
      setMessages(prev => [...prev, userMessage]);
      
      // Simple bot response
      setTimeout(() => {
        const botResponse = {
          text: "Thank you for your question! We've received your inquiry and will respond to your email address shortly. Our team typically responds within 24 hours.",
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
      
      setMessage('');
      console.log('Question submitted:', { email, question: message });
    }
  };

  const resetChat = () => {
    setEmail('');
    setIsEmailSubmitted(false);
    setMessage('');
    setMessages([
      { text: "Hi! I'm here to help you with Number Nerd Academy. How can I assist you today?", isBot: true, timestamp: new Date() }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary-600 shadow-lg"
          size="icon"
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-80 h-96 shadow-xl border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b bg-primary text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">NNA Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white hover:bg-primary-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <CardContent className="p-0 h-80 flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      msg.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-primary text-white'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              {!isEmailSubmitted ? (
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-sm"
                  />
                  <Button type="submit" className="w-full" size="sm">
                    Continue
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleMessageSubmit} className="flex space-x-2">
                  <Input
                    placeholder="Type your question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 text-sm"
                  />
                  <Button type="submit" size="icon" className="h-10 w-10">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              )}
              
              {isEmailSubmitted && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetChat}
                  className="w-full mt-2 text-xs"
                >
                  Start New Conversation
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChatBot;
