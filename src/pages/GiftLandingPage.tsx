import { Link } from 'react-router-dom';
import { Gift, Smartphone, Layout, ArrowRight, Sparkles, Music, Image as ImageIcon } from 'lucide-react';

export default function GiftLandingPage() {

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Gift className="text-white" size={20} />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Digital Gifts</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/auth" className="text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors">Log In</Link>
                        <Link to="/auth" className="px-4 py-2 rounded-full bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-all shadow-md hover:shadow-lg">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-rose-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-rose-100 text-rose-600 text-sm font-bold mb-6 animate-fade-in-up">
                        New: Mobile Story Cards & Interactive Sites
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-900">
                        Make their day <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Unforgettable</span>
                    </h1>
                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Create stunning digital gift sites and story-style cards for Valentine's, Birthdays, and Anniversaries. Personalize with music, photos, and secrets.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/auth" className="px-8 py-4 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-all shadow-xl flex items-center gap-2 transform hover:scale-105">
                            Start Creating for Free <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>

                {/* Abstract Shapes */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-20 right-10 w-64 h-64 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Feature 1: Interactive Sites */}
                        <div className="order-2 lg:order-1">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-slate-900 h-[400px] group">
                                {/* Mock UI for Browser */}
                                <div className="absolute top-0 left-0 right-0 h-6 bg-slate-800 flex items-center px-4 gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                </div>
                                <div className="pt-8 h-full bg-gradient-to-br from-pink-100 to-rose-50 flex items-center justify-center p-8">
                                    <div className="text-center">
                                        <h3 className="text-3xl font-serif text-rose-800 mb-2">My Dearest Sarah</h3>
                                        <p className="text-rose-600 italic mb-4">You are my universe...</p>
                                        <div className="w-full max-w-xs mx-auto grid grid-cols-2 gap-2 opacity-80">
                                            <div className="h-24 bg-rose-200 rounded-lg animate-pulse"></div>
                                            <div className="h-24 bg-rose-300 rounded-lg animate-pulse animation-delay-1000"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 space-y-6">
                            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center">
                                <Layout className="text-rose-600" size={24} />
                            </div>
                            <h2 className="text-4xl font-bold text-slate-900">Interactive Gift Sites</h2>
                            <p className="text-lg text-slate-600">
                                Go beyond a simple message. Build a full-page experience that guides them through your memories.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="p-1 rounded-full bg-green-100 text-green-600"><ArrowRight size={14} /></div>
                                    Multiple templates: Valentine, Birthday, Anniversary
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="p-1 rounded-full bg-green-100 text-green-600"><ArrowRight size={14} /></div>
                                    <span className="flex items-center gap-2">Add your own <Music size={14} /> Music & <ImageIcon size={14} /> Photos</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="p-1 rounded-full bg-green-100 text-green-600"><ArrowRight size={14} /></div>
                                    "Runaway No" button for playful proposals
                                </li>
                            </ul>
                            <Link to="/auth" className="inline-flex items-center text-rose-600 font-bold hover:text-rose-700 mt-4">
                                Create a Site <ArrowRight size={16} className="ml-1" />
                            </Link>
                        </div>


                        {/* Feature 2: Digital Cards */}
                        <div className="space-y-6 mt-20 lg:mt-0">
                            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                                <Smartphone className="text-purple-600" size={24} />
                            </div>
                            <h2 className="text-4xl font-bold text-slate-900">Digital Story Cards</h2>
                            <p className="text-lg text-slate-600">
                                Designed for the mobile generation. Create 9:16 vertical cards perfectly sized for Instagram Stories, TikTok, or sending via WhatsApp.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="p-1 rounded-full bg-green-100 text-green-600"><ArrowRight size={14} /></div>
                                    Perfect for social media sharing
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="p-1 rounded-full bg-green-100 text-green-600"><ArrowRight size={14} /></div>
                                    Beautiful, animated templates
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="p-1 rounded-full bg-green-100 text-green-600"><ArrowRight size={14} /></div>
                                    Instant preview and share
                                </li>
                            </ul>
                            <Link to="/auth" className="inline-flex items-center text-purple-600 font-bold hover:text-purple-700 mt-4">
                                Create a Card <ArrowRight size={16} className="ml-1" />
                            </Link>
                        </div>
                        <div className="mt-20 lg:mt-0 flex justify-center">
                            <div className="relative w-[280px] h-[580px] bg-slate-900 rounded-[3rem] shadow-2xl border-8 border-slate-900 overflow-hidden">
                                {/* Mock Mobile UI */}
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-xl z-20"></div>
                                <div className="w-full h-full bg-gradient-to-b from-purple-400 to-indigo-600 flex flex-col items-center justify-center p-6 text-white text-center">
                                    <Sparkles className="w-12 h-12 mb-4 animate-spin-slow" />
                                    <h3 className="text-4xl font-serif mb-2">Happy Birthday!</h3>
                                    <p className="text-purple-100 mb-8">Hope your day is magical ✨</p>
                                    <div className="w-full aspect-square bg-white/20 backdrop-blur-sm rounded-2xl mb-8"></div>
                                    <button className="px-6 py-2 bg-white text-purple-600 rounded-full font-bold text-sm">
                                        Tap to Open
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-slate-900 text-white text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-6">Ready to surprise them?</h2>
                    <p className="text-slate-400 text-lg mb-8">
                        Join thousands of users creating memories that last forever. It's free to create your first gift.
                    </p>
                    <Link to="/auth" className="inline-block px-10 py-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl font-bold hover:shadow-lg hover:from-rose-400 hover:to-pink-400 transition-all transform hover:-translate-y-1">
                        Create Your Gift Now
                    </Link>
                </div>
            </section>

        </div>
    );
}
