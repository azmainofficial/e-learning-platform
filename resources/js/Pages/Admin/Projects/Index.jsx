import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    RocketLaunchIcon,
    PlusIcon,
    TrashIcon,
    UsersIcon,
    ClipboardDocumentListIcon,
    ArrowRightIcon,
    XMarkIcon,
    CheckIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function Index({ auth, projects, students }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        description: '',
        user_ids: []
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.projects.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            }
        });
    };

    const toggleStudent = (id) => {
        const current = data.user_ids;
        if (current.includes(id)) {
            setData('user_ids', current.filter(uid => uid !== id));
        } else {
            setData('user_ids', [...current, id]);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-lg text-gray-800 italic">Project Architecture</h2>}
        >
            <Head title="Projects" />

            <div className="py-10 bg-gray-50 min-h-[calc(100vh-64px)]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 font-sans italic tracking-tighter">Project Matrix</h1>
                            <p className="text-sm text-gray-500 mt-1">Initialize and monitor team-centric collaborative workspaces.</p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-sm font-bold text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm group"
                        >
                            <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                            Launch Mission
                        </button>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col p-6"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100 shadow-sm">
                                        <RocketLaunchIcon className="w-6 h-6" />
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest italic border ${project.status === 'active'
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            : 'bg-slate-100 text-slate-500 border-slate-200'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 italic tracking-tight">
                                    {project.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-[40px] leading-relaxed">
                                    {project.description || 'Null objective defined for this mission.'}
                                </p>

                                <div className="mt-8 grid grid-cols-2 gap-4 pb-6 border-b border-gray-100">
                                    <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100 shadow-sm">
                                        <div className="text-sm font-bold text-gray-900 italic">{project.tasks_count || 0}</div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Tasks</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100 shadow-sm">
                                        <div className="text-sm font-bold text-gray-900 italic">{project.users_count || 0}</div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Team</div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center gap-2">
                                    <Link
                                        href={route('admin.projects.show', project.id)}
                                        className="flex-1 inline-flex items-center justify-center gap-2 py-2 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-lg border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest italic"
                                    >
                                        <ClipboardDocumentListIcon className="w-4 h-4" />
                                        Board
                                    </Link>
                                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {projects.length === 0 && (
                            <div className="col-span-full py-20 text-center bg-white rounded-xl border-2 border-dashed border-gray-200">
                                <RocketLaunchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-gray-900 font-sans italic tracking-tighter">Mission Null</h3>
                                <p className="text-sm text-gray-500 mt-2">Initialize your first project to orchestrate team operations.</p>
                            </div>
                        )}
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
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="relative bg-white border border-gray-200 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <h2 className="text-xl font-bold text-gray-900 font-sans italic tracking-tighter">Initialize Project Architecture</h2>
                                <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={submit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-2 italic px-1">Mission Identity</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-bold placeholder:font-normal placeholder:text-gray-300 tracking-tight"
                                            placeholder="Enter operational title..."
                                        />
                                        {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 px-1 italic">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-2 italic px-1">Strategic Objective</label>
                                        <textarea
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none min-h-[140px] font-medium leading-relaxed italic"
                                            placeholder="Outline the operational goals..."
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col h-full overflow-hidden">
                                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-3 italic px-1">Orchestration Team</label>
                                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                                        {students.map(student => (
                                            <button
                                                key={student.id}
                                                type="button"
                                                onClick={() => toggleStudent(student.id)}
                                                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${data.user_ids.includes(student.id)
                                                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-200'
                                                    }`}
                                            >
                                                <div className="text-left font-bold text-xs italic tracking-tight">{student.name}</div>
                                                {data.user_ids.includes(student.id) && <CheckIcon className="w-4 h-4 font-bold" />}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="pt-6 space-y-3">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full py-3 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-sm flex items-center justify-center gap-2 group italic tracking-widest uppercase"
                                        >
                                            Initialize Mission
                                            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsCreateModalOpen(false)}
                                            className="w-full text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 text-center font-sans"
                                        >
                                            Abort Operation
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
