import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    UsersIcon,
    ClockIcon,
    CheckCircleIcon,
    ShieldCheckIcon,
    UserPlusIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const StatCard = ({ label, value, icon: Icon, trend, colorClass }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon className="w-5 h-5" />
            </div>
            {trend && (
                <span className={`text-xs font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {trend.value}
                </span>
            )}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
    </div>
);

export default function Dashboard({ auth, pendingUsers = [] }) {
    const { post } = useForm();

    const approveUser = (id) => {
        post(route('users.approve', id), { preserveScroll: true });
    };

    const rejectUser = (id) => {
        if (confirm('Are you sure you want to reject this application?')) {
            post(route('users.reject', id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-lg text-gray-800">Admin Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        label="Total Interns"
                        value="42"
                        icon={UsersIcon}
                        colorClass="bg-indigo-50 text-indigo-600"
                    />
                    <StatCard
                        label="Pending Approval"
                        value={pendingUsers.length}
                        icon={ClockIcon}
                        colorClass="bg-amber-50 text-amber-600"
                    />
                    <StatCard
                        label="System Status"
                        value="Optimal"
                        icon={CheckCircleIcon}
                        colorClass="bg-emerald-50 text-emerald-600"
                    />
                    <StatCard
                        label="Course Items"
                        value="120+"
                        icon={ShieldCheckIcon}
                        colorClass="bg-blue-50 text-blue-600"
                    />
                </div>

                {/* Access Requests Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Access Requests</h2>
                            <p className="text-sm text-gray-500 mt-0.5">Manage new student registrations pending verification.</p>
                        </div>
                        {pendingUsers.length > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                                {pendingUsers.length} Pending
                            </span>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <AnimatePresence mode="popLayout">
                                    {pendingUsers.length > 0 ? (
                                        pendingUsers.map((user) => (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="hover:bg-gray-50/50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold border border-gray-200">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                                            <div className="text-xs text-gray-500 font-medium">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-800 text-xs font-bold capitalize">
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => approveUser(user.id)}
                                                            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => rejectUser(user.id)}
                                                            className="px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:text-red-600 hover:border-red-200 rounded-lg transition-all"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                                                        <ShieldCheckIcon className="w-6 h-6 text-emerald-500" />
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-900 italic">No Pending Requests</p>
                                                    <p className="text-xs text-gray-500 mt-1">Your approval queue is currently empty.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
