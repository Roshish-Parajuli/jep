import { Heart } from 'lucide-react';
import { TimelineEvent } from '../../types/valentine';

interface TimelineSectionProps {
  timeline: TimelineEvent[];
}

export function TimelineSection({ timeline }: TimelineSectionProps) {
  if (timeline.length === 0) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-rose-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-rose-600 text-center mb-4">
          Our Journey
        </h2>
        <p className="text-lg text-rose-400 text-center mb-16">
          Every step with you has been magical
        </p>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-rose-300 to-pink-400"></div>

          {timeline.map((event, index) => (
            <div
              key={index}
              className={`relative mb-16 ${
                index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:text-left'
              }`}
            >
              <div className={`flex items-center ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'} justify-center mb-4`}>
                <div className="relative z-10 bg-white rounded-full p-4 shadow-lg">
                  <Heart className="w-8 h-8 text-rose-500" fill="currentColor" />
                </div>
              </div>

              <div
                className={`bg-white rounded-2xl p-6 md:p-8 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                }`}
              >
                <p className="text-rose-500 font-semibold text-lg mb-2">{event.date}</p>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  {event.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
