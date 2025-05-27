import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import IntroScreen from "@/pages/IntroScreen";
import LoginScreen from "@/pages/LoginScreen";
import Dashboard from "@/pages/Dashboard";
import ChatInterface from "@/pages/ChatInterface";
import VoiceInterface from "@/pages/VoiceInterface";
import RegisterPopup from "@/components/RegisterPopup";
import SuccessPopup from "@/components/SuccessPopup";

export type Screen = 'intro' | 'login' | 'dashboard' | 'chat' | 'voice';

function Router() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('intro');
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Auto transition from intro to login after 3 seconds
    if (currentScreen === 'intro') {
      const timer = setTimeout(() => {
        setCurrentScreen('login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleRegisterSuccess = (userData: any) => {
    setUser(userData);
    setShowRegisterPopup(false);
    setShowSuccessPopup(true);
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    setCurrentScreen('dashboard');
  };

  const handleSkipToDashboard = () => {
    setCurrentScreen('dashboard');
  };

  return (
    <div className="min-h-screen">
      {currentScreen === 'intro' && <IntroScreen />}
      {currentScreen === 'login' && (
        <LoginScreen 
          onShowRegister={() => setShowRegisterPopup(true)}
          onSkipToDashboard={handleSkipToDashboard}
        />
      )}
      {currentScreen === 'dashboard' && (
        <Dashboard 
          onNavigateToChat={() => setCurrentScreen('chat')}
          onNavigateToVoice={() => setCurrentScreen('voice')}
          onBackToLogin={() => setCurrentScreen('login')}
          user={user}
        />
      )}
      {currentScreen === 'chat' && (
        <ChatInterface 
          onBack={() => setCurrentScreen('dashboard')}
          user={user}
        />
      )}
      {currentScreen === 'voice' && (
        <VoiceInterface 
          onBack={() => setCurrentScreen('dashboard')}
          onNavigateToChat={() => setCurrentScreen('chat')}
          user={user}
        />
      )}

      {showRegisterPopup && (
        <RegisterPopup 
          onClose={() => setShowRegisterPopup(false)}
          onSuccess={handleRegisterSuccess}
        />
      )}

      {showSuccessPopup && (
        <SuccessPopup 
          onClose={handleSuccessPopupClose}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
