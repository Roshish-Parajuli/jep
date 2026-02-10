import { Mail } from 'lucide-react';

interface LoveLetterSectionProps {
  letter: string;
}

export function LoveLetterSection({ letter }: LoveLetterSectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50 py-20 px-6 flex items-center justify-center">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Mail className="w-16 h-16 text-rose-400 mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-bold text-rose-600 mb-2">
            A Love Letter
          </h2>
          <p className="text-lg text-rose-400">Written from my heart to yours</p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-yellow-50 rounded-3xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-3xl transform -rotate-1"></div>

          <div className="relative bg-gradient-to-br from-amber-50/90 to-yellow-50/90 backdrop-blur-sm rounded-3xl p-8 md:p-16 shadow-2xl border-t border-l border-amber-200">
            <div
              className="space-y-6 text-gray-800 leading-relaxed text-lg md:text-xl"
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
              }}
            >
              {letter.split('\n').map((paragraph, index) => (
                <p key={index} className="indent-8">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 text-right">
              <p
                className="text-2xl md:text-3xl text-rose-600 italic"
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                }}
              >
                Forever yours
              </p>
            </div>
          </div>

          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-rose-300/20 rounded-full blur-xl"></div>
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-amber-300/20 rounded-full blur-xl"></div>
        </div>
      </div>
    </div>
  );
}
