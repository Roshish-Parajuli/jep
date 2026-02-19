import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { GiftCard } from '../types/gift';
import { Loader2, Sparkles, Image as ImageIcon, Download, Plus } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function GiftCardViewerPage() {
    const { id } = useParams<{ id: string }>();
    const [card, setCard] = useState<GiftCard | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchCard = async () => {
            try {
                const { data, error } = await supabase
                    .from('gift_cards')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setCard(data);
            } catch (err) {
                console.error(err);
                setError('Card not found.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCard();
    }, [id]);

    const handleDownload = async () => {
        if (!cardRef.current) return;

        setDownloading(true);
        try {
            // Hide the CTA temporarily for screenshot
            const ctaElement = cardRef.current.querySelector('.cta-to-hide');
            if (ctaElement) (ctaElement as HTMLElement).style.display = 'none';

            const canvas = await html2canvas(cardRef.current, {
                scale: 2, // Higher quality
                backgroundColor: null,
                logging: false,
                useCORS: true
            });

            // Show CTA again
            if (ctaElement) (ctaElement as HTMLElement).style.display = '';

            // Convert to blob and download
            canvas.toBlob((blob: Blob | null) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = `gift-card-${id}.png`;
                    link.href = url;
                    link.click();
                    URL.revokeObjectURL(url);
                }
            }, 'image/png');
        } catch (err) {
            console.error('Download failed:', err);
            alert('Failed to download. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;
    if (error || !card) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

    const { content, template_id } = card;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col lg:flex-row gap-10 p-4 lg:p-8 lg:items-center lg:justify-center">

            {/* Card Section - Centered on mobile, balanced on desktop */}
            <div className="flex items-center justify-center">
                <div
                    ref={cardRef}
                    className="relative w-full max-w-sm aspect-[9/16] bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up"
                >
                    <div className={`w-full h-full bg-gradient-to-br ${content.theme_color || 'from-pink-500 to-rose-500'} p-8 flex flex-col relative`}>

                        {/* Template: Simple */}
                        {template_id === 'story_simple' && (
                            <div className="h-full flex flex-col justify-center text-center text-white">
                                <div className="mb-8">
                                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-80" />
                                    <h2 className="text-sm uppercase tracking-widest opacity-80 mb-2">To {content.recipient_name}</h2>
                                    <h1 className="text-5xl font-serif font-bold leading-tight mb-8 drop-shadow-sm">{content.message}</h1>
                                </div>
                                <div className="mt-auto pb-12">
                                    <p className="text-sm opacity-70">Sent with love by</p>
                                    <p className="font-bold text-lg">{content.sender_name}</p>
                                </div>
                            </div>
                        )}

                        {/* Template: Animated */}
                        {template_id === 'story_animated' && (
                            <div className="h-full flex flex-col items-center justify-center text-center text-white relative">
                                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                    <div className="w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
                                </div>
                                <h1 className="text-6xl font-bold mb-6 animate-bounce">{content.message}</h1>
                                <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/30 transform -rotate-3">
                                    <p className="text-xl">For: {content.recipient_name}</p>
                                </div>
                                <div className="absolute bottom-12 text-center w-full">
                                    <p className="text-sm font-bold bg-white text-gray-900 px-4 py-1 rounded-full inline-block">From {content.sender_name}</p>
                                </div>
                            </div>
                        )}

                        {/* Template: Photo */}
                        {template_id === 'story_photo' && (
                            <div className="h-full flex flex-col text-white">
                                <div className="relative h-2/3 bg-black/10 rounded-[2rem] mb-8 flex items-center justify-center border-2 border-white/20 overflow-hidden shadow-2xl">
                                    {content.photo_url ? (
                                        <img src={content.photo_url} alt="Gift" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="opacity-70 flex items-center gap-2"><ImageIcon size={18} /> Photo</span>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                                </div>

                                <div className="space-y-4 px-2">
                                    <h1 className="text-4xl font-serif font-bold leading-tight drop-shadow-md">{content.message}</h1>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-px bg-white/50"></div>
                                        <p className="text-lg font-medium opacity-90">For {content.recipient_name}</p>
                                    </div>
                                </div>

                                <div className="mt-auto pb-8 px-2 flex justify-end items-end">
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">With Love,</p>
                                        <p className="text-xl font-bold font-serif">{content.sender_name}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Small watermark (hidden on download) */}
                        <div className="cta-to-hide absolute bottom-4 left-0 right-0 text-center text-[10px] text-white/50">
                            micro-saas.online
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions Section - Bottom on mobile, Right on desktop */}
            <div className="flex flex-col items-center lg:items-start justify-center gap-8 lg:w-80 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

                {/* Download Button */}
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {downloading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Downloading...</span>
                        </>
                    ) : (
                        <>
                            <Download className="w-5 h-5" />
                            <span>Download for Stories</span>
                        </>
                    )}
                </button>

                {/* Info Cards */}
                <div className="w-full space-y-3">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <p className="text-white/70 text-sm">
                            <span className="font-bold text-white">Perfect for:</span> Instagram Stories, WhatsApp, Snapchat
                        </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <p className="text-white/70 text-sm">
                            <span className="font-bold text-white">Download as:</span> High-quality PNG (9:16 ratio)
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>

                {/* CTA Section */}
                <div className="text-center lg:text-left w-full">
                    <p className="text-gray-400 mb-4 text-sm font-medium">💝 Love this card?</p>

                    <Link
                        to="/gifts"
                        className="group w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl font-bold shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/50 transition-all transform hover:scale-[1.02]"
                    >
                        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="text-lg">Create Your Own</span>
                        <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                    </Link>

                    <p className="text-gray-500 mt-4 text-xs">
                        ✨ Free • 🚀 Takes 2 minutes • 📱 Share anywhere
                    </p>
                </div>

            </div>

        </div>
    );
}
