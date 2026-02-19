import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, FileText, PlusCircle, ExternalLink, Mail, ArrowRight, Layout } from 'lucide-react';
import { supabase } from '../lib/supabase';

const FloatingParticles: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-indigo-500/10 rounded-full animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDuration: `${10 + Math.random() * 20}s`,
          animationDelay: `-${Math.random() * 20}s`,
        }}
      />
    ))}
  </div>
);

const HomePage: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    document.title = "Micro-SaaS Hub | Innovative Tools & Solutions";

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const saasProducts = [
    {
      title: "Digital Gift Experience",
      description: "Create personalized, interactive digital gift experiences for your loved ones with photos, music, and secret messages. A gift that stays forever.",
      icon: <Heart className="text-rose-500" size={32} />,
      link: "/gifts", // Updated to point to new landing page
      color: "from-rose-500 to-pink-500",
      tag: "Popular"
    },
    {
      title: "Resume Reshaper",
      description: "Generate an updated resume to match the job description, just paste the job description and your resume and we will generate a resume that matches the job description.",
      icon: <FileText className="text-emerald-500" size={32} />,
      link: "/resume-reshaper",
      color: "from-emerald-500 to-teal-500",
      tag: "AI Tool"
    },
    {
      title: "Premium Resume Builder",
      description: "Create a professional, high-impact resume in minutes with our interactive builder. Real-time preview and instant download.",
      icon: <FileText className="text-indigo-500" size={32} />,
      link: "/resume-builder",
      color: "from-indigo-500 to-violet-500",
      tag: "Essential"
    },
    /*
    {
      title: "PDF to Text Converter",
      description: "Quickly convert complex PDF documents into clean, editable text files using our advanced parsing engine.",
      icon: <FileText className="text-blue-500" size={32} />,
      link: "/pdf-to-text",
      color: "from-blue-500 to-indigo-500",
      tag: "Free Tool"
    },
    {
      title: "Daily Affirmation AI",
      description: "Receive personalized, AI-generated daily motivation and affirmations tailored to your goals and mood.",
      icon: <Sparkles className="text-amber-500" size={32} />,
      link: "/coming-soon",
      color: "from-amber-500 to-orange-500",
      tag: "New"
    },
    {
      title: "Snippet Secure",
      description: "An ultra-private, encrypted vault for your code snippets and sensitive configuration files. Zero-knowledge storage.",
      icon: <Lock className="text-slate-700" size={32} />,
      link: "/coming-soon",
      color: "from-slate-700 to-slate-900",
      tag: "Secure"
    },
    {
      title: "Mood Tracker for Pairs",
      description: "A private space for couples to track their emotional health together with AI-driven relationship insights.",
      icon: <Smile className="text-pink-400" size={32} />,
      link: "/coming-soon",
      color: "from-pink-400 to-rose-400",
      tag: "Relationship"
    },
    {
      title: "SEO Audit Pro",
      description: "One-click SEO health checks for your micro-apps. Get actionable insights to rank higher in search results.",
      icon: <Search className="text-blue-600" size={32} />,
      link: "/coming-soon",
      color: "from-blue-600 to-cyan-600",
      tag: "Utilities"
    },
    {
      title: "Mini-SaaS Boilerplate",
      description: "A complete, production-ready starter kit to launch your own Micro-SaaS in minutes. Frontend + Backend.",
      icon: <Code className="text-violet-600" size={32} />,
      link: "/coming-soon",
      color: "from-violet-600 to-purple-600",
      tag: "Builder Tool"
    },
    {
      title: "Dream Journal AI",
      description: "Record your dreams and get AI-powered psychological insights and pattern analysis. Discover your subconscious.",
      icon: <Moon className="text-indigo-400" size={32} />,
      link: "/coming-soon",
      color: "from-indigo-400 to-purple-500",
      tag: "Personal"
    },
    {
      title: "Subscription Tracker",
      description: "Manage all your digital subscriptions in one place. Get alerts before renewals and save money effortlessly.",
      icon: <CreditCard className="text-emerald-400" size={32} />,
      link: "/coming-soon",
      color: "from-emerald-400 to-green-500",
      tag: "Finance"
    },
    {
      title: "Focus Flow",
      description: "A minimalist, AI-enhanced Pomodoro timer designed for deep work. Syncs with your productivity goals.",
      icon: <Clock className="text-orange-400" size={32} />,
      link: "/coming-soon",
      color: "from-orange-400 to-red-400",
      tag: "Productivity"
    },
    {
      title: "Secure Privacy Vault",
      description: "Generate highly secure, encrypted links to share sensitive information or documents that only exist for those with the link.",
      icon: <PlusCircle className="text-emerald-500" size={32} />,
      link: "/coming-soon",
      color: "from-emerald-500 to-teal-500",
      tag: "Coming Soon"
    }
    */
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
              <PlusCircle className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              micro-saas.online
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#marketplace" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Marketplace</a>
            {user ? (
              <Link to="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg">
                <Layout size={16} /> Dashboard
              </Link>
            ) : (
              <a href="mailto:contact@micro-saas.online?subject=Submit my SaaS" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg">
                Submit SaaS
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <FloatingParticles />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 via-slate-800 to-slate-600">
            The Hub for <span className="text-indigo-600">Secure Micro-SaaS</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover a curated marketplace of lightweight, powerful SaaS solutions. From productivity boosters to specialized AI tools, we build software that solves real problems.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link to="/dashboard" className="px-8 py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center gap-2">
                Go to Dashboard <ArrowRight size={20} />
              </Link>
            ) : (
              <a href="#marketplace" className="px-8 py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center gap-2">
                Explore Products <ArrowRight size={20} />
              </a>
            )}
            <a href="mailto:contact@micro-saas.online?subject=Contact Us" className="px-8 py-4 rounded-xl bg-white text-slate-900 border border-slate-200 font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
              Contact Support <Mail size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="marketplace" className="py-20 bg-white relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Featured Solutions</h2>
              <p className="text-slate-500 mt-2">The latest and most innovative tools on our platform.</p>
            </div>
            <Link to="/coming-soon" className="text-indigo-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all products <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {saasProducts.map((product, idx) => (
              <div key={idx} className="group relative bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-2xl hover:border-indigo-100 transition-all duration-300 flex flex-col h-full">
                <div className="mb-6 flex justify-between items-start">
                  <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-white group-hover:shadow-inner transition-all">
                    {product.icon}
                  </div>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">
                    {product.tag}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{product.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
                  {product.description}
                </p>
                <Link
                  to={product.link}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-50 text-slate-900 font-bold group-hover:bg-slate-900 group-hover:text-white transition-all w-full"
                >
                  Explore Tool <ExternalLink size={18} />
                </Link>
              </div>
            ))}

            {/* Submit Card */}
            <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center group hover:border-indigo-400 transition-colors">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-50 transition-colors">
                <PlusCircle className="text-slate-400 group-hover:text-indigo-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Build a SaaS?</h3>
              <p className="text-slate-500 mb-6">List your micro-SaaS here and reach thousands of users.</p>
              <a
                href="mailto:contact@micro-saas.online?subject=Submit my SaaS"
                className="text-indigo-600 font-bold hover:underline underline-offset-4"
              >
                Submit your project
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pitch Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <ExternalLink size={24} />
              </div>
              <h3 className="text-2xl font-bold">Lifelong Availability</h3>
              <p className="text-slate-400">Our products and tools are built to stay. Your data and creations aren't going anywhere—they are here for life.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={24} />
              </div>
              <h3 className="text-2xl font-bold">Privacy First</h3>
              <p className="text-slate-400">We create secure, obfuscated links. Only those you share the URL with can ever know the page exists. No public indices.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText size={24} />
              </div>
              <h3 className="text-2xl font-bold">Simple & Focused</h3>
              <p className="text-slate-400">No bloat. No complex setups. Just simple SaaS tools that solve one thing perfectly and stay accessible forever.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-slate-500 text-sm">
            © 2026 micro-saas.online. All rights reserved.
          </div>
          <div className="flex items-center gap-8">
            <Link to="/admin" className="text-slate-400 hover:text-slate-900 text-sm font-medium transition-colors">Admin Portal</Link>
            <Link to="/coming-soon" className="text-slate-400 hover:text-slate-900 text-sm font-medium transition-colors">Documentation</Link>
          </div>
        </div>
      </footer>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-30px) translateX(20px); }
          50% { transform: translateY(-60px) translateX(-20px); }
          75% { transform: translateY(-30px) translateX(10px); }
        }
        .animate-float {
          animation: float 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;

