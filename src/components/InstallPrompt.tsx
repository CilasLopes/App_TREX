import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone (installed) mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsAppInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // Prevent standard browser prompt
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Se o app já estiver instalado OU se não existir um prompt adiado (alguns navegadores iOS não suportam o beforeinstallprompt nativo) 
  // nós apenas ocultamos esse block temporariamente para não travar totalmente o iOS, mas a indicação visual será forte.
  if (isAppInstalled || !deferredPrompt) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-primary/20 rounded-3xl flex items-center justify-center mb-8 border border-primary/50 shadow-[0_0_50px_rgba(240,102,0,0.4)] animate-pulse">
        <Download className="w-12 h-12 text-primary" />
      </div>
      
      <h1 className="font-headings font-black text-4xl uppercase tracking-tighter text-white mb-2 italic">
        Acesso <span className="text-primary">Restrito</span>
      </h1>
      
      <p className="text-gray-400 font-bold text-sm tracking-widest uppercase mb-12 max-w-xs leading-relaxed">
        O sistema oficial do Futsal PWA exige instalação no dispositivo para funcionar corretamente.
      </p>

      <button
        onClick={handleInstallClick}
        className="bg-primary hover:bg-[#d95a00] text-[#341100] w-full max-w-sm py-5 rounded-2xl font-headings font-black text-xl uppercase tracking-widest shadow-[0_10px_30px_-10px_rgba(240,102,0,0.6)] transition-all active:scale-95 flex items-center justify-center gap-3"
      >
        <Download className="w-6 h-6" />
        Instalar Aplicativo
      </button>

      <p className="fixed bottom-8 text-[9px] text-gray-600 font-bold uppercase tracking-widest">
        Obrigatório para offline e notificações
      </p>
    </div>
  );
}
