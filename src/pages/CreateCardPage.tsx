import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Palette, Type, Send, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { CardTemplateType } from '../types/gift';

interface CardTemplateOption {
    id: CardTemplateType;
    title: string;
    gradient: string;
}

const templates: CardTemplateOption[] = [
    { id: 'story_simple', title: 'Simple Story', gradient: 'from-pink-400 to-rose-400' },
    { id: 'story_animated', title: 'Animated Vibes', gradient: 'from-violet-500 to-purple-500' },
    { id: 'story_photo', title: 'Photo Focus', gradient: 'from-blue-400 to-cyan-400' },
];

const themes = [
    { name: 'Sunset', class: 'from-orange-400 to-pink-500' },
    { name: 'Ocean', class: 'from-blue-400 to-teal-400' },
    { name: 'Berry', class: 'from-purple-500 to-pink-500' },
    { name: 'Midnight', class: 'from-slate-800 to-slate-900 text-white' },
];

export default function CreateCardPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');

    const [formData, setFormData] = useState({
        recipient_name: 'Sarah',
        sender_name: 'John',
        message: 'Happy Birthday! Have a magical day.',
        template_id: 'story_simple' as CardTemplateType,
        theme_color: 'from-purple-500 to-pink-500'
    });

    const handleCreate = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase.from('gift_cards').insert({
                user_id: user.id,
                template_id: formData.template_id,
                content: {
                    recipient_name: formData.recipient_name,
                    sender_name: formData.sender_name,
                    message: formData.message,
                    theme_color: formData.theme_color
                }
            });

            if (error) throw error;
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Failed to create card.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans">
            {/* Left Panel - Editor */}
            <div className="w-full md:w-1/2 lg:w-5/12 bg-white flex flex-col h-screen border-r border-gray-200 shadow-xl z-10">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-900">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="font-bold text-lg text-gray-800">Card Editor</h1>
                    <div className="w-5"></div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'content' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                    >
                        <Type size={16} /> Content
                    </button>
                    <button
                        onClick={() => setActiveTab('style')}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'style' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                    >
                        <Palette size={16} /> Style
                    </button>
                </div>

                {/* Content Scroll */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {activeTab === 'content' && (
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Recipient</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.recipient_name}
                                    onChange={e => setFormData({ ...formData, recipient_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message</label>
                                <textarea
                                    rows={4}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">From</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.sender_name}
                                    onChange={e => setFormData({ ...formData, sender_name: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'style' && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Layout Template</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {templates.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => setFormData({ ...formData, template_id: t.id })}
                                            className={`p-3 rounded-xl border transition-all text-left flex items-center gap-3 ${formData.template_id === t.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${t.gradient}`}></div>
                                            <span className="font-medium text-gray-700">{t.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Color Theme</label>
                                <div className="flex flex-wrap gap-3">
                                    {themes.map((t, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setFormData({ ...formData, theme_color: t.class })}
                                            className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.class} shadow-sm ring-2 ring-offset-2 transition-all ${formData.theme_color === t.class ? 'ring-indigo-500 scale-110' : 'ring-transparent hover:scale-105'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-white">
                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Create Card</>}
                    </button>
                </div>
            </div>

            {/* Right Panel - Live Preview */}
            <div className="hidden md:flex flex-1 bg-gray-100 items-center justify-center p-8 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                <div className="relative z-10 scale-[0.85] lg:scale-100 transition-all">
                    {/* Phone Frame */}
                    <div className="w-[375px] h-[760px] bg-white rounded-[3rem] shadow-2xl border-[8px] border-gray-900 overflow-hidden relative">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-xl z-20"></div>

                        {/* Card Content - The actual output */}
                        <div className={`w-full h-full bg-gradient-to-br ${formData.theme_color} p-8 flex flex-col relative`}>

                            {/* Template: Simple */}
                            {formData.template_id === 'story_simple' && (
                                <div className="h-full flex flex-col justify-center text-center text-white">
                                    <div className="mb-8">
                                        <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-80" />
                                        <h2 className="text-sm uppercase tracking-widest opacity-80 mb-2">To {formData.recipient_name}</h2>
                                        <h1 className="text-5xl font-serif font-bold leading-tight mb-8 drop-shadow-sm">{formData.message}</h1>
                                    </div>
                                    <div className="mt-auto pb-12">
                                        <p className="text-sm opacity-70">Sent with love by</p>
                                        <p className="font-bold text-lg">{formData.sender_name}</p>
                                    </div>
                                </div>
                            )}

                            {/* Template: Animated */}
                            {formData.template_id === 'story_animated' && (
                                <div className="h-full flex flex-col items-center justify-center text-center text-white relative">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                        <div className="w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
                                    </div>
                                    <h1 className="text-6xl font-bold mb-6 animate-bounce">{formData.message}</h1>
                                    <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/30 transform -rotate-3">
                                        <p className="text-xl">For: {formData.recipient_name}</p>
                                    </div>
                                    <div className="absolute bottom-12 text-center w-full">
                                        <p className="text-sm font-bold bg-white text-gray-900 px-4 py-1 rounded-full inline-block">From {formData.sender_name}</p>
                                    </div>
                                </div>
                            )}

                            {/* Template: Photo */}
                            {formData.template_id === 'story_photo' && (
                                <div className="h-full flex flex-col text-white">
                                    <div className="h-1/2 bg-black/20 rounded-3xl mb-6 flex items-center justify-center border-2 border-white/30 border-dashed">
                                        <span className="opacity-70 flex items-center gap-2"><ImageIcon size={18} /> Photo Placeholder</span>
                                    </div>
                                    <h1 className="text-4xl font-bold mb-4">{formData.message}</h1>
                                    <p className="text-xl opacity-90">Dear {formData.recipient_name},</p>
                                    <div className="mt-auto pb-8">
                                        <div className="h-px w-full bg-white/30 mb-4"></div>
                                        <p className="text-right italic text-sm">Love, {formData.sender_name}</p>
                                    </div>
                                </div>
                            )}

                            {/* Common Elements */}
                            <div className="absolute bottom-4 left-0 right-0 text-center opacity-50 text-[10px] text-white">
                                micro-saas.online
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
