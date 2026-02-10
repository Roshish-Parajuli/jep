import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeroSectionProps {
  recipientName: string;
  headline: string;
  subtext: string;
  onStart: () => void;
}

export function HeroSection({ recipientName, headline, subtext, onStart }: HeroSectionProps) {
  const [hearts, setHearts] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-red-100 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute animate-float-up"
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.delay}s`,
            }}
          >
            <Heart className="text-rose-300/30" size={20 + Math.random() * 20} fill="currentColor" />
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <Heart className="w-20 h-20 text-rose-500 mx-auto mb-6 animate-pulse" fill="currentColor" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-rose-600 mb-6 animate-fade-in-up">
          {headline}
        </h1>

        <p className="text-2xl md:text-4xl text-rose-500 mb-4 font-light animate-fade-in-up animation-delay-200">
          {recipientName}
        </p>

        {subtext && (
          <p className="text-lg md:text-xl text-rose-400 mb-12 animate-fade-in-up animation-delay-400">
            {subtext}
          </p>
        )}

        <button
          onClick={onStart}
          className="group relative px-10 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-600"
        >
          <span className="relative z-10">Explore</span>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float-up {
          animation: float-up 15s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
