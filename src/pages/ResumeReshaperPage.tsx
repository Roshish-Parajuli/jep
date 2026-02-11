import React, { useState } from 'react';
import { FileText, Sparkles, Loader2, Copy, Check, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';

const ResumeReshaperPage: React.FC = () => {
    const [resume, setResume] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleReshape = async () => {
        const rawApiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const apiKey = rawApiKey?.trim();

        if (!apiKey) {
            setError('Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.');
            return;
        }

        if (!resume.trim() || !jobDescription.trim()) {
            setError('Please provide both your current resume and the job description.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(''); // Clear previous results

        try {
            const genAI = new GoogleGenerativeAI(apiKey);

            const modelsToTry = [
                "gemini-1.5-flash",
                "gemini-1.5-flash-latest",
                "gemini-1.5-pro",
                "gemini-1.5-pro-latest",
                "gemini-pro"
            ];

            let lastError = null;
            let finalResult = null;
            const failedModels: string[] = [];

            const prompt = `
                Act as a professional resume writer and career coach. 
                I am going to provide you with my current resume content and a job description for a role I am applying for.
                
                Your task is to reshape and optimize the resume to highlight the most relevant skills, experiences, and keywords found in the job description.
                
                Guidelines:
                1. Keep the professional tone.
                2. Use strong action verbs.
                3. Quantify achievements where possible based on the provided text.
                4. Focus on the MUST-HAVE skills from the job description.
                5. Output the reshaped resume in a clean, professional markdown format that is ready to be copied.
                
                ---
                CURRENT RESUME:
                ${resume}
                
                ---
                JOB DESCRIPTION:
                ${jobDescription}
                ---
            `;

            for (const modelName of modelsToTry) {
                try {
                    console.log(`Starting generation with model: ${modelName}`);
                    const model = genAI.getGenerativeModel({ model: modelName });
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    const text = response.text();

                    if (text) {
                        console.log(`Successfully generated content using ${modelName}`);
                        finalResult = text;
                        break;
                    }
                } catch (err: any) {
                    console.warn(`Model ${modelName} failed:`, err.message);
                    failedModels.push(modelName);
                    lastError = err;

                    // If it's a critical auth/permission error, stop trying other models
                    if (err.message?.includes('403') || err.message?.includes('401') || err.message?.includes('API_KEY_INVALID')) {
                        break;
                    }
                    // Otherwise (like 404 or 429), try the next model
                    continue;
                }
            }

            if (finalResult) {
                setResult(finalResult);
            } else if (lastError) {
                // If we attempted models but all failed, throw the last error to be handled by the outer catch
                throw lastError;
            } else {
                throw new Error('No compatible Gemini model was found for your API key.');
            }
        } catch (err: any) {
            console.error('Final Gemini API Error:', err);

            let userMessage = 'Failed to generate reshaped resume. ';

            if (err.message?.includes('404')) {
                userMessage += `None of the attempted models were found/supported for this API key. Please ensure your project has the 'Generative Language API' enabled in Google AI Studio.`;
            } else if (err.message?.includes('429')) {
                userMessage += 'Too many requests (Rate limit reached). Please wait a minute and try again.';
            } else if (err.message?.includes('403') || err.message?.includes('401')) {
                userMessage += 'Authentication failed. Please check if your API key is correct and assigned to a project with Gemini access.';
            } else if (err.message?.includes('SAFETY')) {
                userMessage += 'Content flagged by safety filters. Please use professional language.';
            } else {
                userMessage += err.message || 'An unexpected error occurred.';
            }

            setError(userMessage);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        if (result) {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <ArrowLeft size={20} className="text-slate-600" />
                        <span className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Back to Marketplace</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="text-white" size={18} />
                        </div>
                        <span className="text-lg font-bold text-slate-900">Resume Reshaper AI</span>
                    </div>
                    <div className="w-20"></div> {/* Spacer */}
                </div>
            </nav>

            <main className="pt-28 pb-20 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                            Reshape Your Resume with <span className="text-emerald-600">AI</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Paste your current resume and the target job description. Our AI will optimize your profile to stand out to recruiters.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* Input Side */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <FileText size={18} className="text-emerald-500" />
                                    Your Current Resume
                                </label>
                                <textarea
                                    value={resume}
                                    onChange={(e) => setResume(e.target.value)}
                                    placeholder="Paste your current resume content here..."
                                    className="w-full h-64 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-sm"
                                />
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <Sparkles size={18} className="text-indigo-500" />
                                    Job Description
                                </label>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the target job description here..."
                                    className="w-full h-64 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                                />
                            </div>

                            <button
                                onClick={handleReshape}
                                disabled={loading}
                                className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Processing with AI...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw size={20} />
                                        Reshape Resume
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Result Side */}
                        <div className="h-full">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <Check size={18} className="text-emerald-500" />
                                        Optimized Result
                                    </label>
                                    {result && (
                                        <button
                                            onClick={copyToClipboard}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-100 transition-colors"
                                        >
                                            {copied ? <Check size={14} /> : <Copy size={14} />}
                                            {copied ? 'Copied!' : 'Copy to Clipboard'}
                                        </button>
                                    )}
                                </div>

                                <div className="flex-grow bg-slate-50 rounded-xl p-6 overflow-auto border border-slate-100 min-h-[500px]">
                                    {result ? (
                                        <div className="prose prose-slate max-w-none text-sm whitespace-pre-wrap">
                                            {result}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center px-8">
                                            <Sparkles size={48} className="mb-4 opacity-20" />
                                            <p>Your optimized resume will appear here after processing.</p>
                                        </div>
                                    )}
                                </div>

                                {error && (
                                    <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm">
                                        <strong>Error:</strong> {error}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-8 border-t border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
                    © 2026 Micro-SaaS Marketplace. Build your career with AI.
                </div>
            </footer>
        </div>
    );
};

export default ResumeReshaperPage;
