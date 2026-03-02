import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, TrendingUp, Sparkles, ArrowRight, RefreshCw, Copy, Check, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Question {
    id: number;
    text: string;
    options: string[];
}

const defaultQuestions: Question[] = [
    { id: 1, text: "What's their favorite comfort food?", options: ["Pizza", "Ice Cream", "Home Cooked Meal", "Fast Food"] },
    { id: 2, text: "Where is their dream vacation destination?", options: ["Beach Resort", "Mountain Cabin", "European City", "Adventure Safari"] },
    { id: 3, text: "What's their primary love language?", options: ["Words of Affirmation", "Acts of Service", "Receiving Gifts", "Quality Time"] },
    { id: 4, text: "How do they prefer to spend a rainy Sunday?", options: ["Watching Movies", "Reading a Book", "Sleeping In", "Playing Games"] },
    { id: 5, text: "Which superpower would they choose?", options: ["Flight", "Invisibility", "Telepathy", "Time Travel"] }
];

export default function CouplesQuizPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState<'start' | 'answering' | 'waiting' | 'results'>('start');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [partnerAnswers, setPartnerAnswers] = useState<Record<number, string> | null>(null);

    const [loading, setLoading] = useState(false);
    const [score, setScore] = useState(0);
    const [quizSlug, setQuizSlug] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (id && id !== 'new') {
            fetchQuizData();
        }
    }, [id]);

    const fetchQuizData = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('couples_quizzes')
                .select('*')
                .eq('slug', id)
                .single();

            if (error) throw error;
            if (data) {
                setPartnerAnswers(data.answers);
                setQuizSlug(data.slug);
            }
        } catch (err) {
            console.error('Error fetching quiz:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStart = () => {
        setStep('answering');
    };

    const handleAnswer = (option: string) => {
        const newAnswers = { ...answers, [defaultQuestions[currentQuestionIndex].id]: option };
        setAnswers(newAnswers);

        if (currentQuestionIndex < defaultQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            if (id && id !== 'new' && partnerAnswers) {
                // Secondary user (Partner B) answering
                calculateResults(newAnswers);
            } else {
                // Primary user (Creator A) finishing
                saveQuiz(newAnswers);
            }
        }
    };

    const saveQuiz = async (finalAnswers: Record<number, string>) => {
        setLoading(true);
        try {
            const slug = Math.random().toString(36).substring(2, 10);
            const { data: userData } = await supabase.auth.getUser();

            const { error } = await supabase.from('couples_quizzes').insert({
                creator_id: userData.user?.id || null,
                slug,
                questions: defaultQuestions,
                answers: finalAnswers
            });

            if (error) throw error;
            setQuizSlug(slug);
            setStep('results');
        } catch (err: any) {
            console.error('Error saving quiz:', err);
            alert(`Failed to save quiz: ${err.message || "Please try again."}`);
        } finally {
            setLoading(false);
        }
    };

    const calculateResults = (finalAnswers: Record<number, string>) => {
        setLoading(true);
        setTimeout(() => {
            let matches = 0;
            defaultQuestions.forEach(q => {
                if (finalAnswers[q.id] === partnerAnswers?.[q.id]) {
                    matches++;
                }
            });
            const finalScore = Math.round((matches / defaultQuestions.length) * 100);
            setScore(finalScore);
            setStep('results');
            setLoading(false);
        }, 1500);
    };

    const shareQuiz = () => {
        const url = `${window.location.origin}/quiz/${quizSlug}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50 flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 backdrop-blur-sm relative">
                {/* Header Decor */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-rose-400 to-indigo-500 opacity-10"></div>

                <div className="p-8 relative">
                    {step === 'start' && (
                        <div className="text-center animate-fade-in">
                            <div className="w-20 h-20 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
                                <Heart className="text-rose-500 w-10 h-10 animate-pulse" />
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Chemistry Test</h1>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                How well do you really know each other? Answer 5 fun questions and see if your hearts beat in sync!
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={handleStart}
                                    className="w-full py-4 bg-gradient-to-r from-rose-500 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
                                >
                                    Start Quiz <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full py-4 bg-white border-2 border-gray-100 text-gray-500 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft size={20} /> Back to Home
                                </button>
                            </div>
                            <p className="mt-6 text-xs text-gray-400 font-medium uppercase tracking-widest">Powered by micro-saas.online</p>
                        </div>
                    )}

                    {step === 'answering' && (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                                    Question {currentQuestionIndex + 1} of {defaultQuestions.length}
                                </span>
                                <div className="flex gap-1">
                                    {defaultQuestions.map((_, i) => (
                                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= currentQuestionIndex ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
                                    ))}
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-tight">
                                {defaultQuestions[currentQuestionIndex].text}
                            </h2>

                            <div className="space-y-4">
                                {defaultQuestions[currentQuestionIndex].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(option)}
                                        className="w-full p-5 text-left bg-gray-50 hover:bg-white border-2 border-transparent hover:border-indigo-400 rounded-2xl font-semibold text-gray-700 transition-all hover:shadow-md flex items-center justify-between group"
                                    >
                                        {option}
                                        <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-indigo-500 flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="py-20 text-center animate-fade-in">
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <RefreshCw className="w-20 h-20 text-indigo-500 animate-spin opacity-20" />
                                <Heart className="absolute inset-0 m-auto text-rose-500 w-8 h-8 animate-bounce" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Calculating Sync...</h3>
                            <p className="text-gray-500 mt-2">Connecting your hearts</p>
                        </div>
                    )}

                    {step === 'results' && !loading && (
                        <div className="text-center animate-fade-in">
                            {partnerAnswers ? (
                                <>
                                    <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="58"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="transparent"
                                                className="text-gray-100"
                                            />
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="58"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="transparent"
                                                strokeDasharray={2 * Math.PI * 58}
                                                strokeDashoffset={2 * Math.PI * 58 * (1 - score / 100)}
                                                className="text-rose-500 transition-all duration-1000 ease-out"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-4xl font-black text-gray-900">{score}%</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Match</span>
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Soulmate Status!</h2>
                                    <p className="text-gray-600 mb-8">
                                        You and your partner are in serious sync. Your scores reveal a deep understanding of each other's worlds.
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                                            <TrendingUp className="text-rose-500 w-6 h-6 mx-auto mb-2" />
                                            <p className="text-[10px] font-bold text-rose-400 uppercase">Growth</p>
                                            <p className="text-sm font-bold text-gray-800">+12% Sync</p>
                                        </div>
                                        <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                                            <Sparkles className="text-indigo-500 w-6 h-6 mx-auto mb-2" />
                                            <p className="text-[10px] font-bold text-indigo-400 uppercase">Status</p>
                                            <p className="text-sm font-bold text-gray-800">Elite Duo</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="py-12">
                                    <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-6 shadow-lg">
                                        <Check className="text-emerald-600 w-10 h-10" />
                                    </div>
                                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Quiz Created!</h2>
                                    <p className="text-gray-600 mb-8 leading-relaxed">
                                        Now share this link with your partner. When they finish, you can open the same link to see your score!
                                    </p>
                                </div>
                            )}

                            <div className="space-y-3">
                                {quizSlug && !partnerAnswers && (
                                    <button
                                        onClick={shareQuiz}
                                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg"
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                        {copied ? "Link Copied!" : "Share Quiz Link"}
                                    </button>
                                )}

                                {partnerAnswers && (
                                    <button
                                        onClick={shareQuiz}
                                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg"
                                    >
                                        {copied ? <Check size={18} /> : <Share2 size={18} />}
                                        {copied ? "Result Link Copied!" : "Share Matching Results"}
                                    </button>
                                )}

                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="w-full py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
