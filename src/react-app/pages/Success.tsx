import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { Button } from '@/react-app/components/ui/button';
import { CheckCircle, Download, Loader2, QrCode as QrCodeIcon } from 'lucide-react';

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isPending } = useAuth();
  const [qrCode, setQrCode] = useState<{ qrCodeDataUrl: string; memorialUrl: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const memorialId = searchParams.get('memorial_id');

  useEffect(() => {
    if (!isPending && !user) {
      navigate('/');
    }
  }, [user, isPending, navigate]);

  useEffect(() => {
    const fetchQRCode = async () => {
      if (!memorialId) return;

      try {
        const response = await fetch(`/api/memorials/${memorialId}/qr-code`);
        const data = await response.json();

        if (response.ok) {
          setQrCode(data);
        }
      } catch (error) {
        console.error('Error fetching QR code:', error);
      } finally {
        setLoading(false);
      }
    };

    if (memorialId) {
      // Wait a bit for webhook to process
      setTimeout(fetchQRCode, 2000);
    }
  }, [memorialId]);

  const downloadQRCode = () => {
    if (!qrCode) return;

    const link = document.createElement('a');
    link.download = 'eternoqr-memorial-qrcode.png';
    link.href = qrCode.qrCodeDataUrl;
    link.click();
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
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-200/50 p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Pagamento Confirmado!
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Seu memorial premium foi ativado com sucesso
            </p>

            {loading ? (
              <div className="py-12">
                <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
                <p className="text-gray-600">Gerando seu QR Code único...</p>
              </div>
            ) : qrCode ? (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-200/50">
                  <img
                    src={qrCode.qrCodeDataUrl}
                    alt="QR Code do Memorial"
                    className="w-64 h-64 mx-auto"
                  />
                </div>

                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <p className="text-sm text-gray-600 mb-2">Link do Memorial:</p>
                  <p className="text-purple-700 font-mono text-sm break-all">
                    {qrCode.memorialUrl}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={downloadQRCode}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg rounded-full"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Baixar QR Code
                  </Button>
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="flex-1 border-2 border-purple-300 text-purple-700 hover:bg-purple-50 py-6 text-lg rounded-full"
                  >
                    Voltar ao Início
                  </Button>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 text-left">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <QrCodeIcon className="w-5 h-5" />
                    Próximos Passos
                  </h3>
                  <ol className="text-sm text-blue-800 space-y-2 ml-7 list-decimal">
                    <li>Baixe o QR Code gerado</li>
                    <li>O QR Code físico em aço inoxidável será enviado para você</li>
                    <li>Você pode editar seu memorial a qualquer momento</li>
                    <li>Compartilhe o link com familiares e amigos</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="py-8">
                <p className="text-gray-600 mb-6">
                  Não foi possível carregar o QR Code neste momento.
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-purple-300 text-purple-700"
                >
                  Tentar Novamente
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
