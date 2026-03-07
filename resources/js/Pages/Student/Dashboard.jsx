import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    BookOpenIcon,
    AcademicCapIcon,
    ClipboardDocumentListIcon,
    ArrowRightIcon,
    CheckBadgeIcon,
    ClockIcon,
    FireIcon
} from '@heroicons/react/24/outline';

export default function Dashboard({ auth, courses, recentAttempts, projectStats }) {
    const activeCourse = courses.find(c => c.progress_percentage > 0 && c.progress_percentage < 100) || courses[0];

    const stats = [
        {
            label: 'Courses Enrolled',
            value: courses.length,
            icon: BookOpenIcon,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'Quiz Mastery',
            value: recentAttempts.length > 0 ? `${Math.round(recentAttempts.reduce((acc, curr) => acc + parseFloat(curr.score), 0) / recentAttempts.length)}%` : '0%',
            icon: CheckBadgeIcon,
            color: 'text-green-600',
            bg: 'bg-green-50'
        },
        {
            label: 'Active Tasks',
            value: projectStats.active_tasks,
            icon: ClipboardDocumentListIcon,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Student Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* Hero Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="max-w-2xl">
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                    Welcome back, {auth.user.name.split(' ')[0]}
                                </h1>
                                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                    You have completed {courses.filter(c => c.progress_percentage === 100).length} courses so far.
                                    {activeCourse ? ` Currently, you're making progress in "${activeCourse.title}".` : ' Ready to start a new course?'}
                                </p>
                                {activeCourse && (
                                    <Link
                                        href={route('student.courses.show', activeCourse.id)}
                                        className="inline-flex items-center px-6 py-3 bg-blue-600 border border-transparent rounded-md font-semibold text-gray-900 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Resume Course
                                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                                    </Link>
                                )}
                            </div>

                            {activeCourse && (
                                <div className="w-full md:w-80 bg-gray-50 border border-gray-200 p-6 rounded-lg">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm font-medium text-gray-500">Course Progress</span>
                                        <span className="text-2xl font-bold text-blue-600">{activeCourse.progress_percentage}%</span>
                                    </div>
                                    <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden w-full">
                                        <div
                                            className="h-full bg-blue-600 rounded-full"
                                            style={{ width: `${activeCourse.progress_percentage}%` }}
                                        />
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                        <ClockIcon className="w-4 h-4" />
                                        Continue learning to unlock next milestone
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
                                <div className={`p-4 rounded-full ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Course List */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Your Courses</h3>
                                <Link href={route('student.courses.index')} className="text-sm font-medium text-blue-600 hover:text-blue-800">View All</Link>
                            </div>
                            <div className="space-y-4">
                                {courses.map(course => (
                                    <Link
                                        key={course.id}
                                        href={route('student.courses.show', course.id)}
                                        className="block bg-gray-50 border border-gray-100 hover:border-blue-300 rounded-lg p-4 transition duration-150 ease-in-out"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                                                {course.cover_image ? (
                                                    <img src={course.cover_image} alt={course.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                        <BookOpenIcon className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <h4 className="text-base font-medium text-gray-900 truncate pr-4">{course.title}</h4>
                                                <div className="mt-2 flex items-center gap-3">
                                                    <div className="flex-grow h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-600 rounded-full"
                                                            style={{ width: `${course.progress_percentage}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-600">{course.progress_percentage}%</span>
                                                </div>
                                            </div>
                                            <div className="text-gray-500">
                                                <ArrowRightIcon className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                {courses.length === 0 && (
                                    <p className="text-gray-500 text-sm py-4 text-center">You are not enrolled in any courses yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Quiz Performance</h3>

                            {recentAttempts.length > 0 ? (
                                <div className="space-y-6">
                                    {recentAttempts.map((attempt) => (
                                        <div key={attempt.id} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-1 h-full rounded ${attempt.score >= 50 ? 'bg-green-500' : 'bg-red-500'}`} />
                                            </div>
                                            <div className="pb-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-medium text-gray-500">{new Date(attempt.completed_at).toLocaleDateString()}</span>
                                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${attempt.score >= 50 ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/10'}`}>
                                                        {attempt.score >= 50 ? 'Passed' : 'Failed'}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">{attempt.quiz.title}</p>
                                                <p className="text-sm text-gray-600 mt-1">Score: {Math.round(attempt.score)}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <AcademicCapIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">No recent assessments</p>
                                </div>
                            )}

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <Link
                                    href={route('dashboard')}
                                    className="flex items-center justify-center w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition"
                                >
                                    View Full Report
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
