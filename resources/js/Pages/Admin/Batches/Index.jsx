import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    UserGroupIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    UserPlusIcon,
    XMarkIcon,
    CheckIcon
} from '@heroicons/react/24/outline';

export default function Index({ auth, batches, students }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);

    const { data: createData, setData: setCreateData, post: postBatch, reset: resetCreate } = useForm({
        name: '',
        description: ''
    });

    const { data: assignData, setData: setAssignData, post: postAssign } = useForm({
        user_ids: []
    });

    const openAssign = (batch) => {
        setSelectedBatch(batch);
        setAssignData('user_ids', batch.users ? batch.users.map(u => u.id) : []);
        setIsAssignModalOpen(true);
    };

    const submitCreate = (e) => {
        e.preventDefault();
        postBatch(route('admin.batches.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                resetCreate();
            }
        });
    };

    const submitAssign = (e) => {
        e.preventDefault();
        postAssign(route('admin.batches.assign', selectedBatch.id), {
            onSuccess: () => setIsAssignModalOpen(false)
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-900 leading-tight">Batch Management</h2>}
        >
            <Head title="Batches" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">Batches & Groups</h1>
                            <p className="text-gray-500">Classify students into batches for easier management.</p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-600/80 text-brand-navy font-bold rounded-xl transition-all shadow-lg"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Create Batch
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {batches.map((batch) => (
                            <motion.div
                                key={batch.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white  border border-gray-200 rounded-[2rem] p-8 group hover:border-purple-300 transition-all"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-blue-600/10 rounded-2xl">
                                        <UserGroupIcon className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openAssign(batch)} className="p-2 bg-white/5 hover:bg-blue-600/20 hover:text-blue-600 rounded-lg transition-all text-gray-500">
                                            <UserPlusIcon className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-all text-gray-500">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900">{batch.name}</h3>
                                <p className="text-gray-500 text-sm mt-2">{batch.description || 'No description provided.'}</p>

                                <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
                                    <div className="flex -space-x-3 overflow-hidden">
                                        {[...Array(Math.min(batch.users_count, 5))].map((_, i) => (
                                            <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-brand-navy bg-slate-700"></div>
                                        ))}
                                        {batch.users_count > 5 && (
                                            <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-brand-navy bg-gray-100 text-[10px] text-gray-900 font-bold">
                                                +{batch.users_count - 5}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{batch.users_count} Members</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute inset-0 bg-black/80 "
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white border border-gray-200 rounded-xl w-full max-w-lg p-10 shadow-md"
                        >
                            <h2 className="text-3xl font-black text-gray-900 mb-2">New Batch</h2>
                            <p className="text-gray-500 mb-8">Start organizing your students.</p>

                            <form onSubmit={submitCreate} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Batch Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={createData.name}
                                        onChange={e => setCreateData('name', e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:border-brand-cyan transition-all outline-none"
                                        placeholder="e.g. Summer Interns 2026"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Description</label>
                                    <textarea
                                        value={createData.description}
                                        onChange={e => setCreateData('description', e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:border-brand-cyan transition-all outline-none min-h-[120px]"
                                        placeholder="Briefly describe the group..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-600/80 text-brand-navy font-black rounded-2xl transition-all shadow-xl"
                                >
                                    Create Batch
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}

                {isAssignModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsAssignModalOpen(false)}
                            className="absolute inset-0 bg-black/80 "
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-white border border-gray-200 rounded-xl w-full max-w-2xl p-10 shadow-md"
                        >
                            <h2 className="text-3xl font-black text-gray-900 mb-2 italic">Assign Members</h2>
                            <p className="text-gray-500 mb-8">Select students for "{selectedBatch?.name}"</p>

                            <form onSubmit={submitAssign} className="space-y-6">
                                <div className="max-h-[300px] overflow-y-auto pr-4 space-y-3 scrollbar-brand">
                                    {students.map(student => (
                                        <button
                                            key={student.id}
                                            type="button"
                                            onClick={() => {
                                                const current = assignData.user_ids;
                                                if (current.includes(student.id)) {
                                                    setAssignData('user_ids', current.filter(id => id !== student.id));
                                                } else {
                                                    setAssignData('user_ids', [...current, student.id]);
                                                }
                                            }}
                                            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${assignData.user_ids.includes(student.id)
                                                    ? 'bg-blue-600 border-brand-cyan text-brand-navy'
                                                    : 'bg-white/5 border-gray-200 text-gray-900 hover:border-gray-2000'
                                                }`}
                                        >
                                            <div className="text-left">
                                                <p className="font-bold">{student.name}</p>
                                                <p className={`text-[10px] font-bold uppercase tracking-widest ${assignData.user_ids.includes(student.id) ? 'text-brand-navy/60' : 'text-gray-500'}`}>
                                                    {student.email}
                                                </p>
                                            </div>
                                            {assignData.user_ids.includes(student.id) && <CheckIcon className="w-5 h-5" />}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-purple-600 hover:bg-purple-600/80 text-gray-900 font-black rounded-2xl transition-all shadow-xl"
                                >
                                    Sync Membership
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
