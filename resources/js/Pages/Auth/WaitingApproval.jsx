import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function WaitingApproval() {
    return (
        <GuestLayout>
            <Head title="Pending Approval" />

            <div className="text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-20 h-20 bg-brand-yellow/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <svg className="w-10 h-10 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </motion.div>

                <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Hang Tight!</h2>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    Your account has been created successfully, but it requires **Admin Approval** before you can access the portal.
                    We'll let you know once you're cleared for takeoff.
                </p>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="w-full py-3 bg-purple-600 text-gray-900 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-brand-orange transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-brand-pink/20"
                >
                    Exit for Now
                </Link>
            </div>
        </GuestLayout>
    );
}
