import { motion } from "framer-motion";
import { User, ArrowLeft, MessageCircle, Mic, Image, Lightbulb, Send, Settings } from "lucide-react";
import { useState } from "react";
import SettingsSidebar from "@/components/SettingsSidebar";

interface DashboardProps {
  onNavigateToChat: () => void;
  onNavigateToVoice: () => void;
  onNavigateToImage: () => void;
  onBackToLogin: () => void;
  user?: any;
}

export default function Dashboard({ onNavigateToChat, onNavigateToVoice, onNavigateToImage, onBackToLogin, user }: DashboardProps) {
  const [quickMessage, setQuickMessage] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const handleQuickMessage = () => {
    if (quickMessage.trim()) {
      // Navigate to chat with the message
      onNavigateToChat();
      // Note: In a real app, you'd pass the message to the chat interface
    }
  };

  const features = [
    {
      icon: MessageCircle,
      title: "Chat with Nova",
      action: onNavigateToChat,
      active: true
    },
    {
      icon: Mic,
      title: "Talk with Nova", 
      action: onNavigateToVoice,
      active: true
    },
    {
      icon: Image,
      title: "Generate Image",
      action: onNavigateToImage,
      active: true
    },
    {
      icon: Lightbulb,
      title: "Coming soon",
      action: () => {},
      active: false
    }
  ];

  return (
    <motion.div 
      className="fixed inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <button 
          onClick={() => setShowSettings(true)}
          className="w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <Settings size={20} />
        </button>
        
        <div className="text-center">
          <div className="w-12 h-1 bg-white/40 rounded-full mx-auto mb-2"></div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
        </div>
        
        <button 
          onClick={onBackToLogin}
          className="w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Features Section */}
      <div className="px-6 flex-1">
        <h2 className="text-lg font-semibold text-white mb-6">Features</h2>
        
        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.button
                key={index}
                onClick={feature.action}
                disabled={!feature.active}
                className={`glass-dark rounded-3xl p-6 text-left transition-all transform hover:scale-105 ${
                  feature.active 
                    ? 'hover:bg-white/10 cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
                whileHover={feature.active ? { scale: 1.05 } : {}}
                whileTap={feature.active ? { scale: 0.95 } : {}}
              >
                <div className={`w-12 h-12 rounded-2xl glass flex items-center justify-center mb-4 ${
                  feature.active ? 'bg-purple-500/50' : 'bg-gray-500/50'
                }`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <svg 
                  className="w-5 h-5 text-white/60 float-right" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Quick Message Input */}
        <motion.div 
          className="glass-dark rounded-full p-4 flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <input 
            type="text" 
            value={quickMessage}
            onChange={(e) => setQuickMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuickMessage()}
            placeholder="write your message for us" 
            className="flex-1 bg-transparent text-white placeholder-white/60 focus:outline-none px-4"
          />
          <button 
            onClick={handleQuickMessage}
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <Send size={16} />
          </button>
        </motion.div>
      </div>

      {/* Settings Sidebar */}
      <SettingsSidebar 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        onLogout={onBackToLogin}
      />
    </motion.div>
  );
}
