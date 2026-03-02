import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Palette, Type, Save, Loader2, Sparkles, Image as ImageIcon, Plus } from 'lucide-react';
import { CardTemplateType } from '../types/gift';

interface CardTemplateOption {
    id: CardTemplateType;
    title: string;
    gradient: string;
}

const templates: CardTemplateOption[] = [
    { id: 'story_photo', title: 'Photo Focus', gradient: 'from-rose-400 to-pink-500' },
    { id: 'story_simple', title: 'Simple Story', gradient: 'from-pink-400 to-rose-400' },
    { id: 'story_animated', title: 'Animated Vibes', gradient: 'from-violet-500 to-purple-500' },
];

const themes = [
    { name: 'Sunset', class: 'from-orange-400 to-pink-500' },
    { name: 'Ocean', class: 'from-blue-400 to-teal-400' },
    { name: 'Berry', class: 'from-purple-500 to-pink-500' },
    { name: 'Midnight', class: 'from-slate-800 to-slate-900 text-white' },
];

export default function EditCardPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');

    const [formData, setFormData] = useState({
        recipient_name: '',
        sender_name: '',
        message: '',
        template_id: 'story_photo' as CardTemplateType,
        theme_color: 'from-rose-400 to-pink-500',
        photo_url: ''
    });

    const defaults = {
        recipient_name: 'Sarah',
        sender_name: 'John',
        message: 'Happy Birthday! Have a magical day.'
    };

    useEffect(() => {
        fetchCard();
    }, [id]);

    const fetchCard = async () => {
        try {
            const { data, error } = await supabase
                .from('gift_cards')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data) {
                setFormData({
                    recipient_name: data.content.recipient_name,
                    sender_name: data.content.sender_name,
                    message: data.content.message,
                    template_id: data.template_id,
                    theme_color: data.content.theme_color,
                    photo_url: data.content.photo_url || ''
                });
            }
        } catch (err) {
            console.error('Error fetching card:', err);
            alert('Failed to load card data.');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, photo_url: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('gift_cards')
                .update({
                    template_id: formData.template_id,
                    content: {
                        recipient_name: formData.recipient_name || defaults.recipient_name,
                        sender_name: formData.sender_name || defaults.sender_name,
                        message: formData.message || defaults.message,
                        theme_color: formData.theme_color,
                        photo_url: formData.photo_url
                    },
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Failed to save card.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans">
            {/* Left Panel - Editor */}
            <div className="w-full md:w-1/2 lg:w-5/12 bg-white flex flex-col h-screen border-r border-gray-200 shadow-xl z-10">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="font-bold text-lg text-gray-800">Edit Card</h1>
                    <div className="w-5"></div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all ${activeTab === 'content' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Type size={16} /> Content
                    </button>
                    <button
                        onClick={() => setActiveTab('style')}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all ${activeTab === 'style' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
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
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={formData.recipient_name}
                                    placeholder={defaults.recipient_name}
                                    onChange={e => setFormData({ ...formData, recipient_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message</label>
                                <textarea
                                    rows={4}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
                                    value={formData.message}
                                    placeholder={defaults.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">From</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={formData.sender_name}
                                    placeholder={defaults.sender_name}
                                    onChange={e => setFormData({ ...formData, sender_name: e.target.value })}
                                />
                            </div>

                            {/* Photo Upload Section */}
                            {formData.template_id === 'story_photo' && (
                                <div className="animate-fade-in pt-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Card Photo</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                                            {formData.photo_url ? (
                                                <img src={formData.photo_url} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="text-gray-300" size={24} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                id="photo-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handlePhotoUpload}
                                            />
                                            <label
                                                htmlFor="photo-upload"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-all shadow-sm"
                                            >
                                                <Plus size={16} /> {formData.photo_url ? 'Change Photo' : 'Upload Photo'}
                                            </label>
                                            <p className="text-[10px] text-gray-400 mt-2">Recommended: Portrait orientation (9:16)</p>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
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
                                        <h2 className="text-sm uppercase tracking-widest opacity-80 mb-2">To {formData.recipient_name || defaults.recipient_name}</h2>
                                        <h1 className="text-5xl font-serif font-bold leading-tight mb-8 drop-shadow-sm">{formData.message || defaults.message}</h1>
                                    </div>
                                    <div className="mt-auto pb-12">
                                        <p className="text-sm opacity-70">Sent with love by</p>
                                        <p className="font-bold text-lg">{formData.sender_name || defaults.sender_name}</p>
                                    </div>
                                </div>
                            )}

                            {/* Template: Animated */}
                            {formData.template_id === 'story_animated' && (
                                <div className="h-full flex flex-col items-center justify-center text-center text-white relative">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                        <div className="w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
                                    </div>
                                    <h1 className="text-6xl font-bold mb-6 animate-bounce">{formData.message || defaults.message}</h1>
                                    <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/30 transform -rotate-3">
                                        <p className="text-xl">For: {formData.recipient_name || defaults.recipient_name}</p>
                                    </div>
                                    <div className="absolute bottom-12 text-center w-full">
                                        <p className="text-sm font-bold bg-white text-gray-900 px-4 py-1 rounded-full inline-block">From {formData.sender_name || defaults.sender_name}</p>
                                    </div>
                                </div>
                            )}

                            {/* Template: Photo */}
                            {formData.template_id === 'story_photo' && (
                                <div className="h-full flex flex-col text-white">
                                    <div className="relative h-2/3 bg-black/10 rounded-[2rem] mb-8 flex items-center justify-center border-2 border-white/20 overflow-hidden shadow-2xl group cursor-pointer transition-transform hover:scale-[0.98]">
                                        {formData.photo_url ? (
                                            <img src={formData.photo_url} alt="Gift" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                                                    <Plus size={32} className="text-white" />
                                                </div>
                                                <span className="font-bold text-white/70">Upload Your Photo</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                                    </div>

                                    <div className="space-y-4 px-2">
                                        <h1 className="text-4xl font-serif font-bold leading-tight drop-shadow-md">{formData.message || defaults.message}</h1>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-px bg-white/50"></div>
                                            <p className="text-lg font-medium opacity-90">For {formData.recipient_name || defaults.recipient_name}</p>
                                        </div>
                                    </div>

                                    <div className="mt-auto pb-8 px-2 flex justify-end items-end">
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">With Love,</p>
                                            <p className="text-xl font-bold font-serif">{formData.sender_name || defaults.sender_name}</p>
                                        </div>
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
