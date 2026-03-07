import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-50 relative overflow-hidden">
            <div className="z-10 mb-8 flex flex-col items-center">
                <Link href="/" className="flex items-center gap-3">
                    <ApplicationLogo className="w-12 h-12 text-blue-600" />
                    <div className="flex flex-col whitespace-nowrap">
                        <span className="font-bold text-2xl text-gray-900 leading-tight">StrixIT</span>
                        <span className="text-sm text-blue-600 font-medium">Academy</span>
                    </div>
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 p-8 bg-white border border-gray-200 shadow-sm sm:rounded-xl z-10">
                {children}
            </div>

            {/* Subtle bottom accent, Coursera/Datacamp style footer lines */}
            <div className="absolute bottom-0 w-full h-1 flex">
                <div className="flex-1 bg-blue-600" />
                <div className="flex-1 bg-green-500" />
                <div className="flex-1 bg-purple-600" />
            </div>
        </div>
    );
}
