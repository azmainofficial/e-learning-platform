import { Link, Head } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Head title="Welcome — StrixIT Academy" />

            {/* Top Nav */}
            <header className="border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <ApplicationLogo className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-gray-900 text-base">StrixIT Academy</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero */}
            <main className="flex-1 flex items-center justify-center">
                <div className="max-w-2xl mx-auto px-6 py-24 text-center">
                    {/* Badge */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
                        Internship Portal
                    </span>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
                        Learn, Build &amp;<br />
                        <span className="text-blue-600">Grow Your Career</span>
                    </h1>

                    <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-10 max-w-lg mx-auto">
                        The official student internship portal for YSTRIX IT Solutions.
                        Access your courses, track progress, and complete your training.
                    </p>

                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Open Dashboard
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ) : (
                        <Link
                            href={route('login')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Sign In to Portal
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    )}

                    {/* Feature pills */}
                    <div className="mt-14 flex flex-wrap justify-center gap-3">
                        {['Course Management', 'Live Assignments', 'Progress Tracking', 'Quiz &amp; Assessments', 'Project Work'].map((f) => (
                            <span key={f} className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                {f}
                            </span>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-5">
                <p className="text-center text-xs text-gray-400">
                    &copy; {new Date().getFullYear()} YSTRIX IT Solutions. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
