import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpenIcon, TrophyIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, courses }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-900 leading-tight">My Learning Journey</h2>}
        >
            <Head title="My Courses" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-10">
                        <h1 className="text-4xl font-black text-gray-900">Your Assigned Courses</h1>
                        <p className="text-gray-500 mt-2">Continue where you left off and master new skills.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course) => (
                            <motion.div
                                key={course.id}
                                whileHover={{ y: -10 }}
                                className="bg-white  border border-gray-200 rounded-xl overflow-hidden group hover:border-blue-300 transition-all shadow-md shadow-black/40"
                            >
                                <div className="h-56 relative overflow-hidden">
                                    {course.cover_image ? (
                                        <img src={course.cover_image} alt={course.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <BookOpenIcon className="w-16 h-16 text-slate-700" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy to-transparent opacity-60"></div>
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${course.progress_percentage}%` }}
                                                    className="h-full bg-blue-600"
                                                />
                                            </div>
                                            <span className="text-[10px] font-black text-blue-600 tracking-widest">{course.progress_percentage}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors mb-4 line-clamp-1">
                                        {course.title}
                                    </h3>

                                    <div className="flex items-center gap-6 text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">
                                        <div className="flex items-center gap-1">
                                            <BookOpenIcon className="w-4 h-4" />
                                            {course.modules_count} Modules
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <TrophyIcon className="w-4 h-4 text-brand-yellow" />
                                            Certificate
                                        </div>
                                    </div>

                                    <Link
                                        href={route('student.courses.show', course.id)}
                                        className="w-full block text-center py-4 bg-white/5 hover:bg-blue-600 text-gray-900 hover:text-gray-900 font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all border border-gray-200 hover:border-blue-300 shadow-lg active:scale-95"
                                    >
                                        Jump In
                                    </Link>
                                </div>
                            </motion.div>
                        ))}

                        {courses.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <ClockIcon className="w-20 h-20 text-gray-700 mx-auto mb-6" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Courses Assigned Yet</h2>
                                <p className="text-gray-500">Check back soon or contact your admin.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
