import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, Plus, CreditCard, Layout, Loader2, ExternalLink, Trash2, Heart, MessageCircle, ArrowLeft } from 'lucide-react';
import { GiftSite, GiftCard, GiftSiteResponse } from '../types/gift';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

export default function UserDashboardPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [sites, setSites] = useState<GiftSite[]>([]);
    const [cards, setCards] = useState<GiftCard[]>([]);
    const [responses, setResponses] = useState<Record<string, GiftSiteResponse[]>>({});
    const [loading, setLoading] = useState(true);

    // Modal states
    const [modal, setModal] = useState<{ isOpen: boolean; type: 'deleteSite' | 'deleteCard' | null; itemId: string | null }>({ isOpen: false, type: null, itemId: null });
    const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: 'success' | 'error' }>({ isVisible: false, message: '', type: 'success' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);

                if (user) {
                    // Fetch Sites
                    const { data: sitesData } = await supabase
                        .from('gift_sites')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false });
                    setSites(sitesData || []);

                    // Fetch Cards
                    const { data: cardsData } = await supabase
                        .from('gift_cards')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false });
                    setCards(cardsData || []);

                    // Fetch Responses for all sites
                    if (sitesData && sitesData.length > 0) {
                        const { data: responsesData } = await supabase
                            .from('gift_site_responses')
                            .select('*')
                            .in('gift_site_id', sitesData.map(s => s.id))
                            .order('responded_at', { ascending: false });

                        // Group responses by site ID
                        const grouped: Record<string, GiftSiteResponse[]> = {};
                        responsesData?.forEach(response => {
                            if (!grouped[response.gift_site_id]) {
                                grouped[response.gift_site_id] = [];
                            }
                            grouped[response.gift_site_id].push(response);
                        });
                        setResponses(grouped);
                    }
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    const handleDeleteSite = async (id: string) => {
        setModal({ isOpen: true, type: 'deleteSite', itemId: id });
    };

    const confirmDeleteSite = async () => {
        if (!modal.itemId) return;
        try {
            await supabase.from('gift_sites').delete().eq('id', modal.itemId);
            setSites(sites.filter(s => s.id !== modal.itemId));
            setToast({ isVisible: true, message: 'Gift site deleted successfully!', type: 'success' });
        } catch (e) {
            console.error(e);
            setToast({ isVisible: true, message: 'Failed to delete gift site', type: 'error' });
        }
    };

    const handleDeleteCard = async (id: string) => {
        setModal({ isOpen: true, type: 'deleteCard', itemId: id });
    };

    const confirmDeleteCard = async () => {
        if (!modal.itemId) return;
        try {
            await supabase.from('gift_cards').delete().eq('id', modal.itemId);
            setCards(cards.filter(c => c.id !== modal.itemId));
            setToast({ isVisible: true, message: 'Digital card deleted successfully!', type: 'success' });
        } catch (e) {
            console.error(e);
            setToast({ isVisible: true, message: 'Failed to delete card', type: 'error' });
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-rose-500 transition-colors" />
                        <h1 className="text-xl font-bold text-gray-900">Back to Home</h1>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 hidden sm:block">
                            {user?.email}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors text-sm font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Welcome Section for New Users */}
                {sites.length === 0 && cards.length === 0 && (
                    <div className="mb-8 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome to Digital Gifts! 🎁</h2>
                                <p className="text-gray-700 mb-3">
                                    Create personalized experiences for your loved ones in two ways:
                                </p>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p>
                                        <strong className="text-rose-600">Gift Sites:</strong> Full webpages with scrolling sections, music, photos, timelines, and interactive features like proposal pages.
                                    </p>
                                    <p>
                                        <strong className="text-violet-600">Digital Cards:</strong> Mobile-optimized vertical cards perfect for sharing on Instagram Stories, WhatsApp, or social media.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* Create Gift Site */}
                    <div
                        onClick={() => navigate('/create/site')}
                        className="group bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-xl relative overflow-hidden"
                    >
                        <div className="absolute right-0 top-0 opacity-10 transform translate-x-8 -translate-y-8">
                            <Layout className="w-48 h-48" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Create Gift Site</h2>
                        <p className="text-pink-100 mb-6 max-w-xs">
                            Design a personal webpage with music, photos, and interactive templates.
                        </p>
                        <div className="bg-white/20 backdrop-blur-sm w-fit p-3 rounded-full group-hover:bg-white/30 transition-colors">
                            <Plus className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Create Gift Card */}
                    <div
                        onClick={() => navigate('/create/card')}
                        className="group bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-xl relative overflow-hidden"
                    >
                        <div className="absolute right-0 top-0 opacity-10 transform translate-x-8 -translate-y-8">
                            <CreditCard className="w-48 h-48" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Create Digital Card</h2>
                        <p className="text-indigo-100 mb-6 max-w-xs">
                            Make a stunning digital card optimized for Instagram & social stories.
                        </p>
                        <div className="bg-white/20 backdrop-blur-sm w-fit p-3 rounded-full group-hover:bg-white/30 transition-colors">
                            <Plus className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Your Creations */}
                <div className="space-y-12">

                    {/* Sites Section */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Layout className="text-rose-500" /> Your Gift Sites
                        </h2>

                        {sites.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-500">You haven't created any gift sites yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sites.map(site => {
                                    const siteResponses = responses[site.id] || [];
                                    const hasResponses = siteResponses.length > 0;
                                    const yesCount = siteResponses.filter(r => r.response_type === 'yes').length;
                                    const maybeCount = siteResponses.filter(r => r.response_type === 'maybe').length;
                                    const noCount = siteResponses.filter(r => r.response_type === 'no').length;

                                    return (
                                        <div key={site.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-lg font-bold text-gray-900">{site.content.hero_headline || 'Untitled Site'}</h3>
                                                {hasResponses && (
                                                    <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                                        <Heart size={12} />
                                                        {siteResponses.length}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 mb-2">To: {site.content.recipient_name || 'Someone Special'}</p>

                                            {/* Response Summary */}
                                            {hasResponses && (
                                                <div className="mb-4 mt-3 p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-100">
                                                    <div className="flex items-center gap-4 text-xs">
                                                        {yesCount > 0 && (
                                                            <span className="flex items-center gap-1 text-green-700 font-medium">
                                                                💚 {yesCount} Yes
                                                            </span>
                                                        )}
                                                        {maybeCount > 0 && (
                                                            <span className="flex items-center gap-1 text-purple-700 font-medium">
                                                                💜 {maybeCount} Maybe
                                                            </span>
                                                        )}
                                                        {noCount > 0 && (
                                                            <span className="flex items-center gap-1 text-gray-600 font-medium">
                                                                💔 {noCount} No
                                                            </span>
                                                        )}
                                                    </div>
                                                    {siteResponses[0]?.message && (
                                                        <div className="mt-2 flex items-start gap-1">
                                                            <MessageCircle size={12} className="text-rose-500 mt-0.5" />
                                                            <p className="text-xs text-gray-700 italic line-clamp-1">"{siteResponses[0].message}"</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
                                                <Link
                                                    to={`/valentine/${site.slug}`}
                                                    target="_blank"
                                                    className="text-indigo-600 font-medium text-sm flex items-center gap-1 hover:underline"
                                                >
                                                    View Site <ExternalLink size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteSite(site.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {/* Cards Section */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <CreditCard className="text-violet-500" /> Your Digital Cards
                        </h2>

                        {cards.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-500">You haven't created any digital cards yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cards.map(card => (
                                    <div key={card.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{card.content.message?.substring(0, 20)}...</h3>
                                        <p className="text-sm text-gray-500 mb-4">To: {card.content.recipient_name || 'Friend'}</p>
                                        <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
                                            <Link
                                                to={`/cards/${card.id}`}
                                                target="_blank"
                                                className="text-indigo-600 font-medium text-sm flex items-center gap-1 hover:underline"
                                            >
                                                View Card <ExternalLink size={14} />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteCard(card.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                </div>

            </main>

            {/* Modal */}
            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ isOpen: false, type: null, itemId: null })}
                onConfirm={modal.type === 'deleteSite' ? confirmDeleteSite : confirmDeleteCard}
                title={modal.type === 'deleteSite' ? 'Delete Gift Site?' : 'Delete Digital Card?'}
                message={modal.type === 'deleteSite'
                    ? 'This will permanently delete your gift site and all its content. This action cannot be undone.'
                    : 'This will permanently delete your digital card. This action cannot be undone.'}
                type="alert"
                confirmText="Delete"
                cancelText="Cancel"
            />

            {/* Toast */}
            <Toast
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, isVisible: false })}
            />
        </div>
    );
}
