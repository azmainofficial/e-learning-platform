import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    RocketLaunchIcon,
    ClipboardDocumentListIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

export default function Index({ auth, projects }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-900 leading-tight">My Operations</h2>}
        >
            <Head title="My Projects" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <h1 className="text-4xl font-black text-gray-900 italic">Active Missions</h1>
                        <p className="text-gray-500 mt-2 text-lg">Tracks your real-world project involvement and collaboration.</p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {projects.map((project) => (
                            <motion.div
                                key={project.id}
                                variants={itemVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="bg-white  border border-gray-200 rounded-xl p-10 group hover:border-purple-300 transition-all flex flex-col"
                            >
                                <div className="h-16 w-16 bg-purple-600/10 rounded-3xl flex items-center justify-center text-purple-600 mb-8 group-hover:scale-110 transition-transform">
                                    <RocketLaunchIcon className="w-10 h-10" />
                                </div>

                                <h3 className="text-2xl font-black text-gray-900 mb-4 italic line-clamp-1">{project.name}</h3>
                                <p className="text-gray-500 text-sm mb-10 line-clamp-2 h-10">{project.description || 'Mission briefing classified.'}</p>

                                <div className="mt-auto flex items-center justify-between gap-4">
                                    <div className="text-center">
                                        <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Objectives</div>
                                        <div className="text-gray-900 font-black text-xl">{project.tasks_count}</div>
                                    </div>
                                    <Link
                                        href={route('student.projects.show', project.id)}
                                        className="flex-1 py-4 bg-purple-600 hover:bg-purple-600/80 text-gray-900 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-brand-pink/20 flex items-center justify-center gap-3"
                                    >
                                        Access Matrix
                                        <ArrowRightIcon className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}

                        {projects.length === 0 && (
                            <div className="col-span-full py-20 text-center bg-white/5 rounded-xl border border-dashed border-gray-200">
                                <ClipboardDocumentListIcon className="w-20 h-20 text-gray-800 mx-auto mb-6" />
                                <h2 className="text-2xl font-bold text-gray-900 italic italic">No Active Missions</h2>
                                <p className="text-gray-500 mt-2">You haven't been assigned to any operations yet.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
