import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    ClockIcon,
    AcademicCapIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function Show({ auth, quiz, content, latestAttempt }) {
    const [gameState, setGameState] = useState('intro'); // intro, taking, result
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(quiz.time_limit * 60);

    const { post, processing } = useForm({
        answers: {}
    });

    useEffect(() => {
        let timer;
        if (gameState === 'taking' && quiz.time_limit > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        submitQuiz();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState]);

    const startQuiz = () => {
        post(route('student.quizzes.attempt.start', quiz.id), {
            onSuccess: (page) => {
                setGameState('taking');
                // The attempt_id should ideally be passed back but for now we'll rely on the redirect or state
            }
        });
    };

    const submitQuiz = () => {
        // We need the attempt ID. In a real scenario, we'd get it from the successful startAttempt call session.
        // For simplicity here, let's assume we handle submission through the startAttempt logic or a specialized route.
        // I created student.quizzes.attempt.submit(attempt).
        // Let's grab the attempt from the props or flash if it was just created.

        // Since startAttempt redirects back, we check the session flash via page props (if available) 
        // OR we just find the latest in-progress attempt for this quiz/user.
        // For now, I'll use a hacky latest attempt check on server-side submitAttempt.

        post(route('student.quizzes.attempt.submit', [latestAttempt?.id || 0, content.id]), {
            data: { answers },
            onSuccess: () => setGameState('result')
        });
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-900 leading-tight">Assessment Desk</h2>}
        >
            <Head title={`Quiz: ${quiz.title}`} />

            <div className="py-12 min-h-[calc(100vh-80px)] flex items-center justify-center">
                <div className="max-w-4xl w-full mx-auto px-4">

                    {gameState === 'intro' && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-md overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-cyan via-brand-pink to-brand-orange"></div>
                            <div className="p-6 bg-blue-600/10 rounded-[2rem] text-blue-600 w-fit mx-auto mb-8">
                                <AcademicCapIcon className="w-16 h-16" />
                            </div>
                            <h1 className="text-5xl font-black text-gray-900 italic mb-4">{quiz.title}</h1>
                            <p className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto">{quiz.description || "Testing your mastery of the subject matter."}</p>

                            <div className="grid grid-cols-2 gap-6 mb-12 max-w-lg mx-auto">
                                <div className="bg-white/5 p-6 rounded-[2rem] border border-gray-200">
                                    <div className="text-purple-600 font-black text-3xl">{quiz.questions.length}</div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Questions</div>
                                </div>
                                <div className="bg-white/5 p-6 rounded-[2rem] border border-gray-200">
                                    <div className="text-blue-600 font-black text-3xl">{quiz.time_limit === 0 ? '∞' : quiz.time_limit + 'm'}</div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Time Allotted</div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-6">
                                <button
                                    onClick={startQuiz}
                                    disabled={processing}
                                    className="px-16 py-6 bg-blue-600 hover:bg-blue-600/80 text-brand-navy font-black text-xl rounded-xl transition-all shadow-sm flex items-center gap-4 group"
                                >
                                    Engage Mission
                                    <ChevronRightIcon className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </button>

                                {latestAttempt && (
                                    <p className={`text-sm font-bold uppercase tracking-widest ${latestAttempt.score >= quiz.passing_score ? 'text-green-400' : 'text-purple-600'}`}>
                                        Latest Score: {latestAttempt.score}% ({latestAttempt.score >= quiz.passing_score ? 'PASSED' : 'FAILED'})
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {gameState === 'taking' && currentQuestion && (
                        <div className="space-y-8">
                            <div className="bg-gray-50 border border-gray-200 rounded-[2rem] p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="p-3 bg-purple-600/10 rounded-xl text-purple-600 font-black">
                                        Q{currentQuestionIndex + 1}/{quiz.questions.length}
                                    </span>
                                </div>
                                {quiz.time_limit > 0 && (
                                    <div className={`flex items-center gap-4 px-6 py-3 rounded-xl border text-xl font-bold ${timeLeft < 60 ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' : 'bg-white/5 border-gray-200 text-gray-900'}`}>
                                        <ClockIcon className="w-6 h-6" />
                                        {formatTime(timeLeft)}
                                    </div>
                                )}
                            </div>

                            <motion.div
                                key={currentQuestionIndex}
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="bg-white border border-gray-200 rounded-xl p-12 shadow-md"
                            >
                                <h2 className="text-3xl font-black text-gray-900 mb-10 leading-tight italic">{currentQuestion.question_text}</h2>

                                <div className="space-y-4">
                                    {currentQuestion.options.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => setAnswers({ ...answers, [currentQuestion.id]: option.id })}
                                            className={`w-full flex items-center justify-between p-6 rounded-[1.5rem] border-2 transition-all text-left ${answers[currentQuestion.id] === option.id
                                                ? 'bg-blue-600/20 border-brand-cyan text-gray-900 shadow-lg'
                                                : 'bg-white/5 border-gray-200 text-gray-500 hover:border-gray-2000'
                                                }`}
                                        >
                                            <span className="font-bold text-lg">{option.option_text}</span>
                                            {answers[currentQuestion.id] === option.id && <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center"><CheckCircleIcon className="w-4 h-4 text-brand-navy stroke-[4]" /></div>}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-12 flex justify-between items-center">
                                    <button
                                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                        disabled={currentQuestionIndex === 0}
                                        className="p-4 rounded-xl bg-white/5 text-gray-500 hover:text-gray-900 disabled:opacity-30"
                                    >
                                        <ChevronLeftIcon className="w-8 h-8" />
                                    </button>

                                    {currentQuestionIndex === quiz.questions.length - 1 ? (
                                        <button
                                            onClick={submitQuiz}
                                            disabled={processing}
                                            className="px-12 py-4 bg-purple-600 text-gray-900 font-black rounded-2xl shadow-xl shadow-brand-pink/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                        >
                                            Submit Final Response
                                            <CheckCircleIcon className="w-6 h-6" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                            className="px-10 py-4 bg-white/5 hover:bg-white/10 text-gray-900 font-black rounded-2xl border border-gray-200 flex items-center gap-2"
                                        >
                                            Next Question
                                            <ChevronRightIcon className="w-6 h-6" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
