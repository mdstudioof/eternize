import { Heart, QrCode } from 'lucide-react';
import { useAuth } from '@getmocha/users-service/react';
import { Button } from '@/react-app/components/ui/button';

export default function Hero() {
  const { user, redirectToLogin } = useAuth();

  const handleGetStarted = () => {
    if (!user) {
      redirectToLogin();
    } else {
      window.location.hash = '#criar-memorial';
    }
  };

  return (
    <section className="relative z-10 pt-20 pb-32">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-100/80 backdrop-blur-sm border border-purple-200 mb-8">
            <Heart className="w-4 h-4 text-purple-600" />
            <span className="text-purple-700 font-medium">Preservando Memórias Para Sempre</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Eternize Memórias com{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">
              QR Code Memorial
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Crie um memorial digital eterno para seus entes queridos.
            Compartilhe fotos, vídeos e histórias através de um QR code
            em aço inoxidável.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={handleGetStarted}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Começar Agora Grátis
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.hash = '#explorar'}
              className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-6 text-lg rounded-full"
            >
              Ver Demonstração
            </Button>
          </div>

          {/* Preview Image Placeholder */}
          <div className="mt-16 rounded-3xl bg-white/60 backdrop-blur-sm border border-purple-200/50 shadow-2xl shadow-purple-500/10 p-8 max-w-3xl mx-auto">
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center">
              <QrCode className="w-24 h-24 text-purple-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
