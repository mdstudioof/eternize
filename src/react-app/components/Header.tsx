import { QrCode, LogOut, User } from 'lucide-react';
import { useAuth } from '@getmocha/users-service/react';
import { Button } from '@/react-app/components/ui/button';

export default function Header() {
  const { user, redirectToLogin, logout } = useAuth();

  const handleCreateMemorial = () => {
    if (!user) {
      redirectToLogin();
    } else {
      // Navigate to create memorial page (will be implemented)
      window.location.hash = '#criar-memorial';
    }
  };

  return (
    <header className="relative z-10 border-b border-purple-200/20 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.hash = ''}>
            <div className="bg-purple-600 rounded-xl p-2">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">EternoQR</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#recursos" className="text-gray-700 hover:text-purple-600 transition-colors">
              Recursos
            </a>
            <a href="#como-funciona" className="text-gray-700 hover:text-purple-600 transition-colors">
              Como Funciona
            </a>
            <a href="#explorar" className="text-gray-700 hover:text-purple-600 transition-colors">
              Explorar
            </a>
            <a href="#loja" className="text-gray-700 hover:text-purple-600 transition-colors">
              Loja
            </a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full">
                  {user.google_user_data.picture && (
                    <img 
                      src={user.google_user_data.picture} 
                      alt={user.google_user_data.name || 'User'} 
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user.google_user_data.name || user.email}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={logout}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button 
                variant="outline"
                onClick={redirectToLogin}
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <User className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            )}
            <Button 
              onClick={handleCreateMemorial}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full"
            >
              Criar Memorial
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
