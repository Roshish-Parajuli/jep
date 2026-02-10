import { CheckCircle2 } from 'lucide-react';

interface PromiseSectionProps {
  promises: string[];
}

export function PromiseSection({ promises }: PromiseSectionProps) {
  if (promises.length === 0) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-100 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-rose-600 text-center mb-4">
          My Promises to You
        </h2>
        <p className="text-lg text-rose-400 text-center mb-16">
          These are my vows, my commitment, my forever
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promises.map((promise, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle2
                    className="w-8 h-8 text-rose-500 group-hover:scale-110 transition-transform duration-300"
                    fill="currentColor"
                  />
                </div>
                <p className="text-gray-700 text-lg leading-relaxed flex-1">{promise}</p>
              </div>

              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-rose-300/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
