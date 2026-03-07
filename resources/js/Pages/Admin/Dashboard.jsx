import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard({ auth, pendingUsers = [] }) {
    const { post } = useForm();

    const approveUser = (id) => {
        post(route('users.approve', id), {
            preserveScroll: true,
            onSuccess: () => alert('User approved!'),
        });
    };

    const rejectUser = (id) => {
        if (confirm('Are you sure you want to reject and delete this application?')) {
            post(route('users.reject', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header="Program Manager Dashboard"
        >
            <Head title="Admin Dashboard" />

            <div className="space-y-8">
                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-600/10 border border-brand-cyan/20">
                        <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Active Interns</p>
                        <p className="text-3xl font-black text-brand-navy">42</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-purple-600/10 border border-brand-pink/20">
                        <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Pending Approvals</p>
                        <p className="text-3xl font-black text-brand-navy">{pendingUsers.length}</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-brand-orange/10 border border-brand-orange/20">
                        <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest">System Health</p>
                        <p className="text-3xl font-black text-brand-navy">Stable</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-brand-yellow/10 border border-brand-yellow/20">
                        <p className="text-[10px] font-black text-brand-yellow uppercase tracking-widest">Resources</p>
                        <p className="text-3xl font-black text-brand-navy">120+</p>
                    </div>
                </div>

                {/* User Approval Interface */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-xl bg-white border border-gray-100 shadow-xl overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-brand-navy tracking-tight">Access Requests</h3>
                            <p className="text-sm text-gray-500 font-medium">New registrations requiring manual verification.</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-purple-600/10 flex items-center justify-center text-purple-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence>
                            {pendingUsers.length > 0 ? (
                                pendingUsers.map((user) => (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 100 }}
                                        className="p-5 rounded-2xl bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 border border-transparent hover:border-blue-300 transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-white text-gray-900 flex items-center justify-center font-black text-sm">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-brand-navy leading-none">{user.name}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{user.email}</p>
                                                <span className="inline-block px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue text-[8px] font-black uppercase tracking-tighter mt-1">{user.role}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => approveUser(user.id)}
                                                className="px-5 py-2.5 bg-blue-600 text-brand-navy text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-blue hover:text-gray-900 transition-all shadow-md shadow-brand-cyan/10"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => rejectUser(user.id)}
                                                className="px-5 py-2.5 bg-white text-purple-600 border border-brand-pink/20 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-purple-600 hover:text-gray-900 transition-all"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="py-12 text-center">
                                    <p className="text-gray-500 font-bold text-sm">No pending requests at the moment.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
