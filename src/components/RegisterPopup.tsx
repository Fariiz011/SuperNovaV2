import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const registerSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

interface RegisterPopupProps {
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export default function RegisterPopup({ onClose, onSuccess }: RegisterPopupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/register", {
        email: data.email,
        password: data.password
      });
      
      const result = await response.json();
      onSuccess(result.user);
      
      toast({
        title: "Registration Successful",
        description: "Account created successfully!",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        className="w-full max-w-md glass-dark rounded-3xl p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full glass flex items-center justify-center">
            <svg 
              className="w-6 h-6 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="w-12 h-1 bg-white/40 rounded-full mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white">Register</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Email</label>
            <input 
              type="email" 
              {...register("email")}
              className="w-full glass rounded-full px-6 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30" 
              placeholder="supernova@support.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Password</label>
            <input 
              type="password" 
              {...register("password")}
              className="w-full glass rounded-full px-6 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30" 
              placeholder="Create password"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Confirm Password</label>
            <input 
              type="password" 
              {...register("confirmPassword")}
              className="w-full glass rounded-full px-6 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30" 
              placeholder="Enter password"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-full py-4 text-white font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <X size={16} />
        </button>

        <p className="text-sm text-white/60 text-center mt-6">
          2025 SuperNova | Lifevander Indonesian
        </p>
      </motion.div>
    </div>
  );
}
