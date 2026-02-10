import { Heart, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FinalSurpriseSectionProps {
  message: string;
}

interface Confetti {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
}

export function FinalSurpriseSection({ message }: FinalSurpriseSectionProps) {
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const colors = ['#f43f5e', '#ec4899', '#f472b6', '#fb7185', '#fda4af'];
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setConfetti(newConfetti);

    setTimeout(() => setShowMessage(true), 500);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-600 via-pink-500 to-red-500 overflow-hidden flex items-center justify-center py-20 px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((item) => (
          <div
            key={item.id}
            className="absolute animate-confetti"
            style={{
              left: `${item.left}%`,
              animationDelay: `${item.delay}s`,
              animationDuration: `${item.duration}s`,
            }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
          </div>
        ))}
      </div>

      {showMessage && (
        <div className="relative z-10 text-center max-w-4xl animate-fade-in-scale">
          <div className="mb-8 flex justify-center space-x-4">
            <Heart className="w-16 h-16 text-white animate-pulse" fill="currentColor" />
            <Sparkles className="w-16 h-16 text-white animate-pulse animation-delay-200" fill="currentColor" />
            <Heart className="w-16 h-16 text-white animate-pulse animation-delay-400" fill="currentColor" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 drop-shadow-lg">
            I Love You
          </h1>

          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/30">
            <p className="text-xl md:text-2xl text-white leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </div>

          <div className="mt-12 flex justify-center space-x-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Heart
                key={i}
                className="w-10 h-10 text-white animate-pulse"
                fill="currentColor"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-confetti {
          animation: confetti linear infinite;
        }

        .animate-fade-in-scale {
          animation: fade-in-scale 1s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}
