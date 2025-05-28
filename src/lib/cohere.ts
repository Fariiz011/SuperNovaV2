const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY || "default_key";
const COHERE_API_URL = "https://api.cohere.ai/v1/generate";

export interface CohereResponse {
  generations: Array<{
    text: string;
  }>;
}

export async function generateCohereResponse(message: string): Promise<string> {
  try {
    const response = await fetch(COHERE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command",
        prompt: `You are SuperNova, a helpful AI assistant that can speak both Indonesian and English fluently. You are friendly, knowledgeable, and always ready to help. Respond naturally and helpfully to: ${message}`,
        max_tokens: 200,
        temperature: 0.7,
        stop_sequences: [],
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.status}`);
    }

    const data: CohereResponse = await response.json();
    return data.generations[0].text.trim();
  } catch (error) {
    console.error("Cohere API error:", error);
    
    // Fallback responses based on language detection
    const isIndonesian = /[a-zA-Z\s]*/.test(message) && 
      (message.toLowerCase().includes('halo') || 
       message.toLowerCase().includes('hai') || 
       message.toLowerCase().includes('selamat') ||
       message.toLowerCase().includes('apa') ||
       message.toLowerCase().includes('bagaimana'));

    const fallbackResponses = {
      indonesian: [
        "Halo! Saya SuperNova, asisten AI Anda. Bagaimana saya bisa membantu Anda hari ini?",
        "Tentu saja! Saya siap membantu Anda dengan pertanyaan apapun.",
        "Terima kasih sudah menggunakan SuperNova. Ada yang bisa saya bantu?",
        "Maaf, saya mengalami sedikit masalah teknis. Bisakah Anda mengulangi pertanyaan Anda?",
        "Saya senang bisa berbicara dengan Anda! Apa yang ingin Anda ketahui?"
      ],
      english: [
        "Hello! I'm SuperNova, your AI assistant. How can I help you today?",
        "Sure, I'm ready to help you with any questions you might have.",
        "Thank you for using SuperNova. Is there anything I can assist you with?",
        "I apologize, I'm having some technical difficulties. Could you please repeat your question?",
        "I'm happy to chat with you! What would you like to know?"
      ]
    };

    const responses = isIndonesian ? fallbackResponses.indonesian : fallbackResponses.english;
    return responses[Math.floor(Math.random() * responses.length)];
  }
}
