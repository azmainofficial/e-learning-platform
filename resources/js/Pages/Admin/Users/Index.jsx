import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    UserPlusIcon,
    ShieldCheckIcon,
    NoSymbolIcon,
    TrashIcon,
    PencilSquareIcon,
    CheckCircleIcon,
    XMarkIcon,
    EnvelopeIcon,
    MagnifyingGlassIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';

export default function Index({ auth, users }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        email: '',
        role: 'student',
        password: '',
        password_confirmation: '',
        is_approved: true
    });

    const submit = (e) => {
        e.preventDefault();
        if (editingUser) {
            put(route('admin.users.update', editingUser.id), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    setEditingUser(null);
                    reset();
                }
            });
        } else {
            post(route('admin.users.store'), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset();
                }
            });
        }
    };

    const deleteUser = (id) => {
        if (confirm('Are you sure you want to permanently delete this user account?')) {
            useForm().delete(route('admin.users.destroy', id));
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const RoleBadge = ({ role }) => {
        const styles = {
            super_admin: 'bg-indigo-100 text-indigo-700',
            admin: 'bg-blue-100 text-blue-700',
            student: 'bg-slate-100 text-slate-700'
        };
        return (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles[role] || styles.student}`}>
                {role.replace('_', ' ')}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-lg text-gray-800">Identity Management</h2>}
        >
            <Head title="Users" />

            <div className="py-10 bg-gray-50 min-h-[calc(100vh-64px)]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 font-sans">Platform Users</h1>
                            <p className="text-sm text-gray-500 mt-1">Manage student enrollments and administrative permissions.</p>
                        </div>
                        <button
                            onClick={() => { reset(); setEditingUser(null); setIsCreateModalOpen(true); }}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-sm font-bold text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
                        >
                            <UserPlusIcon className="w-4 h-4" />
                            Initialize Account
                        </button>
                    </div>

                    {/* Filters Bar */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">
                                <FunnelIcon className="w-4 h-4" />
                                Filters
                            </button>
                        </div>
                    </div>

                    {/* Users Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all relative group"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold border ${user.is_approved ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setEditingUser(user);
                                                    setData({
                                                        name: user.name,
                                                        email: user.email,
                                                        role: user.role,
                                                        is_approved: user.is_approved
                                                    });
                                                    setIsCreateModalOpen(true);
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                            >
                                                <PencilSquareIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteUser(user.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 truncate">{user.name}</h3>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 font-medium">
                                            <EnvelopeIcon className="w-3.5 h-3.5" />
                                            {user.email}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                                        <RoleBadge role={user.role} />
                                        {user.is_approved ? (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-widest italic">
                                                <ShieldCheckIcon className="w-3.5 h-3.5" /> Verified
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-widest italic">
                                                <NoSymbolIcon className="w-3.5 h-3.5" /> Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
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
                                <h2 className="text-lg font-bold text-gray-900">{editingUser ? 'Synchronize Identity' : 'Account Onboarding'}</h2>
                                <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={submit} className="p-6 space-y-4">
                                {!editingUser && (
                                    <>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 italic">Legal Name</label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                                placeholder="e.g. Alex Graham"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 italic">Professional Email</label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                                placeholder="alex@example.com"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 italic">Secure Key</label>
                                                <input
                                                    type="password"
                                                    value={data.password}
                                                    onChange={e => setData('password', e.target.value)}
                                                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 italic">Verify Key</label>
                                                <input
                                                    type="password"
                                                    value={data.password_confirmation}
                                                    onChange={e => setData('password_confirmation', e.target.value)}
                                                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 italic">Clearance</label>
                                        <select
                                            value={data.role}
                                            onChange={e => setData('role', e.target.value)}
                                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                        >
                                            <option value="student">Student</option>
                                            <option value="admin">Admin</option>
                                            <option value="super_admin">Super Admin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 italic">Authorization</label>
                                        <button
                                            type="button"
                                            onClick={() => setData('is_approved', !data.is_approved)}
                                            className={`w-full flex items-center justify-center gap-2 h-9 px-3 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${data.is_approved
                                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                                    : 'bg-amber-50 border-amber-200 text-amber-600'
                                                }`}
                                        >
                                            {data.is_approved ? <CheckCircleIcon className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-amber-400" />}
                                            {data.is_approved ? 'Approved' : 'Pending'}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-2.5 bg-indigo-600 text-sm font-bold text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm active:translate-y-[1px]"
                                    >
                                        {processing ? 'Processing...' : (editingUser ? 'Synchronize Access' : 'Create Account')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="w-full text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600"
                                    >
                                        Abort Operation
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
