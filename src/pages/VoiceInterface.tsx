import { motion } from "framer-motion";
import { User, ArrowLeft, X, Mic, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useVoice } from "@/hooks/useVoice";

interface VoiceInterfaceProps {
  onBack: () => void;
  onNavigateToChat: () => void;
  user?: any;
}

export default function VoiceInterface({ onBack, onNavigateToChat, user }: VoiceInterfaceProps) {
  const { 
    isRecording, 
    isListening, 
    transcript, 
    response, 
    startRecording, 
    stopRecording,
    error 
  } = useVoice();

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getStatusText = () => {
    if (error) return `Error: ${error}`;
    if (isRecording) return "Mendengarkan... Silakan bicara";
    if (transcript) return `Anda berkata: "${transcript}"`;
    if (response) return `Nova: "${response}"`;
    return "Tap to start speaking";
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
          <h1 className="text-xl font-bold text-white">Talk with Nova</h1>
          <p className="text-sm text-white/70">Hii, I Can Help You?</p>
        </div>
        
        <button 
          onClick={onBack}
          className="w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Voice Visualizer */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          {/* Voice Pulse Animation */}
          <motion.div 
            className="w-48 h-48 mx-auto mb-8 relative cursor-pointer"
            onClick={handleToggleRecording}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className={`w-full h-full rounded-full glass flex items-center justify-center ${
                isRecording ? 'voice-pulse' : ''
              }`}
              animate={isRecording ? {
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 0 0 rgba(139, 92, 246, 0.7)",
                  "0 0 0 20px rgba(139, 92, 246, 0)",
                  "0 0 0 0 rgba(139, 92, 246, 0.7)"
                ]
              } : {}}
              transition={{ duration: 1.5, repeat: isRecording ? Infinity : 0 }}
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center relative">
                <Mic size={32} className="text-white" />
                
                {/* Voice Bars Animation */}
                {isRecording && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="voice-bars">
                      <div className="voice-bar"></div>
                      <div className="voice-bar"></div>
                      <div className="voice-bar"></div>
                      <div className="voice-bar"></div>
                      <div className="voice-bar"></div>
                      <div className="voice-bar"></div>
                      <div className="voice-bar"></div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Voice Status */}
          <motion.div 
            className="mb-6 min-h-16"
            key={getStatusText()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-white text-lg px-4 text-center break-words">
              {getStatusText()}
            </p>
          </motion.div>

          {/* Voice Controls */}
          <div className="flex justify-center space-x-6">
            <button 
              onClick={onBack}
              className="w-16 h-16 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <X size={24} />
            </button>
            
            <motion.button 
              onClick={handleToggleRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'glass hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Mic size={24} />
            </motion.button>
            
            <button 
              onClick={() => {
                onNavigateToChat();
                onBack();
              }}
              className="w-16 h-16 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <MessageCircle size={24} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
