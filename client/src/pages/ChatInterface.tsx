import { motion } from "framer-motion";
import { User, ArrowLeft, Mic, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { useVoice } from "@/hooks/useVoice";

interface ChatInterfaceProps {
  onBack: () => void;
  user?: any;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ChatInterface({ onBack, user }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi, Welcome to AI SuperNova, Nice to meet you, How can I help you?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage: sendChatMessage } = useChat();
  const { 
    isRecording, 
    transcript, 
    startRecording, 
    stopRecording 
  } = useVoice(user?.id || 1);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      const response = await sendChatMessage({
        userId: user?.id || 1,
        message: message,
        isVoice: false
      });

      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.response || "Maaf, saya mengalami masalah teknis. Silakan coba lagi.",
          sender: 'ai',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1000 + Math.random() * 1000);
    } catch (error) {
      setTimeout(() => {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Maaf, terjadi kesalahan. Silakan coba lagi.",
          sender: 'ai',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      try {
        await startRecording();
        if (transcript) {
          setMessage(transcript);
        }
      } catch (error) {
        console.error("Voice input error:", error);
      }
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <button className="w-12 h-12 rounded-full glass flex items-center justify-center text-white">
          <User size={20} />
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">Chat with Nova</h1>
          <p className="text-sm text-white/70">Hii, I Can Help You?</p>
        </div>
        
        <button 
          onClick={onBack}
          className="w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 px-6 overflow-y-auto">
        <div className="glass rounded-3xl p-6 min-h-96 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`message-bubble rounded-2xl p-4 max-w-xs ${
                  msg.sender === 'user' 
                    ? 'bg-white/20 rounded-br-md' 
                    : 'bg-purple-600/60 rounded-bl-md'
                }`}>
                  <p className="text-white">{msg.text}</p>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div 
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-purple-600/60 rounded-2xl rounded-bl-md p-4 max-w-xs">
                  <div className="typing-dots">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-6">
        <div className="glass rounded-full p-4 flex items-center gap-3">
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Write your message?" 
            className="flex-1 bg-transparent text-white placeholder-white/60 focus:outline-none px-2"
          />
          <button 
            onClick={handleVoiceInput}
            className={`w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-all relative ${
              isRecording ? 'bg-red-500/50' : ''
            }`}
          >
            <Mic size={16} />
            {isRecording && (
              <div className="absolute inset-0 rounded-full voice-pulse">
                <div className="voice-bars absolute inset-0 flex items-center justify-center">
                  <div className="voice-bar"></div>
                  <div className="voice-bar"></div>
                  <div className="voice-bar"></div>
                  <div className="voice-bar"></div>
                  <div className="voice-bar"></div>
                </div>
              </div>
            )}
          </button>
          <button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-all disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
