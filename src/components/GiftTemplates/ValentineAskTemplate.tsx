import React, { useState, useRef } from 'react';
import { Heart, Stars, Calendar as CalendarIcon, Send, Loader2 } from 'lucide-react';
import { GiftSiteContent } from '../../types/gift';
import { supabase } from '../../lib/supabase';

interface ValentineAskTemplateProps {
    content: GiftSiteContent;
    giftSiteId?: string;
}

export const ValentineAskTemplate: React.FC<ValentineAskTemplateProps> = ({ content, giftSiteId }) => {
    const [selectedResponse, setSelectedResponse] = useState<'yes' | 'no' | 'maybe' | null>(null);
    const [showInputs, setShowInputs] = useState(false);
    const [message, setMessage] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
    const [noClickCount, setNoClickCount] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleNoHover = (e: React.MouseEvent | React.TouchEvent) => {
        if (!containerRef.current) return;
        const container = containerRef.current.getBoundingClientRect();

        // Get mouse/touch position
        let mouseX = 0;
        let mouseY = 0;
        if ('touches' in e) {
            mouseX = e.touches[0].clientX - container.left;
            mouseY = e.touches[0].clientY - container.top;
        } else {
            mouseX = e.clientX - container.left;
            mouseY = e.clientY - container.top;
        }

        // Button dimensions
        const buttonWidth = 140;
        const buttonHeight = 56;
        const safeDistance = 200; // Minimum distance from cursor

        // Calculate new position that's far from the mouse but within bounds
        let attempts = 0;
        let newX, newY;

        do {
            newX = Math.random() * (container.width - buttonWidth);
            newY = Math.random() * (container.height - buttonHeight);

            // Calculate distance from mouse
            const distance = Math.sqrt(
                Math.pow(newX + buttonWidth / 2 - mouseX, 2) +
                Math.pow(newY + buttonHeight / 2 - mouseY, 2)
            );

            // If far enough, use this position
            if (distance > safeDistance) {
                break;
            }

            attempts++;
        } while (attempts < 20);

        // Ensure position is within bounds
        newX = Math.max(0, Math.min(newX, container.width - buttonWidth));
        newY = Math.max(0, Math.min(newY, container.height - buttonHeight));

        setNoPosition({ x: newX, y: newY });
        setNoClickCount(prev => prev + 1);
    };

    const handleResponseClick = (response: 'yes' | 'no' | 'maybe') => {
        setSelectedResponse(response);
        if (response === 'yes' || response === 'maybe') {
            setShowInputs(true);
        } else {
            // For "no", just save immediately
            saveResponse(response);
        }
    };

    const saveResponse = async (responseType: 'yes' | 'no' | 'maybe', customMessage?: string, customDate?: string) => {
        if (!giftSiteId) {
            console.error('No gift site ID available');
            return;
        }

        setSubmitting(true);

        try {
            const { error } = await supabase
                .from('gift_site_responses')
                .insert({
                    gift_site_id: giftSiteId,
                    response_type: responseType,
                    message: customMessage || null,
                    selected_date: customDate || null
                });

            if (error) throw error;

            setSubmitted(true);
        } catch (err) {
            console.error('Error saving response:', err);
            alert('Failed to save response. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = () => {
        if (selectedResponse && (selectedResponse === 'yes' || selectedResponse === 'maybe')) {
            saveResponse(selectedResponse, message, selectedDate);
        }
    };

    // Success screen after submission
    if (submitted && selectedResponse === 'yes') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-red-100 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                <Heart className="w-24 h-24 text-rose-500 animate-bounce mb-6" fill="currentColor" />
                <h1 className="text-4xl md:text-6xl font-bold text-rose-600 mb-4">
                    {content.yes_response || "YAY! I knew you'd say Yes! ❤️"}
                </h1>
                <p className="text-xl text-rose-400 mb-4">Best decision ever!</p>
                {message && (
                    <div className="mt-6 max-w-md bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                        <p className="text-gray-700 italic">"{message}"</p>
                    </div>
                )}

                {/* Confetti effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                        <div key={i} className="absolute animate-float" style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            fontSize: `${Math.random() * 2 + 1}rem`
                        }}>❤️</div>
                    ))}
                </div>
            </div>
        );
    }

    if (submitted && selectedResponse === 'maybe') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                <Stars className="w-24 h-24 text-purple-500 animate-pulse mb-6" />
                <h1 className="text-4xl md:text-6xl font-bold text-purple-600 mb-4">
                    Maybe means there's hope! 💜
                </h1>
                <p className="text-xl text-purple-400">I'll take that as progress!</p>
                {message && (
                    <div className="mt-6 max-w-md bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                        <p className="text-gray-700 italic">"{message}"</p>
                    </div>
                )}
            </div>
        );
    }

    if (submitted && selectedResponse === 'no') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-50 to-gray-200 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                <div className="text-6xl mb-6">💔</div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-600 mb-4">
                    Okay... I understand 😢
                </h1>
                <p className="text-xl text-gray-400">But you're still amazing!</p>
            </div>
        );
    }

    // Show input form after selecting Yes or Maybe
    if (showInputs && (selectedResponse === 'yes' || selectedResponse === 'maybe')) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 flex flex-col items-center justify-center p-4">
                <div className="max-w-lg w-full bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-rose-100">
                    <div className="text-center mb-8">
                        <Heart className="w-16 h-16 text-rose-500 mx-auto mb-4" fill="currentColor" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {selectedResponse === 'yes' ? '🎉 Awesome!' : '🤔 Tell me more...'}
                        </h2>
                        <p className="text-gray-600">
                            {selectedResponse === 'yes'
                                ? "Want to add a message or pick a date?"
                                : "What would help you say yes?"}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Message Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Message (Optional)
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write something sweet..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all resize-none"
                                rows={4}
                            />
                        </div>

                        {/* Date Picker */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CalendarIcon className="inline-block w-4 h-4 mr-1" />
                                Pick a Date (Optional)
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => {
                                    setShowInputs(false);
                                    setSelectedResponse(null);
                                    setMessage('');
                                    setSelectedDate('');
                                }}
                                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Submit
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main question screen
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 flex flex-col items-center justify-center p-4 relative overflow-hidden" ref={containerRef}>

            {/* Decorative Background */}
            <div className="absolute top-10 left-10 text-rose-200 animate-pulse">
                <Heart size={48} />
            </div>
            <div className="absolute bottom-10 right-10 text-rose-200 animate-pulse delay-1000">
                <Heart size={64} />
            </div>
            <div className="absolute top-1/3 right-20 text-pink-200 animate-pulse delay-2000">
                <Heart size={32} />
            </div>

            <div className="z-10 text-center max-w-2xl bg-white/90 backdrop-blur-md p-12 rounded-3xl shadow-2xl border-2 border-rose-100">
                <div className="mb-8 flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center shadow-lg">
                        <Stars className="text-rose-500 w-10 h-10" />
                    </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    {content.hero_headline || "I have a question..."}
                </h1>
                <p className="text-2xl text-gray-700 mb-12 font-medium">
                    {content.ask_question || "Will you be my Valentine? 💕"}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 min-h-[120px] relative">
                    {/* Yes Button */}
                    <button
                        onClick={() => handleResponseClick('yes')}
                        className="px-12 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xl font-bold rounded-full hover:from-rose-600 hover:to-pink-600 hover:scale-110 transition-all shadow-xl transform hover:shadow-2xl"
                    >
                        YES! 💖
                    </button>

                    {/* Maybe Button */}
                    <button
                        onClick={() => handleResponseClick('maybe')}
                        className="px-12 py-4 bg-gradient-to-r from-purple-400 to-indigo-400 text-white text-xl font-bold rounded-full hover:from-purple-500 hover:to-indigo-500 hover:scale-105 transition-all shadow-lg transform"
                    >
                        Maybe? 🤔
                    </button>

                    {/* No Button (Runaway) */}
                    <button
                        onMouseEnter={handleNoHover}
                        onTouchStart={handleNoHover}
                        style={{
                            position: noPosition.x || noPosition.y ? 'absolute' : 'static',
                            left: noPosition.x,
                            top: noPosition.y,
                            transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
                            transform: noClickCount > 0 ? `scale(${Math.max(0.7, 1 - noClickCount * 0.05)}) rotate(${noClickCount * 10}deg)` : 'scale(1)',
                            zIndex: 10
                        }}
                        className="px-12 py-4 bg-gray-300 text-gray-600 text-xl font-bold rounded-full hover:bg-gray-400 transition-colors shadow-md"
                    >
                        {content.no_response || "No"} 😢
                    </button>
                </div>

                {noClickCount > 3 && (
                    <p className="mt-8 text-sm text-gray-500 italic animate-fade-in">
                        Come on, give it a chance! 🥺
                    </p>
                )}
            </div>
        </div>
    );
};
