import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    PlusIcon,
    TrashIcon,
    XMarkIcon,
    CheckIcon,
    Bars3Icon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function Builder({ auth, quiz }) {
    const [questions, setQuestions] = useState(quiz.questions.length > 0 ? quiz.questions : [
        { question_text: '', options: [{ option_text: '', is_correct: true }, { option_text: '', is_correct: false }] }
    ]);

    const { post, processing } = useForm({
        questions: questions
    });

    const addQuestion = () => {
        setQuestions([...questions, {
            question_text: '',
            options: [
                { option_text: '', is_correct: true },
                { option_text: '', is_correct: false }
            ]
        }]);
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const updateQuestion = (index, text) => {
        const updated = [...questions];
        updated[index].question_text = text;
        setQuestions(updated);
    };

    const addOption = (qIndex) => {
        const updated = [...questions];
        updated[qIndex].options.push({ option_text: '', is_correct: false });
        setQuestions(updated);
    };

    const removeOption = (qIndex, oIndex) => {
        const updated = [...questions];
        updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== oIndex);
        setQuestions(updated);
    };

    const updateOption = (qIndex, oIndex, text) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex].option_text = text;
        setQuestions(updated);
    };

    const setCorrectOption = (qIndex, oIndex) => {
        const updated = [...questions];
        updated[qIndex].options.forEach((opt, i) => opt.is_correct = i === oIndex);
        setQuestions(updated);
    };

    const saveQuiz = () => {
        post(route('admin.quizzes.questions.sync', quiz.id), {
            data: { questions },
            onSuccess: () => alert('Quiz updated successfully.')
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-900 leading-tight">Quiz Architect: {quiz.title}</h2>}
        >
            <Head title="Quiz Builder" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-10 bg-gray-50 shadow-md p-8 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-purple-600/10 rounded-2xl text-purple-600">
                                <DocumentTextIcon className="w-10 h-10" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 italic">{quiz.title}</h1>
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Designing {questions.length} Assessments</p>
                            </div>
                        </div>
                        <button
                            onClick={saveQuiz}
                            disabled={processing}
                            className="px-10 py-4 bg-purple-600 hover:bg-purple-600/80 text-gray-900 font-black rounded-2xl transition-all shadow-xl shadow-brand-pink/20"
                        >
                            {processing ? 'Saving...' : 'Sync Structure'}
                        </button>
                    </div>

                    <div className="space-y-8">
                        {questions.map((q, qIndex) => (
                            <motion.div
                                key={qIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white  border border-gray-200 rounded-xl p-10 group relative"
                            >
                                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-brand-navy rounded-full flex items-center justify-center font-black text-sm">
                                    {qIndex + 1}
                                </div>

                                <div className="flex justify-between items-start mb-8">
                                    <input
                                        type="text"
                                        value={q.question_text}
                                        onChange={e => updateQuestion(qIndex, e.target.value)}
                                        className="w-full bg-transparent border-none text-2xl font-black text-gray-900 focus:ring-0 placeholder-slate-700"
                                        placeholder="Type your question prompt here..."
                                    />
                                    <button onClick={() => removeQuestion(qIndex)} className="p-3 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-xl transition-all">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {q.options.map((o, oIndex) => (
                                        <div
                                            key={oIndex}
                                            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${o.is_correct ? 'bg-blue-600/10 border-brand-cyan/40' : 'bg-gray-50 border-gray-200 group-hover:border-gray-200'
                                                }`}
                                        >
                                            <button
                                                onClick={() => setCorrectOption(qIndex, oIndex)}
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${o.is_correct ? 'bg-blue-600 border-brand-cyan' : 'border-slate-700'
                                                    }`}
                                            >
                                                {o.is_correct && <CheckIcon className="w-4 h-4 text-brand-navy stroke-[4]" />}
                                            </button>
                                            <input
                                                type="text"
                                                value={o.option_text}
                                                onChange={e => updateOption(qIndex, oIndex, e.target.value)}
                                                className="flex-1 bg-transparent border-none text-gray-900 focus:ring-0 placeholder-slate-800 text-sm"
                                                placeholder={`Option ${oIndex + 1}`}
                                            />
                                            <button onClick={() => removeOption(qIndex, oIndex)} className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <XMarkIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => addOption(qIndex)}
                                        className="p-4 border border-dashed border-gray-200 rounded-2xl text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        Add Option
                                    </button>
                                </div>
                            </motion.div>
                        ))}

                        <button
                            onClick={addQuestion}
                            className="w-full py-10 bg-white/5 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-600/5 transition-all flex flex-col items-center justify-center gap-4"
                        >
                            <PlusIcon className="w-12 h-12" />
                            <span className="font-black uppercase tracking-[0.4em] text-sm">Add New Question</span>
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
