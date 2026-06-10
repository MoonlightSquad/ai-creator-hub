'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SubmitAsset() {
    const [formData, setFormData] = useState({ title: '', description: '', category: 'prompts', site_url: '' });
    const [isPremium, setIsPremium] = useState(true);
    const [loading, setLoading] = useState(false);

    // Новий стейт для кастомного алерта
    const [alert, setAlert] = useState({ show: false, title: '', message: '', type: 'success' });

    const showAlert = (title, message, type = 'success') => {
        setAlert({ show: true, title, message, type });
    };

    const closeAlert = () => {
        setAlert({ ...alert, show: false });
        if (alert.type === 'success' && !isPremium) {
            window.location.href = '/';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { data, error } = await supabase
            .from('assets')
            .insert([formData])
            .select()
            .single();

        if (error) {
            showAlert('Submission Failed', error.message, 'error');
            setLoading(false);
            return;
        }

        if (isPremium) {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assetId: data.id, title: data.title }),
            });
            const { url } = await res.json();
            if (url) window.location.href = url;
        } else {
            showAlert(
                'Submission Successful! 🎉',
                'Thank you! Your AI tool has been submitted to the manual moderation queue. Review usually takes up to 7 business days.',
                'success'
            );
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 px-6 py-12 flex items-center justify-center relative overflow-hidden">

            {/* --- КАСТОМНИЙ МОДAL-АЛЕРТ --- */}
            {alert.show && (
                <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="max-w-sm w-full bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-2xl shadow-black/50 text-center transform scale-100 transition-all">
                        <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4 ${
                            alert.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                            {alert.type === 'success' ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            )}
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-100 mb-1">{alert.title}</h3>
                        <p className="text-zinc-400 text-xs leading-relaxed mb-6">{alert.message}</p>
                        <button
                            onClick={closeAlert}
                            className={`w-full py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                                alert.type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                            }`}
                        >
                            Okay, got it
                        </button>
                    </div>
                </div>
            )}
            {/* ----------------------------- */}

            <div className="max-w-md w-full bg-zinc-900/50 border border-zinc-800 p-8 rounded-xl shadow-xl backdrop-blur-md">
                <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Submit your AI Tool / Prompt
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Tool Name</label>
                        <input required type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-200 focus:outline-none focus:border-purple-500 transition-colors"
                               onChange={e => setFormData({...formData, title: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Short Description</label>
                        <textarea required rows={3} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-200 focus:outline-none focus:border-purple-500 transition-colors"
                                  onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Category</label>
                        <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-200 focus:outline-none focus:border-purple-500 transition-colors capitalize"
                                onChange={e => setFormData({...formData, category: e.target.value})}>
                            <option value="prompts">Prompts</option>
                            <option value="video">Video Tools</option>
                            <option value="audio">Audio Tools</option>
                            <option value="images">Images / Art</option>
                            <option value="chatbots">Chatbots</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Website URL</label>
                        <input required type="url" placeholder="https://" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-200 focus:outline-none focus:border-purple-500 transition-colors"
                               onChange={e => setFormData({...formData, site_url: e.target.value})} />
                    </div>

                    <div className="pt-4 border-t border-zinc-800/60 space-y-2">
                        <label className="block text-xs font-medium text-zinc-400 mb-2">Choose Pricing Option</label>
                        <div onClick={() => setIsPremium(true)} className={`p-3 rounded-lg border cursor-pointer transition-all ${isPremium ? 'border-purple-500 bg-purple-500/5' : 'border-zinc-800 bg-zinc-950/40'}`}>
                            <div className="flex justify-between items-center"><span className="text-sm font-semibold">🌟 Premium Listing</span><span className="text-purple-400 font-bold text-sm">$49</span></div>
                            <p className="text-[11px] text-zinc-400 mt-0.5">Instant launch, pin to top, highlighted design for 30 days.</p>
                        </div>
                        <div onClick={() => setIsPremium(false)} className={`p-3 rounded-lg border cursor-pointer transition-all ${!isPremium ? 'border-zinc-500 bg-zinc-800/10' : 'border-zinc-800 bg-zinc-950/40'}`}>
                            <div className="flex justify-between items-center"><span className="text-sm font-medium text-zinc-300">🐌 Free Submission</span><span className="text-zinc-500 text-sm">Free</span></div>
                            <p className="text-[11px] text-zinc-500 mt-0.5">Manual moderation queue. Takes up to 7 business days.</p>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium p-2.5 rounded-lg text-sm transition-all shadow-md mt-4 disabled:opacity-50">
                        {loading ? 'Processing...' : isPremium ? 'Proceed to Payment ($49)' : 'Submit for Review'}
                    </button>
                </form>
            </div>
        </div>
    );
}