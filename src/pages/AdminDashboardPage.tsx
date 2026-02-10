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
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-red-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-rose-600">Admin Dashboard</h1>
          <div className="flex space-x-4">
             <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-600 rounded-lg shadow hover:shadow-md transition-all"
            >
              <Home size={18} />
              <span>Home</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-rose-600 rounded-lg shadow hover:shadow-md transition-all"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Valentine Digital Gift Pages</h2>
            <button
              onClick={handleCreateNewValentine}
              className="flex items-center space-x-2 px-4 py-2 bg-rose-500 text-white rounded-lg shadow hover:bg-rose-600 transition-all"
            >
              <Plus size={20} />
              <span>Create New Valentine</span>
            </button>
          </div>

          {loading && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-rose-500 animate-spin mx-auto" />
              <p className="text-rose-500 mt-2">Loading Valentine pages...</p>
            </div>
          )}

          {error && <p className="text-red-500 text-center py-4">{error}</p>}

          {!loading && !error && pages.length === 0 && (
            <p className="text-center text-gray-500 py-8">No Valentine pages created yet. Click "Create New Valentine" to get started!</p>
          )}

          {!loading && !error && pages.length > 0 && (
            <div className="space-y-4">
              {pages.map((page) => (
                <div key={page.id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-center">
                  <div className="text-center sm:text-left mb-2 sm:mb-0">
                    <p className="font-semibold text-lg text-gray-800">{page.recipient_name}</p>
                    <p className="text-sm text-gray-500">/{page.slug}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={`/valentine/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Preview Page"
                    >
                      <Eye size={20} />
                    </a>
                    <button
                      onClick={() => handleEdit(page)}
                      className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
                      title="Edit Page"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(page.id)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      title="Delete Page"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
