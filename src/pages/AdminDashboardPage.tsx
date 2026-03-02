import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ValentinePage as ValentinePageType } from '../types/valentine';
import { GiftSite } from '../types/gift';
import { Loader2, Trash2, Edit, Eye, Plus, LogOut, Home, Gift, Heart, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import ValentineFormPage from './ValentineFormPage';

export default function AdminDashboardPage() {
  const [pages, setPages] = useState<ValentinePageType[]>([]);
  const [giftSites, setGiftSites] = useState<GiftSite[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showValentineForm, setShowValentineForm] = useState(false);
  const [selectedPageForEdit, setSelectedPageForEdit] = useState<ValentinePageType | null>(null);
  const [activeTab, setActiveTab] = useState<'valentine' | 'marketplace'>('valentine');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      // Fetch Legacy Valentine Pages
      const { data: legacyData, error: legacyError } = await supabase
        .from('valentine_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (legacyError) throw legacyError;
      setPages(legacyData || []);

      // Fetch New Gift Sites
      const { data: newGiftData, error: newGiftError } = await supabase
        .from('gift_sites')
        .select('*')
        .order('created_at', { ascending: false });

      if (newGiftError) throw newGiftError;
      setGiftSites(newGiftData || []);

      // Fetch Quizzes
      const { data: quizzesData, error: quizzesError } = await supabase
        .from('couples_quizzes')
        .select('id, slug, questions, creator_answers, partner_answers, score, created_at')
        .order('created_at', { ascending: false });

      if (quizzesError) throw quizzesError;
      setQuizzes(quizzesData || []);

      setError(null);
    } catch (err: any) {
      console.error('Error fetching pages:', err);
      setError(err.message || 'Failed to load pages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLegacy = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this legacy page?')) {
      try {
        const { error: deleteError } = await supabase.from('valentine_pages').delete().eq('id', id);
        if (deleteError) throw deleteError;
        setPages(pages.filter((page) => page.id !== id));
      } catch (err: any) {
        console.error('Error deleting page:', err);
        alert(err.message || 'Failed to delete page. Please try again.');
      }
    }
  };

  const handleDeleteGiftSite = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this gift site?')) {
      try {
        const { error: deleteError } = await supabase.from('gift_sites').delete().eq('id', id);
        if (deleteError) throw deleteError;
        setGiftSites(giftSites.filter((site) => site.id !== id));
      } catch (err: any) {
        console.error('Error deleting gift site:', err);
        alert(err.message || 'Failed to delete gift site. Please try again.');
      }
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this chemistry test?')) {
      try {
        const { error: deleteError } = await supabase.from('couples_quizzes').delete().eq('id', id);
        if (deleteError) throw deleteError;
        setQuizzes(quizzes.filter((q) => q.id !== id));
      } catch (err: any) {
        console.error('Error deleting quiz:', err);
        alert(err.message || 'Failed to delete quiz. Please try again.');
      }
    }
  };

  const handleEdit = (page: ValentinePageType) => {
    setSelectedPageForEdit(page);
    setShowValentineForm(true);
  };

  const handleCreateNewValentine = () => {
    setSelectedPageForEdit(null);
    setShowValentineForm(true);
  };

  const handleBackToDashboard = () => {
    setShowValentineForm(false);
    setSelectedPageForEdit(null);
    fetchPages(); // Re-fetch pages after creating/editing
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem('isAdminAuthenticated');
    navigate('/admin', { replace: true });
  };

  if (showValentineForm) {
    return <ValentineFormPage pageData={selectedPageForEdit} onBack={handleBackToDashboard} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">micro-saas.online Admin</h1>
            <p className="text-slate-500 mt-1">Manage all SaaS products and user pages.</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-slate-600 rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-all font-medium"
            >
              <Home size={18} />
              <span>View Site</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-rose-600 rounded-lg shadow-sm border border-rose-100 hover:bg-rose-50 transition-all font-medium"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 border-b border-slate-200 mb-8">
          <button
            onClick={() => setActiveTab('valentine')}
            className={`pb-4 px-2 font-semibold transition-all ${activeTab === 'valentine' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            User Creations
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`pb-4 px-2 font-semibold transition-all ${activeTab === 'marketplace' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            SaaS Catalog
          </button>
        </div>

        {activeTab === 'valentine' ? (
          <div className="space-y-8">
            {/* New Gift Sites Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Gift className="text-indigo-600" /> Modern Gift Sites
                  </h2>
                  <p className="text-slate-500 text-sm">New generation interactive gift experiences.</p>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
                </div>
              ) : error ? (
                <p className="text-red-500 text-center py-4">{error}</p>
              ) : giftSites.length === 0 ? (
                <p className="text-center text-slate-500 py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No modern gift sites found.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {giftSites.map((site) => (
                    <div key={site.id} className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between hover:border-indigo-200 hover:shadow-md transition-all group">
                      <div>
                        <p className="font-bold text-slate-900">{site.content?.recipient_name || 'Untitled'}</p>
                        <p className="text-xs text-slate-400 font-mono">/valentine/{site.slug}</p>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                        <a
                          href={`/valentine/${site.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Eye size={18} />
                        </a>
                        <button
                          onClick={() => handleDeleteGiftSite(site.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chemistry Tests Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="text-indigo-500" /> Viral Chemistry Tests
                  </h2>
                  <p className="text-slate-500 text-sm">Couples compatibility quizzes.</p>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
                </div>
              ) : quizzes.length === 0 ? (
                <p className="text-center text-slate-500 py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No chemistry tests found.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between hover:border-indigo-200 hover:shadow-md transition-all group">
                      <div>
                        <p className="font-bold text-slate-900">Sync Test: {quiz.slug}</p>
                        <p className="text-xs text-slate-400 font-mono">/quiz/{quiz.slug}</p>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                        <a
                          href={`/quiz/${quiz.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Eye size={18} />
                        </a>
                        <button
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Legacy Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Heart className="text-rose-500" /> Legacy Valentine Pages
                  </h2>
                  <p className="text-slate-500 text-sm">Older format pages created via Admin.</p>
                </div>
                <button
                  onClick={handleCreateNewValentine}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-all font-bold"
                >
                  <Plus size={20} />
                  <span>Create Legacy Page</span>
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-10 h-10 text-rose-500 animate-spin mx-auto mb-4" />
                </div>
              ) : pages.length === 0 ? (
                <p className="text-center text-slate-500 py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No legacy pages found.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pages.map((page) => (
                    <div key={page.id} className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between hover:border-pink-200 hover:shadow-md transition-all group">
                      <div>
                        <p className="font-bold text-slate-900">{page?.recipient_name}</p>
                        <p className="text-sm text-slate-400 font-mono">/{page.slug}</p>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                        <a
                          href={`/valentine/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Eye size={18} />
                        </a>
                        <button
                          onClick={() => handleEdit(page)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteLegacy(page.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-200 text-center">
            <Plus size={48} className="text-slate-200 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">SaaS Catalog Management</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              Dynamic marketplace catalog coming in the next version.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
