import { QrCode, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-purple-600 rounded-xl p-2">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">EternoQR</span>
            </div>
            <p className="text-gray-400">
              Preservando memórias para sempre através da tecnologia
            </p>
          </div>

          {/* Produto */}
          <div>
            <h4 className="font-bold mb-4">Produto</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#recursos" className="hover:text-purple-400 transition-colors">Recursos</a></li>
              <li><a href="#como-funciona" className="hover:text-purple-400 transition-colors">Como Funciona</a></li>
              <li><a href="#loja" className="hover:text-purple-400 transition-colors">Preços</a></li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-bold mb-4">Empresa</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#sobre" className="hover:text-purple-400 transition-colors">Sobre Nós</a></li>
              <li><a href="#contato" className="hover:text-purple-400 transition-colors">Contato</a></li>
              <li><a href="#blog" className="hover:text-purple-400 transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#privacidade" className="hover:text-purple-400 transition-colors">Privacidade</a></li>
              <li><a href="#termos" className="hover:text-purple-400 transition-colors">Termos de Uso</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p className="flex items-center justify-center gap-2">
            Feito com <Heart className="w-4 h-4 text-purple-500" /> para eternizar memórias
          </p>
          <p className="mt-2">© 2024 EternoQR. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
