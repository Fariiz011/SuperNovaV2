import { motion, AnimatePresence } from "framer-motion";
import { X, Settings, Shield, Users, FileText, HelpCircle, Info, Mail, LogOut } from "lucide-react";
import { useState } from "react";

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
  onLogout?: () => void;
}

interface SettingsItem {
  icon: any;
  label: string;
  description: string;
  action: () => void;
}

export default function SettingsSidebar({ isOpen, onClose, user, onLogout }: SettingsSidebarProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const settingsItems: SettingsItem[] = [
    {
      icon: Shield,
      label: "Privasi & Keamanan",
      description: "Kelola pengaturan privasi dan keamanan akun Anda",
      action: () => setSelectedSection("privacy")
    },
    {
      icon: Users,
      label: "Tentang Kami",
      description: "Informasi tentang SuperNova dan tim pengembang",
      action: () => setSelectedSection("about")
    },
    {
      icon: FileText,
      label: "Kebijakan Privasi",
      description: "Baca kebijakan privasi dan syarat penggunaan",
      action: () => setSelectedSection("policy")
    },
    {
      icon: HelpCircle,
      label: "Bantuan & FAQ",
      description: "Pertanyaan yang sering diajukan dan panduan",
      action: () => setSelectedSection("help")
    },
    {
      icon: Info,
      label: "Informasi Aplikasi",
      description: "Versi aplikasi dan informasi sistem",
      action: () => setSelectedSection("info")
    },
    {
      icon: Mail,
      label: "Hubungi Kami",
      description: "Kirim feedback atau laporkan masalah",
      action: () => setSelectedSection("contact")
    }
  ];

  const renderContent = () => {
    switch (selectedSection) {
      case "privacy":
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Privasi & Keamanan</h3>
            <div className="space-y-4">
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Data Pribadi</h4>
                <p className="text-white/70 text-sm">SuperNova hanya menyimpan data yang diperlukan untuk memberikan layanan terbaik.</p>
              </div>
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Keamanan Chat</h4>
                <p className="text-white/70 text-sm">Semua percakapan dienkripsi dan tidak dibagikan kepada pihak ketiga.</p>
              </div>
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Voice Recognition</h4>
                <p className="text-white/70 text-sm">Data suara diproses secara lokal dan tidak disimpan di server.</p>
              </div>
            </div>
          </motion.div>
        );
      
      case "about":
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Tentang SuperNova</h3>
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full glass flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h4 className="text-white font-bold text-lg">SuperNova AI</h4>
                <p className="text-white/70">Asisten AI Terdepan Indonesia</p>
              </div>
              
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Misi Kami</h4>
                <p className="text-white/70 text-sm">Memberikan teknologi AI terbaik untuk membantu kehidupan sehari-hari masyarakat Indonesia.</p>
              </div>
              
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Tim Pengembang</h4>
                <p className="text-white/70 text-sm">Lifevander Indonesian - Tim ahli teknologi AI dan machine learning.</p>
              </div>
              
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Fitur Unggulan</h4>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Chat AI dengan bahasa Indonesia & Inggris</li>
                  <li>• Voice recognition & text-to-speech</li>
                  <li>• Interface modern dan user-friendly</li>
                  <li>• Respons cepat dan akurat</li>
                </ul>
              </div>
            </div>
          </motion.div>
        );
      
      case "policy":
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Kebijakan Privasi</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">1. Pengumpulan Data</h4>
                <p className="text-white/70 text-sm">Kami mengumpulkan informasi yang Anda berikan secara langsung, seperti email dan nama untuk registrasi akun.</p>
              </div>
              
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">2. Penggunaan Data</h4>
                <p className="text-white/70 text-sm">Data digunakan untuk memberikan layanan AI, meningkatkan pengalaman pengguna, dan komunikasi terkait layanan.</p>
              </div>
              
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">3. Keamanan Data</h4>
                <p className="text-white/70 text-sm">Kami menerapkan langkah-langkah keamanan teknis dan organisasi untuk melindungi data Anda.</p>
              </div>
              
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">4. Hak Pengguna</h4>
                <p className="text-white/70 text-sm">Anda memiliki hak untuk mengakses, mengubah, atau menghapus data pribadi Anda.</p>
              </div>
              
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">5. Perubahan Kebijakan</h4>
                <p className="text-white/70 text-sm">Kebijakan ini dapat berubah sewaktu-waktu. Perubahan akan diberitahukan melalui aplikasi.</p>
              </div>
            </div>
          </motion.div>
        );
      
      case "help":
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Bantuan & FAQ</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Q: Bagaimana cara menggunakan fitur voice?</h4>
                <p className="text-white/70 text-sm">A: Klik "Talk with Nova" di dashboard, lalu tap tombol mikrofon untuk mulai berbicara.</p>
              </div>
              
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Q: Apakah SuperNova bisa bahasa Indonesia?</h4>
                <p className="text-white/70 text-sm">A: Ya! SuperNova dapat berkomunikasi dengan lancar dalam bahasa Indonesia dan Inggris.</p>
              </div>
              
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Q: Kenapa voice tidak berfungsi?</h4>
                <p className="text-white/70 text-sm">A: Pastikan browser mendukung Web Speech API dan izinkan akses mikrofon saat diminta.</p>
              </div>
              
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Q: Apakah data chat tersimpan?</h4>
                <p className="text-white/70 text-sm">A: Chat disimpan sementara untuk pengalaman yang lebih baik, namun tidak dibagikan kepada pihak lain.</p>
              </div>
              
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Q: Bagaimana cara reset password?</h4>
                <p className="text-white/70 text-sm">A: Hubungi support melalui menu "Hubungi Kami" untuk bantuan reset password.</p>
              </div>
            </div>
          </motion.div>
        );
      
      case "info":
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Informasi Aplikasi</h3>
            <div className="space-y-4">
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Versi Aplikasi</h4>
                <p className="text-white/70 text-sm">SuperNova v1.0.0 (2025)</p>
              </div>
              
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Teknologi</h4>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• React + TypeScript</li>
                  <li>• Cohere AI API</li>
                  <li>• Web Speech API</li>
                  <li>• Framer Motion</li>
                </ul>
              </div>
              
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Kompatibilitas</h4>
                <p className="text-white/70 text-sm">Chrome, Firefox, Safari, Edge (versi terbaru)</p>
              </div>
              
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Lisensi</h4>
                <p className="text-white/70 text-sm">© 2025 Lifevander Indonesian. All rights reserved.</p>
              </div>
            </div>
          </motion.div>
        );
      
      case "contact":
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Hubungi Kami</h3>
            <div className="space-y-4">
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Email Support</h4>
                <p className="text-white/70 text-sm">support@supernova.ai</p>
              </div>
              
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Media Sosial</h4>
                <div className="space-y-1 text-white/70 text-sm">
                  <p>Instagram: @supernova_ai</p>
                  <p>Twitter: @SuperNovaAI</p>
                  <p>LinkedIn: SuperNova Indonesia</p>
                </div>
              </div>
              
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">Kirim Feedback</h4>
                <textarea 
                  className="w-full glass rounded-lg p-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
                  rows={4}
                  placeholder="Tulis feedback atau pertanyaan Anda..."
                />
                <button className="w-full mt-3 bg-purple-600 hover:bg-purple-700 rounded-lg py-2 text-white font-semibold transition-all">
                  Kirim Feedback
                </button>
              </div>
            </div>
          </motion.div>
        );
      
      default:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6">Pengaturan</h3>
            <div className="space-y-3">
              {settingsItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={index}
                    onClick={item.action}
                    className="w-full glass rounded-lg p-4 text-left hover:bg-white/10 transition-all group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/30 flex items-center justify-center mr-3">
                        <Icon size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{item.label}</h4>
                        <p className="text-white/60 text-sm">{item.description}</p>
                      </div>
                      <svg className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            
            {user && onLogout && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <button
                  onClick={onLogout}
                  className="w-full glass rounded-lg p-4 text-left hover:bg-red-500/20 transition-all group flex items-center"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-500/30 flex items-center justify-center mr-3">
                    <LogOut size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Keluar</h4>
                    <p className="text-white/60 text-sm">Logout dari akun Anda</p>
                  </div>
                </button>
              </div>
            )}
          </motion.div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          {/* Sidebar */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-purple-600/90 to-purple-800/90 backdrop-blur-lg border-l border-white/20 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              {selectedSection ? (
                <button 
                  onClick={() => setSelectedSection(null)}
                  className="flex items-center text-white hover:text-white/80 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Kembali
                </button>
              ) : (
                <div className="flex items-center">
                  <Settings size={24} className="text-white mr-2" />
                  <h2 className="text-xl font-bold text-white">Settings</h2>
                </div>
              )}
              
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1">
              {renderContent()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}