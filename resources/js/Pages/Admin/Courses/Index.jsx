import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PlusIcon, BookOpenIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

export default function Index({ auth, courses }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this course and all its content?')) {
            destroy(route('admin.courses.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-900 leading-tight">Course Management</h2>}
        >
            <Head title="Courses" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">All Courses</h1>
                            <p className="text-gray-500 mt-1">Manage your learning modules and curriculum.</p>
                        </div>
                        <Link
                            href={route('admin.courses.create')}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-600/80 text-brand-navy font-bold rounded-xl transition-all shadow-lg shadow-brand-cyan/20 transform hover:-translate-y-1"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Create Course
                        </Link>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {courses.map((course) => (
                            <motion.div
                                key={course.id}
                                variants={itemVariants}
                                className="bg-white  border border-gray-200 rounded-2xl overflow-hidden hover:border-purple-300 transition-all group"
                            >
                                <div className="h-48 bg-gray-100 relative overflow-hidden">
                                    {course.cover_image ? (
                                        <img src={course.cover_image} alt={course.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                            <BookOpenIcon className="w-16 h-16" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${course.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-500'
                                            }`}>
                                            {course.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                        {course.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-2 line-clamp-2 h-10">
                                        {course.description || 'No description provided.'}
                                    </p>

                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            {course.modules_count} Modules
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                href={route('admin.courses.edit', course.id)}
                                                className="p-2 bg-white/5 hover:bg-purple-600/20 hover:text-purple-600 rounded-lg transition-all text-gray-500"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(course.id)}
                                                className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-all text-gray-500"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {courses.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <BookOpenIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900">No courses yet</h3>
                                <p className="text-gray-500">Time to build something amazing.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
