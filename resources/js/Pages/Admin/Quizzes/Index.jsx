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
    AcademicCapIcon
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
            header={<h2 className="font-semibold text-xl text-gray-900 leading-tight">Assessment Bank</h2>}
        >
            <Head title="Quizzes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 italic">Quiz Repository</h1>
                            <p className="text-gray-500 mt-2">Create and manage your assessments.</p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-600/80 text-brand-navy font-black rounded-2xl transition-all shadow-xl shadow-brand-cyan/20"
                        >
                            <PlusIcon className="w-6 h-6" />
                            New Assessment
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {quizzes.map((quiz) => (
                            <motion.div
                                key={quiz.id}
                                whileHover={{ y: -8 }}
                                className="bg-white  border border-gray-200 rounded-xl p-8 flex flex-col group transition-all hover:border-blue-300"
                            >
                                <div className="p-4 bg-blue-600/10 rounded-2xl text-blue-600 w-fit mb-6">
                                    <QuestionMarkCircleIcon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">{quiz.title}</h3>
                                <p className="text-gray-500 text-sm mt-3 line-clamp-2">{quiz.description}</p>

                                <div className="mt-8 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <ClockIcon className="w-4 h-4" />
                                        {quiz.time_limit === 0 ? 'No Limit' : `${quiz.time_limit}m`}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AcademicCapIcon className="w-4 h-4" />
                                        {quiz.passing_score}% Pass
                                    </div>
                                    <div className="text-purple-600">{quiz.questions_count} Qs</div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-200 flex gap-4">
                                    <Link
                                        href={route('admin.quizzes.show', quiz.id)}
                                        className="flex-1 py-4 bg-white/5 hover:bg-blue-600 text-gray-900 hover:text-brand-navy font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border border-gray-200 flex items-center justify-center gap-2"
                                    >
                                        <PencilSquareIcon className="w-5 h-5" />
                                        Design
                                    </Link>
                                    <button className="p-4 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-xl transition-all border border-gray-200 text-gray-500">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Create Quiz Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateModalOpen(false)} className="absolute inset-0 bg-black/90 " />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white border border-gray-200 rounded-xl w-full max-w-xl p-12 shadow-md">
                            <h2 className="text-4xl font-black text-gray-900 italic mb-8">Create Quiz</h2>
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Quiz Title</label>
                                    <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:border-brand-cyan transition-all outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Description</label>
                                    <textarea value={data.description} onChange={e => setData('description', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:border-brand-cyan transition-all outline-none min-h-[100px]" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Time Limit (mins)</label>
                                        <input type="number" value={data.time_limit} onChange={e => setData('time_limit', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:border-brand-cyan transition-all outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Passing Score (%)</label>
                                        <input type="number" value={data.passing_score} onChange={e => setData('passing_score', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:border-brand-cyan transition-all outline-none" />
                                    </div>
                                </div>
                                <button type="submit" disabled={processing} className="w-full py-5 bg-blue-600 hover:bg-blue-600/80 text-brand-navy font-black text-lg rounded-[2rem] transition-all shadow-xl mt-4">Initialize Design</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
