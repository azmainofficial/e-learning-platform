import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
            {/* Logo */}
            <div className="mb-8 text-center">
                <Link href="/" className="inline-flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                        <ApplicationLogo className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <span className="block text-lg font-bold text-gray-900 leading-none">StrixIT</span>
                        <span className="block text-xs text-gray-400 mt-0.5">Academy</span>
                    </div>
                </Link>
            </div>

            {/* Card */}
            <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                {children}
            </div>

            {/* Footer */}
            <p className="mt-8 text-xs text-gray-400">
                &copy; {new Date().getFullYear()} YSTRIX IT Solutions
            </p>
        </div>
    );
}
