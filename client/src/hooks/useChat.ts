import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: number;
  userId?: number;
  message: string;
  response?: string;
  isVoice: boolean;
  createdAt: Date;
}

interface SendMessageData {
  userId: number;
  message: string;
  isVoice?: boolean;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (data: SendMessageData): Promise<ChatMessage> => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/chat/message", {
        userId: data.userId,
        message: data.message,
        isVoice: data.isVoice || false
      });
      
      const result = await response.json();
      const newMessage = result.message;
      
      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (error) {
      toast({
        title: "Message Failed",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getChatHistory = async (userId: number) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("GET", `/api/chat/history/${userId}`, undefined);
      const result = await response.json();
      setMessages(result.messages);
      return result.messages;
    } catch (error) {
      toast({
        title: "Failed to Load Chat",
        description: "Could not load chat history.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    getChatHistory,
    clearMessages
  };
}
