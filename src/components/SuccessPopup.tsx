import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

interface SuccessPopupProps {
  onClose: () => void;
}

export default function SuccessPopup({ onClose }: SuccessPopupProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        className="w-full max-w-md glass-dark rounded-3xl p-8 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <ArrowRight size={16} />
        </button>

        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full glass flex items-center justify-center">
            <svg 
              className="w-6 h-6 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="w-12 h-1 bg-white/40 rounded-full mx-auto"></div>
        </div>

        <h2 className="text-xl font-bold text-white mb-4">Create account successfully</h2>
        <p className="text-white/80 mb-6 italic">
          Hii Super, Nice to meet you,<br />
          Let's have a cheerful chat!
        </p>

        <motion.div 
          className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3, type: "spring" }}
        >
          <Check size={24} className="text-white" />
        </motion.div>

        <p className="text-sm text-white/60">2025 SuperNova | Lifevander Indonesian</p>
      </motion.div>
    </div>
  );
}
