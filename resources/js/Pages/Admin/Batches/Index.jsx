import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    UserGroupIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    UserPlusIcon,
    XMarkIcon,
    CheckIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function Index({ auth, batches, students }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState(null);
    const [selectedBatch, setSelectedBatch] = useState(null);

    const { data: createData, setData: setCreateData, post: postBatch, put: putBatch, reset: resetCreate, processing: createProcessing } = useForm({
        name: '',
        description: ''
    });

    const { data: assignData, setData: setAssignData, post: postAssign, processing: assignProcessing } = useForm({
        user_ids: []
    });

    const openCreate = () => {
        setEditingBatch(null);
        resetCreate();
        setIsCreateModalOpen(true);
    };

    const openEdit = (batch) => {
        setEditingBatch(batch);
        setCreateData({
            name: batch.name,
            description: batch.description || ''
        });
        setIsCreateModalOpen(true);
    };

    const openAssign = (batch) => {
        setSelectedBatch(batch);
        setAssignData('user_ids', batch.users ? batch.users.map(u => u.id) : []);
        setIsAssignModalOpen(true);
    };

    const submitCreate = (e) => {
        e.preventDefault();
        if (editingBatch) {
            putBatch(route('admin.batches.update', editingBatch.id), {
                onSuccess: () => setIsCreateModalOpen(false)
            });
        } else {
            postBatch(route('admin.batches.store'), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    resetCreate();
                }
            });
        }
    };

    const submitAssign = (e) => {
        e.preventDefault();
        postAssign(route('admin.batches.assign', selectedBatch.id), {
            onSuccess: () => setIsAssignModalOpen(false)
        });
    };

    const deleteBatch = (id) => {
        if (confirm('Are you sure you want to delete this batch?')) {
            useForm().delete(route('admin.batches.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-lg text-gray-800">Batch Management</h2>}
        >
            <Head title="Batches" />

            <div className="py-10 bg-gray-50 min-h-[calc(100vh-64px)]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Batches & Cohorts</h1>
                            <p className="text-sm text-gray-500 mt-1">Organize your students into logical groups for progress tracking.</p>
                        </div>
                        <button
                            onClick={openCreate}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 border border-transparent rounded-lg font-semibold text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-sm"
                        >
                            <PlusIcon className="w-4 h-4" />
                            New Batch
                        </button>
                    </div>

                    {/* Batches List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {batches.map((batch) => (
                            <div
                                key={batch.id}
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all group"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                                            <UserGroupIcon className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEdit(batch)}
                                                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                                title="Edit"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteBatch(batch.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                title="Delete"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 truncate">{batch.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-[40px]">
                                        {batch.description || 'No description provided.'}
                                    </p>

                                    <div className="mt-6 flex items-center justify-between pt-5 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-2">
                                                {[...Array(Math.min(batch.users_count, 3))].map((_, i) => (
                                                    <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white" />
                                                ))}
                                                {batch.users_count > 3 && (
                                                    <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-500">
                                                        +{batch.users_count - 3}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs font-medium text-gray-500">{batch.users_count} students</span>
                                        </div>

                                        <button
                                            onClick={() => openAssign(batch)}
                                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                                        >
                                            <UserPlusIcon className="w-3.5 h-3.5" />
                                            Manage Members
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {batches.length === 0 && (
                            <div className="col-span-full bg-white border-2 border-dashed border-gray-200 rounded-xl py-16 px-4 text-center">
                                <UserGroupIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-sm font-semibold text-gray-900 italic">No batches found</h3>
                                <p className="text-xs text-gray-500 mt-1">Get started by creating your first student batch.</p>
                                <button
                                    onClick={openCreate}
                                    className="mt-6 text-xs font-bold text-indigo-600 hover:underline"
                                >
                                    + Add your first batch
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
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
                            className="relative bg-white border border-gray-200 rounded-xl w-full max-w-md shadow-2xl overflow-hidden font-sans"
                        >
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900">{editingBatch ? 'Edit Batch' : 'New Batch'}</h2>
                                <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={submitCreate} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider text-[10px]">Batch Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={createData.name}
                                        onChange={e => setCreateData('name', e.target.value)}
                                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                        placeholder="Enter batch name..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider text-[10px]">Description</label>
                                    <textarea
                                        value={createData.description}
                                        onChange={e => setCreateData('description', e.target.value)}
                                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none min-h-[100px] resize-none"
                                        placeholder="Add a brief description (optional)..."
                                    />
                                </div>
                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createProcessing}
                                        className="flex-1 px-4 py-2 bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {createProcessing ? 'Saving...' : editingBatch ? 'Update Batch' : 'Create Batch'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* Assign Students Modal */}
                {isAssignModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsAssignModalOpen(false)}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-white border border-gray-200 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Manage Membership</h2>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{selectedBatch?.name}</p>
                                </div>
                                <button onClick={() => setIsAssignModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="mb-4 relative">
                                    <input
                                        type="text"
                                        placeholder="Search students..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                    />
                                </div>

                                <form onSubmit={submitAssign} className="space-y-4">
                                    <div className="max-h-[320px] overflow-y-auto pr-2 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-200">
                                        {students.map(student => {
                                            const isSelected = assignData.user_ids.includes(student.id);
                                            return (
                                                <div
                                                    key={student.id}
                                                    onClick={() => {
                                                        const current = assignData.user_ids;
                                                        if (isSelected) {
                                                            setAssignData('user_ids', current.filter(id => id !== student.id));
                                                        } else {
                                                            setAssignData('user_ids', [...current, student.id]);
                                                        }
                                                    }}
                                                    className={`w-full flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${isSelected
                                                            ? 'bg-indigo-50 border-indigo-200'
                                                            : 'bg-white border-gray-100 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="min-w-0 pr-4">
                                                        <p className="text-sm font-semibold text-gray-900 truncate">{student.name}</p>
                                                        <p className="text-[10px] text-gray-500 truncate lowercase">{student.email}</p>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-200'
                                                        }`}>
                                                        {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="pt-4 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsAssignModalOpen(false)}
                                            className="flex-1 px-4 py-2 border border-gray-300 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={assignProcessing}
                                            className="flex-1 px-4 py-2 bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 rounded-lg shadow-sm"
                                        >
                                            {assignProcessing ? 'Saving...' : 'Save Membership'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
