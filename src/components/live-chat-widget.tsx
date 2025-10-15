'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const botResponses: { [key: string]: string } = {
    'hello': 'Hi there! How can I help you today?',
    'hi': 'Hello! What can I do for you?',
    'help': 'I can help with questions about our repair services, development offerings, or pricing. What do you need assistance with?',
    'repair': 'We offer various repair services including screen replacement, battery replacement, and more. For a quote, please visit our repairs page.',
    'development': 'We specialize in AI-powered web and app development. For a consultation, please visit our contact page.',
    'pricing': 'For repair pricing, please use the quote tool on the repairs page. For development projects, schedule a free consultation for a custom quote.',
    'default': "I'm sorry, I didn't quite understand that. I can help with 'repair', 'development', or 'pricing' questions. Please try one of those keywords.",
  };

  const addMessage = (sender: 'user' | 'bot', text: string) => {
    setMessages(prev => [...prev, { sender, text }]);
  };

  useEffect(() => {
    if (isOpen) {
        // Greet the user when the chat opens for the first time
        if (messages.length === 0) {
            setTimeout(() => {
                addMessage('bot', 'Welcome to S-Tech Services! How can I assist you today? You can ask about repairs, development, or pricing.');
            }, 500);
        }
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const userMessage = inputValue.trim();
      addMessage('user', userMessage);
      setInputValue('');

      // Simulate bot response
      setTimeout(() => {
        const lowerCaseMessage = userMessage.toLowerCase();
        let botReply = botResponses['default'];

        for (const keyword in botResponses) {
          if (lowerCaseMessage.includes(keyword)) {
            botReply = botResponses[keyword];
            break;
          }
        }
        addMessage('bot', botReply);
      }, 1000);
    }
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      <div className={cn("fixed bottom-4 right-4 z-50 transition-all duration-300", isOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100')}>
        <Button size="icon" className="rounded-full w-14 h-14 shadow-lg" onClick={toggleChat}>
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      <div className={cn("fixed bottom-4 right-4 z-50 w-full max-w-sm transition-all duration-300", isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none')}>
        <Card className="flex h-[60vh] flex-col shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b p-4">
            <div className="flex items-center gap-3">
              <Bot className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline text-lg">Live Chat</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleChat}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
             <ScrollArea className="h-full" ref={scrollAreaRef}>
                <div className="p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={cn("flex items-end gap-2", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                     {msg.sender === 'bot' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                <Bot className="h-5 w-5"/>
                            </AvatarFallback>
                        </Avatar>
                     )}
                    <div
                      className={cn(
                        'max-w-[75%] rounded-lg px-3 py-2 text-sm',
                        msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                      )}
                    >
                      {msg.text}
                    </div>
                     {msg.sender === 'user' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                     )}
                  </div>
                ))}
                </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                autoComplete="off"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
