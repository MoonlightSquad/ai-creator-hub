'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const CATEGORIES = ['All', 'prompts', 'video', 'audio', 'images', 'chatbots'];

export default function Home() {
  const [assets, setAssets] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssets() {
      setLoading(true);
      let query = supabase
          .from('assets')
          .select('*')
          .eq('is_approved', true)
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false });

      const { data, error } = await query;
      if (!error) setAssets(data);
      setLoading(false);
    }
    fetchAssets();
  }, []); // <-- Ось тут тепер усе чітко

  const filteredAssets = activeCategory === 'All'
      ? assets
      : assets.filter(asset => asset.category.toLowerCase() === activeCategory.toLowerCase());

  return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans px-6 py-12">
        <header className="max-w-5xl mx-auto flex justify-between items-center mb-16">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              AI Creator Hub
            </h1>
            <p className="text-zinc-400 mt-2 text-sm">The ultimate directory for AI-powered creators.</p>
          </div>
          <a href="/submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-500/20">
            Submit Tool (+$49)
          </a>
        </header>

        <main className="max-w-5xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize border transition-all ${
                        activeCategory === cat
                            ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                >
                  {cat}
                </button>
            ))}
          </div>

          {loading ? (
              <div className="text-center py-20 text-zinc-500 text-sm">Loading tools...</div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssets.map((asset) => (
                    <div
                        key={asset.id}
                        className={`p-6 rounded-xl bg-zinc-900/50 border relative transition-all duration-300 hover:-translate-y-1 ${
                            asset.is_featured
                                ? 'border-purple-500/50 shadow-md shadow-purple-500/5 bg-gradient-to-b from-purple-950/20 to-zinc-900/50'
                                : 'border-zinc-800/80 hover:border-zinc-700'
                        }`}
                    >
                      {asset.is_featured && (
                          <span className="absolute top-3 right-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                    Featured
                  </span>
                      )}
                      <span className="text-[10px] uppercase font-semibold text-purple-400 tracking-wider">
                  {asset.category}
                </span>
                      <h3 className="text-lg font-semibold mt-1 mb-2 text-zinc-100">{asset.title}</h3>
                      <p className="text-zinc-400 text-xs line-clamp-3 mb-6 leading-relaxed">{asset.description}</p>
                      <a
                          href={asset.site_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-medium text-zinc-300 hover:text-white group"
                      >
                        Visit Website
                        <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
                      </a>
                    </div>
                ))}
              </div>
          )}
        </main>
      </div>
  );
}