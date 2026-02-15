import { Heart, QrCode, Image, Video, Shield, Cloud } from 'lucide-react';

const features = [
  {
    icon: QrCode,
    title: 'QR Code Permanente',
    description: 'Placa de aço inoxidável com QR code gravado a laser, resistente ao tempo'
  },
  {
    icon: Cloud,
    title: 'Armazenamento Ilimitado',
    description: 'Guarde fotos, vídeos e histórias sem limite de espaço'
  },
  {
    icon: Image,
    title: 'Galeria de Fotos',
    description: 'Organize e compartilhe momentos especiais em uma galeria linda'
  },
  {
    icon: Video,
    title: 'Vídeos e Áudios',
    description: 'Preserve vozes e momentos em movimento para sempre'
  },
  {
    icon: Shield,
    title: 'Seguro e Privado',
    description: 'Controle total sobre quem pode visualizar o memorial'
  },
  {
    icon: Heart,
    title: 'Memorial Eterno',
    description: 'Um lugar especial que permanece para sempre acessível'
  }
];

export default function Features() {
  return (
    <section id="recursos" className="relative z-10 py-24 bg-white/40 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Recursos <span className="text-purple-600">Especiais</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tudo que você precisa para criar um memorial digital completo e emocionante
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-100 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all group"
            >
              <div className="bg-purple-100 rounded-xl w-14 h-14 flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                <feature.icon className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
