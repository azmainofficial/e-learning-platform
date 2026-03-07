import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    PlusIcon,
    BookOpenIcon,
    PencilSquareIcon,
    TrashIcon,
    EyeIcon,
} from '@heroicons/react/24/outline';

export default function Index({ auth, courses }) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = (id) => {
        if (confirm('Delete this course and all its content? This cannot be undone.')) {
            destroy(route('admin.courses.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Courses">
            <Head title="Course Management" />

            <div className="max-w-6xl mx-auto space-y-5">

                {/* Page header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">All Courses</h1>
                        <p className="text-sm text-gray-400 mt-0.5">Build and manage your learning curriculum</p>
                    </div>
                    <Link
                        href={route('admin.courses.create')}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <PlusIcon className="w-4 h-4" />
                        New Course
                    </Link>
                </div>

                {/* Course grid */}
                {courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all group flex flex-col"
                            >
                                {/* Cover image / placeholder */}
                                <div className="h-40 bg-gray-50 relative overflow-hidden flex-shrink-0">
                                    {course.cover_image ? (
                                        <img
                                            src={course.cover_image}
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <BookOpenIcon className="w-12 h-12 text-gray-300" />
                                        </div>
                                    )}

                                    {/* Status badge */}
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${course.status === 'active'
                                            ? 'bg-green-50 text-green-600 border border-green-100'
                                            : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {course.status ?? 'draft'}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1">
                                        {course.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed flex-1">
                                        {course.description || 'No description provided.'}
                                    </p>

                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-xs text-gray-400 font-medium">
                                            {course.modules_count ?? 0} module{course.modules_count !== 1 ? 's' : ''}
                                        </span>

                                        <div className="flex items-center gap-1">
                                            <Link
                                                href={route('student.courses.show', course.id)}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                                                title="Preview as Student"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={route('admin.courses.edit', course.id)}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                title="Edit course"
                                            >
                                                <PencilSquareIcon className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(course.id)}
                                                disabled={processing}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                title="Delete course"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty state */
                    <div className="bg-white border border-gray-200 rounded-xl py-20 text-center">
                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <BookOpenIcon className="w-7 h-7 text-gray-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-700">No courses yet</h3>
                        <p className="text-xs text-gray-400 mt-1 mb-5">Start building your curriculum</p>
                        <Link
                            href={route('admin.courses.create')}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <PlusIcon className="w-3.5 h-3.5" />
                            Create First Course
                        </Link>
                    </div>
                )}

                {/* Footer count */}
                {courses.length > 0 && (
                    <p className="text-xs text-gray-400 text-right">
                        {courses.length} course{courses.length !== 1 ? 's' : ''} total
                    </p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
