import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ValentinePage as ValentinePageType } from '../types/valentine'; // Renamed to avoid conflict
import { Loader2, Trash2, Edit, Eye, Plus, LogOut, LayoutDashboard, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Assuming ValentineFormPage is a new component for creating/editing Valentine pages
import ValentineFormPage from './ValentineFormPage';

export default function AdminDashboardPage() {
  const [pages, setPages] = useState<ValentinePageType[]>([]);
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
      const { data, error: fetchError } = await supabase
        .from('valentine_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPages(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching pages:', err);
      setError(err.message || 'Failed to load pages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
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
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Marketplace Admin</h1>
            <p className="text-slate-500 mt-1">Manage your micro-SaaS products and pages.</p>
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
            Valentine Pages
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`pb-4 px-2 font-semibold transition-all ${activeTab === 'marketplace' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Marketplace Listings
          </button>
        </div>

        {activeTab === 'valentine' ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Valentine Gift Pages</h2>
                <p className="text-slate-500 text-sm">Personalized pages created by users.</p>
              </div>
              <button
                onClick={handleCreateNewValentine}
                className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-all font-bold"
              >
                <Plus size={20} />
                <span>Create New Valentine</span>
              </button>
            </div>

            {loading && (
              <div className="text-center py-12">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
                <p className="text-slate-400">Loading pages...</p>
              </div>
            )}

            {error && <p className="text-red-500 text-center py-4">{error}</p>}

            {!loading && !error && pages.length === 0 && (
              <p className="text-center text-slate-500 py-12 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No Valentine pages created yet.
              </p>
            )}

            {!loading && !error && pages.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pages.map((page) => (
                  <div key={page.id} className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between hover:border-indigo-200 hover:shadow-md transition-all group">
                    <div>
                      <p className="font-bold text-slate-900">{page.recipient_name}</p>
                      <p className="text-sm text-slate-400 font-mono">/{page.slug}</p>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                      <a
                        href={`/valentine/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Preview"
                      >
                        <Eye size={18} />
                      </a>
                      <button
                        onClick={() => handleEdit(page)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-200 text-center">
            <LayoutDashboard className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Marketplace Management</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              Custom SaaS listings management is coming soon. Currently, you can manage them in the code.
            </p>
            <button disabled className="px-6 py-2 bg-slate-100 text-slate-400 rounded-lg font-bold cursor-not-allowed">
              Add New SaaS Card
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
