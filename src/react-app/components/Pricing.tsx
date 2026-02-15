import { Check } from 'lucide-react';
import { useAuth } from '@getmocha/users-service/react';
import { Button } from '@/react-app/components/ui/button';

export default function Pricing() {
  const { user, redirectToLogin } = useAuth();

  const handleSubscribe = () => {
    if (!user) {
      redirectToLogin();
    } else {
      window.location.hash = '#checkout';
    }
  };
  return (
    <section id="loja" className="relative z-10 py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nosso <span className="text-purple-600">Plano</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tudo que você precisa para eternizar suas memórias
          </p>
        </div>

        <div className="flex justify-center">
          {/* Plano Premium - Destacado */}
          <div className="bg-gradient-to-br from-purple-600 to-violet-600 rounded-3xl p-12 shadow-2xl shadow-purple-500/30 relative max-w-2xl w-full">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full text-base font-bold text-purple-600 shadow-lg">
              Mais Popular
            </div>
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-3 text-white">Premium</h3>
              <div className="mb-2">
                <span className="text-6xl font-bold text-white">R$ 29,90</span>
                <span className="text-xl text-purple-200">/mês</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-white mt-0.5 flex-shrink-0" />
                <span className="text-lg text-purple-100">Memoriais ilimitados</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-white mt-0.5 flex-shrink-0" />
                <span className="text-lg text-purple-100">Fotos ilimitadas</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-white mt-0.5 flex-shrink-0" />
                <span className="text-lg text-purple-100">Vídeos ilimitados</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-white mt-0.5 flex-shrink-0" />
                <span className="text-lg text-purple-100">Placa QR personalizada</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-white mt-0.5 flex-shrink-0" />
                <span className="text-lg text-purple-100">Suporte prioritário</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-white mt-0.5 flex-shrink-0" />
                <span className="text-lg text-purple-100">Acesso para sempre</span>
              </li>
            </ul>
            <Button 
              onClick={handleSubscribe}
              className="w-full bg-white text-purple-700 hover:bg-purple-50 text-lg py-6 rounded-full shadow-lg"
            >
              Assinar Agora
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
