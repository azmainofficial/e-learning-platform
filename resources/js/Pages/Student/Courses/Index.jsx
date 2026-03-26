import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    MagnifyingGlassIcon,
    BookOpenIcon,
    ClockIcon,
    AcademicCapIcon,
} from '@heroicons/react/24/outline';

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ value = 0 }) {
    const pct = Math.min(Math.max(value, 0), 100);
    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-xs font-semibold text-gray-500 w-8 text-right">{pct}%</span>
        </div>
    );
}

// ─── Course Card (DataCamp style) ─────────────────────────────────────────────
function CourseCard({ course }) {
    const progress = course.progress_percentage ?? 0;
    const isStarted = progress > 0;

    return (
        <div className="bg-white border border-gray-200 rounded-xl flex flex-col hover:border-gray-300 hover:shadow-sm transition-all duration-150">
            {/* Card body */}
            <div className="p-5 flex-1 flex flex-col">
                {/* Label */}
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Course</p>

                {/* Title */}
                <h3 className="text-base font-bold text-gray-900 leading-snug mb-1.5 line-clamp-2">
                    {course.title}
                </h3>

                {/* Level badge */}
                <div className="flex items-center gap-1.5 mb-3">
                    <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    <span className="text-xs text-gray-500 font-medium">
                        {course.level ?? 'Beginner'}
                    </span>
                </div>

                {/* Description */}
                {course.description && (
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1 mb-4">
                        {course.description}
                    </p>
                )}

                {/* Meta row */}
                <div className="flex items-center gap-3 mt-auto mb-4">
                    {course.instructor ? (
                        <>
                            {course.instructor_avatar ? (
                                <img
                                    src={course.instructor_avatar}
                                    alt={course.instructor}
                                    className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                                />
                            ) : (
                                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-bold text-gray-500">
                                        {course.instructor.charAt(0)}
                                    </span>
                                </div>
                            )}
                            <div>
                                <p className="text-xs font-semibold text-gray-800 leading-none">{course.instructor}</p>
                                {course.instructor_title && (
                                    <p className="text-[11px] text-gray-400 mt-0.5">{course.instructor_title}</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <BookOpenIcon className="w-4 h-4" />
                            <span className="text-xs">{course.modules_count ?? 0} modules</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer: progress + CTA */}
            <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <ProgressBar value={progress} />
                    </div>
                    <Link
                        href={route('student.courses.show', course.id)}
                        className="flex-shrink-0 px-4 py-2 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors"
                    >
                        {isStarted ? 'Continue' : 'Start'}
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Index({ auth, courses = [] }) {
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    // Collect unique levels for filter pills
    const levels = useMemo(() => {
        const all = courses.map(c => c.level).filter(Boolean);
        return ['All', ...Array.from(new Set(all))];
    }, [courses]);

    // Filter courses
    const filtered = useMemo(() => {
        return courses.filter(c => {
            const matchesSearch = !search ||
                c.title?.toLowerCase().includes(search.toLowerCase()) ||
                c.description?.toLowerCase().includes(search.toLowerCase());

            const matchesFilter = activeFilter === 'All' || c.level === activeFilter;

            return matchesSearch && matchesFilter;
        });
    }, [courses, search, activeFilter]);

    return (
        <AuthenticatedLayout user={auth.user} header="My Courses">
            <Head title="My Courses" />

            <div className="max-w-6xl mx-auto space-y-6">

                {/* ── Dark hero banner ───────────────────────────────────────── */}
                <div className="relative bg-gray-900 rounded-2xl overflow-hidden px-8 py-8 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <h1 className="text-2xl font-bold text-white">Courses</h1>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                Hands-on learning
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                            Continue where you left off and master new skills. All of your
                            assigned courses are listed here—track your progress and keep going.
                        </p>
                    </div>

                    {/* Decorative icon cluster */}
                    <div className="hidden md:flex items-center justify-center w-36 h-28 relative flex-shrink-0 opacity-60">
                        <div className="absolute top-0 right-2 w-9 h-9 rounded-full bg-green-500/30 border border-green-500/50 flex items-center justify-center">
                            <AcademicCapIcon className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="absolute bottom-0 left-2 w-9 h-9 rounded-full bg-blue-500/30 border border-blue-500/50 flex items-center justify-center">
                            <BookOpenIcon className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold tracking-wide">LEARN</span>
                        </div>
                        {/* Connecting dashes */}
                        <svg className="absolute inset-0 w-full h-full" fill="none">
                            <circle cx="50%" cy="50%" r="38" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                        </svg>
                    </div>
                </div>

                {/* ── Filter pills ───────────────────────────────────────────── */}
                {levels.length > 1 && (
                    <div className="flex flex-wrap items-center gap-2">
                        {levels.map(level => (
                            <button
                                key={level}
                                onClick={() => setActiveFilter(level)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${activeFilter === level
                                        ? 'bg-gray-900 text-white border-gray-900'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Toolbar: count + search ────────────────────────────────── */}
                <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-gray-500 font-medium">
                        <span className="font-bold text-gray-900">{filtered.length}</span> Course{filtered.length !== 1 ? 's' : ''}
                    </p>

                    <div className="relative w-64">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                    </div>
                </div>

                {/* ── Course grid ────────────────────────────────────────────── */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                ) : (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            {search ? (
                                <MagnifyingGlassIcon className="w-6 h-6 text-gray-400" />
                            ) : (
                                <ClockIcon className="w-6 h-6 text-gray-400" />
                            )}
                        </div>
                        <p className="text-sm font-semibold text-gray-700">
                            {search ? `No results for "${search}"` : 'No courses assigned yet'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {search
                                ? 'Try a different search term'
                                : 'Check back soon or contact your admin'}
                        </p>
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
