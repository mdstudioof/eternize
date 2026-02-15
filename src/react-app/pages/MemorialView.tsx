import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Loader2, Heart, ImageIcon, Video, Music } from 'lucide-react';

interface Memorial {
  id: number;
  title: string;
  description: string;
  profile_image_url?: string;
  created_at: string;
}

interface MediaFile {
  id: number;
  url: string;
  file_name: string;
  file_type: string;
}

export default function MemorialView() {
  const { qrCodeId } = useParams<{ qrCodeId: string }>();
  const [memorial, setMemorial] = useState<Memorial | null>(null);
  const [images, setImages] = useState<MediaFile[]>([]);
  const [videos, setVideos] = useState<MediaFile[]>([]);
  const [audios, setAudios] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemorial = async () => {
      if (!qrCodeId) return;

      try {
        const response = await fetch(`/api/memorials/view/${qrCodeId}`);
        const data = await response.json();

        if (response.ok) {
          setMemorial(data.memorial);
          setImages(data.images || []);
          setVideos(data.videos || []);
          setAudios(data.audios || []);
        } else {
          setError(data.error || 'Memorial não encontrado');
        }
      } catch (err) {
        setError('Erro ao carregar memorial');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemorial();
  }, [qrCodeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error || !memorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Memorial não encontrado</h1>
          <p className="text-gray-600">{error || 'Este memorial não existe ou não está disponível.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header with profile */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-200/50 p-8 md:p-12 mb-8">
          <div className="flex flex-col items-center text-center">
            {memorial.profile_image_url ? (
              <img
                src={memorial.profile_image_url}
                alt={memorial.title}
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 shadow-lg mb-6"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center border-4 border-purple-200 shadow-lg mb-6">
                <Heart className="w-16 h-16 text-white" />
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {memorial.title}
            </h1>
            
            {memorial.description && (
              <p className="text-lg text-gray-600 max-w-2xl whitespace-pre-wrap">
                {memorial.description}
              </p>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-purple-600" />
              Galeria de Imagens
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg border border-purple-200/50 hover:shadow-xl transition-shadow"
                >
                  <img
                    src={image.url}
                    alt={image.file_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Video className="w-6 h-6 text-purple-600" />
              Vídeos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-purple-200/50"
                >
                  <video
                    controls
                    className="w-full"
                    src={video.url}
                  >
                    Seu navegador não suporta vídeo.
                  </video>
                  <div className="p-4">
                    <p className="text-sm text-gray-600">{video.file_name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audio */}
        {audios.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Music className="w-6 h-6 text-purple-600" />
              Áudios
            </h2>
            <div className="space-y-4">
              {audios.map((audio) => (
                <div
                  key={audio.id}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200/50"
                >
                  <p className="text-sm font-medium text-gray-900 mb-3">{audio.file_name}</p>
                  <audio
                    controls
                    className="w-full"
                    src={audio.url}
                  >
                    Seu navegador não suporta áudio.
                  </audio>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
            <Heart className="w-4 h-4 text-purple-600" />
            <span>Criado com EternoQR</span>
          </div>
        </div>
      </div>
    </div>
  );
}
