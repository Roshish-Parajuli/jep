import { Heart, Lock, Unlock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SecretMessageSectionProps {
  message: string;
  secretCode: string | null;
}

export function SecretMessageSection({ message, secretCode }: SecretMessageSectionProps) {
  const [revealed, setRevealed] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [displayedText, setDisplayedText] = useState('');

  const handleReveal = () => {
    if (secretCode && code !== secretCode) {
      setError('Incorrect code. Try again!');
      return;
    }

    setRevealed(true);
    setError('');
  };

  useEffect(() => {
    if (!revealed || !message) return;

    let currentIndex = 0;
    setDisplayedText('');

    const intervalId = setInterval(() => {
      if (currentIndex < message.length) {
        currentIndex++;
        setDisplayedText(message.slice(0, currentIndex));
      } else {
        clearInterval(intervalId);
      }
    }, 40);

    return () => clearInterval(intervalId);
  }, [revealed, message]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-100 py-20 px-6 flex items-center justify-center">
      <div className="max-w-3xl mx-auto text-center">
        {!revealed ? (
          <div className="animate-fade-in">
            <Lock className="w-16 h-16 text-rose-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold text-rose-600 mb-4">
              A Secret Message
            </h2>
            <p className="text-lg text-rose-400 mb-8">
              {secretCode
                ? 'Enter the special code to unlock my heart'
                : 'Click the heart to reveal what I want to tell you'}
            </p>

            {secretCode ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter the code..."
                  className="px-6 py-3 text-lg rounded-full border-2 border-rose-300 focus:border-rose-500 focus:outline-none text-center w-64 mx-auto block"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  onClick={handleReveal}
                  className="px-10 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Unlock Message
                </button>
              </div>
            ) : (
              <button
                onClick={handleReveal}
                className="group relative"
              >
                <Heart
                  className="w-24 h-24 text-rose-500 mx-auto hover:scale-110 transition-transform duration-300 cursor-pointer"
                  fill="currentColor"
                />
              </button>
            )}
          </div>
        ) : (
          <div className="animate-fade-in">
            <Unlock className="w-16 h-16 text-rose-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-rose-600 mb-8">
              My Heart Speaks
            </h2>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl">
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light whitespace-pre-line">
                {displayedText}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
