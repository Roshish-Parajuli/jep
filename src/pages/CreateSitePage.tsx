import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Heart, Cake, Calendar, ChevronRight, Loader2, Sparkles, Zap } from 'lucide-react';
import { GiftTemplateType } from '../types/gift';

interface TemplateOption {
    id: GiftTemplateType;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const templates: TemplateOption[] = [
    {
        id: 'valentine_classic',
        title: 'Classic Valentine',
        description: 'Timeless scrolling experience with music, timeline, photos, and love letter.',
        icon: <Heart className="w-8 h-8 text-rose-500" />,
        color: 'bg-rose-50 border-rose-200 hover:border-rose-400'
    },
    {
        id: 'valentine_ask',
        title: 'The Proposal',
        description: 'Interactive proposal page with playful buttons, message field, and date picker.',
        icon: <Sparkles className="w-8 h-8 text-pink-500" />,
        color: 'bg-pink-50 border-pink-200 hover:border-pink-400'
    },
    {
        id: 'anniversary',
        title: 'Romantic Anniversary',
        description: 'Elegant design to celebrate your journey together with timeline and memories.',
        icon: <Calendar className="w-8 h-8 text-red-500" />,
        color: 'bg-red-50 border-red-200 hover:border-red-400'
    },
    {
        id: 'birthday',
        title: 'Birthday Bash',
        description: 'Fun and festive page with balloons, wishes, and special birthday memories.',
        icon: <Cake className="w-8 h-8 text-purple-500" />,
        color: 'bg-purple-50 border-purple-200 hover:border-purple-400'
    },
    {
        id: 'custom',
        title: 'Minimalist Modern',
        description: 'Clean, simple design focusing on your message with elegant typography.',
        icon: <Zap className="w-8 h-8 text-indigo-500" />,
        color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400'
    }
];

export default function CreateSitePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedTemplate, setSelectedTemplate] = useState<GiftTemplateType | null>(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(!!id);

    // Form State
    const [formData, setFormData] = useState({
        recipient_name: '',
        hero_headline: '',
        hero_subtext: '',
        slug: '',
    });

    useEffect(() => {
        if (id) {
            fetchSite();
        }
    }, [id]);

    const fetchSite = async () => {
        try {
            const { data, error } = await supabase
                .from('gift_sites')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data) {
                setFormData({
                    recipient_name: data.content.recipient_name,
                    hero_headline: data.content.hero_headline,
                    hero_subtext: data.content.hero_subtext,
                    slug: data.slug,
                });
                setSelectedTemplate(data.template_type);
                setStep(2);
            }
        } catch (err) {
            console.error('Error fetching site:', err);
            alert('Failed to load site data.');
            navigate('/dashboard');
        } finally {
            setPageLoading(false);
        }
    };

    const handleNext = () => {
        if (step === 1 && selectedTemplate) setStep(2);
    };

    const handleCreate = async () => {
        if (!selectedTemplate) return;
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Generate a unique slug if not provided or clean up provided one
            const slug = formData.slug.trim() || `gift-${Math.random().toString(36).substring(7)}`;

            if (id) {
                // Update existing site
                const { error } = await supabase
                    .from('gift_sites')
                    .update({
                        slug: slug,
                        template_type: selectedTemplate,
                        content: {
                            recipient_name: formData.recipient_name,
                            hero_headline: formData.hero_headline,
                            hero_subtext: formData.hero_subtext,
                            // Keep existing content fields
                            secret_message: "I have a secret...",
                            secret_code: "1234",
                            promises: ["To always be there", "To make you smile"],
                            timeline: [],
                            love_letter: "Write your letter here...",
                            final_message: "You are my everything."
                        },
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', id);

                if (error) throw error;
            } else {
                // Insert new site
                const { error } = await supabase.from('gift_sites').insert({
                    user_id: user.id,
                    slug: slug,
                    template_type: selectedTemplate,
                    is_published: true,
                    content: {
                        recipient_name: formData.recipient_name,
                        hero_headline: formData.hero_headline,
                        hero_subtext: formData.hero_subtext,
                        secret_message: "I have a secret...",
                        secret_code: "1234",
                        promises: ["To always be there", "To make you smile"],
                        timeline: [],
                        love_letter: "Write your letter here...",
                        final_message: "You are my everything."
                    }
                });

                if (error) throw error;
            }

            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert(`Failed to ${id ? 'update' : 'create'} site. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => step === 1 ? navigate('/dashboard') : setStep(step - 1)}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    {step === 1 ? 'Dashboard' : 'Back'}
                </button>
                <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-200'}`}></span>
                    <span className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></span>
                </div>
                <div className="w-20"></div> {/* Spacer */}
            </div>

            <div className="flex-1 max-w-4xl mx-auto w-full p-6">

                {/* Step 1: Template Selection */}
                {step === 1 && (
                    <div className="animate-fade-in">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{id ? 'Change Template' : 'Choose a Template'}</h1>
                        <p className="text-gray-500 mb-2">Select a style for your gift site.</p>

                        {/* Template Guide */}
                        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <p className="text-sm text-gray-700">
                                <strong className="text-blue-700">💡 Tip:</strong> Each template includes customizable content, text, and colors. You'll be able to personalize everything after selecting.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(template.id)}
                                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg ${selectedTemplate === template.id
                                        ? 'border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-200'
                                        : `bg-white ${template.color}`
                                        }`}
                                >
                                    <div className="mb-4">{template.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{template.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{template.description}</p>

                                    {/* Feature badges */}
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {template.id === 'valentine_ask' && (
                                            <>
                                                <span className="text-xs bg-white/70 px-2 py-1 rounded-full text-gray-600">📝 Message</span>
                                                <span className="text-xs bg-white/70 px-2 py-1 rounded-full text-gray-600">📅 Date Picker</span>
                                            </>
                                        )}
                                        {(template.id === 'valentine_classic' || template.id === 'anniversary') && (
                                            <>
                                                <span className="text-xs bg-white/70 px-2 py-1 rounded-full text-gray-600">🎵 Music</span>
                                                <span className="text-xs bg-white/70 px-2 py-1 rounded-full text-gray-600">📸 Photos</span>
                                            </>
                                        )}
                                        {template.id === 'birthday' && (
                                            <>
                                                <span className="text-xs bg-white/70 px-2 py-1 rounded-full text-gray-600">🎈 Festive</span>
                                                <span className="text-xs bg-white/70 px-2 py-1 rounded-full text-gray-600">🎁 Wishes</span>
                                            </>
                                        )}
                                    </div>

                                    {selectedTemplate === template.id && (
                                        <div className="absolute top-4 right-4 text-indigo-600">
                                            <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs">✓</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 flex justify-end">
                            <button
                                onClick={handleNext}
                                disabled={!selectedTemplate}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                            >
                                Continue <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Basic Details */}
                {step === 2 && (
                    <div className="animate-fade-in">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{id ? 'Update Details' : 'Customize Details'}</h1>
                        <p className="text-gray-500 mb-8">Let's start with the basics.</p>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="e.g. Sarah"
                                    value={formData.recipient_name}
                                    onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Main Headline</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="e.g. For the most beautiful person..."
                                    value={formData.hero_headline}
                                    onChange={(e) => setFormData({ ...formData, hero_headline: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subtext</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-24 resize-none"
                                    placeholder="A short intro message..."
                                    value={formData.hero_subtext}
                                    onChange={(e) => setFormData({ ...formData, hero_subtext: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Custom URL Slug (Optional)</label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                        /valentine/
                                    </span>
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-3 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        placeholder="sarah-2026"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Leave blank to auto-generate.</p>
                            </div>
                        </div>

                        <div className="mt-10 flex justify-end">
                            <button
                                onClick={handleCreate}
                                disabled={loading || !formData.recipient_name}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all min-w-[140px] justify-center"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (id ? 'Save Changes' : 'Create Site')}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
