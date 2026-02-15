import { UserPlus, Upload, QrCode, Share2 } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Crie sua Conta',
    description: 'Cadastre-se gratuitamente em poucos segundos'
  },
  {
    icon: Upload,
    title: 'Adicione Memórias',
    description: 'Faça upload de fotos, vídeos e histórias especiais'
  },
  {
    icon: QrCode,
    title: 'Receba o QR Code',
    description: 'Placa personalizada de aço inoxidável entregue em casa'
  },
  {
    icon: Share2,
    title: 'Compartilhe',
    description: 'Qualquer pessoa pode acessar escaneando o QR code'
  }
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="relative z-10 py-24 bg-white/40 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Como <span className="text-purple-600">Funciona</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Em 4 passos simples você cria um memorial eterno
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-100 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all text-center">
                <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
