import { useState, useCallback, useRef } from "react";
import { speechManager } from "@/lib/speech";
import { useChat } from "@/hooks/useChat";
import { useToast } from "@/hooks/use-toast";

export function useVoice(userId: number = 1) {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const { sendMessage } = useChat();
  const { toast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);

  const startRecording = useCallback(async () => {
    if (!speechManager.isSupported()) {
      setError("Speech recognition is not supported in this browser");
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRecording(true);
      setIsListening(true);
      setError(null);
      setTranscript("");
      setResponse("");

      // Create new abort controller for this session
      abortControllerRef.current = new AbortController();

      const result = await speechManager.startListening();
      
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setTranscript(result.transcript);
      setIsListening(false);

      // Detect language and process the voice input
      const detectedLanguage = speechManager.detectLanguage(result.transcript);
      speechManager.setLanguage(detectedLanguage);

      // Send to chat API
      const chatResponse = await sendMessage({
        userId,
        message: result.transcript,
        isVoice: true
      });

      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      const aiResponse = chatResponse.response || "Sorry, I couldn't process that.";
      setResponse(aiResponse);

      // Speak the response
      setIsSpeaking(true);
      await speechManager.speak(aiResponse, detectedLanguage);
      setIsSpeaking(false);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      setIsListening(false);
      setIsSpeaking(false);
      
      toast({
        title: "Voice Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRecording(false);
    }
  }, [userId, sendMessage, toast]);

  const stopRecording = useCallback(() => {
    // Abort current session
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    speechManager.stopListening();
    speechManager.stopSpeaking();
    
    setIsRecording(false);
    setIsListening(false);
    setIsSpeaking(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript("");
    setResponse("");
    setError(null);
  }, []);

  return {
    isRecording,
    isListening,
    isSpeaking,
    transcript,
    response,
    error,
    startRecording,
    stopRecording,
    clearTranscript,
    isSupported: speechManager.isSupported()
  };
}
