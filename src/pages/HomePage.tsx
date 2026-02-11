import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, FileText, PlusCircle, ExternalLink, Mail, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const saasProducts = [
    {
      title: "Valentine Digital Gift",
      description: "Create personalized, interactive digital gift experiences for your loved ones with photos, music, and secret messages.",
      icon: <Heart className="text-rose-500" size={32} />,
      link: "/valentine/z90ab6s6",
      color: "from-rose-500 to-pink-500",
      tag: "Popular"
    },
    {
      title: "PDF to Text Converter",
      description: "Quickly convert complex PDF documents into clean, editable text files using our advanced parsing engine.",
      icon: <FileText className="text-blue-500" size={32} />,
      link: "/pdf-to-text",
      color: "from-blue-500 to-indigo-500",
      tag: "Free Tool"
    },
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
            <a href="mailto:admin@micro-saas.online?subject=Submit my SaaS" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg">
              Submit SaaS
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 via-slate-800 to-slate-600">
            The Hub for <span className="text-indigo-600">Micro-SaaS</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover a curated marketplace of lightweight, powerful SaaS solutions designed to solve specific problems effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#marketplace" className="px-8 py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center gap-2">
              Explore Products <ArrowRight size={20} />
            </a>
            <a href="mailto:admin@micro-saas.online?subject=Partnership Inquiry" className="px-8 py-4 rounded-xl bg-white text-slate-900 border border-slate-200 font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
              Contact Support <Mail size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="marketplace" className="py-20 bg-white">
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
                href="mailto:admin@micro-saas.online?subject=Submit my SaaS"
                className="text-indigo-600 font-bold hover:underline underline-offset-4"
              >
                Submit your project
              </a>
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
    </div>
  );
};

export default HomePage;

