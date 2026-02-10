import { useState, useEffect } from 'react';
import { Loader2, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/admin-dashboard';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        navigate(from, { replace: true });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        navigate(from, { replace: true });
      } else {
        sessionStorage.removeItem('isAdminAuthenticated');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // On successful login, the auth state change listener will handle navigation
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-red-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
        <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4" fill="currentColor" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Access</h1>
        <p className="text-gray-500 mb-6">Sign in to manage Valentine pages and other SaaS products.</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent mb-4"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent mb-4"
            required
          />
          {authError && <p className="text-red-500 text-sm mb-4">{authError}</p>}
          <button
            type="submit"
            disabled={authLoading}
            className="w-full px-6 py-3 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 transition-colors flex items-center justify-center space-x-2"
          >
            {authLoading ? <Loader2 className="animate-spin" size={20} /> : null}
            <span>Sign In</span>
          </button>
        </form>
      </div>
    </div>
  );
}

