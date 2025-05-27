import { motion } from "framer-motion";
import { User, ArrowLeft, Image, Download, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ImageGeneratorProps {
  onBack: () => void;
  user?: any;
}

export default function ImageGenerator({ onBack, user }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Silakan masukkan deskripsi gambar yang ingin dibuat.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImage(imageUrl);

      toast({
        title: "Gambar Berhasil Dibuat!",
        description: "SuperNova telah menghasilkan gambar sesuai deskripsi Anda.",
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Gagal Membuat Gambar",
        description: "Terjadi kesalahan saat membuat gambar. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `supernova-generated-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isGenerating) {
      generateImage();
    }
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
          <h1 className="text-xl font-bold text-white">Generate Image</h1>
          <p className="text-sm text-white/70">Buat gambar dengan AI</p>
        </div>
        
        <button 
          onClick={onBack}
          className="w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 overflow-y-auto">
        {/* Prompt Input */}
        <motion.div 
          className="glass rounded-3xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="text-white font-semibold mb-4">Deskripsi Gambar</h3>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Contoh: Seorang kucing lucu bermain di taman dengan bunga sakura, anime style, detailed, colorful"
            className="w-full glass rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
            rows={4}
          />
          
          <div className="flex gap-3 mt-4">
            <button
              onClick={generateImage}
              disabled={isGenerating || !prompt.trim()}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl py-3 text-white font-semibold transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Membuat Gambar...
                </>
              ) : (
                <>
                  <Image size={16} />
                  Generate Image
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Generated Image Display */}
        <motion.div 
          className="glass rounded-3xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h3 className="text-white font-semibold mb-4">Hasil Gambar</h3>
          
          <div className="relative">
            {isGenerating ? (
              <div className="aspect-square bg-purple-600/20 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white/70">Sedang membuat gambar...</p>
                  <p className="text-white/50 text-sm mt-2">Proses ini membutuhkan beberapa detik</p>
                </div>
              </div>
            ) : generatedImage ? (
              <div className="relative">
                <img 
                  src={generatedImage} 
                  alt="Generated by SuperNova AI" 
                  className="w-full aspect-square object-cover rounded-xl"
                />
                <button
                  onClick={downloadImage}
                  className="absolute top-4 right-4 w-12 h-12 bg-purple-600/80 hover:bg-purple-600 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm"
                >
                  <Download size={20} />
                </button>
              </div>
            ) : (
              <div className="aspect-square bg-purple-600/10 rounded-xl flex items-center justify-center border-2 border-dashed border-white/20">
                <div className="text-center">
                  <Image size={48} className="text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">Gambar akan muncul di sini</p>
                  <p className="text-white/40 text-sm mt-2">Masukkan deskripsi dan klik Generate Image</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div 
          className="glass rounded-2xl p-4 mt-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h4 className="text-white font-semibold mb-2">💡 Tips untuk hasil terbaik:</h4>
          <ul className="text-white/70 text-sm space-y-1">
            <li>• Gunakan deskripsi yang detail dan spesifik</li>
            <li>• Tambahkan style seperti "anime", "realistic", "cartoon"</li>
            <li>• Sebutkan warna, pencahayaan, dan mood yang diinginkan</li>
            <li>• Gunakan bahasa Inggris untuk hasil yang lebih akurat</li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
}