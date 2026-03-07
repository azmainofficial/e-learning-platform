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
    CheckIcon
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
            header={<h2 className="font-semibold text-xl text-gray-900 leading-tight">Project Hub</h2>}
        >
            <Head title="Projects" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 italic">Project Matrix</h1>
                            <p className="text-gray-500 mt-2 text-lg">Manage team collaboration and mission-critical tasks.</p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="group flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-600/80 text-brand-navy font-black rounded-2xl transition-all shadow-sm transform hover:-translate-y-1"
                        >
                            <PlusIcon className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                            Launch Project
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <motion.div
                                key={project.id}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="bg-white  border border-gray-200 rounded-xl p-8 group hover:border-blue-300 transition-all flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 bg-blue-600/10 rounded-2xl text-blue-600">
                                        <RocketLaunchIcon className="w-8 h-8" />
                                    </div>
                                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${project.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-500'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{project.name}</h3>
                                <p className="text-gray-500 text-sm mt-3 line-clamp-2 h-10">{project.description || 'No focus defined.'}</p>

                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 rounded-2xl p-4 text-center">
                                        <div className="text-2xl font-black text-gray-900">{project.tasks_count}</div>
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tasks</div>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-4 text-center">
                                        <div className="text-2xl font-black text-gray-900">{project.users_count}</div>
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Team</div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-200 flex gap-4">
                                    <Link
                                        href={route('admin.projects.show', project.id)}
                                        className="flex-1 py-4 bg-white/5 hover:bg-blue-600 text-gray-900 hover:text-brand-navy font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border border-gray-200 hover:border-blue-300 flex items-center justify-center gap-2"
                                    >
                                        <ClipboardDocumentListIcon className="w-5 h-5" />
                                        Board
                                    </Link>
                                    <button className="px-4 py-4 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-xl transition-all border border-gray-200 text-gray-500">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}

                        {projects.length === 0 && (
                            <div className="col-span-full py-20 text-center bg-white/5 rounded-xl border border-dashed border-gray-200">
                                <RocketLaunchIcon className="w-20 h-20 text-gray-700 mx-auto mb-6" />
                                <h2 className="text-2xl font-bold text-gray-900 italic">Zero Projects Launched</h2>
                                <p className="text-gray-500 mt-2">Deploy your first project to start tracking team productivity.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Project Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute inset-0 bg-black/95 "
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="relative bg-white border border-gray-200 rounded-xl w-full max-w-4xl p-16 shadow-sm overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <h2 className="text-5xl font-black text-gray-900 italic mb-4">Launch New Project</h2>
                                    <p className="text-gray-500 text-lg">Initialize a collaborative workspace for your team.</p>
                                </div>
                                <button onClick={() => setIsCreateModalOpen(false)} className="p-4 bg-white/5 hover:bg-purple-600/20 hover:text-purple-600 rounded-full transition-all">
                                    <XMarkIcon className="w-8 h-8" />
                                </button>
                            </div>

                            <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 text-center lg:text-left">Project Identity</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-[2rem] px-8 py-6 text-gray-900 text-xl focus:border-brand-cyan transition-all outline-none"
                                            placeholder="Enter project name..."
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-2">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 text-center lg:text-left">Strategic Vision</label>
                                        <textarea
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-[2rem] px-8 py-6 text-gray-900 focus:border-brand-cyan transition-all outline-none min-h-[180px]"
                                            placeholder="Describe the project objective..."
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col h-full">
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 text-center lg:text-left">Assign Operations Team</label>
                                    <div className="flex-1 overflow-y-auto space-y-3 pr-4 max-h-[350px] scrollbar-brand">
                                        {students.map(student => (
                                            <button
                                                key={student.id}
                                                type="button"
                                                onClick={() => toggleStudent(student.id)}
                                                className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] border transition-all ${data.user_ids.includes(student.id)
                                                        ? 'bg-blue-600 border-brand-cyan text-brand-navy shadow-lg'
                                                        : 'bg-white/5 border-gray-200 text-gray-900 hover:border-gray-2000'
                                                    }`}
                                            >
                                                <div className="text-left font-black tracking-tight">{student.name}</div>
                                                {data.user_ids.includes(student.id) && <CheckIcon className="w-5 h-5 stroke-[4]" />}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="mt-8 w-full py-6 bg-blue-600 hover:bg-blue-600/80 text-brand-navy font-black text-xl rounded-xl transition-all shadow-sm flex items-center justify-center gap-4 group"
                                    >
                                        Initialize Mission
                                        <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
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
