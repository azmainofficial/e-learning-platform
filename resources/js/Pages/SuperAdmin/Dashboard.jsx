import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard({ auth, pendingUsers = [] }) {
    const { post } = useForm();

    const approveUser = (id) => {
        post(route('users.approve', id), {
            preserveScroll: true,
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
            header="System Master Dashboard"
        >
            <Head title="Super Admin Dashboard" />

            <div className="space-y-8">
                {/* Advanced Telemetry */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 p-10 rounded-xl bg-white text-gray-900 relative overflow-hidden shadow-md">
                        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/10 blur-[100px] -mb-40 -mr-40" />
                        <h3 className="text-3xl font-black tracking-tighter mb-8 tracking-tight flex items-center gap-4">
                            <span className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                            Core System Telemetry
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Uptime</p>
                                <p className="text-2xl font-black text-blue-600">99.98%</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">DB Latency</p>
                                <p className="text-2xl font-black text-purple-600">12ms</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Total Users</p>
                                <p className="text-2xl font-black text-brand-yellow">1,248</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Server Load</p>
                                <p className="text-2xl font-black text-brand-blue">14%</p>
                            </div>
                        </div>

                        <div className="mt-12 p-6 rounded-3xl bg-white/5 border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live Activity Log</span>
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Streaming</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex gap-4 font-mono text-[10px] text-gray-500 border-b border-gray-200 pb-2">
                                    <span className="text-purple-600">[SYSLOG]</span>
                                    <span>New registration from user_882@example.com</span>
                                </div>
                                <div className="flex gap-4 font-mono text-[10px] text-gray-500 border-b border-gray-200 pb-2">
                                    <span className="text-blue-600">[AUTH]</span>
                                    <span>Super Admin azmain logged in via 192.168.1.1</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-xl bg-white border border-gray-100 shadow-xl self-start">
                        <h4 className="text-xl font-black text-brand-navy mb-6 tracking-tight">Security Actions</h4>
                        <div className="space-y-4">
                            <button className="w-full p-4 rounded-2xl bg-white text-gray-900 font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-brand-navy/20 hover:scale-[1.02] active:scale-95 transition-all">
                                Lockdown System
                            </button>
                            <button className="w-full p-4 rounded-2xl bg-white border border-gray-200 text-brand-navy font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-50 transition-all">
                                Regenerate API Keys
                            </button>
                            <button className="w-full p-4 rounded-2xl bg-purple-600/5 text-purple-600 font-black text-[10px] uppercase tracking-[0.2em] border border-brand-pink/10">
                                Purge Audit Logs
                            </button>
                        </div>
                    </div>
                </div>

                {/* Shared Approval List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-xl bg-white border border-gray-100 shadow-xl overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-brand-navy tracking-tight">Access Control Center</h3>
                            <p className="text-sm text-gray-500 font-medium">Approve new admins or student interns.</p>
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
                                                <span className="inline-block px-2 py-0.5 rounded bg-purple-600/10 text-purple-600 text-[8px] font-black uppercase tracking-tighter mt-1">{user.role}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => approveUser(user.id)}
                                                className="px-5 py-2.5 bg-blue-600 text-brand-navy text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-blue hover:text-gray-900 transition-all shadow-md shadow-brand-cyan/10"
                                            >
                                                Grant Access
                                            </button>
                                            <button
                                                onClick={() => rejectUser(user.id)}
                                                className="px-5 py-2.5 bg-white text-purple-600 border border-brand-pink/20 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-purple-600 hover:text-gray-900 transition-all"
                                            >
                                                Deny
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="py-12 text-center">
                                    <p className="text-gray-500 font-bold text-sm">Clear skies. No pending access requests.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
