export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

export class SpeechManager {
  private recognition: any;
  private synthesis: SpeechSynthesis;
  private isListening: boolean = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeRecognition();
  }

  private initializeRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'id-ID'; // Default to Indonesian
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'id-ID';
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public async startListening(): Promise<SpeechRecognitionResult> {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported');
    }

    if (this.isListening) {
      throw new Error('Already listening');
    }

    return new Promise((resolve, reject) => {
      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        const result = event.results[0];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;

        resolve({ transcript, confidence });
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    });
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public speak(text: string, language: 'id-ID' | 'en-US' = 'id-ID'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

      this.synthesis.speak(utterance);
    });
  }

  public stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  public detectLanguage(text: string): 'id-ID' | 'en-US' {
    const indonesianKeywords = ['halo', 'hai', 'selamat', 'terima', 'kasih', 'apa', 'bagaimana', 'saya', 'dengan', 'untuk'];
    const lowercaseText = text.toLowerCase();
    
    const indonesianMatches = indonesianKeywords.filter(keyword => 
      lowercaseText.includes(keyword)
    ).length;

    return indonesianMatches > 0 ? 'id-ID' : 'en-US';
  }

  public setLanguage(language: 'id-ID' | 'en-US') {
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const speechManager = new SpeechManager();
