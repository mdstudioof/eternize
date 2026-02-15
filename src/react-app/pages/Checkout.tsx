import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { Button } from '@/react-app/components/ui/button';
import { CreditCard, Loader2, ArrowLeft } from 'lucide-react';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isPending } = useAuth();
  const [loading, setLoading] = useState(false);
  const memorialId = searchParams.get('memorial_id');

  useEffect(() => {
    if (!isPending && !user) {
      navigate('/');
    }
  }, [user, isPending, navigate]);

  const handleCheckout = async () => {
    if (!memorialId) {
      alert('Memorial ID não encontrado');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memorialId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erro ao criar sessão de checkout');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Erro ao processar pagamento');
      setLoading(false);
    }
  };

  if (isPending || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50">
      <div className="container mx-auto px-6 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-200/50 p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                <CreditCard className="w-8 h-8 text-purple-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Finalizar Pagamento
              </h1>
              <p className="text-gray-600 text-lg">
                Complete seu memorial com o Plano Premium
              </p>
            </div>

            {/* Plan Details */}
            <div className="bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl p-8 text-white mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Plano Premium</h2>
                  <p className="text-purple-100">Memorial digital completo</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">R$ 29,90</div>
                  <div className="text-purple-100 text-sm">pagamento único</div>
                </div>
              </div>

              <div className="space-y-3 border-t border-purple-400/30 pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span>Upload ilimitado de fotos, vídeos e áudios</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span>QR Code exclusivo em aço inoxidável</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span>Memorial online eterno</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span>Compartilhamento ilimitado</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg rounded-full shadow-lg shadow-purple-500/30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Prosseguir para Pagamento
                </>
              )}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-6">
              Pagamento seguro processado via Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
