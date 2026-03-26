import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    QuestionMarkCircleIcon,
    PlusIcon,
    TrashIcon,
    PencilSquareIcon,
    ClockIcon,
    AcademicCapIcon,
    MagnifyingGlassIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function Index({ auth, quizzes }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        title: '',
        description: '',
        time_limit: 0,
        passing_score: 80
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.quizzes.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-lg text-gray-800">Assessment Bank</h2>}
        >
            <Head title="Quizzes" />

            <div className="py-10 bg-gray-50 min-h-[calc(100vh-64px)]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quiz Repository</h1>
                            <p className="text-sm text-gray-500 mt-1">Manage institutional assessments and certification standards.</p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-sm font-bold text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
                        >
                            <PlusIcon className="w-4 h-4" />
                            New Assessment
                        </button>
                    </div>

                    {/* Quizzes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quizzes.map((quiz) => (
                            <div
                                key={quiz.id}
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all group p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100">
                                        <QuestionMarkCircleIcon className="w-6 h-6" />
                                    </div>
                                    <div className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                                        {quiz.questions_count || 0} Questions
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                    {quiz.title}
                                </h3>
                                <p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-[40px] leading-relaxed">
                                    {quiz.description || 'No description provided for this assessment.'}
                                </p>

                                <div className="mt-6 grid grid-cols-2 gap-3 pb-6 border-b border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <ClockIcon className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-tight italic">
                                            {quiz.time_limit === 0 ? 'No Limit' : `${quiz.time_limit}m`}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <AcademicCapIcon className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-tight italic">
                                            {quiz.passing_score}% Pass
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center gap-2">
                                    <Link
                                        href={route('admin.quizzes.show', quiz.id)}
                                        className="flex-1 inline-flex items-center justify-center gap-2 py-2 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 uppercase tracking-widest"
                                    >
                                        <PencilSquareIcon className="w-4 h-4" />
                                        Design
                                    </Link>
                                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-white border border-gray-200 rounded-xl w-full max-w-md shadow-2xl overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <h2 className="text-lg font-bold text-gray-900 font-sans italic">Create Assessment</h2>
                                <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={submit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 italic">Quiz Title</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 italic">Purpose/Description</label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none min-h-[80px]"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 italic">Time Limit (mins)</label>
                                        <input
                                            type="number"
                                            value={data.time_limit}
                                            onChange={e => setData('time_limit', e.target.value)}
                                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 italic">Passing Score (%)</label>
                                        <input
                                            type="number"
                                            value={data.passing_score}
                                            onChange={e => setData('passing_score', e.target.value)}
                                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 space-y-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-2.5 bg-indigo-600 text-sm font-bold text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
                                    >
                                        Initialize Design
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="w-full text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 text-center"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
