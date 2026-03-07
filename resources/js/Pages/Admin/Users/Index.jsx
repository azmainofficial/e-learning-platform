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
    EnvelopeIcon
} from '@heroicons/react/24/outline';

export default function Index({ auth, users }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

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
        if (confirm('Permanently delete this user accounts?')) {
            useForm().delete(route('admin.users.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-900 leading-tight">Identity Management</h2>}
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 italic tracking-tight">Access Control</h1>
                            <p className="text-gray-500 mt-2">Manage student permissions and administrative roles.</p>
                        </div>
                        <button
                            onClick={() => { reset(); setEditingUser(null); setIsCreateModalOpen(true); }}
                            className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-600/80 text-brand-navy font-black rounded-2xl transition-all shadow-xl shadow-brand-cyan/20 transform hover:-translate-y-1"
                        >
                            <UserPlusIcon className="w-6 h-6" />
                            Register Member
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map((user) => (
                            <motion.div
                                key={user.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white  border border-gray-200 rounded-xl p-8 group hover:border-purple-300 transition-all border shadow-md overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 p-4">
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'super_admin' ? 'bg-purple-600 text-gray-900' :
                                            user.role === 'admin' ? 'bg-blue-600 text-brand-navy' :
                                                'bg-gray-800 text-gray-500'
                                        }`}>
                                        {user.role}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${user.is_approved ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{user.name}</h3>
                                        <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                                            <EnvelopeIcon className="w-3 h-3" />
                                            {user.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                    <div className="flex items-center gap-2">
                                        {user.is_approved ? (
                                            <span className="flex items-center gap-1 text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-lg">
                                                <ShieldCheckIcon className="w-4 h-4" /> Approved
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-lg">
                                                <NoSymbolIcon className="w-4 h-4" /> Pending
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingUser(user);
                                                setData({
                                                    role: user.role,
                                                    is_approved: user.is_approved
                                                });
                                                setIsCreateModalOpen(true);
                                            }}
                                            className="p-2 bg-white/5 hover:bg-blue-600 hover:text-brand-navy rounded-xl text-gray-500 transition-all"
                                        >
                                            <PencilSquareIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-xl text-gray-500 transition-all"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Create/Edit User Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateModalOpen(false)} className="absolute inset-0 bg-black/90 " />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white border border-gray-200 rounded-xl w-full max-w-xl p-12 shadow-md">
                            <h2 className="text-4xl font-black text-gray-900 italic mb-8">{editingUser ? 'Sync Identity' : 'Register Member'}</h2>
                            <form onSubmit={submit} className="space-y-6">
                                {!editingUser && (
                                    <>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 px-2">Full Legal Name</label>
                                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:border-brand-cyan transition-all outline-none" placeholder="First Last" required />
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 px-2">Primary Email</label>
                                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:border-brand-cyan transition-all outline-none" placeholder="member@mystrix.it" required />
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 px-2">Secure Code</label>
                                                <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:border-brand-cyan transition-all outline-none" required />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 px-2">Verify Code</label>
                                                <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:border-brand-cyan transition-all outline-none" required />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 px-2">Clearance Level</label>
                                        <select
                                            value={data.role}
                                            onChange={e => setData('role', e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:border-brand-cyan transition-all outline-none appearance-none"
                                        >
                                            <option value="student">Student</option>
                                            <option value="admin">Admin</option>
                                            <option value="super_admin">Super Admin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 px-2">Authorization Status</label>
                                        <div className="flex items-center gap-4 py-4 px-2">
                                            <button
                                                type="button"
                                                onClick={() => setData('is_approved', !data.is_approved)}
                                                className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors ${data.is_approved ? 'text-green-500' : 'text-gray-600'}`}
                                            >
                                                {data.is_approved ? <CheckCircleIcon className="w-6 h-6" /> : <div className="w-6 h-6 border-2 border-gray-600 rounded-full" />}
                                                Approved
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" disabled={processing} className="w-full py-5 bg-white/5 hover:bg-blue-600 text-gray-900 hover:text-brand-navy font-black text-lg rounded-xl transition-all border border-gray-200 mt-4 shadow-xl active:scale-95">
                                    {processing ? 'Processing...' : (editingUser ? 'Update Mission Access' : 'Initialize Member Identity')}
                                </button>

                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="w-full text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mt-4 hover:text-gray-500">Abort Operation</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
