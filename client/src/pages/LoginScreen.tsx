import { motion } from "framer-motion";
import { X } from "lucide-react";

interface LoginScreenProps {
  onShowRegister: () => void;
  onSkipToDashboard: () => void;
}

export default function LoginScreen({ onShowRegister, onSkipToDashboard }: LoginScreenProps) {
  return (
    <motion.div 
      className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md px-6">
        {/* Close Button */}
        <button className="absolute top-6 left-6 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <X size={20} />
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-8">SuperNova</h1>
          
          {/* Welcome Section */}
          <motion.div 
            className="glass rounded-3xl p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full glass flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-white" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Welcome</h2>
            <p className="text-white/80">AI Assistant, the best solution to help with everything!</p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <button 
              onClick={onShowRegister}
              className="w-full glass rounded-full py-4 px-6 text-white font-semibold hover:bg-white/20 transition-all flex items-center group"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              Register Account
            </button>
            
            <button 
              onClick={onSkipToDashboard}
              className="w-full glass rounded-full py-4 px-6 text-white font-semibold hover:bg-white/20 transition-all flex items-center group"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              Get Started
              <svg className="w-5 h-5 ml-auto text-white/60 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </motion.div>

          <motion.p 
            className="text-sm text-white/60 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            2025 SuperNova | Lifevander Indonesian
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
